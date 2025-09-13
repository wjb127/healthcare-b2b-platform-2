"use client";

import { useState, useEffect } from 'react';
import { AuthService } from '@/services/auth.service';
import { ProjectsService } from '@/services/projects.service';
import { BidsService } from '@/services/bids.service';
import { NotificationsService } from '@/services/notifications.service';

// Check if Supabase is configured
const isSupabaseConfigured = () => {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your_supabase_project_url'
  );
};

export function useSupabase() {
  const [isConfigured] = useState(isSupabaseConfigured());
  const [authService] = useState(() => new AuthService());
  const [projectsService] = useState(() => new ProjectsService());
  const [bidsService] = useState(() => new BidsService());
  const [notificationsService] = useState(() => new NotificationsService());
  
  // Check if we're in demo mode
  const [isDemo, setIsDemo] = useState(false);
  
  useEffect(() => {
    const authMode = localStorage.getItem('auth_mode');
    setIsDemo(authMode === 'demo' || !authMode);
  }, []);

  // Return demo mode services if in demo mode OR Supabase is not configured
  if (isDemo || !isConfigured) {
    return {
      isConfigured: false,
      isDemo: true,
      auth: {
        signUp: async () => { throw new Error('Supabase not configured') },
        signIn: async () => { throw new Error('Supabase not configured') },
        signOut: async () => authService.clearDemoUser(),
        getUser: () => authService.getDemoUser(),
        getProfile: () => authService.getDemoUser(),
        selectDemoUser: (role: 'buyer' | 'supplier') => authService.createLocalDemoUser(role)
      },
      projects: {
        getProjects: () => projectsService.getProjectsDemo(),
        getProject: async (id: string) => {
          const projects = await projectsService.getProjectsDemo();
          return projects.find((p: any) => p.id === id);
        },
        createProject: (project: any) => projectsService.createProjectDemo(project),
        updateProject: async (id: string, updates: any) => {
          const projects = await projectsService.getProjectsDemo();
          const index = projects.findIndex((p: any) => p.id === id);
          if (index !== -1) {
            projects[index] = { ...projects[index], ...updates };
            localStorage.setItem('projects', JSON.stringify(projects));
            return projects[index];
          }
          return null;
        },
        deleteProject: async (id: string) => {
          const projects = await projectsService.getProjectsDemo();
          const filtered = projects.filter((p: any) => p.id !== id);
          localStorage.setItem('projects', JSON.stringify(filtered));
        }
      },
      bids: {
        getBidsByProject: (projectId: string) => bidsService.getBidsDemo(projectId),
        getBidsBySupplier: async (supplierId: string) => {
          const bids = await bidsService.getBidsDemo();
          return bids.filter((b: any) => b.supplier_id === supplierId);
        },
        createBid: (bid: any) => bidsService.createBidDemo(bid),
        updateBid: async (id: string, updates: any) => {
          const bids = await bidsService.getBidsDemo();
          const index = bids.findIndex((b: any) => b.id === id);
          if (index !== -1) {
            bids[index] = { ...bids[index], ...updates };
            localStorage.setItem('bids', JSON.stringify(bids));
            return bids[index];
          }
          return null;
        }
      },
      notifications: {
        getNotifications: (userId: string) => notificationsService.getNotificationsDemo(userId),
        getUnreadCount: async (userId: string) => {
          const notifications = await notificationsService.getNotificationsDemo(userId);
          return notifications.filter((n: any) => !n.read).length;
        },
        markAsRead: async (id: string) => {
          const stored = localStorage.getItem('notifications');
          const notifications = stored ? JSON.parse(stored) : [];
          const index = notifications.findIndex((n: any) => n.id === id);
          if (index !== -1) {
            notifications[index].read = true;
            localStorage.setItem('notifications', JSON.stringify(notifications));
          }
        }
      }
    };
  }

  // Return actual Supabase services for production mode
  return {
    isConfigured: true,
    isDemo: false,
    auth: {
      signUp: (email: string, password: string, metadata: any) => authService.signUp(email, password, metadata),
      signIn: (email: string, password: string) => authService.signIn(email, password),
      signOut: () => authService.signOut(),
      getUser: () => authService.getUser(),
      getProfile: async () => {
        // For production mode, return a mock profile based on stored role
        const userRole = localStorage.getItem('user_role');
        const userEmail = localStorage.getItem('user_email');
        return {
          id: 'prod-' + Date.now(),
          email: userEmail || 'user@example.com',
          role: userRole || 'buyer',
          company_name: 'Test Company',
          contact_name: 'Test User'
        };
      },
      selectDemoUser: (role: 'buyer' | 'supplier') => authService.selectDemoUser(role)
    },
    projects: projectsService,
    bids: bidsService,
    notifications: notificationsService
  };
}

export function useAuth() {
  const { auth, isConfigured } = useSupabase();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        if (isConfigured) {
          const profile = await auth.getProfile();
          setUser(profile);
        } else {
          const demoUser = auth.getUser ? auth.getUser() : null;
          setUser(demoUser);
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [auth, isConfigured]);

  return { user, loading, isConfigured };
}