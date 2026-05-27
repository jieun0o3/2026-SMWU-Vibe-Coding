export interface SchedulerInput {
  performanceDate: string; // YYYY-MM-DD
  count: number;
  blockedDates: string[]; // YYYY-MM-DD, union of all members' unavailable dates
  time: string; // HH:MM
}

export interface SchedulerResult {
  dates: string[];
  warning?: string;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function toISO(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function scheduleRehearsals(input: SchedulerInput): SchedulerResult {
  const { performanceDate, count, blockedDates, time } = input;
  const blocked = new Set(blockedDates);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const perf = new Date(performanceDate);
  perf.setHours(0, 0, 0, 0);

  // collect all available days from tomorrow up to day before performance
  const available: string[] = [];
  let cursor = addDays(today, 1);
  while (cursor < perf) {
    const iso = toISO(cursor);
    if (!blocked.has(iso)) {
      available.push(iso);
    }
    cursor = addDays(cursor, 1);
  }

  if (available.length === 0) {
    return { dates: [], warning: '가능한 날짜가 없습니다.' };
  }

  let warning: string | undefined;
  const actualCount = Math.min(count, available.length);
  if (actualCount < count) {
    warning = `가능한 날짜가 부족하여 ${actualCount}회만 배정됩니다. (요청: ${count}회)`;
  }

  // pick evenly spaced dates
  const selected: string[] = [];
  const step = available.length / (actualCount + 1);
  for (let i = 1; i <= actualCount; i++) {
    const idx = Math.min(Math.round(step * i) - 1, available.length - 1);
    selected.push(available[idx]);
  }

  // deduplicate (in case of rounding collision)
  const unique = [...new Set(selected)];

  return { dates: unique, warning };
}
