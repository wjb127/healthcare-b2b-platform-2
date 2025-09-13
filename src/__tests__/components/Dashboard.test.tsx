import { render, screen, waitFor } from '@testing-library/react'
import { useRouter } from 'next/navigation'
import BuyerDashboard from '@/app/dashboard/buyer/page'
import '@testing-library/jest-dom'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}))

// Mock useSupabase hook
jest.mock('@/hooks/useSupabase', () => ({
  useSupabase: jest.fn()
}))

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  },
  AnimatePresence: ({ children }: any) => <>{children}</>
}))

describe('BuyerDashboard', () => {
  const mockPush = jest.fn()
  const mockRouter = { push: mockPush }
  
  const mockAuth = {
    getUser: jest.fn(),
    signOut: jest.fn()
  }
  
  const mockProjectsService = {
    getProjects: jest.fn()
  }

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue(mockRouter)
    
    const useSupabase = require('@/hooks/useSupabase').useSupabase
    useSupabase.mockReturnValue({
      auth: mockAuth,
      projects: mockProjectsService,
      isConfigured: true
    })

    localStorage.clear()
    jest.clearAllMocks()
  })

  it('should redirect to demo page if user is not logged in', async () => {
    mockAuth.getUser.mockResolvedValue(null)
    localStorage.setItem('demo_role', 'buyer')

    render(<BuyerDashboard />)

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/demo')
    })
  })

  it('should display user company name when logged in', async () => {
    const mockUser = {
      id: 'user-123',
      company_name: '서울대학교병원',
      role: 'buyer'
    }

    mockAuth.getUser.mockResolvedValue(mockUser)
    mockProjectsService.getProjects.mockResolvedValue([])
    localStorage.setItem('demo_role', 'buyer')

    render(<BuyerDashboard />)

    await waitFor(() => {
      expect(screen.getByText(/서울대학교병원 대시보드/)).toBeInTheDocument()
    })
  })

  it('should display projects list', async () => {
    const mockUser = {
      id: 'user-123',
      company_name: '서울대학교병원',
      role: 'buyer'
    }

    const mockProjects = [
      {
        id: '1',
        title: 'MRI 장비 구매',
        category: '의료기기',
        status: 'open',
        budget_range: '5억-10억',
        deadline: '2024-12-31',
        bids: []
      }
    ]

    mockAuth.getUser.mockResolvedValue(mockUser)
    mockProjectsService.getProjects.mockResolvedValue(mockProjects)
    localStorage.setItem('demo_role', 'buyer')

    render(<BuyerDashboard />)

    await waitFor(() => {
      expect(screen.getByText('MRI 장비 구매')).toBeInTheDocument()
      expect(screen.getByText('5억-10억')).toBeInTheDocument()
    })
  })

  it('should display empty state when no projects', async () => {
    const mockUser = {
      id: 'user-123',
      company_name: '서울대학교병원',
      role: 'buyer'
    }

    mockAuth.getUser.mockResolvedValue(mockUser)
    mockProjectsService.getProjects.mockResolvedValue([])
    localStorage.setItem('demo_role', 'buyer')

    render(<BuyerDashboard />)

    await waitFor(() => {
      expect(screen.getByText('프로젝트가 없습니다')).toBeInTheDocument()
      expect(screen.getByText('새 프로젝트를 생성하여 입찰을 시작하세요')).toBeInTheDocument()
    })
  })

  it('should calculate and display statistics correctly', async () => {
    const mockUser = {
      id: 'user-123',
      company_name: '서울대학교병원',
      role: 'buyer'
    }

    const mockProjects = [
      {
        id: '1',
        title: 'Project 1',
        status: 'open',
        bids: [{}, {}, {}] // 3 bids
      },
      {
        id: '2',
        title: 'Project 2',
        status: 'closed',
        bids: [{}, {}] // 2 bids
      }
    ]

    mockAuth.getUser.mockResolvedValue(mockUser)
    mockProjectsService.getProjects.mockResolvedValue(mockProjects)
    localStorage.setItem('demo_role', 'buyer')

    render(<BuyerDashboard />)

    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument() // Total projects
      expect(screen.getByText('1')).toBeInTheDocument() // Active projects
      expect(screen.getByText('5')).toBeInTheDocument() // Total bids
      expect(screen.getByText('2.5')).toBeInTheDocument() // Average bids
    })
  })
})