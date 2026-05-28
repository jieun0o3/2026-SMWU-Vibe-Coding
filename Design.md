# Design Guide

## Design Goal

밴드 멤버가 부담 없이 쓸 수 있는, 차분하고 세련된 합주 관리 웹 앱.
Repov의 클린한 카드 기반 레이아웃과 친근한 UX를 참고한다.

---

## Color Palette

| 역할 | Tailwind 토큰 | 설명 |
|------|-------------|------|
| Primary | `purple-600` / `purple-700` | 메인 버튼, 강조 텍스트, 배지 |
| Primary Light | `purple-50` / `purple-100` | 카드 배경, 호버 |
| Primary Border | `purple-200` | 카드·입력 테두리 |
| Accent | `violet-500` | 캘린더 합주 dot, 보조 강조 |
| Surface | `white` | 카드, 입력 필드 배경 |
| Background | `gray-50` | 페이지 전체 배경 |
| Text Primary | `gray-900` | 제목, 본문 |
| Text Secondary | `gray-500` | 설명, 레이블, 날짜 |
| Danger | `red-500` | 삭제 버튼, 오류 메시지 |
| Warning | `amber-500` | 경고 배너 |
| Success | `green-600` | 완료 메시지 |

---

## Typography

- **Font**: 시스템 기본 (Inter / Apple SD Gothic Neo / Malgun Gothic 자동 폴백)
- **Page Title**: `text-2xl font-bold text-gray-900`
- **Section Title**: `text-base font-semibold text-gray-800`
- **Body**: `text-sm text-gray-700`
- **Caption / Meta**: `text-xs text-gray-500`

---

## Layout

- 최대 너비: `max-w-2xl` (중앙 정렬)
- 페이지 패딩: `px-4 py-8` (모바일), `px-6 py-10` (데스크탑)
- 섹션 간격: `space-y-6`
- 카드 간격: `space-y-3`

---

## Components

### Card
```
bg-white rounded-2xl border border-gray-100 shadow-sm p-5
```
- 호버 시: `hover:border-purple-300 hover:shadow-md transition`
- 내부 섹션 구분: `border-t border-gray-100 pt-4 mt-4`

### Button — Primary
```
bg-purple-600 hover:bg-purple-700 text-white font-medium
rounded-xl px-5 py-2.5 text-sm transition
```

### Button — Secondary / Outline
```
border border-purple-300 text-purple-700 hover:bg-purple-50
rounded-xl px-4 py-2 text-sm transition
```

### Button — Danger
```
text-red-500 hover:text-red-700 text-xs transition
```

### Badge / Tag
```
bg-purple-100 text-purple-700 text-xs font-medium
px-2.5 py-0.5 rounded-full
```

### Input / Select
```
border border-gray-200 rounded-xl px-3 py-2 text-sm w-full
focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent
```

### Alert — Warning
```
bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 text-sm
```

### Alert — Success
```
bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 text-sm
```

---

## Header

- 배경: `bg-white border-b border-gray-100 sticky top-0 z-10`
- 로고: `font-bold text-purple-700`
- D-day 배너: `bg-purple-600 text-white text-center text-xs py-1.5`

---

## Calendar Grid

- 오늘: `bg-purple-50 border-purple-400 text-purple-700 font-bold`
- 합주 있는 날: `bg-violet-50 border-violet-300`
- 합주 dot: `bg-purple-600 text-white text-[10px] rounded-lg px-1`
- 일반 날: `bg-white border-gray-100 text-gray-700`

---

## UX Rules

1. **명확한 버튼 텍스트** — 아이콘 단독 사용 금지. 텍스트 포함 필수.
2. **레이블 필수** — 모든 입력 필드에 `<label>` 제공.
3. **시맨틱 헤딩** — 페이지 제목은 `<h1>`, 섹션은 `<h2>`.
4. **에러 메시지 인라인** — 모달 없이 입력 필드 아래 텍스트로 표시.
5. **로딩 피드백** — 서버 요청 중 버튼 비활성화 또는 텍스트 변경.
6. **빈 상태(Empty State)** — 데이터 없을 때 안내 문구 + 행동 유도 링크.
7. **카드 클릭 영역** — 카드 전체가 클릭 가능한 링크일 때 `hover:shadow-md` 피드백.
8. **임의 디자인 변경 금지** — 이 문서의 컴포넌트 스펙 외 스타일 추가 금지.
