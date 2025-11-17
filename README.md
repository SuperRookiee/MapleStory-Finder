# MapleStory Finder

<p align="center">
  <img src="./public/images/reheln/Reheln.png" width="144" alt="Finder logo" />
</p>

<p align="center">
  Next.js 15과 React 19로 구현된 MapleStory 캐릭터 탐색 대시보드입니다.
</p>
<p align="center">
  원하는 캐릭터를 검색하고 즐겨찾기로 관리하며, 스탯과 장비를 한눈에 살펴보세요.
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=fff" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=fff" alt="Tailwind" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ECF8E?logo=supabase&logoColor=000" alt="Supabase" /></a>
</p>

<img width="1880" height="1040" alt="image" src="https://github.com/user-attachments/assets/492cdc58-984d-4f90-9929-a89e8d632363" />

---

## 📌 Quick Links
- [프로젝트 개요](#-overview)
- [핵심 기능](#-key-features)
- [기술 스택](#-tech-stack)
- [빠르게 시작하기](#-getting-started)
- [환경 변수 설정](#-environment-variables)
- [가용 스크립트](#-available-scripts)

---

## 🧭 Overview
MapleStory Finder는 Nexon Open API를 통해 전 세계 MapleStory 캐릭터 데이터를 빠르게 조회하고, 즐겨찾기와 시각화 기능으로 원하는 정보를 한 번에 확인할 수 있는 웹 애플리케이션입니다. 대시보드 전반에 최신 Next.js 15 App Router와 React 19 기능을 적용하여 성능과 사용자 경험을 모두 잡았습니다.

## ✨ Key Features
- **실시간 검색**: 캐릭터 이름 또는 OCID를 입력하면 즉시 결과를 확인할 수 있습니다.
- **즐겨찾기 보관함**: 관심 있는 캐릭터를 저장하고 대시보드에서 빠르게 다시 불러옵니다.
- **스탯 인사이트**: 장비, 능력치, 성장 기록 등을 그래프로 시각화하여 비교 분석이 쉬워집니다.
- **안전한 인증**: Supabase Auth를 통해 로그인과 즐겨찾기 데이터를 안전하게 관리합니다.
- **반응형 & 다크 모드**: Tailwind CSS 4와 Radix UI를 기반으로 모바일부터 데스크톱까지 일관된 UI를 제공합니다.

## 🧰 Tech Stack
| 레이어 | 사용 기술                                   |
| --- |-----------------------------------------|
| 앱 프레임워크 | Next.js 15 (App Router), React 19       |
| 언어 | TypeScript                              |
| UI & 스타일 | Tailwind, Radix UI, shadcn/ui           |
| 데이터 & 인증 | Vercel, Supabase, Nexon Open API        |
| 상태 & 유틸 | Zustand, Recharts, React Window, pLimit |

## ⚙️ Getting Started
다음 순서로 개발 환경을 구성하세요.

### 1. Prerequisites
- Node.js 24
- npm (Node.js 설치 시 기본 포함)

### 2. Installation
```bash
# 저장소 클론
git clone https://github.com/SuperRookiee/MapleStory-Finder.git
cd MapleStory-Finder

# 의존성 설치
npm install
```

### 3. Local Development
```bash
# 개발 서버 실행 (http://localhost:3000)
npm run dev
```

브라우저에서 `http://localhost:3000`을 열어 앱을 확인하세요.

## 🔐 Environment Variables
프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 채워주세요.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_NEXON_API_KEY=your_nexon_open_api_key

# Google Gemini figure generation
GOOGLE_API_KEY=your_gemini_api_key
# 또는 다음 키를 사용할 수도 있습니다.
# GEMINI_API_KEY=your_gemini_api_key

# (선택) 기본 이미지 생성 모델
# GEMINI_FIGURE_MODEL=gemini-2.5-flash-image-preview

# (선택) 이미지 생성 프롬프트 커스텀
# GEMINI_DEFAULT_PROMPT=Create a MapleStory figure photo...
```

> [!TIP]
> Nexon Open API 키는 [공식 개발자 포털](https://openapi.nexon.com/)에서 발급받을 수 있습니다.


## 💾 DB
| 테이블명          | 역할(저장 데이터)                                | 초기화 / 정리 주기                          | 실행 시각(KST) |
|-------------------|---------------------------------------------|----------------------------------------|---------------|
| **todo_boss**     | 주간/월간 보스 체크리스트 상태 (`weekly_boss`, `monthly_boss`) | 보존 기간 6개월 초과 시 삭제 (cleanup 함수)   | 매일 00:00    |
| **todo_schedule** | 메모(`memo`), 캘린더(`calendar`) 데이터             | 보존 기간 6개월 초과 시 삭제 (cleanup 함수)   | 매일 00:00    |
| **todo_symbol**   | 아케인/그란디스 심볼 퀘스트 체크리스트             | ① 지난 주차 데이터 삭제 (cleanup 함수)<br>② 모든 데이터 초기화 후 새 주기 생성 (reset 함수) | 매일 00:00    |
| **공통 트리거**   | `update_updated_at_column` (수정 시 `updated_at` 자동 갱신) | 항상 동작                                   | -             |



## 🧾 Available Scripts
| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | Turbopack 기반 개발 서버 실행 |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run start` | 빌드된 앱을 프로덕션 모드로 실행 |
| `npm run lint` | ESLint 검사 및 자동 수정 |

## 🙏 Acknowledgements
- Nexon Open API를 사용하고 있습니다.
- MapleStory 및 MapleStory 로고는 Nexon의 등록 상표입니다.
