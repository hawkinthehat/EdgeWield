import { supabase } from './supabase'

export async function signInWithEmail(email: string) {
  if (!supabase) return { data: null, error: new Error('Supabase is not configured') }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  })
  return { data, error }
}

export async function signOut() {
  if (!supabase) return { error: new Error('Supabase is not configured') }
  const { error } = await supabase.auth.signOut()
  return { error }
}
