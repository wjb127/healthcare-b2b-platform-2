import { createClient } from '@/lib/supabase/client'

export class AuthService {
  private supabase = createClient()

  // 데모 모드용 - Supabase users 테이블에서 데모 사용자 선택
  async selectDemoUser(role: 'buyer' | 'supplier') {
    // 데모 사용자 중에서 해당 role을 가진 사용자 조회
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('role', role)
      .eq('is_demo', true)
      .limit(1)
      .single()

    if (error) {
      console.error('Error fetching demo user:', error)
      // Fallback to localStorage
      return this.createLocalDemoUser(role)
    }

    // Store in localStorage for session
    localStorage.setItem('demo_user', JSON.stringify(data))
    localStorage.setItem('demo_user_id', data.id)
    
    return data
  }

  // localStorage fallback for demo mode
  createLocalDemoUser(role: 'buyer' | 'supplier') {
    const demoProfiles = {
      buyer: [
        { company_name: '서울대학교병원', contact_name: '김병원' },
        { company_name: '삼성서울병원', contact_name: '이의료' }
      ],
      supplier: [
        { company_name: '메디칼솔루션(주)', contact_name: '박공급' },
        { company_name: '헬스케어테크(주)', contact_name: '최기술' },
        { company_name: '바이오메드(주)', contact_name: '정바이오' }
      ]
    }

    const profiles = demoProfiles[role]
    const randomProfile = profiles[Math.floor(Math.random() * profiles.length)]

    const demoUser = {
      id: `demo-${Date.now()}`,
      ...randomProfile,
      role,
      is_demo: true,
      email: null,
      auth_id: null,
      created_at: new Date().toISOString()
    }

    localStorage.setItem('demo_user', JSON.stringify(demoUser))
    localStorage.setItem('demo_user_id', demoUser.id)
    
    return demoUser
  }

  getDemoUser() {
    const stored = localStorage.getItem('demo_user')
    return stored ? JSON.parse(stored) : null
  }

  getDemoUserId() {
    return localStorage.getItem('demo_user_id')
  }

  clearDemoUser() {
    localStorage.removeItem('demo_user')
    localStorage.removeItem('demo_user_id')
  }

  // 실제 인증 메서드들
  async signUp(email: string, password: string, metadata: any) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    
    if (error) throw error
    return data
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (error) throw error
    return data
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
    this.clearDemoUser()
  }

  async getUser() {
    const { data: { user } } = await this.supabase.auth.getUser()
    return user || this.getDemoUser()
  }
  
  async getProfile() {
    const { data: { user } } = await this.supabase.auth.getUser()
    if (!user) return null
    
    const { data, error } = await this.supabase
      .from('users')
      .select('*')
      .eq('auth_id', user.id)
      .single()
    
    if (error) {
      console.error('Error fetching profile:', error)
      return null
    }
    
    return data
  }
}