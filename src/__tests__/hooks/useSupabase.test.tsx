import { renderHook } from '@testing-library/react'
import { useSupabase } from '@/hooks/useSupabase'

// Mock environment variables
const originalEnv = process.env

beforeEach(() => {
  jest.resetModules()
  process.env = { ...originalEnv }
})

afterEach(() => {
  process.env = originalEnv
})

// Mock services
jest.mock('@/services/auth.service')
jest.mock('@/services/projects.service')
jest.mock('@/services/bids.service')
jest.mock('@/services/notifications.service')

describe('useSupabase', () => {
  describe('when Supabase is not configured', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = undefined
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = undefined
    })

    it('should return isConfigured as false', () => {
      const { result } = renderHook(() => useSupabase())
      expect(result.current.isConfigured).toBe(false)
    })

    it('should provide fallback localStorage methods', () => {
      const { result } = renderHook(() => useSupabase())
      
      expect(result.current.auth.selectDemoUser).toBeDefined()
      expect(result.current.projects.getProjects).toBeDefined()
      expect(result.current.bids.getBidsByProject).toBeDefined()
    })

    it('should throw error for auth methods that require Supabase', async () => {
      const { result } = renderHook(() => useSupabase())
      
      await expect(result.current.auth.signUp()).rejects.toThrow('Supabase not configured')
      await expect(result.current.auth.signIn()).rejects.toThrow('Supabase not configured')
    })
  })

  describe('when Supabase is configured', () => {
    beforeEach(() => {
      process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    })

    it('should return isConfigured as true', () => {
      const { result } = renderHook(() => useSupabase())
      expect(result.current.isConfigured).toBe(true)
    })

    it('should provide actual Supabase services', () => {
      const { result } = renderHook(() => useSupabase())
      
      expect(result.current.auth).toBeDefined()
      expect(result.current.projects).toBeDefined()
      expect(result.current.bids).toBeDefined()
      expect(result.current.notifications).toBeDefined()
    })

    it('should include selectDemoUser method in auth service', () => {
      const { result } = renderHook(() => useSupabase())
      expect(result.current.auth.selectDemoUser).toBeDefined()
    })
  })
})