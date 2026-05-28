import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import { Team } from '@/types';
import { randomUUID } from 'crypto';

export async function GET() {
  const teams = readJson<Team[]>('teams.json');
  return NextResponse.json(teams);
}

export async function POST(req: Request) {
  const { name, memberIds } = await req.json();
  if (!name?.trim()) {
    return NextResponse.json({ error: '팀 이름을 입력해주세요.' }, { status: 400 });
  }
  const teams = readJson<Team[]>('teams.json');
  const team: Team = { id: randomUUID(), name: name.trim(), memberIds: memberIds ?? [] };
  teams.push(team);
  writeJson('teams.json', teams);
  return NextResponse.json(team, { status: 201 });
}

export async function PUT(req: Request) {
  const { id, name, memberIds } = await req.json();
  const teams = readJson<Team[]>('teams.json');
  const updated = teams.map((t) =>
    t.id === id
      ? {
          ...t,
          ...(name !== undefined && { name }),
          ...(memberIds !== undefined && { memberIds }),
        }
      : t,
  );
  writeJson('teams.json', updated);
  return NextResponse.json(updated.find((t) => t.id === id));
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const teams = readJson<Team[]>('teams.json');
  writeJson('teams.json', teams.filter((t) => t.id !== id));
  return NextResponse.json({ ok: true });
}
