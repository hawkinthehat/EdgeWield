'use client';

import { useMemo, useState } from 'react';
import { AlertTriangle, ChevronRight, Shield } from 'lucide-react';

type QuickAddGame = {
  home_team: string;
  away_team: string;
  commence_time: string | null;
};

interface QuickAddProps {
  game: QuickAddGame;
  userBankroll: number;
  unitSizePercent: number;
}

export default function QuickAddBet({ game, userBankroll, unitSizePercent }: QuickAddProps) {
  const [confidence, setConfidence] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState(game.home_team);

  const { recommendedWager, isHighRisk } = useMemo(() => {
    const baseUnit = userBankroll * unitSizePercent;
    const wager = baseUnit * confidence;
    return {
      recommendedWager: wager,
      isHighRisk: wager > userBankroll * 0.05,
    };
  }, [confidence, unitSizePercent, userBankroll]);

  const handlePlaceBet = async () => {
    console.log(`Saving ${confidence} unit bet on ${selectedTeam} for $${recommendedWager.toFixed(2)}`);
  };

  const kickoff = game.commence_time ? new Date(game.commence_time).toLocaleTimeString() : 'TBD';

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-6 text-white shadow-2xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h3 className="text-lg font-bold">
            {game.away_team} @ {game.home_team}
          </h3>
          <p className="text-sm text-slate-400">Kickoff: {kickoff}</p>
        </div>
        <Shield className={isHighRisk ? 'text-amber-500' : 'text-emerald-500'} />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3">
        {[game.home_team, game.away_team].map((team) => (
          <button
            key={team}
            type="button"
            onClick={() => setSelectedTeam(team)}
            className={`rounded-xl border-2 p-3 transition-all ${
              selectedTeam === team
                ? 'border-blue-500 bg-blue-500/10'
                : 'border-slate-700 bg-slate-800 hover:border-slate-500'
            }`}
          >
            <span className="block text-xs font-bold uppercase text-slate-400">Winner</span>
            <span className="font-bold">{team}</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="mb-2 flex justify-between">
          <span className="text-sm font-medium text-slate-400">Vantedge Confidence</span>
          <span className="text-sm font-bold text-blue-400">
            {confidence} Unit{confidence > 1 ? 's' : ''}
          </span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          step="0.5"
          value={confidence}
          onChange={(event) => setConfidence(Number.parseFloat(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-700 accent-blue-500"
        />
      </div>

      <div className="mb-6 rounded-xl border border-slate-700 bg-slate-800 p-4">
        <div className="flex items-center justify-between">
          <span className="text-slate-400">Recommended Wager:</span>
          <span className="font-mono text-2xl font-bold text-white">${recommendedWager.toFixed(2)}</span>
        </div>
        {isHighRisk && (
          <div className="mt-2 flex items-center gap-2 text-xs font-bold text-amber-500">
            <AlertTriangle size={14} /> EXCEEDS SAFE RISK PARAMETERS
          </div>
        )}
      </div>

      <button
        onClick={handlePlaceBet}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-4 font-bold text-white transition-all active:scale-95 hover:bg-blue-500"
        type="button"
      >
        Lock in Strategy <ChevronRight size={18} />
      </button>
    </div>
  );
}
