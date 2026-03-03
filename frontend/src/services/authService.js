import api from './api';

export const authService = {
  login: async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data.data; // Return data.data (nested structure from backend)
  },

  register: async (userData) => {
    const { data } = await api.post('/auth/register', userData);
    return data.data;
  },

  logout: async () => {
    // Clear local storage
    localStorage.clear();
    return { success: true };
  },

  getProfile: async () => {
    const { data } = await api.get('/auth/profile');
    return data.data;
  },

  updateProfile: async (updates) => {
    const { data } = await api.put('/auth/profile', updates);
    return data.data;
  },

  changePassword: async (oldPassword, newPassword) => {
    const { data } = await api.post('/auth/change-password', {
      oldPassword,
      newPassword,
    });
    return data;
  },
};