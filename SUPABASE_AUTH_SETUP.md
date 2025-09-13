# Supabase 인증 설정 가이드

## 1. Supabase 프로젝트 설정

### 1-1. 환경 변수 설정 ✅ (이미 완료)
`.env.local` 파일에 이미 설정되어 있음:
```
NEXT_PUBLIC_SUPABASE_URL=https://utiirxljrjyxvlnfcxgz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

### 1-2. Supabase Dashboard에서 테이블 생성

1. [Supabase Dashboard](https://supabase.com/dashboard/project/utiirxljrjyxvlnfcxgz/editor) 접속
2. SQL Editor로 이동
3. 아래 SQL 실행:

```sql
-- Users 테이블 생성 (이미 있으면 스킵)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  auth_id UUID REFERENCES auth.users(id),
  role TEXT CHECK (role IN ('buyer', 'supplier', 'admin')),
  company_name TEXT,
  contact_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects 테이블 생성 (이미 있으면 스킵)
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT,
  budget_range TEXT,
  deadline DATE,
  status TEXT DEFAULT 'open',
  requirements TEXT,
  user_id UUID REFERENCES users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bids 테이블 생성 (이미 있으면 스킵)
CREATE TABLE IF NOT EXISTS bids (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID REFERENCES projects(id),
  supplier_id UUID REFERENCES users(id),
  price BIGINT,
  comment TEXT,
  delivery_days INTEGER,
  score INTEGER,
  status TEXT DEFAULT 'submitted',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS (Row Level Security) 정책 설정
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Users 테이블 정책
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = auth_id);

-- Projects 테이블 정책
CREATE POLICY "Anyone can view projects" ON projects
  FOR SELECT USING (true);

CREATE POLICY "Buyers can create projects" ON projects
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT auth_id FROM users WHERE role = 'buyer')
  );

CREATE POLICY "Users can update own projects" ON projects
  FOR UPDATE USING (
    user_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );

-- Bids 테이블 정책
CREATE POLICY "Anyone can view bids" ON bids
  FOR SELECT USING (true);

CREATE POLICY "Suppliers can create bids" ON bids
  FOR INSERT WITH CHECK (
    auth.uid() IN (SELECT auth_id FROM users WHERE role = 'supplier')
  );

CREATE POLICY "Users can update own bids" ON bids
  FOR UPDATE USING (
    supplier_id IN (SELECT id FROM users WHERE auth_id = auth.uid())
  );
```

## 2. 인증 설정

### 2-1. Supabase Authentication 설정

1. [Authentication 설정](https://supabase.com/dashboard/project/utiirxljrjyxvlnfcxgz/auth/users) 접속
2. **Providers** 탭에서 **Email** 활성화 확인
3. **Email Templates** 탭에서 템플릿 커스터마이징 (선택사항)

### 2-2. 이메일 인증 설정 (선택사항)

Authentication > Settings에서:
- **Enable email confirmations**: OFF (테스트용)
- 프로덕션에서는 ON 권장

## 3. 테스트 계정 생성

### 방법 1: 웹사이트에서 회원가입
1. https://your-app.vercel.app/auth/signup 접속
2. 회원가입 폼 작성:
   - 이메일: buyer@test.com / supplier@test.com
   - 비밀번호: Test1234!
   - 회사명: 테스트병원 / 테스트공급사
   - 담당자명: 김구매 / 이공급
   - 역할: 구매자 / 공급자

### 방법 2: Supabase Dashboard에서 직접 생성
1. Authentication > Users 탭
2. "Add user" 버튼 클릭
3. 이메일과 비밀번호 입력
4. SQL Editor에서 users 테이블에 프로필 추가:

```sql
-- 구매자 계정 프로필
INSERT INTO users (email, auth_id, role, company_name, contact_name)
VALUES (
  'buyer@test.com',
  (SELECT id FROM auth.users WHERE email = 'buyer@test.com'),
  'buyer',
  '서울대학교병원',
  '김구매'
);

-- 공급자 계정 프로필
INSERT INTO users (email, auth_id, role, company_name, contact_name)
VALUES (
  'supplier@test.com',
  (SELECT id FROM auth.users WHERE email = 'supplier@test.com'),
  'supplier',
  '메디칼솔루션(주)',
  '이공급'
);
```

## 4. 샘플 데이터 추가 (선택사항)

```sql
-- 샘플 프로젝트 추가
INSERT INTO projects (title, category, budget_range, deadline, status, user_id)
VALUES (
  'MRI 장비 구매',
  'medical_equipment',
  '10억원 이상',
  CURRENT_DATE + 30,
  'open',
  (SELECT id FROM users WHERE email = 'buyer@test.com')
);

-- 샘플 입찰 추가
INSERT INTO bids (project_id, supplier_id, price, comment, status)
VALUES (
  (SELECT id FROM projects WHERE title = 'MRI 장비 구매'),
  (SELECT id FROM users WHERE email = 'supplier@test.com'),
  1500000000,
  '최신 3T MRI 장비 제공 가능합니다.',
  'submitted'
);
```

## 5. 로그인 테스트

### 실사용 모드 테스트
1. https://your-app.vercel.app/auth/login 접속
2. 위에서 생성한 계정으로 로그인
3. 역할에 따라 구매자/공급자 대시보드로 이동

### 데모 모드 (Supabase 없이)
- 이메일: buyer@demo.com / supplier@demo.com
- 비밀번호: demo1234

## 6. 트러블슈팅

### 문제: "Invalid login credentials"
- 해결: 이메일/비밀번호 확인, 이메일 인증 필요 여부 확인

### 문제: "User not found in users table"
- 해결: users 테이블에 프로필 생성 필요 (위 SQL 참조)

### 문제: "Permission denied"
- 해결: RLS 정책 확인, auth_id가 올바르게 설정되었는지 확인

## 7. Vercel 배포 설정

Vercel Dashboard > Settings > Environment Variables에서:
```
NEXT_PUBLIC_SUPABASE_URL=https://utiirxljrjyxvlnfcxgz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

배포 후 다시 빌드 필요: Deployments > Redeploy

---

## 요약 체크리스트

- [ ] Supabase 테이블 생성 (users, projects, bids)
- [ ] RLS 정책 설정
- [ ] 테스트 계정 생성
- [ ] 로컬에서 로그인 테스트
- [ ] Vercel 환경 변수 설정
- [ ] 프로덕션 배포 및 테스트

문의사항이 있으면 언제든 물어보세요!