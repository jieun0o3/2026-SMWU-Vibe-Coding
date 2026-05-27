import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import { PersonalSchedule } from '@/types';
import { randomUUID } from 'crypto';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const memberId = searchParams.get('memberId');
  const schedules = readJson<PersonalSchedule[]>('personal-schedules.json');
  const result = memberId ? schedules.filter((s) => s.memberId === memberId) : schedules;
  return NextResponse.json(result);
}

export async function POST(req: Request) {
  const { memberId, dates, note } = await req.json();
  if (!memberId || !Array.isArray(dates) || dates.length === 0) {
    return NextResponse.json({ error: '멤버와 날짜를 선택해주세요.' }, { status: 400 });
  }
  const schedules = readJson<PersonalSchedule[]>('personal-schedules.json');
  const created: PersonalSchedule[] = dates.map((date: string) => ({
    id: randomUUID(),
    memberId,
    date,
    note,
  }));
  writeJson('personal-schedules.json', [...schedules, ...created]);
  return NextResponse.json(created, { status: 201 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const schedules = readJson<PersonalSchedule[]>('personal-schedules.json');
  const updated = schedules.filter((s) => s.id !== id);
  writeJson('personal-schedules.json', updated);
  return NextResponse.json({ ok: true });
}
