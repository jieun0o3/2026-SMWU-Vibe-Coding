'use client';

import { useEffect, useState } from 'react';
import { Member, PersonalSchedule } from '@/types';

function getMonthDays(year: number, month: number): Date[] {
  const days: Date[] = [];
  const d = new Date(year, month, 1);
  while (d.getMonth() === month) {
    days.push(new Date(d));
    d.setDate(d.getDate() + 1);
  }
  return days;
}

function toISO(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function SchedulePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [mySchedules, setMySchedules] = useState<PersonalSchedule[]>([]);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [viewDate, setViewDate] = useState(new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = getMonthDays(year, month);
  const firstDay = new Date(year, month, 1).getDay();

  useEffect(() => {
    fetch('/api/members').then((r) => r.json()).then(setMembers);
  }, []);

  useEffect(() => {
    if (!selectedMemberId) { setMySchedules([]); return; }
    fetch(`/api/personal-schedules?memberId=${selectedMemberId}`)
      .then((r) => r.json())
      .then(setMySchedules);
  }, [selectedMemberId]);

  function toggleDate(iso: string) {
    setSelectedDates((prev) => {
      const next = new Set(prev);
      next.has(iso) ? next.delete(iso) : next.add(iso);
      return next;
    });
  }

  async function handleSave() {
    if (!selectedMemberId) { setError('멤버를 선택해주세요.'); return; }
    if (selectedDates.size === 0) { setError('날짜를 선택해주세요.'); return; }
    setError('');
    const res = await fetch('/api/personal-schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberId: selectedMemberId, dates: [...selectedDates] }),
    });
    if (res.ok) {
      const added: PersonalSchedule[] = await res.json();
      setMySchedules((prev) => [...prev, ...added]);
      setSelectedDates(new Set());
    }
  }

  async function handleDelete(id: string) {
    await fetch('/api/personal-schedules', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setMySchedules((prev) => prev.filter((s) => s.id !== id));
  }

  const blockedSet = new Set(mySchedules.map((s) => s.date));

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">개인 일정 등록</h1>

      {/* 멤버 선택 */}
      <div>
        <label className="block text-sm font-medium mb-1">멤버 선택</label>
        <select
          className="border rounded px-3 py-2 w-full"
          value={selectedMemberId}
          onChange={(e) => setSelectedMemberId(e.target.value)}
        >
          <option value="">-- 멤버를 선택하세요 --</option>
          {members.map((m) => (
            <option key={m.id} value={m.id}>{m.name}</option>
          ))}
        </select>
      </div>

      {/* 캘린더 날짜 선택 */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => setViewDate(new Date(year, month - 1, 1))} className="px-2 py-1 rounded border text-sm">◀</button>
          <span className="font-medium">{year}년 {month + 1}월</span>
          <button onClick={() => setViewDate(new Date(year, month + 1, 1))} className="px-2 py-1 rounded border text-sm">▶</button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-500 mb-1">
          {['일', '월', '화', '수', '목', '금', '토'].map((d) => <div key={d}>{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
          {days.map((d) => {
            const iso = toISO(d);
            const isBlocked = blockedSet.has(iso);
            const isSelected = selectedDates.has(iso);
            return (
              <button
                key={iso}
                onClick={() => toggleDate(iso)}
                className={`rounded py-1 text-sm border transition
                  ${isBlocked ? 'bg-red-100 border-red-300 text-red-600' : ''}
                  ${isSelected ? 'bg-blue-500 text-white border-blue-500' : ''}
                  ${!isBlocked && !isSelected ? 'border-gray-200 hover:bg-gray-100' : ''}
                `}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>
        <p className="text-xs text-gray-400 mt-1">빨간 날짜: 이미 등록된 불가 날짜 / 파란 날짜: 선택 중</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        onClick={handleSave}
        className="w-full bg-blue-600 text-white rounded py-2 font-medium hover:bg-blue-700 transition"
      >
        불가 날짜 저장
      </button>

      {/* 등록된 불가 날짜 목록 */}
      {mySchedules.length > 0 && (
        <div>
          <h2 className="font-medium mb-2">등록된 불가 날짜</h2>
          <ul className="space-y-1">
            {[...mySchedules].sort((a, b) => a.date.localeCompare(b.date)).map((s) => (
              <li key={s.id} className="flex justify-between items-center border rounded px-3 py-2 text-sm">
                <span>{s.date}</span>
                <button onClick={() => handleDelete(s.id)} className="text-red-500 hover:text-red-700 text-xs">삭제</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
