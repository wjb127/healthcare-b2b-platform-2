# Supabase 설정 가이드 (실사용 모드 전용)

> **참고**: 데모 모드는 Supabase 설정이 필요 없습니다. 바로 사용 가능합니다!

## 1. Supabase 프로젝트 생성

1. [Supabase Dashboard](https://app.supabase.com)에 접속
2. "New Project" 클릭
3. 프로젝트 정보 입력:
   - Name: `healthcare-b2b`
   - Database Password: 안전한 비밀번호 설정
   - Region: Seoul (ap-northeast-2) 권장

## 2. 데이터베이스 스키마 설정

### 방법 1: SQL Editor 사용 (권장)

1. Supabase Dashboard > SQL Editor 접속
2. 순서대로 실행:
   1) `supabase/migrations/001_initial_schema.sql` - 테이블 생성
   2) `supabase/migrations/002_sample_data.sql` - 샘플 데이터 추가
3. SQL Editor에 각각 붙여넣기 후 실행

### 방법 2: Migration 파일 사용

```bash
# Supabase CLI 설치 (아직 없는 경우)
npm install -g supabase

# 프로젝트 링크
supabase link --project-ref [your-project-ref]

# Migration 실행
supabase db push
```

## 3. 환경 변수 설정

1. `.env.local.example` 파일을 `.env.local`로 복사:
```bash
cp .env.local.example .env.local
```

2. Supabase Dashboard > Settings > API에서 값 복사:
```env
NEXT_PUBLIC_SUPABASE_URL=https://[your-project-ref].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
SUPABASE_SERVICE_ROLE_KEY=[your-service-role-key]  # 선택사항
```

## 4. Authentication 설정

### Email Authentication 활성화

1. Supabase Dashboard > Authentication > Providers
2. Email 활성화 확인
3. Settings에서 다음 설정:
   - Enable email confirmations: OFF (개발 중)
   - Enable email sign-ups: ON

### 이메일 템플릿 (선택사항)

1. Authentication > Email Templates
2. 한국어 템플릿으로 수정 가능

## 5. Storage 설정 (파일 업로드용)

1. Storage > Create Bucket
2. 버킷 생성:
   - Name: `project-files`
   - Public: false
3. 버킷 생성:
   - Name: `bid-files`
   - Public: false

### Storage 정책 설정

```sql
-- project-files 버킷 정책
CREATE POLICY "Users can upload project files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'project-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view project files" ON storage.objects
  FOR SELECT USING (bucket_id = 'project-files');

-- bid-files 버킷 정책  
CREATE POLICY "Users can upload bid files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'bid-files' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view bid files" ON storage.objects
  FOR SELECT USING (bucket_id = 'bid-files');
```

## 6. Realtime 설정

1. Dashboard > Database > Replication
2. 다음 테이블 활성화:
   - `notifications` - 실시간 알림
   - `bids` - 실시간 입찰 업데이트

## 7. 개발 서버 실행

```bash
npm run dev
```

http://localhost:3000 접속

## 8. 사용 방법

### 🎮 데모 모드 (Supabase 불필요)
- **접속**: 홈페이지 → "데모 체험하기" 버튼
- **특징**:
  - Supabase 연동 불필요
  - 인증 과정 없음
  - 로컬 스토리지만 사용
  - 즉시 테스트 가능
  - 역할 선택만으로 바로 시작

### 💼 실사용 모드 (Supabase 필요)
- **접속**: 홈페이지 → "실사용 시작하기" 버튼
- **특징**:
  - Supabase 데이터베이스 연동
  - 실제 인증 시스템
  - 영구 데이터 저장
  - 다중 사용자 지원
  - 실시간 업데이트

## 문제 해결

### "Supabase not configured" 오류
- `.env.local` 파일 확인
- 환경 변수가 올바르게 설정되었는지 확인
- 개발 서버 재시작

### CORS 오류
- Supabase Dashboard > Settings > API
- Allowed origins에 `http://localhost:3000` 추가

### 인증 오류
- Email confirmations 비활성화 확인
- Supabase Dashboard > Authentication > Users에서 사용자 상태 확인

## 프로덕션 배포

### Vercel 배포 시

1. Vercel Dashboard > Settings > Environment Variables
2. 다음 변수 추가:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (필요시)

3. 배포 트리거:
```bash
git push origin main
```

## 추가 리소스

- [Supabase Docs](https://supabase.com/docs)
- [Next.js + Supabase Guide](https://supabase.com/docs/guides/getting-started/quickstarts/nextjs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)