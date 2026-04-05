'use client'
import { Zap, Database, RefreshCw } from 'lucide-react'

type DebugPanelProps = {
  role: string
}

export default function DebugPanel({ role }: DebugPanelProps) {
  if (role !== 'admin') return null // Hidden from everyone else

  const triggerSync = async () => {
    const res = await fetch('/api/sync')
    const data = await res.json()
    alert(`Sync Complete: Found ${data.count} Edges`)
  }

  return (
    <div className="fixed bottom-6 right-6 z-[200] bg-black/80 border border-edge-emerald/50 p-4 rounded-2xl backdrop-blur-md">
      <p className="text-[10px] font-black text-edge-emerald uppercase mb-3">Admin Console</p>
      <div className="flex gap-2">
        <button
          onClick={triggerSync}
          className="bg-edge-emerald text-edge-navy px-3 py-2 rounded-lg text-[10px] font-black uppercase flex items-center gap-2"
        >
          <RefreshCw size={12} /> Force Sync
        </button>
        <button className="bg-white/10 text-white px-3 py-2 rounded-lg text-[10px] font-black uppercase">
          View API Quota
        </button>
      </div>
    </div>
  )
}
