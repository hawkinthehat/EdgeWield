 'use client';

import { useEffect, useState } from 'react';
import {
  Activity,
  AlertTriangle,
  LayoutDashboard,
  Settings,
  ShieldCheck,
  Wallet,
  Zap,
} from 'lucide-react';
import Logo from '@/components/Logo';

type SidebarProps = {
  userBankroll?: number;
};

export default function Sidebar({ userBankroll = 1250 }: SidebarProps) {
  const [riskPauseState, setRiskPauseState] = useState<'idle' | 'gate' | 'active'>('idle');

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Terminal', active: true },
    { icon: <Zap size={20} />, label: 'Live Arbs', active: false },
    { icon: <ShieldCheck size={20} />, label: 'Bankroll', active: false },
    { icon: <Settings size={20} />, label: 'Filters', active: false },
  ];

  useEffect(() => {
    if (riskPauseState !== 'active') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setRiskPauseState('idle');
      console.log('Risk pause complete. Returning to terminal.');
    }, 20_000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [riskPauseState]);

  useEffect(() => {
    if (riskPauseState === 'idle') {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setRiskPauseState('idle');
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onEscape);
    };
  }, [riskPauseState]);

  return (
    <>
      {riskPauseState === 'gate' && (
        <div className="risk-gate-modal">
          <h1 className="mb-4 text-4xl font-black tracking-tight text-red-500">RISK CONTROL NOTICE</h1>
          <p className="max-w-[540px] text-sm font-semibold uppercase tracking-wide text-white/90 md:text-base">
            Focus mode uses brief full-screen visual cues for 20 seconds. Continue only if this
            display is safe for you.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              className="risk-gate-btn bg-slate-600 hover:bg-slate-500"
              onClick={() => setRiskPauseState('idle')}
            >
              Cancel
            </button>
            <button
              type="button"
              className="risk-gate-btn bg-blue-600 hover:bg-blue-500"
              onClick={() => setRiskPauseState('active')}
            >
              Start Focus Mode
            </button>
          </div>
        </div>
      )}

      {riskPauseState === 'active' && (
        <>
          <div className="alert-flash-active" />
          <div className="lock-border-pulse" />
        </>
      )}

      <aside className="fixed left-0 top-0 flex h-screen w-72 flex-col border-r border-slate-700 bg-zinc-950 p-6">
        <div className="mb-12">
          <Logo />
        </div>

        <div className="mb-8 rounded-2xl border border-slate-700 bg-zinc-900/80 p-4">
          <div className="mb-2 flex items-center gap-2 text-slate-400">
            <Wallet size={14} />
            <span className="text-[10px] font-bold uppercase tracking-widest">Active Bankroll</span>
          </div>
          <div className="text-2xl font-black italic text-white">${userBankroll.toLocaleString()}</div>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-edge-emerald" />
            <span className="text-[9px] font-bold uppercase tracking-tighter text-emerald-400">Odds Scanning...</span>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.label}
              type="button"
              className={`group flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
                item.active
                  ? 'border border-emerald-400/60 bg-emerald-400/20 text-emerald-300 shadow-lg shadow-emerald-400/10'
                  : 'border border-transparent text-slate-400 hover:border-slate-600 hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="border-t border-slate-700/70 pt-6">
          <div className="mb-4 flex items-center gap-3 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3">
            <Activity size={16} className="text-emerald-400" />
            <div className="flex flex-col">
              <span className="text-[10px] font-black leading-none text-white">SYSTEM OK</span>
              <span className="mt-1 text-[8px] uppercase tracking-widest text-slate-500">API Latency: 42ms</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setRiskPauseState('gate')}
            className="flex w-full items-center gap-4 rounded-xl px-4 py-3 text-sm font-bold text-red-400 transition-all hover:bg-red-400/10"
          >
            <AlertTriangle size={20} />
            Risk Pause
          </button>
        </div>
      </aside>
    </>
  );
}
