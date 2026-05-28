'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RehearsalSession, Member } from '@/types';

export default function PlannerPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [memberError, setMemberError] = useState('');

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
  const [scheduling, setScheduling] = useState(false);
  const [perfSaved, setPerfSaved] = useState(false);
  const [perfSaving, setPerfSaving] = useState(false);

  // 수동 합주 추가
  const [manualDate, setManualDate] = useState('');
  const [manualTime, setManualTime] = useState('14:00');
  const [manualError, setManualError] = useState('');
  const [manualSuccess, setManualSuccess] = useState('');

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

  async function handleSavePerformance() {
    if (!perfDate) { return; }
    setPerfSaving(true);
    try {
      await fetch('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: perfName, venue: perfVenue, date: perfDate }),
      });
      setPerfSaved(true);
      setTimeout(() => setPerfSaved(false), 3000);
    } finally {
      setPerfSaving(false);
    }
  }

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
    setScheduling(true);
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ performanceDate: perfDate, count, time }),
      });
      const data = await res.json();
      setPreview(data.dates ?? []);
      setWarning(data.warning ?? '');
      setSaved(false);
    } finally {
      setScheduling(false);
    }
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

  async function handleManualAdd() {
    if (!manualDate) { setManualError('날짜를 입력해주세요.'); return; }
    setManualError('');
    setManualSuccess('');
    const res = await fetch('/api/rehearsals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{ date: manualDate, time: manualTime }]),
    });
    if (res.ok) {
      const updated: RehearsalSession[] = await res.json();
      setRehearsals(updated);
      setManualDate('');
      setManualSuccess(`${manualDate} 합주가 추가되었습니다.`);
      setTimeout(() => setManualSuccess(''), 3000);
    }
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
    const target = rehearsals.find((r) => r.id === id);
    const label = target ? `${target.order}번째 합주 (${target.date})` : '이 합주';
    if (!window.confirm(`${label}를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) return;

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

  const inputCls = 'border border-gray-200 rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">합주 일정 배분</h1>

      {/* ① 멤버 관리 */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">① 멤버 등록</h2>
        <div className="flex gap-2">
          <input
            className={inputCls + ' flex-1'}
            placeholder="멤버 이름 (예: 홍길동)"
            value={newMemberName}
            onChange={(e) => setNewMemberName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
          />
          <button
            onClick={handleAddMember}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition shrink-0"
          >
            멤버 추가
          </button>
        </div>
        {memberError && <p className="text-red-500 text-sm">{memberError}</p>}
        {members.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {members.map((m) => (
              <span key={m.id} className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full border border-purple-200 font-medium">
                {m.name}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            멤버를 먼저 등록해야 개인 일정과 피드백 기능을 사용할 수 있습니다.
          </p>
        )}
      </section>

      {/* ② 공연 정보 */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">② 공연 정보</h2>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">공연 이름</label>
            <input className={inputCls} value={perfName} onChange={(e) => setPerfName(e.target.value)} placeholder="정기공연" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">장소</label>
            <input className={inputCls} value={perfVenue} onChange={(e) => setPerfVenue(e.target.value)} placeholder="홍대 클럽 FF" />
          </div>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">공연 날짜 <span className="text-red-500">*</span></label>
          <input type="date" className={inputCls + ' w-auto'} value={perfDate} onChange={(e) => { setPerfDate(e.target.value); setPerfSaved(false); }} />
        </div>
        <div className="flex items-center gap-3 pt-1">
          <button
            onClick={handleSavePerformance}
            disabled={!perfDate || perfSaving}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition"
          >
            {perfSaving ? '저장 중...' : '공연 정보 저장'}
          </button>
          {perfSaved && <span className="text-green-600 text-sm font-medium">✓ 저장되었습니다</span>}
        </div>
      </section>

      {/* ③ 합주 자동 배분 */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">③ 합주 자동 배분</h2>
        <p className="text-xs text-gray-400">멤버들이 개인 일정을 등록한 뒤 배분하면 가능한 날짜에 자동으로 합주가 잡힙니다.</p>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">합주 횟수</label>
            <input type="number" min={1} max={20} className={inputCls} value={count} onChange={(e) => setCount(Number(e.target.value))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">합주 시작 시각</label>
            <input type="time" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button
          onClick={handleAutoSchedule}
          disabled={scheduling}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition"
        >
          {scheduling ? '배분 중...' : '자동 배분 실행'}
        </button>

        {preview.length > 0 && (
          <div className="space-y-3 border-t border-gray-100 pt-4">
            {warning && (
              <p className="text-amber-700 text-sm bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">{warning}</p>
            )}
            <ul className="space-y-2">
              {preview.map((d, i) => (
                <li key={d} className="flex items-center border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50">
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full mr-3">{i + 1}번째</span>
                  <span className="text-gray-700">{d} {time}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleConfirm}
              className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl py-2.5 text-sm font-semibold transition"
            >
              일정 확정하기
            </button>
          </div>
        )}
        {saved && (
          <p className="text-green-700 text-sm font-semibold bg-green-50 border border-green-200 rounded-xl px-4 py-3">
            ✓ 합주 일정이 저장되었습니다!
          </p>
        )}
      </section>

      {/* ④ 합주 수동 추가 */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">④ 합주 수동 추가</h2>
        <p className="text-xs text-gray-400">자동 배분과 별개로 특정 날짜에 합주를 직접 추가할 수 있습니다.</p>
        <div className="flex gap-3 items-end">
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-500 mb-1">날짜</label>
            <input type="date" className={inputCls} value={manualDate} onChange={(e) => setManualDate(e.target.value)} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">시각</label>
            <input type="time" className={inputCls + ' w-auto'} value={manualTime} onChange={(e) => setManualTime(e.target.value)} />
          </div>
          <button
            onClick={handleManualAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-2.5 text-sm font-semibold transition shrink-0"
          >
            합주 추가
          </button>
        </div>
        {manualError && <p className="text-red-500 text-sm">{manualError}</p>}
        {manualSuccess && (
          <p className="text-green-700 text-sm bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
            ✓ {manualSuccess}
          </p>
        )}
      </section>

      {/* ⑤ 합주 목록 */}
      {rehearsals.length > 0 && (
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-3">
          <h2 className="text-base font-semibold text-gray-800">합주 목록</h2>
          <ul className="space-y-2">
            {rehearsals.map((r) => (
              <li
                key={r.id}
                className={`border rounded-xl px-4 py-3 text-sm transition ${
                  editId === r.id
                    ? 'border-purple-300 bg-purple-50'
                    : 'border-gray-100 bg-white'
                }`}
              >
                {editId === r.id ? (
                  <div className="flex gap-2 items-center flex-wrap">
                    <input type="date" className="border border-purple-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" value={editDate} onChange={(e) => setEditDate(e.target.value)} />
                    <input type="time" className="border border-purple-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" value={editTime} onChange={(e) => setEditTime(e.target.value)} />
                    <button onClick={() => handleEdit(r.id)} className="text-purple-600 text-xs font-semibold">저장</button>
                    <button onClick={() => setEditId(null)} className="text-gray-400 text-xs">취소</button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">{r.order}번째</span>
                      <Link href={`/rehearsal/${r.id}`} className="text-gray-700 hover:text-purple-700 font-medium transition">
                        {r.date} {r.time}
                      </Link>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => { setEditId(r.id); setEditDate(r.date); setEditTime(r.time); }} className="text-purple-500 hover:text-purple-700 text-xs font-medium transition">날짜 수정</button>
                      <button onClick={() => handleDelete(r.id)} className="text-red-400 hover:text-red-600 text-xs font-medium transition">삭제</button>
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
