'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, UserPlus, Loader2, Building2, ShoppingCart } from 'lucide-react'
import { motion } from 'framer-motion'

export default function SignUpPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [role, setRole] = useState<'buyer' | 'supplier'>('buyer')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    company_name: '',
    contact_name: ''
  })

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Sign up failed')
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/auth/login')
      }, 3000)
    } catch (err: any) {
      setError(err.message || 'Error occurred during signup')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-white to-blue-50">
        <Card className="p-8 max-w-md w-full text-center">
          <div className="text-green-600 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">회원가입 완료!</h2>
          <p className="text-gray-600 mb-4">
            가입하신 이메일로 확인 메일이 발송되었습니다.
            <br />
            이메일 확인 후 로그인해주세요.
          </p>
          <p className="text-sm text-gray-500">
            3초 후 로그인 페이지로 이동합니다...
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0">
        <Image
          src="/images/u8164484915_Healthcare_B2B_platform_landing_hero_isometric_3D_555f6a17-10cc-4ffc-aab0-62c9520424ad_1.png"
          alt="Background"
          fill
          className="object-cover opacity-10"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50/90 via-white/95 to-blue-50/90" />
      </div>

      <div className="relative flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Simple Sign Up
            </h1>
            <p className="text-gray-600">
              Complete in 1 minute!
            </p>
          </div>

          <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl">
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
                  Buyer
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
                  Supplier
                </div>
              </button>
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="6+ characters"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="company_name">Company Name</Label>
                <Input
                  id="company_name"
                  type="text"
                  placeholder={role === 'buyer' ? 'Hospital Name' : 'Company Name'}
                  value={formData.company_name}
                  onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <Label htmlFor="contact_name">Contact Name</Label>
                <Input
                  id="contact_name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  required
                  disabled={loading}
                />
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className={`w-full ${
                  role === 'buyer' 
                    ? 'bg-teal-600 hover:bg-teal-700' 
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white`}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing up...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Sign Up
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">
                  Login
                </Link>
              </p>
            </div>
          </Card>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Or{' '}
              <Link href="/demo" className="text-teal-600 hover:text-teal-700 font-medium">
                Try Demo Mode
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}