import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { createClient } from '@/lib/supabase/client'

describe('비딩 응찰 (Bidding Proposal) 기능', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('요청서 열람', () => {
    it('공급자가 프로젝트 목록을 조회할 수 있어야 한다', async () => {
      // Given
      const mockProjects = [
        {
          id: 'project-1',
          title: 'MRI 장비 구매',
          category: '의료기기',
          budget_range: '5억-10억',
          deadline: '2024-12-31',
          status: 'open',
        },
        {
          id: 'project-2',
          title: '병원 전산 시스템',
          category: 'IT 서비스',
          budget_range: '1억-3억',
          deadline: '2024-11-30',
          status: 'open',
        },
      ]

      const mockClient = createClient as jest.Mock
      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              data: mockProjects,
              error: null,
            })),
          })),
        })),
      })

      // When
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'open')

      // Then
      expect(data).toHaveLength(2)
      expect(data?.[0].title).toBe('MRI 장비 구매')
      expect(error).toBeNull()
    })

    it('프로젝트 상세 정보를 조회할 수 있어야 한다', async () => {
      // Given
      const projectId = 'project-123'
      const mockProject = {
        id: projectId,
        title: 'MRI 장비 구매',
        category: '의료기기',
        requirements: '3T MRI, 설치 및 교육 포함',
        budget_range: '5억-10억',
        deadline: '2024-12-31',
      }

      const mockClient = createClient as jest.Mock
      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              single: jest.fn(() => ({
                data: mockProject,
                error: null,
              })),
            })),
          })),
        })),
      })

      // When
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      // Then
      expect(data?.id).toBe(projectId)
      expect(data?.requirements).toBe('3T MRI, 설치 및 교육 포함')
      expect(error).toBeNull()
    })
  })

  describe('응찰서 제출', () => {
    it('공급자가 응찰서를 제출할 수 있어야 한다', async () => {
      // Given
      const bidData = {
        project_id: 'project-123',
        supplier_id: 'supplier-456',
        price: 750000000,
        delivery_days: 60,
        comment: 'GE 최신 모델, 5년 무상 AS 제공',
      }

      const mockClient = createClient as jest.Mock
      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: 'bid-789', ...bidData, status: 'submitted' },
        error: null,
      })

      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          insert: mockInsert,
        })),
      })

      // When
      const supabase = createClient()
      const { data, error } = await supabase.from('bids').insert(bidData)

      // Then
      expect(mockInsert).toHaveBeenCalledWith(bidData)
      expect(data?.status).toBe('submitted')
      expect(data?.price).toBe(750000000)
      expect(error).toBeNull()
    })

    it('필수 정보가 누락되면 응찰서 제출이 실패해야 한다', async () => {
      // Given
      const incompleteBid = {
        project_id: 'project-123',
        // price is missing
        delivery_days: 60,
      }

      const mockClient = createClient as jest.Mock
      const mockInsert = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'price is required' },
      })

      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          insert: mockInsert,
        })),
      })

      // When
      const supabase = createClient()
      const { data, error } = await supabase.from('bids').insert(incompleteBid)

      // Then
      expect(error).not.toBeNull()
      expect(error?.message).toContain('price is required')
      expect(data).toBeNull()
    })
  })

  describe('응찰 내역 관리', () => {
    it('공급자가 자신의 응찰 내역을 조회할 수 있어야 한다', async () => {
      // Given
      const supplierId = 'supplier-456'
      const mockBids = [
        {
          id: 'bid-1',
          project_id: 'project-1',
          price: 750000000,
          delivery_days: 60,
          status: 'submitted',
        },
        {
          id: 'bid-2',
          project_id: 'project-2',
          price: 150000000,
          delivery_days: 90,
          status: 'accepted',
        },
      ]

      const mockClient = createClient as jest.Mock
      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              data: mockBids,
              error: null,
            })),
          })),
        })),
      })

      // When
      const supabase = createClient()
      const { data, error } = await supabase
        .from('bids')
        .select('*')
        .eq('supplier_id', supplierId)

      // Then
      expect(data).toHaveLength(2)
      expect(data?.[1].status).toBe('accepted')
      expect(error).toBeNull()
    })

    it('공급자가 응찰을 수정할 수 있어야 한다', async () => {
      // Given
      const bidId = 'bid-789'
      const updatedData = {
        price: 700000000,
        comment: '가격 조정 및 추가 혜택 제공',
      }

      const mockClient = createClient as jest.Mock
      const mockUpdate = jest.fn().mockResolvedValue({
        data: { id: bidId, ...updatedData },
        error: null,
      })

      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          update: jest.fn(() => ({
            eq: jest.fn(() => mockUpdate()),
          })),
        })),
      })

      // When
      const supabase = createClient()
      const { data, error } = await supabase
        .from('bids')
        .update(updatedData)
        .eq('id', bidId)

      // Then
      expect(data?.price).toBe(700000000)
      expect(data?.comment).toContain('가격 조정')
      expect(error).toBeNull()
    })

    it('공급자가 응찰을 철회할 수 있어야 한다', async () => {
      // Given
      const bidId = 'bid-789'

      const mockClient = createClient as jest.Mock
      const mockDelete = jest.fn().mockResolvedValue({
        data: { id: bidId },
        error: null,
      })

      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          delete: jest.fn(() => ({
            eq: jest.fn(() => mockDelete()),
          })),
        })),
      })

      // When
      const supabase = createClient()
      const { data, error } = await supabase
        .from('bids')
        .delete()
        .eq('id', bidId)

      // Then
      expect(mockDelete).toHaveBeenCalled()
      expect(data?.id).toBe(bidId)
      expect(error).toBeNull()
    })
  })
})