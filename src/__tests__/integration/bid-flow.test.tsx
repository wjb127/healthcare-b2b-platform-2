import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BidsService } from '@/services/bids.service'
import '@testing-library/jest-dom'

// Mock Supabase client is already mocked in jest.setup.js
// Import the service we're testing
import { createClient } from '@/lib/supabase/client'

describe('Bidding Flow Integration Test', () => {
  let bidsService: BidsService

  beforeEach(() => {
    bidsService = new BidsService()
    jest.clearAllMocks()
  })

  describe('Complete Bid Submission Flow', () => {
    it('should prevent duplicate bids from same supplier', async () => {
      const projectId = 'project-123'
      const supplierId = 'supplier-456'
      
      const mockSupabase = createClient() as any
      
      // Mock the chain of method calls
      const singleMock = jest.fn().mockResolvedValue({
        data: { id: 'existing-bid' },
        error: null
      })
      const eqMock2 = jest.fn().mockReturnValue({ single: singleMock })
      const eqMock1 = jest.fn().mockReturnValue({ eq: eqMock2 })
      const selectMock = jest.fn().mockReturnValue({ eq: eqMock1 })
      
      mockSupabase.from.mockReturnValue({ select: selectMock })

      const newBid = {
        project_id: projectId,
        supplier_id: supplierId,
        price: 1000000,
        delivery_days: 30,
        comment: '테스트 입찰'
      }

      await expect(bidsService.createBid(newBid)).rejects.toThrow(
        '이미 이 프로젝트에 입찰하셨습니다.'
      )
    })

    it('should successfully create a new bid when no duplicate exists', async () => {
      const projectId = 'project-123'
      const supplierId = 'supplier-789'
      
      const mockSupabase = require('@/lib/supabase/client').createClient()
      
      // First call - check for existing bid (none found)
      mockSupabase.from = jest.fn()
        .mockReturnValueOnce({
          select: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              eq: jest.fn().mockReturnValue({
                single: jest.fn().mockResolvedValue({
                  data: null,
                  error: null
                })
              })
            })
          })
        })
        // Second call - insert new bid
        .mockReturnValueOnce({
          insert: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  id: 'new-bid-123',
                  project_id: projectId,
                  supplier_id: supplierId,
                  price: 1000000,
                  delivery_days: 30,
                  comment: '테스트 입찰',
                  status: 'submitted',
                  created_at: '2024-01-01'
                },
                error: null
              })
            })
          })
        })

      const newBid = {
        project_id: projectId,
        supplier_id: supplierId,
        price: 1000000,
        delivery_days: 30,
        comment: '테스트 입찰'
      }

      const result = await bidsService.createBid(newBid)

      expect(result).toBeDefined()
      expect(result.id).toBe('new-bid-123')
      expect(result.status).toBe('submitted')
    })

    it('should handle bid withdrawal correctly', async () => {
      const bidId = 'bid-123'
      
      const mockSupabase = require('@/lib/supabase/client').createClient()
      mockSupabase.from = jest.fn().mockReturnValue({
        update: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            select: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  id: bidId,
                  status: 'rejected'
                },
                error: null
              })
            })
          })
        })
      })

      const result = await bidsService.withdrawBid(bidId)

      expect(result.status).toBe('rejected')
    })
  })

  describe('Bid Scoring and Ranking', () => {
    it('should retrieve bids sorted by score', async () => {
      const projectId = 'project-123'
      
      const mockBids = [
        { id: '1', score: 85, price: 1000000, supplier_id: 's1' },
        { id: '2', score: 92, price: 900000, supplier_id: 's2' },
        { id: '3', score: 78, price: 1100000, supplier_id: 's3' }
      ]

      const mockSupabase = require('@/lib/supabase/client').createClient()
      mockSupabase.from = jest.fn().mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: mockBids.sort((a, b) => b.score - a.score),
              error: null
            })
          })
        })
      })

      const result = await bidsService.getBidsByProject(projectId)

      expect(result[0].score).toBe(92)
      expect(result[1].score).toBe(85)
      expect(result[2].score).toBe(78)
    })
  })
})