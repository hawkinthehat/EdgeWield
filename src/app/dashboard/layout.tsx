import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/auth-helpers-nextjs';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    // Keep dashboard renderable in partially configured environments.
    return <>{children}</>;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name) {
          return cookieStore.get(name)?.value;
        },
        // Layout only needs reads; writes are no-ops here.
        set() {},
        remove() {},
      },
    });
    await supabase.auth.getSession();
  } catch (error) {
    console.error('dashboard_layout_session_init_failed', error);
  }

  // if (!session) {
  //   redirect('/');
  // }

  return <>{children}</>;
}
