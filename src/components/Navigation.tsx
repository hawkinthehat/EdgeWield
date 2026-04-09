'use client';

import type { ReactNode } from 'react';
import { Activity, BarChart3, Settings, ShieldAlert, Zap } from 'lucide-react';

export default function ActionRail() {
  return (
    <aside className="fixed bottom-0 left-0 top-0 z-50 flex w-20 flex-col items-center border-r border-white/5 bg-[#0D0F16] py-8">
      <div className="mb-12 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
        <Zap size={24} fill="white" />
      </div>

      <div className="flex-grow space-y-8">
        <NavItem icon={<BarChart3 size={20} />} label="Markets" active />
        <NavItem icon={<ShieldAlert size={20} />} label="Risk" />
        <NavItem icon={<Activity size={20} />} label="Pulse" />
      </div>

      <button className="p-3 text-slate-500 transition-colors hover:text-white">
        <Settings size={20} />
      </button>
    </aside>
  );
}

function NavItem({ icon, label, active = false }: { icon: ReactNode; label: string; active?: boolean }) {
  return (
    <button
      className={`group relative rounded-2xl p-4 transition-all ${active ? 'bg-blue-600/10 text-blue-500' : 'text-slate-500 hover:text-slate-200'}`}
    >
      {icon}
      {active && <div className="absolute bottom-1/4 left-0 top-1/4 w-1 rounded-r-full bg-blue-500" />}
      <div className="pointer-events-none absolute left-full ml-4 whitespace-nowrap rounded bg-slate-800 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-white opacity-0 transition-opacity group-hover:opacity-100">
        {label}
      </div>
    </button>
  );
}
