import { supabase } from './supabase'

export async function getSubscriptionStatus(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('is_pro, role')
    .eq('id', userId)
    .single()

  if (error) return { isPro: false, isAdmin: false }

  // If you are an admin, you are ALWAYS a Pro
  const isPro = data.role === 'admin' || data.is_pro === true

  return {
    isPro,
    isAdmin: data.role === 'admin',
  }
}
