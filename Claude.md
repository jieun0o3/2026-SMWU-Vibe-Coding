# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# Project

Micro SaaS MVP for a Vibe Coding class (2026 SMWU). The product idea and target user are TBD — fill in before Session 2.

# Tech Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS
- OpenSpec (`openspec` CLI, globally installed)

# Commands

Next.js app lives in `web/`. Run all commands from there:

```bash
cd web
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # ESLint
```

# Architecture

App router pages (`web/src/app/`):

- `/` — Landing + today-rehearsal banner
- `/schedule` — 멤버별 불가 날짜 등록
- `/planner` — 합주 자동 배분 (팀 대표용)
- `/calendar` — 월간 합주 캘린더
- `/rehearsal/[id]` — 합주 상세, 피드백, 녹음 업로드

Key source files:

- `web/src/lib/scheduler.ts` — 합주 자동 배분 알고리즘 (균등 간격)
- `web/src/lib/db.ts` — JSON 파일 I/O (data/*.json)
- `web/src/hooks/useRehearsalToday.ts` — 오늘 합주 여부 확인 훅
- `web/src/components/Header.tsx` — 공연 D-day 카운트다운 포함
- `web/data/` — JSON 파일 데이터 저장소 (members, rehearsals, feedback 등)
- `web/public/recordings/` — 업로드된 녹음 파일 저장

# UI Rules

From [Design.md](Design.md):

- Visual tone: calm, minimal, easy to scan; card-based where useful.
- Use clear button text, labels for inputs, and semantic headings.
- Avoid icon-only actions and arbitrary design changes.

# Working Rules

- Read relevant files before suggesting changes.
- Explain the plan before editing files.
- Keep changes small; do not add unnecessary dependencies.
- Update this file and docs when project direction changes.
- Summarize changed files before committing.

# Boundaries

Do not add: payment, complex authentication, real-time collaboration, large file upload, or multiple external API integrations.
