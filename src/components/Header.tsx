'use client';

import { Activity, Bell, ChevronDown } from 'lucide-react';
import Link from 'next/link';
import HawkLogo from '@/components/Icons/HawkLogo';

export default function Header() {
  return (
    <nav className="fixed left-0 right-0 top-0 z-30 h-20 border-b border-white/5 bg-slate-950/85 px-6 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between">
        {/* LOGO SECTION */}
        <div className="flex items-center gap-8">
          <Link href="/" aria-label="EdgeWield home" className="flex items-center gap-3">
            <HawkLogo className="h-8 w-auto" />
            <span className="text-xl font-black uppercase tracking-tight text-slate-100">EdgeWield</span>
          </Link>

          {/* SYSTEM STATUS (Middle Lean) */}
          <div className="hidden items-center gap-6 border-l border-white/10 px-6 lg:flex">
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#39FF14]" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Terminal Live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-[#4682B4]" />
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
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-slate-950 bg-[#39FF14]" />
          </button>

          <div className="flex items-center gap-3 border-l border-white/10 pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-[10px] font-black uppercase tracking-tighter text-white">Early Access</p>
              <p className="text-[9px] font-bold uppercase text-[#39FF14]">Tier: Sea Hawk</p>
            </div>
            <button className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 pr-3 transition-all hover:bg-white/10">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-[#4682B4] to-[#39FF14] font-black text-xs text-slate-950">
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
