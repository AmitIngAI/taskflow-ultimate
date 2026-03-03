import api from './api';

// Fuzzy search implementation
const fuzzyMatch = (text, query) => {
  const textLower = text.toLowerCase();
  const queryLower = query.toLowerCase();
  
  let textIndex = 0;
  let queryIndex = 0;
  let score = 0;
  
  while (textIndex < textLower.length && queryIndex < queryLower.length) {
    if (textLower[textIndex] === queryLower[queryIndex]) {
      score++;
      queryIndex++;
    }
    textIndex++;
  }
  
  return queryIndex === queryLower.length ? score / textLower.length : 0;
};

export const searchService = {
  // Global search
  globalSearch: async (query, filters = {}) => {
    try {
      const response = await api.get('/search', {
        params: { q: query, ...filters }
      });
      return response.data;
    } catch (error) {
      console.error('Search error:', error);
      throw error;
    }
  },
  
  // Local fuzzy search
  fuzzySearch: (items, query, keys) => {
    return items
      .map(item => ({
        item,
        score: Math.max(...keys.map(key => fuzzyMatch(item[key] || '', query)))
      }))
      .filter(result => result.score > 0.3)
      .sort((a, b) => b.score - a.score)
      .map(result => result.item);
  },
  
  // Search tasks
  searchTasks: async (query, filters) => {
    const response = await api.get('/tasks', {
      params: { search: query, ...filters }
    });
    return response.data;
  },
  
  // Search projects
  searchProjects: async (query) => {
    const response = await api.get('/projects', {
      params: { search: query }
    });
    return response.data;
  },
  
  // Search users
  searchUsers: async (query) => {
    const response = await api.get('/users', {
      params: { search: query }
    });
    return response.data;
  },
};