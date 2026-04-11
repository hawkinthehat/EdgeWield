import { Check, X } from 'lucide-react';

type FeatureRow = {
  name: string;
  standard: boolean | string;
  pro: boolean | string;
  highlight?: boolean;
};

export default function PriceComparison() {
  const features: FeatureRow[] = [
    { name: 'Market Refresh Rate', standard: '15 Minutes', pro: '90 Seconds', highlight: true },
    { name: 'Moneyline & Spreads', standard: true, pro: true },
    { name: 'Player Props (Over/Under)', standard: false, pro: true },
    { name: 'Alt Lines & Derivatives', standard: false, pro: true },
    { name: 'Hedge Unit Calculator', standard: 'Basic', pro: 'Advanced / Auto', highlight: true },
    { name: 'Multi-Bookie Filtering', standard: 'Up to 3', pro: 'Unlimited' },
    { name: 'Priority Arbs Alerts', standard: 'Email', pro: 'SMS / Push', highlight: true },
    { name: 'Live Bankroll Tracking', standard: true, pro: true },
  ];

  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <div className="mb-16 text-center">
        <h2 className="mb-4 text-3xl font-black italic uppercase tracking-tighter">Terminal Capability</h2>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-slate-500">
          Sea Hawk Arbitrage Tools vs Red-Tail
        </p>
      </div>

      <div className="overflow-hidden rounded-[3rem] border border-edge-border bg-edge-slate/10 backdrop-blur-md">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-b border-edge-border bg-edge-slate/20">
              <th className="p-8 text-xs font-black uppercase tracking-widest text-slate-500">Capabilities</th>
              <th className="p-8 text-center">
                <span className="text-sm font-black uppercase tracking-tighter text-slate-300">Red-Tail</span>
                <div className="mt-1 text-xl font-black">
                  $9.99<span className="text-[10px] opacity-50">/mo</span>
                </div>
              </th>
              <th className="bg-edge-emerald/5 p-8 text-center">
                <span className="text-sm font-black uppercase tracking-tighter text-edge-emerald">
                  Sea Hawk
                </span>
                <div className="mt-1 text-xl font-black text-white">
                  $24.99<span className="text-[10px] opacity-50">/mo</span>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((feature) => (
              <tr
                key={feature.name}
                className="border-b border-edge-border/30 transition-colors hover:bg-white/[0.02]"
              >
                <td className="p-6 pl-8">
                  <span className={`text-sm font-bold ${feature.highlight ? 'text-white' : 'text-slate-400'}`}>
                    {feature.name}
                  </span>
                </td>

                <td className="p-6 text-center">
                  {typeof feature.standard === 'boolean' ? (
                    feature.standard ? (
                      <Check size={18} className="mx-auto text-slate-500" />
                    ) : (
                      <X size={18} className="mx-auto text-slate-800" />
                    )
                  ) : (
                    <span className="text-xs font-bold text-slate-500">{feature.standard}</span>
                  )}
                </td>

                <td className="bg-edge-emerald/5 p-6 text-center">
                  {typeof feature.pro === 'boolean' ? (
                    feature.pro ? (
                      <Check size={20} className="mx-auto text-edge-emerald" />
                    ) : (
                      <X size={20} className="mx-auto text-slate-800" />
                    )
                  ) : (
                    <span className="text-sm font-black italic text-edge-emerald">{feature.pro}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <p className="text-[10px] font-mono uppercase tracking-widest text-slate-500">
          * Pricing reflects <span className="text-edge-emerald">BETA50</span> lifetime discount.
        </p>
      </div>
    </section>
  );
}
