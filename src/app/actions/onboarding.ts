'use server';

import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

type FinalizeOnboardingInput = {
  bankroll: number;
  risk: string;
};

const riskMap: Record<string, number> = {
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
    throw new Error('Unauthorized access');
  }

  const bankroll = Number(formData.bankroll);
  if (!Number.isFinite(bankroll) || bankroll <= 0) {
    return { success: false, message: 'Bankroll must be greater than 0' };
  }

  const unitPercent = riskMap[formData.risk] ?? 0.01;
  const { error } = await supabase
    .from('profiles')
    .update({
      total_bankroll: bankroll,
      bankroll_size: bankroll,
      unit_size_percentage: unitPercent,
      risk_tolerance: formData.risk,
      onboarding_completed: true,
    })
    .eq('id', user.id);

  if (error) {
    console.error('Supabase Update Error:', error);
    return { success: false, message: error.message };
  }

  redirect('/dashboard');
}
