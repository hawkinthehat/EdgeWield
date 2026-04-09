'use client';

import ActionRail from '@/components/Navigation';
import OddsList from '@/components/OddsList';
import InjuryPulse from '@/components/InjuryPulse';
import EdgeWieldLogo from '@/components/EdgeWieldLogo';
import { ShieldAlert } from 'lucide-react';

export default function LinearTerminal() {
  return (
    <div className="min-h-screen bg-[#0A0B10] pl-20 text-white">
      <ActionRail />

      <div className="flex min-h-screen flex-col">
        {/* 1. TOP STATS BAR */}
        <header className="flex h-20 items-center justify-between border-b border-white/5 bg-[#0A0B10]/50 px-10 backdrop-blur-xl">
          <div className="flex items-center gap-8">
            <EdgeWieldLogo />
            <h2 className="text-sm font-black uppercase italic tracking-[0.3em] text-white">
              Terminal <span className="text-blue-500">{'//'}</span> Live Market
            </h2>
          </div>

          <div className="flex gap-8">
            <StatMini label="Sync" value="18ms" color="text-blue-500" />
            <StatMini label="Uptime" value="99.9%" color="text-slate-400" />
          </div>
        </header>

        {/* 2. MAIN WORKSPACE */}
        <div className="flex flex-grow overflow-hidden">
          {/* CENTER FEED: CLEAN & WIDE */}
          <main className="custom-scrollbar flex-grow overflow-y-auto p-10">
            <div className="mx-auto max-w-4xl">
              <div className="mb-8 flex items-center justify-between">
                <h3 className="text-2xl font-black italic uppercase">Market Alpha</h3>
                <div className="flex gap-2">
                  {['All', 'NBA', 'NFL', 'MLB'].map((sport) => (
                    <button
                      key={sport}
                      className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase transition-all hover:bg-white hover:text-black"
                    >
                      {sport}
                    </button>
                  ))}
                </div>
              </div>

              {/* THE ACTUAL ODDS LIST */}
              <div className="space-y-4">
                <OddsList />
              </div>
            </div>
          </main>

          {/* RIGHT UTILITY RAIL (Injuries / Tools) */}
          <aside className="hidden w-80 border-l border-white/5 bg-[#0D0F16]/50 p-8 xl:block">
            <h4 className="mb-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
              <ShieldAlert size={14} /> Injury Pulse
            </h4>
            <InjuryPulse />
          </aside>
        </div>
      </div>
    </div>
  );
}

function StatMini({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="text-right">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600">{label}</p>
      <p className={`text-xs font-mono font-bold ${color}`}>{value}</p>
    </div>
  );
}
