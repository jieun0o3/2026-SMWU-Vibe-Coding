# Requirements Spec

## 1. Actors

| Actor | Description |
|---|---|
| Primary User (멤버) | 개인 불가 일정을 입력하고 합주 현황 및 피드백을 확인하는 밴드 멤버 |
| Band Leader | 공연 날짜와 합주 횟수를 설정하여 합주 일정을 생성하는 대표 사용자 (MVP에서는 단일 사용자로 처리) |

## 2. Main Use Cases

### UC-001. 멤버 및 개인 불가 일정 등록

- Actor: Primary User
- Goal: 밴드 멤버를 등록하고 해당 멤버의 불가 날짜를 입력한다
- Precondition: 앱이 열려 있다
- Main Flow:
  1. 사용자가 멤버 이름과 악기를 입력하고 추가 버튼을 누른다
  2. 멤버가 목록에 추가된다
  3. 사용자가 멤버를 선택하고 불가 날짜를 하나씩 입력한다
  4. 불가 날짜가 해당 멤버에 저장된다
- Alternative Flow: 이름이 비어 있으면 추가되지 않고 오류 메시지가 표시된다
- Result: 멤버 목록과 멤버별 불가 일정이 저장된다

### UC-002. 합주 일정 자동 생성

- Actor: Band Leader (Primary User)
- Goal: 공연 날짜와 원하는 합주 횟수를 입력하면 모든 멤버가 가능한 날짜에 합주 일정이 자동 생성된다
- Precondition: 멤버가 1명 이상 등록되어 있다
- Main Flow:
  1. 사용자가 공연 날짜를 입력한다
  2. 사용자가 원하는 합주 횟수를 입력한다
  3. 시스템이 오늘부터 공연 전날까지의 날짜 중 모든 멤버가 가능한 날짜를 계산한다
  4. 공연까지 기간을 균등하게 나누어 N번의 합주 날짜를 선택한다
  5. 생성된 합주 일정이 화면에 표시된다
- Alternative Flow: 가능한 날짜가 원하는 합주 횟수보다 부족하면 경고 메시지를 표시한다
- Result: 합주 일정 목록이 저장되고 캘린더에 반영된다

### UC-003. 합주 캘린더 확인

- Actor: Primary User
- Goal: 합주 일정을 캘린더 형태로 보고 남은 합주 횟수를 확인한다
- Precondition: 합주 일정이 1개 이상 생성되어 있다
- Main Flow:
  1. 사용자가 캘린더 탭을 열면 합주 날짜가 표시된다
  2. 남은 합주 횟수와 전체 합주 횟수가 표시된다
  3. 오늘 합주가 있으면 시간과 함께 알림이 헤더에 표시된다
- Result: 사용자가 공연 준비 현황을 한눈에 파악한다

### UC-004. 합주 피드백 작성 및 녹음 업로드

- Actor: Primary User
- Goal: 합주가 끝난 뒤 멤버별 피드백을 작성하고 녹음 파일을 업로드한다
- Precondition: 해당 합주 일정이 존재한다
- Main Flow:
  1. 사용자가 피드백 탭에서 합주를 선택한다
  2. 멤버별 피드백 텍스트를 입력하고 저장한다
  3. 녹음 파일을 선택하여 업로드한다 (여러 개 가능)
  4. 피드백과 녹음 목록이 해당 합주에 저장된다
- Result: 합주별 피드백과 녹음 파일이 저장된다

## 3. Functional Requirements

| ID | Requirement | Priority |
|---|---|---|
| FR-001 | 사용자는 밴드 멤버(이름, 악기)를 등록할 수 있다. | Must |
| FR-002 | 사용자는 멤버별 불가 날짜를 입력할 수 있다. | Must |
| FR-003 | 사용자는 공연 날짜와 합주 횟수를 입력하면 자동으로 합주 일정을 생성할 수 있다. | Must |
| FR-004 | 사용자는 합주 일정을 캘린더 형태로 확인할 수 있다. | Must |
| FR-005 | 사용자는 전체/완료/남은 합주 횟수를 확인할 수 있다. | Must |
| FR-006 | 당일 합주가 있으면 합주 시간과 몇 번째 합주인지 화면에 표시된다. | Must |
| FR-007 | 사용자는 합주별로 멤버 피드백을 작성할 수 있다. | Should |
| FR-008 | 사용자는 합주별로 녹음 파일을 업로드할 수 있다 (여러 개). | Should |
| FR-009 | 사용자는 등록된 멤버나 불가 날짜를 삭제할 수 있다. | Nice |
| FR-010 | 사용자는 자동 생성된 합주 날짜를 수동으로 수정할 수 있다. | Nice |

## 4. Non-functional Requirements

| ID | Requirement |
|---|---|
| NFR-001 | 모바일 화면에서도 핵심 기능을 사용할 수 있어야 한다. |
| NFR-002 | 버튼과 입력 필드는 접근 가능한 이름을 가져야 한다. |
| NFR-003 | 민감한 정보는 GitHub 저장소에 커밋하지 않는다. |
| NFR-004 | 기본 MVP는 단일 사용자 기준으로 구현한다. |

## 5. Acceptance Criteria

### AC-001. 멤버 등록

Given 사용자가 멤버 이름을 입력했을 때
When 추가 버튼을 누르면
Then 새 멤버가 목록에 표시된다.

### AC-002. 불가 날짜 등록

Given 멤버가 등록되어 있고 불가 날짜를 선택했을 때
When 저장 버튼을 누르면
Then 해당 멤버의 불가 날짜가 저장된다.

### AC-003. 합주 자동 생성

Given 멤버들의 불가 일정이 입력되어 있고 공연 날짜와 합주 횟수를 입력했을 때
When 합주 일정 생성 버튼을 누르면
Then 모든 멤버가 가능한 날짜에 N개의 합주 일정이 생성된다.

### AC-004. 캘린더 확인

Given 합주 일정이 생성되어 있을 때
When 사용자가 캘린더 탭을 열면
Then 합주 날짜가 캘린더에 표시되고 남은 횟수가 표시된다.

### AC-005. 당일 합주 알림

Given 오늘 합주 일정이 있을 때
When 사용자가 앱을 열면
Then 오늘 합주 시간과 몇 번째 합주인지가 상단에 표시된다.

### AC-006. 피드백 작성

Given 합주 일정이 존재할 때
When 사용자가 피드백을 입력하고 저장하면
Then 해당 합주에 멤버별 피드백이 저장된다.

## 6. Requirement Traceability Lite

| Requirement ID | Use Case | Acceptance Criteria | Test Candidate |
|---|---|---|---|
| FR-001 | UC-001 | AC-001 | E2E add member |
| FR-002 | UC-001 | AC-002 | E2E add unavailable date |
| FR-003 | UC-002 | AC-003 | E2E auto-schedule |
| FR-004 | UC-003 | AC-004 | E2E calendar view |
| FR-005 | UC-003 | AC-004 | E2E remaining count |
| FR-006 | UC-003 | AC-005 | E2E today alert |
| FR-007 | UC-004 | AC-006 | E2E feedback write |
| FR-008 | UC-004 | - | E2E recording upload |