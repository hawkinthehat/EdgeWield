import { Router, type IRouter } from "express";
import { calculateArb } from "../lib/engine";
import { supabase } from "../lib/supabase";
import { sendEdgeSignal, computeFairValue } from "../lib/discord";

const router: IRouter = Router();

// UTC peak: high-volatility window wraps midnight (17:00–04:00 UTC)
const isPeak = (utcHour: number) => utcHour >= 17 || utcHour <= 4;

// Peak: live US primetime leagues  |  Standby: global daytime fillers
const PEAK_SPORTS   = ["basketball_nba", "icehockey_nhl", "americanfootball_nfl"];
const STANDBY_SPORTS = ["soccer_epl", "tennis_atp"];

// Peak scans h2h + totals; standby conserves credits with h2h only
const PEAK_MARKETS    = ["h2h", "totals"];
const STANDBY_MARKETS = ["h2h"];

// How often a manual ?force call can bypass cooldown
const COOLDOWN_MS = 60_000;

const MARKETS = ["h2h", "spreads", "totals"];

router.get("/sync", async (req, res) => {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ODDS_API_KEY not configured" });
    return;
  }

  if (!supabase) {
    res.status(503).json({ error: "Supabase not configured — set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY" });
    return;
  }

  const now = new Date();
  const utcHour = now.getUTCHours();
  const peak = isPeak(utcHour);
  const force = req.query.force === "true";
  const sports = peak ? PEAK_SPORTS : STANDBY_SPORTS;
  const markets = peak ? PEAK_MARKETS : STANDBY_MARKETS;

  // --- Cooldown gate: skip if we synced in the last 60s ---
  const { data: lastSyncRows } = await supabase
    .from("sync_logs")
    .select("created_at")
    .order("created_at", { ascending: false })
    .limit(1);

  if (!force && lastSyncRows && lastSyncRows.length > 0) {
    const msSinceLast = Date.now() - new Date(lastSyncRows[0].created_at).getTime();
    if (msSinceLast < COOLDOWN_MS) {
      res.json({
        skip: "Cooldown active",
        nextSyncInMs: COOLDOWN_MS - msSinceLast,
        mode: peak ? "PEAK" : "STANDBY",
      });
      return;
    }
  }

  const arbs: ArbRow[] = [];
  const region = "us";

  try {
    for (const sport of sports) {
      for (const market of markets) {
        const response = await fetch(
          `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=${region}&markets=${market}&oddsFormat=decimal`
        );
        if (!response.ok) continue;

        const data = (await response.json()) as OddsEvent[];
        const creditsRemaining = response.headers.get("x-requests-remaining");
        const creditsUsed = response.headers.get("x-requests-used");
        req.log.info({ sport, market, creditsRemaining, creditsUsed }, "Odds API call");

        for (const event of data) {
          const bookmakers = event.bookmakers ?? [];
          if (bookmakers.length < 2) continue;

          const outcomeMap: Record<string, { bookie: string; price: number }[]> = {};
          for (const bookie of bookmakers) {
            const mkt = bookie.markets?.find((m) => m.key === market);
            if (!mkt) continue;
            for (const outcome of mkt.outcomes) {
              const key = outcome.name + (outcome.point != null ? `_${outcome.point}` : "");
              if (!outcomeMap[key]) outcomeMap[key] = [];
              outcomeMap[key].push({ bookie: bookie.title, price: outcome.price });
            }
          }

          const keys = Object.keys(outcomeMap);
          const keyA = market === "totals" ? keys.find((k) => k.startsWith("Over"))  : keys[0];
          const keyB = market === "totals" ? keys.find((k) => k.startsWith("Under")) : keys[1];
          if (!keyA || !keyB) continue;

          const bestA = outcomeMap[keyA].reduce((a, b) => (b.price > a.price ? b : a));
          const bestB = outcomeMap[keyB].reduce((a, b) => (b.price > a.price ? b : a));
          const arb = calculateArb(bestA.price, bestB.price);
          if (!arb) continue;

          arbs.push({
            event_id: `${event.id}-${market}`,
            game_name: `${event.home_team} vs ${event.away_team}`,
            profit_percent: arb.profitPct,
            side_a: { team: event.home_team, bookie: bestA.bookie, odds: bestA.price, stake: arb.stakeA },
            side_b: { team: event.away_team, bookie: bestB.bookie, odds: bestB.price, stake: arb.stakeB },
          });

          // Fire Discord alert only if profit > 2.5% AND steam is dropping (hot line)
          const fair = computeFairValue(bestA.price, bestB.price);
          if (arb.profitPct > 2.5 && fair.steam < -1.5) {
            sendEdgeSignal(
              {
                game: `${event.home_team} vs ${event.away_team}`,
                profit_percent: arb.profitPct,
                sideA: { bookie: bestA.bookie, odds: bestA.price },
                sideB: { bookie: bestB.bookie, odds: bestB.price },
              },
              fair.fairA,
              fair.steam
            ).catch(() => {}); // silent — never block a sync over a Discord hiccup
          }
        }
      }
    }

    // Upsert: update existing rows by event_id, insert new ones — no full wipe
    if (arbs.length > 0) {
      const { error: upsertError } = await supabase
        .from("live_arbs")
        .upsert(arbs, { onConflict: "event_id" });

      if (upsertError) {
        req.log.error({ upsertError }, "Supabase upsert failed");
        res.status(500).json({ error: "Failed to persist arbs", detail: upsertError.message });
        return;
      }
    }

    // Log this sync so the cooldown gate works on the next call
    await supabase.from("sync_logs").insert({
      mode: peak ? "PEAK" : "STANDBY",
      arbs_found: arbs.length,
      sports_scanned: sports.length,
      utc_hour: utcHour,
    });

    res.json({
      synced: true,
      mode: peak ? "PEAK" : "STANDBY",
      utcHour,
      sportsScanned: sports,
      marketsScanned: markets,
      arbsFound: arbs.length,
      syncedAt: now.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Sync route error");
    res.status(500).json({ error: "Sync failed" });
  }
});

interface ArbRow {
  event_id: string;
  game_name: string;
  profit_percent: number;
  side_a: { team: string; bookie: string; odds: number; stake: number };
  side_b: { team: string; bookie: string; odds: number; stake: number };
}

interface OddsEvent {
  id: string;
  sport_key: string;
  home_team: string;
  away_team: string;
  bookmakers?: {
    key: string;
    title: string;
    markets?: {
      key: string;
      outcomes: { name: string; price: number; point?: number }[];
    }[];
  }[];
}

export default router;
