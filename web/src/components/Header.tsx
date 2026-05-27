'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Performance } from '@/types';

function getDday(perfDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const perf = new Date(perfDate);
  perf.setHours(0, 0, 0, 0);
  const diff = Math.round((perf.getTime() - today.getTime()) / 86400000);
  if (diff > 0) return `공연 D-${diff}`;
  if (diff === 0) return 'D-Day! 오늘 공연입니다';
  return '공연 완료';
}

export default function Header() {
  const [performance, setPerformance] = useState<Performance | null>(null);

  useEffect(() => {
    fetch('/api/performance').then((r) => r.json()).then(setPerformance);
  }, []);

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-indigo-700">🎸 합주 매니저</Link>
        <nav className="flex gap-4 text-sm">
          <Link href="/schedule" className="text-gray-600 hover:text-indigo-600 transition">개인 일정</Link>
          <Link href="/calendar" className="text-gray-600 hover:text-indigo-600 transition">캘린더</Link>
          <Link href="/planner" className="text-gray-600 hover:text-indigo-600 transition">합주 배분</Link>
        </nav>
      </div>
      {performance && (
        <div className="bg-indigo-600 text-white text-center text-xs py-1">
          {performance.name && <span>{performance.name} · </span>}
          <span className="font-semibold">{getDday(performance.date)}</span>
        </div>
      )}
    </header>
  );
}
