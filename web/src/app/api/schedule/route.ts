import { NextResponse } from 'next/server';
import { readJson } from '@/lib/db';
import { PersonalSchedule } from '@/types';
import { scheduleRehearsals } from '@/lib/scheduler';

export async function POST(req: Request) {
  const { performanceDate, count, time, memberIds } = await req.json();
  if (!performanceDate || !count) {
    return NextResponse.json({ error: '공연 날짜와 합주 횟수를 입력해주세요.' }, { status: 400 });
  }
  let schedules = readJson<PersonalSchedule[]>('personal-schedules.json');
  if (memberIds && Array.isArray(memberIds) && memberIds.length > 0) {
    const memberSet = new Set<string>(memberIds);
    schedules = schedules.filter((s) => memberSet.has(s.memberId));
  }
  const blockedDates = schedules.map((s) => s.date);
  const result = scheduleRehearsals({ performanceDate, count: Number(count), blockedDates, time: time ?? '14:00' });
  return NextResponse.json(result);
}
