## 1. 프로젝트 초기 설정

- [x] 1.1 `create-next-app`으로 Next.js + TypeScript + Tailwind CSS 프로젝트 생성
- [x] 1.2 `src/`, `tests/`, `public/recordings/` 디렉토리 구조 생성
- [x] 1.3 데이터 파일 저장 경로 (`data/`) 및 초기 JSON 파일 생성 (members, schedules, feedback)
- [x] 1.4 공통 타입 정의 (`src/types/index.ts`): Member, PersonalSchedule, Performance, RehearsalSession, Feedback, RecordingFile

## 2. 데이터 API Routes

- [x] 2.1 `GET/POST /api/members` — 멤버 목록 조회 및 등록
- [x] 2.2 `GET/POST/DELETE /api/personal-schedules` — 멤버별 불가 날짜 CRUD
- [x] 2.3 `GET/POST /api/performance` — 공연 정보(날짜, 장소) 조회 및 저장
- [x] 2.4 `GET/POST/PUT/DELETE /api/rehearsals` — 합주 일정 CRUD
- [x] 2.5 `GET/POST/PUT /api/feedback` — 합주별 피드백 CRUD
- [x] 2.6 `POST /api/upload` — 녹음 파일 multipart 업로드 (20MB 제한), `GET /api/recordings/[rehearsalId]` — 파일 목록 조회

## 3. 합주 자동 배분 알고리즘

- [x] 3.1 `src/lib/scheduler.ts` 작성: 전원 가능 날짜 집합 계산 함수
- [x] 3.2 균등 간격 배분 함수: `Math.floor(가용일수 / (횟수 + 1))` 방식으로 N개 날짜 선택
- [x] 3.3 가용일 부족 시 경고 메시지 반환 로직 추가

## 4. 개인 일정 등록 화면

- [x] 4.1 멤버 선택 드롭다운 컴포넌트
- [x] 4.2 날짜 멀티 선택 UI (날짜 클릭 토글 방식)
- [x] 4.3 불가 날짜 목록 표시 및 삭제 버튼
- [x] 4.4 저장 버튼 및 유효성 검사 (날짜 미선택 시 안내)

## 5. 합주 일정 자동 배분 화면 (팀 대표용)

- [x] 5.1 공연 날짜·장소·이름 입력 폼
- [x] 5.2 원하는 합주 횟수 및 합주 시작 시각 입력 폼
- [x] 5.3 "자동 배분" 버튼 → 스케줄러 호출 및 결과 미리보기
- [x] 5.4 미리보기 확정 버튼으로 합주 일정 저장
- [x] 5.5 생성된 합주 목록에서 날짜 수동 수정·삭제 UI

## 6. 합주 캘린더 화면

- [x] 6.1 월간 그리드 캘린더 컴포넌트 (Tailwind, 외부 라이브러리 없음)
- [x] 6.2 합주 날짜 셀에 "N번째 합주" 배지 표시
- [x] 6.3 이전/다음 월 이동 버튼
- [x] 6.4 오늘 날짜 강조 스타일
- [x] 6.5 캘린더 상단 "남은 합주: N회" 표시

## 7. 공연 D-day 및 당일 합주 알림

- [x] 7.1 헤더 컴포넌트에 공연 D-day 카운트다운 표시 (D-N / D-Day / 공연 완료)
- [x] 7.2 앱 진입 시 오늘 합주 여부 체크 훅(`useRehearsalToday`)
- [x] 7.3 오늘 합주 있을 때 상단 배너 컴포넌트 ("오늘은 N번째 합주입니다! 합주 시간: HH:MM")

## 8. 합주 상세 · 피드백 · 녹음 파일 화면

- [x] 8.1 합주 상세 페이지 (`/rehearsal/[id]`) 생성
- [x] 8.2 멤버 선택 + 피드백 텍스트 입력 + 저장 폼
- [x] 8.3 피드백 목록 표시 (작성자, 내용, 시각) 및 수정 버튼
- [x] 8.4 파일 선택(복수) + 업로드 버튼 (20MB 제한 안내)
- [x] 8.5 업로드된 녹음 파일 목록 표시 및 파일명 클릭 시 다운로드

## 9. 라우팅 및 네비게이션

- [x] 9.1 `/` 랜딩 페이지 — 앱 소개 및 시작 버튼
- [x] 9.2 오늘 합주 배너 + 공연 D-day + 빠른 링크 (랜딩 페이지에 통합)
- [x] 9.3 공통 헤더 네비게이션 (개인일정 / 캘린더 / 합주 배분 메뉴)
