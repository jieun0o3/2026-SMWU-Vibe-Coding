'use client';

import { useEffect, useState } from 'react';
import { RehearsalSession } from '@/types';

export default function PlannerPage() {
  const [perfName, setPerfName] = useState('');
  const [perfVenue, setPerfVenue] = useState('');
  const [perfDate, setPerfDate] = useState('');
  const [count, setCount] = useState(4);
  const [time, setTime] = useState('14:00');
  const [preview, setPreview] = useState<string[]>([]);
  const [warning, setWarning] = useState('');
  const [rehearsals, setRehearsals] = useState<RehearsalSession[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/rehearsals').then((r) => r.json()).then(setRehearsals);
    fetch('/api/performance').then((r) => r.json()).then((p) => {
      if (p) {
        setPerfName(p.name ?? '');
        setPerfVenue(p.venue ?? '');
        setPerfDate(p.date ?? '');
      }
    });
  }, []);

  async function handleAutoSchedule() {
    if (!perfDate) { setError('공연 날짜를 입력해주세요.'); return; }
    setError('');
    const res = await fetch('/api/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ performanceDate: perfDate, count, time }),
    });
    const data = await res.json();
    setPreview(data.dates ?? []);
    setWarning(data.warning ?? '');
    setSaved(false);
  }

  async function handleConfirm() {
    // save performance info
    await fetch('/api/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: perfName, venue: perfVenue, date: perfDate }),
    });
    // save rehearsals (bulk)
    const res = await fetch('/api/rehearsals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(preview.map((date) => ({ date, time }))),
    });
    const updated: RehearsalSession[] = await res.json();
    setRehearsals(updated);
    setPreview([]);
    setSaved(true);
  }

  async function handleEdit(id: string) {
    const res = await fetch('/api/rehearsals', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, date: editDate, time: editTime }),
    });
    const updated: RehearsalSession[] = await res.json();
    setRehearsals(updated);
    setEditId(null);
  }

  async function handleDelete(id: string) {
    await fetch('/api/rehearsals', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setRehearsals((prev) => prev.filter((r) => r.id !== id).map((r, i) => ({ ...r, order: i + 1 })));
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">합주 일정 배분</h1>

      {/* 공연 정보 */}
      <section className="space-y-3">
        <h2 className="font-medium text-gray-700">공연 정보</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">공연 이름</label>
            <input className="border rounded px-3 py-2 w-full text-sm" value={perfName} onChange={(e) => setPerfName(e.target.value)} placeholder="정기공연" />
          </div>
          <div>
            <label className="block text-sm mb-1">장소</label>
            <input className="border rounded px-3 py-2 w-full text-sm" value={perfVenue} onChange={(e) => setPerfVenue(e.target.value)} placeholder="홍대 클럽 FF" />
          </div>
        </div>
        <div>
          <label className="block text-sm mb-1">공연 날짜 <span className="text-red-500">*</span></label>
          <input type="date" className="border rounded px-3 py-2 text-sm" value={perfDate} onChange={(e) => setPerfDate(e.target.value)} />
        </div>
      </section>

      {/* 합주 설정 */}
      <section className="space-y-3">
        <h2 className="font-medium text-gray-700">합주 설정</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">합주 횟수</label>
            <input type="number" min={1} max={20} className="border rounded px-3 py-2 w-full text-sm" value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-sm mb-1">합주 시작 시각</label>
            <input type="time" className="border rounded px-3 py-2 w-full text-sm" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button onClick={handleAutoSchedule} className="bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700 transition">
          자동 배분
        </button>
      </section>

      {/* 미리보기 */}
      {preview.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-medium text-gray-700">배분 미리보기</h2>
          {warning && <p className="text-amber-600 text-sm bg-amber-50 rounded px-3 py-2">{warning}</p>}
          <ul className="space-y-1">
            {preview.map((d, i) => (
              <li key={d} className="flex items-center justify-between border rounded px-3 py-2 text-sm">
                <span>{i + 1}번째 합주 — {d} {time}</span>
              </li>
            ))}
          </ul>
          <button onClick={handleConfirm} className="w-full bg-green-600 text-white rounded py-2 text-sm font-medium hover:bg-green-700 transition">
            확정하기
          </button>
        </section>
      )}
      {saved && <p className="text-green-600 text-sm">합주 일정이 저장되었습니다!</p>}

      {/* 기존 합주 목록 + 수동 조정 */}
      {rehearsals.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-medium text-gray-700">합주 목록</h2>
          <ul className="space-y-2">
            {rehearsals.map((r) => (
              <li key={r.id} className="border rounded px-3 py-2 text-sm">
                {editId === r.id ? (
                  <div className="flex gap-2 items-center">
                    <input type="date" className="border rounded px-2 py-1 text-sm" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                    <input type="time" className="border rounded px-2 py-1 text-sm" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
                    <button onClick={() => handleEdit(r.id)} className="text-blue-600 text-xs">저장</button>
                    <button onClick={() => setEditId(null)} className="text-gray-400 text-xs">취소</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <span>{r.order}번째 합주 — {r.date} {r.time}</span>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditId(r.id); setEditDate(r.date); setEditTime(r.time); }} className="text-blue-500 text-xs">수정</button>
                      <button onClick={() => handleDelete(r.id)} className="text-red-500 text-xs">삭제</button>
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
