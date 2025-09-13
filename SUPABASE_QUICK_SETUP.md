# 🚀 Supabase 빠른 설정 가이드 (5분 완료)

## 📌 중요: 데모는 Supabase 없이 작동합니다!
데모 모드는 설정 없이 바로 사용 가능합니다. 실사용 모드만 Supabase가 필요합니다.

---

## 1단계: Supabase 프로젝트 생성 (2분)

1. **[Supabase](https://app.supabase.com) 접속**
2. **"New project" 클릭**
3. **입력사항:**
   - Project name: `healthcare-b2b`
   - Database Password: `아무거나 (기억 안해도 됨)`
   - Region: `Northeast Asia (Seoul)`
4. **"Create new project" 클릭**

## 2단계: 테이블 생성 (1분)

1. **SQL Editor 열기** (왼쪽 메뉴)
2. **아래 SQL 복사 & 붙여넣기 & 실행:**

```sql
-- 간단 버전: 필수 테이블만 생성
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  auth_id TEXT,
  role TEXT CHECK (role IN ('buyer', 'supplier', 'admin')),
  company_name TEXT,
  contact_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  budget_range TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'open',
  requirements TEXT,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  supplier_id UUID REFERENCES users(id),
  price BIGINT,
  description TEXT,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS 활성화 (보안)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- 모든 사용자가 읽기 가능 (임시)
CREATE POLICY "Public read access" ON users FOR SELECT USING (true);
CREATE POLICY "Public read access" ON projects FOR SELECT USING (true);
CREATE POLICY "Public read access" ON bids FOR SELECT USING (true);

-- 로그인한 사용자는 쓰기 가능
CREATE POLICY "Authenticated users can insert" ON users FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert" ON projects FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Authenticated users can insert" ON bids FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
```

## 3단계: 환경 변수 설정 (1분)

1. **Settings > API 메뉴 이동** (왼쪽 메뉴)
2. **복사할 값:**
   - `Project URL` 복사
   - `anon public` 키 복사

3. **프로젝트 루트에 `.env.local` 파일 생성:**
```bash
NEXT_PUBLIC_SUPABASE_URL=붙여넣기_Project_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=붙여넣기_anon_public_키
```

## 4단계: 서버 재시작 (1분)

```bash
# Ctrl+C로 서버 중지 후
npm run dev
```

## ✅ 완료! 테스트하기

### 방법 1: 회원가입 테스트
1. http://localhost:3000 접속
2. "실사용 시작하기" 클릭
3. 회원가입 진행

### 방법 2: 테스트 데이터 추가 (선택)
SQL Editor에서 실행:
```sql
-- 테스트 사용자 추가
INSERT INTO users (email, role, company_name, contact_name) VALUES
('test@buyer.com', 'buyer', '테스트병원', '김테스트'),
('test@supplier.com', 'supplier', '테스트공급사', '이테스트');

-- 테스트 프로젝트 추가
INSERT INTO projects (title, category, budget_range, deadline, status, user_id) 
SELECT 'MRI 장비 구매', 'medical_equipment', '10억원 이상', NOW() + INTERVAL '30 days', 'open', id
FROM users WHERE email = 'test@buyer.com';
```

## 🔧 문제 해결

### "Supabase not configured" 오류
- `.env.local` 파일 확인
- URL이 `https://`로 시작하는지 확인
- 서버 재시작 필요

### 회원가입 안됨
1. **Authentication > Settings** 이동
2. **"Enable email confirmations" 끄기** (개발용)
3. 다시 시도

### 데이터 안보임
- SQL Editor에서 확인: `SELECT * FROM projects;`
- RLS 정책 확인

## 📝 추가 옵션 (나중에)

- 이메일 인증 설정
- 소셜 로그인 추가 (Google, GitHub)
- 더 많은 샘플 데이터 추가: `/supabase/migrations/002_sample_data.sql` 실행

---

**💡 팁**: 데모 모드로 먼저 테스트하고, 나중에 Supabase를 설정해도 됩니다!