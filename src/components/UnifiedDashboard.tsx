'use client';

import { useState } from 'react';
import { Activity, Bell, Target, Wallet, Zap } from 'lucide-react';
import EdgeScanner from '@/components/Terminal/EdgeScanner';

export default function UnifiedDashboard() {
  const [activeTab, setActiveTab] = useState('scanner');

  return (
    <div className="flex h-screen bg-[#0A0B10] text-slate-200">
      <aside className="flex w-20 flex-col items-center gap-8 border-r border-white/5 py-8">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-500/20">
          <Zap size={24} fill="white" />
        </div>
        <nav className="flex flex-col gap-6">
          <button
            type="button"
            onClick={() => setActiveTab('scanner')}
            className={`rounded-xl p-4 ${
              activeTab === 'scanner' ? 'bg-blue-600/10 text-blue-500' : 'text-slate-500'
            }`}
            aria-label="Open scanner mode"
          >
            <Target size={20} />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('steam')}
            className={`rounded-xl p-4 ${
              activeTab === 'steam' ? 'bg-blue-600/10 text-blue-500' : 'text-slate-500'
            }`}
            aria-label="Open steam mode"
          >
            <Activity size={20} />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cfo')}
            className={`rounded-xl p-4 ${
              activeTab === 'cfo' ? 'bg-blue-600/10 text-blue-500' : 'text-slate-500'
            }`}
            aria-label="Open CFO mode"
          >
            <Wallet size={20} />
          </button>
        </nav>
      </aside>

      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-20 items-center justify-between border-b border-white/5 px-10">
          <h2 className="text-sm font-black uppercase tracking-widest italic">
            Mode: <span className="text-blue-500">{activeTab}</span>
          </h2>
          <div className="flex items-center gap-4">
            <div className="border-r border-white/10 px-4 text-right">
              <p className="text-[10px] font-bold uppercase text-slate-500">Bankroll</p>
              <p className="text-sm font-black text-white">$12,450.00</p>
            </div>
            <Bell size={18} className="text-slate-500" />
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-10">
          {activeTab === 'scanner' && <EdgeScanner bets={[]} />}
          {activeTab === 'steam' && (
            <div className="py-20 text-center italic opacity-20">Scanning Sharp Money Flows...</div>
          )}
          {activeTab === 'cfo' && (
            <div className="py-20 text-center italic opacity-20">Bankroll Manager Loading...</div>
          )}
        </section>
      </main>
    </div>
  );
}
