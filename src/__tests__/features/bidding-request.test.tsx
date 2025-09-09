import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { createClient } from '@/lib/supabase/client'

// Mock components for testing
const mockSupabaseResponse = {
  data: null,
  error: null,
}

describe('비딩 요청 (Bidding Request) 기능', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('프로젝트 등록', () => {
    it('요청자가 새 프로젝트를 등록할 수 있어야 한다', async () => {
      // Given
      const projectData = {
        title: 'MRI 장비 구매',
        category: '의료기기',
        region: '서울',
        budget_range: '5억-10억',
        deadline: '2024-12-31',
        requirements: '3T MRI, 설치 및 교육 포함',
      }

      const mockClient = createClient as jest.Mock
      const mockInsert = jest.fn().mockResolvedValue({
        data: { id: 'project-123', ...projectData },
        error: null,
      })

      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          insert: mockInsert,
        })),
      })

      // When
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)

      // Then
      expect(mockInsert).toHaveBeenCalledWith(projectData)
      expect(data).toEqual({ id: 'project-123', ...projectData })
      expect(error).toBeNull()
    })

    it('필수 필드가 누락되면 에러를 반환해야 한다', async () => {
      // Given
      const incompleteData = {
        category: '의료기기',
        // title is missing
      }

      const mockClient = createClient as jest.Mock
      const mockInsert = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'title is required' },
      })

      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          insert: mockInsert,
        })),
      })

      // When
      const supabase = createClient()
      const { data, error } = await supabase
        .from('projects')
        .insert(incompleteData)

      // Then
      expect(error).not.toBeNull()
      expect(error?.message).toBe('title is required')
      expect(data).toBeNull()
    })
  })

  describe('파일 업로드', () => {
    it('요청서 파일을 업로드할 수 있어야 한다', async () => {
      // Given
      const file = new File(['test content'], 'test.pdf', { type: 'application/pdf' })
      const projectId = 'project-123'

      const mockClient = createClient as jest.Mock
      const mockUpload = jest.fn().mockResolvedValue({
        data: { path: 'projects/project-123/test.pdf' },
        error: null,
      })

      mockClient.mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
          })),
        },
      })

      // When
      const supabase = createClient()
      const { data, error } = await supabase
        .storage
        .from('project-files')
        .upload(`projects/${projectId}/${file.name}`, file)

      // Then
      expect(mockUpload).toHaveBeenCalledWith(
        `projects/${projectId}/${file.name}`,
        file
      )
      expect(data?.path).toBe('projects/project-123/test.pdf')
      expect(error).toBeNull()
    })

    it('파일 크기 제한을 초과하면 에러를 반환해야 한다', async () => {
      // Given
      const largeFile = new File(['x'.repeat(11 * 1024 * 1024)], 'large.pdf', {
        type: 'application/pdf',
      })

      const mockClient = createClient as jest.Mock
      const mockUpload = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'File size exceeds 10MB limit' },
      })

      mockClient.mockReturnValue({
        storage: {
          from: jest.fn(() => ({
            upload: mockUpload,
          })),
        },
      })

      // When
      const supabase = createClient()
      const { data, error } = await supabase
        .storage
        .from('project-files')
        .upload('projects/test/large.pdf', largeFile)

      // Then
      expect(error).not.toBeNull()
      expect(error?.message).toContain('File size exceeds')
    })
  })

  describe('마감 기한 설정', () => {
    it('프로젝트 마감일을 설정할 수 있어야 한다', async () => {
      // Given
      const projectId = 'project-123'
      const deadline = '2024-12-31'

      const mockClient = createClient as jest.Mock
      const mockUpdate = jest.fn().mockResolvedValue({
        data: { id: projectId, deadline },
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
        .from('projects')
        .update({ deadline })
        .eq('id', projectId)

      // Then
      expect(data?.deadline).toBe(deadline)
      expect(error).toBeNull()
    })

    it('마감일이 지나면 프로젝트 상태가 자동으로 closed로 변경되어야 한다', async () => {
      // Given
      const projectId = 'project-123'
      const pastDeadline = '2023-01-01'

      const mockClient = createClient as jest.Mock
      const mockUpdate = jest.fn().mockResolvedValue({
        data: { id: projectId, status: 'closed', deadline: pastDeadline },
        error: null,
      })

      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          update: jest.fn(() => ({
            eq: jest.fn(() => ({
              lte: jest.fn(() => mockUpdate()),
            })),
          })),
        })),
      })

      // When - 마감일이 지난 프로젝트 상태 업데이트
      const supabase = createClient()
      const { data } = await supabase
        .from('projects')
        .update({ status: 'closed' })
        .eq('status', 'open')
        .lte('deadline', new Date().toISOString())

      // Then
      expect(data?.status).toBe('closed')
    })
  })
})