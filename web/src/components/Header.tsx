'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Performance } from '@/types';

function getDday(perfDate: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const perf = new Date(perfDate);
  perf.setHours(0, 0, 0, 0);
  const diff = Math.round((perf.getTime() - today.getTime()) / 86400000);
  if (diff > 0) return `공연 D-${diff}`;
  if (diff === 0) return 'D-Day! 오늘 공연입니다 🎤';
  return '공연 완료';
}

const NAV_LINKS = [
  { href: '/schedule', label: '개인 일정' },
  { href: '/calendar', label: '캘린더' },
  { href: '/planner', label: '합주 배분' },
];

export default function Header() {
  const [performance, setPerformance] = useState<Performance | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    fetch('/api/performance').then((r) => r.json()).then(setPerformance);
  }, []);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-10 shadow-sm">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-bold text-lg text-purple-700 tracking-tight">
          🎸 합주 매니저
        </Link>
        <nav className="flex gap-1 text-sm">
          {NAV_LINKS.map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`px-3 py-1.5 rounded-lg font-medium transition ${
                  active
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:text-purple-700 hover:bg-purple-50'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
      {performance && (
        <div className="bg-purple-600 text-white text-center text-xs py-1.5 font-medium tracking-wide">
          {performance.name && <span className="opacity-80 mr-1">{performance.name} ·</span>}
          <span>{getDday(performance.date)}</span>
        </div>
      )}
    </header>
  );
}
