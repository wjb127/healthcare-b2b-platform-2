'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
// Remove Supabase imports for demo mode
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, FileText, Bell, TrendingUp, Calendar, MapPin, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
type DemoUser = {
  id: string
  email: string
  user_metadata: {
    role: 'buyer' | 'supplier'
    company_name: string
    name: string
  }
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
  created_at?: string
}

export default function BuyerDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<DemoUser | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    totalBids: 0,
    avgBidsPerProject: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initDashboard = async () => {
      // Check demo user from localStorage
      const demoUserStr = localStorage.getItem('demo_user')
      const demoRole = localStorage.getItem('demo_role')
      
      if (!demoUserStr || demoRole !== 'buyer') {
        router.push('/demo')
        return
      }
      
      const demoUser = JSON.parse(demoUserStr)
      setUser({
        ...demoUser,
        role: demoUser.user_metadata.role,
        company_name: demoUser.user_metadata.company_name,
        contact_name: demoUser.user_metadata.name
      })
      
      // Fetch projects from localStorage
      const projectsStr = localStorage.getItem('demo_projects')
      const projectsData = projectsStr ? JSON.parse(projectsStr) : []
      
      setProjects(projectsData)
      
      // Calculate stats
      const activeCount = projectsData.filter((p: Project) => p.status === 'active').length
      const totalBids = projectsData.reduce((sum: number, p: Project) => sum + (p.bids_count || 0), 0)
      
      setStats({
        totalProjects: projectsData.length,
        activeProjects: activeCount,
        totalBids: totalBids,
        avgBidsPerProject: projectsData.length > 0 
          ? Math.round(totalBids / projectsData.length * 10) / 10 
          : 0,
      })
      
      setLoading(false)
    }
    
    initDashboard()
  }, [router])

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      open: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      awarded: 'bg-blue-100 text-blue-800',
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles] || statusStyles.active}`}>
        {status === 'active' || status === 'open' ? '진행중' : status === 'closed' ? '마감' : '낙찰완료'}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
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
              <h1 className="text-2xl font-bold text-gray-900">구매자 대시보드</h1>
              <p className="text-sm text-gray-500">{user?.company_name} | {user?.contact_name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative group">
                <button className="relative p-2 text-gray-400 cursor-not-allowed notification-bell">
                  <Bell className="h-6 w-6" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-gray-300 rounded-full"></span>
                </button>
                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  알림 기능 준비 중
                </span>
              </div>
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
                  <p className="text-sm text-gray-500">전체 프로젝트</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProjects}</p>
                </div>
                <FileText className="h-8 w-8 text-teal-600" />
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
                  <p className="text-sm text-gray-500">진행중</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeProjects}</p>
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
                  <p className="text-sm text-gray-500">총 응찰</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalBids}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-600" />
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
                  <p className="text-sm text-gray-500">평균 응찰</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.avgBidsPerProject}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">내 프로젝트</h2>
          <Button
            onClick={() => router.push('/dashboard/buyer/projects/new')}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            새 프로젝트
          </Button>
        </div>

        {/* Projects List */}
        <div className="grid gap-6">
          {projects.length === 0 ? (
            <Card className="p-12 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                아직 등록된 프로젝트가 없습니다
              </h3>
              <p className="text-gray-500 mb-4">
                새 프로젝트를 등록하여 공급사들의 응찰을 받아보세요.
              </p>
              <Button
                onClick={() => router.push('/dashboard/buyer/projects/new')}
                className="bg-teal-600 hover:bg-teal-700"
              >
                첫 프로젝트 등록하기
              </Button>
            </Card>
          ) : (
            projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card 
                  className="p-6 hover:shadow-lg transition-shadow cursor-pointer project-card"
                  onClick={() => router.push(`/dashboard/buyer/projects/${project.id}`)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {project.title}
                        </h3>
                        {getStatusBadge(project.status)}
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
                      <p className="text-3xl font-bold text-teal-600">{project.bids_count || 0}</p>
                      <p className="text-sm text-gray-500">응찰</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}