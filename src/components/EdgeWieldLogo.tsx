'use client';

import { Activity, Swords } from 'lucide-react';

export default function EdgeWieldLogo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
      <div className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-500/40 bg-slate-900 shadow-[0_0_20px_rgba(16,185,129,0.25)]">
        <Activity size={20} className="text-emerald-500/30" strokeWidth={1} />
        <Swords size={24} className="absolute text-white drop-shadow-md" strokeWidth={2.5} />
      </div>

      {!collapsed && (
        <div className="flex flex-col leading-none">
          <div className="flex items-center">
            <span className="text-2xl font-black uppercase tracking-tighter text-white">Edge</span>
            <span className="ml-0.5 text-2xl font-light uppercase tracking-tighter text-emerald-400">
              Wield
            </span>
          </div>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">
            Pro-Grade Extraction
          </span>
        </div>
      )}
    </div>
  );
}
