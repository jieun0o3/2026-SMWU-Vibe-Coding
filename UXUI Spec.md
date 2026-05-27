# UX / UI Spec

## 1. Design Reference

Follow:

- docs/DESIGN.md

## 2. Screen Map

| Screen       | Route  | Purpose              |
|---|---|---|
| Landing Page | `/`    | 서비스 소개와 앱 진입         |
| App Page     | `/app` | 멤버 관리, 합주 일정, 피드백 기능 |

## 3. Landing Page

### Purpose

밴드의 합주 일정 조율 문제를 소개하고, 서비스의 핵심 가치를 전달하며 사용자를 앱 화면으로 이동시킨다.

### Required Sections

- Hero
- Problem
- Core Features
- CTA Button

### Key Copy

- Headline: 합주 일정, 이제 자동으로
- Subheadline: 멤버 일정을 입력하면 공연까지 최적의 합주 날짜를 자동으로 잡아드립니다.
- CTA: 합주 시작하기

## 4. App Page

### Purpose

멤버 관리, 합주 일정 자동 생성, 캘린더 확인, 피드백 및 녹음 업로드를 수행하는 화면이다.

### Tab Structure

앱 페이지는 세 개의 탭으로 구성된다.

| Tab        | Label         | Purpose                        |
|---|---|---|
| Tab 1      | 멤버 / 일정       | 멤버 등록, 불가 날짜 입력, 공연 설정 및 합주 생성 |
| Tab 2      | 캘린더           | 합주 일정 캘린더 뷰, 남은 합주 횟수 표시       |
| Tab 3      | 피드백           | 합주별 멤버 피드백 작성 및 녹음 파일 업로드      |

### Required Areas

- Header (앱 이름 + 당일 합주 알림 배너)
- Tab Navigation
- Tab 1: Member / Schedule
  - MemberForm (이름, 악기 입력)
  - MemberList (멤버별 불가 날짜 입력 포함)
  - PerformanceSetup (공연 날짜, 합주 횟수, 생성 버튼)
- Tab 2: Calendar
  - RehearsalCalendar (월별 캘린더)
  - RehearsalProgress (전체/완료/남은 합주 횟수)
  - RehearsalList (합주 날짜 목록)
  - EmptyState (합주 일정 없을 때)
- Tab 3: Feedback
  - RehearsalSelector (합주 선택 드롭다운)
  - FeedbackForm (멤버별 피드백 입력)
  - RecordingUpload (파일 선택 및 목록)
  - EmptyState (선택된 합주 없을 때)

## 5. Component Plan

| Component              | Purpose                     | Requirement Link        |
|---|---|---|
| AppHeader              | 앱 이름 및 당일 합주 알림 배너 표시       | FR-006                  |
| TabNavigation          | 탭 전환 네비게이션                  | -                       |
| TodayAlert             | 오늘 합주 시간 및 몇 번째 합주인지 표시     | FR-006                  |
| MemberForm             | 멤버 이름과 악기 입력 폼              | FR-001                  |
| MemberList             | 등록된 멤버 목록 + 불가 날짜 입력 UI     | FR-001, FR-002          |
| UnavailableDatePicker  | 날짜 선택 컴포넌트 (불가 날짜용)         | FR-002                  |
| PerformanceSetup       | 공연 날짜, 합주 횟수 입력 + 자동 생성 버튼 | FR-003                  |
| RehearsalCalendar      | 합주 일정 월별 캘린더 뷰              | FR-004                  |
| RehearsalProgress      | 전체/완료/남은 합주 횟수 표시           | FR-005                  |
| RehearsalCard          | 합주 하나의 날짜, 상태, 번호 표시        | FR-004, FR-005          |
| FeedbackForm           | 멤버별 피드백 텍스트 입력              | FR-007                  |
| RecordingUpload        | 녹음 파일 선택 및 업로드 목록           | FR-008                  |
| EmptyState             | 데이터 없음 안내                   | FR-004, FR-007          |

## 6. Interaction Rules

- 멤버 추가 후 이름/악기 입력창은 초기화된다.
- 필수값(이름)이 없으면 추가 버튼을 눌러도 멤버가 추가되지 않는다.
- 합주 자동 생성 시 가능한 날짜가 부족하면 경고 메시지를 표시한다.
- 합주 일정이 생성되면 캘린더에 즉시 반영된다.
- 오늘 합주가 있으면 앱 진입 시 헤더 아래에 알림 배너가 표시된다.
- 피드백 저장 후 입력창은 초기화된다.
- 녹음 파일은 여러 개 업로드 가능하며 파일명 목록으로 표시된다.
- 탭 전환 시 각 탭의 상태는 유지된다.

## 7. Accessibility Rules

- 모든 입력 필드에는 label이 있어야 한다.
- 버튼 텍스트는 기능을 설명해야 한다.
- 색상만으로 합주 상태(scheduled/completed)를 구분하지 않는다.
- 주요 영역은 heading 구조를 가진다.
- 날짜 입력은 키보드로도 접근 가능해야 한다.