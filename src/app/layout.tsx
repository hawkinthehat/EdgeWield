import type { ReactNode } from 'react';

export const metadata = {
  title: 'EdgeWield',
  description: 'Professional Arbitrage Terminal',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
