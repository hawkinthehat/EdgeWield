import type { ReactNode } from 'react';
import './globals.css';

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
      <body>{children}</body>
    </html>
  );
}
