'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RehearsalSession, Member } from '@/types';

export default function PlannerPage() {
  // 멤버 관리
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [memberError, setMemberError] = useState('');

  // 공연 정보
  const [perfName, setPerfName] = useState('');
  const [perfVenue, setPerfVenue] = useState('');
  const [perfDate, setPerfDate] = useState('');

  // 합주 설정
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
    fetch('/api/members').then((r) => r.json()).then(setMembers);
    fetch('/api/rehearsals').then((r) => r.json()).then(setRehearsals);
    fetch('/api/performance').then((r) => r.json()).then((p) => {
      if (p) {
        setPerfName(p.name ?? '');
        setPerfVenue(p.venue ?? '');
        setPerfDate(p.date ?? '');
      }
    });
  }, []);

  async function handleAddMember() {
    if (!newMemberName.trim()) { setMemberError('이름을 입력해주세요.'); return; }
    setMemberError('');
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newMemberName.trim() }),
    });
    if (res.ok) {
      const member: Member = await res.json();
      setMembers((prev) => [...prev, member]);
      setNewMemberName('');
    }
  }

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
    await fetch('/api/performance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: perfName, venue: perfVenue, date: perfDate }),
    });
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
    setRehearsals((prev) => {
      const filtered = prev.filter((r) => r.id !== id);
      return filtered.map((r, i) => ({ ...r, order: i + 1 }));
    });
  }

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">합주 일정 배분</h1>

      {/* ① 멤버 관리 */}
      <section className="bg-white border rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">① 멤버 등록</h2>
        <div className="flex gap-2">
          <input
            className="border rounded px-3 py-2 flex-1 text-sm"
            placeholder="멤버 이름 (예: 홍길동)"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
          />
          <button
            onClick={handleAddMember}
            className="bg-indigo-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-indigo-700 transition"
          >
            추가
          </button>
        </div>
        {memberError && <p className="text-red-500 text-sm">{memberError}</p>}
        {members.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <span key={m.id} className="bg-indigo-50 text-indigo-700 text-sm px-3 py-1 rounded-full border border-indigo-200">
                {m.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-amber-600 bg-amber-50 rounded px-3 py-2">
            멤버를 먼저 등록해야 개인 일정과 피드백 기능을 사용할 수 있습니다.
          </p>
        )}
      </section>

      {/* ② 공연 정보 */}
      <section className="bg-white border rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">② 공연 정보</h2>
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

      {/* ③ 합주 자동 배분 */}
      <section className="bg-white border rounded-xl p-5 space-y-3">
        <h2 className="font-semibold text-gray-800">③ 합주 자동 배분</h2>
        <p className="text-xs text-gray-400">멤버들이 개인 일정을 등록한 뒤 배분하면 가능한 날짜에 자동으로 합주가 잡힙니다.</p>
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

        {preview.length > 0 && (
          <div className="space-y-2 mt-2">
            {warning && <p className="text-amber-600 text-sm bg-amber-50 rounded px-3 py-2">{warning}</p>}
            <ul className="space-y-1">
              {preview.map((d, i) => (
                <li key={d} className="flex items-center border rounded px-3 py-2 text-sm bg-gray-50">
                  <span>{i + 1}번째 합주 — {d} {time}</span>
                </li>
              ))}
            </ul>
            <button onClick={handleConfirm} className="w-full bg-green-600 text-white rounded py-2 text-sm font-medium hover:bg-green-700 transition">
              확정하기
            </button>
          </div>
        )}
        {saved && <p className="text-green-600 text-sm font-medium">✓ 합주 일정이 저장되었습니다!</p>}
      </section>

      {/* ④ 합주 목록 */}
      {rehearsals.length > 0 && (
        <section className="bg-white border rounded-xl p-5 space-y-3">
          <h2 className="font-semibold text-gray-800">합주 목록</h2>
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
                    <Link href={`/rehearsal/${r.id}`} className="text-indigo-600 hover:underline font-medium">
                      {r.order}번째 합주
                    </Link>
                    <span className="text-gray-500">{r.date} {r.time}</span>
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
