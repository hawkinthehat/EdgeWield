import type { ReactNode } from 'react';
import { Check, Crosshair, ShieldCheck } from 'lucide-react';

type PricingTier = {
  name: string;
  price: string;
  promo: string;
  icon: ReactNode;
  features: string[];
  cta: string;
  highlight: boolean;
};

export default function Pricing() {
  const tiers: PricingTier[] = [
    {
      name: 'Standard',
      price: '19.99',
      promo: '9.99',
      icon: <ShieldCheck className="text-slate-400" />,
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
      name: 'Pro Terminal',
      price: '49.99',
      promo: '24.99',
      icon: <Crosshair className="text-edge-emerald" />,
      features: [
        '90-Second Instant Sync',
        'Player Props & Alt Lines',
        'Auto-Hedge Unit Execution',
        'Direct Arb SMS Alerts',
        'High-Frequency Arb Scanner',
      ],
      cta: 'Start Live Scanning',
      highlight: true,
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Choose Your Tier</h2>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
          Use Code <span className="text-edge-emerald">BETA50</span> for 50% Lifetime Discount
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-[3rem] border-2 p-10 transition-all ${
              tier.highlight
                ? 'border-edge-emerald bg-edge-emerald/5 shadow-[0_0_40px_rgba(16,185,129,0.15)]'
                : 'border-edge-border bg-edge-slate/20'
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-edge-emerald px-4 py-1 text-[10px] font-black uppercase tracking-widest text-edge-navy">
                Recommended for Pros
              </span>
            )}

            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                {tier.icon}
                <h3 className="text-2xl font-black italic uppercase">{tier.name}</h3>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black tracking-tighter">${tier.promo}</span>
                <span className="text-sm font-bold text-slate-500 line-through">${tier.price}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-500">/ Month</span>
              </div>
            </div>

            <ul className="mb-10 space-y-4">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm font-medium text-slate-300">
                  <Check size={16} className={tier.highlight ? 'text-edge-emerald' : 'text-slate-500'} />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              type="button"
              className={`w-full rounded-2xl py-4 font-black uppercase tracking-tighter transition-all ${
                tier.highlight
                  ? 'bg-edge-emerald text-edge-navy shadow-lg hover:scale-105'
                  : 'bg-white text-edge-navy hover:bg-slate-200'
              }`}
            >
              {tier.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
