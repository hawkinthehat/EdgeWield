'use client';

import { useState } from 'react';
import { Target, Zap, Wallet, BarChart3, ShieldAlert } from 'lucide-react';

export default function UnifiedDashboard() {
  const [activeTab, setActiveTab] = useState('edge');

  const renderContent = () => {
    switch (activeTab) {
      case 'edge':
        return (
          <div className="rounded-3xl border border-blue-500/20 bg-blue-600/5 p-8 text-center italic animate-pulse">
            Scanning Market Inefficiencies...
          </div>
        );
      case 'arb':
        return (
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-600/5 p-8 text-center italic">
            Calculating Risk-Free Arbitrage...
          </div>
        );
      case 'cfo':
        return (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center italic">
            CFO Bankroll Manager Offline
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-[#050608] text-slate-300 font-sans">
      <aside className="w-20 bg-[#0A0B10] border-r border-white/5 flex flex-col items-center py-10 gap-10">
        <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <Zap size={22} fill="white" className="text-white" />
        </div>

        <nav className="flex flex-col gap-8">
          <button
            type="button"
            onClick={() => setActiveTab('edge')}
            className={`p-3 rounded-xl transition-all ${
              activeTab === 'edge' ? 'bg-blue-600/20 text-blue-500' : 'text-slate-600 hover:text-white'
            }`}
            aria-label="Open edge scanner mode"
          >
            <Target size={24} />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('arb')}
            className={`p-3 rounded-xl transition-all ${
              activeTab === 'arb'
                ? 'bg-emerald-600/20 text-emerald-500'
                : 'text-slate-600 hover:text-white'
            }`}
            aria-label="Open arbitrage finder mode"
          >
            <BarChart3 size={24} />
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('cfo')}
            className={`p-3 rounded-xl transition-all ${
              activeTab === 'cfo' ? 'bg-white/10 text-white' : 'text-slate-600 hover:text-white'
            }`}
            aria-label="Open bankroll manager mode"
          >
            <Wallet size={24} />
          </button>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 bg-[#050608]/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-[0.3em] italic text-white">
              System Status: <span className="text-blue-500">Active</span>
            </h2>
          </div>
          <div className="flex gap-6 items-center">
            <div className="text-right">
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">Global PnL</p>
              <p className="text-sm font-black text-emerald-500">+$2,410.50</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
              JD
            </div>
          </div>
        </header>

        <section className="flex-1 p-10 overflow-y-auto">
          <div className="max-w-4xl">
            <h3 className="text-3xl font-black italic uppercase text-white mb-8 tracking-tighter">
              {activeTab === 'edge' && 'Edge Scanner'}
              {activeTab === 'arb' && 'Arbitrage Finder'}
              {activeTab === 'cfo' && 'Bankroll Manager'}
            </h3>

            {renderContent()}
          </div>
        </section>
      </main>

      <aside className="w-80 border-l border-white/5 bg-[#0A0B10]/50 p-8 hidden xl:block">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
          <ShieldAlert size={14} className="text-red-500" /> Critical Pulse
        </h4>
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
            <p className="text-xs font-bold text-white mb-1">Market Volatility High</p>
            <p className="text-[10px] text-slate-500">NFL lines moving rapidly in 4 markets.</p>
          </div>
        </div>
      </aside>
    </div>
  );
}
