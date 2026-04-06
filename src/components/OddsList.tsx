"use client";

import { useMemo, useState } from "react";
import { TrendingUp } from "lucide-react";
import SmartBetEntry, { type MarketGame, type SavedBet, type UserProfile } from "@/components/SmartBetEntry";

type ListedGame = MarketGame & { id: string };

const sampleGames: ListedGame[] = [
  {
    id: "game-1",
    sport_key: "basketball_nba",
    home_team: "Warriors",
    away_team: "Lakers",
    best_home_odds: -110,
    best_away_odds: 125,
  },
  {
    id: "game-2",
    sport_key: "americanfootball_nfl",
    home_team: "Bills",
    away_team: "Chiefs",
    best_home_odds: 135,
    best_away_odds: -145,
  },
  {
    id: "game-3",
    sport_key: "icehockey_nhl",
    home_team: "Bruins",
    away_team: "Rangers",
    best_home_odds: 105,
    best_away_odds: -118,
  },
];

const demoProfile: UserProfile = {
  total_bankroll: 4820.5,
  unit_size_percentage: 0.01,
  risk_tolerance: "balanced",
};

export default function OddsList() {
  const [activeGameId, setActiveGameId] = useState(sampleGames[0]?.id ?? "");
  const [savedBets, setSavedBets] = useState<SavedBet[]>([]);

  const activeGame = useMemo(
    () => sampleGames.find((game) => game.id === activeGameId) ?? sampleGames[0],
    [activeGameId],
  );

  const onSave = (bet: SavedBet) => {
    setSavedBets((current) => [bet, ...current].slice(0, 5));
  };

  if (!activeGame) {
    return null;
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
            Watchlist
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold uppercase text-emerald-700">
            <TrendingUp size={12} />
            Live
          </span>
        </div>
        <div className="space-y-2">
          {sampleGames.map((game) => {
            const selected = game.id === activeGame.id;
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => setActiveGameId(game.id)}
                className={`w-full rounded-xl border px-3 py-2 text-left transition-colors ${
                  selected
                    ? "border-blue-500 bg-blue-50"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100"
                }`}
              >
                <p className="text-[10px] font-bold uppercase text-slate-500">
                  {game.sport_key.replace("_", " ")}
                </p>
                <p className="text-sm font-semibold text-slate-800">
                  {game.away_team} @ {game.home_team}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <SmartBetEntry game={activeGame} userProfile={demoProfile} onSave={onSave} />

      {savedBets.length > 0 && (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-500">
            Recent Positions
          </p>
          <div className="space-y-1 text-sm text-slate-700">
            {savedBets.map((bet, index) => (
              <p key={`${bet.team}-${index}`}>
                {bet.team}: ${bet.amount.toFixed(2)} ({bet.units}u)
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
