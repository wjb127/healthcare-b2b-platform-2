import { test, expect } from '@playwright/test'

test.describe('헬스케어 B2B 플랫폼 - TODO 기능 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/demo')
  })

  test.describe('2. 비딩 요청 (Bidding Request)', () => {
    test('요청자가 프로젝트를 등록할 수 있다', async ({ page }) => {
      // Given - 구매자로 로그인
      await page.click('text=구매자로 시작하기')
      await page.waitForURL('**/dashboard/buyer')

      // When - 새 프로젝트 등록
      await page.click('text=새 프로젝트')
      await page.fill('input[name="title"]', 'MRI 장비 구매')
      await page.selectOption('select[name="category"]', '의료기기')
      await page.fill('input[name="region"]', '서울')
      await page.fill('input[name="budget_range"]', '5억-10억')
      await page.fill('input[name="deadline"]', '2024-12-31')
      await page.fill('textarea[name="requirements"]', '3T MRI, 설치 및 교육 포함')
      
      // Then
      await page.click('button[type="submit"]')
      await expect(page.locator('text=MRI 장비 구매')).toBeVisible()
    })

    test('요청서 파일을 업로드할 수 있다', async ({ page }) => {
      // Given
      await page.click('text=구매자로 시작하기')
      await page.waitForURL('**/dashboard/buyer')
      await page.click('text=새 프로젝트')

      // When - 파일 업로드
      const fileInput = page.locator('input[type="file"]')
      await fileInput.setInputFiles({
        name: 'test-document.pdf',
        mimeType: 'application/pdf',
        buffer: Buffer.from('test content'),
      })

      // Then
      await expect(page.locator('text=test-document.pdf')).toBeVisible()
    })

    test('마감 기한을 설정할 수 있다', async ({ page }) => {
      // Given
      await page.click('text=구매자로 시작하기')
      await page.waitForURL('**/dashboard/buyer')
      await page.click('text=새 프로젝트')

      // When
      const deadline = new Date()
      deadline.setDate(deadline.getDate() + 30)
      const formattedDate = deadline.toISOString().split('T')[0]
      await page.fill('input[name="deadline"]', formattedDate)

      // Then
      const deadlineInput = page.locator('input[name="deadline"]')
      await expect(deadlineInput).toHaveValue(formattedDate)
    })
  })

  test.describe('3. 비딩 응찰 (Bidding Proposal)', () => {
    test('공급자가 요청서를 열람할 수 있다', async ({ page }) => {
      // Given
      await page.click('text=공급자로 시작하기')
      await page.waitForURL('**/dashboard/supplier')

      // When - 프로젝트 목록 확인
      await expect(page.locator('text=프로젝트 목록')).toBeVisible()

      // Then - 프로젝트 상세 보기
      const firstProject = page.locator('.project-card').first()
      await firstProject.click()
      await expect(page.locator('text=프로젝트 상세')).toBeVisible()
    })

    test('공급자가 응찰서를 제출할 수 있다', async ({ page }) => {
      // Given
      await page.click('text=공급자로 시작하기')
      await page.waitForURL('**/dashboard/supplier')
      
      // When - 응찰서 작성
      const firstProject = page.locator('.project-card').first()
      await firstProject.click()
      await page.click('text=응찰하기')
      
      await page.fill('input[name="price"]', '750000000')
      await page.fill('input[name="delivery_days"]', '60')
      await page.fill('textarea[name="comment"]', 'GE 최신 모델, 5년 무상 AS')
      
      // Then
      await page.click('button[type="submit"]')
      await expect(page.locator('text=응찰이 제출되었습니다')).toBeVisible()
    })

    test('공급자가 응찰 내역을 관리할 수 있다', async ({ page }) => {
      // Given
      await page.click('text=공급자로 시작하기')
      await page.waitForURL('**/dashboard/supplier')
      
      // When - 내 응찰 관리 페이지
      await page.click('text=내 응찰')
      
      // Then
      await expect(page.locator('text=응찰 관리')).toBeVisible()
      await expect(page.locator('.bid-status')).toBeVisible()
    })
  })

  test.describe('4. 비교 기능 (Comparison Feature)', () => {
    test('요청자가 응찰 조건을 비교할 수 있다', async ({ page }) => {
      // Given
      await page.click('text=구매자로 시작하기')
      await page.waitForURL('**/dashboard/buyer')
      
      // When - 프로젝트의 응찰 비교
      const projectWithBids = page.locator('.project-card').first()
      await projectWithBids.click()
      await page.click('text=응찰 비교')
      
      // Then
      await expect(page.locator('table.comparison-table')).toBeVisible()
      await expect(page.locator('th:has-text("공급사")')).toBeVisible()
      await expect(page.locator('th:has-text("가격")')).toBeVisible()
      await expect(page.locator('th:has-text("납기")')).toBeVisible()
    })

    test('비교 테이블을 Excel로 다운로드할 수 있다', async ({ page }) => {
      // Given
      await page.click('text=구매자로 시작하기')
      await page.waitForURL('**/dashboard/buyer')
      const projectWithBids = page.locator('.project-card').first()
      await projectWithBids.click()
      await page.click('text=응찰 비교')
      
      // When - Excel 다운로드 버튼 클릭
      const downloadPromise = page.waitForEvent('download')
      await page.click('button:has-text("Excel 다운로드")')
      const download = await downloadPromise
      
      // Then
      expect(download.suggestedFilename()).toContain('.xlsx')
    })

    test('가중치 점수를 확인할 수 있다', async ({ page }) => {
      // Given
      await page.click('text=구매자로 시작하기')
      await page.waitForURL('**/dashboard/buyer')
      const projectWithBids = page.locator('.project-card').first()
      await projectWithBids.click()
      await page.click('text=응찰 비교')
      
      // When - 가중치 설정
      await page.click('text=가중치 설정')
      await expect(page.locator('.weight-slider')).toBeVisible()
      
      // Then - 점수 확인
      await expect(page.locator('.weighted-score')).toBeVisible()
    })
  })

  test.describe('5. 알림 (Notifications)', () => {
    test('신규 프로젝트 등록 시 알림이 표시된다', async ({ page }) => {
      // Given - 공급자로 로그인
      await page.click('text=공급자로 시작하기')
      await page.waitForURL('**/dashboard/supplier')
      
      // Then - 알림 아이콘과 개수 확인
      const notificationBell = page.locator('.notification-bell')
      await expect(notificationBell).toBeVisible()
      
      // 알림 클릭하여 상세 확인
      await notificationBell.click()
      await expect(page.locator('text=새로운 프로젝트가 등록되었습니다')).toBeVisible()
    })

    test('새 응찰 접수 시 알림이 표시된다', async ({ page }) => {
      // Given - 구매자로 로그인
      await page.click('text=구매자로 시작하기')
      await page.waitForURL('**/dashboard/buyer')
      
      // Then - 알림 확인
      const notificationBell = page.locator('.notification-bell')
      await expect(notificationBell).toBeVisible()
      
      await notificationBell.click()
      await expect(page.locator('text=새로운 응찰이 접수되었습니다')).toBeVisible()
    })

    test('알림을 읽음 처리할 수 있다', async ({ page }) => {
      // Given
      await page.click('text=구매자로 시작하기')
      await page.waitForURL('**/dashboard/buyer')
      
      // When
      const notificationBell = page.locator('.notification-bell')
      await notificationBell.click()
      
      const unreadNotification = page.locator('.notification-item.unread').first()
      await unreadNotification.click()
      
      // Then
      await expect(unreadNotification).not.toHaveClass(/unread/)
    })
  })
})