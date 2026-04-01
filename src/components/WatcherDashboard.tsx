"use client";

import {
  AlertCircle,
  Plus,
  ShieldCheck,
  TrendingUp,
  Zap,
} from "lucide-react";
import OddsList from "@/components/OddsList";
import Sidebar from "@/components/Sidebar";

type ChartPoint = {
  date: string;
  Bankroll: number;
  EV: number;
};

const chartData: ChartPoint[] = [
  { date: "Mar 24", Bankroll: 4200, EV: 4100 },
  { date: "Mar 25", Bankroll: 4150, EV: 4250 },
  { date: "Mar 26", Bankroll: 4400, EV: 4350 },
  { date: "Mar 27", Bankroll: 4820, EV: 4600 },
];

function MiniTrendBars({ data }: { data: ChartPoint[] }) {
  const max = Math.max(...data.map((point) => Math.max(point.Bankroll, point.EV)));
  return (
    <div className="mt-4 flex h-44 items-end gap-3">
      {data.map((point) => (
        <div key={point.date} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-32 w-full items-end justify-center gap-1">
            <div
              className="w-3 rounded-t bg-blue-500/85"
              style={{ height: `${(point.Bankroll / max) * 100}%` }}
              title={`Bankroll ${point.Bankroll}`}
            />
            <div
              className="w-3 rounded-t bg-slate-400/85"
              style={{ height: `${(point.EV / max) * 100}%` }}
              title={`EV ${point.EV}`}
            />
          </div>
          <span className="text-[10px] font-bold uppercase text-slate-500">
            {point.date}
          </span>
        </div>
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  note,
  accent,
}: {
  title: string;
  value: string;
  note: string;
  accent: "blue" | "indigo" | "amber";
}) {
  const accentClass =
    accent === "blue"
      ? "border-blue-200"
      : accent === "indigo"
        ? "border-indigo-200"
        : "border-amber-200";
  const valueClass =
    accent === "blue"
      ? "text-slate-900"
      : accent === "indigo"
        ? "text-indigo-600"
        : "text-amber-600";
  return (
    <div className={`rounded-2xl border ${accentClass} bg-white p-4 shadow-sm`}>
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
        {title}
      </p>
      <p className={`font-mono text-3xl font-bold ${valueClass}`}>{value}</p>
      <p className="mt-2 text-xs text-slate-500">{note}</p>
    </div>
  );
}

export default function WatcherDashboard() {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <main className="ml-64 flex-1 p-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              CFO Dashboard
            </h1>
            <p className="text-slate-500">
              Market Status:{" "}
              <span className="font-bold text-emerald-500">● LIVE</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 transition-all hover:bg-slate-50"
            >
              <Plus size={18} />
              Add Funds
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
            >
              <ShieldCheck size={18} />
              Shield Active
            </button>
          </div>
        </header>

        <section className="mb-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-blue-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Active Bankroll
                </p>
                <p className="font-mono text-3xl font-bold text-slate-900">$4,820.50</p>
              </div>
              <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold text-emerald-700">
                +14.2%
              </span>
            </div>
          </div>

          <StatCard
            title="Market Edge (Avg. CLV)"
            value="+3.1%"
            note="Beating the house by 3.1% on average."
            accent="indigo"
          />

          <StatCard
            title="Current Exposure"
            value="2.5 Units"
            note="$120.50 currently at risk."
            accent="amber"
          />
        </section>

        <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Zap size={18} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Live Market</h2>
            </div>
            <div className="h-[780px] space-y-4 overflow-y-auto pr-2">
              <OddsList />
            </div>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">
                Equity Growth vs. Market EV
              </h2>
              <p className="text-sm text-slate-500">
                Comparison of actual bankroll vs. expected value growth.
              </p>
              <MiniTrendBars data={chartData} />
              <div className="mt-3 flex items-center gap-5 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                  Bankroll
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-slate-400" />
                  EV
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
              <div>
                <span className="mb-3 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs italic">
                  <AlertCircle size={14} />
                  Premium Insight
                </span>
                <h3 className="text-xl font-bold">Hedge Opportunity Detected</h3>
                <p className="text-sm opacity-80">
                  Lock in <strong>$45.20</strong> profit on Lakers vs Warriors now.
                </p>
              </div>
              <button
                type="button"
                className="rounded-2xl bg-white px-6 py-3 font-bold text-blue-700 transition-all hover:bg-slate-100"
              >
                Execute Hedge
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
