import { NextResponse } from 'next/server';
import { readJson } from '@/lib/db';
import { RecordingFile } from '@/types';

export async function GET(_req: Request, { params }: { params: Promise<{ rehearsalId: string }> }) {
  const { rehearsalId } = await params;
  const recordings = readJson<RecordingFile[]>('recordings.json');
  return NextResponse.json(recordings.filter((r) => r.rehearsalId === rehearsalId));
}
