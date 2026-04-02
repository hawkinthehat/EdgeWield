"use server";

import { createServerActionClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type OnboardingRisk = "Conservative" | "Standard" | "Aggressive";

type FinalizeOnboardingInput = {
  bankroll: number;
  risk: OnboardingRisk | string;
  activeBookies?: string[];
};

const RISK_MAP: Record<OnboardingRisk, number> = {
  Conservative: 0.005,
  Standard: 0.01,
  Aggressive: 0.02,
};

export async function finalizeOnboarding(formData: FinalizeOnboardingInput) {
  const supabase = createServerActionClient({ cookies });
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized access");
  }

  const risk = (formData.risk ?? "Standard").toString() as OnboardingRisk;
  const unitPercent = RISK_MAP[risk] ?? RISK_MAP.Standard;
  const activeBookies = Array.isArray(formData.activeBookies)
    ? formData.activeBookies.map((book) => String(book).toLowerCase())
    : ["fanduel", "draftkings", "betmgm"];

  const { error } = await supabase
    .from("profiles")
    .update({
      total_bankroll: formData.bankroll,
      unit_size_percentage: unitPercent,
      risk_tolerance: risk,
      active_bookies: activeBookies,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  if (error) {
    console.error("Supabase update error:", error);
    return { success: false, message: error.message };
  }

  redirect("/dashboard");
}
