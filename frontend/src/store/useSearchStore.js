import { create } from 'zustand';

export const useSearchStore = create((set, get) => ({
  searchQuery: '',
  searchHistory: [],
  savedFilters: [],
  searchResults: [],
  isSearching: false,
  
  // Actions
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  addToHistory: (query) => {
    const { searchHistory } = get();
    const newHistory = [query, ...searchHistory.filter(q => q !== query)].slice(0, 10);
    set({ searchHistory: newHistory });
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));
  },
  
  saveFilter: (filter) => {
    const { savedFilters } = get();
    set({ savedFilters: [...savedFilters, { ...filter, id: Date.now() }] });
  },
  
  deleteFilter: (id) => {
    const { savedFilters } = get();
    set({ savedFilters: savedFilters.filter(f => f.id !== id) });
  },
  
  setSearchResults: (results) => set({ searchResults: results }),
  setIsSearching: (isSearching) => set({ isSearching }),
}));