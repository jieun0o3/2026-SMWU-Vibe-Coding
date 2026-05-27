import { NextResponse } from 'next/server';
import { readJson, writeJson } from '@/lib/db';
import { RecordingFile } from '@/types';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';

const MAX_SIZE = 20 * 1024 * 1024; // 20MB
const RECORDINGS_DIR = path.join(process.cwd(), 'public', 'recordings');

export async function POST(req: Request) {
  const formData = await req.formData();
  const rehearsalId = formData.get('rehearsalId') as string;
  const files = formData.getAll('files') as File[];

  if (!files.length) {
    return NextResponse.json({ error: '파일을 선택해주세요.' }, { status: 400 });
  }

  const recordings = readJson<RecordingFile[]>('recordings.json');
  const created: RecordingFile[] = [];

  for (const file of files) {
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: `파일 크기는 20MB 이하여야 합니다. (${file.name})` },
        { status: 400 }
      );
    }
    const ext = path.extname(file.name);
    const filename = `${randomUUID()}${ext}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(path.join(RECORDINGS_DIR, filename), buffer);

    const record: RecordingFile = {
      id: randomUUID(),
      rehearsalId,
      filename,
      originalName: file.name,
      size: file.size,
      uploadedAt: new Date().toISOString(),
    };
    recordings.push(record);
    created.push(record);
  }

  writeJson('recordings.json', recordings);
  return NextResponse.json(created, { status: 201 });
}
