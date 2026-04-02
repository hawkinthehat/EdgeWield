import { Router, type IRouter } from "express";
import { calculateArb, type MarketGap } from "../lib/engine";

const router: IRouter = Router();

const MARKETS = ["h2h", "spreads", "totals"];

router.get("/odds/edges", async (req, res) => {
  const apiKey = process.env.ODDS_API_KEY;
  if (!apiKey) {
    res.status(500).json({ error: "ODDS_API_KEY is not configured" });
    return;
  }

  const sport = (req.query.sport as string) || "upcoming";
  const region = "us";
  const gaps: MarketGap[] = [];

  try {
    for (const market of MARKETS) {
      const response = await fetch(
        `https://api.the-odds-api.com/v4/sports/${sport}/odds/?apiKey=${apiKey}&regions=${region}&markets=${market}&oddsFormat=decimal`
      );

      if (!response.ok) {
        req.log.warn({ status: response.status, market }, "Odds API returned an error for market");
        continue;
      }

      const data = (await response.json()) as OddsApiEvent[];

      for (const event of data) {
        const bookmakers = event.bookmakers ?? [];
        if (bookmakers.length < 2) continue;

        const outcomeMap: Record<string, { odds: number; bookie: string }[]> = {};

        for (const bookie of bookmakers) {
          const mkt = bookie.markets?.find((m) => m.key === market);
          if (!mkt) continue;
          for (const outcome of mkt.outcomes) {
            const key = outcome.name + (outcome.point != null ? `_${outcome.point}` : "");
            if (!outcomeMap[key]) outcomeMap[key] = [];
            outcomeMap[key].push({ odds: outcome.price, bookie: bookie.title });
          }
        }

        const outcomeNames = Object.keys(outcomeMap);
        if (market === "h2h" || market === "spreads") {
          if (outcomeNames.length < 2) continue;
          const [nameA, nameB] = outcomeNames;
          const bestA = outcomeMap[nameA].reduce((a, b) => (a.odds > b.odds ? a : b));
          const bestB = outcomeMap[nameB].reduce((a, b) => (a.odds > b.odds ? a : b));

          const arb = calculateArb(bestA.odds, bestB.odds);
          if (arb) {
            gaps.push({
              event: `${event.home_team} vs ${event.away_team}`,
              teamA: event.home_team,
              teamB: event.away_team,
              sportKey: event.sport_key,
              marketType: market === "h2h" ? "Moneyline" : "Spread",
              profit: arb.profitPct,
              bookieA: bestA.bookie,
              oddsA: bestA.odds,
              bookieB: bestB.bookie,
              oddsB: bestB.odds,
              stakeA: arb.stakeA,
              stakeB: arb.stakeB,
              guaranteedProfit: arb.guaranteedProfit,
              payout: arb.payout,
            });
          }
        } else if (market === "totals") {
          const overKey = outcomeNames.find((n) => n.startsWith("Over"));
          const underKey = outcomeNames.find((n) => n.startsWith("Under"));
          if (!overKey || !underKey) continue;

          const bestOver = outcomeMap[overKey].reduce((a, b) => (a.odds > b.odds ? a : b));
          const bestUnder = outcomeMap[underKey].reduce((a, b) => (a.odds > b.odds ? a : b));

          const arb = calculateArb(bestOver.odds, bestUnder.odds);
          if (arb) {
            gaps.push({
              event: `${event.home_team} vs ${event.away_team}`,
              teamA: event.home_team,
              teamB: event.away_team,
              sportKey: event.sport_key,
              marketType: "Total (O/U)",
              profit: arb.profitPct,
              bookieA: bestOver.bookie,
              oddsA: bestOver.odds,
              bookieB: bestUnder.bookie,
              oddsB: bestUnder.odds,
              stakeA: arb.stakeA,
              stakeB: arb.stakeB,
              guaranteedProfit: arb.guaranteedProfit,
              payout: arb.payout,
            });
          }
        }
      }
    }

    gaps.sort((a, b) => b.profit - a.profit);
    res.json(gaps);
  } catch (err) {
    req.log.error({ err }, "Error scanning for edges");
    res.status(500).json({ error: "Failed to scan for edges" });
  }
});

interface OddsApiEvent {
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
