'use client';

import React from 'react';
import {
  Calculator,
  History,
  LayoutDashboard,
  LogOut,
  Settings,
  ShieldCheck,
  TrendingUp,
  Zap,
} from 'lucide-react';
import { usePathname } from 'next/navigation';

type UserProfile = {
  is_premium?: boolean;
  total_bankroll?: number;
  unit_size_percentage?: number;
} | null;

const navItems = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Live Hedges', icon: Zap, href: '/hedges', premium: true },
  { name: 'Bet History', icon: History, href: '/history' },
  { name: 'Unit Calculator', icon: Calculator, href: '/calculator' },
  { name: 'Analytics', icon: TrendingUp, href: '/analytics' },
];

export default function Sidebar({ userProfile }: { userProfile: UserProfile }) {
  const pathname = usePathname();
  const bankroll = Number(userProfile?.total_bankroll ?? 0);
  const unitSizePercentage = Number(userProfile?.unit_size_percentage ?? 0);
  const unitSize = bankroll * unitSizePercentage;

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-800 bg-slate-900">
      <div className="flex items-center gap-3 p-6">
        <div className="rounded-lg bg-blue-600 p-2">
          <ShieldCheck className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-white">WATCHER</span>
      </div>

      <nav className="mt-4 flex-1 space-y-2 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <a
              key={item.name}
              href={item.href}
              className={`group flex items-center justify-between rounded-xl px-4 py-3 transition-all ${
                isActive
                  ? 'border border-blue-600/20 bg-blue-600/10 text-blue-400'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.name}</span>
              </div>
              {item.premium && !userProfile?.is_premium && (
                <div className="rounded border border-amber-500/20 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-bold text-amber-500">
                  PRO
                </div>
              )}
            </a>
          );
        })}
      </nav>

      <div className="m-4 rounded-2xl border border-slate-700 bg-slate-800/50 p-4">
        <p className="mb-1 text-xs font-bold uppercase text-slate-500">Active Bankroll</p>
        <p className="text-xl font-mono font-bold text-white">${bankroll.toLocaleString()}</p>
        <div className="mt-3 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Unit Size:</span>
          <span className="font-bold text-emerald-400">${unitSize.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-t border-slate-800 p-4">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-400 transition-all hover:bg-slate-800 hover:text-white"
        >
          <Settings className="h-5 w-5" />
          <span className="text-sm font-medium">Settings</span>
        </button>
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-400 transition-all hover:bg-red-400/10"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-sm font-medium">Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
