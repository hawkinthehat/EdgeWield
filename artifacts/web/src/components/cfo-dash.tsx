import { BarChart3, TrendingUp, PieChart, ArrowUpRight, FileSpreadsheet } from 'lucide-react';
import { downloadActivityCSV, type ActivityRow } from '@/lib/export';

interface CFOStats {
  totalProfit: number;
  roi: number;
  trades: number;
}

export default function CFODash({
  stats = { totalProfit: 0, roi: 0, trades: 0 },
  activityData = [],
}: {
  stats?: CFOStats;
  activityData?: ActivityRow[];
}) {
  const projected = stats.totalProfit * 1.5;

  return (
    <div>
      {/* Header row with title + CSV export */}
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">
            CFO Terminal
          </h2>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
            Financial Audit &amp; Yield Analysis
          </p>
        </div>
        <button
          onClick={() => downloadActivityCSV(activityData)}
          disabled={activityData.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-edge-slate/30 border border-edge-border rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:border-white transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <FileSpreadsheet size={14} />
          Export Audit (.CSV)
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-edge-slate/20 border border-edge-border rounded-[2rem] hover:border-edge-emerald/40 transition-all">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-edge-emerald/10 rounded-xl">
              <TrendingUp size={18} className="text-edge-emerald" />
            </div>
            <span className="text-[10px] font-black text-edge-emerald">+12% MoM</span>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Net Realized Profit</p>
          <h3 className="text-2xl font-black text-white italic mt-1">
            ${stats.totalProfit.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </h3>
        </div>

        <div className="p-6 bg-edge-slate/20 border border-edge-border rounded-[2rem]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-500/10 rounded-xl">
              <BarChart3 size={18} className="text-blue-500" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Avg. Yield Per Arb</p>
          <h3 className="text-2xl font-black text-white italic mt-1">{stats.roi.toFixed(2)}%</h3>
        </div>

        <div className="p-6 bg-edge-slate/20 border border-edge-border rounded-[2rem]">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-500/10 rounded-xl">
              <PieChart size={18} className="text-purple-500" />
            </div>
          </div>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Missions Executed</p>
          <h3 className="text-2xl font-black text-white italic mt-1">
            {stats.trades} <span className="text-xs text-slate-500 uppercase">Trades</span>
          </h3>
        </div>

        <div className="p-6 bg-edge-emerald text-edge-navy rounded-[2rem] shadow-lg shadow-edge-emerald/20">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-edge-navy/10 rounded-xl">
              <ArrowUpRight size={18} />
            </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Projected 30D Growth</p>
          <h3 className="text-2xl font-black italic mt-1">+${projected.toFixed(2)}</h3>
        </div>
      </div>
    </div>
  );
}
