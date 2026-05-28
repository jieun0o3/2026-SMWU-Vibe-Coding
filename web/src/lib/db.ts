import fs from 'fs';
import path from 'path';

const IS_VERCEL = process.env.VERCEL === '1';
const ORIG_DATA_DIR = path.join(process.cwd(), 'data');
const TMP_DATA_DIR = '/tmp/band-data';

function getDataDir(): string {
  if (!IS_VERCEL) return ORIG_DATA_DIR;
  if (!fs.existsSync(TMP_DATA_DIR)) {
    fs.mkdirSync(TMP_DATA_DIR, { recursive: true });
    for (const file of fs.readdirSync(ORIG_DATA_DIR)) {
      fs.copyFileSync(
        path.join(ORIG_DATA_DIR, file),
        path.join(TMP_DATA_DIR, file),
      );
    }
  }
  return TMP_DATA_DIR;
}

export function readJson<T>(filename: string): T {
  const raw = fs.readFileSync(path.join(getDataDir(), filename), 'utf-8');
  return JSON.parse(raw) as T;
}

export function writeJson<T>(filename: string, data: T): void {
  fs.writeFileSync(path.join(getDataDir(), filename), JSON.stringify(data, null, 2), 'utf-8');
}
