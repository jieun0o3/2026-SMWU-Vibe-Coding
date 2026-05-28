'use client';

import { useEffect, useState } from 'react';
import { Member, PersonalSchedule } from '@/types';
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

export default function SchedulePage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');
  const [mySchedules, setMySchedules] = useState<PersonalSchedule[]>([]);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());
  const [error, setError] = useState('');
  const [viewDate, setViewDate] = useState(new Date());
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    try {
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
    } finally {
      setSaving(false);
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
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">개인 일정 등록</h1>

      {/* 멤버 선택 */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-3">
        <h2 className="text-base font-semibold text-gray-800">멤버 선택</h2>
        <select
          className="border border-gray-200 rounded-xl px-3 py-2 w-full text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent"
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
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">불가 날짜 선택</h2>
        {!selectedMemberId && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5">
            멤버를 먼저 선택하면 이미 등록된 불가 날짜가 빨간색으로 표시됩니다.
          </p>
        )}

        <div className="flex items-center justify-between">
          <button
            onClick={() => setViewDate(new Date(year, month - 1, 1))}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition"
          >
            ◀
          </button>
          <span className="font-semibold text-gray-800">{year}년 {month + 1}월</span>
          <button
            onClick={() => setViewDate(new Date(year, month + 1, 1))}
            className="px-3 py-1.5 rounded-xl border border-gray-200 text-sm hover:bg-gray-50 transition"
          >
            ▶
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-gray-400 font-medium">
          {['일', '월', '화', '수', '목', '금', '토'].map((d) => <div key={d}>{d}</div>)}
        </div>

        <div className={`grid grid-cols-7 gap-1 ${!selectedMemberId ? 'opacity-60' : ''}`}>
          {Array(firstDay).fill(null).map((_, i) => <div key={`e${i}`} />)}
          {days.map((d) => {
            const iso = toLocalISO(d);
            const isBlocked = blockedSet.has(iso);
            const isSelected = selectedDates.has(iso);
            return (
              <button
                key={iso}
                onClick={() => toggleDate(iso)}
                className={`rounded-xl py-1.5 text-sm border transition font-medium
                  ${isBlocked ? 'bg-red-50 border-red-200 text-red-500' : ''}
                  ${isSelected ? 'bg-purple-600 text-white border-purple-600 shadow-sm' : ''}
                  ${!isBlocked && !isSelected ? 'border-gray-100 hover:bg-purple-50 hover:border-purple-200 text-gray-700' : ''}
                `}
              >
                {d.getDate()}
              </button>
            );
          })}
        </div>

        <div className="flex gap-4 text-xs text-gray-400">
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-red-100 border border-red-200" /> 이미 등록됨</span>
          <span className="flex items-center gap-1"><span className="inline-block w-3 h-3 rounded bg-purple-600" /> 선택 중</span>
        </div>
      </div>

      {error && <p className="text-red-500 text-sm px-1">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl py-3 font-semibold text-sm transition"
      >
        {saving ? '저장 중...' : '불가 날짜 저장'}
      </button>

      {/* 등록된 불가 날짜 목록 */}
      {selectedMemberId && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-3">
          <h2 className="text-base font-semibold text-gray-800">등록된 불가 날짜</h2>
          {mySchedules.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">등록된 불가 날짜가 없습니다.</p>
          ) : (
            <ul className="space-y-2">
              {[...mySchedules].sort((a, b) => a.date.localeCompare(b.date)).map((s) => (
                <li key={s.id} className="flex justify-between items-center border border-gray-100 rounded-xl px-4 py-2.5 text-sm">
                  <span className="text-gray-700 font-medium">{s.date}</span>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="text-red-400 hover:text-red-600 text-xs font-medium transition"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
