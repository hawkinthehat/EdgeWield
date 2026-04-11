'use client';

import { useState, type ReactNode } from 'react';

type CheckoutButtonProps = {
  plan: 'scout' | 'pro';
  foundingMemberCodeInputId?: string;
  className?: string;
  children: ReactNode;
};

export default function CheckoutButton({
  plan,
  foundingMemberCodeInputId,
  className,
  children,
}: CheckoutButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);
      const foundingMemberCode =
        foundingMemberCodeInputId && typeof document !== 'undefined'
          ? (document.getElementById(foundingMemberCodeInputId) as HTMLInputElement | null)?.value?.trim()
          : '';

      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, foundingMemberCode }),
      });

      const payload = (await response.json().catch(() => ({}))) as { url?: string; error?: string };
      if (!response.ok) {
        if (payload.error && typeof window !== 'undefined') {
          window.alert(payload.error);
        }
        return;
      }

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
