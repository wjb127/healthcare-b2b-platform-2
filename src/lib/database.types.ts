export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string | null
          company_name: string | null
          contact_name: string | null
          role: 'buyer' | 'supplier' | 'both' | null
          is_demo: boolean
          created_at: string
        }
        Insert: {
          id?: string
          email?: string | null
          company_name?: string | null
          contact_name?: string | null
          role?: 'buyer' | 'supplier' | 'both' | null
          is_demo?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          company_name?: string | null
          contact_name?: string | null
          role?: 'buyer' | 'supplier' | 'both' | null
          is_demo?: boolean
          created_at?: string
        }
      }
      projects: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string | null
          region: string | null
          budget_range: string | null
          deadline: string | null
          requirements: string | null
          status: 'open' | 'closed' | 'awarded'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category?: string | null
          region?: string | null
          budget_range?: string | null
          deadline?: string | null
          requirements?: string | null
          status?: 'open' | 'closed' | 'awarded'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string | null
          region?: string | null
          budget_range?: string | null
          deadline?: string | null
          requirements?: string | null
          status?: 'open' | 'closed' | 'awarded'
          created_at?: string
          updated_at?: string
        }
      }
      project_files: {
        Row: {
          id: string
          project_id: string
          file_name: string | null
          file_url: string | null
          file_size: number | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          project_id: string
          file_name?: string | null
          file_url?: string | null
          file_size?: number | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          file_name?: string | null
          file_url?: string | null
          file_size?: number | null
          uploaded_at?: string
        }
      }
      bids: {
        Row: {
          id: string
          project_id: string
          supplier_id: string
          price: number | null
          delivery_days: number | null
          comment: string | null
          status: 'submitted' | 'accepted' | 'rejected'
          score: number | null
          created_at: string
        }
        Insert: {
          id?: string
          project_id: string
          supplier_id: string
          price?: number | null
          delivery_days?: number | null
          comment?: string | null
          status?: 'submitted' | 'accepted' | 'rejected'
          score?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          supplier_id?: string
          price?: number | null
          delivery_days?: number | null
          comment?: string | null
          status?: 'submitted' | 'accepted' | 'rejected'
          score?: number | null
          created_at?: string
        }
      }
      bid_files: {
        Row: {
          id: string
          bid_id: string
          file_name: string | null
          file_url: string | null
          uploaded_at: string
        }
        Insert: {
          id?: string
          bid_id: string
          file_name?: string | null
          file_url?: string | null
          uploaded_at?: string
        }
        Update: {
          id?: string
          bid_id?: string
          file_name?: string | null
          file_url?: string | null
          uploaded_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          type: string | null
          title: string | null
          message: string | null
          read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          type?: string | null
          title?: string | null
          message?: string | null
          read?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          type?: string | null
          title?: string | null
          message?: string | null
          read?: boolean
          created_at?: string
        }
      }
    }
  }
}