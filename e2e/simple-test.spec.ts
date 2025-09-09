import { test, expect } from '@playwright/test'

test.describe('헬스케어 B2B 플랫폼 - 기본 동작 테스트', () => {
  test('데모 페이지로 리다이렉트 되는지 확인', async ({ page }) => {
    await page.goto('/')
    
    // 데모 페이지로 자동 리다이렉트 확인
    await expect(page).toHaveURL(/.*demo/)
    
    // 역할 선택 버튼 확인
    await expect(page.getByText('구매자로 시작하기')).toBeVisible()
    await expect(page.getByText('공급자로 시작하기')).toBeVisible()
  })

  test('구매자 대시보드 접근 가능', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL('**/demo')
    
    // 구매자 선택
    await page.getByRole('button', { name: '구매자로 시작하기' }).click()
    
    // 대시보드로 이동 확인
    await expect(page).toHaveURL(/.*dashboard\/buyer/)
    await expect(page.getByText('구매자 대시보드')).toBeVisible()
  })

  test('공급자 대시보드 접근 가능', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL('**/demo')
    
    // 공급자 선택
    await page.getByRole('button', { name: '공급자로 시작하기' }).click()
    
    // 대시보드로 이동 확인
    await expect(page).toHaveURL(/.*dashboard\/supplier/)
    await expect(page.getByText('공급자 대시보드')).toBeVisible()
  })

  test('구매자가 새 프로젝트 페이지 접근 가능', async ({ page }) => {
    await page.goto('/')
    await page.waitForURL('**/demo')
    
    // 구매자로 로그인
    await page.getByRole('button', { name: '구매자로 시작하기' }).click()
    await page.waitForURL('**/dashboard/buyer')
    
    // 새 프로젝트 버튼 클릭
    await page.getByRole('button', { name: '새 프로젝트' }).click()
    
    // 프로젝트 등록 페이지 확인
    await expect(page).toHaveURL(/.*projects\/new/)
    await expect(page.getByText('새 프로젝트 등록')).toBeVisible()
  })
})