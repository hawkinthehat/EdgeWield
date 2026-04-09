import OddsList from '@/components/OddsList';
import InjuryPulse from '@/components/InjuryPulse';
import Header from '@/components/Header';
import { getInjuryPulse } from '@/lib/news';
import { ArrowRight, Crown, MousePointer2, ShieldCheck, Zap } from 'lucide-react';

export default async function BasicLaunchPage() {
  const updates = await getInjuryPulse();

  return (
    <div className="bg-[#0A0B10] text-[#E2E8F0] selection:bg-[#3B82F6] selection:text-white">
      <Header />

      <main className="pt-20">
        {/* 1. DYNAMIC HERO */}
        <section className="relative overflow-hidden px-6 pb-20 pt-32 text-center">
          {/* Animated Background Element */}
          <div className="absolute left-1/2 top-0 h-[600px] w-full -translate-x-1/2 rounded-full bg-blue-600/10 opacity-50 blur-[120px]" />

          <div className="relative z-10 mx-auto max-w-5xl">
            <h1 className="mb-8 text-7xl font-black italic tracking-tighter text-white md:text-9xl">
              EDGE<span className="text-blue-500">WIELD</span>
            </h1>
            <p className="mx-auto mb-10 max-w-2xl text-xl font-bold uppercase leading-relaxed tracking-widest text-slate-400">
              Institutional Math for the Every Day Sharp.
            </p>

            <div className="mb-20 flex flex-col items-center justify-center gap-4 md:flex-row">
              <button className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 px-10 py-5 text-sm font-black uppercase text-white shadow-[0_0_30px_rgba(59,130,246,0.4)] transition-all hover:scale-105 hover:bg-blue-500 md:w-auto">
                Secure Pro Access <Zap size={18} fill="currentColor" />
              </button>
              <button className="w-full rounded-2xl border border-white/10 bg-white/5 px-10 py-5 text-sm font-black uppercase text-white transition-all hover:bg-white/10 md:w-auto">
                Live Terminal Preview
              </button>
            </div>
          </div>
        </section>

        {/* 2. TWO-TIER PRICING (The "Basics") */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black italic uppercase text-white">Select Your Rank</h2>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
              Early Alpha Pricing — Locked in for Life
            </p>
          </div>

          <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* PRO TIER */}
            <div className="group rounded-[3rem] border-2 border-white/5 bg-[#161821] p-10 transition-all hover:border-blue-500/50">
              <div className="mb-8 flex items-start justify-between">
                <Zap className="text-blue-500 group-hover:animate-pulse" size={40} />
                <span className="rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-[10px] font-black uppercase tracking-widest text-blue-500">
                  Most Popular
                </span>
              </div>
              <h3 className="mb-2 text-3xl font-black italic uppercase tracking-tighter text-white">
                Pro Terminal
              </h3>
              <p className="mb-8 text-sm font-medium text-slate-400">
                Full Market Access & Arb Detection
              </p>
              <ul className="mb-10 space-y-4">
                {[
                  'Live Spread/Total Alerts',
                  'Basic Steam Room',
                  'Arb Opportunity Tracker',
                  'Injury Pulse Feed',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-300">
                    <ShieldCheck size={16} className="text-blue-500" /> {f}
                  </li>
                ))}
              </ul>
              <p className="mb-6 text-4xl font-black text-white">
                $99<span className="text-lg text-slate-500">/mo</span>
              </p>
              <button className="w-full rounded-2xl border border-white/10 bg-white/5 py-5 text-xs font-black uppercase transition-all hover:bg-white hover:text-black">
                Select Pro
              </button>
            </div>

            {/* PRO+ TIER */}
            <div className="relative overflow-hidden rounded-[3rem] border-2 border-blue-500 bg-gradient-to-b from-blue-600/20 to-transparent p-10 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
              <div className="absolute -right-4 -top-4 opacity-10">
                <Crown size={150} />
              </div>
              <div className="mb-8 flex items-start justify-between">
                <Crown className="text-blue-400" size={40} />
                <span className="rounded-full bg-white px-4 py-1 text-[10px] font-black italic uppercase tracking-widest text-black">
                  The Edge
                </span>
              </div>
              <h3 className="mb-2 text-3xl font-black italic uppercase tracking-tighter text-white">
                Pro+ Syndicate
              </h3>
              <p className="mb-8 text-sm font-medium text-slate-400">
                Prop-Market Domination & Early Info
              </p>
              <ul className="mb-10 space-y-4">
                {[
                  'Unlocked Player Props',
                  'Advanced Steam Analytics',
                  'SMS Instant Alerts',
                  'Priority API Speed',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm font-bold text-slate-200">
                    <Zap size={16} className="fill-blue-400 text-blue-400" /> {f}
                  </li>
                ))}
              </ul>
              <p className="mb-6 text-4xl font-black text-white">
                $199<span className="text-lg text-slate-500">/mo</span>
              </p>
              <button className="w-full rounded-2xl bg-blue-600 py-5 text-xs font-black uppercase text-white transition-all hover:shadow-[0_0_20px_#3b82f6]">
                Select Pro+
              </button>
            </div>
          </div>

          {/* INSTITUTIONAL CTA */}
          <div className="flex flex-col items-center justify-between rounded-3xl border border-white/5 bg-white/5 p-8 text-center md:flex-row md:text-left">
            <div>
              <h4 className="font-black italic uppercase tracking-wider text-white">Institutional Need?</h4>
              <p className="text-xs font-medium uppercase tracking-widest text-slate-500">
                Syndicate limits & high-volume API access
              </p>
            </div>
            <button className="mt-4 flex items-center gap-2 text-xs font-black uppercase text-blue-500 transition-all hover:gap-4 md:mt-0">
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
              <MousePointer2 size={14} className="text-blue-400" />
              Interactive Edge Tools
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-[#10131b] p-6 shadow-[0_0_40px_rgba(59,130,246,0.08)]">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                Odds Watchlist
              </h3>
              <OddsList />
            </div>

            <div className="rounded-3xl border border-white/10 bg-[#10131b] p-6 shadow-[0_0_40px_rgba(59,130,246,0.08)]">
              <h3 className="mb-4 text-xs font-black uppercase tracking-widest text-slate-400">
                Injury Pulse Feed
              </h3>
              <InjuryPulse updates={updates} />
            </div>
          </div>
        </section>

        {/* 3. THE "FUN" FOOTER */}
        <footer className="border-t border-white/5 py-20 text-center">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.5em] text-slate-600">
            Engineered for Winners
          </p>
          <div className="flex justify-center gap-6">
            {['Twitter', 'Discord', 'Updates'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-xs font-black uppercase text-slate-500 transition-colors hover:text-blue-500"
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
