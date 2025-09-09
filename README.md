# Healthcare B2B Platform

헬스케어 산업을 위한 B2B 거래 플랫폼

## 🎨 Clinical Teal Theme

- **Primary Color**: Teal (#0EA5A4)
- **Accent Color**: Blue (#2563EB)
- **Background**: #F8FAFC
- **Surface**: #FFFFFF
- **Border**: #E2E8F0

## ✨ 주요 기능

### 🏠 랜딩 페이지
- Hero 섹션 with 역할 전환 (구매자/판매자/관리자)
- 6가지 핵심 기능 소개
- CTA 섹션 with 빠른 가입 폼
- 반응형 Footer

### 📋 응찰 시스템
- **응찰 등록 폼**
  - 제품명, 수량, 단가, 납품일, 결제 조건
  - 파일 업로드 (드래그 앤 드롭 지원)
  - 실시간 폼 유효성 검사

- **필터 패널**
  - 검색 기능 (제품명, 응찰 번호, 회사명)
  - 상태 필터 (진행중/마감/낙찰 등)
  - 날짜 범위 및 가격 범위 필터
  - CSV/XLSX 내보내기

- **가중치 점수화 시스템**
  - 가격 경쟁력, 납기 일정, 품질 인증, 거래 실적
  - 슬라이더로 가중치 조정
  - 실시간 점수 계산 및 애니메이션

- **자동 마감 기능**
  - 마감일 자동 체크
  - 남은 시간 표시
  - 상태 자동 전환

## 🛠 기술 스택

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Animation**: Framer Motion
- **Backend Ready**: Supabase

## 📦 설치 및 실행

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build

# 프로덕션 실행
npm start
```

개발 서버는 [http://localhost:3000](http://localhost:3000)에서 실행됩니다.

## 📁 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx          # 랜딩 페이지
│   └── bidding/
│       └── page.tsx       # 응찰 페이지
├── components/
│   ├── landing/          # 랜딩 페이지 컴포넌트
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── CTA.tsx
│   │   ├── Footer.tsx
│   │   └── RoleSwitcher.tsx
│   ├── bidding/          # 응찰 시스템 컴포넌트
│   │   ├── BiddingForm.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── FileUploadArea.tsx
│   │   └── WeightedScoring.tsx
│   ├── common/           # 공통 컴포넌트
│   │   └── Navigation.tsx
│   └── ui/              # shadcn/ui 컴포넌트
└── lib/
    └── utils.ts         # 유틸리티 함수
```

## 🎯 주요 UI/UX 특징

### 색상 시스템
- **진행중**: Teal subtle (#5EEAD4)
- **마감**: Neutral Gray (#94A3B8)
- **낙찰**: Accent Blue
- **점수별 색상**: 80점 이상(녹색), 60-79점(파란색), 40-59점(노란색), 40점 미만(빨간색)

### 인터랙션
- Focus 시 Primary Teal 테두리
- Hover 시 색상 변화
- 점수 변경 시 pulse 애니메이션
- 부드러운 페이드/슬라이드 전환

### 반응형 디자인
- 모바일 친화적 레이아웃
- 테이블 가로 스크롤
- 햄버거 메뉴 (모바일)

## 🚀 향후 개발 계획

- [ ] Supabase 연동 (인증, 데이터베이스)
- [ ] 실시간 알림 시스템
- [ ] 대시보드 페이지
- [ ] 메시징 시스템
- [ ] 결제 시스템 연동
- [ ] 다국어 지원

## 📄 라이선스

MIT License

## 👨‍💻 개발자

Healthcare B2B Platform Team

---

Built with ❤️ using Next.js and Tailwind CSS
