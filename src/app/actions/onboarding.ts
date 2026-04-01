'use server'

import { createServerActionClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const riskMap: Record<string, number> = {
  Conservative: 0.005,
  Standard: 0.01,
  Aggressive: 0.02,
}

type FinalizeOnboardingInput = {
  bankroll: number
  risk: string
}

export async function finalizeOnboarding(formData: FinalizeOnboardingInput) {
  const supabase = createServerActionClient({ cookies })

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Unauthorized access')
  }

  const unitPercent = riskMap[formData.risk] ?? riskMap.Standard

  const { error } = await supabase
    .from('profiles')
    .update({
      bankroll_size: formData.bankroll,
      unit_size_percentage: unitPercent,
      risk_tolerance: formData.risk,
      onboarding_completed: true,
    })
    .eq('id', user.id)

  if (error) {
    console.error('Supabase Update Error:', error)
    return { success: false, message: error.message }
  }

  redirect('/dashboard')
}
