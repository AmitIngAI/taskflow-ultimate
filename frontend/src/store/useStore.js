import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Auth Store
export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: (user, token) => {
        console.log('🔐 Login:', user?.email);
        set({ user, token, isAuthenticated: true });
      },
      
      logout: () => {
        console.log('🚪 Logout');
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem('auth-storage');
      },
      
      updateUser: (userData) => {
        set({ user: { ...get().user, ...userData } });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

// Theme Store
export const useThemeStore = create(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => set((state) => ({ 
        theme: state.theme === 'light' ? 'dark' : 'light' 
      })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

// Project Store
export const useProjectStore = create((set, get) => ({
  projects: [],
  selectedProject: null,
  loading: false,
  error: null,

  setProjects: (projects) => {
    console.log('📦 Setting projects:', projects?.length || 0);
    set({ projects: projects || [] });
  },
  
  addProject: (project) => {
    console.log('➕ Adding project:', project?.name);
    set((state) => ({
      projects: [project, ...state.projects]
    }));
  },
  
  updateProject: (projectId, updates) => {
    console.log('✏️ Updating project:', projectId);
    set((state) => ({
      projects: state.projects.map(p => 
        p._id === projectId ? { ...p, ...updates } : p
      ),
      selectedProject: state.selectedProject?._id === projectId 
        ? { ...state.selectedProject, ...updates }
        : state.selectedProject
    }));
  },
  
  deleteProject: (projectId) => {
    console.log('🗑️ Deleting project:', projectId);
    set((state) => ({
      projects: state.projects.filter(p => p._id !== projectId),
      selectedProject: state.selectedProject?._id === projectId 
        ? null 
        : state.selectedProject
    }));
  },
  
  setSelectedProject: (project) => {
    console.log('🎯 Selected project:', project?.name);
    set({ selectedProject: project });
  },
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Get project by ID
  getProjectById: (projectId) => {
    return get().projects.find(p => p._id === projectId);
  },
}));

// Task Store
export const useTaskStore = create((set, get) => ({
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
  filters: {
    search: '',
    priority: null,
    assignee: null,
    status: null,
    projectId: null,
  },
  
  setTasks: (tasks) => set({ tasks }),
  
  addTask: (task) => set((state) => ({
    tasks: [task, ...state.tasks]
  })),
  
  updateTask: (taskId, updates) => set((state) => ({
    tasks: state.tasks.map(task => 
      task._id === taskId ? { ...task, ...updates } : task
    ),
    selectedTask: state.selectedTask?._id === taskId 
      ? { ...state.selectedTask, ...updates } 
      : state.selectedTask
  })),
  
  deleteTask: (taskId) => set((state) => ({
    tasks: state.tasks.filter(task => task._id !== taskId),
    selectedTask: state.selectedTask?._id === taskId ? null : state.selectedTask
  })),
  
  setSelectedTask: (task) => set({ selectedTask: task }),
  
  setFilters: (filters) => set((state) => ({
    filters: { ...state.filters, ...filters }
  })),
  
  clearFilters: () => set({
    filters: {
      search: '',
      priority: null,
      assignee: null,
      status: null,
      projectId: null,
    }
  }),
  
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
  
  // Get tasks by status (for Kanban)
  getTasksByStatus: (status) => {
    return get().tasks.filter(task => task.status === status);
  },
  
  // Get filtered tasks
  getFilteredTasks: () => {
    const { tasks, filters } = get();
    return tasks.filter(task => {
      if (filters.search && !task.title.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.priority && task.priority !== filters.priority) {
        return false;
      }
      if (filters.status && task.status !== filters.status) {
        return false;
      }
      if (filters.projectId && task.project?._id !== filters.projectId) {
        return false;
      }
      return true;
    });
  }
}));

// Modal Store
export const useModalStore = create((set) => ({
  taskModalOpen: false,
  projectModalOpen: false,
  analyticsModalOpen: false,
  searchModalOpen: false,
  
  openTaskModal: () => set({ taskModalOpen: true }),
  closeTaskModal: () => set({ taskModalOpen: false }),
  
  openProjectModal: () => set({ projectModalOpen: true }),
  closeProjectModal: () => set({ projectModalOpen: false }),
  
  openAnalyticsModal: () => set({ analyticsModalOpen: true }),
  closeAnalyticsModal: () => set({ analyticsModalOpen: false }),
  
  openSearchModal: () => set({ searchModalOpen: true }),
  closeSearchModal: () => set({ searchModalOpen: false }),
}));

// Notification Store
export const useNotificationStore = create((set) => ({
  notifications: [],
  unreadCount: 0,
  
  addNotification: (notification) => set((state) => ({
    notifications: [notification, ...state.notifications],
    unreadCount: state.unreadCount + 1
  })),
  
  markAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    ),
    unreadCount: Math.max(0, state.unreadCount - 1)
  })),
  
  markAllAsRead: () => set((state) => ({
    notifications: state.notifications.map(n => ({ ...n, read: true })),
    unreadCount: 0
  })),
  
  clearNotifications: () => set({ 
    notifications: [], 
    unreadCount: 0 
  }),
}));