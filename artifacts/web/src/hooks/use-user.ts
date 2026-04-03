import { useState, useEffect } from 'react'
import { supabase, type SupabaseUser } from '@/lib/supabase'

type UserState = {
  user: SupabaseUser | null
  loading: boolean
}

export function useUser(): UserState {
  const [state, setState] = useState<UserState>({ user: null, loading: true })

  useEffect(() => {
    if (!supabase) {
      setState({ user: null, loading: false })
      return
    }

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        setState({ user: null, loading: false })
        return
      }

      const { data: profile } = await supabase!
        .from('profiles')
        .select('is_pro')
        .eq('id', session.user.id)
        .single()

      setState({
        user: {
          id: session.user.id,
          email: session.user.email ?? '',
          is_pro: profile?.is_pro ?? false,
        },
        loading: false,
      })
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session?.user) {
        setState({ user: null, loading: false })
        return
      }

      const { data: profile } = await supabase!
        .from('profiles')
        .select('is_pro')
        .eq('id', session.user.id)
        .single()

      setState({
        user: {
          id: session.user.id,
          email: session.user.email ?? '',
          is_pro: profile?.is_pro ?? false,
        },
        loading: false,
      })
    })

    return () => subscription.unsubscribe()
  }, [])

  return state
}
