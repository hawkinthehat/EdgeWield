import OddsList from '@/components/OddsList';
import InjuryPulse from '@/components/InjuryPulse';
import WaitlistForm from '@/components/WaitlistForm';
import { getInjuryPulse } from '@/lib/news';
import { Zap, Shield, BarChart3, ChevronDown } from 'lucide-react';

export default async function LandingPage() {
  const injuries = await getInjuryPulse();

  return (
    <div className="bg-[#020203] text-white selection:bg-edge-emerald selection:text-black">
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-edge-emerald/10 via-transparent to-transparent opacity-50" />

        <div className="relative z-10 max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-edge-emerald opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-edge-emerald"></span>
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Alpha Access v5.3 Live
            </span>
          </div>

          <h1 className="mb-6 text-6xl font-black italic leading-none tracking-tighter md:text-8xl">
            STOP BETTING.
            <br />
            <span className="text-edge-emerald shadow-emerald-500/20">START WIELDING.</span>
          </h1>

          <p className="mx-auto mb-10 max-w-2xl text-lg font-medium leading-relaxed text-slate-400 md:text-xl">
            The institutional-grade terminal that detects market inefficiencies before the books
            can move the lines.
          </p>

          <WaitlistForm />

          <ChevronDown className="mx-auto animate-bounce text-slate-600" size={32} />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-24 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-edge-emerald/30">
            <BarChart3 className="mb-4 text-edge-emerald" size={32} />
            <h3 className="mb-2 text-xl font-black italic uppercase">90s Pulse</h3>
            <p className="text-sm font-medium text-slate-500">
              Scanning 15+ global sportsbooks every 90 seconds. If an edge exists, we find it.
            </p>
          </div>
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-edge-emerald/30">
            <Shield className="mb-4 text-edge-emerald" size={32} />
            <h3 className="mb-2 text-xl font-black italic uppercase">Injury Lead</h3>
            <p className="text-sm font-medium text-slate-500">
              Our proprietary pulse detects player status changes before the lines adjust. Trade
              the news.
            </p>
          </div>
          <div className="rounded-[2.5rem] border border-white/10 bg-white/[0.03] p-8 transition-all hover:border-edge-emerald/30">
            <Zap className="mb-4 text-edge-emerald" size={32} />
            <h3 className="mb-2 text-xl font-black italic uppercase">EV+ Arbitrage</h3>
            <p className="text-sm font-medium text-slate-500">
              Risk-free math. Lock in profits by playing books against each other in real-time.
            </p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-white/[0.02] p-8 shadow-2xl md:p-12">
          <div className="pointer-events-none absolute right-0 top-0 select-none p-8 text-[150px] font-black italic text-white/[0.02]">
            LIVE_FEED
          </div>
          <div className="mb-12 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-edge-emerald/20">
              <BarChart3 className="text-edge-emerald" size={24} />
            </div>
            <div>
              <h2 className="text-3xl font-black italic uppercase">The Terminal</h2>
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
                Real-Time Alpha Capture
              </p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              <OddsList />
            </div>
            <div className="col-span-12 space-y-6 lg:col-span-4">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
                <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-edge-emerald">
                  Injury Pulse
                </h4>
                <InjuryPulse updates={injuries} />
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-24 text-center">
        <h2 className="mb-8 text-4xl font-black italic uppercase">
          The House Doesn't Have to Win.
        </h2>
        <button className="rounded-2xl bg-white px-12 py-5 text-sm font-black uppercase text-black transition-all hover:bg-edge-emerald">
          Secure Your Spot in Alpha
        </button>
      </footer>
    </div>
  );
}
