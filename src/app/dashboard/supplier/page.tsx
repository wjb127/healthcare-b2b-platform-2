'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// Remove Supabase imports for demo mode
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bell, Calendar, MapPin, DollarSign, Clock, TrendingUp, FileText, Award } from 'lucide-react'
import { motion } from 'framer-motion'
type DemoUser = {
  id: string
  email: string
  role: 'buyer' | 'supplier'
  company_name: string
  contact_name: string
}

type Project = {
  id: string
  title: string
  category: string
  budget: number
  budget_range?: string
  deadline: string
  status: string
  bids_count: number
  requirements?: string
  region?: string
  created_at: string
  user?: { company_name: string }
}

type Bid = {
  id: string
  project_id: string
  supplier_id: string
  status: string
}

export default function SupplierDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<DemoUser | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [myBids, setMyBids] = useState<Bid[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    myBids: 0,
    wonBids: 0,
    avgCompetition: 0,
  })
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'bidded' | 'new'>('all')

  useEffect(() => {
    const initDashboard = async () => {
      // Check demo user from localStorage
      const demoUserStr = localStorage.getItem('demo_user')
      const demoRole = localStorage.getItem('demo_role')
      
      if (!demoUserStr || demoRole !== 'supplier') {
        router.push('/demo')
        return
      }
      
      const demoUser = JSON.parse(demoUserStr)
      setUser({
        id: demoUser.id,
        email: demoUser.email,
        role: demoUser.user_metadata.role,
        company_name: demoUser.user_metadata.company_name,
        contact_name: demoUser.user_metadata.name
      })
      
      // Create sample projects for supplier to see
      const sampleProjects: Project[] = [
        {
          id: 'e2e4f063-d38b-4148-a15a-774b83ce74d0',
          title: 'MRI 장비 구매',
          category: 'medical_equipment',
          budget: 5000000000,
          budget_range: '50억원 이상',
          deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          bids_count: 3,
          requirements: '최신 3T MRI 장비 도입을 계획하고 있습니다. 기술 지원 및 유지보수 포함.',
          region: '서울',
          created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          user: { company_name: '서울대학교병원' }
        },
        {
          id: 'f3e5g074-e49c-5259-b26b-885c94df85e1',
          title: '병원 정보시스템 구축',
          category: 'software',
          budget: 2000000000,
          budget_range: '20억원 이상',
          deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          bids_count: 5,
          requirements: 'EMR/PACS 통합 시스템 구축. 클라우드 기반 솔루션 선호.',
          region: '경기도',
          created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          user: { company_name: '분당서울대학교병원' }
        },
        {
          id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
          title: '의료용 로봇 시스템',
          category: 'robotics',
          budget: 8000000000,
          budget_range: '80억원 이상',
          deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'active',
          bids_count: 2,
          requirements: '수술용 로봇 시스템 도입. 다빈치 시스템 또는 동급 제품.',
          region: '인천',
          created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          user: { company_name: '연세대학교 세브란스병원' }
        }
      ]
      
      setProjects(sampleProjects)
      
      // Mock bids data
      const mockBids: Bid[] = [
        {
          id: 'bid-1',
          project_id: 'e2e4f063-d38b-4148-a15a-774b83ce74d0',
          supplier_id: demoUser.id,
          status: 'pending'
        }
      ]
      
      setMyBids(mockBids)
      
      setStats({
        totalProjects: sampleProjects.length,
        myBids: mockBids.length,
        wonBids: 0,
        avgCompetition: 3.2,
      })
      
      setLoading(false)
    }
    
    initDashboard()
  }, [router])

  const filteredProjects = projects.filter(project => {
    if (filter === 'bidded') {
      return myBids.some(bid => bid.project_id === project.id)
    }
    if (filter === 'new') {
      const threeDaysAgo = new Date()
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
      return new Date(project.created_at) > threeDaysAgo
    }
    return true
  })

  const hasBidded = (projectId: string) => {
    return myBids.some(bid => bid.project_id === projectId)
  }

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return null
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">공급자 대시보드</h1>
              <p className="text-sm text-gray-500">{user?.company_name} | {user?.contact_name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <button className="relative p-2 text-gray-400 cursor-not-allowed notification-bell">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-gray-300 rounded-full"></span>
                </button>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                  알림 기능 준비 중
                </span>
              </div>
              <Button
                variant="outline"
                className="border-gray-300 text-gray-400 cursor-not-allowed"
                disabled
                title="준비 중"
              >
                내 응찰 관리
              </Button>
              <Button
                onClick={() => router.push('/demo')}
                variant="outline"
              >
                역할 전환
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">활성 프로젝트</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">내 응찰</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.myBids}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">낙찰 성공</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.wonBids}</p>
                </div>
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">평균 경쟁률</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgCompetition}:1</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            onClick={() => setFilter('all')}
          >
            전체 프로젝트
          </Button>
          <Button
            variant={filter === 'new' ? 'default' : 'outline'}
            onClick={() => setFilter('new')}
          >
            신규 프로젝트
          </Button>
          <Button
            variant={filter === 'bidded' ? 'default' : 'outline'}
            onClick={() => setFilter('bidded')}
          >
            응찰한 프로젝트
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid gap-6">
          {filteredProjects.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                표시할 프로젝트가 없습니다
              </h3>
              <p className="text-gray-500">
                새로운 프로젝트가 등록되면 여기에 표시됩니다.
              </p>
            </Card>
          ) : (
            filteredProjects.map((project, index) => {
              const daysRemaining = getDaysRemaining(project.deadline)
              const bidded = hasBidded(project.id)
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card 
                    className={`p-6 hover:shadow-lg transition-shadow cursor-pointer project-card ${
                      bidded ? 'border-l-4 border-l-blue-500' : ''
                    }`}
                    onClick={() => router.push(`/dashboard/supplier/projects/${project.id}`)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {project.title}
                          </h3>
                          {bidded && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                              응찰완료
                            </span>
                          )}
                          {daysRemaining !== null && daysRemaining <= 3 && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                              마감임박
                            </span>
                          )}
                        </div>
                        
                        <div className="text-sm text-gray-500 mb-1">
                          {project.user?.company_name || '알 수 없음'}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {project.region || '미지정'}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {project.deadline ? new Date(project.deadline).toLocaleDateString() : '미지정'}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {project.budget_range || '미지정'}
                          </span>
                        </div>
                        
                        <p className="text-gray-600 line-clamp-2">
                          {project.requirements || '요구사항 없음'}
                        </p>
                      </div>
                      
                      <div className="ml-6 text-center">
                        {daysRemaining !== null ? (
                          <>
                            <p className="text-3xl font-bold text-blue-600">
                              {daysRemaining}
                            </p>
                            <p className="text-sm text-gray-500">일 남음</p>
                          </>
                        ) : (
                          <Clock className="h-8 w-8 text-gray-400" />
                        )}
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        카테고리: {project.category || '미분류'}
                      </span>
                      <Button
                        size="sm"
                        className={bidded ? 'bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'}
                        onClick={(e) => {
                          e.stopPropagation()
                          router.push(`/dashboard/supplier/projects/${project.id}`)
                        }}
                      >
                        {bidded ? '응찰 수정' : '응찰하기'}
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}