import { createClient, type AuthError } from '@supabase/supabase-js';

type SignInResult = {
  data: unknown;
  error: AuthError | null;
};

function getBrowserSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return null;
  }

  return createClient(url, anonKey);
}

export async function signInWithEmail(email: string): Promise<SignInResult> {
  const supabase = getBrowserSupabaseClient();
  if (!supabase) {
    return { data: null, error: null };
  }

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${window.location.origin}/dashboard`,
    },
  });

  return { data, error };
}

export async function signOut() {
  const supabase = getBrowserSupabaseClient();
  if (!supabase) {
    return { error: null };
  }
  const { error } = await supabase.auth.signOut();
  return { error };
}
