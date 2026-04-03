import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { ActivityEntry } from '@/components/activity-log';

export function useActivity(userId: string | null) {
  const [history, setHistory] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase || !userId) {
      setLoading(false);
      return;
    }

    supabase
      .from('user_activity')
      .select('id, event_name, profit_amount, roi_percent, executed_at')
      .eq('user_id', userId)
      .order('executed_at', { ascending: false })
      .limit(50)
      .then(({ data }) => {
        setHistory((data as ActivityEntry[]) ?? []);
        setLoading(false);
      });
  }, [userId]);

  return { history, loading };
}
