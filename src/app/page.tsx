export default function CommandCenter() {
  return (
    <main className="min-h-screen bg-edge-slate p-6 md:p-12">
      {/* Container to prevent text from hitting the screen edges */}
      <div className="max-w-2xl mx-auto space-y-10">
        {/* Top Branding */}
        <header className="border-b border-edge-border pb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-edge-emerald font-bold">E</span>
            <span className="text-xs tracking-tighter uppercase opacity-70">EdgeWield Pro</span>
          </div>
          <p className="text-xs italic text-gray-500">Institutional Vision. Predatory Precision.</p>
        </header>

        {/* Hero Section */}
        <section>
          <h1 className="text-4xl font-bold tracking-tight mb-8">Command Center</h1>

          <div className="grid grid-cols-1 gap-8">
            {/* Bankroll Stat */}
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-widest text-gray-500">Bankroll</p>
              <p className="text-3xl font-mono">$12,480</p>
              <p className="text-edge-emerald text-sm">+2.1% session</p>
            </div>

            {/* Latency Stat */}
            <div className="space-y-1">
              <p className="text-sm uppercase tracking-widest text-gray-500">Latency</p>
              <p className="text-xl font-mono">18ms</p>
              <p className="text-blue-400 text-xs flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></span>
                Live feed stable
              </p>
            </div>
          </div>
        </section>

        {/* Navigation Buttons */}
        <nav className="flex gap-3 pt-6">
          {['TERMINAL', 'STEAM ROOM', 'LIVE SWEAT'].map((item) => (
            <button
              key={item}
              className="px-4 py-2 border border-edge-border bg-black/20 text-[10px] font-bold tracking-widest hover:border-edge-emerald transition-colors"
            >
              {item}
            </button>
          ))}
        </nav>
      </div>
    </main>
  );
}
