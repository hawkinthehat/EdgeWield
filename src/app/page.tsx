export default function Page() {
  return (
    <main
      style={{ backgroundColor: '#18181b', minHeight: '100vh' }}
      className="p-6 md:p-12 text-[#f4f4f5]"
    >
      <div className="max-w-xl mx-auto space-y-10">
        {/* Branding */}
        <div className="border-b border-[#3f3f46] pb-4">
          <h2 className="text-edge-emerald font-bold text-xs tracking-widest uppercase">
            EdgeWield Pro
          </h2>
          <p className="text-zinc-500 text-[10px] italic">Institutional Vision. Predatory Precision.</p>
        </div>

        {/* Command Center Content */}
        <section className="space-y-6">
          <h1 className="text-3xl font-bold tracking-tight">Command Center</h1>

          <div className="bg-[#27272a] border border-[#3f3f46] p-6 rounded-sm">
            <p className="text-zinc-500 text-xs uppercase tracking-widest">Bankroll</p>
            <p className="text-4xl font-mono mt-1">$12,480</p>
            <p className="text-edge-emerald text-sm mt-2">+2.1% session</p>
          </div>
        </section>

        {/* Navigation */}
        <nav className="flex gap-2">
          {['TERMINAL', 'STEAM ROOM', 'LIVE SWEAT'].map((btn) => (
            <button
              key={btn}
              className="px-4 py-2 bg-[#27272a] border border-[#3f3f46] text-[10px] font-bold tracking-tighter hover:border-edge-emerald transition-all"
            >
              {btn}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}
