'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Building2, ShoppingCart, Loader2 } from 'lucide-react'
// Remove unused imports for now

export default function DemoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState<'buyer' | 'supplier' | null>(null)

  const handleRoleSelect = async (role: 'buyer' | 'supplier') => {
    setLoading(role)
    
    try {
      // Create demo user in localStorage
      const demoUser = {
        id: `demo-${role}-${Date.now()}`,
        email: `demo.${role}@healthcare.com`,
        user_metadata: {
          role: role,
          company_name: role === 'buyer' ? '서울대학교병원' : '메디텍 코리아',
          name: role === 'buyer' ? '김구매' : '이공급'
        }
      }
      
      // Store demo user in localStorage
      localStorage.setItem('demo_user', JSON.stringify(demoUser))
      localStorage.setItem('demo_role', role)
      
      // Generate sample data in localStorage
      const sampleProjects = role === 'buyer' ? [
        {
          id: 'e2e4f063-d38b-4148-a15a-774b83ce74d0',
          title: 'MRI 장비 구매',
          category: 'medical_equipment',
          budget: 5000000000,
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          bids_count: 3
        },
        {
          id: 'f3e5g074-e49c-5259-b26b-885c94df85e1',
          title: '병원 정보시스템 구축',
          category: 'software',
          budget: 2000000000,
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          bids_count: 5
        }
      ] : []
      
      localStorage.setItem('demo_projects', JSON.stringify(sampleProjects))
      
      // Add a small delay for UX
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Redirect to appropriate dashboard
      router.push(`/dashboard/${role}`)
    } catch (error) {
      console.error('Error starting demo:', error)
      setLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl w-full"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            헬스케어 B2B 플랫폼 데모
          </h1>
          <p className="text-lg text-gray-600">
            로그인 없이 바로 체험해보세요. 역할을 선택하면 즉시 시작됩니다.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Buyer Card */}
          <Card className="p-6 hover:shadow-xl transition-shadow duration-300 border-2 hover:border-teal-500">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-10 h-10 text-teal-600" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900">
                구매자 (Buyer)
              </h2>
              
              <p className="text-gray-600">
                병원 · 의료기관 담당자
              </p>
              
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li>• 프로젝트 등록 및 관리</li>
                <li>• 공급사 응찰 비교 분석</li>
                <li>• 가중치 기반 평가</li>
                <li>• Excel 다운로드</li>
              </ul>
              
              <Button
                onClick={() => handleRoleSelect('buyer')}
                disabled={loading !== null}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white"
              >
                {loading === 'buyer' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    데모 준비 중...
                  </>
                ) : (
                  '구매자로 시작하기'
                )}
              </Button>
            </div>
          </Card>

          {/* Supplier Card */}
          <Card className="p-6 hover:shadow-xl transition-shadow duration-300 border-2 hover:border-blue-500">
            <div className="text-center space-y-4">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <ShoppingCart className="w-10 h-10 text-blue-600" />
              </div>
              
              <h2 className="text-2xl font-semibold text-gray-900">
                공급자 (Supplier)
              </h2>
              
              <p className="text-gray-600">
                의료기기 · 서비스 공급사
              </p>
              
              <ul className="text-sm text-gray-500 space-y-2 text-left">
                <li>• 프로젝트 탐색 및 검색</li>
                <li>• 견적서 제출</li>
                <li>• 응찰 현황 관리</li>
                <li>• 실시간 알림</li>
              </ul>
              
              <Button
                onClick={() => handleRoleSelect('supplier')}
                disabled={loading !== null}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              >
                {loading === 'supplier' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    데모 준비 중...
                  </>
                ) : (
                  '공급자로 시작하기'
                )}
              </Button>
            </div>
          </Card>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
        >
          <p className="text-sm text-yellow-800 text-center">
            💡 <strong>데모 모드:</strong> 모든 데이터는 테스트용이며, 24시간 후 자동 초기화됩니다.
            언제든지 역할을 전환하여 다른 관점에서 체험할 수 있습니다.
          </p>
        </motion.div>
      </motion.div>
    </div>
  )
}