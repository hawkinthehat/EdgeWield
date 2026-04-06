'use client';

import { useState } from 'react';
import { finalizeOnboarding } from '@/app/actions/onboarding';

type OnboardingPayload = {
  bankroll: number;
  risk: 'Conservative' | 'Standard' | 'Aggressive';
  activeBookies: string[];
};

const DEFAULT_BOOKIES = ['fanduel', 'draftkings', 'betmgm'];
const BOOKIE_OPTIONS: Array<{ id: string; label: string }> = [
  { id: 'fanduel', label: 'FanDuel' },
  { id: 'draftkings', label: 'DraftKings' },
  { id: 'betmgm', label: 'BetMGM' },
  { id: 'caesars', label: 'Caesars' },
  { id: 'betrivers', label: 'BetRivers' },
];

export default function WatcherOnboarding() {
  const [bankroll, setBankroll] = useState<number>(1000);
  const [risk, setRisk] = useState<OnboardingPayload['risk']>('Standard');
  const [activeBookies, setActiveBookies] = useState<string[]>(DEFAULT_BOOKIES);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    setLoading(true);
    try {
      await finalizeOnboarding({ bankroll, risk, activeBookies });
      // Redirect happens in server action.
    } catch {
      alert('Onboarding failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-lg rounded-2xl border border-slate-800 bg-slate-950/60 p-6 text-white">
      <h2 className="text-xl font-black italic">Complete Your Watcher Setup</h2>
      <p className="mt-2 text-sm text-slate-400">
        Choose your bankroll and risk profile so unit sizing is calculated automatically.
      </p>

      <div className="mt-6 space-y-4">
        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Bankroll</span>
          <input
            type="number"
            min={1}
            value={bankroll}
            onChange={(event) => setBankroll(Number(event.target.value))}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-white"
          />
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Risk Profile</span>
          <select
            value={risk}
            onChange={(event) => setRisk(event.target.value as OnboardingPayload['risk'])}
            className="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-3 text-white"
          >
            <option value="Conservative">Conservative (0.5% units)</option>
            <option value="Standard">Standard (1.0% units)</option>
            <option value="Aggressive">Aggressive (2.0% units)</option>
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Bookies</span>
          <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
            {BOOKIE_OPTIONS.map(({ id, label }) => {
              const selected = activeBookies.includes(id);
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() =>
                    setActiveBookies((prev) =>
                      prev.includes(id) ? prev.filter((book) => book !== id) : [...prev, id],
                    )
                  }
                  className={`rounded-lg border px-3 py-2 text-left text-sm font-semibold transition-colors ${
                    selected
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-white'
                      : 'border-slate-700 bg-slate-900 text-slate-300'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </label>
      </div>

      <button
        type="button"
        onClick={handleComplete}
        disabled={loading}
        className="mt-6 w-full rounded-xl bg-blue-600 py-3 font-bold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? 'Saving...' : 'Complete Onboarding'}
      </button>
    </section>
  );
}
