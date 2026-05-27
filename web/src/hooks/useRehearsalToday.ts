'use client';

import { useEffect, useState } from 'react';
import { RehearsalSession } from '@/types';

export function useRehearsalToday() {
  const [todayRehearsal, setTodayRehearsal] = useState<RehearsalSession | null>(null);

  useEffect(() => {
    const todayISO = new Date().toISOString().slice(0, 10);
    fetch('/api/rehearsals')
      .then((r) => r.json())
      .then((sessions: RehearsalSession[]) => {
        const found = sessions.find((s) => s.date === todayISO) ?? null;
        setTodayRehearsal(found);
      });
  }, []);

  return todayRehearsal;
}
