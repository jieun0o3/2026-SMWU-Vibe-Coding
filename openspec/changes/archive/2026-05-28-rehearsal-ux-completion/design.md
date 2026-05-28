## Context

기존 band-rehearsal-manager 변경에서 5개 기능이 구현됐으나, 3개 항목이 미구현 또는 부분 구현으로 남았다. 모두 프런트엔드 단의 UI 보완이며 신규 API는 불필요하다. 기존 `POST /api/rehearsals`가 배열 형태의 합주 목록을 받아 저장하므로, 단일 합주 수동 추가에도 동일 엔드포인트를 재사용할 수 있다.

## Goals / Non-Goals

**Goals:**
- `/planner`에서 날짜·시각 입력으로 합주 1건을 수동 추가
- `/calendar`에서 잔여 합주 0회일 때 완료 상태 UI 표시
- 모든 페이지 상단에 오늘 합주 배너 노출 (layout.tsx 공통화)

**Non-Goals:**
- 수동 추가 시 멤버 가용성 검증 (MVP 범위 외)
- 배너 푸시 알림 (브라우저 Notification API)
- 합주 완료 여부 수동 마킹 기능

## Decisions

**1. 수동 추가 API 재사용**
- 기존 `POST /api/rehearsals`는 `{ date, time }[]` 배열을 받음
- 단건 추가 시 `[{ date, time }]` 배열로 감싸서 동일 엔드포인트 호출
- 이유: 신규 라우트 없이 최소 변경으로 구현 가능

**2. 배너 공통화 위치: layout.tsx**
- `Header.tsx` 내부에 넣으면 sticky 헤더와 결합되어 레이아웃 복잡도 증가
- layout.tsx에서 Header 바로 아래 `RehearsalTodayBanner`를 렌더하면 모든 페이지에 자동 적용
- 홈 페이지(page.tsx)에서 중복 렌더 제거 필요

**3. 완료 상태 조건**
- `rehearsals.length > 0 && remaining === 0` 조건으로 "모든 합주 완료" 판단
- 합주가 아예 없는 상태와 구별하기 위해 `rehearsals.length > 0` 검사 포함

## Risks / Trade-offs

- [수동 추가 중복] 같은 날 합주가 이미 있어도 추가됨 → MVP에서는 허용, 추후 중복 검사 추가 가능
- [배너 레이아웃 밀림] 배너가 표시될 때 메인 콘텐츠가 아래로 밀림 → 높이가 일정하므로 허용 범위
