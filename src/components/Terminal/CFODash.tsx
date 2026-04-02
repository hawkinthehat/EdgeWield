import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

type MetricCardProps = {
  label: string;
  value: ReactNode;
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
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard label="Active Arbs" value="24" />
      <MetricCard label="Mean Edge %" value="2.48%" tone="positive" />
      <MetricCard label="Live Markets" value="11" />
      <MetricCard label="Pulse Window" value="90s" />
    </section>
  );
}

export function WatcherDash({ bankroll }: { bankroll: number }) {
  return (
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        label="Active Bankroll"
        value={
          <motion.span
            key={bankroll}
            initial={{ color: '#10b981' }}
            animate={{ color: '#ffffff' }}
            transition={{ duration: 2 }}
          >
            ${bankroll.toLocaleString()}
          </motion.span>
        }
      />
      <MetricCard label="Mean Edge %" value="2.48%" tone="positive" />
      <MetricCard label="Live Markets" value="11" />
      <MetricCard label="Pulse Window" value="90s" />
    </section>
  );
}
