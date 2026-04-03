import { Router, type IRouter } from "express";
import { calculateArb } from "../lib/engine";

const router: IRouter = Router();

router.get("/scan", async (req, res) => {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ODDS_API_KEY is not configured" });
    return;
  }

  const sport = (req.query.sport as string) || "upcoming";
  const region = "us";
  const markets = ["h2h", "spreads", "totals"];
  const arbOpportunities: ArbResult[] = [];

  try {
    for (const market of markets) {
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=${region}&markets=${market}&oddsFormat=decimal`
      );
      if (!response.ok) continue;

      const data = (await response.json()) as OddsEvent[];

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
        const keyA = market === "totals" ? keys.find((k) => k.startsWith("Over")) : keys[0];
        const keyB = market === "totals" ? keys.find((k) => k.startsWith("Under")) : keys[1];
        if (!keyA || !keyB) continue;

        const bestA = outcomeMap[keyA].reduce((a, b) => (b.price > a.price ? b : a));
        const bestB = outcomeMap[keyB].reduce((a, b) => (b.price > a.price ? b : a));

        const arb = calculateArb(bestA.price, bestB.price);
        if (!arb) continue;

        arbOpportunities.push({
          id: `${event.id}-${market}`,
          game: `${event.home_team} vs ${event.away_team}`,
          sport: event.sport_key,
          market: market === "h2h" ? "Moneyline" : market === "spreads" ? "Spread" : "Total (O/U)",
          profit: arb.profitPct,
          sideA: {
            team: event.home_team,
            bookie: bestA.bookie,
            odds: bestA.price,
            stake: arb.stakeA,
          },
          sideB: {
            team: event.away_team,
            bookie: bestB.bookie,
            odds: bestB.price,
            stake: arb.stakeB,
          },
          payout: arb.payout,
          guaranteedProfit: arb.guaranteedProfit,
        });
      }
    }

    arbOpportunities.sort((a, b) => b.profit - a.profit);
    res.json({ arbs: arbOpportunities });
  } catch (err) {
    req.log.error({ err }, "Scan route error");
    res.status(500).json({ error: "Scout failed to initialize" });
  }
});

interface ArbResult {
  id: string;
  game: string;
  sport: string;
  market: string;
  profit: number;
  sideA: { team: string; bookie: string; odds: number; stake: number };
  sideB: { team: string; bookie: string; odds: number; stake: number };
  payout: number;
  guaranteedProfit: number;
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
