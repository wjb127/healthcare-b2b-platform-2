import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const { email, password, company_name, contact_name, role } = await request.json()

    // Supabase client 생성
    const supabase = createClient()

    // 1. Auth 회원가입
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/login`,
        data: {
          company_name,
          contact_name,
          role
        }
      }
    })

    if (authError) {
      return NextResponse.json(
        { message: authError.message },
        { status: 400 }
      )
    }

    // 2. Users 테이블에 프로필 생성
    if (authData.user) {
      const { error: profileError } = await supabase
        .from('users')
        .insert([
          {
            email,
            auth_id: authData.user.id,
            role,
            company_name,
            contact_name
            // is_demo와 is_verified 컬럼 제거 (테이블에 없음)
          }
        ])

      if (profileError) {
        console.error('Profile creation error:', profileError)
        // Auth 회원가입은 성공했으므로 계속 진행
      }
    }

    return NextResponse.json(
      { 
        message: '회원가입이 완료되었습니다.',
        user: authData.user 
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json(
      { message: '회원가입 중 오류가 발생했습니다.' },
      { status: 500 }
    )
  }
}