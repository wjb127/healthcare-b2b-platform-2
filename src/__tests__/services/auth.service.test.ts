import { AuthService } from '@/services/auth.service'

// Mock Supabase client
jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn(() => ({
      select: jest.fn(() => ({
        eq: jest.fn(() => ({
          eq: jest.fn(() => ({
            limit: jest.fn(() => ({
              single: jest.fn()
            }))
          }))
        }))
      }))
    }))
  }))
}))

describe('AuthService', () => {
  let authService: AuthService

  beforeEach(() => {
    authService = new AuthService()
    localStorage.clear()
  })

  describe('selectDemoUser', () => {
    it('should select buyer demo user and store in localStorage', async () => {
      const mockBuyerUser = {
        id: 'demo-buyer-123',
        company_name: '서울대학교병원',
        contact_name: '김병원',
        role: 'buyer',
        is_demo: true,
        email: null,
        auth_id: null,
        created_at: '2024-01-01'
      }

      const mockSupabase = require('@/lib/supabase/client').createClient()
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: mockBuyerUser, error: null })
              })
            })
          })
        })
      })

      const user = await authService.selectDemoUser('buyer')

      expect(user).toEqual(mockBuyerUser)
      expect(localStorage.getItem('demo_user')).toBe(JSON.stringify(mockBuyerUser))
      expect(localStorage.getItem('demo_user_id')).toBe(mockBuyerUser.id)
    })

    it('should fallback to localStorage when Supabase fails', async () => {
      const mockSupabase = require('@/lib/supabase/client').createClient()
      mockSupabase.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              limit: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({ data: null, error: new Error('Network error') })
              })
            })
          })
        })
      })

      const user = await authService.selectDemoUser('supplier')

      expect(user).toBeDefined()
      expect(user.role).toBe('supplier')
      expect(user.is_demo).toBe(true)
      expect(localStorage.getItem('demo_user')).toBeDefined()
    })
  })

  describe('getDemoUser', () => {
    it('should retrieve demo user from localStorage', () => {
      const mockUser = {
        id: 'demo-123',
        company_name: 'Test Company',
        role: 'buyer'
      }
      localStorage.setItem('demo_user', JSON.stringify(mockUser))

      const user = authService.getDemoUser()

      expect(user).toEqual(mockUser)
    })

    it('should return null when no demo user exists', () => {
      const user = authService.getDemoUser()
      expect(user).toBeNull()
    })
  })

  describe('clearDemoUser', () => {
    it('should clear demo user from localStorage', () => {
      localStorage.setItem('demo_user', JSON.stringify({ id: 'test' }))
      localStorage.setItem('demo_user_id', 'test')

      authService.clearDemoUser()

      expect(localStorage.getItem('demo_user')).toBeNull()
      expect(localStorage.getItem('demo_user_id')).toBeNull()
    })
  })
})