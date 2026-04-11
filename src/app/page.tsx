const commandStats = [
  { label: 'Bankroll', value: '$12,480', detail: '+2.1% session' },
  { label: 'Latency', value: '18ms', detail: 'Live feed stable' },
];

const tabs = ['TERMINAL', 'STEAM ROOM', 'LIVE SWEAT'];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-300">
      <div className="mx-auto max-w-6xl space-y-7">
        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-[0_12px_40px_rgba(2,6,23,0.4)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-300">EdgeWield Pro</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-100">Command Center</h1>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {commandStats.map((stat) => (
            <article key={stat.label} className="rounded-xl border border-slate-800 bg-slate-900/50 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">{stat.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-100">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-400">{stat.detail}</p>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/55 p-4">
          <div className="grid gap-3 sm:grid-cols-3">
            {tabs.map((tab, idx) => (
              <button
                key={tab}
                type="button"
                className={`rounded-lg border px-4 py-3 text-sm font-semibold tracking-[0.16em] transition ${
                  idx === 0
                    ? 'border-emerald-400/50 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-700 bg-slate-950/70 text-slate-300 hover:border-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
