import api from './api';

export const taskService = {
  // Get all tasks (with optional filters)
  getTasks: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      if (filters.projectId) params.append('projectId', filters.projectId);
      if (filters.status) params.append('status', filters.status);
      if (filters.priority) params.append('priority', filters.priority);
      
      const { data } = await api.get(`/tasks?${params.toString()}`);
      console.log('✅ Tasks fetched:', data);
      return data.data || [];
    } catch (error) {
      console.error('❌ Get tasks error:', error);
      throw error;
    }
  },

  // Get single task
  getTask: async (id) => {
    try {
      const { data } = await api.get(`/tasks/${id}`);
      return data.data;
    } catch (error) {
      console.error('❌ Get task error:', error);
      throw error;
    }
  },

  // Create new task
  createTask: async (taskData) => {
    try {
      console.log('📝 Creating task:', taskData);
      const { data } = await api.post('/tasks', taskData);
      console.log('✅ Task created:', data);
      return data.data;
    } catch (error) {
      console.error('❌ Create task error:', error);
      throw error;
    }
  },

  // Update task
  updateTask: async (id, updates) => {
    try {
      console.log('📝 Updating task:', id, updates);
      const { data } = await api.put(`/tasks/${id}`, updates);
      console.log('✅ Task updated:', data);
      return data.data;
    } catch (error) {
      console.error('❌ Update task error:', error);
      throw error;
    }
  },

  // Delete task
  deleteTask: async (id) => {
    try {
      console.log('🗑️ Deleting task:', id);
      const { data } = await api.delete(`/tasks/${id}`);
      console.log('✅ Task deleted');
      return data;
    } catch (error) {
      console.error('❌ Delete task error:', error);
      throw error;
    }
  },

  // Update task status (for drag & drop)
  updateTaskStatus: async (id, status) => {
    try {
      console.log('📝 Updating task status:', id, status);
      const { data } = await api.patch(`/tasks/${id}/status`, { status });
      console.log('✅ Task status updated:', data);
      return data.data;
    } catch (error) {
      console.error('❌ Update status error:', error);
      throw error;
    }
  },

  // Add comment
  addComment: async (taskId, comment) => {
    try {
      const { data } = await api.post(`/tasks/${taskId}/comments`, { comment });
      return data.data;
    } catch (error) {
      console.error('❌ Add comment error:', error);
      throw error;
    }
  },

  // Add time tracking
  addTimeTracking: async (taskId, timeData) => {
    try {
      const { data } = await api.post(`/tasks/${taskId}/time`, timeData);
      return data.data;
    } catch (error) {
      console.error('❌ Add time error:', error);
      throw error;
    }
  },
};