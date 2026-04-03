import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard,
  Zap,
  ShieldCheck,
  Settings,
  LogOut,
  Activity,
  Wallet,
  Menu,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '@/components/logo';
import { supabase } from '@/lib/supabase';

export default function Sidebar({ userBankroll = 0 }: { userBankroll?: number }) {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Terminal', path: '/dashboard' },
    { icon: <Zap size={20} />, label: 'Active Edges', path: '/scanner' },
    { icon: <ShieldCheck size={20} />, label: 'Unit Vault', path: '/picks' },
    { icon: <Settings size={20} />, label: 'Filters', path: '/about' },
  ];

  const handleSignOut = async () => {
    if (supabase) await supabase.auth.signOut();
    window.location.href = '/';
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* BRANDING */}
      <div className="mb-12 flex items-center justify-between">
        <Link href="/" onClick={() => setOpen(false)}>
          <Logo />
        </Link>
        {/* Close button — mobile only */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden text-slate-500 hover:text-white transition-colors p-1"
        >
          <X size={20} />
        </button>
      </div>

      {/* LIVE BANKROLL CARD */}
      <div className="bg-edge-slate/30 border border-edge-border rounded-2xl p-4 mb-8">
        <div className="flex items-center gap-2 mb-2 text-slate-500">
          <Wallet size={14} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Active Bankroll</span>
        </div>
        <div className="text-2xl font-black text-white italic">
          ${userBankroll.toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="w-2 h-2 bg-edge-emerald rounded-full animate-pulse" />
          <span className="text-[9px] text-edge-emerald font-bold uppercase tracking-tighter">
            Bot Scanning...
          </span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const active = location === item.path;
          return (
            <Link key={item.label} href={item.path} onClick={() => setOpen(false)}>
              <button
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                  active
                    ? 'bg-edge-emerald text-edge-navy shadow-lg shadow-edge-emerald/10'
                    : 'text-slate-500 hover:text-white hover:bg-edge-slate/20'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            </Link>
          );
        })}
      </nav>

      {/* SYSTEM STATUS & LOGOUT */}
      <div className="pt-6 border-t border-edge-border/50">
        <div className="flex items-center gap-3 px-4 py-3 mb-4 bg-edge-emerald/5 rounded-xl border border-edge-emerald/10">
          <Activity size={16} className="text-edge-emerald" />
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-white leading-none">SYSTEM OK</span>
            <span className="text-[8px] text-slate-500 uppercase tracking-widest mt-1">
              API Latency: 42ms
            </span>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm text-red-400 hover:bg-red-400/10 transition-all"
        >
          <LogOut size={20} />
          Shutdown
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop sidebar (fixed, always visible ≥ lg) ── */}
      <div className="hidden md:flex w-72 h-screen bg-edge-navy border-r border-edge-border flex-col p-6 fixed left-0 top-0 z-40">
        <SidebarContent />
      </div>

      {/* ── Mobile hamburger button ── */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 bg-edge-slate border border-edge-border text-white p-2.5 rounded-xl shadow-lg"
        aria-label="Open menu"
      >
        <Menu size={20} />
      </button>

      {/* ── Mobile drawer overlay ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="md:hidden fixed left-0 top-0 z-50 w-72 h-screen bg-edge-navy border-r border-edge-border p-6 flex flex-col"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
