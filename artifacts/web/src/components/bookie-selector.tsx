import { useState } from 'react'

const BOOKIES = ['FanDuel', 'DraftKings', 'BetMGM', 'Caesars', 'Pinnacle']

export default function BookieSelector() {
  const [selected, setSelected] = useState(['FanDuel'])

  const toggleBookie = (name: string) => {
    setSelected(prev =>
      prev.includes(name) ? prev.filter(b => b !== name) : [...prev, name]
    )
  }

  return (
    <div className="bg-edge-slate/20 p-6 rounded-3xl border border-edge-border">
      <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-4">Active Bookies</h3>
      <div className="flex flex-wrap gap-2">
        {BOOKIES.map(bookie => (
          <button
            key={bookie}
            onClick={() => toggleBookie(bookie)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selected.includes(bookie)
                ? 'bg-edge-emerald text-edge-navy shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-edge-navy text-slate-500 border border-edge-border'
            }`}
          >
            {bookie}
          </button>
        ))}
      </div>
    </div>
  )
}
