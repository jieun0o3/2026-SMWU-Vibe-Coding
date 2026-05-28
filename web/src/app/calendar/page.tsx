'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RehearsalSession } from '@/types';
import { toLocalISO } from '@/lib/utils';

function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
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
  const allDone = rehearsals.length > 0 && remaining === 0;
  const upcoming = rehearsals
    .filter((r) => new Date(r.date + 'T00:00:00') >= today)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">합주 캘린더</h1>
        <span className={`text-sm font-semibold px-3 py-1.5 rounded-full ${
          allDone
            ? 'bg-green-100 text-green-700'
            : 'bg-purple-100 text-purple-700'
        }`}>
          {allDone ? '모든 합주 완료 🎉' : `남은 합주 ${remaining}회`}
        </span>
      </div>

      {rehearsals.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl px-5 py-4 text-sm">
          아직 합주 일정이 없습니다.{' '}
          <Link href="/planner" className="underline font-semibold">합주 배분</Link>에서 일정을 잡아보세요.
        </div>
      )}

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        {/* 월 이동 */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition"
          >
            ◀ 이전
          </button>
          <span className="font-bold text-gray-800">{year}년 {month + 1}월</span>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition"
          >
            다음 ▶
          </button>
        </div>

        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 font-semibold">
          {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
            <div key={d} className="py-1">{d}</div>
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
                className={`rounded-xl p-1 min-h-[52px] text-sm border flex flex-col items-center gap-0.5
                  ${isToday ? 'border-purple-400 bg-purple-50' : 'border-gray-100 bg-white'}
                  ${rehearsal && !isToday ? 'bg-violet-50 border-violet-200' : ''}
                `}
              >
                <span className={`text-xs font-semibold ${isToday ? 'text-purple-700' : 'text-gray-700'}`}>
                  {d.getDate()}
                </span>
                {rehearsal && (
                  <Link
                    href={`/rehearsal/${rehearsal.id}`}
                    className="text-[10px] bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-1 py-0.5 leading-tight transition text-center w-full"
                  >
                    {rehearsal.order}번째
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 다가오는 합주 목록 */}
      {upcoming.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-base font-semibold text-gray-800">다가오는 합주</h2>
          <ul className="space-y-2">
            {upcoming.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/rehearsal/${r.id}`}
                  className="flex items-center justify-between bg-white border border-gray-100 rounded-2xl px-5 py-4 hover:border-purple-300 hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2.5 py-1 rounded-full">
                      {r.order}번째
                    </span>
                    <span className="text-sm text-gray-600">{r.date} · {r.time}</span>
                  </div>
                  <span className="text-xs text-gray-400">상세 →</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {allDone && (
        <div className="bg-green-50 border border-green-200 text-green-700 rounded-2xl px-5 py-4 text-sm text-center font-medium">
          🎉 모든 합주를 완료했습니다! 공연 파이팅!
        </div>
      )}
    </div>
  );
}
