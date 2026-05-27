'use client';

import { useEffect, useState } from 'react';
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

export default function CalendarPage() {
  const [rehearsals, setRehearsals] = useState<RehearsalSession[]>([]);
  const [viewDate, setViewDate] = useState(new Date());

  const todayISO = new Date().toISOString().slice(0, 10);
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
  const remaining = rehearsals.filter((r) => new Date(r.date) >= today).length;

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">합주 캘린더</h1>
        <span className="bg-blue-100 text-blue-700 text-sm font-medium px-3 py-1 rounded-full">
          남은 합주: {remaining}회
        </span>
      </div>

      {remaining === 0 && rehearsals.length > 0 && (
        <p className="text-gray-500 text-sm">모든 합주 완료!</p>
      )}

      {/* 월 이동 */}
      <div className="flex items-center justify-between">
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="px-3 py-1 rounded border text-sm">◀ 이전</button>
        <span className="font-medium">{year}년 {month + 1}월</span>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="px-3 py-1 rounded border text-sm">다음 ▶</button>
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
        {['일', '월', '화', '수', '목', '금', '토'].map((d) => <div key={d} className="py-1 font-medium">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
        {days.map((d) => {
          const iso = d.toISOString().slice(0, 10);
          const rehearsal = rehearsalMap.get(iso);
          const isToday = iso === todayISO;
          return (
            <div
              key={iso}
              className={`rounded p-1 min-h-[48px] text-sm border flex flex-col items-center justify-start
                ${isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-100'}
                ${rehearsal ? 'bg-indigo-50 border-indigo-300' : ''}
              `}
            >
              <span className={`text-xs font-medium ${isToday ? 'text-blue-600' : ''}`}>{d.getDate()}</span>
              {rehearsal && (
                <span className="mt-0.5 text-[10px] bg-indigo-600 text-white rounded px-1 leading-tight">
                  {rehearsal.order}번째
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
