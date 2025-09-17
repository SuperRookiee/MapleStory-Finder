# MapleStory Finder

<p align="center">
  <img src="./public/Reheln.png" width="140" alt="Finder logo" />
</p>

<p align="center">
  MapleStory 캐릭터를 빠르게 탐색하고 즐겨찾기로 관리할 수 있는 Next.js 기반 대시보드입니다.
</p>

<p align="center">
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=fff" alt="Next.js" /></a>
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff" alt="TypeScript" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwindcss&logoColor=fff" alt="Tailwind" /></a>
  <a href="https://supabase.com/"><img src="https://img.shields.io/badge/Supabase-3ecf8e?logo=supabase&logoColor=000" alt="Supabase" /></a>
</p>

---

## Table of Contents
- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Available Scripts](#available-scripts)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

## Overview
MapleStory Finder는 Nexon Open API를 활용해 게임 내 캐릭터 정보를 검색하고, 즐겨찾기 및 상세 스탯을 한 화면에서 확인할 수 있는 웹 애플리케이션입니다. 최신 Next.js 15와 React 19를 사용해 빠른 응답성과 부드러운 사용자 경험을 제공합니다.

## Key Features
- 🔍 **캐릭터 검색**: 이름 또는 OCID로 MapleStory 캐릭터를 즉시 찾을 수 있습니다.
- ⭐ **즐겨찾기 보관함**: 자주 확인하는 캐릭터를 저장하고 한 번에 접근합니다.
- 📊 **상세 스탯 시각화**: 장비, 능력치 등 다양한 정보를 그래프로 확인합니다.
- 🔒 **안전한 인증**: Supabase 인증을 통해 즐겨찾기 데이터를 안전하게 보관합니다.
- 🌙 **다크 모드 최적화**: Tailwind CSS 4 기반의 반응형 UI로 어디서나 편안하게 탐색합니다.

## Tech Stack
| 카테고리 | 사용 기술 |
| --- | --- |
| 프레임워크 | Next.js 15, React 19 |
| 언어 | TypeScript |
| 스타일링 | Tailwind CSS 4, Radix UI |
| 데이터 & 인증 | Supabase |
| 상태 관리 & 유틸 | Zustand, Recharts, React Window 등 |

## Getting Started
빠르게 개발 환경을 구성하는 방법을 안내합니다.

### Prerequisites
- Node.js 22 이상
- npm (Node.js 설치 시 기본 포함)

### Installation
```bash
# 저장소 클론
git clone <repo-url>
cd MapleStory-Finder

# 의존성 설치
npm install
```

### Environment Variables
프로젝트 루트에 `.env` 파일을 생성하고 아래 값을 입력하세요.

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_NEXON_API_KEY=your_nexon_open_api_key
# Google Gemini figure generation
GOOGLE_API_KEY=your_gemini_api_key
# (optional) 대신 GEMINI_API_KEY를 사용해도 됩니다.
# GEMINI_API_KEY=your_gemini_api_key
# (optional) 기본으로 사용할 이미지 생성 모델을 지정하고 싶다면
# GEMINI_FIGURE_MODEL=gemini-2.5-flash-image-preview
# (optional) 커스텀 프롬프트를 지정하고 싶다면
# GEMINI_DEFAULT_PROMPT=Create a MapleStory figure photo...
```

> [!TIP]
> Nexon Open API 키는 [공식 개발자 포털](https://openapi.nexon.com/)에서 발급받을 수 있습니다.

### Available Scripts
개발 및 배포를 위한 npm 스크립트입니다.

| 명령어 | 설명 |
| --- | --- |
| `npm run dev` | Turbopack을 활용한 개발 서버 실행 (기본 포트: <http://localhost:3000>) |
| `npm run build` | 프로덕션 빌드 생성 |
| `npm run start` | 빌드된 앱을 프로덕션 모드로 실행 |
| `npm run lint` | ESLint 검사 및 자동 수정 수행 |

## Contributing
기여를 환영합니다! 이슈 등록 또는 Pull Request를 통해 개선 사항을 공유해주세요.

1. 작업용 브랜치를 생성합니다.
2. 코드 및 문서 수정을 진행합니다.
3. 테스트와 린트를 실행하고 결과를 확인합니다.
4. Pull Request를 열어 변경 사항을 설명해주세요.

## Acknowledgements
- Nexon Open API를 제공해 주는 Nexon에 감사드립니다.
- MapleStory 및 MapleStory 로고는 Nexon의 등록 상표입니다.

---

*본 프로젝트는 Nexon Open API를 사용하고 있습니다.*
