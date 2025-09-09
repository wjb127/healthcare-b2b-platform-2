'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DemoSession } from '@/lib/demo/session'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Calendar, MapPin, DollarSign, Upload, X, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'
import type { Database } from '@/lib/database.types'

type Project = Database['public']['Tables']['projects']['Row'] & {
  user?: { company_name: string }
}
type Bid = Database['public']['Tables']['bids']['Row']

export default function BidSubmitPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string
  
  const [project, setProject] = useState<Project | null>(null)
  const [existingBid, setExistingBid] = useState<Bid | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [files, setFiles] = useState<File[]>([])
  const [formData, setFormData] = useState({
    price: '',
    delivery_days: '',
    comment: '',
  })

  useEffect(() => {
    const fetchProjectData = async () => {
      const user = DemoSession.getDemoUser()
      if (!user || user.role !== 'supplier') {
        router.push('/demo')
        return
      }

      const supabase = createClient()
      
      // Fetch project details
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select(`
          *,
          user:users(company_name)
        `)
        .eq('id', projectId)
        .single()

      if (projectError || !projectData) {
        router.push('/dashboard/supplier')
        return
      }

      setProject(projectData as Project)

      // Check if already bidded
      const { data: bidData } = await supabase
        .from('bids')
        .select('*')
        .eq('project_id', projectId)
        .eq('supplier_id', user.id)
        .single()

      if (bidData) {
        setExistingBid(bidData)
        setFormData({
          price: bidData.price?.toString() || '',
          delivery_days: bidData.delivery_days?.toString() || '',
          comment: bidData.comment || '',
        })
      }

      setLoading(false)
    }

    fetchProjectData()
  }, [projectId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const user = DemoSession.getDemoUser()
      if (!user) {
        router.push('/demo')
        return
      }

      const supabase = createClient()
      
      const bidData = {
        project_id: projectId,
        supplier_id: user.id,
        price: parseFloat(formData.price),
        delivery_days: parseInt(formData.delivery_days),
        comment: formData.comment,
        status: 'submitted' as const,
      }

      if (existingBid) {
        // Update existing bid
        const { error } = await supabase
          .from('bids')
          .update(bidData)
          .eq('id', existingBid.id)

        if (error) throw error
      } else {
        // Create new bid
        const { data: newBid, error } = await supabase
          .from('bids')
          .insert(bidData)
          .select()
          .single()

        if (error) throw error

        // Upload files if any
        if (newBid && files.length > 0) {
          for (const file of files) {
            await supabase
              .from('bid_files')
              .insert({
                bid_id: newBid.id,
                file_name: file.name,
                file_url: `demo://${file.name}`, // Demo URL
              })
          }
        }

        // Create notification for buyer
        if (project?.user_id) {
          await supabase
            .from('notifications')
            .insert({
              user_id: project.user_id,
              type: 'new_bid',
              title: '새로운 응찰이 접수되었습니다',
              message: `${user.company_name}에서 ${project.title} 프로젝트에 응찰했습니다.`,
              read: false,
            })
        }
      }

      setSubmitted(true)
      setTimeout(() => {
        router.push('/dashboard/supplier')
      }, 2000)
    } catch (error) {
      console.error('Error submitting bid:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            응찰이 {existingBid ? '수정' : '제출'}되었습니다!
          </h2>
          <p className="text-gray-600">잠시 후 대시보드로 이동합니다...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <button
              onClick={() => router.back()}
              className="mr-4 p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">
              {existingBid ? '응찰 수정' : '응찰서 제출'}
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Project Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">프로젝트 상세</h2>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{project?.title}</h3>
            
            <div className="text-sm text-gray-500 mb-4">
              요청자: {project?.user?.company_name || '알 수 없음'}
            </div>
            
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

        {/* Bid Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">응찰 정보</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Price & Delivery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">견적가 (원) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="예: 750000000"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="delivery_days">납기일 (일) *</Label>
                  <Input
                    id="delivery_days"
                    name="delivery_days"
                    type="number"
                    required
                    value={formData.delivery_days}
                    onChange={(e) => setFormData({ ...formData, delivery_days: e.target.value })}
                    placeholder="예: 60"
                    className="mt-1"
                  />
                </div>
              </div>

              {/* Comment */}
              <div>
                <Label htmlFor="comment">제안 내용 *</Label>
                <textarea
                  id="comment"
                  name="comment"
                  rows={6}
                  required
                  value={formData.comment}
                  onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                  placeholder="제품 사양, 서비스 내용, 특별 제안 등을 상세히 작성해주세요..."
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {/* File Upload */}
              {!existingBid && (
                <div>
                  <Label>첨부파일</Label>
                  <div className="mt-1">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-gray-400" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">클릭하여 파일 선택</span> 또는 드래그앤드롭
                        </p>
                        <p className="text-xs text-gray-500">제안서, 카탈로그 등 (최대 10MB)</p>
                      </div>
                      <input
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.xlsx"
                      />
                    </label>
                  </div>

                  {/* File List */}
                  {files.length > 0 && (
                    <div className="mt-4 space-y-2">
                      {files.map((file, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 bg-gray-50 rounded"
                        >
                          <span className="text-sm text-gray-600">{file.name}</span>
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  취소
                </Button>
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700"
                  disabled={submitting || !formData.price || !formData.delivery_days || !formData.comment}
                >
                  {submitting ? '제출 중...' : existingBid ? '응찰 수정' : '응찰 제출'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}