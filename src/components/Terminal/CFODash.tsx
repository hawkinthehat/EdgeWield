import { calculateAverageCLV, formatSignedPercent, type ClvSample } from '@/lib/clv';

type MetricCardProps = {
  label: string;
  value: string;
  tone?: "neutral" | "positive";
};

function MetricCard({ label, value, tone = "neutral" }: MetricCardProps) {
  const valueClass =
    tone === "positive" ? "text-edge-emerald" : "text-white";

  return (
    <div className="rounded-2xl border border-slate-700/80 bg-slate-900/60 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        {label}
      </p>
      <p className={`mt-2 text-2xl font-black italic ${valueClass}`}>{value}</p>
    </div>
  );
}

export default function CFODash() {
  const clvSamples: ClvSample[] = [
    { entryOdds: +125, closingOdds: +110 },
    { entryOdds: -102, closingOdds: -118 },
    { entryOdds: +140, closingOdds: +122 },
  ];

  const averageClv = calculateAverageCLV(clvSamples);
  const clvDisplay = averageClv === null ? 'N/A' : formatSignedPercent(averageClv);

  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard label="Active Arbs" value="24" />
      <MetricCard
        label="Avg. CLV"
        value={clvDisplay}
        tone={averageClv !== null && averageClv > 0 ? 'positive' : 'neutral'}
      />
      <MetricCard label="Live Markets" value="11" />
      <MetricCard label="Pulse Window" value="90s" />
    </section>
  );
}
