import { createClient } from '@/lib/supabase/client'
import { Database } from '@/lib/database.types'

export type DemoUser = Database['public']['Tables']['users']['Row']

export class DemoSession {
  private static STORAGE_KEY = 'demo_user'
  private static SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

  static async createDemoUser(role: 'buyer' | 'supplier'): Promise<DemoUser> {
    const supabase = createClient()
    
    // Create a new demo user in database
    const demoUser = {
      company_name: role === 'buyer' ? `데모 병원 ${Date.now()}` : `데모 공급사 ${Date.now()}`,
      contact_name: role === 'buyer' ? '구매담당자' : '영업담당자',
      role: role,
      is_demo: true
    }

    const { data, error } = await supabase
      .from('users')
      .insert(demoUser)
      .select()
      .single()

    if (error) {
      console.error('Error creating demo user:', error)
      // Fallback to local-only demo user
      const localUser: DemoUser = {
        id: `demo-${role}-${Date.now()}`,
        ...demoUser,
        email: null,
        created_at: new Date().toISOString()
      }
      this.saveToLocalStorage(localUser)
      return localUser
    }

    // Save to localStorage with expiration
    this.saveToLocalStorage(data)
    return data
  }

  static getDemoUser(): DemoUser | null {
    if (typeof window === 'undefined') return null
    
    const stored = localStorage.getItem(this.STORAGE_KEY)
    if (!stored) return null

    try {
      const { user, expiry } = JSON.parse(stored)
      
      // Check if session expired
      if (new Date().getTime() > expiry) {
        this.clearDemoUser()
        return null
      }

      return user
    } catch {
      return null
    }
  }

  static saveToLocalStorage(user: DemoUser) {
    const expiry = new Date().getTime() + this.SESSION_DURATION
    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify({ user, expiry })
    )
  }

  static clearDemoUser() {
    localStorage.removeItem(this.STORAGE_KEY)
  }

  static async switchRole(newRole: 'buyer' | 'supplier'): Promise<DemoUser> {
    this.clearDemoUser()
    return this.createDemoUser(newRole)
  }
}