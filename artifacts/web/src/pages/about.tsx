import { motion } from 'framer-motion';
import { Link } from 'wouter';
import {
  UserCheck,
  CreditCard,
  BookOpen,
  Crosshair,
  Calculator,
  Zap,
  AlertTriangle,
  Clock,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const steps = [
  {
    n: '01',
    icon: UserCheck,
    title: 'Create Your Account',
    color: 'text-edge-emerald',
    ring: 'border-edge-emerald/30 bg-edge-emerald/5',
    body: "Head to the Dashboard and enter your email. We send a secure magic link — no password required. Click it and you're in.",
    tip: null,
    cta: { label: 'Go to Dashboard', href: '/dashboard' },
  },
  {
    n: '02',
    icon: CreditCard,
    title: 'Pick a Plan',
    color: 'text-blue-400',
    ring: 'border-blue-400/30 bg-blue-400/5',
    body: 'Standard gives you 15-minute syncs across Moneyline and Spread markets. Pro Terminal unlocks 90-second real-time syncs, Player Props, SMS alerts, and the full institutional arb feed.',
    tip: 'Pro users catch arbs that close in under 2 minutes — speed matters.',
    cta: { label: 'View Plans', href: '/pricing' },
  },
  {
    n: '03',
    icon: BookOpen,
    title: 'Set Up Your Sportsbooks',
    color: 'text-violet-400',
    ring: 'border-violet-400/30 bg-violet-400/5',
    body: 'For arbitrage to work you need accounts at multiple books. We recommend having at least FanDuel, DraftKings, BetMGM, and Caesars funded and ready before your first scan.',
    tip: 'Keep funds split across books so you can place both sides instantly.',
    cta: null,
  },
  {
    n: '04',
    icon: Crosshair,
    title: 'Find an Arb in the Edge Scanner',
    color: 'text-edge-emerald',
    ring: 'border-edge-emerald/30 bg-edge-emerald/5',
    body: 'Open the Edge Scanner. Select a sport tab or leave it on Upcoming. The scanner refreshes every 30s (90s on Pro). When an arb appears you will see the two bookmakers, the profit percentage, and a "Wield It" button.',
    tip: 'Sort by highest profit. A 2%+ arb is excellent — anything above 1% is worth evaluating.',
    cta: { label: 'Open Scanner', href: '/scanner' },
  },
  {
    n: '05',
    icon: Calculator,
    title: 'Calculate Your Stakes',
    color: 'text-amber-400',
    ring: 'border-amber-400/30 bg-amber-400/5',
    body: 'Click "Wield It" on any arb row. Enter your total stake and the modal instantly shows you the exact dollar amount to place on each side at each book to guarantee your profit regardless of outcome.',
    tip: 'The calculator accounts for juice — always use the exact amounts shown.',
    cta: null,
  },
  {
    n: '06',
    icon: Zap,
    title: 'Place Both Bets — Fast',
    color: 'text-edge-emerald',
    ring: 'border-edge-emerald/30 bg-edge-emerald/5',
    body: 'Open both sportsbook tabs simultaneously. Place Side A first, then Side B immediately after. The arb window can close in minutes — speed is everything.',
    tip: null,
    cta: null,
  },
];

const rules = [
  {
    icon: Clock,
    title: 'Speed is everything',
    body: 'Arb windows close fast — sometimes under 2 minutes. Have your books open and funded before you scan.',
  },
  {
    icon: AlertTriangle,
    title: 'Bet limits are real',
    body: 'Books limit sharp bettors. Start with smaller stakes ($50–200/side) to stay under the radar while you build your track record.',
  },
  {
    icon: ShieldCheck,
    title: 'Always lock both sides',
    body: "Never place only one leg of an arb. Both bets must go in or you're just gambling. If one side fails, don't place the other.",
  },
];

export default function About() {
  return (
    <div className="pb-32">
      {/* Header */}
      <section className="pt-24 pb-16 px-6 max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-edge-emerald/10 border border-edge-emerald/20 text-edge-emerald text-[10px] font-black uppercase tracking-widest mb-8">
            <Zap size={11} fill="currentColor" /> First-Time User Guide
          </div>
          <h1 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-[0.9] text-white mb-6">
            How to Wield<br />
            <span className="text-edge-emerald">Your First Edge</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto leading-relaxed">
            Arbitrage betting is risk-free profit when executed correctly. This guide walks you from zero to your first locked unit in six steps.
          </p>
        </motion.div>
      </section>

      {/* Steps */}
      <section className="px-6 max-w-3xl mx-auto space-y-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={`relative p-8 rounded-[2rem] border-2 ${step.ring}`}
            >
              <div className="flex items-start gap-6">
                {/* Step number + icon */}
                <div className="shrink-0 flex flex-col items-center gap-2">
                  <div className={`w-12 h-12 rounded-2xl border ${step.ring} flex items-center justify-center`}>
                    <Icon size={20} className={step.color} />
                  </div>
                  <span className={`text-[10px] font-black ${step.color} opacity-40 tracking-widest`}>{step.n}</span>
                </div>

                <div className="flex-1 min-w-0">
                  <h2 className="text-xl font-black uppercase italic tracking-tight text-white mb-3">
                    {step.title}
                  </h2>
                  <p className="text-slate-400 text-sm leading-relaxed mb-4">{step.body}</p>

                  {step.tip && (
                    <div className="flex items-start gap-3 bg-edge-slate/30 border border-edge-border rounded-xl px-4 py-3 mb-4">
                      <Zap size={13} className="text-edge-emerald shrink-0 mt-0.5" fill="currentColor" />
                      <p className="text-xs text-slate-300 font-medium">{step.tip}</p>
                    </div>
                  )}

                  {step.cta && (
                    <Link href={step.cta.href}>
                      <button className={`inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest ${step.color} hover:opacity-80 transition-opacity`}>
                        {step.cta.label}
                        <ArrowRight size={13} />
                      </button>
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </section>

      {/* Ground Rules */}
      <section className="px-6 max-w-3xl mx-auto mt-20">
        <div className="text-center mb-10">
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mb-3">Before You Start</p>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter">The 3 Golden Rules</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-5">
          {rules.map((rule, i) => {
            const Icon = rule.icon;
            return (
              <motion.div
                key={rule.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-[1.5rem] bg-edge-slate/20 border border-edge-border"
              >
                <Icon size={20} className="text-edge-emerald mb-4" />
                <h3 className="text-sm font-black uppercase tracking-tight text-white mb-2">{rule.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{rule.body}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 max-w-3xl mx-auto mt-20">
        <div className="p-10 rounded-[2.5rem] border-2 border-edge-emerald bg-edge-emerald/5 shadow-[0_0_60px_rgba(16,185,129,0.1)] text-center">
          <h3 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-3">
            Ready to Lock Your First Unit?
          </h3>
          <p className="text-slate-400 text-sm mb-8 max-w-sm mx-auto">
            The scanner is live. Your first arb opportunity could appear in the next 30 seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/scanner">
              <button className="bg-edge-emerald text-edge-navy px-8 py-3.5 rounded-2xl font-black uppercase tracking-tighter text-sm hover:scale-105 transition-transform shadow-[0_0_24px_rgba(16,185,129,0.3)]">
                Open Edge Scanner
              </button>
            </Link>
            <Link href="/pricing">
              <button className="bg-edge-slate/40 border border-edge-border text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-tighter text-sm hover:bg-edge-slate/60 transition-colors">
                View Plans
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
