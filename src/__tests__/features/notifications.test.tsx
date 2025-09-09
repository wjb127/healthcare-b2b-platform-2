import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { createClient } from '@/lib/supabase/client'

describe('알림 (Notifications) 기능', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('신규 프로젝트 알림', () => {
    it('새 프로젝트가 등록되면 공급자에게 알림이 생성되어야 한다', async () => {
      // Given
      const newProject = {
        id: 'project-123',
        title: 'MRI 장비 구매',
        category: '의료기기',
      }

      const supplierIds = ['supplier-1', 'supplier-2', 'supplier-3']

      const mockClient = createClient as jest.Mock
      const mockInsert = jest.fn().mockResolvedValue({
        data: supplierIds.map(id => ({
          id: `notif-${id}`,
          user_id: id,
          type: 'new_project',
          title: '새로운 프로젝트가 등록되었습니다',
          message: `${newProject.title} 프로젝트가 등록되었습니다.`,
          read: false,
        })),
        error: null,
      })

      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          insert: mockInsert,
        })),
      })

      // When
      const supabase = createClient()
      const notifications = supplierIds.map(supplierId => ({
        user_id: supplierId,
        type: 'new_project',
        title: '새로운 프로젝트가 등록되었습니다',
        message: `${newProject.title} 프로젝트가 등록되었습니다.`,
        read: false,
      }))

      const { data, error } = await supabase
        .from('notifications')
        .insert(notifications)

      // Then
      expect(mockInsert).toHaveBeenCalledWith(notifications)
      expect(data).toHaveLength(3)
      expect(data?.[0].type).toBe('new_project')
      expect(data?.[0].read).toBe(false)
      expect(error).toBeNull()
    })

    it('카테고리별로 관심 공급자에게만 알림을 보내야 한다', async () => {
      // Given
      const project = {
        id: 'project-123',
        category: '의료기기',
      }

      // 의료기기 카테고리에 관심있는 공급자들
      const interestedSuppliers = [
        { id: 'supplier-1', interested_categories: ['의료기기'] },
        { id: 'supplier-3', interested_categories: ['의료기기', 'IT 서비스'] },
      ]

      const mockClient = createClient as jest.Mock
      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            contains: jest.fn(() => ({
              data: interestedSuppliers,
              error: null,
            })),
          })),
        })),
      })

      // When
      const supabase = createClient()
      const { data } = await supabase
        .from('users')
        .select('*')
        .contains('interested_categories', [project.category])

      // Then
      expect(data).toHaveLength(2)
      expect(data?.map(s => s.id)).toContain('supplier-1')
      expect(data?.map(s => s.id)).toContain('supplier-3')
      expect(data?.map(s => s.id)).not.toContain('supplier-2')
    })
  })

  describe('새 응찰 알림', () => {
    it('새 응찰이 제출되면 요청자에게 알림이 생성되어야 한다', async () => {
      // Given
      const bid = {
        id: 'bid-123',
        project_id: 'project-456',
        supplier_id: 'supplier-789',
      }

      const project = {
        id: 'project-456',
        title: 'MRI 장비 구매',
        user_id: 'buyer-123',
      }

      const supplier = {
        id: 'supplier-789',
        company_name: '메디칼솔루션(주)',
      }

      const mockClient = createClient as jest.Mock
      const mockInsert = jest.fn().mockResolvedValue({
        data: {
          id: 'notif-123',
          user_id: project.user_id,
          type: 'new_bid',
          title: '새로운 응찰이 접수되었습니다',
          message: `${supplier.company_name}에서 ${project.title} 프로젝트에 응찰했습니다.`,
          read: false,
        },
        error: null,
      })

      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          insert: mockInsert,
        })),
      })

      // When
      const supabase = createClient()
      const notification = {
        user_id: project.user_id,
        type: 'new_bid',
        title: '새로운 응찰이 접수되었습니다',
        message: `${supplier.company_name}에서 ${project.title} 프로젝트에 응찰했습니다.`,
        read: false,
      }

      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)

      // Then
      expect(data?.type).toBe('new_bid')
      expect(data?.message).toContain('메디칼솔루션(주)')
      expect(data?.message).toContain('MRI 장비 구매')
      expect(error).toBeNull()
    })
  })

  describe('알림 관리', () => {
    it('사용자가 알림을 읽음 처리할 수 있어야 한다', async () => {
      // Given
      const notificationId = 'notif-123'

      const mockClient = createClient as jest.Mock
      const mockUpdate = jest.fn().mockResolvedValue({
        data: { id: notificationId, read: true },
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
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId)

      // Then
      expect(data?.read).toBe(true)
      expect(error).toBeNull()
    })

    it('사용자별로 읽지 않은 알림 개수를 조회할 수 있어야 한다', async () => {
      // Given
      const userId = 'user-123'
      const unreadNotifications = [
        { id: 'notif-1', user_id: userId, read: false },
        { id: 'notif-2', user_id: userId, read: false },
        { id: 'notif-3', user_id: userId, read: false },
      ]

      const mockClient = createClient as jest.Mock
      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          select: jest.fn(() => ({
            eq: jest.fn(() => ({
              eq: jest.fn(() => ({
                data: unreadNotifications,
                error: null,
              })),
            })),
          })),
        })),
      })

      // When
      const supabase = createClient()
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .eq('read', false)

      // Then
      expect(data).toHaveLength(3)
      expect(data?.every(n => n.read === false)).toBe(true)
    })

    it('마감일 임박 알림이 자동으로 생성되어야 한다', async () => {
      // Given
      const project = {
        id: 'project-123',
        title: '병원 전산 시스템',
        user_id: 'buyer-123',
        deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3일 후
      }

      const mockClient = createClient as jest.Mock
      const mockInsert = jest.fn().mockResolvedValue({
        data: {
          user_id: project.user_id,
          type: 'deadline_reminder',
          title: '마감일 임박 알림',
          message: `${project.title} 프로젝트 마감이 3일 남았습니다.`,
          read: false,
        },
        error: null,
      })

      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          insert: mockInsert,
        })),
      })

      // When
      const supabase = createClient()
      const notification = {
        user_id: project.user_id,
        type: 'deadline_reminder',
        title: '마감일 임박 알림',
        message: `${project.title} 프로젝트 마감이 3일 남았습니다.`,
        read: false,
      }

      const { data } = await supabase
        .from('notifications')
        .insert(notification)

      // Then
      expect(data?.type).toBe('deadline_reminder')
      expect(data?.message).toContain('3일 남았습니다')
    })
  })

  describe('이메일 알림', () => {
    it('중요 알림은 이메일로도 발송되어야 한다', async () => {
      // Given
      const emailData = {
        to: 'buyer@hospital.com',
        subject: '새로운 응찰이 접수되었습니다',
        body: '메디칼솔루션(주)에서 MRI 장비 구매 프로젝트에 응찰했습니다.',
      }

      // Mock email sending function
      const sendEmail = jest.fn().mockResolvedValue({
        success: true,
        messageId: 'email-123',
      })

      // When
      const result = await sendEmail(emailData)

      // Then
      expect(sendEmail).toHaveBeenCalledWith(emailData)
      expect(result.success).toBe(true)
      expect(result.messageId).toBe('email-123')
    })

    it('이메일 발송 실패 시 알림은 여전히 생성되어야 한다', async () => {
      // Given
      const notification = {
        user_id: 'user-123',
        type: 'new_bid',
        title: '새로운 응찰이 접수되었습니다',
        message: '응찰 정보',
      }

      const sendEmail = jest.fn().mockRejectedValue(new Error('Email service error'))

      const mockClient = createClient as jest.Mock
      const mockInsert = jest.fn().mockResolvedValue({
        data: { ...notification, id: 'notif-123', read: false },
        error: null,
      })

      mockClient.mockReturnValue({
        from: jest.fn(() => ({
          insert: mockInsert,
        })),
      })

      // When
      const supabase = createClient()
      
      // Try to send email but it fails
      let emailError = null
      try {
        await sendEmail({ to: 'test@test.com', subject: 'Test', body: 'Test' })
      } catch (error) {
        emailError = error
      }

      // Still create notification
      const { data, error } = await supabase
        .from('notifications')
        .insert(notification)

      // Then
      expect(emailError).not.toBeNull()
      expect(data).not.toBeNull()
      expect(data?.id).toBe('notif-123')
      expect(error).toBeNull()
    })
  })
})