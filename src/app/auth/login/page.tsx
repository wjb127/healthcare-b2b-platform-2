'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, AlertCircle, Building2, ShoppingCart } from 'lucide-react'
import { useSupabase } from '@/hooks/useSupabase'
import Link from 'next/link'

export default function LoginPage() {
  const router = useRouter()
  const { auth, isConfigured } = useSupabase()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer')
  
  // Sign in form state
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 실제 Supabase 로그인 시도
      try {
        const result = await auth.signIn(signInEmail, signInPassword)
        if (result) {
          localStorage.setItem('auth_mode', 'production')
          localStorage.setItem('user_role', role)
          localStorage.setItem('user_email', signInEmail)
          router.push(`/dashboard/${role}`)
        }
      } catch (supabaseError: any) {
        // Supabase 로그인 실패 시 테스트 계정 확인
        const testAccounts = {
          buyer: { email: 'buyer@demo.com', password: 'demo1234' },
          supplier: { email: 'supplier@demo.com', password: 'demo1234' }
        }
        
        if (signInEmail === testAccounts[role].email && 
            signInPassword === testAccounts[role].password) {
          localStorage.setItem('auth_mode', 'production')
          localStorage.setItem('user_role', role)
          localStorage.setItem('user_email', signInEmail)
          router.push(`/dashboard/${role}`)
        } else {
          setError(supabaseError.message || '로그인에 실패했습니다. 테스트 계정: ' + testAccounts[role].email)
        }
      }
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  const fillTestAccount = () => {
    const testAccounts = {
      buyer: { email: 'buyer@demo.com', password: 'demo1234' },
      supplier: { email: 'supplier@demo.com', password: 'demo1234' }
    }
    setSignInEmail(testAccounts[role].email)
    setSignInPassword(testAccounts[role].password)
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <AlertCircle className="h-4 w-4 mr-2" />
            메인으로
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            로그인
          </h1>
          <p className="text-gray-600">
            실사용 모드 로그인
          </p>
        </div>

        <Card className="p-8">
          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setRole('buyer')}
              className={`p-3 rounded-lg border-2 transition-all ${
                role === 'buyer' 
                  ? 'border-teal-500 bg-teal-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Building2 className={`h-6 w-6 mx-auto mb-1 ${
                role === 'buyer' ? 'text-teal-600' : 'text-gray-400'
              }`} />
              <div className={`text-sm font-medium ${
                role === 'buyer' ? 'text-teal-900' : 'text-gray-600'
              }`}>
                구매자
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('supplier')}
              className={`p-3 rounded-lg border-2 transition-all ${
                role === 'supplier' 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <ShoppingCart className={`h-6 w-6 mx-auto mb-1 ${
                role === 'supplier' ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className={`text-sm font-medium ${
                role === 'supplier' ? 'text-blue-900' : 'text-gray-600'
              }`}>
                공급자
              </div>
            </button>
          </div>

          <form onSubmit={handleSignIn}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">이메일</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={signInEmail}
                  onChange={(e) => setSignInEmail(e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="password">비밀번호</Label>
                <Input
                  id="password"
                  type="password"
                  value={signInPassword}
                  onChange={(e) => setSignInPassword(e.target.value)}
                  required
                />
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    로그인 중...
                  </>
                ) : (
                  '로그인'
                )}
              </Button>

              <button
                type="button"
                onClick={fillTestAccount}
                className="w-full p-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
              >
                🔑 테스트 계정 자동입력
              </button>
            </div>
          </form>

          <div className="mt-6 text-center space-y-2">
            <p className="text-sm text-gray-600">
              계정이 없으신가요?{' '}
              <Link href="/auth/signup" className="text-teal-600 hover:text-teal-700 font-medium">
                회원가입
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              또는{' '}
              <Link href="/demo" className="text-teal-600 hover:text-teal-700 font-medium">
                데모 모드로 체험
              </Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}