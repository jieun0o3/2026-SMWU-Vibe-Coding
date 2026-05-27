import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import { Feedback } from '@/types';
import { randomUUID } from 'crypto';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const rehearsalId = searchParams.get('rehearsalId');
  const feedback = readJson<Feedback[]>('feedback.json');
  const result = rehearsalId ? feedback.filter((f) => f.rehearsalId === rehearsalId) : feedback;
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const { rehearsalId, memberId, content } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: '피드백 내용을 입력해주세요.' }, { status: 400 });
  }
  const feedback = readJson<Feedback[]>('feedback.json');
  const entry: Feedback = {
    id: randomUUID(),
    rehearsalId,
    memberId,
    content: content.trim(),
    createdAt: new Date().toISOString(),
  };
  writeJson('feedback.json', [...feedback, entry]);
  return NextResponse.json(entry, { status: 201 });
}

export async function PUT(req: Request) {
  const { id, content } = await req.json();
  if (!content?.trim()) {
    return NextResponse.json({ error: '피드백 내용을 입력해주세요.' }, { status: 400 });
  }
  const feedback = readJson<Feedback[]>('feedback.json');
  const updated = feedback.map((f) =>
    f.id === id ? { ...f, content: content.trim(), updatedAt: new Date().toISOString() } : f
  );
  writeJson('feedback.json', updated);
  return NextResponse.json(updated.find((f) => f.id === id));
}
