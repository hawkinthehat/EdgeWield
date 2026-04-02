import { motion, AnimatePresence } from 'framer-motion';

interface WelcomeGuideProps {
  onDismiss: () => void;
}

const STEPS = [
  {
    n: 1,
    label: 'Calibrate your Terminal.',
    body: 'Go to your Profile and input your Total Bankroll. Our Kelly Optimizer and Unit Calculators use this number to generate your specific risk amounts. If your bankroll grows, update it here to keep your unit sizes mathematically perfect.',
  },
  {
    n: 2,
    label: 'Locate a +2% Arb in the Feed',
    body: null,
  },
  {
    n: 3,
    label: 'Track your compounding edge.',
    body: 'Every time you use the Unit Calculator to execute a trade, click "Log to Vault." EdgeWield will save that profit to your Mission History. At the end of the month, you can export your performance to see exactly how much the "Edge" has grown your bankroll. Data-driven betting is winning betting.',
  },
];

export default function WelcomeGuide({ onDismiss }: WelcomeGuideProps) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-edge-navy/80 backdrop-blur-sm px-6"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="p-8 bg-edge-navy border-2 border-edge-emerald rounded-[3rem] max-w-lg w-full shadow-[0_0_80px_rgba(16,185,129,0.2)]"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-edge-emerald/10 border border-edge-emerald/20 text-edge-emerald text-[10px] font-black uppercase tracking-widest mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-edge-emerald animate-pulse" />
            System Online
          </div>

          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-3">
            Terminal <span className="text-edge-emerald">Activated</span>
          </h2>
          <p className="text-slate-400 text-sm mb-8 leading-relaxed">
            Welcome to the inner circle. EdgeWield is now scanning{' '}
            <span className="text-white font-bold">42,000+ lines</span> on your behalf.
            Follow the 3-step protocol to lock your first unit.
          </p>

          <div className="space-y-4 mb-8">
            {STEPS.map(({ n, label, body }) => (
              <div key={n} className={`flex gap-4 ${body ? 'items-start' : 'items-center'}`}>
                <span className="shrink-0 w-7 h-7 rounded-full bg-edge-emerald/15 border border-edge-emerald/30 text-edge-emerald flex items-center justify-center font-black text-xs mt-0.5">
                  {n}
                </span>
                <div>
                  <p className="text-xs text-white font-black uppercase tracking-wider">{label}</p>
                  {body && (
                    <p className="text-[11px] text-slate-400 leading-relaxed mt-1.5">{body}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={onDismiss}
            className="w-full bg-edge-emerald text-edge-navy py-4 rounded-2xl font-black uppercase tracking-tighter text-sm hover:scale-[1.02] transition-transform shadow-[0_0_24px_rgba(16,185,129,0.35)]"
          >
            Start My First Scan
          </button>

          <p className="text-center text-[10px] text-slate-600 mt-4 font-medium uppercase tracking-widest">
            This guide won't show again
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
