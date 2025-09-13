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
  const [selectedSupplier, setSelectedSupplier] = useState<1 | 2>(1)
  
  // Sign in form state
  const [signInEmail, setSignInEmail] = useState('')
  const [signInPassword, setSignInPassword] = useState('')

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 테스트 계정 먼저 확인
      const testAccounts = {
        buyer: { email: 'buyer@demo.com', password: 'demo1234' },
        supplier1: { email: 'supplier@demo.com', password: 'demo1234' },
        supplier2: { email: 'supplier2@demo.com', password: 'demo1234' }
      }
      
      const isTestAccount = (
        (signInEmail === testAccounts.buyer.email && signInPassword === testAccounts.buyer.password && role === 'buyer') ||
        (signInEmail === testAccounts.supplier1.email && signInPassword === testAccounts.supplier1.password && role === 'supplier') ||
        (signInEmail === testAccounts.supplier2.email && signInPassword === testAccounts.supplier2.password && role === 'supplier')
      )
      
      if (isTestAccount) {
        // 테스트 계정으로 로그인
        localStorage.setItem('auth_mode', 'demo')
        localStorage.setItem('demo_role', role)
        localStorage.setItem('user_role', role)
        localStorage.setItem('user_email', signInEmail)
        
        // 테스트 계정용 데모 사용자 생성
        let companyName = '테스트병원'
        let contactName = '김구매'
        
        if (role === 'supplier') {
          if (signInEmail === 'supplier2@demo.com') {
            companyName = '바이오메드(주)'
            contactName = '박공급'
          } else {
            companyName = '메디칼솔루션(주)'
            contactName = '이공급'
          }
        }
        
        const demoUser = {
          id: `demo-${role}-${Date.now()}`,
          email: signInEmail,
          role: role,
          company_name: companyName,
          contact_name: contactName
        }
        localStorage.setItem('demo_user', JSON.stringify(demoUser))
        
        router.push(`/dashboard/${role}`)
        return
      }
      
      // 테스트 계정이 아니면 실제 Supabase 로그인 시도
      try {
        const result = await auth.signIn(signInEmail, signInPassword)
        if (result) {
          localStorage.setItem('auth_mode', 'production')
          localStorage.setItem('user_role', role)
          localStorage.setItem('user_email', signInEmail)
          router.push(`/dashboard/${role}`)
        }
      } catch (supabaseError: any) {
        setError(supabaseError.message || '로그인에 실패했습니다.')
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
      supplier1: { email: 'supplier@demo.com', password: 'demo1234' },
      supplier2: { email: 'supplier2@demo.com', password: 'demo1234' }
    }
    
    if (role === 'buyer') {
      setSignInEmail(testAccounts.buyer.email)
      setSignInPassword(testAccounts.buyer.password)
    } else {
      const supplierAccount = selectedSupplier === 1 ? testAccounts.supplier1 : testAccounts.supplier2
      setSignInEmail(supplierAccount.email)
      setSignInPassword(supplierAccount.password)
    }
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
          {/* Test Account Notice */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-xs text-yellow-800">
              💡 테스트 계정이 자동으로 입력됩니다. 역할 선택 후 바로 로그인하세요.
            </p>
          </div>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => {
                setRole('buyer')
                setSignInEmail('buyer@demo.com')
                setSignInPassword('demo1234')
              }}
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
              onClick={() => {
                setRole('supplier')
                // Don't fill yet - wait for supplier selection
                setSignInEmail('')
                setSignInPassword('')
              }}
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

          {/* Supplier Selection - Only show when supplier role is selected */}
          {role === 'supplier' && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm font-medium text-blue-900 mb-3">테스트 계정 선택</p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSupplier(1)
                    setSignInEmail('supplier@demo.com')
                    setSignInPassword('demo1234')
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedSupplier === 1
                      ? 'border-blue-500 bg-white'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    selectedSupplier === 1 ? 'text-blue-900' : 'text-gray-600'
                  }`}>
                    테스트 계정 1
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    메디칼솔루션(주)
                  </div>
                  <div className="text-xs text-gray-400">
                    supplier@demo.com
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setSelectedSupplier(2)
                    setSignInEmail('supplier2@demo.com')
                    setSignInPassword('demo1234')
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedSupplier === 2
                      ? 'border-blue-500 bg-white'
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className={`text-sm font-medium ${
                    selectedSupplier === 2 ? 'text-blue-900' : 'text-gray-600'
                  }`}>
                    테스트 계정 2
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    바이오메드(주)
                  </div>
                  <div className="text-xs text-gray-400">
                    supplier2@demo.com
                  </div>
                </button>
              </div>
            </div>
          )}

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