# Technical Design

## 1. 문서 목적

이 문서는 밴드 합주 관리 서비스의 기술 구현 방향을 정리한다.
제품의 가치나 사용자 문제는 Product Brief에서 다루고, 이 문서에서는 실제 개발자가 구현할 구조를 정의한다.

---

## 2. Architecture Overview

## 전체 구조

```text
User
→ Next.js App
→ Pages / Routes
→ UI Components
→ Feature Logic (Members / Rehearsals / Feedback)
→ Scheduler Algorithm (auto-schedule)
→ Client State (useState)
→ localStorage
→ Future Backend
```

## 이번 MVP의 구현 범위

* 단일 사용자 기준
* 프론트엔드 중심 구현
* 서버 DB 없이 localStorage 사용
* 자동 스케줄링 알고리즘 클라이언트에서 구현
* 인증, 결제, 실시간 기능 제외

---

## 3. Tech Stack

| Area            | Technology       | Reason                        |
| --------------- | ---------------- | ----------------------------- |
| Framework       | Next.js          | App Router 기반 웹앱 구현           |
| UI Library      | React            | 컴포넌트 기반 UI 구성                 |
| Language        | TypeScript       | 타입 기반 안정성 확보                  |
| Styling         | Tailwind CSS     | 빠른 UI 스타일링                    |
| AI Coding       | Claude Code      | 코드 생성, 수정, 검토                 |
| Version Control | GitHub           | 커밋, 브랜치, 비교 실험                |
| Test            | Playwright later | 4회차 테스트 자동화 예정                |

---

## 4. Route Design

| Route  | File Path              | Purpose       | Notes                      |
| ------ | ---------------------- | ------------- | -------------------------- |
| `/`    | `src/app/page.tsx`     | Landing Page  | 서비스 소개, CTA 버튼              |
| `/app` | `src/app/app/page.tsx` | Main App Page | 멤버 관리, 합주 일정, 캘린더, 피드백 탭 |

---

## 5. Source Structure

```text
src/
  app/
    page.tsx
    app/
      page.tsx

  components/
    ui/
      Button.tsx
      Input.tsx
      Card.tsx
      DatePicker.tsx

    layout/
      AppHeader.tsx
      TabNavigation.tsx

  features/
    members/
      types.ts
      storage.ts
      mock-data.ts
      components/
        MemberForm.tsx
        MemberList.tsx
        UnavailableDatePicker.tsx

    rehearsals/
      types.ts
      storage.ts
      scheduler.ts
      mock-data.ts
      components/
        PerformanceSetup.tsx
        RehearsalCalendar.tsx
        RehearsalCard.tsx
        RehearsalProgress.tsx
        TodayAlert.tsx
        EmptyState.tsx

    feedback/
      types.ts
      storage.ts
      components/
        FeedbackForm.tsx
        RecordingUpload.tsx
        FeedbackList.tsx
```

## 폴더 역할

| Folder                              | Role                        |
| ----------------------------------- | --------------------------- |
| `src/app`                           | Next.js route와 page 관리      |
| `src/components/ui`                 | 재사용 가능한 기본 UI 컴포넌트          |
| `src/components/layout`             | 레이아웃 관련 컴포넌트                |
| `src/features/members`              | 멤버 및 개인 일정 기능 단위 코드         |
| `src/features/rehearsals`           | 합주 일정 생성 및 캘린더 기능 코드        |
| `src/features/rehearsals/scheduler` | 자동 스케줄링 알고리즘                |
| `src/features/feedback`             | 피드백 및 녹음 기능 코드              |

---

## 6. Feature Module Design

## 핵심 Feature

| Feature                    | Description                    | Priority |
| -------------------------- | ------------------------------ | -------- |
| Member Register            | 밴드 멤버 등록 및 관리                  | Must     |
| Unavailable Date Input     | 멤버별 불가 날짜 입력                   | Must     |
| Auto Schedule Generation   | 공연 날짜·합주 횟수 기반 자동 합주 일정 생성     | Must     |
| Rehearsal Calendar View    | 합주 일정 캘린더 표시 및 남은 횟수 확인        | Must     |
| Today Alert                | 당일 합주 알림 및 몇 번째 합주인지 표시        | Must     |
| Feedback Write             | 합주별 멤버 피드백 작성                  | Should   |
| Recording Upload           | 합주별 녹음 파일 업로드 (여러 개)           | Should   |
| Member / Schedule Delete   | 멤버 또는 불가 날짜 삭제                 | Nice     |
| Manual Schedule Edit       | 자동 생성된 합주 날짜 수동 수정             | Nice     |

## 이번 회차에서 구현할 Feature

* Route 구조
* Landing Page 초안
* App Page shell (탭 네비게이션 포함)
* 기본 타입 정의
* 컴포넌트 placeholder
* mock data 또는 빈 상태

## 다음 회차로 넘길 Feature

* 실제 멤버 등록 및 불가 날짜 입력 로직
* 자동 스케줄링 알고리즘
* 캘린더 뷰 로직
* 당일 알림 로직
* 피드백 작성 및 녹음 업로드 로직

---

## 7. Data Model

## 기본 타입

```ts
export type Member = {
  id: string;
  name: string;
  instrument?: string;
};

export type UnavailableDate = {
  id: string;
  memberId: string;
  date: string; // "YYYY-MM-DD"
};

export type Performance = {
  id: string;
  title: string;
  date: string; // "YYYY-MM-DD"
  venue?: string;
};

export type RehearsalStatus = "scheduled" | "completed" | "cancelled";

export type RehearsalSession = {
  id: string;
  sessionNumber: number;
  date: string; // "YYYY-MM-DD"
  time?: string; // "HH:mm"
  location?: string;
  status: RehearsalStatus;
  createdAt: string;
  updatedAt: string;
};

export type Feedback = {
  id: string;
  rehearsalId: string;
  memberId: string;
  content: string;
  createdAt: string;
};

export type Recording = {
  id: string;
  rehearsalId: string;
  fileName: string;
  fileSize: number;
  fileDataUrl: string; // base64, localStorage MVP용
  uploadedAt: string;
};
```

## 서비스별 확장 필드

| Field           | Type              | Required | Description            |
| --------------- | ----------------- | -------- | ---------------------- |
| `sessionNumber` | `number`          | Yes      | 몇 번째 합주인지 (1부터 시작)     |
| `status`        | `RehearsalStatus` | Yes      | scheduled / completed / cancelled |
| `time`          | `string`          | No       | 합주 시작 시간 (당일 알림용)      |
| `fileDataUrl`   | `string`          | Yes      | 녹음 파일 base64 데이터       |

---

## 8. State Design

| State                | Type                        | Purpose               |
| -------------------- | --------------------------- | --------------------- |
| `members`            | `Member[]`                  | 등록된 멤버 목록             |
| `unavailableDates`   | `UnavailableDate[]`         | 멤버별 불가 날짜 목록          |
| `performance`        | `Performance \| null`       | 공연 정보 (날짜, 장소)        |
| `rehearsals`         | `RehearsalSession[]`        | 생성된 합주 일정 목록          |
| `feedbacks`          | `Feedback[]`                | 합주별 피드백 목록            |
| `recordings`         | `Recording[]`               | 합주별 녹음 파일 목록          |
| `activeTab`          | `string`                    | 현재 선택된 탭              |
| `selectedRehearsal`  | `string \| null`            | 피드백 탭에서 선택된 합주 ID     |
| `validationError`    | `string \| null`            | 입력 오류 메시지             |

## 상태 관리 방식

이번 MVP에서는 별도 상태 관리 라이브러리를 사용하지 않는다.

* React `useState`
* 필요 시 `useMemo` (필터링, 남은 횟수 계산)
* localStorage helper 함수

---

## 9. Storage Strategy

## 1차 MVP

| Option       | Decision                        |
| ------------ | ------------------------------- |
| DB           | 사용하지 않음                         |
| API Server   | 사용하지 않음                         |
| localStorage | 기본 저장 방식 (members, rehearsals, feedbacks, recordings) |
| mock data    | 초기 화면 구성용                       |

## 저장 흐름

```text
User Action
→ React State Update
→ localStorage Save
→ UI Re-render
```

## 향후 확장 가능성

* DB 저장
* 사용자 인증 및 팀 공유
* Server Actions
* API Route
* 구글 캘린더 연동

---

## 10. Scheduler Algorithm

## 자동 합주 일정 생성 로직

```text
Input: 공연 날짜, 합주 횟수 N, 멤버별 불가 날짜 목록

1. 오늘부터 공연 전날까지의 날짜 배열 생성
2. 모든 멤버의 불가 날짜를 제외하여 가능 날짜 배열 도출
3. 가능 날짜가 N개 미만이면 경고 반환
4. 가능 날짜 배열을 N개 구간으로 균등 분할
5. 각 구간에서 중간 또는 첫 번째 가능 날짜를 합주 날짜로 선택
6. RehearsalSession 목록 반환
```

## API Design (향후 확장)

이번 MVP에서는 서버 API를 구현하지 않는다.

| API                   | Method   | Purpose          |
| --------------------- | -------- | ---------------- |
| `/api/members`        | `GET`    | 멤버 목록 조회         |
| `/api/members`        | `POST`   | 멤버 생성            |
| `/api/rehearsals`     | `GET`    | 합주 일정 목록 조회      |
| `/api/rehearsals`     | `POST`   | 합주 일정 자동 생성      |
| `/api/rehearsals/:id` | `PATCH`  | 합주 상태 변경         |
| `/api/feedback`       | `POST`   | 피드백 작성           |
| `/api/recordings`     | `POST`   | 녹음 파일 업로드        |

---

## 11. Validation Rules

| Rule                    | Description                          |
| ----------------------- | ------------------------------------ |
| Required Member Name    | 멤버 이름은 비어 있을 수 없다                    |
| Valid Performance Date  | 공연 날짜는 오늘 이후여야 한다                    |
| Rehearsal Count Range   | 합주 횟수는 1 이상이어야 하며 가능 날짜 수를 초과할 수 없다  |
| Available Dates Exist   | 자동 생성 시 가능한 날짜가 요청 횟수 이상이어야 한다       |
| Feedback Content        | 피드백 내용은 비어 있을 수 없다                   |
| Recording File Size     | 녹음 파일은 50MB 이하여야 한다                  |
| Valid Status            | 합주 상태는 정의된 값(scheduled/completed/cancelled)만 허용한다 |

---

## 12. Error Handling

| Situation               | Handling                           |
| ----------------------- | ---------------------------------- |
| 멤버 이름 미입력               | 입력 오류 메시지 표시, 추가 차단               |
| 공연 날짜가 과거               | 오류 메시지 표시, 생성 차단                  |
| 가능 날짜 부족                | "가능한 날짜가 부족합니다" 경고 메시지 표시         |
| localStorage 읽기 실패      | 빈 배열/null로 fallback               |
| 파일 크기 초과                | "50MB 이하의 파일만 업로드 가능합니다" 메시지 표시   |
| 데이터 없음                  | EmptyState 컴포넌트 표시                |

---

## 13. Accessibility Considerations

* 입력 필드는 label을 가진다.
* 버튼 텍스트는 기능을 설명한다.
* 색상만으로 합주 상태를 구분하지 않는다.
* 주요 영역은 heading 구조를 가진다.
* 키보드로 주요 액션을 수행할 수 있어야 한다.

---

## 14. Security Considerations

이번 MVP에서 지킬 보안 원칙

* API key를 코드에 넣지 않는다.
* `.env` 파일을 GitHub에 올리지 않는다.
* 민감한 개인정보를 저장하지 않는다.
* localStorage에는 민감 정보 저장을 피한다.
* 인증이 필요한 기능은 이번 MVP에서 제외한다.

---

## 15. Decision Log

| Decision              | Reason                             | Consequence                      |
| --------------------- | ---------------------------------- | -------------------------------- |
| Next.js App Router 사용 | 현재 Next.js 기본 구조와 수업 방향에 적합       | `src/app` 기준 라우팅                 |
| TypeScript 사용         | 데이터 구조와 컴포넌트 props를 명확히 하기 위해      | 초기 작성량 증가                        |
| localStorage 우선       | 4회차 안에 MVP 완성하기 위해                 | 다중 사용자/팀 공유 기능 제외                |
| 단일 사용자 기준            | MVP 범위 통제                         | 팀원 간 실시간 공유는 향후 확장               |
| 스케줄링 알고리즘 클라이언트 구현   | 서버 없는 MVP에서 구현 가능, 학습 목적          | 복잡한 제약 조건(우선순위 등)은 단순화           |
| base64로 녹음 파일 저장      | 서버 없는 MVP에서 파일 저장 방법              | 대용량 파일 제한 필요 (50MB 이하)           |

---

## 16. Implementation Notes

3회차에서 구현할 때 Claude Code는 다음 순서를 따른다.

1. 현재 파일 구조 확인
2. `planning/md-design` 문서 읽기
3. 수정 전 계획 제안
4. 작은 단위로 구현 (멤버 → 일정 → 캘린더 → 피드백 순서)
5. 실행 또는 build로 검증
6. 변경 파일 요약
7. commit message 제안

---

## 17. Open Questions

| Question                    | Decision Needed By |
| --------------------------- | ------------------ |
| 합주 시간(time)을 입력받을 것인가?      | 3회차 시작 전           |
| 녹음 파일은 base64 또는 URL 방식인가?  | 3회차 시작 전           |
| 합주 상태(completed)는 누가 변경하는가? | 3회차 중              |
| 캘린더는 월별 뷰인가, 리스트 뷰인가?       | 3회차 시작 전           |