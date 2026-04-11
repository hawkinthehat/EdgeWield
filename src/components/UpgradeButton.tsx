'use client';

import { Zap } from 'lucide-react';

type UpgradeButtonProps = {
  userId: string;
  email: string;
  plan?: 'scout' | 'pro';
  label?: string;
};

export default function UpgradeButton({ userId, email, plan = 'pro', label = 'UPGRADE TO PRO SCANNER' }: UpgradeButtonProps) {
  const handleUpgrade = async () => {
    const response = await fetch('/api/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, email, plan }),
    });
    const payload = (await response.json()) as { url?: string };
    if (payload.url) {
      window.location.href = payload.url;
    }
  };

  return (
    <button
      type="button"
      onClick={handleUpgrade}
      className="flex w-full items-center justify-center gap-3 rounded-2xl bg-emerald-400 p-4 font-black text-zinc-950 shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-transform hover:scale-105"
    >
      <Zap size={20} fill="currentColor" />
      {label}
    </button>
  );
}
