'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { 
  ArrowRight, 
  Building2, 
  ShoppingCart, 
  TrendingUp, 
  Shield, 
  Zap, 
  Users,
  BarChart3,
  FileText,
  Bell,
  CheckCircle,
  Star,
  ChevronRight,
  Activity,
  Package,
  Stethoscope,
  Pill,
  Heart,
  Brain
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function HomePage() {
  const router = useRouter()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const features = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "스마트 비딩 시스템",
      description: "체계적인 프로젝트 등록과 응찰 관리로 투명한 거래 프로세스를 구현합니다."
    },
    {
      icon: <BarChart3 className="h-6 w-6" />,
      title: "실시간 비교 분석",
      description: "다중 응찰을 한눈에 비교하고 가중치 기반 평가로 최적의 파트너를 선택하세요."
    },
    {
      icon: <Bell className="h-6 w-6" />,
      title: "즉시 알림",
      description: "새로운 프로젝트와 응찰 현황을 실시간으로 알려드립니다."
    },
    {
      icon: <Shield className="h-6 w-6" />,
      title: "안전한 거래",
      description: "검증된 파트너사와 안전한 거래 환경을 제공합니다."
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "빠른 프로세스",
      description: "복잡한 구매 과정을 간소화하여 시간과 비용을 절약합니다."
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "파트너 네트워크",
      description: "신뢰할 수 있는 의료기기 공급업체 네트워크에 접근하세요."
    }
  ]

  const stats = [
    { value: "500+", label: "등록 병원" },
    { value: "1,200+", label: "공급업체" },
    { value: "₩2.5조", label: "누적 거래액" },
    { value: "98%", label: "만족도" }
  ]

  const testimonials = [
    {
      name: "김민수 구매팀장",
      company: "서울대학교병원",
      content: "복잡했던 의료기기 구매 과정이 훨씬 간단해졌습니다. 여러 공급업체의 제안을 한눈에 비교할 수 있어 효율적입니다.",
      rating: 5
    },
    {
      name: "이영희 대표",
      company: "메디텍 코리아",
      content: "새로운 비즈니스 기회를 쉽게 찾을 수 있고, 입찰 과정이 투명해서 신뢰할 수 있습니다.",
      rating: 5
    },
    {
      name: "박준호 원무과장",
      company: "삼성서울병원",
      content: "가중치 평가 시스템 덕분에 객관적인 의사결정이 가능해졌습니다. 시간도 크게 절약됩니다.",
      rating: 5
    }
  ]

  const categories = [
    { icon: <Stethoscope className="h-8 w-8" />, name: "진단장비", count: 245 },
    { icon: <Activity className="h-8 w-8" />, name: "수술장비", count: 189 },
    { icon: <Pill className="h-8 w-8" />, name: "의약품", count: 567 },
    { icon: <Package className="h-8 w-8" />, name: "의료소모품", count: 892 },
    { icon: <Heart className="h-8 w-8" />, name: "재활장비", count: 134 },
    { icon: <Brain className="h-8 w-8" />, name: "IT 솔루션", count: 78 }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-50 opacity-50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              의료기관과 공급업체를 잇는
              <span className="text-teal-600 block mt-2">스마트 B2B 플랫폼</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              투명한 비딩 시스템과 실시간 비교 분석으로 
              최적의 의료 장비와 서비스를 만나보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-6 text-lg"
                onClick={() => router.push('/demo')}
              >
                무료 체험하기
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-8 py-6 text-lg border-2"
                onClick={() => router.push('/demo')}
              >
                데모 보기
              </Button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              신용카드 없이 바로 시작 • 30일 무료 체험
            </p>
          </motion.div>

          {/* Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4"
          >
            {categories.map((category, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="text-teal-600 mb-2">{category.icon}</div>
                <div className="font-medium text-gray-900">{category.name}</div>
                <div className="text-sm text-gray-500">{category.count}개 제품</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-teal-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              왜 Healthcare B2B를 선택해야 할까요?
            </h2>
            <p className="text-lg text-gray-600">
              의료 산업에 특화된 기능으로 거래를 더욱 효율적으로 만들어드립니다
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-lg transition-shadow">
                  <div className="text-teal-600 mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              간단한 3단계로 시작하세요
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">회원 가입</h3>
              <p className="text-gray-600">
                구매자 또는 공급자로 간단히 가입하고 회사 정보를 등록하세요
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-center"
            >
              <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">프로젝트 등록/탐색</h3>
              <p className="text-gray-600">
                구매 요청을 등록하거나 관심있는 프로젝트를 찾아보세요
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-teal-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-teal-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">거래 성사</h3>
              <p className="text-gray-600">
                최적의 조건으로 거래를 성사시키고 안전하게 계약을 진행하세요
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              고객들의 성공 스토리
            </h2>
            <p className="text-lg text-gray-600">
              이미 많은 의료기관과 공급업체가 함께하고 있습니다
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">"{testimonial.content}"</p>
                  <div className="mt-auto">
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-500">{testimonial.company}</div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-white/90 mb-8">
              30일 무료 체험으로 Healthcare B2B의 모든 기능을 경험해보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => router.push('/demo')}
              >
                무료 체험 시작
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 px-8 py-6 text-lg"
                onClick={() => router.push('/demo')}
              >
                영업팀 문의
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>신용카드 불필요</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>언제든 취소 가능</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>24/7 고객 지원</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-lg font-semibold text-gray-600 mb-4">
              신뢰받는 파트너사
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">서울대학교병원</div>
              <div className="text-2xl font-bold text-gray-400">삼성서울병원</div>
              <div className="text-2xl font-bold text-gray-400">연세세브란스</div>
              <div className="text-2xl font-bold text-gray-400">서울아산병원</div>
              <div className="text-2xl font-bold text-gray-400">가톨릭대학교병원</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">Healthcare B2B</h3>
              <p className="text-gray-400">
                의료 산업의 디지털 혁신을 선도하는 B2B 플랫폼
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">제품</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">기능 소개</a></li>
                <li><a href="#" className="hover:text-white">가격 정책</a></li>
                <li><a href="#" className="hover:text-white">고객 사례</a></li>
                <li><a href="#" className="hover:text-white">업데이트</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">회사</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">회사 소개</a></li>
                <li><a href="#" className="hover:text-white">채용</a></li>
                <li><a href="#" className="hover:text-white">파트너십</a></li>
                <li><a href="#" className="hover:text-white">문의하기</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">지원</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">도움말 센터</a></li>
                <li><a href="#" className="hover:text-white">API 문서</a></li>
                <li><a href="#" className="hover:text-white">이용약관</a></li>
                <li><a href="#" className="hover:text-white">개인정보처리방침</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Healthcare B2B Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}