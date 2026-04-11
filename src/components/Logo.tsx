'use client';

import AppLogo from '@/components/Icons/AppLogo';

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="rounded-xl border border-[#39FF14]/35 bg-slate-900 p-2 shadow-[0_0_20px_rgba(57,255,20,0.22)]">
        <AppLogo className="h-8 w-8" />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-black uppercase italic tracking-tighter text-white">
          Edge<span className="text-edge-emerald not-italic">Wield</span>
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
          Pro-Grade Extraction
        </span>
      </div>
    </div>
  );
}
