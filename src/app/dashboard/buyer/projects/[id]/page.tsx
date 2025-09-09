'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DemoSession } from '@/lib/demo/session'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowLeft, Download, Calendar, MapPin, DollarSign, TrendingUp, SlidersHorizontal } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Database } from '@/lib/database.types'

type Project = Database['public']['Tables']['projects']['Row']
type Bid = Database['public']['Tables']['bids']['Row'] & {
  supplier?: { company_name: string }
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [bids, setBids] = useState<Bid[]>([])
  const [loading, setLoading] = useState(true)
  const [showWeights, setShowWeights] = useState(false)
  const [weights, setWeights] = useState({
    price: 40,
    delivery: 30,
    quality: 30,
  })
  const [sortBy, setSortBy] = useState<'price' | 'delivery' | 'score'>('score')

  useEffect(() => {
    const fetchProjectData = async () => {
      const user = DemoSession.getDemoUser()
      if (!user) {
        router.push('/demo')
        return
      }

      const supabase = createClient()
      
      // Fetch project
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (projectError || !projectData) {
        router.push('/dashboard/buyer')
        return
      }

      setProject(projectData)

      // Fetch bids with supplier info
      const { data: bidsData } = await supabase
        .from('bids')
        .select(`
          *,
          supplier:users(company_name)
        `)
        .eq('project_id', projectId)

      if (bidsData) {
        setBids(bidsData as Bid[])
      }

      setLoading(false)
    }

    fetchProjectData()
  }, [projectId, router])

  const calculateScore = (bid: Bid) => {
    // Simple scoring algorithm
    const priceScore = bid.price ? 100 - (bid.price / 10000000) : 0
    const deliveryScore = bid.delivery_days ? 100 - bid.delivery_days : 0
    const qualityScore = 80 // Default quality score
    
    return Math.round(
      (priceScore * weights.price + 
       deliveryScore * weights.delivery + 
       qualityScore * weights.quality) / 100
    )
  }

  const sortedBids = [...bids].sort((a, b) => {
    switch (sortBy) {
      case 'price':
        return (a.price || 0) - (b.price || 0)
      case 'delivery':
        return (a.delivery_days || 0) - (b.delivery_days || 0)
      case 'score':
        return calculateScore(b) - calculateScore(a)
      default:
        return 0
    }
  })

  const handleExportExcel = () => {
    // Create CSV content
    const headers = ['공급사명', '가격', '납기일', '제안내용', '점수']
    const rows = sortedBids.map(bid => [
      bid.supplier?.company_name || '',
      bid.price?.toLocaleString() || '',
      `${bid.delivery_days}일`,
      bid.comment || '',
      calculateScore(bid),
    ])
    
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n')
    
    // Download CSV
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${project?.title}_응찰비교_${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
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
          <div className="flex items-center py-4">
            <button
              onClick={() => router.push('/dashboard/buyer')}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">프로젝트 상세</h1>
            </div>
            <Button onClick={() => router.push('응찰 비교')}>
              응찰 비교
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-4">{project?.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-gray-400" />
                <span>{project?.region || '미지정'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2 text-gray-400" />
                <span>{project?.deadline ? new Date(project.deadline).toLocaleDateString() : '미지정'}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <DollarSign className="h-5 w-5 mr-2 text-gray-400" />
                <span>{project?.budget_range || '미지정'}</span>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-gray-600">{project?.requirements || '요구사항 없음'}</p>
            </div>
          </Card>
        </motion.div>

        {/* Bids Comparison */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">응찰 현황 ({bids.length}건)</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowWeights(!showWeights)}
            >
              <SlidersHorizontal className="mr-2 h-4 w-4" />
              가중치 설정
            </Button>
            <Button
              onClick={handleExportExcel}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Download className="mr-2 h-4 w-4" />
              Excel 다운로드
            </Button>
          </div>
        </div>

        {/* Weight Settings */}
        {showWeights && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <Card className="p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">평가 가중치 설정</h3>
              <div className="space-y-4">
                <div>
                  <label className="flex justify-between mb-2">
                    <span>가격</span>
                    <span className="font-semibold">{weights.price}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights.price}
                    onChange={(e) => setWeights({ ...weights, price: parseInt(e.target.value) })}
                    className="w-full weight-slider"
                  />
                </div>
                <div>
                  <label className="flex justify-between mb-2">
                    <span>납기</span>
                    <span className="font-semibold">{weights.delivery}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights.delivery}
                    onChange={(e) => setWeights({ ...weights, delivery: parseInt(e.target.value) })}
                    className="w-full weight-slider"
                  />
                </div>
                <div>
                  <label className="flex justify-between mb-2">
                    <span>품질</span>
                    <span className="font-semibold">{weights.quality}%</span>
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={weights.quality}
                    onChange={(e) => setWeights({ ...weights, quality: parseInt(e.target.value) })}
                    className="w-full weight-slider"
                  />
                </div>
                <div className="pt-2 border-t">
                  <div className="flex justify-between">
                    <span className="font-semibold">총합</span>
                    <span className="font-semibold">{weights.price + weights.delivery + weights.quality}%</span>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}

        {/* Sort Options */}
        <div className="mb-4">
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'score' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('score')}
            >
              점수순
            </Button>
            <Button
              variant={sortBy === 'price' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('price')}
            >
              가격순
            </Button>
            <Button
              variant={sortBy === 'delivery' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSortBy('delivery')}
            >
              납기순
            </Button>
          </div>
        </div>

        {/* Bids Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full comparison-table">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    순위
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    공급사
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    가격
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    납기
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    제안내용
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    점수
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedBids.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      아직 응찰이 없습니다.
                    </td>
                  </tr>
                ) : (
                  sortedBids.map((bid, index) => {
                    const score = calculateScore(bid)
                    return (
                      <motion.tr
                        key={bid.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                            index === 0 ? 'bg-yellow-100 text-yellow-800' :
                            index === 1 ? 'bg-gray-100 text-gray-800' :
                            index === 2 ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-50 text-gray-600'
                          }`}>
                            {index + 1}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {bid.supplier?.company_name || '알 수 없음'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ₩{bid.price?.toLocaleString() || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {bid.delivery_days ? `${bid.delivery_days}일` : '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {bid.comment || '-'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-lg font-semibold text-teal-600 weighted-score">
                              {score}
                            </span>
                            <TrendingUp className="ml-1 h-4 w-4 text-teal-600" />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {bid.status === 'submitted' ? '제출됨' : bid.status}
                          </span>
                        </td>
                      </motion.tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}