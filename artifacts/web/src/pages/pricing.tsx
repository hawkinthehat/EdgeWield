import { useState } from 'react';
import { Check, ShieldCheck, Crosshair, Minus } from 'lucide-react';
import { useCheckout } from '@/hooks/use-checkout';

const comparison = [
  {
    category: 'Scanning',
    rows: [
      { feature: 'Market Sync Speed',        standard: '15 Minutes',   pro: '90 Seconds' },
      { feature: 'Moneyline Arb Detection',  standard: true,           pro: true },
      { feature: 'Spread Arb Detection',     standard: true,           pro: true },
      { feature: 'Totals (O/U) Detection',   standard: false,          pro: true },
      { feature: 'Player Props & Alt Lines', standard: false,          pro: true },
      { feature: 'Institutional Arb Feed',   standard: false,          pro: true },
    ],
  },
  {
    category: 'Tools',
    rows: [
      { feature: 'Unit Calculator',          standard: 'Standard',     pro: 'Auto-Hedge' },
      { feature: 'Edge Feed',                standard: 'Delayed',      pro: 'Real-Time' },
      { feature: 'Wield Modal (Bet Splits)', standard: true,           pro: true },
      { feature: 'SMS Alerts',               standard: false,          pro: true },
      { feature: 'Email Alerts',             standard: 'Delayed',      pro: 'Instant' },
    ],
  },
  {
    category: 'Access',
    rows: [
      { feature: 'Pro Dashboard Terminal',   standard: false,          pro: true },
      { feature: 'Markets Monitored',        standard: '~10,000',      pro: '50,000+' },
      { feature: 'Sportsbooks Covered',      standard: '4',            pro: '12+' },
      { feature: 'Support',                  standard: 'Email',        pro: 'Priority' },
      { feature: 'Cancel Anytime',           standard: true,           pro: true },
    ],
  },
];

const tiers = [
  {
    id: 'standard' as const,
    name: 'Standard',
    price: '19.99',
    icon: ShieldCheck,
    iconClass: 'text-slate-400',
    features: [
      '15-Minute Market Sync',
      'Main Markets (Moneyline/Spreads)',
      'Standard Unit Calculator',
      'Email Alerts (Delayed)',
    ],
    cta: 'Start Scouting',
    highlight: false,
  },
  {
    id: 'pro' as const,
    name: 'Pro Terminal',
    price: '49.99',
    icon: Crosshair,
    iconClass: 'text-edge-emerald',
    features: [
      '90-Second Instant Sync',
      'Player Props & Alt Lines',
      'Auto-Hedge Unit Execution',
      'Direct "Wield" SMS Alerts',
      'Institutional Arb Scanner',
    ],
    cta: 'Wield the Edge',
    highlight: true,
  },
] as const;

export default function Pricing() {
  const { startCheckout, isLoading, error } = useCheckout();
  const [loadingTier, setLoadingTier] = useState<'standard' | 'pro' | null>(null);

  const handleCheckout = async (tier: 'standard' | 'pro') => {
    setLoadingTier(tier);
    await startCheckout(undefined, undefined, tier);
    setLoadingTier(null);
  };

  return (
    <section className="py-24 px-6 max-w-5xl mx-auto">
      <div className="text-center mb-16">
        <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mb-4">
          Subscription Plans
        </p>
        <h2 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
          Choose Your Tier
        </h2>
        <p className="text-slate-400 mt-4 font-medium max-w-md mx-auto">
          Lock in guaranteed edges across 50,000+ betting lines. Cancel anytime.
        </p>
      </div>

      {error && (
        <div className="mb-8 max-w-md mx-auto text-center text-sm text-red-400 bg-red-400/10 border border-red-400/20 rounded-2xl py-3 px-5">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-8">
        {tiers.map((tier) => {
          const Icon = tier.icon;
          const isBusy = loadingTier === tier.id;
          return (
            <div
              key={tier.id}
              className={`relative p-10 rounded-[3rem] border-2 transition-all ${
                tier.highlight
                  ? 'border-edge-emerald bg-edge-emerald/5 shadow-[0_0_60px_rgba(16,185,129,0.12)]'
                  : 'border-edge-border bg-edge-slate/20'
              }`}
            >
              {tier.highlight && (
                <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-edge-emerald text-edge-navy px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  Recommended for Pros
                </span>
              )}

              <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <Icon size={22} className={tier.iconClass} />
                  <h3 className="text-2xl font-black uppercase italic tracking-tight">{tier.name}</h3>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black tracking-tighter">${tier.price}</span>
                  <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">/ Month</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                    <Check
                      size={15}
                      className={`shrink-0 ${tier.highlight ? 'text-edge-emerald' : 'text-slate-500'}`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleCheckout(tier.id)}
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl font-black uppercase tracking-tighter transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-wait ${
                  tier.highlight
                    ? 'bg-edge-emerald text-edge-navy hover:scale-105 shadow-[0_0_24px_rgba(16,185,129,0.35)] disabled:hover:scale-100'
                    : 'bg-white text-edge-navy hover:bg-slate-100 disabled:hover:scale-100'
                }`}
              >
                {isBusy ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                    </svg>
                    Redirecting...
                  </>
                ) : (
                  tier.cta
                )}
              </button>

              <p className="text-center text-[10px] text-slate-600 mt-4 font-medium uppercase tracking-widest">
                Secure checkout · Cancel anytime
              </p>
            </div>
          );
        })}
      </div>

      {/* ── Comparison Table ── */}
      <div className="mt-24">
        <div className="text-center mb-10">
          <p className="text-slate-500 font-bold uppercase text-[10px] tracking-[0.4em] mb-3">Full Breakdown</p>
          <h3 className="text-3xl font-black italic uppercase tracking-tighter">Compare Plans</h3>
        </div>

        <div className="rounded-[2rem] border border-edge-border overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-3 bg-edge-slate/40 border-b border-edge-border px-6 py-4">
            <div className="text-xs font-black uppercase tracking-widest text-slate-500">Feature</div>
            <div className="text-center text-xs font-black uppercase tracking-widest text-slate-400">Standard</div>
            <div className="text-center text-xs font-black uppercase tracking-widest text-edge-emerald">Pro Terminal</div>
          </div>

          {comparison.map((section, si) => (
            <div key={section.category}>
              {/* Category header */}
              <div className="px-6 py-2.5 bg-edge-navy/60 border-b border-edge-border">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600">
                  {section.category}
                </span>
              </div>

              {section.rows.map((row, ri) => {
                const isLast = si === comparison.length - 1 && ri === section.rows.length - 1;
                return (
                  <div
                    key={row.feature}
                    className={`grid grid-cols-3 px-6 py-4 items-center hover:bg-edge-slate/10 transition-colors ${
                      !isLast ? 'border-b border-edge-border/50' : ''
                    }`}
                  >
                    <span className="text-sm font-medium text-slate-300">{row.feature}</span>
                    <Cell value={row.standard} highlight={false} />
                    <Cell value={row.pro} highlight />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      <p className="text-center text-slate-600 text-xs mt-12 font-medium uppercase tracking-widest">
        All plans include a 7-day money-back guarantee · Powered by Stripe
      </p>
    </section>
  );
}

function Cell({ value, highlight }: { value: boolean | string; highlight: boolean }) {
  if (value === true) {
    return (
      <div className="flex justify-center">
        <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
          highlight ? 'bg-edge-emerald/20' : 'bg-slate-700/50'
        }`}>
          <Check size={13} className={highlight ? 'text-edge-emerald' : 'text-slate-400'} />
        </span>
      </div>
    );
  }
  if (value === false) {
    return (
      <div className="flex justify-center">
        <Minus size={14} className="text-slate-700" />
      </div>
    );
  }
  return (
    <div className="text-center">
      <span className={`text-xs font-bold ${highlight ? 'text-edge-emerald' : 'text-slate-400'}`}>
        {value}
      </span>
    </div>
  );
}
