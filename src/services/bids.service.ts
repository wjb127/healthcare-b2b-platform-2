import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type Bid = Database['public']['Tables']['bids']['Row']
type BidInsert = Database['public']['Tables']['bids']['Insert']
type BidUpdate = Database['public']['Tables']['bids']['Update']

export class BidsService {
  private supabase = createClient()

  async getBidsByProject(projectId: string) {
    const { data, error } = await this.supabase
      .from('bids')
      .select(`
        *,
        users!bids_supplier_id_fkey (
          id,
          company_name,
          contact_name,
          email
        )
      `)
      .eq('project_id', projectId)
      .order('score', { ascending: false, nullsFirst: false })

    if (error) {
      console.error('Error fetching bids:', error)
      return []
    }
    return data || []
  }

  async getBidsBySupplier(supplierId: string) {
    const { data, error } = await this.supabase
      .from('bids')
      .select(`
        *,
        projects!bids_project_id_fkey (
          id,
          title,
          category,
          deadline,
          status
        )
      `)
      .eq('supplier_id', supplierId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching supplier bids:', error)
      return []
    }
    return data || []
  }

  async getBid(id: string) {
    const { data, error } = await this.supabase
      .from('bids')
      .select(`
        *,
        users!bids_supplier_id_fkey (
          id,
          company_name,
          contact_name,
          email
        ),
        projects!bids_project_id_fkey (
          id,
          title,
          category,
          deadline,
          requirements,
          user_id
        )
      `)
      .eq('id', id)
      .single()

    if (error) {
      console.error('Error fetching bid:', error)
      return null
    }
    return data
  }

  async createBid(bid: BidInsert) {
    // Check if supplier already submitted a bid for this project
    const { data: existing } = await this.supabase
      .from('bids')
      .select('id')
      .eq('project_id', bid.project_id)
      .eq('supplier_id', bid.supplier_id)
      .single()

    if (existing) {
      throw new Error('이미 이 프로젝트에 입찰하셨습니다.')
    }

    const { data, error } = await this.supabase
      .from('bids')
      .insert({
        ...bid,
        status: 'submitted',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating bid:', error)
      throw error
    }

    return data
  }

  async updateBid(id: string, updates: BidUpdate) {
    const { data, error } = await this.supabase
      .from('bids')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating bid:', error)
      throw error
    }

    return data
  }

  async withdrawBid(id: string) {
    const { data, error } = await this.supabase
      .from('bids')
      .update({ 
        status: 'rejected'
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error withdrawing bid:', error)
      throw error
    }
    return data
  }


  // Demo mode fallback
  async getBidsDemo(projectId?: string) {
    const stored = localStorage.getItem('bids')
    const bids = stored ? JSON.parse(stored) : []
    return projectId ? bids.filter((b: any) => b.project_id === projectId) : bids
  }

  async createBidDemo(bid: any) {
    const bids = await this.getBidsDemo()
    const newBid = {
      ...bid,
      id: `bid-${Date.now()}`,
      created_at: new Date().toISOString(),
      submitted_at: new Date().toISOString(),
      score: Math.floor(Math.random() * 30) + 70
    }
    bids.push(newBid)
    localStorage.setItem('bids', JSON.stringify(bids))
    return newBid
  }
}