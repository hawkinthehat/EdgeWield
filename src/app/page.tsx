import OddsList from '@/components/OddsList';
import InjuryPulse from '@/components/InjuryPulse';
import { getInjuryPulse } from '@/lib/news';
import { Cpu, ShieldCheck, BarChart3, Bell } from 'lucide-react';

export default async function NewTerminal() {
  const injuries = await getInjuryPulse();

  return (
    <div className="relative min-h-screen p-4 md:p-8">
      <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <div>
          <div className="mb-1 flex items-center gap-3">
            <div className="h-2 w-2 animate-pulse rounded-full bg-edge-emerald shadow-[0_0_10px_#10b981]" />
            <h1 className="text-2xl font-black italic tracking-tighter text-white">EDGEWIELD // ALPHA_v5.3</h1>
          </div>
          <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-slate-500">
            Institutional Grade Market Intelligence
          </p>
        </div>

        <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl">
          <div className="border-r border-white/10 px-4 py-2">
            <p className="mb-1 text-[9px] font-mono uppercase text-slate-500">API Latency</p>
            <p className="text-xs font-mono font-bold text-edge-emerald">24ms</p>
          </div>
          <button type="button" className="rounded-xl p-2 transition-all hover:bg-white/10">
            <Bell size={18} className="text-slate-400" />
          </button>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-edge-emerald to-blue-600 font-black text-black">
            JD
          </div>
        </div>
      </header>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 space-y-6 lg:col-span-8">
          <div className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-1">
            <div className="flex items-center justify-between p-6 pb-2">
              <h3 className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white">
                <BarChart3 size={14} className="text-edge-emerald" /> Live Market Arbitrage
              </h3>
              <div className="flex gap-2">
                <span className="rounded-full border border-edge-emerald/20 bg-edge-emerald/10 px-3 py-1 text-[9px] font-black text-edge-emerald">
                  90s REFRESH
                </span>
              </div>
            </div>

            <div className="p-4">
              <OddsList />
            </div>
          </div>
        </div>

        <div className="col-span-12 space-y-6 lg:col-span-4">
          <div className="relative overflow-hidden rounded-[2.5rem] border border-edge-emerald/20 bg-gradient-to-br from-edge-emerald/20 via-transparent to-transparent p-8">
            <Cpu className="absolute -right-4 -top-4 text-edge-emerald/10" size={120} />
            <p className="mb-4 text-[10px] font-mono uppercase tracking-widest text-edge-emerald">Account Efficiency</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-3xl font-black italic text-white">+14.2%</p>
                <p className="text-[9px] font-bold uppercase text-slate-500">Monthly ROI</p>
              </div>
              <div>
                <p className="text-3xl font-black italic text-white">1.04</p>
                <p className="text-[9px] font-bold uppercase text-slate-500">Profit Factor</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-6">
            <h3 className="mb-6 flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-white">
              <ShieldCheck size={14} className="text-red-500" /> Injury Pulse
            </h3>
            <InjuryPulse updates={injuries} />
          </div>
        </div>
      </div>
    </div>
  );
}
