## Why

기획 스펙에 정의된 3개 기능이 미구현 또는 부분 구현 상태로 남아 있어 실제 사용 시 UX 공백이 발생한다. 자동 배분 외 수동 합주 추가, 완료 상태 피드백, 오늘 합주 알림의 전역 노출이 없어 팀 대표와 멤버 모두 불편하다.

## What Changes

- `/planner` 페이지에 **수동 합주 추가** 섹션 추가 — 날짜·시각을 직접 입력해 합주를 한 건씩 등록
- `/calendar` 페이지에서 남은 합주가 0회일 때 배지를 녹색으로 전환하고 "모든 합주를 완료했습니다!" 메시지 표시
- `layout.tsx`에 `RehearsalTodayBanner`를 추가해 홈뿐 아니라 **모든 페이지** 상단에 오늘 합주 알림 표시

## Capabilities

### New Capabilities

- `manual-rehearsal-add`: 팀 대표가 자동 배분 없이 특정 날짜에 합주를 수동으로 추가하는 기능

### Modified Capabilities

- `rehearsal-calendar`: 모든 합주 완료 시 완료 상태 배지와 축하 메시지 표시 (기존엔 "남은 합주: 0회"만 표시)
- `performance-countdown`: 오늘 합주 배너를 랜딩 페이지 전용에서 전체 페이지 공통 레이아웃으로 이동

## Impact

- `web/src/app/planner/page.tsx` — 수동 추가 폼 UI 추가
- `web/src/app/calendar/page.tsx` — 완료 상태 조건 분기 추가
- `web/src/app/layout.tsx` — `RehearsalTodayBanner` 삽입
- `web/src/app/page.tsx` — 기존 배너 중복 제거
- 신규 API 없음 (기존 `POST /api/rehearsals` 재사용)
