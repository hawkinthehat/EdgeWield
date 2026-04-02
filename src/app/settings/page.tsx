'use client';

import { useEffect, useState } from 'react';
import { Wallet, Landmark, Save, CheckCircle } from 'lucide-react';
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

    const { error } = await supabase
      .from('profiles')
      .update({
        bankroll_size: profile.bankroll_size,
        active_bookies: profile.active_bookies,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user?.id ?? '');

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
    <div className="max-w-2xl">
      <h1 className="mb-8 text-3xl font-black italic uppercase">Terminal Settings</h1>
      {!supabase && (
        <p className="mb-6 rounded-xl border border-amber-400/40 bg-amber-400/10 p-4 text-xs font-bold uppercase tracking-wider text-amber-300">
          Missing Supabase environment variables. Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.
        </p>
      )}

      <div className="mb-6 rounded-[2.5rem] border border-edge-border bg-edge-slate/20 p-8">
        <div className="mb-6 flex items-center gap-3">
          <Wallet className="text-edge-emerald" size={20} />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Operational Capital</h3>
        </div>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-500">$</span>
          <input
            type="number"
            value={profile.bankroll_size}
            onChange={(event) =>
              setProfile((prev) => ({ ...prev, bankroll_size: Number(event.target.value) }))
            }
            className="w-full rounded-2xl border border-edge-border bg-edge-navy p-4 pl-10 text-xl font-black text-white outline-none focus:border-edge-emerald"
          />
        </div>
        <p className="mt-3 text-[10px] font-bold uppercase tracking-tighter text-slate-500">
          Used for Kelly Optimization & Unit Sizing
        </p>
      </div>

      <div className="mb-10 rounded-[2.5rem] border border-edge-border bg-edge-slate/20 p-8">
        <div className="mb-6 flex items-center gap-3">
          <Landmark className="text-edge-emerald" size={20} />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Available Sportsbooks</h3>
        </div>
        <div className="flex flex-wrap gap-3">
          {BOOKIE_OPTIONS.map((bookie) => (
            <button
              key={bookie}
              type="button"
              onClick={() => toggleBookie(bookie)}
              className={`rounded-xl border px-4 py-2 text-xs font-bold transition-all ${
                profile.active_bookies.includes(bookie)
                  ? 'border-edge-emerald bg-edge-emerald text-edge-navy'
                  : 'border-edge-border bg-edge-navy text-slate-500 hover:border-slate-400'
              }`}
            >
              {bookie}
            </button>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading || !supabase}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-white p-5 font-black uppercase tracking-widest text-edge-navy transition-all hover:bg-edge-emerald disabled:cursor-not-allowed disabled:opacity-60"
      >
        {saved ? <CheckCircle size={20} /> : <Save size={20} />}
        {saved ? 'Terminal Updated' : 'Save Configuration'}
      </button>
    </div>
  );
}
