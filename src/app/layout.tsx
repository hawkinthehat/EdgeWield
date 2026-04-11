import type { ReactNode } from 'react';
import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import GoldenEagleCrest from '@/components/Icons/Logo';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'EdgeWield',
  description: 'Professional Arbitrage Terminal',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} bg-[#0f172a] font-sans text-slate-300 antialiased`}>
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-[8%] -top-[8%] h-[38%] w-[38%] rounded-full bg-emerald-400/5 blur-[120px]" />
          <div className="absolute bottom-[0%] right-[0%] h-[30%] w-[30%] rounded-full bg-slate-500/8 blur-[120px]" />
        </div>
        <header className="fixed left-0 right-0 top-0 z-[120] border-b border-slate-700/70 bg-[#0f172a]/95 backdrop-blur">
          <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
            <Link href="/" aria-label="EdgeWield home" className="flex items-center gap-3">
              <GoldenEagleCrest className="pointer-events-none h-11 w-11 shrink-0" />
              <span className="flex flex-col leading-tight">
                <span className="text-lg font-black uppercase tracking-tight text-[#39FF14]">EdgeWield Pro</span>
                <span className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-400">
                  Golden Eagle Terminal
                </span>
              </span>
            </Link>
            <nav className="hidden items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300 md:flex">
              <Link
                href="/"
                className="rounded-lg px-4 py-2 transition-colors hover:bg-slate-800/80 hover:text-[#39FF14]"
              >
                Home
              </Link>
              <Link
                href="/settings"
                className="rounded-lg px-4 py-2 transition-colors hover:bg-slate-800/80 hover:text-[#39FF14]"
              >
                Settings
              </Link>
            </nav>
          </div>
        </header>
        <main className="pt-20">{children}</main>
      </body>
    </html>
  );
}
