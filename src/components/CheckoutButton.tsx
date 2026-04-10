'use client';

import { useState, type ReactNode } from 'react';

type CheckoutButtonProps = {
  plan: 'scout' | 'pro';
  className?: string;
  children: ReactNode;
};

export default function CheckoutButton({ plan, className, children }: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        return;
      }

      const payload = (await response.json()) as { url?: string };
      if (payload.url) {
        window.location.href = payload.url;
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button type="button" onClick={handleCheckout} className={className} disabled={isLoading}>
      {isLoading ? 'Redirecting...' : children}
    </button>
  );
}
