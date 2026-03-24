<div align="center">
  
# 🚽 PEECE MAKER (피스메이커)
**"THE GUARDIAN OF YOUR PRESTIGE"**<br/>
*당신이 평생 지켜온 사회적 지위를 수호할 위대한 작전*

[![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

**PEECE MAKER**는 아름다운 제주도를 여행하는 여행객들의 예기치 못한 생리적 위협으로부터 사회적 지위를 지켜주기 위해 탄생한 **제주도 공중화장실 위치 탐색 및 커뮤니티 플랫폼**입니다. 제주도 내 공중화장실의 접근성과 안전성을 높이고, 이용자들이 최신 상태를 공유하는 활발한 커뮤니티를 조성하는 것을 목표로 합니다.

[🎬 시연 영상 보기 (Google Drive)](https://drive.google.com/file/d/13tFW-Ujd-TiHFeiQlXoA7XbLkdLOUBF5/view?usp=drive_link)
</div>

<br/>

## 🛠 기술 스택 (Tech Stack)

### 🎨 Frontend
<img src="https://img.shields.io/badge/Next.js_16-000000?style=flat-square&logo=next.js&logoColor=white"/> <img src="https://img.shields.io/badge/React_19-20232A?style=flat-square&logo=react&logoColor=61DAFB"/> <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white"/>
<img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=flat-square&logo=framer&logoColor=white"/> <img src="https://img.shields.io/badge/Recharts-34A853?style=flat-square&logo=react&logoColor=white"/>

### 🗄️ Database (BaaS)
<img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white"/> <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white"/>

### 🔐 Authentication & API
<img src="https://img.shields.io/badge/Kakao_Map_API-FFCD00?style=flat-square&logo=kakaotalk&logoColor=black"/> <img src="https://img.shields.io/badge/Google_OAuth-4285F4?style=flat-square&logo=google&logoColor=white"/> <img src="https://img.shields.io/badge/GitHub_OAuth-181717?style=flat-square&logo=github&logoColor=white"/>

<br/>

## ☁️ 아키텍처 (Serverless Architecture)

본 서비스는 물리적인 서버 인프라를 직접 운용하지 않는 **Serverless + BaaS(Backend as a Service)** 아키텍처로 구성되어 있습니다.

- **Vercel (Serverless Edge)**: `Next.js` 애플리케이션의 호스팅을 담당하며, 사용자 요청 시에만 실행되는 서버리스 함수(Serverless Functions)를 통해 인터랙티브 UI와 API 라우트를 처리합니다.
- **Supabase (BaaS)**: 백엔드 인프라 역할을 수행하며, `PostgreSQL` 기반의 클라우드 데이터베이스 스토리지, 사용자 인증(OAuth), 그리고 Row Level Security(RLS)를 통한 데이터 보안 및 접근 제어를 관리합니다.

<br/>

## ✨ 핵심 기능 (The Key Functions)

### 1. 🛫 랜딩 페이지 (Landing Page)
- **몰입감 있는 인트로**: 아름다운 제주 풍경 영상과 `Framer Motion`을 활용한 부드러운 텍스트 애니메이션이 적용되어 사용자의 이목을 끕니다.
- **서비스 직관성**: 서비스의 주요 기능(Map, Chart, Board)과 신뢰할 수 있는 데이터 출처(제주시 공공데이터)를 명확히 안내합니다.

### 2. 🗺️ 화장실 지도 (Toilet Map)
- **위치 기반 실시간 탐색**: `Kakao Map API`를 연동하여 사용자의 현재 위치를 기반으로 주변 화장실 마커를 즉시 렌더링합니다.
- **스마트 필터링 시스템**:
  - `안심 시설`: 비상벨, CCTV 여부
  - `편의 시설`: 장애인 전용칸, 기저귀 교환대 보유 여부
  - `성별 구분`: 남/여 화장실 칸 수 세부 정보
- **상세 정보 및 리뷰 팝업**: 마커 클릭 시 화장실 상세 정보와 실사용자들의 생생한 리뷰/별점을 확인할 수 있는 인터랙티브 팝업 제공.

### 3. 📊 통계 대시보드 (Statistics Dashboard)
- **데이터 시각화**: `Recharts` 라이브러리를 통해 방대한 데이타를 한눈에 들어오는 차트로 제공.
  - **지역별 분포 (BarChart)**: 제주시 내 읍/면/동 단위 화장실 개수 시각화.
  - **수용력 분석 (PieChart)**: 전체 대비 성별/시설별 비율 분포 확인.
- **실시간 데이터 바인딩**: 전체/안심/장애인/유아 필터 클릭 시 즉시 차트가 애니메이션과 함께 업데이트됩니다.
- **테마 최적화**: 사용자의 시스템 설정에 맞춘 다크/라이트 모드 UI 자동 전환을 지원합니다.

### 4. 💬 커뮤니티 게시판 (Community Board)
- **유기적인 정보 공유**: 제주 화장실 이용 경험, 꿀팁, 경고(고장, 청결 불량 등)를 실시간으로 공유하는 채널.
- **안전한 풀 CRUD**: Supabase RLS(Row Level Security) 정책이 적용된 게시글/댓글 작성, 조회, 수정 및 삭제 기능.
- **OAuth2 소셜 로그인**: 구글 및 깃허브 계정을 활용한 원클릭 로그인 시스템(`Supabase Auth`) 구현.

<br/>

## 📁 주요 데이터 출처 (Data Source)

**제주특별자치도 제주시_공중화장실 (공공데이터포털)**
* **제공 기관**: 제주특별자치도 제주시
* **데이터 내용**: 위경도 좌표, 비상벨·CCTV 설치 유무, 개방 시간, 편의시설 세부 현황 등
* 🔗 [공공데이터 원본 확인하기](https://www.data.go.kr/data/15110521/fileData.do)

<br/>

## 🚀 로컬 환경 실행 가이드 (Getting Started)

### 사전 요구사항 (Prerequisites)
* **Node.js**: v20 이상 권장
* **패키지 매니저**: npm, yarn, pnpm 중 택 1

### 1. 저장소 클론 및 패키지 설치
```bash
git clone https://github.com/nx2803/PeeceMaker.git
cd PeeceMaker
npm install
```

### 2. 환경 변수 설정
프로젝트 최상단 루트 디렉토리에 `.env.local` 파일을 생성하고 아래의 키값들을 입력합니다.
```env
# Supabase 계정 설정 (필수)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Kakao Map API 키 (필수)
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_map_api_key
```

### 3. 개발 서버 실행
```bash
npm run dev
```
브라우저에서 `http://localhost:3000`에 접속하여 서비스를 이용하실 수 있습니다!

<br/>

## 🏗 프로젝트 폴더 구조 (Directory Structure)
```text
PeeceMaker/
 ┣ public/               # 정적 파일 (제주 영상, 이미지, 글로벌 폰트 등)
 ┣ src/
 ┃ ┣ app/                # Next.js 16 App Router 기반 메인 로직
 ┃ ┃ ┣ auth/             # Supabase Auth 콜백 및 에러 핸들링
 ┃ ┃ ┣ login/            # 소셜 및 이메일 로그인 페이지
 ┃ ┃ ┣ main/             # 서비스 핵심 페이지 모음 (Map, Chart, Board)
 ┃ ┃ ┣ signin/           # 회원가입 전용 페이지
 ┃ ┃ ┣ globals.css       # Tailwind 4.0 전역 스타일 및 유틸리티
 ┃ ┃ ┗ page.tsx          # 애플리케이션 진입 랜딩 뷰 (Intro)
 ┃ ┣ utils/              # 유틸리티 함수 및 설정 파일
 ┃ ┃ ┗ supabase/         # Supabase 클라이언트 및 미들웨어 통합 설정
 ┃ ┗ proxy.ts            # Next.js 16 라우팅/세션 검사 프록시 (Middleware 대체)
 ┗ tailwind.config.ts    # 테일윈드 환경 설정
```

<br/>


