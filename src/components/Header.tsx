'use client';

import { Bell, Activity, ChevronDown } from 'lucide-react';

export default function Header() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-50 h-20 border-b border-white/5 bg-[#0A0B10]/80 px-6 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between">
        {/* LOGO SECTION */}
        <div className="flex items-center gap-8">
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-black uppercase italic tracking-tighter text-white">
              Edge<span className="text-blue-500 not-italic">Wield</span>
            </span>
            <span className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-500">
              Pro-Grade Extraction
            </span>
          </div>

          {/* SYSTEM STATUS (Middle Lean) */}
          <div className="hidden items-center gap-6 border-l border-white/10 px-6 lg:flex">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Terminal Live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-blue-500/50" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Latency: 18ms
              </span>
            </div>
          </div>
        </div>

        {/* USER CONTROLS */}
        <div className="flex items-center gap-4">
          <button className="relative rounded-xl border border-white/10 bg-white/5 p-2.5 transition-all hover:bg-white/10">
            <Bell size={18} className="text-slate-400" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#0A0B10] bg-blue-500" />
          </button>

          <div className="flex items-center gap-3 border-l border-white/10 pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-black uppercase tracking-tighter text-white">Alpha Tester</p>
              <p className="text-[9px] font-bold uppercase text-blue-500">Tier: Pro+</p>
            </div>
            <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 pr-3 transition-all hover:bg-white/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-blue-400 text-xs font-black text-white">
                JD
              </div>
              <ChevronDown size={14} className="text-slate-500" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
