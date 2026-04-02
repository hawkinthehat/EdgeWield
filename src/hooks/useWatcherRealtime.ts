'use client';

import { useEffect, useMemo, useState } from 'react';
import { createClient, type RealtimeChannel } from '@supabase/supabase-js';

export type WatcherProfile = {
  id?: string;
  bankroll_size: number;
  is_pro: boolean;
};

export const useWatcherRealtime = (initialProfile: WatcherProfile) => {
  const [profile, setProfile] = useState<WatcherProfile>(initialProfile);

  useEffect(() => {
    setProfile(initialProfile);
  }, [initialProfile]);

  const supabase = useMemo(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return null;
    }

    return createClient(supabaseUrl, supabaseAnonKey);
  }, []);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const changeFilter = profile.id ? `id=eq.${profile.id}` : undefined;
    const profileSubscription: RealtimeChannel = supabase
      .channel(`profile_changes_${profile.id ?? 'all'}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'profiles',
          ...(changeFilter ? { filter: changeFilter } : {}),
        },
        (payload) => {
          const nextProfile = payload.new as Partial<WatcherProfile>;
          if (!nextProfile) {
            return;
          }

          setProfile((prev) => ({
            ...prev,
            ...(nextProfile.id ? { id: String(nextProfile.id) } : prev.id ? { id: prev.id } : {}),
            ...(nextProfile.bankroll_size !== undefined
              ? { bankroll_size: Number(nextProfile.bankroll_size) || 0 }
              : {}),
            ...(nextProfile.is_pro !== undefined ? { is_pro: Boolean(nextProfile.is_pro) } : {}),
          }));
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(profileSubscription);
    };
  }, [profile.id, supabase]);

  return { profile };
};
