'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Calendar, MapPin, DollarSign, Download, Award, Clock, FileText } from 'lucide-react'
import { motion } from 'framer-motion'

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
}

type Bid = {
  id: string
  project_id: string
  supplier_id: string
  supplier_name?: string
  price: number
  delivery_days: number
  comment: string
  status: string
  created_at: string
  score?: number
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBid, setSelectedBid] = useState<string | null>(null)
  const [weights, setWeights] = useState({
    price: 40,
    delivery: 30,
    quality: 30,
  })

  useEffect(() => {
    const fetchProjectData = async () => {
      // Check demo user from localStorage
      const demoUserStr = localStorage.getItem('demo_user')
      const demoRole = localStorage.getItem('demo_role')
      
      if (!demoUserStr || demoRole !== 'buyer') {
        router.push('/demo')
        return
      }

      // Get projects from localStorage
      const projectsStr = localStorage.getItem('demo_projects')
      const projects = projectsStr ? JSON.parse(projectsStr) : []
      
      // Find the specific project
      const projectData = projects.find((p: Project) => p.id === projectId)
      
      if (!projectData) {
        router.push('/dashboard/buyer')
        return
      }

      setProject(projectData)

      // Get bids for this project
      const bidsStr = localStorage.getItem('demo_bids')
      const allBids = bidsStr ? JSON.parse(bidsStr) : []
      const projectBids = allBids.filter((b: Bid) => b.project_id === projectId)
      
      // Add supplier names and calculate scores
      const bidsWithDetails = projectBids.map((bid: Bid) => {
        // Try to get supplier name from their demo user data
        let supplierName = '공급사'
        
        // Get all demo users to find supplier name
        const suppliersData = [
          { id: bid.supplier_id, company_name: '메디칼솔루션(주)' },
          { id: bid.supplier_id, company_name: '헬스케어테크(주)' },
          { id: bid.supplier_id, company_name: '바이오메드(주)' }
        ]
        
        // Use a default name pattern or actual company name if available
        const supplierIndex = allBids.findIndex((b: Bid) => b.id === bid.id)
        supplierName = supplierIndex < 3 
          ? ['메디칼솔루션(주)', '헬스케어테크(주)', '바이오메드(주)'][supplierIndex] || `공급사 ${supplierIndex + 1}`
          : `공급사 ${supplierIndex + 1}`
        
        return {
          ...bid,
          supplier_name: supplierName,
          score: calculateScore(bid),
        }
      })
      
      setBids(bidsWithDetails)
      setLoading(false)
    }

    const calculateScore = (bid: Bid) => {
      // Simple scoring algorithm
      const priceScore = Math.max(0, 100 - (bid.price / 100000000) * 2)
      const deliveryScore = Math.max(0, 100 - bid.delivery_days * 0.5)
      const qualityScore = 75 + Math.random() * 25 // Random quality score for demo
      
      return Math.round(
        (priceScore * weights.price + deliveryScore * weights.delivery + qualityScore * weights.quality) / 100
      )
    }

    fetchProjectData()
  }, [projectId, router, weights])

  const handleAwardBid = (bidId: string) => {
    // Update bid status
    const bidsStr = localStorage.getItem('demo_bids')
    const allBids = bidsStr ? JSON.parse(bidsStr) : []
    const updatedBids = allBids.map((b: Bid) => {
      if (b.project_id === projectId) {
        return b.id === bidId 
          ? { ...b, status: 'accepted' }
          : { ...b, status: 'rejected' }
      }
      return b
    })
    localStorage.setItem('demo_bids', JSON.stringify(updatedBids))
    
    // Update project status
    const projectsStr = localStorage.getItem('demo_projects')
    const projects = projectsStr ? JSON.parse(projectsStr) : []
    const updatedProjects = projects.map((p: Project) => 
      p.id === projectId ? { ...p, status: 'awarded' } : p
    )
    localStorage.setItem('demo_projects', JSON.stringify(updatedProjects))
    
    // Refresh page
    window.location.reload()
  }

  const exportToExcel = () => {
    // Simple CSV export
    const headers = ['공급사', '견적가', '납기일', '점수', '상태']
    const rows = bids.map(bid => [
      bid.supplier_name || '',
      bid.price.toLocaleString(),
      `${bid.delivery_days}일`,
      bid.score || 0,
      bid.status === 'accepted' ? '낙찰' : bid.status === 'rejected' ? '탈락' : '검토중'
    ])
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${project?.title}_bids.csv`
    link.click()
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
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center">
              <button
                onClick={() => router.back()}
                className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{project?.title}</h1>
                <p className="text-sm text-gray-500">프로젝트 상세 정보</p>
              </div>
            </div>
            
            <div className="flex gap-2">
              {bids.length > 0 && (
                <Button
                  onClick={exportToExcel}
                  variant="outline"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Excel 다운로드
                </Button>
              )}
              <Button
                variant="outline"
                className="border-gray-300 text-gray-400 cursor-not-allowed"
                disabled
                title="준비 중"
              >
                프로젝트 수정
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Project Info */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">프로젝트 정보</h2>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">카테고리</p>
                  <p className="font-medium">{project?.category || '미분류'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">지역</p>
                  <p className="font-medium flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    {project?.region || '미지정'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">예산</p>
                  <p className="font-medium flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-400" />
                    {project?.budget_range || '미지정'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">마감일</p>
                  <p className="font-medium flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                    {project?.deadline ? new Date(project.deadline).toLocaleDateString() : '미지정'}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">상태</p>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project?.status === 'active' ? 'bg-green-100 text-green-800' :
                    project?.status === 'awarded' ? 'bg-blue-100 text-blue-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project?.status === 'active' ? '진행중' :
                     project?.status === 'awarded' ? '낙찰완료' : '마감'}
                  </span>
                </div>
              </div>
              
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500 mb-2">요구사항</p>
                <p className="text-sm text-gray-700">
                  {project?.requirements || '요구사항이 없습니다.'}
                </p>
              </div>
            </Card>

            {/* Weighted Scoring */}
            {project?.status === 'active' && bids.length > 0 && (
              <Card className="p-6 mt-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">평가 가중치</h2>
                
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm text-gray-600">가격</label>
                      <span className="text-sm font-medium">{weights.price}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weights.price}
                      onChange={(e) => setWeights({ ...weights, price: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm text-gray-600">납기</label>
                      <span className="text-sm font-medium">{weights.delivery}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weights.delivery}
                      onChange={(e) => setWeights({ ...weights, delivery: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm text-gray-600">품질</label>
                      <span className="text-sm font-medium">{weights.quality}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={weights.quality}
                      onChange={(e) => setWeights({ ...weights, quality: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">합계</span>
                      <span className={`text-sm font-bold ${
                        weights.price + weights.delivery + weights.quality === 100 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }`}>
                        {weights.price + weights.delivery + weights.quality}%
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Bids List */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  응찰 목록 ({bids.length})
                </h2>
                {bids.length > 1 && project?.status === 'active' && (
                  <div className="relative group">
                    <Button
                      size="sm"
                      className="bg-gray-400 cursor-not-allowed"
                      disabled
                    >
                      비교 분석 대시보드
                    </Button>
                    <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      고급 분석 기능 준비 중
                    </span>
                  </div>
                )}
              </div>

              {bids.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">아직 응찰이 없습니다.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bids.sort((a, b) => (b.score || 0) - (a.score || 0)).map((bid, index) => (
                    <motion.div
                      key={bid.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={`border rounded-lg p-4 ${
                        selectedBid === bid.id ? 'border-teal-500 bg-teal-50' : 'border-gray-200'
                      } ${bid.status === 'accepted' ? 'bg-green-50 border-green-500' : ''}`}
                      onClick={() => setSelectedBid(bid.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-gray-900">
                              {bid.supplier_name}
                            </h3>
                            {index === 0 && project?.status === 'active' && (
                              <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                최고점수
                              </span>
                            )}
                            {bid.status === 'accepted' && (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full flex items-center">
                                <Award className="h-3 w-3 mr-1" />
                                낙찰
                              </span>
                            )}
                          </div>
                          
                          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                            <div>
                              <span className="text-gray-500">견적가:</span>
                              <p className="font-medium text-gray-900">
                                ₩{bid.price.toLocaleString()}
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">납기:</span>
                              <p className="font-medium text-gray-900 flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {bid.delivery_days}일
                              </p>
                            </div>
                            <div>
                              <span className="text-gray-500">종합점수:</span>
                              <p className="font-bold text-teal-600 text-lg">
                                {bid.score}점
                              </p>
                            </div>
                          </div>
                          
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {bid.comment}
                          </p>
                        </div>
                        
                        {project?.status === 'active' && (
                          <div className="ml-4">
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation()
                                handleAwardBid(bid.id)
                              }}
                              className="bg-teal-600 hover:bg-teal-700"
                            >
                              낙찰
                            </Button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}