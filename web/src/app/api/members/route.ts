import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import { Member } from '@/types';
import { randomUUID } from 'crypto';

export async function GET() {
  const members = readJson<Member[]>('members.json');
  return NextResponse.json(members);
}

export async function POST(req: Request) {
  const { name } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: '이름을 입력해주세요.' }, { status: 400 });
  }
  const members = readJson<Member[]>('members.json');
  const member: Member = { id: randomUUID(), name: name.trim() };
  members.push(member);
  writeJson('members.json', members);
  return NextResponse.json(member, { status: 201 });
}
