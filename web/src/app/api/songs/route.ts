import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import { Song } from '@/types';
import { randomUUID } from 'crypto';

export async function GET() {
  const songs = readJson<Song[]>('songs.json');
  return NextResponse.json(songs);
}

export async function POST(req: Request) {
  const { title, artist } = await req.json();
  if (!title?.trim()) {
    return NextResponse.json({ error: '곡명을 입력해주세요.' }, { status: 400 });
  }
  const songs = readJson<Song[]>('songs.json');
  const song: Song = { id: randomUUID(), title: title.trim(), artist: artist?.trim() ?? '' };
  songs.push(song);
  writeJson('songs.json', songs);
  return NextResponse.json(song, { status: 201 });
}

export async function DELETE(req: Request) {
  const { id } = await req.json();
  const songs = readJson<Song[]>('songs.json');
  writeJson('songs.json', songs.filter((s) => s.id !== id));
  return NextResponse.json({ ok: true });
}
