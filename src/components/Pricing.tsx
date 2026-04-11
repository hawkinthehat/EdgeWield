import type { ReactNode } from 'react';
import { Check, Crosshair, ShieldCheck } from 'lucide-react';

type PricingTier = {
  name: string;
  price: string;
  icon: ReactNode;
  features: string[];
  cta: string;
  blurb: string;
  highlight: boolean;
  foundingMember?: boolean;
};

export default function Pricing() {
  const tiers: PricingTier[] = [
    {
      name: 'Kestrel',
      price: '0.00',
      blurb: 'Agile, high-frequency scanning for the daily player.',
      icon: <ShieldCheck className="text-slate-400" />,
      features: [
        '15-Minute Market Sync',
        'Main Markets (Moneyline/Spreads)',
        'Standard Unit Calculator',
        'Email Alerts (Delayed)',
      ],
      cta: 'Start with Kestrel',
      highlight: false,
    },
    {
      name: 'Red-Tail',
      price: '19.99',
      blurb: 'Advanced market vision and expanded bookmaker access.',
      icon: <ShieldCheck className="text-slate-400" />,
      features: [
        '90-Second Instant Sync',
        'Player Props & Alt Lines',
        'Auto-Hedge Unit Execution',
        'Direct Arb SMS Alerts',
      ],
      cta: 'Upgrade to Red-Tail',
      highlight: false,
    },
    {
      name: 'Sea Hawk',
      price: '99.99',
      blurb: 'The Master Eye. Full institutional suite, Live Sweat tracking, and the Eagle-Eye Calculator.',
      icon: <Crosshair className="text-edge-emerald" />,
      features: [
        'Sub-60s Market Sync',
        'Priority Player Props Engine',
        'Auto-Hedge Execution + Alerts',
        'High-Frequency Arb Scanner',
      ],
      cta: 'Go Sea Hawk',
      highlight: true,
      foundingMember: true,
    },
  ];

  return (
    <section className="mx-auto max-w-5xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter">Choose Your Tier</h2>
        <p className="mt-2 text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500">
          Founding Sea Hawk Rate (50% lifetime): <span className="text-lime-400">FOUNDER50</span>
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
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
            {tier.foundingMember && (
              <span className="absolute right-6 top-6 rounded-full border border-lime-300/70 bg-lime-400/15 px-3 py-1 text-[9px] font-black uppercase tracking-[0.2em] text-lime-400">
                Founding Sea Hawk Rate
              </span>
            )}

            <div className="mb-8">
              <div className="mb-4 flex items-center gap-3">
                {tier.icon}
                <h3 className="text-2xl font-black italic uppercase">{tier.name}</h3>
              </div>
              <p className="mb-3 text-xs font-semibold text-slate-400">{tier.blurb}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black tracking-tighter">
                  {tier.price === '0.00' ? '$0.00' : `$${tier.price}`}
                </span>
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
