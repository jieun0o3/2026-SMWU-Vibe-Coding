'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Member, Feedback, RecordingFile, RehearsalSession } from '@/types';

export default function RehearsalDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [rehearsal, setRehearsal] = useState<RehearsalSession | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [recordings, setRecordings] = useState<RecordingFile[]>([]);
  const [memberId, setMemberId] = useState('');
  const [content, setContent] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [feedbackError, setFeedbackError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch('/api/rehearsals').then((r) => r.json()),
      fetch('/api/members').then((r) => r.json()),
      fetch(`/api/feedback?rehearsalId=${id}`).then((r) => r.json()),
      fetch(`/api/recordings/${id}`).then((r) => r.json()),
    ]).then(([sessions, mems, fbs, recs]: [RehearsalSession[], Member[], Feedback[], RecordingFile[]]) => {
      setRehearsal(sessions.find((r) => r.id === id) ?? null);
      setMembers(mems);
      setFeedbacks(fbs);
      setRecordings(recs);
      setLoaded(true);
    });
  }, [id]);

  async function handleFeedbackSave() {
    if (!content.trim()) { setFeedbackError('피드백 내용을 입력해주세요.'); return; }
    setFeedbackError('');
    setSaving(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rehearsalId: id, memberId, content }),
      });
      if (res.ok) {
        const added: Feedback = await res.json();
        setFeedbacks((prev) => [...prev, added]);
        setContent('');
        setMemberId('');
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleFeedbackEdit(fid: string) {
    if (!editContent.trim()) return;
    const res = await fetch('/api/feedback', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: fid, content: editContent }),
    });
    if (res.ok) {
      const updated: Feedback = await res.json();
      setFeedbacks((prev) => prev.map((f) => (f.id === fid ? updated : f)));
      setEditId(null);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploadError('');
    const formData = new FormData();
    formData.append('rehearsalId', id);
    for (const file of files) {
      if (file.size > 20 * 1024 * 1024) {
        setUploadError(`파일 크기는 20MB 이하여야 합니다. (${file.name})`);
        return;
      }
      formData.append('files', file);
    }
    const res = await fetch('/api/upload', { method: 'POST', body: formData });
    if (res.ok) {
      const added: RecordingFile[] = await res.json();
      setRecordings((prev) => [...prev, ...added]);
    } else {
      const data = await res.json();
      setUploadError(data.error ?? '업로드 실패');
    }
    e.target.value = '';
  }

  const memberMap = new Map(members.map((m) => [m.id, m.name]));

  const inputCls = 'border border-gray-200 rounded-xl px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent';

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div>
        <Link href="/calendar" className="inline-flex items-center gap-1 text-sm text-purple-600 hover:text-purple-800 font-medium mb-3 transition">
          ← 캘린더로 돌아가기
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">
          {rehearsal ? `${rehearsal.order}번째 합주` : '합주 상세'}
        </h1>
        {rehearsal && (
          <p className="text-sm text-gray-500 mt-1">{rehearsal.date} · {rehearsal.time}</p>
        )}
      </div>

      {/* 피드백 작성 */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">피드백 작성</h2>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">멤버</label>
          <select className={inputCls} value={memberId} onChange={(e) => setMemberId(e.target.value)}>
            <option value="">-- 멤버 선택 (선택사항) --</option>
            {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-500 mb-1">내용</label>
          <textarea
            className={inputCls + ' h-24 resize-none'}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="오늘 합주 피드백을 작성해주세요."
          />
        </div>
        {feedbackError && <p className="text-red-500 text-sm">{feedbackError}</p>}
        <button
          onClick={handleFeedbackSave}
          disabled={saving}
          className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white rounded-xl px-5 py-2.5 text-sm font-semibold transition"
        >
          {saving ? '저장 중...' : '피드백 저장'}
        </button>
      </section>

      {/* 피드백 목록 */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-3">
        <h2 className="text-base font-semibold text-gray-800">피드백 목록</h2>
        {loaded && feedbacks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">아직 작성된 피드백이 없습니다.</p>
        ) : (
          <ul className="space-y-3">
            {feedbacks.map((f) => (
              <li key={f.id} className="border border-gray-100 rounded-xl px-4 py-3 space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-semibold text-purple-700">
                    {memberMap.get(f.memberId) ?? '익명'}
                  </span>
                  <span className="text-xs text-gray-400">{new Date(f.createdAt).toLocaleString('ko-KR')}</span>
                </div>
                {editId === f.id ? (
                  <div className="space-y-2">
                    <textarea
                      className={inputCls + ' h-16 resize-none'}
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={() => handleFeedbackEdit(f.id)} className="text-purple-600 text-xs font-semibold">저장</button>
                      <button onClick={() => setEditId(null)} className="text-gray-400 text-xs">취소</button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start gap-2">
                    <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{f.content}</p>
                    <button
                      onClick={() => { setEditId(f.id); setEditContent(f.content); }}
                      className="text-purple-400 hover:text-purple-600 text-xs font-medium shrink-0 transition"
                    >
                      수정
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* 녹음 파일 */}
      <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 space-y-4">
        <h2 className="text-base font-semibold text-gray-800">녹음 파일</h2>
        <p className="text-xs text-gray-400">파일 크기: 20MB 이하 / 복수 선택 가능</p>
        <label className="inline-flex items-center gap-2 bg-purple-50 border border-purple-200 text-purple-700 rounded-xl px-4 py-2.5 text-sm font-medium cursor-pointer hover:bg-purple-100 transition">
          <span>📎 녹음 파일 선택</span>
          <input type="file" multiple accept="audio/*" onChange={handleUpload} className="hidden" />
        </label>
        {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
        {loaded && recordings.length === 0 ? (
          <p className="text-sm text-gray-400">업로드된 녹음 파일이 없습니다.</p>
        ) : (
          <ul className="space-y-2">
            {recordings.map((r) => (
              <li key={r.id} className="flex items-center justify-between border border-gray-100 rounded-xl px-4 py-3 text-sm">
                <a
                  href={`/recordings/${r.filename}`}
                  download={r.originalName}
                  className="text-purple-600 hover:text-purple-800 hover:underline truncate font-medium transition"
                >
                  🎵 {r.originalName}
                </a>
                <span className="text-xs text-gray-400 shrink-0 ml-3">{(r.size / 1024 / 1024).toFixed(1)}MB</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
