'use client';

import { useRehearsalToday } from '@/hooks/useRehearsalToday';

export default function RehearsalTodayBanner() {
  const rehearsal = useRehearsalToday();
  if (!rehearsal) return null;

  return (
    <div className="bg-purple-50 border border-purple-200 text-purple-800 rounded-2xl px-5 py-4 text-sm font-medium flex items-center gap-3">
      <span className="text-2xl">🥁</span>
      <div>
        <p className="font-bold text-purple-700">오늘은 {rehearsal.order}번째 합주입니다!</p>
        <p className="text-purple-600 text-xs mt-0.5">합주 시간: <span className="font-semibold">{rehearsal.time}</span></p>
      </div>
    </div>
  );
}
