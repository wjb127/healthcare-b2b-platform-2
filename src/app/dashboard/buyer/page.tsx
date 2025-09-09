'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DemoSession } from '@/lib/demo/session'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, FileText, Bell, TrendingUp, Calendar, MapPin, DollarSign } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Database } from '@/lib/database.types'
import type { DemoUser } from '@/lib/demo/session'

type Project = Database['public']['Tables']['projects']['Row']
// type Bid = Database['public']['Tables']['bids']['Row'] - unused

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
      // Check demo user
      const demoUser = DemoSession.getDemoUser()
      if (!demoUser || demoUser.role !== 'buyer') {
        router.push('/demo')
        return
      }
      
      setUser(demoUser)
      
      // Fetch projects
      const supabase = createClient()
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', demoUser.id)
        .order('created_at', { ascending: false })
      
      if (projectsData) {
        setProjects(projectsData as Project[])
        
        // Calculate stats
        const activeCount = projectsData.filter((p: Project) => p.status === 'open').length
        setStats({
          totalProjects: projectsData.length,
          activeProjects: activeCount,
          totalBids: 0, // Will be fetched separately
          avgBidsPerProject: 0,
        })
        
        // Fetch bid counts
        const { data: bidsData } = await supabase
          .from('bids')
          .select('project_id')
          .in('project_id', projectsData.map((p: Project) => p.id))
        
        if (bidsData) {
          setStats(prev => ({
            ...prev,
            totalBids: bidsData.length,
            avgBidsPerProject: projectsData.length > 0 
              ? Math.round(bidsData.length / projectsData.length * 10) / 10 
              : 0,
          }))
        }
      }
      
      setLoading(false)
    }
    
    initDashboard()
  }, [router])

  const getStatusBadge = (status: string) => {
    const statusStyles = {
      open: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
      awarded: 'bg-blue-100 text-blue-800',
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status as keyof typeof statusStyles]}`}>
        {status === 'open' ? '진행중' : status === 'closed' ? '마감' : '낙찰완료'}
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
              <button className="relative p-2 text-gray-400 hover:text-gray-500 notification-bell">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
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
                      <p className="text-3xl font-bold text-teal-600">0</p>
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