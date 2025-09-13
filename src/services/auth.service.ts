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

  // 나중에 구현할 실제 인증 메서드들
  async signUp(email: string, password: string, metadata: any) {
    throw new Error('Sign up not implemented yet')
  }

  async signIn(email: string, password: string) {
    throw new Error('Sign in not implemented yet')
  }

  async signOut() {
    this.clearDemoUser()
  }

  async getUser() {
    return this.getDemoUser()
  }
}