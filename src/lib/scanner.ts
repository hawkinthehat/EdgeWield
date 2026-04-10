export interface EdgeBet {
  id: string;
  event: string;
  market: string; // e.g., "Moneyline"
  selection: string; // e.g., "Lakers"
  best_odds: number; // e.g., +110
  bookie: string; // e.g., "DraftKings"
  fair_odds: number; // e.g., -105 (The "True" price)
  edge_pct: number; // e.g., 4.2%
  win_prob: number; // e.g., 52.5%
}

export async function getScannerData(): Promise<EdgeBet[]> {
  // Mocking the "Sharp vs Public" calculation.
  return [
    {
      id: 'e1',
      event: 'Lakers vs Celtics',
      market: 'Moneyline',
      selection: 'Lakers',
      best_odds: 115,
      bookie: 'FanDuel',
      fair_odds: 102,
      edge_pct: 6.4,
      win_prob: 49.5,
    },
    {
      id: 'e2',
      event: 'Chiefs vs Bills',
      market: 'Spread (-3.5)',
      selection: 'Chiefs',
      best_odds: -105,
      bookie: 'DraftKings',
      fair_odds: -115,
      edge_pct: 4.1,
      win_prob: 54.2,
    },
  ];
}
