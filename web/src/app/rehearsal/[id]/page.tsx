'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
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

  useEffect(() => {
    fetch('/api/rehearsals').then((r) => r.json()).then((list: RehearsalSession[]) => {
      setRehearsal(list.find((r) => r.id === id) ?? null);
    });
    fetch('/api/members').then((r) => r.json()).then(setMembers);
    fetch(`/api/feedback?rehearsalId=${id}`).then((r) => r.json()).then(setFeedbacks);
    fetch(`/api/recordings/${id}`).then((r) => r.json()).then(setRecordings);
  }, [id]);

  async function handleFeedbackSave() {
    if (!content.trim()) { setFeedbackError('피드백 내용을 입력해주세요.'); return; }
    setFeedbackError('');
    const res = await fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rehearsalId: id, memberId, content }),
    });
    if (res.ok) {
      const added: Feedback = await res.json();
      setFeedbacks((prev) => [...prev, added]);
      setContent('');
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

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-semibold">
        {rehearsal ? `${rehearsal.order}번째 합주 — ${rehearsal.date} ${rehearsal.time}` : '합주 상세'}
      </h1>

      {/* 피드백 작성 */}
      <section className="space-y-3">
        <h2 className="font-medium text-gray-700">피드백 작성</h2>
        <div>
          <label className="block text-sm mb-1">멤버</label>
          <select className="border rounded px-3 py-2 w-full text-sm" value={memberId} onChange={(e) => setMemberId(e.target.value)}>
            <option value="">-- 멤버 선택 --</option>
            {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm mb-1">내용</label>
          <textarea className="border rounded px-3 py-2 w-full text-sm h-24 resize-none" value={content} onChange={(e) => setContent(e.target.value)} placeholder="오늘 합주 피드백을 작성해주세요." />
        </div>
        {feedbackError && <p className="text-red-500 text-sm">{feedbackError}</p>}
        <button onClick={handleFeedbackSave} className="bg-blue-600 text-white rounded px-4 py-2 text-sm font-medium hover:bg-blue-700 transition">저장</button>
      </section>

      {/* 피드백 목록 */}
      {feedbacks.length > 0 && (
        <section className="space-y-2">
          <h2 className="font-medium text-gray-700">피드백 목록</h2>
          {feedbacks.map((f) => (
            <div key={f.id} className="border rounded px-3 py-3 text-sm space-y-1">
              <div className="flex justify-between text-xs text-gray-400">
                <span className="font-medium text-gray-700">{memberMap.get(f.memberId) ?? '(멤버 미선택)'}</span>
                <span>{new Date(f.createdAt).toLocaleString('ko-KR')}</span>
              </div>
              {editId === f.id ? (
                <div className="space-y-1">
                  <textarea className="border rounded px-2 py-1 w-full text-sm h-16 resize-none" value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                  <div className="flex gap-2">
                    <button onClick={() => handleFeedbackEdit(f.id)} className="text-blue-600 text-xs">저장</button>
                    <button onClick={() => setEditId(null)} className="text-gray-400 text-xs">취소</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start gap-2">
                  <p className="whitespace-pre-wrap">{f.content}</p>
                  <button onClick={() => { setEditId(f.id); setEditContent(f.content); }} className="text-blue-500 text-xs shrink-0">수정</button>
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 녹음 파일 업로드 */}
      <section className="space-y-3">
        <h2 className="font-medium text-gray-700">녹음 파일</h2>
        <p className="text-xs text-gray-400">파일 크기: 20MB 이하 / 복수 선택 가능</p>
        <input type="file" multiple accept="audio/*" onChange={handleUpload} className="text-sm" />
        {uploadError && <p className="text-red-500 text-sm">{uploadError}</p>}
        {recordings.length > 0 && (
          <ul className="space-y-1 mt-2">
            {recordings.map((r) => (
              <li key={r.id} className="flex items-center justify-between border rounded px-3 py-2 text-sm">
                <a href={`/recordings/${r.filename}`} download={r.originalName} className="text-blue-600 hover:underline truncate">
                  {r.originalName}
                </a>
                <span className="text-xs text-gray-400 shrink-0 ml-2">{(r.size / 1024 / 1024).toFixed(1)}MB</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
