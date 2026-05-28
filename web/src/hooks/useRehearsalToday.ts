import { useEffect, useState } from 'react';
import { RehearsalSession } from '@/types';
import { toLocalISO } from '@/lib/utils';

export function useRehearsalToday() {
  const [todayRehearsal, setTodayRehearsal] = useState<RehearsalSession | null>(null);

  useEffect(() => {
    const todayISO = toLocalISO(new Date());
    fetch('/api/rehearsals')
      .then((r) => r.json())
      .then((sessions: RehearsalSession[]) => {
        setTodayRehearsal(sessions.find((s) => s.date === todayISO) ?? null);
      });
  }, []);

  return todayRehearsal;
}
