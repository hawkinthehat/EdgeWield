import type { ReactNode } from 'react';
import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';
import Link from 'next/link';
import AppLogo from '@/components/Icons/AppLogo';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'EdgeWield Pro',
  description: 'Professional trading command center',
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
          <div className="absolute -left-[8%] -top-[8%] h-[38%] w-[38%] rounded-full bg-emerald-400/5 blur-[120px]" />
          <div className="absolute bottom-[0%] right-[0%] h-[30%] w-[30%] rounded-full bg-slate-500/8 blur-[120px]" />
        </div>
        <header className="fixed left-0 right-0 top-0 z-[120] border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-6">
            <Link href="/" aria-label="EdgeWield Pro home" className="flex items-center gap-2">
              <AppLogo className="pointer-events-none shrink-0" />
              <span className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-200">EdgeWield Pro</span>
            </Link>
            <nav className="hidden items-center gap-6 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-300 md:flex">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-800/80 hover:text-emerald-300"
              >
                Home
              </Link>
              <Link
                href="/settings"
                className="rounded-lg px-3 py-2 transition-colors hover:bg-slate-800/80 hover:text-emerald-300"
              >
                Settings
              </Link>
            </nav>
          </div>
        </header>
        <main className="pt-16">{children}</main>
      </body>
    </html>
  );
}
