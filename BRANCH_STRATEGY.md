# Git Branch Strategy

## 브랜치 구조

### 1. main (운영 브랜치)
- **용도**: 프로덕션 배포용 안정화된 코드
- **배포**: Vercel 자동 배포 (https://healthcare-b2b-platform-2.vercel.app)
- **머지 규칙**: develop에서 테스트 완료 후 PR을 통해서만 머지
- **보호 설정**: Direct push 금지 (GitHub 설정 필요)

### 2. develop (개발 브랜치)
- **용도**: 개발 중인 기능 통합 및 테스트
- **배포**: Vercel Preview 배포 (자동 생성)
- **머지 규칙**: feature 브랜치에서 PR을 통해 머지
- **기본 작업 브랜치**: 모든 새 기능은 여기서 시작

### 3. feature/* (기능 브랜치)
- **용도**: 개별 기능 개발
- **네이밍**: `feature/기능명` (예: feature/chat-system)
- **생성**: develop 브랜치에서 분기
- **머지**: develop으로 PR 후 머지
- **삭제**: 머지 후 삭제

### 4. hotfix/* (긴급 수정 브랜치)
- **용도**: 운영 환경 긴급 버그 수정
- **네이밍**: `hotfix/이슈명` (예: hotfix/login-error)
- **생성**: main 브랜치에서 분기
- **머지**: main과 develop 둘 다 머지
- **삭제**: 머지 후 삭제

## 작업 플로우

### 새 기능 개발
```bash
# 1. develop 브랜치에서 시작
git checkout develop
git pull origin develop

# 2. feature 브랜치 생성
git checkout -b feature/new-feature

# 3. 개발 작업 수행
# ... 코드 작성 ...

# 4. 커밋 및 푸시
git add .
git commit -m "feat: 새 기능 설명"
git push origin feature/new-feature

# 5. GitHub에서 PR 생성 (feature -> develop)
# 6. 코드 리뷰 후 머지
# 7. 로컬에서 브랜치 삭제
git checkout develop
git branch -d feature/new-feature
```

### 운영 배포
```bash
# 1. develop 브랜치 최신화
git checkout develop
git pull origin develop

# 2. main으로 PR 생성
# GitHub에서 develop -> main PR 생성

# 3. 테스트 확인 후 머지
# 4. 자동 배포 확인
```

### 긴급 수정
```bash
# 1. main에서 hotfix 브랜치 생성
git checkout main
git pull origin main
git checkout -b hotfix/critical-bug

# 2. 수정 작업 수행
# ... 버그 수정 ...

# 3. 커밋 및 푸시
git add .
git commit -m "fix: 긴급 버그 수정"
git push origin hotfix/critical-bug

# 4. main으로 PR 및 머지
# 5. develop으로도 머지
git checkout develop
git merge hotfix/critical-bug
git push origin develop

# 6. 브랜치 삭제
git branch -d hotfix/critical-bug
```

## Commit Message Convention

### 형식
```
<type>: <subject>

<body> (선택사항)

<footer> (선택사항)
```

### Type
- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **docs**: 문서 수정
- **style**: 코드 포맷팅, 세미콜론 누락 등
- **refactor**: 코드 리팩토링
- **test**: 테스트 코드
- **chore**: 빌드 업무, 패키지 매니저 수정 등

### 예시
```
feat: 실시간 채팅 기능 추가

- WebSocket 연결 구현
- 메시지 전송/수신 기능
- 읽음 표시 기능

Resolves: #123
```

## Vercel 배포 설정

### Production (main 브랜치)
- **URL**: https://healthcare-b2b-platform-2.vercel.app
- **자동 배포**: main 브랜치 푸시 시

### Preview (develop 브랜치)
- **URL**: https://healthcare-b2b-platform-2-git-develop-[username].vercel.app
- **자동 배포**: develop 브랜치 푸시 시

### Feature Preview
- **URL**: 각 PR마다 고유 URL 생성
- **자동 배포**: PR 생성/업데이트 시

## 팀 작업 규칙

1. **절대 main 브랜치에 직접 푸시 금지**
2. **모든 기능은 develop 브랜치 기반으로 개발**
3. **PR 생성 시 명확한 설명 작성**
4. **머지 전 최소 1명 이상 코드 리뷰**
5. **develop → main 머지는 테스트 완료 후에만**
6. **커밋 메시지는 Convention 준수**

## 현재 상태

- ✅ main 브랜치: 운영 배포 중
- ✅ develop 브랜치: 개발 환경 준비 완료
- 📝 다음 단계: GitHub에서 branch protection rules 설정 필요