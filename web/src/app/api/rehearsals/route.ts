import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import { RehearsalSession } from '@/types';
import { randomUUID } from 'crypto';

function reorder(sessions: RehearsalSession[]): RehearsalSession[] {
  return [...sessions]
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((s, i) => ({ ...s, order: i + 1 }));
}

export async function GET() {
  const rehearsals = readJson<RehearsalSession[]>('rehearsals.json');
  return NextResponse.json(rehearsals);
}

export async function POST(req: Request) {
  const body = await req.json();
  // body can be a single session or an array (bulk create from scheduler)
  const sessions = readJson<RehearsalSession[]>('rehearsals.json');
  const incoming: Omit<RehearsalSession, 'id' | 'order'>[] = Array.isArray(body) ? body : [body];
  const created: RehearsalSession[] = incoming.map((s) => ({
    id: randomUUID(),
    date: s.date,
    time: s.time,
    order: 0,
  }));
  const updated = reorder([...sessions, ...created]);
  writeJson('rehearsals.json', updated);
  return NextResponse.json(updated, { status: 201 });
}

export async function PUT(req: Request) {
  const { id, date, time } = await req.json();
  const sessions = readJson<RehearsalSession[]>('rehearsals.json');
  const updated = reorder(sessions.map((s) => (s.id === id ? { ...s, date: date ?? s.date, time: time ?? s.time } : s)));
  writeJson('rehearsals.json', updated);
  return NextResponse.json(updated);
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const sessions = readJson<RehearsalSession[]>('rehearsals.json');
  const updated = reorder(sessions.filter((s) => s.id !== id));
  writeJson('rehearsals.json', updated);
  return NextResponse.json({ ok: true });
}
