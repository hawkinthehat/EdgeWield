export default function Page() {
  return (
    <main className="min-h-screen bg-[#18181b] text-zinc-100 p-8">
      <div className="max-w-xl mx-auto space-y-12">
        <header className="border-b border-zinc-700 pb-4">
          <h1 className="text-[#69be28] text-[10px] uppercase tracking-[0.2em]">EdgeWield Pro</h1>
          <p className="text-zinc-400 text-[10px] mt-2">Institutional Vision. Predatory Precision.</p>
        </header>

        <section className="space-y-6">
          <h2 className="text-3xl font-bold tracking-tight text-white">Command Center</h2>

          <div className="bg-zinc-800/50 border border-zinc-700 p-6 rounded-sm">
            <p className="text-zinc-400 text-[10px] uppercase tracking-[0.2em]">Bankroll</p>
            <p className="text-4xl font-mono font-bold text-white mt-2">$12,480</p>
            <p className="text-[#69be28] text-sm mt-2">+2.1% session</p>
          </div>
        </section>

        <nav className="flex flex-row gap-4">
          {['TERMINAL', 'STEAM ROOM', 'LIVE SWEAT'].map((btn) => (
            <button key={btn} className="border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-[9px] font-black">
              {btn}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}
