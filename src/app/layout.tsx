import type { ReactNode } from 'react';
import './globals.css';
import { Inter, JetBrains_Mono } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const mono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono' });

export const metadata = {
  title: 'EdgeWield',
  description: 'Professional Arbitrage Terminal',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${mono.variable} bg-[#020203] font-sans text-slate-300 antialiased`}>
        <div className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -left-[10%] -top-[10%] h-[40%] w-[40%] rounded-full bg-edge-emerald/5 blur-[120px]" />
          <div className="absolute bottom-[0%] right-[0%] h-[30%] w-[30%] rounded-full bg-blue-500/5 blur-[120px]" />
        </div>
        {children}
      </body>
    </html>
  );
}
