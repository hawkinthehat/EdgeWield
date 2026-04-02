'use client';

import { AlertCircle, Plus, ShieldCheck, TrendingUp, Zap } from 'lucide-react';
import CFODash from '@/components/Terminal/CFODash';
import ArbFeed, { sampleRows } from '@/components/Terminal/ArbFeed';

export default function WatcherDashboard() {
  const chartData = [
    { date: 'Mar 24', bankroll: 4200, ev: 4100 },
    { date: 'Mar 25', bankroll: 4150, ev: 4250 },
    { date: 'Mar 26', bankroll: 4400, ev: 4350 },
    { date: 'Mar 27', bankroll: 4820, ev: 4600 },
  ];

  const latest = chartData[chartData.length - 1];
  const previous = chartData[chartData.length - 2];
  const dayDelta = latest.bankroll - previous.bankroll;

  return (
    <div className="flex min-h-screen bg-slate-50">
      <main className="flex-1 p-8">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">CFO Dashboard</h1>
            <p className="text-slate-500">
              Market Status: <span className="font-bold text-emerald-500">LIVE</span>
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 font-bold text-slate-700 transition-all hover:bg-slate-50"
            >
              <Plus size={18} /> Add Funds
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 font-bold text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700"
            >
              <ShieldCheck size={18} /> Shield Active
            </button>
          </div>
        </header>

        <CFODash />

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Active Bankroll</p>
            <p className="mt-2 font-mono text-3xl font-bold text-slate-900">${latest.bankroll.toLocaleString()}</p>
            <p className={`mt-2 text-xs font-semibold ${dayDelta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {dayDelta >= 0 ? '+' : ''}
              {dayDelta.toLocaleString()} vs prior day
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Market Edge (Avg. CLV)</p>
            <p className="mt-2 font-mono text-3xl font-bold text-indigo-600">+3.1%</p>
            <p className="mt-2 text-xs text-slate-400">Beating the market by 3.1% on average.</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Current Exposure</p>
            <p className="mt-2 font-mono text-3xl font-bold text-amber-600">2.5 Units</p>
            <p className="mt-2 text-xs text-slate-400">$120.50 currently at risk.</p>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <div className="mb-4 flex items-center gap-2">
              <Zap size={18} className="text-blue-600" />
              <h2 className="text-lg font-bold text-slate-900">Live Market</h2>
            </div>
            <div className="h-[600px] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
              <ArbFeed filter="all" locked={false} rows={sampleRows} />
            </div>
          </div>

          <div className="space-y-8 lg:col-span-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-slate-900">Equity Growth vs. Market EV</h2>
              <p className="mt-1 text-sm text-slate-500">Actual bankroll compared with expected value growth.</p>
              <div className="mt-6 space-y-3">
                {chartData.map((point) => (
                  <div key={point.date} className="grid grid-cols-[80px_1fr_1fr] items-center gap-3 text-sm">
                    <span className="font-semibold text-slate-500">{point.date}</span>
                    <div className="rounded-lg bg-blue-50 px-3 py-2 text-blue-700">
                      Bankroll ${point.bankroll.toLocaleString()}
                    </div>
                    <div className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700">EV ${point.ev.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white shadow-xl">
              <div>
                <p className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/20 px-2 py-1 text-xs font-semibold">
                  <TrendingUp size={12} /> Premium Insight
                </p>
                <h3 className="text-xl font-bold">Hedge Opportunity Detected</h3>
                <p className="mt-1 text-sm text-blue-100">
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

            <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <p className="text-xs">
                This dashboard currently renders mock chart values. Wire it to live `bets` and `profiles` data before
                production.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
