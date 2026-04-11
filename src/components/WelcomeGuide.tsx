'use client';

export default function WelcomeGuide() {
  return (
    <div className="max-w-lg rounded-[3rem] border-2 border-edge-emerald bg-edge-navy p-8 shadow-2xl">
      <h2 className="mb-4 text-2xl font-black italic uppercase text-edge-emerald">Terminal Activated</h2>
      <p className="mb-6 text-sm leading-relaxed text-slate-400">
        EdgeWield Pro is scanning 42,000+ lines on your behalf. Follow the 3-step workflow to lock your first
        arbitrage position.
      </p>

      <div className="mb-8 space-y-4">
        <div className="flex gap-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-edge-emerald/20 text-xs font-bold text-edge-emerald">
            1
          </span>
          <p className="text-xs font-bold uppercase text-white">Set Active Bookies in Settings</p>
        </div>
        <div className="flex gap-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-edge-emerald/20 text-xs font-bold text-edge-emerald">
            2
          </span>
          <p className="text-xs font-bold uppercase text-white">Locate a +2% Arb in the Feed</p>
        </div>
        <div className="flex gap-4">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-edge-emerald/20 text-xs font-bold text-edge-emerald">
            3
          </span>
          <p className="text-xs font-bold uppercase text-white">Use the Calculator to Lock Profit</p>
        </div>
      </div>

      <button
        type="button"
        className="w-full rounded-2xl bg-edge-emerald py-4 font-black uppercase tracking-tighter text-edge-navy"
      >
        Start My First Scan
      </button>
    </div>
  );
}
