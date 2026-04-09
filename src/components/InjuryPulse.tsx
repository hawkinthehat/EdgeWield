'use client';

import { Clock } from 'lucide-react';
import { defaultInjuryPulseUpdates, type InjuryUpdate } from '@/lib/news';

interface InjuryPulseProps {
  updates?: InjuryUpdate[];
}

export default function InjuryPulse({ updates }: InjuryPulseProps) {
  const pulseUpdates = updates ?? defaultInjuryPulseUpdates;

  return (
    <div className="space-y-4">
      {pulseUpdates.map((update) => (
        <div
          key={update.id}
          className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition-all hover:border-edge-emerald/30"
        >
          <div className="mb-2 flex items-start justify-between">
            <div>
              <h4 className="text-sm font-black text-white">{update.player}</h4>
              <p className="text-[10px] font-bold uppercase text-slate-500">{update.team}</p>
            </div>
            <span
              className={`rounded px-2 py-1 text-[9px] font-black tracking-tighter ${
                update.status === 'OUT'
                  ? 'bg-red-500/20 text-red-400'
                  : update.status === 'QUESTIONABLE'
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-sky-500/20 text-sky-400'
              }`}
            >
              {update.status}
            </span>
          </div>
          <p className="mb-3 text-[11px] leading-snug text-slate-400">{update.details}</p>
          <div className="flex items-center gap-1 text-[9px] font-bold uppercase text-slate-600">
            <Clock size={10} /> {update.time}
          </div>
        </div>
      ))}
    </div>
  );
}
