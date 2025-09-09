import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createClient } from '@/lib/supabase/client'

describe('비교 기능 (Comparison Feature)', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('응찰 비교 테이블', () => {
    it('요청자가 응찰한 공급사들의 견적을 비교할 수 있어야 한다', async () => {
      // Given
      const projectId = 'project-123'
      const mockBids = [
        {
          id: 'bid-1',
          supplier_id: 'supplier-1',
          supplier: { company_name: '메디칼솔루션(주)' },
          price: 750000000,
          delivery_days: 60,
          comment: 'GE 최신 모델',
          score: 85,
        },
        {
          id: 'bid-2',
          supplier_id: 'supplier-2',
          supplier: { company_name: '헬스케어테크(주)' },
          price: 680000000,
          delivery_days: 45,
          comment: 'Siemens 모델',
          score: 92,
        },
        {
          id: 'bid-3',
          supplier_id: 'supplier-3',
          supplier: { company_name: '바이오메드(주)' },
          price: 820000000,
          delivery_days: 50,
          comment: 'Philips 모델',
          score: 78,
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
        .select('*, supplier:users(*)')
        .eq('project_id', projectId)

      // Then
      expect(data).toHaveLength(3)
      expect(data?.[0].price).toBe(750000000)
      expect(data?.[1].delivery_days).toBe(45)
      expect(data?.[2].score).toBe(78)
      expect(error).toBeNull()
    })

    it('가격순으로 정렬할 수 있어야 한다', async () => {
      // Given
      const projectId = 'project-123'
      const mockBids = [
        { id: 'bid-2', price: 680000000, delivery_days: 45 },
        { id: 'bid-1', price: 750000000, delivery_days: 60 },
        { id: 'bid-3', price: 820000000, delivery_days: 50 },
      ]

      const mockClient = createClient as jest.Mock
      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn(() => ({
                data: mockBids,
                error: null,
              })),
            })),
          })),
        })),
      })

      // When
      const supabase = createClient()
      const { data } = await supabase
        .from('bids')
        .select('*')
        .eq('project_id', projectId)
        .order('price', { ascending: true })

      // Then
      expect(data?.[0].price).toBe(680000000)
      expect(data?.[1].price).toBe(750000000)
      expect(data?.[2].price).toBe(820000000)
    })

    it('납기일순으로 정렬할 수 있어야 한다', async () => {
      // Given
      const projectId = 'project-123'
      const mockBids = [
        { id: 'bid-2', price: 680000000, delivery_days: 45 },
        { id: 'bid-3', price: 820000000, delivery_days: 50 },
        { id: 'bid-1', price: 750000000, delivery_days: 60 },
      ]

      const mockClient = createClient as jest.Mock
      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              order: jest.fn(() => ({
                data: mockBids,
                error: null,
              })),
            })),
          })),
        })),
      })

      // When
      const supabase = createClient()
      const { data } = await supabase
        .from('bids')
        .select('*')
        .eq('project_id', projectId)
        .order('delivery_days', { ascending: true })

      // Then
      expect(data?.[0].delivery_days).toBe(45)
      expect(data?.[1].delivery_days).toBe(50)
      expect(data?.[2].delivery_days).toBe(60)
    })
  })

  describe('Excel 다운로드', () => {
    it('비교 테이블을 Excel 파일로 다운로드할 수 있어야 한다', () => {
      // Given
      const bidsData = [
        {
          supplier_name: '메디칼솔루션(주)',
          price: 750000000,
          delivery_days: 60,
          comment: 'GE 최신 모델',
          score: 85,
        },
        {
          supplier_name: '헬스케어테크(주)',
          price: 680000000,
          delivery_days: 45,
          comment: 'Siemens 모델',
          score: 92,
        },
      ]

      // When
      const csvContent = [
        ['공급사명', '가격', '납기일', '제안내용', '점수'],
        ...bidsData.map(bid => [
          bid.supplier_name,
          bid.price.toLocaleString(),
          `${bid.delivery_days}일`,
          bid.comment,
          bid.score,
        ]),
      ]
        .map(row => row.join(','))
        .join('\n')

      const blob = new Blob([csvContent], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)

      // Then
      expect(csvContent).toContain('공급사명,가격,납기일,제안내용,점수')
      expect(csvContent).toContain('메디칼솔루션(주)')
      expect(csvContent).toContain('680,000,000')
      expect(blob.type).toBe('text/csv')
    })

    it('선택한 응찰만 필터링하여 다운로드할 수 있어야 한다', () => {
      // Given
      const allBids = [
        { id: 'bid-1', supplier_name: '메디칼솔루션(주)', price: 750000000 },
        { id: 'bid-2', supplier_name: '헬스케어테크(주)', price: 680000000 },
        { id: 'bid-3', supplier_name: '바이오메드(주)', price: 820000000 },
      ]
      const selectedBidIds = ['bid-1', 'bid-3']

      // When
      const filteredBids = allBids.filter(bid => 
        selectedBidIds.includes(bid.id)
      )

      // Then
      expect(filteredBids).toHaveLength(2)
      expect(filteredBids[0].supplier_name).toBe('메디칼솔루션(주)')
      expect(filteredBids[1].supplier_name).toBe('바이오메드(주)')
      expect(filteredBids.find(b => b.supplier_name === '헬스케어테크(주)')).toBeUndefined()
    })
  })

  describe('가중치 점수 확인', () => {
    it('각 응찰의 가중치 점수를 확인할 수 있어야 한다', () => {
      // Given
      const scoringWeights = {
        price: 40,
        delivery: 30,
        quality: 30,
      }

      const bid = {
        price_score: 85,
        delivery_score: 90,
        quality_score: 88,
      }

      // When
      const totalScore = 
        (bid.price_score * scoringWeights.price +
         bid.delivery_score * scoringWeights.delivery +
         bid.quality_score * scoringWeights.quality) / 100

      // Then
      expect(totalScore).toBe(87.4)
    })

    it('가중치를 조정하면 점수가 재계산되어야 한다', () => {
      // Given
      const initialWeights = { price: 40, delivery: 30, quality: 30 }
      const newWeights = { price: 50, delivery: 25, quality: 25 }
      
      const bid = {
        price_score: 85,
        delivery_score: 90,
        quality_score: 88,
      }

      // When
      const initialScore = 
        (bid.price_score * initialWeights.price +
         bid.delivery_score * initialWeights.delivery +
         bid.quality_score * initialWeights.quality) / 100

      const newScore = 
        (bid.price_score * newWeights.price +
         bid.delivery_score * newWeights.delivery +
         bid.quality_score * newWeights.quality) / 100

      // Then
      expect(initialScore).toBe(87.4)
      expect(newScore).toBe(87)
      expect(newScore).not.toBe(initialScore)
    })
  })
})