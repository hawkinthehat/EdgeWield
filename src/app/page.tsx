import OddsList from '@/components/OddsList';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <section className="mx-auto w-full max-w-6xl rounded-3xl border border-emerald-500/30 bg-slate-900/80 shadow-[0_0_60px_rgba(16,185,129,0.12)] backdrop-blur">
        <header className="border-b border-emerald-500/30 px-6 py-5 md:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-300/80">Terminal</p>
          <h1 className="mt-2 font-mono text-3xl font-black tracking-wide text-emerald-400 drop-shadow-[0_0_10px_rgba(74,222,128,0.75)] md:text-4xl">
            EdgeWield
          </h1>
          <p className="mt-2 text-sm text-slate-400">Live market console for precise, disciplined betting decisions.</p>
        </header>

        <div className="px-6 py-6 md:px-8 md:py-8">
          <OddsList />
        </div>
      </section>
    </main>
  );
}
