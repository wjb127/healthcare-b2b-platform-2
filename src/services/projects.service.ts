import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type Project = Database['public']['Tables']['projects']['Row']
type ProjectInsert = Database['public']['Tables']['projects']['Insert']
type ProjectUpdate = Database['public']['Tables']['projects']['Update']

export class ProjectsService {
  private supabase = createClient()

  async getProjects(filters?: {
    status?: string
    user_id?: string
    category?: string
  }) {
    let query = this.supabase
      .from('projects')
      .select(`
        *,
        users!projects_user_id_fkey (
          id,
          company_name,
          contact_name
        ),
        bids (
          id,
          supplier_id,
          price,
          status
        )
      `)
      .order('created_at', { ascending: false })

    if (filters?.status) {
      query = query.eq('status', filters.status)
    }
    if (filters?.user_id) {
      query = query.eq('user_id', filters.user_id)
    }
    if (filters?.category) {
      query = query.eq('category', filters.category)
    }

    const { data, error } = await query
    if (error) {
      console.error('Error fetching projects:', error)
      return []
    }
    return data || []
  }

  async getProject(id: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .select(`
        *,
        users!projects_user_id_fkey (
          id,
          company_name,
          contact_name,
          email
        ),
        bids (
          *,
          users!bids_supplier_id_fkey (
            id,
            company_name,
            contact_name
          )
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching project:', error)
      return null
    }

    return data
  }

  async createProject(project: ProjectInsert) {
    const { data, error } = await this.supabase
      .from('projects')
      .insert(project)
      .select()
      .single()

    if (error) {
      console.error('Error creating project:', error)
      throw error
    }

    return data
  }

  async updateProject(id: string, updates: ProjectUpdate) {
    const { data, error } = await this.supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating project:', error)
      throw error
    }
    return data
  }

  async deleteProject(id: string) {
    const { error } = await this.supabase
      .from('projects')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting project:', error)
      throw error
    }
  }

  async closeProject(id: string) {
    const { data, error } = await this.supabase
      .from('projects')
      .update({ 
        status: 'closed',
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error closing project:', error)
      throw error
    }

    return data
  }

  async awardProject(projectId: string, bidId: string) {
    // Update winning bid
    const { data: bid, error: bidError } = await this.supabase
      .from('bids')
      .update({ 
        status: 'accepted'
      })
      .eq('id', bidId)
      .select()
      .single()

    if (bidError) {
      console.error('Error accepting bid:', bidError)
      throw bidError
    }

    // Update project status
    const { data: project, error: projectError } = await this.supabase
      .from('projects')
      .update({ 
        status: 'awarded',
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .select()
      .single()

    if (projectError) {
      console.error('Error awarding project:', projectError)
      throw projectError
    }

    // Reject other bids
    await this.supabase
      .from('bids')
      .update({ status: 'rejected' })
      .eq('project_id', projectId)
      .neq('id', bidId)

    return { project, bid }
  }


  // Demo mode fallback - use localStorage
  async getProjectsDemo() {
    const stored = localStorage.getItem('projects')
    return stored ? JSON.parse(stored) : []
  }

  async createProjectDemo(project: any) {
    const projects = await this.getProjectsDemo()
    const newProject = {
      ...project,
      id: `proj-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      view_count: 0
    }
    projects.push(newProject)
    localStorage.setItem('projects', JSON.stringify(projects))
    return newProject
  }
}