## Why

밴드 멤버들이 합주 일정을 조율하고 공연을 준비하는 과정은 단체 카톡방, 메모 등에 흩어져 있어 비효율적이다. 공연 날짜를 기준으로 합주 횟수와 간격을 자동으로 계산하고, 피드백과 녹음을 한 곳에 모아 팀 전체의 준비 상태를 한눈에 볼 수 있는 도구가 필요하다.

## What Changes

- 멤버 각자가 자신의 불가능한 날짜를 등록할 수 있음
- 팀 대표가 공연 날짜와 원하는 합주 횟수를 입력하면, 전원 가능한 날짜를 찾아 합주 일정을 자동 배분
- 합주 일정을 캘린더로 시각화하고 남은 합주 횟수를 표시
- 공연 D-day 카운트다운 및 당일 합주 알림(몇 시에 합주가 있는지)
- 합주 종료 후 멤버별 피드백 작성 및 녹음 파일 다중 업로드

## Capabilities

### New Capabilities

- `personal-schedule`: 멤버별 개인 불가 일정 등록 및 조회
- `rehearsal-scheduler`: 개인 일정을 종합해 공연까지 합주를 자동 배분하는 스케줄러
- `rehearsal-calendar`: 합주 일정 캘린더 뷰 및 남은 횟수 표시
- `performance-countdown`: 공연 D-day 및 당일 합주 시간 알림
- `rehearsal-feedback`: 합주별 멤버 피드백 작성 및 녹음 파일 업로드

### Modified Capabilities

(없음 — 신규 프로젝트)

## Impact

- Next.js App Router 기반의 신규 프로젝트 생성 필요
- 상태 관리: 멤버 일정, 합주 일정, 피드백 데이터 (초기에는 localStorage 또는 간단한 JSON API)
- 파일 업로드: 합주 녹음 파일 (복수) — 파일 크기 제한 필요
- 알림: 브라우저 Notification API 또는 페이지 내 배너 방식
