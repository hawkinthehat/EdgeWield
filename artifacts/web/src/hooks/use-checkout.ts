import { useState } from "react";

const REF_KEY = "ew-ref-code";

/** Call on app mount to capture ?ref=CODE from the URL and persist it */
export function captureReferralCode(): void {
  const params = new URLSearchParams(window.location.search);
  const ref = params.get("ref");
  if (ref) {
    localStorage.setItem(REF_KEY, ref.toUpperCase());
  }
}

/** Read the stored referral code */
export function getStoredReferralCode(): string | null {
  return localStorage.getItem(REF_KEY);
}

export function useCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (
    email?: string,
    userId?: string,
    tier: "standard" | "pro" = "pro",
    referralCode?: string
  ) => {
    setIsLoading(true);
    setError(null);

    // Prefer an explicit code; fall back to whatever ?ref= was captured at landing
    const resolvedCode = referralCode ?? getStoredReferralCode() ?? undefined;

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, userId, tier, referralCode: resolvedCode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Checkout failed");
      if (data.url) window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return { startCheckout, isLoading, error };
}
