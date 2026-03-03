import api from './api';

export const projectService = {
  // Get all projects
  getProjects: async () => {
    try {
      console.log('📡 Fetching projects...');
      const { data } = await api.get('/projects');
      console.log('✅ Projects response:', data);
      return data.data || [];
    } catch (error) {
      console.error('❌ Get projects error:', error);
      throw error;
    }
  },

  // Get single project with tasks
  getProject: async (id) => {
    try {
      const { data } = await api.get(`/projects/${id}`);
      return data.data;
    } catch (error) {
      console.error('❌ Get project error:', error);
      throw error;
    }
  },

  // Create new project
  createProject: async (projectData) => {
    try {
      console.log('📡 Creating project:', projectData);
      const { data } = await api.post('/projects', projectData);
      console.log('✅ Create project response:', data);
      return data.data;
    } catch (error) {
      console.error('❌ Create project error:', error);
      throw error;
    }
  },

  // Update project
  updateProject: async (id, updates) => {
    try {
      const { data } = await api.put(`/projects/${id}`, updates);
      return data.data;
    } catch (error) {
      console.error('❌ Update project error:', error);
      throw error;
    }
  },

  // Delete project
  deleteProject: async (id) => {
    try {
      const { data } = await api.delete(`/projects/${id}`);
      return data;
    } catch (error) {
      console.error('❌ Delete project error:', error);
      throw error;
    }
  },

  // Toggle star
  toggleStar: async (id) => {
    try {
      const { data } = await api.patch(`/projects/${id}/star`);
      return data.data;
    } catch (error) {
      console.error('❌ Toggle star error:', error);
      throw error;
    }
  },

  // Toggle archive
  toggleArchive: async (id) => {
    try {
      const { data } = await api.patch(`/projects/${id}/archive`);
      return data.data;
    } catch (error) {
      console.error('❌ Toggle archive error:', error);
      throw error;
    }
  },

  // Add member
  addMember: async (projectId, userId, role = 'member') => {
    try {
      const { data } = await api.post(`/projects/${projectId}/members`, { userId, role });
      return data.data;
    } catch (error) {
      console.error('❌ Add member error:', error);
      throw error;
    }
  },

  // Remove member
  removeMember: async (projectId, userId) => {
    try {
      const { data } = await api.delete(`/projects/${projectId}/members/${userId}`);
      return data.data;
    } catch (error) {
      console.error('❌ Remove member error:', error);
      throw error;
    }
  },
};