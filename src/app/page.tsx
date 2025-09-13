'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  Brain,
  Play,
  LogIn
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
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[700px] overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/images/u8164484915_Healthcare_B2B_platform_landing_hero_isometric_3D_555f6a17-10cc-4ffc-aab0-62c9520424ad_1.png"
            alt="Healthcare B2B Platform 3D Visualization"
            fill
            className="object-cover opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-white/80 to-white/95" />
        </div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              의료기관과 공급업체를 잇는
              <span className="text-teal-600 block mt-2">스마트 B2B 플랫폼</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto">
              투명한 비딩 시스템과 실시간 비교 분석으로 
              최적의 의료 장비와 서비스를 만나보세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-teal-600 hover:bg-teal-700 text-white px-10 py-7 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                onClick={() => router.push('/demo')}
              >
                <Play className="mr-2 h-5 w-5" />
                데모 체험하기
              </Button>
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-7 text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                onClick={() => router.push('/auth/login')}
              >
                <LogIn className="mr-2 h-5 w-5" />
                실사용 시작하기
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-10 py-7 text-lg border-2 bg-white/80 backdrop-blur-sm border-slate-300 text-slate-400 cursor-not-allowed"
                disabled
                title="준비 중"
              >
                가격 안내 (준비 중)
              </Button>
            </div>
            <div className="flex flex-col items-center gap-2 mt-8">
              <div className="flex items-center gap-4 text-sm text-gray-600 font-medium">
                <span className="flex items-center gap-1">
                  <Play className="h-4 w-4" />
                  데모: 로컬 저장
                </span>
                <span className="text-gray-400">|</span>
                <span className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  실사용: Supabase DB
                </span>
              </div>
              <Badge variant="outline" className="bg-yellow-50/90 backdrop-blur-sm text-yellow-700 border-yellow-300">
                Beta Version 1.0
              </Badge>
            </div>
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

      {/* Visual Section with CT Scanner */}
      <section className="py-20 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -20 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="relative h-[400px] w-full rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/u8164484915_CT_scanner_room_cool_white_with_teal_accents_blin_05f4b4a8-276c-43c9-95b9-c23fc03fa154_0.png"
                  alt="최첨단 의료장비"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-teal-600 text-white p-6 rounded-xl shadow-lg">
                <div className="text-3xl font-bold">2,500+</div>
                <div className="text-sm">등록된 의료장비</div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : 20 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                최첨단 의료장비를
                <span className="text-teal-600 block">합리적인 가격으로</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                CT, MRI, 초음파 장비부터 수술 로봇까지,
                모든 의료장비를 한 곳에서 비교하고 구매하세요.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">실시간 견적 비교</div>
                    <div className="text-gray-600">여러 공급업체의 견적을 한눈에 비교 분석</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">품질 보증</div>
                    <div className="text-gray-600">검증된 공급업체와 정품 인증 장비만 취급</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold text-gray-900">A/S 보장</div>
                    <div className="text-gray-600">체계적인 사후 관리 시스템으로 안심 운영</div>
                  </div>
                </div>
              </div>
            </motion.div>
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

      {/* CTA Section with Surgical Robot Image */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600 to-blue-600" />
        <div className="absolute right-0 top-0 w-1/3 h-full opacity-30">
          <Image
            src="/images/u8164484915_Surgical_robot_arms_close-up_brushed_metal_teal_s_d30308fe-9b7f-46d2-b738-3664c7474dc2_2.png"
            alt="Surgical Robot Technology"
            fill
            className="object-cover"
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              미래 의료의 시작,
              <span className="block mt-2">지금 경험해보세요</span>
            </h2>
            <p className="text-xl text-white/90 mb-8">
              AI 기반 매칭과 스마트 비딩으로 의료 구매의 혁신을 경험하세요
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-6 text-lg"
                onClick={() => router.push('/demo')}
              >
                데모 시작하기
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/50 text-white/50 px-8 py-6 text-lg cursor-not-allowed"
                disabled
                title="준비 중"
              >
                영업팀 문의 (준비 중)
              </Button>
            </div>
            <div className="mt-8 flex items-center justify-center gap-8 text-white/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>데모 체험 가능</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>로컬 데이터 저장</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>실제 워크플로우 테스트</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Partners Section with Hospital Lobby Image */}
      <section className="py-20 relative">
        <div className="absolute inset-0">
          <Image
            src="/images/u8164484915_Minimal_hospital_lobby_architecture_terrazzo_floo_6ddbfd37-47c0-451c-afa9-26a04da3913f_3.png"
            alt="Modern Hospital Lobby"
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-white/95" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              대한민국 최고의 의료기관들이 선택한 플랫폼
            </h2>
            <p className="text-lg text-gray-600">
              500개 이상의 병원과 1,200개 이상의 공급업체가 함께합니다
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center shadow-lg">
              <div className="text-2xl font-bold text-gray-700">서울대학교병원</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center shadow-lg">
              <div className="text-2xl font-bold text-gray-700">삼성서울병원</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center shadow-lg">
              <div className="text-2xl font-bold text-gray-700">연세세브란스</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center shadow-lg">
              <div className="text-2xl font-bold text-gray-700">서울아산병원</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-6 text-center shadow-lg">
              <div className="text-2xl font-bold text-gray-700">가톨릭대병원</div>
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