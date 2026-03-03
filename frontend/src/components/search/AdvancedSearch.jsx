import { useState, useEffect, useCallback } from 'react';
import { Search, Filter, Clock, Star, X } from 'lucide-react';
import { useSearchStore } from '../../store/useSearchStore';
import { searchService } from '../../services/searchService';
import { debounce } from '../../utils/helpers';

const AdvancedSearch = ({ isOpen, onClose }) => {
  const {
    searchQuery,
    searchHistory,
    savedFilters,
    searchResults,
    isSearching,
    setSearchQuery,
    addToHistory,
    saveFilter,
    deleteFilter,
    setSearchResults,
    setIsSearching,
  } = useSearchStore();

  const [filters, setFilters] = useState({
    type: 'all', // all, tasks, projects, users
    status: '',
    priority: '',
    assignee: '',
    dateRange: '',
  });

  const [activeTab, setActiveTab] = useState('all');

  // Debounced search
  const performSearch = useCallback(
    debounce(async (query, currentFilters) => {
      if (!query.trim()) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const results = await searchService.globalSearch(query, currentFilters);
        setSearchResults(results);
        addToHistory(query);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300),
    []
  );

  useEffect(() => {
    performSearch(searchQuery, filters);
  }, [searchQuery, filters]);

  const handleSaveFilter = () => {
    const filterName = prompt('Filter name:');
    if (filterName) {
      saveFilter({ name: filterName, ...filters });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-2xl w-full max-w-3xl mx-4">
        {/* Search Header */}
        <div className="p-4 border-b border-gray-200 dark:border-dark-700">
          <div className="flex items-center gap-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tasks, projects, or users... (Cmd+K)"
              className="flex-1 bg-transparent outline-none text-lg"
              autoFocus
            />
            <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 mt-4 flex-wrap">
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm"
            >
              <option value="all">All</option>
              <option value="tasks">Tasks</option>
              <option value="projects">Projects</option>
              <option value="users">Users</option>
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm"
            >
              <option value="">Any Status</option>
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>

            <select
              value={filters.priority}
              onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-dark-600 bg-white dark:bg-dark-700 text-sm"
            >
              <option value="">Any Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button
              onClick={handleSaveFilter}
              className="px-3 py-1 bg-primary-500 text-white rounded-lg text-sm hover:bg-primary-600"
            >
              <Star className="w-4 h-4" />
            </button>
          </div>

          {/* Saved Filters */}
          {savedFilters.length > 0 && (
            <div className="mt-3 flex gap-2 flex-wrap">
              {savedFilters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setFilters(filter)}
                  className="px-3 py-1 bg-gray-100 dark:bg-dark-700 rounded-full text-sm flex items-center gap-2 hover:bg-gray-200 dark:hover:bg-dark-600"
                >
                  {filter.name}
                  <X
                    className="w-3 h-3"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFilter(filter.id);
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-8 text-center text-gray-500">Searching...</div>
          ) : searchResults.length === 0 && searchQuery ? (
            <div className="p-8 text-center text-gray-500">No results found</div>
          ) : (
            <div className="p-4">
              {/* Tasks */}
              {searchResults.tasks?.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">TASKS</h3>
                  {searchResults.tasks.map((task) => (
                    <div
                      key={task._id}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg cursor-pointer"
                    >
                      <div className="font-medium">{task.title}</div>
                      <div className="text-sm text-gray-500">{task.description}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {searchResults.projects?.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-semibold text-gray-500 mb-2">PROJECTS</h3>
                  {searchResults.projects.map((project) => (
                    <div
                      key={project._id}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg cursor-pointer"
                    >
                      <div className="font-medium">{project.name}</div>
                      <div className="text-sm text-gray-500">{project.description}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Search History */}
              {!searchQuery && searchHistory.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 mb-2 flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    RECENT SEARCHES
                  </h3>
                  {searchHistory.map((query, index) => (
                    <div
                      key={index}
                      onClick={() => setSearchQuery(query)}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-dark-700 rounded-lg cursor-pointer text-gray-600"
                    >
                      {query}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Keyboard Shortcuts Help */}
        <div className="p-3 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900 text-xs text-gray-500">
          <span className="font-semibold">Tip:</span> Use ↑↓ to navigate, Enter to select, Esc to close
        </div>
      </div>
    </div>
  );
};

export default AdvancedSearch;