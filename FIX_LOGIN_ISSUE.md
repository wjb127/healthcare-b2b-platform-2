# 로그인 문제 해결 가이드

## 문제: "Invalid login credentials" 에러

## 원인
Supabase는 기본적으로 이메일 확인을 요구합니다. 이메일 확인 전에는 로그인할 수 없습니다.

## 해결 방법

### 방법 1: Supabase에서 이메일 확인 비활성화 (권장)

1. [Supabase Dashboard](https://supabase.com/dashboard/project/utiirxljrjyxvlnfcxgz/auth/providers) 접속
2. **Authentication** → **Providers** → **Email** 클릭
3. **Confirm email** 옵션을 **OFF**로 변경
4. Save 클릭

### 방법 2: 이메일 확인 링크 클릭
1. 회원가입 시 입력한 이메일 확인
2. Supabase에서 보낸 확인 이메일 찾기
3. "Confirm your email" 링크 클릭
4. 이후 로그인 가능

### 방법 3: Supabase Dashboard에서 직접 확인

1. [Supabase Users](https://supabase.com/dashboard/project/utiirxljrjyxvlnfcxgz/auth/users) 접속
2. 가입한 사용자 찾기
3. 사용자 우측 점 3개 메뉴 클릭
4. "Confirm email" 클릭

### 방법 4: SQL로 직접 확인 (고급)

Supabase SQL Editor에서:
```sql
-- 이메일로 사용자 확인
UPDATE auth.users 
SET email_confirmed_at = NOW() 
WHERE email = 'your-email@example.com';
```

## Vercel 환경 변수 설정

[Vercel Dashboard](https://vercel.com/your-account/healthcare-b2b-platform-2/settings/environment-variables)에서:

```
NEXT_PUBLIC_SITE_URL=https://healthcare-b2b-platform-2.vercel.app
NEXT_PUBLIC_SUPABASE_URL=https://utiirxljrjyxvlnfcxgz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

## 테스트용 빠른 설정

### 1. 이메일 확인 비활성화 (한 번만)
Supabase Dashboard → Authentication → Providers → Email → Confirm email → **OFF**

### 2. 테스트 계정 생성
- 웹사이트: https://healthcare-b2b-platform-2.vercel.app/auth/signup
- 이메일: test@example.com
- 비밀번호: Test1234!

### 3. 바로 로그인
- https://healthcare-b2b-platform-2.vercel.app/auth/login
- 위 계정으로 로그인

## 디버깅 팁

### 로그인이 여전히 안 되면:

1. **브라우저 콘솔 확인**
   - F12 → Console 탭
   - 에러 메시지 확인

2. **Supabase Logs 확인**
   - [Authentication Logs](https://supabase.com/dashboard/project/utiirxljrjyxvlnfcxgz/auth/logs)
   - Failed login attempts 확인

3. **localStorage 초기화**
   ```javascript
   // 브라우저 콘솔에서 실행
   localStorage.clear()
   ```

4. **테스트 계정 사용**
   - 이메일: buyer@demo.com
   - 비밀번호: demo1234
   - (Supabase 없이도 작동)

## 즉시 해결하려면

**Supabase Dashboard에서 이메일 확인을 OFF로 설정하세요!**
- https://supabase.com/dashboard/project/utiirxljrjyxvlnfcxgz/auth/providers
- Email → Confirm email → OFF → Save

이후 새로 가입하거나 기존 계정으로 바로 로그인 가능합니다.