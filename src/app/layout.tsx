import type { ReactNode } from 'react';
import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import HawkLogo from '@/components/Icons/HawkLogo';

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
      <body className={`${inter.variable} ${mono.variable} bg-slate-950 font-sans text-slate-300 antialiased`}>
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-emerald-400/5 blur-[120px]" />
          <div className="absolute bottom-[0%] right-[0%] h-[30%] w-[30%] rounded-full bg-slate-500/10 blur-[120px]" />
        </div>
        <header className="sticky top-0 z-40 border-b border-slate-700/60 bg-slate-950/85 backdrop-blur">
          <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-6">
            <Link href="/" aria-label="EdgeWield home" className="flex items-center gap-2">
              <HawkLogo className="pointer-events-none h-10 w-10 shrink-0" />
              <span className="text-lg font-black uppercase tracking-tight text-[#39FF14]">EdgeWield</span>
            </Link>
            <nav className="hidden items-center gap-6 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400 md:flex">
              <Link href="/" className="transition-colors hover:text-[#39FF14]">
                Home
              </Link>
              <Link href="/settings" className="transition-colors hover:text-[#39FF14]">
                Settings
              </Link>
            </nav>
          </div>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
