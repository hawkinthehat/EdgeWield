import { Clock, CheckCircle2 } from 'lucide-react';

export interface ActivityEntry {
  id: string;
  event_name: string;
  profit_amount: number;
  roi_percent: number;
  executed_at: string;
}

interface ActivityLogProps {
  history?: ActivityEntry[];
}

export default function ActivityLog({ history = [] }: ActivityLogProps) {
  const lifetimeProfit = history.reduce((sum, a) => sum + (a.profit_amount ?? 0), 0);

  return (
    <div className="bg-edge-slate/10 border border-edge-border rounded-[2.5rem] p-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Clock className="text-slate-500" size={18} />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">
            Mission History
          </h3>
        </div>
        <div className="text-[10px] font-bold text-edge-emerald uppercase tracking-widest">
          Lifetime Profit:{' '}
          <span className="text-white">
            {lifetimeProfit >= 0 ? '+' : ''}${lifetimeProfit.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {history.length > 0 ? (
          history.map((act) => (
            <div
              key={act.id}
              className="flex items-center justify-between p-4 bg-edge-navy/50 border border-edge-border/50 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="bg-edge-emerald/10 p-2 rounded-lg">
                  <CheckCircle2 size={16} className="text-edge-emerald" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{act.event_name}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold">
                    {new Date(act.executed_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-edge-emerald">
                  +${Number(act.profit_amount).toFixed(2)}
                </p>
                <p className="text-[9px] text-slate-500 font-bold uppercase">
                  {act.roi_percent}% ROI
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-edge-border rounded-2xl">
            <p className="text-xs font-bold text-slate-600 uppercase">
              No missions executed yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
