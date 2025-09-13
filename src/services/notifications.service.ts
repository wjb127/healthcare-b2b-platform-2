import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

type Notification = Database['public']['Tables']['notifications']['Row']

export class NotificationsService {
  private supabase = createClient()

  async getNotifications(userId: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data
  }

  async getUnreadCount(userId: string) {
    const { count, error } = await this.supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
    return count || 0
  }

  async markAsRead(id: string) {
    const { data, error } = await this.supabase
      .from('notifications')
      .update({ 
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async markAllAsRead(userId: string) {
    const { error } = await this.supabase
      .from('notifications')
      .update({ 
        read: true,
        read_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('read', false)

    if (error) throw error
  }

  async deleteNotification(id: string) {
    const { error } = await this.supabase
      .from('notifications')
      .delete()
      .eq('id', id)

    if (error) throw error
  }

  // Subscribe to real-time notifications
  subscribeToNotifications(userId: string, callback: (notification: Notification) => void) {
    const channel = this.supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback(payload.new as Notification)
        }
      )
      .subscribe()

    return () => {
      this.supabase.removeChannel(channel)
    }
  }

  // Demo mode fallback
  async getNotificationsDemo(userId: string) {
    const stored = localStorage.getItem('notifications')
    const notifications = stored ? JSON.parse(stored) : []
    return notifications.filter((n: any) => n.user_id === userId)
  }

  async createNotificationDemo(notification: any) {
    const notifications = await this.getNotificationsDemo('')
    const newNotification = {
      ...notification,
      id: `notif-${Date.now()}`,
      created_at: new Date().toISOString(),
      read: false
    }
    notifications.push(newNotification)
    localStorage.setItem('notifications', JSON.stringify(notifications))
    return newNotification
  }
}