'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, CheckCircle, Shield } from 'lucide-react';

type WatcherProfile = {
  total_bankroll: number;
  unit_size_percentage: number;
  risk_tolerance: string;
};

type WatcherGame = {
  id?: string;
  sport_key: string;
  home_team: string;
  away_team: string;
  best_home_odds: number;
  best_away_odds: number;
};

type SaveBetPayload = {
  team: string;
  amount: number;
  units: number;
};

interface SmartBetEntryProps {
  game: WatcherGame;
  userProfile: WatcherProfile;
  onSave: (bet: SaveBetPayload) => void;
}

export default function SmartBetEntry({ game, userProfile, onSave }: SmartBetEntryProps) {
  const [selectedTeam, setSelectedTeam] = useState(game.home_team);
  const [confidence, setConfidence] = useState(1); // 1 to 5 units
  const [calculatedWager, setCalculatedWager] = useState(0);

  useEffect(() => {
    const bankroll = Number(userProfile.total_bankroll);
    const unitPct = Number(userProfile.unit_size_percentage);
    const baseUnit = Number.isFinite(bankroll * unitPct) ? bankroll * unitPct : 0;
    setCalculatedWager(baseUnit * confidence);
  }, [confidence, userProfile]);

  const bankroll = Number(userProfile.total_bankroll);
  const riskPercent = useMemo(() => {
    if (!Number.isFinite(bankroll) || bankroll <= 0) {
      return 0;
    }
    return (calculatedWager / bankroll) * 100;
  }, [bankroll, calculatedWager]);

  const isHighRisk = riskPercent > 4;

  return (
    <div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">New Position</h3>
        <div
          className={`flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${
            isHighRisk ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          <Shield size={12} /> {isHighRisk ? 'Caution' : 'Shield Active'}
        </div>
      </div>

      <div className="mb-6 border-b border-slate-100 pb-6">
        <p className="mb-1 text-xs font-bold uppercase text-slate-400">{game.sport_key.replace('_', ' ')}</p>
        <div className="flex items-center justify-between">
          <span className="font-bold text-slate-800">
            {game.away_team} @ {game.home_team}
          </span>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3">
        {[
          { name: game.home_team, odds: game.best_home_odds },
          { name: game.away_team, odds: game.best_away_odds },
        ].map((team) => (
          <button
            key={team.name}
            onClick={() => setSelectedTeam(team.name)}
            className={`rounded-2xl border-2 p-4 text-left transition-all ${
              selectedTeam === team.name
                ? 'border-blue-600 bg-blue-50'
                : 'border-slate-100 bg-slate-50/50 hover:border-slate-200'
            }`}
            type="button"
          >
            <span className="text-[10px] font-bold uppercase text-slate-400">Selection</span>
            <div className="truncate font-bold text-slate-900">{team.name}</div>
            <div className="font-mono text-sm text-blue-600">
              {team.odds > 0 ? `+${team.odds}` : team.odds}
            </div>
          </button>
        ))}
      </div>

      <div className="mb-8">
        <div className="mb-3 flex items-end justify-between">
          <label className="text-sm font-bold text-slate-700">Watcher Confidence</label>
          <span className="text-xl font-mono font-bold text-blue-600">{confidence}u</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="5"
          step="0.5"
          value={confidence}
          onChange={(event) => setConfidence(parseFloat(event.target.value))}
          className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-100 accent-blue-600"
        />
        <div className="mt-2 flex justify-between px-1 text-[10px] font-bold uppercase text-slate-400">
          <span>Standard</span>
          <span>Max Risk</span>
        </div>
      </div>

      <div className="relative mb-6 overflow-hidden rounded-2xl bg-slate-900 p-6 text-white">
        <div className="relative z-10">
          <p className="mb-1 text-xs font-bold uppercase text-slate-400">Recommended Stake</p>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold">
              ${calculatedWager.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-sm italic text-slate-500">({confidence} units)</span>
          </div>
        </div>
        <Shield size={80} className="absolute -bottom-4 -right-4 text-slate-800 opacity-50" />
      </div>

      {isHighRisk && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50 p-4">
          <AlertTriangle className="shrink-0 text-amber-600" size={18} />
          <p className="text-xs text-amber-800">
            <strong>Risk Alert:</strong> This wager represents <strong>{riskPercent.toFixed(1)}%</strong> of your
            bankroll. This exceeds your {userProfile.risk_tolerance} strategy.
          </p>
        </div>
      )}

      <button
        onClick={() => onSave({ team: selectedTeam, amount: calculatedWager, units: confidence })}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 py-4 font-bold text-white shadow-lg shadow-blue-200 transition-transform hover:bg-blue-700 active:scale-95"
        type="button"
      >
        <CheckCircle size={20} /> Execute Position
      </button>
    </div>
  );
}
