import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import { Performance } from '@/types';
import { randomUUID } from 'crypto';

export async function GET() {
  const performance = readJson<Performance | null>('performance.json');
  return NextResponse.json(performance);
}

export async function POST(req: Request) {
  const { name, venue, date } = await req.json();
  if (!date) {
    return NextResponse.json({ error: '공연 날짜를 입력해주세요.' }, { status: 400 });
  }
  const performance: Performance = { id: randomUUID(), name: name ?? '', venue: venue ?? '', date };
  writeJson('performance.json', performance);
  return NextResponse.json(performance, { status: 201 });
}
