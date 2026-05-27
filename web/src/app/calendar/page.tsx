'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RehearsalSession } from '@/types';

function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

// 타임존 안전한 날짜 포맷 (로컬 날짜 기준)
function toLocalISO(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function CalendarPage() {
  const [rehearsals, setRehearsals] = useState<RehearsalSession[]>([]);
  const [viewDate, setViewDate] = useState(new Date());

  const todayISO = toLocalISO(new Date());
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = getMonthDays(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  useEffect(() => {
    fetch('/api/rehearsals').then((r) => r.json()).then(setRehearsals);
  }, []);

  const rehearsalMap = new Map(rehearsals.map((r) => [r.date, r]));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const remaining = rehearsals.filter((r) => new Date(r.date + 'T00:00:00') >= today).length;
  const upcoming = rehearsals
    .filter((r) => new Date(r.date + 'T00:00:00') >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">합주 캘린더</h1>
        <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
          남은 합주: {remaining}회
        </span>
      </div>

      {rehearsals.length === 0 && (
        <p className="text-sm text-amber-600 bg-amber-50 rounded px-3 py-2">
          아직 합주 일정이 없습니다.{' '}
          <Link href="/planner" className="underline font-medium">합주 배분</Link>에서 일정을 잡아보세요.
        </p>
      )}

      {/* 월 이동 */}
      <div className="flex items-center justify-between">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="px-3 py-1 rounded border text-sm hover:bg-gray-50">◀ 이전</button>
        <span className="font-semibold">{year}년 {month + 1}월</span>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="px-3 py-1 rounded border text-sm hover:bg-gray-50">다음 ▶</button>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400">
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
          <div key={d} className="py-1 font-semibold">{d}</div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
        {days.map((d) => {
          const iso = toLocalISO(d);
          const rehearsal = rehearsalMap.get(iso);
          const isToday = iso === todayISO;
          return (
            <div
              key={iso}
              className={`rounded-lg p-1 min-h-[52px] text-sm border flex flex-col items-center gap-0.5
                ${isToday ? 'border-blue-400 bg-blue-50' : 'border-gray-100 bg-white'}
                ${rehearsal ? 'bg-indigo-50 border-indigo-300' : ''}
              `}
            >
              <span className={`text-xs font-medium ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {d.getDate()}
              </span>
              {rehearsal && (
                <Link
                  href={`/rehearsal/${rehearsal.id}`}
                  className="text-[10px] bg-indigo-600 text-white rounded px-1 py-0.5 leading-tight hover:bg-indigo-700 transition text-center w-full"
                >
                  {rehearsal.order}번째
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* 다가오는 합주 목록 */}
      {upcoming.length > 0 && (
        <section className="space-y-2 pt-2">
          <h2 className="font-semibold text-gray-700">다가오는 합주</h2>
          <ul className="space-y-2">
            {upcoming.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/rehearsal/${r.id}`}
                  className="flex items-center justify-between border rounded-lg px-4 py-3 bg-white hover:border-indigo-400 hover:shadow-sm transition"
                >
                  <div>
                    <span className="font-medium text-indigo-700">{r.order}번째 합주</span>
                    <span className="ml-3 text-sm text-gray-500">{r.date} {r.time}</span>
                  </div>
                  <span className="text-xs text-gray-400">상세 →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
