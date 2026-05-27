export interface Member {
  id: string;
  name: string;
}

export interface PersonalSchedule {
  id: string;
  memberId: string;
  date: string; // ISO date string YYYY-MM-DD
  note?: string;
}

export interface Performance {
  id: string;
  name: string;
  venue: string;
  date: string; // ISO date string YYYY-MM-DD
}

export interface RehearsalSession {
  id: string;
  date: string; // ISO date string YYYY-MM-DD
  time: string; // HH:MM
  order: number; // 1-based index among all rehearsals
}

export interface Feedback {
  id: string;
  rehearsalId: string;
  memberId: string;
  content: string;
  createdAt: string; // ISO datetime string
  updatedAt?: string;
}

export interface RecordingFile {
  id: string;
  rehearsalId: string;
  filename: string;
  originalName: string;
  size: number;
  uploadedAt: string; // ISO datetime string
}
