'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DemoSession } from '@/lib/demo/session'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Bell, Calendar, MapPin, DollarSign, Clock, TrendingUp, FileText, Award } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Database } from '@/lib/database.types'
import type { DemoUser } from '@/lib/demo/session'

type Project = Database['public']['Tables']['projects']['Row'] & {
  user?: { company_name: string }
  _count?: { bids: number }
}
type Bid = Database['public']['Tables']['bids']['Row']

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
      // Check demo user
      const demoUser = DemoSession.getDemoUser()
      if (!demoUser || demoUser.role !== 'supplier') {
        router.push('/demo')
        return
      }
      
      setUser(demoUser)
      
      const supabase = createClient()
      
      // Fetch all open projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select(`
          *,
          user:users(company_name)
        `)
        .eq('status', 'open')
        .order('created_at', { ascending: false })
      
      if (projectsData) {
        setProjects(projectsData as Project[])
        
        // Fetch my bids
        const { data: bidsData } = await supabase
          .from('bids')
          .select('*')
          .eq('supplier_id', demoUser.id)
        
        if (bidsData) {
          setMyBids(bidsData)
          
          const wonCount = bidsData.filter(b => b.status === 'accepted').length
          
          setStats({
            totalProjects: projectsData.length,
            myBids: bidsData.length,
            wonBids: wonCount,
            avgCompetition: 3.2, // Mock average
          })
        }
      }
      
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
              <button className="relative p-2 text-gray-400 hover:text-gray-500 notification-bell">
                <Bell className="h-6 w-6" />
                <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <Button
                onClick={() => router.push('/dashboard/supplier/bids')}
                variant="outline"
              >
                내 응찰
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