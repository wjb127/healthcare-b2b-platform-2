# 헬스케어 B2B 플랫폼 구현 계획서

## 📋 프로젝트 개요
TODO.md 요구사항 기반 Supabase 백엔드 구현 및 비로그인 데모 기능 구축

## 🎯 구현 목표
1. **데모 우선**: 로그인 없이 즉시 체험 가능한 데모 모드
2. **실제 데이터 연동**: Supabase DB와 연동된 실제 CRUD 기능
3. **역할 기반 UI**: 요청자(Buyer)와 공급자(Supplier) 역할별 다른 화면

---

## 📊 Phase 1: 데이터베이스 설계 (Supabase)

### 핵심 테이블 구조

```sql
-- 1. users (사용자 - 데모 모드에서는 임시 세션 사용)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT,
  company_name TEXT,
  contact_name TEXT,
  role TEXT CHECK (role IN ('buyer', 'supplier', 'both')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 2. projects (비딩 요청 프로젝트)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  category TEXT, -- 의료기기, 의약품, 서비스 등
  region TEXT,
  budget_range TEXT,
  deadline DATE,
  requirements TEXT,
  status TEXT DEFAULT 'open', -- open, closed, awarded
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. project_files (요청서 첨부파일)
CREATE TABLE project_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  file_name TEXT,
  file_url TEXT,
  file_size INTEGER,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- 4. bids (응찰)
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  supplier_id UUID REFERENCES users(id),
  price DECIMAL,
  delivery_days INTEGER,
  comment TEXT,
  status TEXT DEFAULT 'submitted', -- submitted, accepted, rejected
  score INTEGER, -- 가중치 점수
  created_at TIMESTAMP DEFAULT NOW()
);

-- 5. bid_files (응찰 첨부파일)
CREATE TABLE bid_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bid_id UUID REFERENCES bids(id),
  file_name TEXT,
  file_url TEXT,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- 6. notifications (알림)
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT, -- new_project, new_bid, bid_accepted
  title TEXT,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🚀 Phase 2: 비로그인 데모 모드 구현

### 2.1 데모 세션 관리
```typescript
// lib/demo-session.ts
export class DemoSession {
  static createDemoUser(role: 'buyer' | 'supplier') {
    // localStorage에 임시 세션 저장
    const demoUser = {
      id: `demo-${role}-${Date.now()}`,
      role,
      company_name: role === 'buyer' ? '데모 병원' : '데모 공급사',
      isDemo: true
    };
    localStorage.setItem('demoUser', JSON.stringify(demoUser));
    return demoUser;
  }
}
```

### 2.2 샘플 데이터 자동 생성
```typescript
// lib/demo-data.ts
export const DEMO_PROJECTS = [
  {
    title: "MRI 장비 구매",
    category: "의료기기",
    budget_range: "5억-10억",
    deadline: "2024-02-28",
    requirements: "최신 3T MRI, 설치 및 교육 포함"
  },
  {
    title: "병원 전산 시스템 구축",
    category: "IT 서비스",
    budget_range: "1억-3억",
    deadline: "2024-03-15",
    requirements: "EMR/OCS 통합 시스템"
  }
];

export const DEMO_BIDS = [
  {
    supplier_name: "메디칼솔루션(주)",
    price: 750000000,
    delivery_days: 60,
    comment: "GE 최신 모델, 5년 무상 AS"
  },
  {
    supplier_name: "헬스케어테크(주)",
    price: 680000000,
    delivery_days: 45,
    comment: "Siemens 모델, 설치 교육 포함"
  }
];
```

---

## 🔧 Phase 3: 기능별 구현 계획

### 3.1 요청자(Buyer) 대시보드
**경로**: `/dashboard/buyer`

#### 주요 기능:
1. **프로젝트 목록 보기**
   - 내가 등록한 프로젝트 목록
   - 상태별 필터 (진행중/마감/낙찰완료)
   - 응찰 수 표시

2. **새 프로젝트 등록**
   - 프로젝트 정보 입력 폼
   - 파일 업로드 (드래그앤드롭)
   - 마감일 설정

3. **응찰 비교 테이블**
   - 공급사별 가격/납기/조건 비교
   - 정렬 및 필터
   - Excel 다운로드
   - 가중치 점수 확인

### 3.2 공급자(Supplier) 대시보드  
**경로**: `/dashboard/supplier`

#### 주요 기능:
1. **프로젝트 탐색**
   - 카테고리별 필터
   - 마감 임박 프로젝트 하이라이트
   - 예산 범위 필터

2. **응찰 제출**
   - 견적가 입력
   - 납기일 설정
   - 상세 제안서 작성
   - 파일 첨부

3. **내 응찰 관리**
   - 응찰 상태 확인
   - 응찰 수정/철회

### 3.3 공통 기능

1. **실시간 알림**
   - 새 프로젝트 알림 (공급자)
   - 새 응찰 알림 (요청자)
   - 낙찰 결과 알림

2. **필터 & 검색**
   - 기존 FilterPanel 컴포넌트 재활용
   - Supabase 쿼리와 연동

---

## 📁 Phase 4: 파일 구조

```
src/
├── app/
│   ├── demo/                    # 데모 랜딩
│   │   └── page.tsx
│   ├── dashboard/
│   │   ├── buyer/               # 요청자 대시보드
│   │   │   ├── page.tsx
│   │   │   ├── projects/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── new/
│   │   │   │   └── [id]/
│   │   └── supplier/            # 공급자 대시보드
│   │       ├── page.tsx
│   │       ├── projects/
│   │       └── bids/
│   └── api/
│       ├── projects/
│       ├── bids/
│       └── notifications/
├── components/
│   ├── dashboard/
│   │   ├── ProjectCard.tsx
│   │   ├── BidComparisonTable.tsx
│   │   ├── ProjectForm.tsx
│   │   └── BidForm.tsx
│   └── demo/
│       └── RoleSelector.tsx
└── lib/
    ├── supabase/
    │   ├── client.ts
    │   ├── queries.ts
    │   └── mutations.ts
    └── demo/
        ├── session.ts
        └── sample-data.ts
```

---

## 🗓️ Phase 5: 구현 일정

### Week 1: 기초 설정
- [ ] Supabase 프로젝트 생성 및 연동
- [ ] 데이터베이스 스키마 생성
- [ ] 환경변수 설정
- [ ] 기본 API 라우트 구성

### Week 2: 데모 모드
- [ ] 데모 세션 관리 시스템
- [ ] 샘플 데이터 생성기
- [ ] 역할 선택 UI
- [ ] 데모 대시보드 레이아웃

### Week 3: 요청자 기능
- [ ] 프로젝트 CRUD
- [ ] 파일 업로드
- [ ] 응찰 비교 테이블
- [ ] Excel 다운로드

### Week 4: 공급자 기능
- [ ] 프로젝트 탐색
- [ ] 응찰 제출
- [ ] 응찰 관리
- [ ] 알림 시스템

---

## 🎨 UI/UX 재활용 전략

### 기존 컴포넌트 활용:
1. **FilterPanel** → 프로젝트 필터
2. **BiddingForm** → 응찰 제출 폼
3. **FileUploadArea** → 파일 업로드
4. **WeightedScoring** → 응찰 평가
5. **Table Components** → 비교 테이블

### 새로 필요한 컴포넌트:
1. **ProjectCard** - 프로젝트 카드 뷰
2. **BidComparisonTable** - 응찰 비교 전용 테이블
3. **DashboardLayout** - 대시보드 레이아웃
4. **NotificationBell** - 알림 아이콘

---

## 🔐 보안 고려사항 (데모 모드)

1. **데모 데이터 격리**
   - 데모 사용자는 별도 플래그로 구분
   - 데모 데이터는 주기적으로 초기화

2. **Rate Limiting**
   - API 호출 제한
   - 파일 업로드 크기 제한

3. **데이터 만료**
   - 데모 세션 24시간 후 자동 삭제
   - 업로드 파일 임시 저장

---

## 📈 성공 지표

1. **사용성**
   - 로그인 없이 3클릭 내 핵심 기능 체험
   - 역할 전환 즉시 가능

2. **완성도**
   - 모든 CRUD 작업 실제 동작
   - 실시간 데이터 반영

3. **성능**
   - 초기 로딩 3초 이내
   - API 응답 1초 이내

---

## 🚦 다음 단계

1. **Phase 1 완료 후**: 실제 인증 시스템 추가
2. **Phase 2 완료 후**: 결제 시스템 연동
3. **Phase 3 완료 후**: 메시징 시스템 구현

---

## 📝 참고사항

- 현재 구현된 응찰 시스템을 최대한 재활용
- Clinical Teal 테마 일관성 유지
- 모바일 반응형 디자인 필수
- 데모 모드에서도 실제와 동일한 UX 제공