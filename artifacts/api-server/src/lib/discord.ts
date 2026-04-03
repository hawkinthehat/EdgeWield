interface ArbSignal {
  game: string;
  profit_percent: number;
  sideA: { bookie: string; odds: number };
  sideB: { bookie: string; odds: number };
}

export async function sendEdgeSignal(
  arb: ArbSignal,
  fairA: number,
  steamValue: number
): Promise<void> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const message = {
    username: "EdgeWield Terminal",
    avatar_url: "https://edgewield.com/logo.png",
    embeds: [
      {
        title: `🚨 HIGH PRIORITY ARB: ${arb.profit_percent}% PROFIT`,
        color: 0x10b981,
        fields: [
          { name: "Matchup",        value: `**${arb.game}**`,                       inline: false },
          { name: arb.sideA.bookie, value: `**${arb.sideA.odds}**`,                inline: true  },
          { name: arb.sideB.bookie, value: `**${arb.sideB.odds}**`,                inline: true  },
          { name: "Fair Value",     value: `${fairA}%`,                             inline: true  },
          { name: "Steam Velocity", value: `🔥 ${steamValue.toFixed(2)}%`,         inline: true  },
        ],
        footer: { text: "Wield the Edge • Pro Terminal Only" },
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(message),
    });

    if (!res.ok) {
      console.warn(`[discord] webhook returned ${res.status}`);
    }
  } catch (err) {
    console.warn("[discord] sendEdgeSignal failed silently", err);
  }
}

/**
 * Compute fair-value metrics for a two-way market.
 *
 * fairA / fairB — devigged implied probability for each side (%).
 *   e.g. fairA = 52.3 means the no-vig market prices side A at 52.3%.
 *
 * steam — effective market overround expressed as a percentage.
 *   Positive → book still has margin.
 *   Negative → combined implied < 100% (arb territory).
 *   < -1.5 means the market has slipped more than 1.5% into arb land,
 *   indicating sharp line movement ("steam") is pushing odds to extremes.
 */
export function computeFairValue(
  oddsA: number,
  oddsB: number
): { fairA: number; fairB: number; steam: number } {
  const impliedA = 1 / oddsA;
  const impliedB = 1 / oddsB;
  const total    = impliedA + impliedB;

  const fairA = parseFloat(((impliedA / total) * 100).toFixed(1));
  const fairB = parseFloat(((impliedB / total) * 100).toFixed(1));
  // steam: how far the market has moved below 100% (negative = hot arb)
  const steam = parseFloat(((total - 1) * 100).toFixed(2));

  return { fairA, fairB, steam };
}
