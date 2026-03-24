# 🚽 PEECE MAKER (피스메이커)
> "THE GUARDIAN OF YOUR PRESTIGE" - 당신이 평생 지켜온 사회적 지위를 수호할 위대한 작전

**PEECE MAKER**는 아름다운 제주도를 여행하는 여행객들의 예기치 못한 생리적 위협으로부터 사회적 지위를 지켜주기 위해 탄생한 **제주도 공중화장실 위치 탐색 및 커뮤니티 플랫폼**입니다. 제주도 내 공중화장실의 접근성과 안전성을 높이고, 이용자들이 상태를 공유하는 커뮤니티를 조성하는 것을 목표로 합니다.

<br/>

## 🎬 데모(시연 동영상)
**[시연 영상 바로가기 (Google Drive)](https://drive.google.com/file/d/13tFW-Ujd-TiHFeiQlXoA7XbLkdLOUBF5/view?usp=drive_link)**

<br/>

## 🛠 기술 스택 (Tech Stack)

### Frontend (Front-end Developer)
![Next JS](https://img.shields.io/badge/Next.js-16.0.0-black?style=flat-square&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/react-19.0-%2320232a.svg?style=flat-square&logo=react&logoColor=%2361DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-%2338B2AC.svg?style=flat-square&logo=tailwind-css&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-white?style=flat-square&logo=framer&logoColor=black)
![Kakao Maps](https://img.shields.io/badge/Kakao_Map_API-FFCD00?style=flat-square&logo=kakaotalk&logoColor=black)
![Recharts](https://img.shields.io/badge/Recharts-34A853?style=flat-square&logo=react&logoColor=white)
![Jotai / Context API](https://img.shields.io/badge/State_Management-000000?style=flat-square&logo=react&logoColor=white)

### Backend (Back-end Developer) & Database
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.8-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=flat-square&logo=postgresql&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![OAuth2](https://img.shields.io/badge/OAuth2_Google_&_Naver-EA4335?style=flat-square&logo=google&logoColor=white)

<br/>

## ✨ 핵심 기능 (The Key Functions)

### 1. 🛫 랜딩 페이지 (Landing Page)
- **몰입감 있는 인트로**: 제주 풍경 영상(`public/jeju.mp4`)과 Framer Motion을 활용한 텍스트 애니메이션 적용.
- **서비스 소개**: Map, Chart, Board 등 주요 기능과 데이터 출처(제주시 공공데이터)를 직관적으로 안내.

### 2. 🗺️ 화장실 지도 (Toilet Map)
- **위치 기반 서비스**: Kakao Map API 연동으로 현재 위치 기반 주변 화장실 마커 조회 기능.
- **클러스터링**: 마커가 밀집된 지역에서도 가독성을 유지하여 화면 복잡도 완화.
- **상세 필터링 시스템**:
  - `안심 시설`: 비상벨, CCTV 여부
  - `편의 시설`: 장애인용, 유아 동반(기저귀 교환대) 가능 여부
  - `성별 구분`: 남/여 화장실 칸 수 등 정보 제공
- **상세 팝업**: 화장실 마커 선택 시 사진, 세부 정보 및 사용자들의 별점 리뷰 표시 및 작성 시스템.

### 3. 📊 통계 대시보드 (Statistics Dashboard)
- **데이터 시각화**: Recharts 기반 통계 차트 제공.
  - 지역별 분포 (BarChart): 읍/면/동 단위 화장실 개수를 한눈에 확인.
  - 수용력 분석 (PieChart): 성별·시설별 비율을 직관적으로 확인.
- **실시간 필터링**: 전체, 안심, 장애인, 유아 등 필터 버튼 클릭 시 즉시 차트 통계 데이터 반영.
- **다크/라이트 모드 지원**: 시스템 테마에 맞춰 차트 색상 및 뷰 모드 최적화.
- **랭킹 시스템**: 유저 리뷰 평점을 기반으로 Best/Worst Top 5 화장실 랭킹.

### 4. 💬 커뮤니티 게시판 (Community Board)
- **정보 공유**: 제주 화장실 이용 경험, 후기, 이슈 등 생생한 상태(Context) 공유 채널.
- **풀 CRUD 지원**: 게시글과 댓글 작성, 조회, 수정 및 삭제 기능.
- **탐색 편의성**: 제목, 내용, 작성자 기반 검색과 부드러운 페이지네이션 지원.

<br/>

## 📁 주요 데이터 출처 (Data Source)
**제주특별자치도 제주시_공중화장실 (공공데이터포털)**
- 제공 기관: 제주특별자치도 제주시
- 데이터 규격: 위경도 좌표, 비상벨·CCTV 설치 여부, 개방 시간 등 상세 시설 데이터 포함
- [공공데이터 확인하기](https://www.data.go.kr/data/15110521/fileData.do)

<br/>

## 🚀 시작하기 (Getting Started)

### 사전 요구사항
이 프로젝트는 **Node.js (v20 이상)** 환경을 권장합니다.

### 1. 저장소 클론
```bash
git clone <repository_url>
cd webfront
```

### 2. 패키지 설치
```bash
npm install
# or yarn, pnpm, bun 등 원하는 패키지 매니저 사용
```

### 3. 환경 변수 설정 (.env.local)
프로젝트 루트에 `.env.local` 파일을 생성하여 아래 값을 필수로 입력해주세요:
```env
# 백엔드 서버 URL
NEXT_PUBLIC_BACKEND_URL=http://localhost:8080/

# 카카오 지도 SDK API KEY
NEXT_PUBLIC_KAKAO_MAP_KEY=your_kakao_map_api_key_here

# Supabase Auth Configuration (필요 시)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. 개발 서버 실행
```bash
npm run dev
```
터미널 서버 실행 후, 브라우저에서 `http://localhost:3000`에 접속하여 애플리케이션을 확인할 수 있습니다.

<br/>

## 🏗 폴더 구조 (Project Structure)
```text
webfront/
 ┣ public/               # 이미지(jeju.mp4 등), 비디오, 글로벌 폰트 등 정적 파일
 ┣ src/
 ┃ ┣ app/                # App Router 구조
 ┃ ┃ ┣ main/             # 핵심 기능 페이지
 ┃ ┃ ┃ ┣ chartView.tsx   # 통계 및 차트
 ┃ ┃ ┃ ┣ mapView.tsx     # 지도 및 마커 로직
 ┃ ┃ ┃ ┣ boardView.tsx   # 게시판 기능
 ┃ ┃ ┃ ┗ page.tsx        # 메인 레이아웃 통합
 ┃ ┃ ┣ page.tsx          # 랜딩 페이지 (Intro)
 ┃ ┃ ┗ globals.css       # 전역 스타일 및 Tailwind 세팅
 ┃ ┣ components/         # 전역 재사용 UI 컴포넌트
 ┃ ┗ assets/             # 로컬 에셋 자산 및 더미 데이터
```

<br/>

## 📜 라이선스 (License)
This project is for educational and portfolio purposes.

---
**© 2026 KDT-03 PEECE MAKER. ALL RIGHTS RESERVED.**
