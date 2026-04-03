import { Swords } from 'lucide-react';

export default function Logo() {
  return (
    <div className="flex items-center gap-3">
      <div className="bg-edge-emerald p-2 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.4)]">
        <Swords size={24} className="text-edge-navy" strokeWidth={2.5} />
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-2xl font-black text-white tracking-tighter uppercase italic">
          Edge<span className="text-edge-emerald not-italic">Wield</span>
        </span>
        <span className="text-[10px] text-slate-500 font-bold tracking-[0.3em] uppercase">
          Pro-Grade Companion
        </span>
      </div>
    </div>
  );
}
