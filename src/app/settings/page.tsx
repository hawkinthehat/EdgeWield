'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const BOOKIE_OPTIONS = ['FanDuel', 'DraftKings', 'BetMGM', 'Caesars', 'Pinnacle', 'Bovada'] as const;

type ProfileState = {
  bankroll_size: number;
  active_bookies: string[];
};

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState<ProfileState>({
    bankroll_size: 1000,
    active_bookies: ['FanDuel'],
  });

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    async function getProfile() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('bankroll_size, active_bookies')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfile({
            bankroll_size: Number(data.bankroll_size ?? 1000),
            active_bookies: Array.isArray(data.active_bookies) ? data.active_bookies : ['FanDuel'],
          });
        }
      }

      setLoading(false);
    }

    void getProfile();
  }, []);

  const handleSave = async () => {
    if (!supabase) {
      return;
    }

    setLoading(true);
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { error } = await supabase
      .from('profiles')
      .update({
        bankroll_size: profile.bankroll_size,
        active_bookies: profile.active_bookies,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id);

    if (!error) {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }

    setLoading(false);
  };

  const toggleBookie = (name: string) => {
    setProfile((prev) => ({
      ...prev,
      active_bookies: prev.active_bookies.includes(name)
        ? prev.active_bookies.filter((bookie) => bookie !== name)
        : [...prev.active_bookies, name],
    }));
  };

  return (
    <div className="min-h-screen bg-app-bg p-6 lg:p-12">
      <div className="mx-auto mb-12 max-w-3xl">
        <h1 className="mb-1 text-sm font-bold tracking-widest text-accent-blue uppercase">EdgeWield Pro</h1>
        <p className="mb-8 text-xs italic text-text-dim">Institutional Vision. Predatory Precision.</p>
        <h2 className="border-b border-border-muted pb-4 text-3xl font-semibold">Terminal Settings</h2>
      </div>

      <div className="mx-auto max-w-3xl space-y-12">
        {!supabase && (
          <p className="rounded-md border border-border-muted bg-card-bg p-3 text-xs text-text-dim">
            Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and
            NEXT_PUBLIC_SUPABASE_ANON_KEY.
          </p>
        )}

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-text-main">
            <span className="opacity-50">💼</span>
            <h3 className="text-lg font-medium">Operational Capital</h3>
          </div>
          <div className="relative max-w-xs">
            <span className="absolute top-1/2 left-3 -translate-y-1/2 text-text-dim">$</span>
            <input
              type="number"
              value={profile.bankroll_size}
              onChange={(event) =>
                setProfile((prev) => ({ ...prev, bankroll_size: Number(event.target.value) }))
              }
              placeholder="1000"
              className="w-full rounded-md border border-border-muted bg-card-bg py-2 pl-8 pr-4 transition-colors focus:border-accent-blue focus:outline-none"
            />
          </div>
          <p className="text-xs text-text-dim">Used for Kelly Optimization & Unit Sizing</p>
        </section>

        <section className="space-y-4">
          <div className="flex items-center gap-2 text-text-main">
            <span className="opacity-50">🏛️</span>
            <h3 className="text-lg font-medium">Available Sportsbooks</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {BOOKIE_OPTIONS.map((bookie) => {
              const selected = profile.active_bookies.includes(bookie);

              return (
                <button
                  key={bookie}
                  type="button"
                  onClick={() => toggleBookie(bookie)}
                  className={`rounded-full border px-4 py-1.5 text-sm transition-all ${
                    selected
                      ? 'border-accent-blue text-accent-blue bg-card-bg'
                      : 'border-border-muted bg-card-bg hover:border-accent-blue hover:text-accent-blue'
                  }`}
                >
                  {bookie}
                </button>
              );
            })}
          </div>
        </section>

        <div className="border-t border-border-muted pt-6">
          <button
            type="button"
            onClick={handleSave}
            disabled={loading || !supabase}
            className="flex items-center gap-2 rounded bg-accent-blue px-6 py-2 font-medium text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <span>💾</span>
            {saved ? 'Configuration Saved' : 'Save Configuration'}
          </button>
        </div>
      </div>
    </div>
  );
}
