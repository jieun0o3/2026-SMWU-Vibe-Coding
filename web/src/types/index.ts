export interface Member {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
  memberIds: string[];
}

export interface Song {
  id: string;
  title: string;
  artist: string;
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
  label?: string; // team name or "title - artist"
  groupId?: string; // teamId or songId
  groupType?: 'team' | 'song';
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
