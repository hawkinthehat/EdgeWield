"use client";

import { BarChart3, Home, Shield, Wallet } from "lucide-react";

const navItems = [
  { label: "Overview", icon: Home },
  { label: "Portfolio", icon: Wallet },
  { label: "Risk Shield", icon: Shield },
  { label: "Performance", icon: BarChart3 },
];

export default function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col border-r border-slate-200 bg-white p-6">
      <div className="mb-8">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Vantedge
        </p>
        <h2 className="text-2xl font-black text-slate-900">Watcher</h2>
      </div>
      <nav className="space-y-2">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = index === 0;
          return (
            <button
              key={item.label}
              type="button"
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "bg-slate-50 text-slate-700 hover:bg-slate-100"
              }`}
            >
              <Icon size={16} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <div className="mt-auto rounded-2xl border border-blue-200 bg-blue-50 p-3">
        <p className="text-[10px] font-bold uppercase tracking-widest text-blue-700">
          Status
        </p>
        <p className="text-sm font-semibold text-blue-800">Shield Active</p>
      </div>
    </aside>
  );
}
