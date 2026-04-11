'use client';

import Link from 'next/link';
import AppLogo from '@/components/Icons/AppLogo';

export default function Header() {
  const settingsPath = '/settings';

  return (
    <nav className="fixed left-0 right-0 top-0 z-30 h-20 border-b border-slate-800 bg-slate-900/80 px-6 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-[1600px] items-center">
        <div className="flex flex-1 items-center">
          <Link href="/" aria-label="EdgeWield Pro home" className="flex items-center gap-3">
            <AppLogo className="pointer-events-none h-8 w-8 shrink-0" />
            <span className="text-xl font-black uppercase tracking-tight text-slate-100">EdgeWield Pro</span>
          </Link>
        </div>

        <nav className="hidden flex-1 items-center justify-center gap-8 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300 md:flex">
          <Link href="/" className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-800/80 hover:text-emerald-300">
            Home
          </Link>
          <Link
            href={settingsPath}
            className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-800/80 hover:text-emerald-300"
          >
            Settings
          </Link>
        </nav>

        <div className="hidden flex-1 justify-end lg:flex">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
            Institutional Vision. Predatory Precision.
          </span>
        </div>
      </div>
    </nav>
  );
}
