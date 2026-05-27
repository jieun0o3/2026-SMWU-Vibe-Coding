'use client';

import { useRehearsalToday } from '@/hooks/useRehearsalToday';

export default function RehearsalTodayBanner() {
  const rehearsal = useRehearsalToday();
  if (!rehearsal) return null;

  return (
    <div className="bg-amber-50 border border-amber-300 text-amber-800 rounded-lg px-4 py-3 text-sm font-medium">
      🥁 오늘은 <span className="font-bold">{rehearsal.order}번째 합주</span>입니다! 합주 시간: <span className="font-bold">{rehearsal.time}</span>
    </div>
  );
}
