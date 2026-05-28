## 1. 합주 수동 추가 (manual-rehearsal-add)

- [x] 1.1 `/planner` 페이지에 "④ 합주 수동 추가" 섹션 UI 추가 (날짜·시각 입력 + 추가 버튼)
- [x] 1.2 날짜 미입력 시 에러 메시지 표시 및 API 호출 차단
- [x] 1.3 기존 `POST /api/rehearsals` 엔드포인트에 단건 배열로 요청 후 목록 갱신

## 2. 모든 합주 완료 메시지 (rehearsal-calendar)

- [x] 2.1 `/calendar` 페이지에서 `allDone` 조건 계산 (`rehearsals.length > 0 && remaining === 0`)
- [x] 2.2 `allDone` 시 배지 색상을 green으로 전환, 텍스트를 "모든 합주 완료 🎉"로 변경
- [x] 2.3 페이지 하단에 완료 축하 메시지 카드 표시

## 3. 오늘 합주 배너 전체 페이지 노출 (performance-countdown)

- [x] 3.1 `layout.tsx`에 `RehearsalTodayBanner` 임포트 및 Header 아래 삽입
- [x] 3.2 `app/page.tsx`에서 중복 `RehearsalTodayBanner` 렌더 제거
