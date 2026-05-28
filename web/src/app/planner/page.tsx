'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RehearsalSession, Member, Team, Song } from '@/types';

type Mode = 'team' | 'song';

export default function PlannerPage() {
  const [mode, setMode] = useState<Mode>('team');

  const [members, setMembers] = useState<Member[]>([]);
  const [newMemberName, setNewMemberName] = useState('');
  const [memberError, setMemberError] = useState('');

  const [teams, setTeams] = useState<Team[]>([]);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamMemberIds, setNewTeamMemberIds] = useState<Set<string>>(new Set());
  const [teamError, setTeamError] = useState('');
  const [showTeamForm, setShowTeamForm] = useState(false);

  const [songs, setSongs] = useState<Song[]>([]);
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongArtist, setNewSongArtist] = useState('');
  const [songError, setSongError] = useState('');

  const [perfName, setPerfName] = useState('');
  const [perfVenue, setPerfVenue] = useState('');
  const [perfDate, setPerfDate] = useState('');
  const [perfSaved, setPerfSaved] = useState(false);
  const [perfSaving, setPerfSaving] = useState(false);

  const [selectedGroupId, setSelectedGroupId] = useState('');
  const [count, setCount] = useState(3);
  const [time, setTime] = useState('14:00');
  const [preview, setPreview] = useState<string[]>([]);
  const [schedWarning, setSchedWarning] = useState('');
  const [scheduling, setScheduling] = useState(false);
  const [schedError, setSchedError] = useState('');
  const [saved, setSaved] = useState(false);

  const [manualDate, setManualDate] = useState('');
  const [manualTime, setManualTime] = useState('14:00');
  const [manualGroupId, setManualGroupId] = useState('');
  const [manualError, setManualError] = useState('');
  const [manualSuccess, setManualSuccess] = useState('');

  const [rehearsals, setRehearsals] = useState<RehearsalSession[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  useEffect(() => {
    const savedMode = localStorage.getItem('band-planner-mode') as Mode | null;
    if (savedMode) setMode(savedMode);

    Promise.all([
      fetch('/api/members').then((r) => r.json()),
      fetch('/api/teams').then((r) => r.json()),
      fetch('/api/songs').then((r) => r.json()),
      fetch('/api/rehearsals').then((r) => r.json()),
      fetch('/api/performance').then((r) => r.json()),
    ]).then(([mems, tms, sgs, reh, perf]) => {
      setMembers(mems);
      setTeams(tms);
      setSongs(sgs);
      setRehearsals(reh);
      if (perf) {
        setPerfName(perf.name ?? '');
        setPerfVenue(perf.venue ?? '');
        setPerfDate(perf.date ?? '');
      }
    });
  }, []);

  function handleModeChange(m: Mode) {
    setMode(m);
    setSelectedGroupId('');
    setPreview([]);
    setManualGroupId('');
    localStorage.setItem('band-planner-mode', m);
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

  async function handleAddTeam() {
    if (!newTeamName.trim()) { setTeamError('팀 이름을 입력해주세요.'); return; }
    setTeamError('');
    const res = await fetch('/api/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newTeamName.trim(), memberIds: [...newTeamMemberIds] }),
    });
    if (res.ok) {
      const team: Team = await res.json();
      setTeams((prev) => [...prev, team]);
      setNewTeamName('');
      setNewTeamMemberIds(new Set());
      setShowTeamForm(false);
    }
  }

  async function handleDeleteTeam(id: string) {
    await fetch('/api/teams', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setTeams((prev) => prev.filter((t) => t.id !== id));
    if (selectedGroupId === id) setSelectedGroupId('');
  }

  async function handleAddSong() {
    if (!newSongTitle.trim()) { setSongError('곡명을 입력해주세요.'); return; }
    setSongError('');
    const res = await fetch('/api/songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newSongTitle.trim(), artist: newSongArtist.trim() }),
    });
    if (res.ok) {
      const song: Song = await res.json();
      setSongs((prev) => [...prev, song]);
      setNewSongTitle('');
      setNewSongArtist('');
    }
  }

  async function handleDeleteSong(id: string) {
    await fetch('/api/songs', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setSongs((prev) => prev.filter((s) => s.id !== id));
    if (selectedGroupId === id) setSelectedGroupId('');
  }

  async function handleSavePerformance() {
    if (!perfDate) return;
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

  function getGroupLabel(groupId: string): string {
    if (mode === 'team') return teams.find((t) => t.id === groupId)?.name ?? '';
    const s = songs.find((s) => s.id === groupId);
    return s ? `${s.title}${s.artist ? ` - ${s.artist}` : ''}` : '';
  }

  async function handleAutoSchedule() {
    if (!perfDate) { setSchedError('공연 날짜를 입력해주세요.'); return; }
    if (!selectedGroupId) { setSchedError(mode === 'team' ? '팀을 선택해주세요.' : '곡을 선택해주세요.'); return; }
    setSchedError('');
    setScheduling(true);
    try {
      const body: Record<string, unknown> = { performanceDate: perfDate, count, time };
      if (mode === 'team') {
        const team = teams.find((t) => t.id === selectedGroupId);
        if (team && team.memberIds.length > 0) body.memberIds = team.memberIds;
      }
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setPreview(data.dates ?? []);
      setSchedWarning(data.warning ?? '');
      setSaved(false);
    } finally {
      setScheduling(false);
    }
  }

  async function handleConfirm() {
    if (!selectedGroupId || preview.length === 0) return;
    const label = getGroupLabel(selectedGroupId);
    const res = await fetch('/api/rehearsals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        preview.map((date) => ({ date, time, label, groupId: selectedGroupId, groupType: mode })),
      ),
    });
    const updated: RehearsalSession[] = await res.json();
    setRehearsals(updated);
    setPreview([]);
    setSaved(true);
  }

  async function handleManualAdd() {
    if (!manualDate) { setManualError('날짜를 입력해주세요.'); return; }
    setManualError('');
    const label = manualGroupId ? getGroupLabel(manualGroupId) : '';
    const res = await fetch('/api/rehearsals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify([{
        date: manualDate,
        time: manualTime,
        ...(label && { label, groupId: manualGroupId, groupType: mode }),
      }]),
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
  const groups = mode === 'team' ? teams : songs;
  const groupName = (g: Team | Song) =>
    mode === 'team'
      ? (g as Team).name
      : `${(g as Song).title}${(g as Song).artist ? ` - ${(g as Song).artist}` : ''}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">합주 일정 배분</h1>

      {/* 배분 방식 */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-800 mb-3">배분 방식</h2>
        <div className="flex gap-2">
          {(['team', 'song'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition border ${
                mode === m
                  ? 'bg-purple-600 text-white border-purple-600 shadow-sm'
                  : 'border-gray-200 text-gray-500 hover:bg-gray-50'
              }`}
            >
              {m === 'team' ? '👥 팀별 합주' : '🎵 곡별 합주'}
            </button>
          ))}
        </div>
      </div>

      {/* ① 멤버 등록 */}
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

      {/* ② 팀 구성 (팀별 모드) */}
      {mode === 'team' && (
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-800">② 팀 구성</h2>
            <button
              onClick={() => setShowTeamForm((v) => !v)}
              className="text-sm text-purple-600 hover:text-purple-800 font-semibold transition"
            >
              {showTeamForm ? '취소' : '+ 팀 추가'}
            </button>
          </div>

          {showTeamForm && (
            <div className="border border-purple-100 rounded-xl p-4 space-y-3 bg-purple-50">
              <input
                className={inputCls}
                placeholder="팀 이름 (예: 팀A, 퍼커션팀)"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
              />
              {members.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-gray-500 mb-2">팀 멤버 선택</p>
                  <div className="flex flex-wrap gap-2">
                    {members.map((m) => {
                      const checked = newTeamMemberIds.has(m.id);
                      return (
                        <button
                          key={m.id}
                          onClick={() =>
                            setNewTeamMemberIds((prev) => {
                              const next = new Set(prev);
                              checked ? next.delete(m.id) : next.add(m.id);
                              return next;
                            })
                          }
                          className={`px-3 py-1 rounded-full text-sm border font-medium transition ${
                            checked
                              ? 'bg-purple-600 text-white border-purple-600'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-purple-300'
                          }`}
                        >
                          {checked && '✓ '}{m.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              {teamError && <p className="text-red-500 text-sm">{teamError}</p>}
              <button
                onClick={handleAddTeam}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-5 py-2 text-sm font-semibold transition"
              >
                팀 추가
              </button>
            </div>
          )}

          {teams.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">등록된 팀이 없습니다. 팀을 추가해주세요.</p>
          ) : (
            <ul className="space-y-2">
              {teams.map((t) => {
                const memberNames = t.memberIds
                  .map((id) => members.find((m) => m.id === id)?.name)
                  .filter(Boolean)
                  .join(', ');
                return (
                  <li key={t.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-2.5">
                    <div>
                      <span className="font-semibold text-gray-800 text-sm">{t.name}</span>
                      {memberNames && (
                        <span className="text-xs text-gray-400 ml-2">{memberNames}</span>
                      )}
                    </div>
                    <button onClick={() => handleDeleteTeam(t.id)} className="text-red-400 hover:text-red-600 text-xs font-medium transition">삭제</button>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}

      {/* ② 곡 목록 (곡별 모드) */}
      {mode === 'song' && (
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
          <h2 className="text-base font-semibold text-gray-800">② 곡 목록</h2>
          <div className="flex gap-2 flex-wrap">
            <input
              className={inputCls + ' flex-1 min-w-[120px]'}
              placeholder="곡명"
              value={newSongTitle}
              onChange={(e) => setNewSongTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSong()}
            />
            <input
              className={inputCls + ' flex-1 min-w-[120px]'}
              placeholder="아티스트"
              value={newSongArtist}
              onChange={(e) => setNewSongArtist(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddSong()}
            />
            <button
              onClick={handleAddSong}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-4 py-2 text-sm font-semibold transition shrink-0"
            >
              곡 추가
            </button>
          </div>
          {songError && <p className="text-red-500 text-sm">{songError}</p>}
          {songs.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-2">등록된 곡이 없습니다. 곡을 추가해주세요.</p>
          ) : (
            <ul className="space-y-2">
              {songs.map((s) => (
                <li key={s.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-2.5">
                  <div>
                    <span className="font-semibold text-gray-800 text-sm">{s.title}</span>
                    {s.artist && <span className="text-xs text-gray-400 ml-2">— {s.artist}</span>}
                  </div>
                  <button onClick={() => handleDeleteSong(s.id)} className="text-red-400 hover:text-red-600 text-xs font-medium transition">삭제</button>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}

      {/* ③ 공연 정보 */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">③ 공연 정보</h2>
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

      {/* ④ 합주 자동 배분 */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">④ 합주 자동 배분</h2>
        <p className="text-xs text-gray-400">
          {mode === 'team'
            ? '팀 멤버들의 불가 날짜를 피해 자동으로 합주 날짜를 잡습니다.'
            : '전체 멤버의 불가 날짜를 피해 곡별 합주 날짜를 자동으로 잡습니다.'}
        </p>
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              {mode === 'team' ? '합주할 팀' : '합주할 곡'}
            </label>
            <select
              className={inputCls}
              value={selectedGroupId}
              onChange={(e) => { setSelectedGroupId(e.target.value); setPreview([]); setSaved(false); }}
            >
              <option value="">-- {mode === 'team' ? '팀' : '곡'} 선택 --</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>{groupName(g)}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">합주 횟수</label>
              <input type="number" min={1} max={20} className={inputCls} value={count} onChange={(e) => setCount(Number(e.target.value))} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">시작 시각</label>
              <input type="time" className={inputCls} value={time} onChange={(e) => setTime(e.target.value)} />
            </div>
          </div>
        </div>
        {schedError && <p className="text-red-500 text-sm">{schedError}</p>}
        <button
          onClick={handleAutoSchedule}
          disabled={scheduling}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition"
        >
          {scheduling ? '배분 중...' : '자동 배분 실행'}
        </button>

        {preview.length > 0 && (
          <div className="space-y-3 border-t border-gray-100 pt-4">
            {schedWarning && (
              <p className="text-amber-700 text-sm bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">{schedWarning}</p>
            )}
            <p className="text-xs text-gray-500 font-medium">{getGroupLabel(selectedGroupId)} 합주 예정일</p>
            <ul className="space-y-2">
              {preview.map((d, i) => (
                <li key={d} className="flex items-center border border-gray-100 rounded-xl px-4 py-2.5 text-sm bg-gray-50">
                  <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2 py-0.5 rounded-full mr-3">{i + 1}회차</span>
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

      {/* ⑤ 합주 수동 추가 */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">⑤ 합주 수동 추가</h2>
        <p className="text-xs text-gray-400">자동 배분과 별개로 특정 날짜에 합주를 직접 추가할 수 있습니다.</p>
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">날짜</label>
              <input type="date" className={inputCls} value={manualDate} onChange={(e) => setManualDate(e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">시각</label>
              <input type="time" className={inputCls} value={manualTime} onChange={(e) => setManualTime(e.target.value)} />
            </div>
          </div>
          {groups.length > 0 && (
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">{mode === 'team' ? '팀' : '곡'} (선택)</label>
              <select className={inputCls} value={manualGroupId} onChange={(e) => setManualGroupId(e.target.value)}>
                <option value="">-- 선택 안 함 --</option>
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>{groupName(g)}</option>
                ))}
              </select>
            </div>
          )}
          <button
            onClick={handleManualAdd}
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition"
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

      {/* 합주 목록 */}
      {rehearsals.length > 0 && (
        <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-3">
          <h2 className="text-base font-semibold text-gray-800">합주 목록</h2>
          <ul className="space-y-2">
            {rehearsals.map((r) => (
              <li
                key={r.id}
                className={`border rounded-xl px-4 py-3 text-sm transition ${
                  editId === r.id ? 'border-purple-300 bg-purple-50' : 'border-gray-100 bg-white'
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
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="bg-purple-100 text-purple-700 text-xs font-semibold px-2.5 py-0.5 rounded-full">{r.order}번째</span>
                      {r.label && (
                        <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">{r.label}</span>
                      )}
                      <Link href={`/rehearsal/${r.id}`} className="text-gray-700 hover:text-purple-700 font-medium transition">
                        {r.date} {r.time}
                      </Link>
                    </div>
                    <div className="flex gap-3 shrink-0">
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
