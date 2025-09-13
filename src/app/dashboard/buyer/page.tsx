'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, FileText, Bell, TrendingUp, Calendar, MapPin, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSupabase } from '@/hooks/useSupabase'

type Project = {
  id: string
  title: string
  category: string | null
  budget_range: string | null
  deadline: string | null
  status: string | null
  requirements: string | null
  region: string | null
  created_at: string
  updated_at: string
  user_id: string | null
  bids?: any[]
}

export default function BuyerDashboard() {
  const router = useRouter()
  const { auth, projects: projectsService, isConfigured, isDemo } = useSupabase()
  const [user, setUser] = useState<any>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalBids: 0,
    avgBidsPerProject: 0,
  })
  const [loading, setLoading] = useState(true)
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return // Prevent re-runs
    
    const initDashboard = async () => {
      try {
        // Check auth mode
        const authMode = localStorage.getItem('auth_mode') // 'demo' or 'production'
        const isDemoMode = authMode === 'demo' || !authMode
        const demoRole = localStorage.getItem('demo_role')
        const userRole = localStorage.getItem('user_role')
        
        // Handle demo mode
        if (isDemoMode) {
          const demoUser = auth.getUser()
          if (!demoUser || demoRole !== 'buyer') {
            router.push('/demo')
            return
          }
          setUser(demoUser)
        } 
        // Handle production mode
        else if (authMode === 'production') {
          if (userRole !== 'buyer') {
            router.push('/auth/login')
            return
          }
          // Get real user data from Supabase
          const userData = await auth.getProfile()
          if (!userData) {
            router.push('/auth/login')
            return
          }
          setUser(userData)
        }
        
        // Fetch projects based on mode
        let projectsData: Project[] = []
        
        if (isDemoMode) {
          // Use localStorage for demo mode
          const projectsStr = localStorage.getItem('demo_projects')
          projectsData = projectsStr ? JSON.parse(projectsStr) : []
        } else {
          // For production mode, use localStorage for now
          // Since Supabase is not fully configured yet
          const projectsStr = localStorage.getItem('demo_projects')
          projectsData = projectsStr ? JSON.parse(projectsStr) : []
        }
        
        // Get bids and calculate bid counts
        // Always use localStorage for now since Supabase is not fully configured
        const bidsStr = localStorage.getItem('demo_bids')
        const allBids = bidsStr ? JSON.parse(bidsStr) : []
        
        // Count bids per project
        const bidsPerProject: Record<string, number> = {}
        allBids.forEach((bid: any) => {
          bidsPerProject[bid.project_id] = (bidsPerProject[bid.project_id] || 0) + 1
        })
        
        // Update projects with bid counts
        projectsData = projectsData.map(project => ({
          ...project,
          bids_count: bidsPerProject[project.id] || 0
        }))
        
        setProjects(projectsData)
        
        // Calculate stats
        const activeCount = projectsData.filter((p: Project) => p.status === 'open' || p.status === 'active').length
        const totalBids = allBids.length
        
        setStats({
          totalProjects: projectsData.length,
          activeProjects: activeCount,
          totalBids: totalBids,
          avgBidsPerProject: projectsData.length > 0 
            ? Math.round(totalBids / projectsData.length * 10) / 10 
            : 0,
        })
      } catch (error) {
        console.error('Error initializing dashboard:', error)
      } finally {
        setLoading(false)
        setInitialized(true) // Mark as initialized
      }
    }
    
    initDashboard()
  }, [initialized, router, auth])

  const getStatusBadge = (status: string | null) => {
    const statusStyles = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      awarded: 'bg-blue-100 text-blue-800',
    }
    
    const displayStatus = status || 'open'
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[displayStatus as keyof typeof statusStyles] || statusStyles.open}`}>
        {displayStatus === 'open' ? '진행중' : displayStatus === 'closed' ? '마감' : '낙찰완료'}
      </span>
    )
  }

  const formatCurrency = (amount: number | string | null) => {
    if (!amount) return '미정'
    const num = typeof amount === 'string' ? parseInt(amount) : amount
    return new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      maximumFractionDigits: 0,
    }).format(num)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">대시보드 로딩 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with subtle medical background */}
      <header className="relative bg-white shadow-sm border-b">
        <div className="absolute inset-0 opacity-5">
          <Image
            src="/images/u8164484915_Minimal_hospital_lobby_architecture_terrazzo_floo_6ddbfd37-47c0-451c-afa9-26a04da3913f_3.png"
            alt="Hospital Background"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                {user?.company_name || '구매자'} 대시보드
              </h1>
              <span className="ml-3 px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full">
                구매자
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative group">
                <button 
                  className="relative p-2 text-gray-400 cursor-not-allowed notification-bell"
                  disabled
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-gray-300 rounded-full"></span>
                </button>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  알림 기능 준비 중
                </span>
              </div>
              
              <Button
                variant="outline"
                onClick={() => {
                  auth.signOut()
                  router.push('/demo')
                }}
              >
                로그아웃
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with Medical Image */}
        <div className="relative mb-8 rounded-xl overflow-hidden shadow-lg">
          <div className="relative h-48">
            <Image
              src="/images/u8164484915_CT_scanner_room_cool_white_with_teal_accents_blin_05f4b4a8-276c-43c9-95b9-c23fc03fa154_0.png"
              alt="Medical Equipment"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/80 to-blue-600/80" />
            <div className="absolute inset-0 flex items-center justify-center text-white">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-2">의료장비 구매 플랫폼</h2>
                <p className="text-lg">투명하고 효율적인 비딩 시스템</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">전체 프로젝트</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalProjects}</p>
                </div>
                <FileText className="h-10 w-10 text-teal-600 opacity-50" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">진행중 프로젝트</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.activeProjects}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-green-600 opacity-50" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">총 입찰 수</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalBids}</p>
                </div>
                <FileText className="h-10 w-10 text-blue-600 opacity-50" />
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">평균 입찰</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stats.avgBidsPerProject}</p>
                </div>
                <TrendingUp className="h-10 w-10 text-purple-600 opacity-50" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Projects Section */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">내 프로젝트</h2>
            <Button 
              onClick={() => router.push('/dashboard/buyer/projects/new')}
              className="bg-teal-600 hover:bg-teal-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              새 프로젝트
            </Button>
          </div>
          
          <div className="divide-y">
            {projects.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium">프로젝트가 없습니다</p>
                <p className="mt-2">새 프로젝트를 생성하여 입찰을 시작하세요</p>
              </div>
            ) : (
              projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => router.push(`/dashboard/buyer/projects/${project.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{project.title}</h3>
                        {getStatusBadge(project.status)}
                      </div>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                        {project.category && (
                          <span className="flex items-center">
                            <FileText className="h-4 w-4 mr-1" />
                            {project.category}
                          </span>
                        )}
                        {project.budget_range && (
                          <span className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {project.budget_range}
                          </span>
                        )}
                        {project.deadline && (
                          <span className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(project.deadline).toLocaleDateString('ko-KR')}
                          </span>
                        )}
                        {project.region && (
                          <span className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {project.region}
                          </span>
                        )}
                      </div>
                      
                      {project.requirements && (
                        <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                          {project.requirements}
                        </p>
                      )}
                    </div>
                    
                    <div className="ml-6 text-right">
                      <p className="text-2xl font-bold text-teal-600">
                        {project.bids?.length || 0}
                      </p>
                      <p className="text-sm text-gray-500">입찰</p>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}