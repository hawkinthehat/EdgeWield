import {
  DEFAULT_BANKROLL_CREDITS,
  DEFAULT_KELLY_CONFIG,
  HEARTBEAT_STALE_MS,
  type KellyOpportunity,
  isHeartbeatStale,
  scorePortfolio
} from "../../../lib/engine/kelly";

type SyncRequestBody = {
  heartbeatAt?: string;
  bankroll?: number;
  opportunities?: KellyOpportunity[];
};

const MOCK_OPPORTUNITIES: KellyOpportunity[] = [
  {
    id: "opp_btc_basis",
    symbol: "BTC",
    market: "basis",
    side: "long",
    probability: 0.58,
    decimalOdds: 1.93,
    minStake: 100
  },
  {
    id: "opp_eth_funding",
    symbol: "ETH",
    market: "funding",
    side: "short",
    probability: 0.55,
    decimalOdds: 1.88,
    minStake: 100
  },
  {
    id: "opp_sol_momo",
    symbol: "SOL",
    market: "momentum",
    side: "long",
    probability: 0.51,
    decimalOdds: 1.9,
    minStake: 100
  }
];

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json"
    }
  });

const parseBody = async (request: Request): Promise<SyncRequestBody> => {
  try {
    return (await request.json()) as SyncRequestBody;
  } catch {
    return {};
  }
};

export async function GET(request: Request) {
  const now = new Date();
  const url = new URL(request.url);
  const heartbeatAt = url.searchParams.get("heartbeatAt") ?? now.toISOString();
  const bankroll = Number(
    url.searchParams.get("bankroll") ?? DEFAULT_BANKROLL_CREDITS
  );

  const stale = isHeartbeatStale(heartbeatAt, now, HEARTBEAT_STALE_MS);
  const portfolio = scorePortfolio(MOCK_OPPORTUNITIES, {
    ...DEFAULT_KELLY_CONFIG,
    bankroll: Number.isFinite(bankroll) && bankroll > 0 ? bankroll : DEFAULT_BANKROLL_CREDITS
  });

  return json({
    ok: true,
    heartbeat: {
      now: now.toISOString(),
      heartbeatAt,
      stale,
      staleAfterMs: HEARTBEAT_STALE_MS
    },
    portfolio
  });
}

export async function POST(request: Request) {
  const now = new Date();
  const body = await parseBody(request);
  const heartbeatAt = body.heartbeatAt ?? now.toISOString();
  const stale = isHeartbeatStale(heartbeatAt, now, HEARTBEAT_STALE_MS);

  const bankroll =
    body.bankroll && Number.isFinite(body.bankroll) && body.bankroll > 0
      ? body.bankroll
      : DEFAULT_BANKROLL_CREDITS;

  const opportunities =
    Array.isArray(body.opportunities) && body.opportunities.length > 0
      ? body.opportunities
      : MOCK_OPPORTUNITIES;

  const portfolio = scorePortfolio(opportunities, {
    ...DEFAULT_KELLY_CONFIG,
    bankroll
  });

  return json(
    {
      ok: true,
      heartbeat: {
        now: now.toISOString(),
        heartbeatAt,
        stale,
        staleAfterMs: HEARTBEAT_STALE_MS
      },
      portfolio
    },
    stale ? 429 : 200
  );
}
