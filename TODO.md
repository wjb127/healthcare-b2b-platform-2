# 헬스케어 B2B 플랫폼 기능 체크리스트

## 1. 사용자 관리 (User Management)
- [ ] **구현 여부:** ⏳ 대기중 (로그인/회원가입 제외)
- **내용:** A / B 그룹(요청자/공급자) 구분 회원가입 및 로그인, 기본 프로필(회사명, 담당자, 이메일 등) 관리 기능.
- **현재 상태:** 데모 모드로 역할 선택 가능, Supabase Auth 연동 예정
- **확인 파일:** `src/app/demo/page.tsx`, `src/lib/demo/session.ts`

## 2. 비딩 요청 (Bidding Request)
- [x] **구현 여부:** ✅ 테스트 완료
- **내용:** 요청자가 프로젝트(제목, 분야, 지역, 일정, 필요조건)를 등록하고, 요청서 파일을 업로드하며, 마감 기한을 설정하는 기능.
- **테스트 파일:** `src/__tests__/features/bidding-request.test.tsx`
- **확인 파일:** `app/dashboard/buyer/projects/new/page.tsx` (구현 예정)

## 3. 비딩 응찰 (Bidding Proposal)
- [x] **구현 여부:** ✅ 테스트 완료
- **내용:** 공급자가 요청서를 열람하고 견적, 기간, 코멘트를 포함한 응찰서를 제출하며, 응찰 내역을 관리하는 기능.
- **테스트 파일:** `src/__tests__/features/bidding-proposal.test.tsx`
- **확인 파일:** `app/dashboard/supplier/projects/[id]/page.tsx` (구현 예정)

## 4. 비교 기능 (Comparison Feature)
- [x] **구현 여부:** ✅ 테스트 완료
- **내용:** 요청자가 응찰한 공급사들의 견적/기간/코멘트를 표로 비교하고, 엑셀 파일로 다운로드하는 기능.
- **세부 내용:** A 사용자가 B의 응찰 조건(금액/기간/코멘트)을 비교/열람
- **테스트 파일:** `src/__tests__/features/comparison.test.tsx`
- **확인 파일:** `app/dashboard/buyer/projects/[id]/page.tsx` (구현 예정)

## 5. 알림 (Notifications)
- [x] **구현 여부:** ✅ 테스트 완료
- **내용:** 신규 요청서가 등록되거나 새로운 응찰이 있을 때 관련 사용자에게 이메일로 알림을 보내는 기능.
- **테스트 파일:** `src/__tests__/features/notifications.test.tsx`
- **확인 파일:** `app/api/email/route.ts` (구현 예정)

---
📝 **참고:** TDD 방식으로 테스트 작성 완료. UI 구현은 다음 단계에서 진행 예정.
🧪 **테스트 실행:** `npm test` (Unit), `npx playwright test` (E2E)
