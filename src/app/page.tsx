import Link from 'next/link';
import { ArrowUpRight, Radar, ShieldCheck, SlidersHorizontal } from 'lucide-react';

const terminalStats = [
  { label: 'Live Market Feeds', value: '18', detail: 'Connected books' },
  { label: 'Arb Windows', value: '42', detail: 'High-confidence edges' },
  { label: 'Risk Guard', value: 'ACTIVE', detail: 'Portfolio protection online' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0f172a] px-6 py-14 text-slate-100">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-3xl border border-slate-700/80 bg-slate-900/70 p-8 shadow-[0_20px_60px_rgba(2,6,23,0.45)] md:p-10">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-[#39FF14]">EdgeWield Pro</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-100 md:text-5xl">
            Golden Eagle Terminal
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-300">
            EdgeWield Terminal delivers a focused command deck for bankroll protection, live arbitrage
            execution, and rapid risk-adjusted decisioning.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 rounded-xl border border-[#39FF14]/40 bg-[#39FF14]/10 px-5 py-3 text-sm font-bold text-[#b9ffa9] transition hover:bg-[#39FF14]/20"
            >
              Enter EdgeWield Terminal
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <Link
              href="/settings"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-600 bg-slate-800/80 px-5 py-3 text-sm font-bold text-slate-200 transition hover:bg-slate-700/80"
            >
              Secure Access
            </Link>
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-3">
          {terminalStats.map((stat) => (
            <article
              key={stat.label}
              className="rounded-2xl border border-slate-700/80 bg-slate-900/65 p-6 shadow-[0_8px_30px_rgba(2,6,23,0.35)]"
            >
              <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">{stat.label}</p>
              <p className="mt-2 text-3xl font-black text-slate-100">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-400">{stat.detail}</p>
            </article>
          ))}
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <article className="rounded-3xl border border-slate-700/80 bg-slate-900/70 p-8">
            <div className="mb-6 flex items-center gap-2">
              <Radar className="h-5 w-5 text-[#39FF14]" />
              <h2 className="text-xl font-black tracking-tight text-slate-100">EdgeWield Terminal Overview</h2>
            </div>
            <p className="text-sm text-slate-300">
              Launch directly into the Golden Eagle command flow with market intelligence, execution
              visibility, and portfolio defense in a single interface.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Terminal Configuration</p>
                <p className="mt-2 text-sm text-slate-300">
                  Align bankroll and risk profile controls before entering live execution mode.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">Secure Access</p>
                <p className="mt-2 text-sm text-slate-300">
                  Harden session entry with role-aware controls and persistent monitoring safeguards.
                </p>
              </div>
            </div>
          </article>

          <article className="rounded-3xl border border-slate-700/80 bg-slate-900/70 p-8">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-[#39FF14]" />
              <h2 className="text-lg font-black text-slate-100">Execution Status</h2>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Engine Health</p>
                <p className="mt-1 text-sm font-semibold text-slate-200">Nominal</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Signal Priority</p>
                <p className="mt-1 text-sm font-semibold text-slate-200">High-Conviction Markets</p>
              </div>
              <div className="rounded-xl border border-slate-700 bg-slate-950/70 p-4">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">Control Layer</p>
                <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-slate-200">
                  <SlidersHorizontal className="h-4 w-4 text-[#39FF14]" />
                  Ready
                </p>
              </div>
            </div>
          </article>
        </section>
      </div>
    </div>
  );
}
