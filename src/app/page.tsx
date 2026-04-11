import OddsList from '@/components/OddsList';
import InjuryPulse from '@/components/InjuryPulse';
import Header from '@/components/Header';
import CheckoutButton from '@/components/CheckoutButton';
import MasterTerminal from '@/components/Terminal/MasterTerminal';
import { getInjuryPulse } from '@/lib/news';
import { ArrowRight, Crown, MousePointer2, ShieldCheck, Zap } from 'lucide-react';

export default async function BasicLaunchPage() {
  if (process.env.NEXT_PUBLIC_ENABLE_PRO_BYPASS === 'true') {
    return <MasterTerminal />;
  }

  const updates = await getInjuryPulse();

  return (
    <div className="bg-slate-950 text-[#E2E8F0] selection:bg-[#39FF14] selection:text-slate-950">
      <Header />

      <main className="pt-20">
        {/* 1. DYNAMIC HERO */}
        <section className="relative overflow-hidden px-6 pb-20 pt-32 text-center">
          {/* Animated Background Element */}
          <div className="absolute left-1/2 top-0 h-[600px] w-full -translate-x-1/2 rounded-full bg-[#39FF14]/10 opacity-50 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-5xl">
            <h1 className="mb-8 text-7xl font-black italic tracking-tighter text-white md:text-9xl">
              EDGE<span className="text-[#39FF14]">WIELD</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl font-bold uppercase leading-relaxed tracking-widest text-slate-400">
              Arbitrage math for serious sports bettors.
            </p>

            <div className="mb-20 flex flex-col items-center justify-center gap-4 md:flex-row">
              <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#39FF14] px-10 py-5 text-sm font-black uppercase text-slate-950 shadow-[0_0_30px_rgba(57,255,20,0.35)] transition-all hover:scale-105 hover:bg-[#63ff45] md:w-auto">
                Start Sea Hawk Access <Zap size={18} fill="currentColor" />
              </button>
              <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-sm font-black uppercase text-white transition-all hover:bg-white/10 md:w-auto">
                Live Terminal Preview
              </button>
            </div>
          </div>
        </section>

        {/* 2. THREE-TIER PRICING */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black italic uppercase text-white">Choose Your Plan</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Choose Kestrel, Red-Tail, or Sea Hawk</p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* KESTREL TIER */}
            <div className="group rounded-[3rem] border-2 border-white/5 bg-[#161821] p-10 transition-all hover:border-[#39FF14]/40">
              <div className="mb-8 flex items-start justify-between">
                <ShieldCheck className="text-slate-400 group-hover:text-[#39FF14]" size={40} />
                <span className="rounded-full border border-slate-600 bg-slate-800/80 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-slate-300">
                  Starter
                </span>
              </div>
              <h3 className="mb-2 text-3xl font-black italic uppercase tracking-tighter text-white">
                Kestrel
              </h3>
              <p className="mb-8 text-sm font-medium text-slate-400">Core access for disciplined scouting</p>
              <ul className="mb-10 space-y-4">
                {[
                  '15-Minute Market Sync',
                  'Moneyline & Spread Coverage',
                  'Standard Unit Calculator',
                  'Email Alerts (Delayed)',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <ShieldCheck size={16} className="text-slate-500" /> {f}
                  </li>
                ))}
              </ul>
              <p className="mb-6 text-4xl font-black text-white">
                $0.00<span className="text-lg text-slate-500">/mo</span>
              </p>
              <button
                type="button"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-5 text-xs font-black uppercase transition-all hover:bg-white/10"
              >
                Start Kestrel
              </button>
            </div>

            {/* RED-TAIL TIER */}
            <div className="group rounded-[3rem] border-2 border-white/5 bg-[#161821] p-10 transition-all hover:border-[#39FF14]/50">
              <div className="mb-8 flex items-start justify-between">
                <Zap className="text-[#39FF14] group-hover:animate-pulse" size={40} />
                <span className="rounded-full border border-[#39FF14]/20 bg-[#39FF14]/10 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-[#39FF14]">
                  Most Popular
                </span>
              </div>
              <h3 className="mb-2 text-3xl font-black italic uppercase tracking-tighter text-white">
                Red-Tail
              </h3>
              <p className="mb-8 text-sm font-medium text-slate-400">
                Full Market Access & Arb Detection
              </p>
              <ul className="mb-10 space-y-4">
                {[
                  '90-Second Instant Sync',
                  'Player Props & Alt Lines',
                  'Auto-Hedge Unit Execution',
                  'Direct Arb SMS Alerts',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <ShieldCheck size={16} className="text-[#39FF14]" /> {f}
                  </li>
                ))}
              </ul>
              <p className="mb-6 text-4xl font-black text-white">
                $19.99<span className="text-lg text-slate-500">/mo</span>
              </p>
              <CheckoutButton
                plan="scout"
                className="w-full rounded-2xl border border-white/10 bg-white/5 py-5 text-xs font-black uppercase transition-all hover:bg-white hover:text-black"
              >
                Select Red-Tail
              </CheckoutButton>
            </div>

            {/* SEA HAWK TIER */}
            <div className="relative overflow-hidden rounded-[3rem] border-2 border-[#39FF14] bg-gradient-to-b from-slate-700/40 to-transparent p-10 shadow-[0_0_50px_rgba(57,255,20,0.15)]">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Crown size={150} />
              </div>
              <div className="mb-8 flex items-start justify-between">
                <Crown className="text-[#39FF14]" size={40} />
                <span className="rounded-full bg-white px-4 py-1 text-[10px] font-black italic uppercase tracking-widest text-black">
                  Best Value
                </span>
              </div>
              <h3 className="mb-2 text-3xl font-black italic uppercase tracking-tighter text-white">
                Sea Hawk
              </h3>
              <p className="mb-8 text-sm font-medium text-slate-400">
                Player props and faster market signals
              </p>
              <ul className="mb-10 space-y-4">
                {[
                  'Sub-60s Market Sync',
                  'Priority Player Props Engine',
                  'Auto-Hedge Execution + Alerts',
                  'High-Frequency Arb Scanner',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-200">
                    <Zap size={16} className="fill-[#39FF14] text-[#39FF14]" /> {f}
                  </li>
                ))}
              </ul>
              <p className="mb-6 text-4xl font-black text-white">
                $99.99<span className="text-lg text-slate-500">/mo</span>
              </p>
              <CheckoutButton
                plan="pro"
                className="w-full rounded-2xl bg-[#39FF14] py-5 text-xs font-black uppercase text-slate-950 transition-all hover:shadow-[0_0_20px_#39FF14]"
              >
                Select Sea Hawk
              </CheckoutButton>
            </div>
          </div>

          {/* INSTITUTIONAL CTA */}
          <div className="flex flex-col items-center justify-between rounded-3xl border border-white/5 bg-white/5 p-8 text-center md:flex-row md:text-left">
            <div>
              <h4 className="font-black italic uppercase tracking-wider text-white">Need Team Access?</h4>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                Higher limits and high-volume API access
              </p>
            </div>
            <button className="mt-4 flex items-center gap-2 text-xs font-black uppercase text-[#39FF14] transition-all hover:gap-4 md:mt-0">
              Inquire for Access <ArrowRight size={16} />
            </button>
          </div>
        </section>

        {/* LIVE PREVIEW MODULES */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="mb-10 text-center">
            <h2 className="mb-3 text-3xl font-black italic uppercase text-white md:text-4xl">
              Live Terminal Preview
            </h2>
            <p className="mx-auto flex max-w-2xl items-center justify-center gap-2 text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
              <MousePointer2 size={14} className="text-[#39FF14]" />
              Interactive Edge Tools
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#10131b] p-6 shadow-[0_0_40px_rgba(57,255,20,0.08)]">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                Odds Watchlist
              </h3>
              <OddsList />
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#10131b] p-6 shadow-[0_0_40px_rgba(57,255,20,0.08)]">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                Injury Pulse Feed
              </h3>
              <InjuryPulse updates={updates} />
            </div>
          </div>
        </section>

        {/* 3. THE "FUN" FOOTER */}
        <footer className="border-t border-white/5 py-20 text-center">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em] text-slate-600">Built for disciplined betting</p>
          <div className="flex justify-center gap-6">
            {['Twitter', 'Discord', 'Updates'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs font-black uppercase text-slate-500 transition-colors hover:text-[#39FF14]"
              >
                {link}
              </a>
            ))}
          </div>
        </footer>
      </main>
    </div>
  );
}
