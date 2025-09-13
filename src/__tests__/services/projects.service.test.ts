import { ProjectsService } from '@/services/projects.service'

// Mock Supabase client
const mockSupabaseClient = {
  from: jest.fn(),
  select: jest.fn(),
  eq: jest.fn(),
  order: jest.fn(),
  insert: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  single: jest.fn()
}

jest.mock('@/lib/supabase/client', () => ({
  createClient: jest.fn(() => mockSupabaseClient)
}))

describe('ProjectsService', () => {
  let projectsService: ProjectsService

  beforeEach(() => {
    projectsService = new ProjectsService()
    jest.clearAllMocks()
    
    // Setup chain mocking
    mockSupabaseClient.from.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.select.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.eq.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.order.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.insert.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.update.mockReturnValue(mockSupabaseClient)
    mockSupabaseClient.single.mockReturnValue(mockSupabaseClient)
  })

  describe('getProjects', () => {
    it('should fetch all projects with default ordering', async () => {
      const mockProjects = [
        {
          id: '1',
          title: 'MRI 장비 구매',
          category: '의료기기',
          status: 'open',
          created_at: '2024-01-01'
        },
        {
          id: '2',
          title: '병원 시스템 구축',
          category: 'IT',
          status: 'open',
          created_at: '2024-01-02'
        }
      ]

      mockSupabaseClient.order.mockResolvedValue({ 
        data: mockProjects, 
        error: null 
      })

      const projects = await projectsService.getProjects()

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects')
      expect(mockSupabaseClient.order).toHaveBeenCalledWith('created_at', { ascending: false })
      expect(projects).toEqual(mockProjects)
    })

    it('should filter projects by status', async () => {
      const mockProjects = [
        { id: '1', title: 'Test', status: 'closed' }
      ]

      mockSupabaseClient.order.mockResolvedValue({ 
        data: mockProjects, 
        error: null 
      })

      const projects = await projectsService.getProjects({ status: 'closed' })

      expect(mockSupabaseClient.eq).toHaveBeenCalledWith('status', 'closed')
      expect(projects).toEqual(mockProjects)
    })

    it('should return empty array on error', async () => {
      mockSupabaseClient.order.mockResolvedValue({ 
        data: null, 
        error: new Error('Database error') 
      })

      const projects = await projectsService.getProjects()

      expect(projects).toEqual([])
    })
  })

  describe('createProject', () => {
    it('should create a new project', async () => {
      const newProject = {
        title: '새 프로젝트',
        category: '의료기기',
        user_id: 'user-123',
        status: 'open'
      }

      const createdProject = { 
        id: 'project-123', 
        ...newProject,
        created_at: '2024-01-01'
      }

      mockSupabaseClient.single.mockResolvedValue({ 
        data: createdProject, 
        error: null 
      })

      const result = await projectsService.createProject(newProject)

      expect(mockSupabaseClient.from).toHaveBeenCalledWith('projects')
      expect(mockSupabaseClient.insert).toHaveBeenCalledWith(newProject)
      expect(result).toEqual(createdProject)
    })

    it('should throw error when creation fails', async () => {
      const newProject = {
        title: '새 프로젝트',
        user_id: 'user-123'
      }

      mockSupabaseClient.single.mockResolvedValue({ 
        data: null, 
        error: new Error('Insert failed') 
      })

      await expect(projectsService.createProject(newProject)).rejects.toThrow('Insert failed')
    })
  })

  describe('awardProject', () => {
    it('should award project to winning bid', async () => {
      const projectId = 'project-123'
      const bidId = 'bid-456'

      // Mock bid update
      mockSupabaseClient.single.mockResolvedValueOnce({ 
        data: { id: bidId, status: 'accepted' }, 
        error: null 
      })

      // Mock project update
      mockSupabaseClient.single.mockResolvedValueOnce({ 
        data: { id: projectId, status: 'awarded' }, 
        error: null 
      })

      // Mock reject other bids
      mockSupabaseClient.neq = jest.fn().mockReturnValue({
        data: null,
        error: null
      })

      const result = await projectsService.awardProject(projectId, bidId)

      expect(result.bid.status).toBe('accepted')
      expect(result.project.status).toBe('awarded')
    })
  })
})