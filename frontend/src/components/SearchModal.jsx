import { useState, useEffect, useRef } from 'react';
import { Search, Clock, TrendingUp } from 'lucide-react';
import { Modal } from './common';
import { useModalStore, useTaskStore } from '../store/useStore';
import { motion } from 'framer-motion';

const SearchModal = () => {
  const { searchModalOpen, closeSearchModal } = useModalStore();
  const { tasks, setSelectedTask } = useTaskStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    if (searchModalOpen) {
      inputRef.current?.focus();
    }
  }, [searchModalOpen]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(query.toLowerCase()) ||
          task.description?.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query, tasks]);

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    closeSearchModal();
    // Open task modal
  };

  const recentSearches = ['Bug fixes', 'UI improvements', 'Documentation'];

  return (
    <Modal
      isOpen={searchModalOpen}
      onClose={closeSearchModal}
      title=""
      size="lg"
      className="!p-0"
    >
      {/* Search Input */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-700">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search tasks..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-transparent text-lg focus:outline-none"
          />
        </div>
      </div>

      {/* Results */}
      <div className="max-h-96 overflow-y-auto p-2">
        {query.trim() ? (
          results.length > 0 ? (
            <div className="space-y-1">
              {results.map((task) => (
                <motion.button
                  key={task.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onClick={() => handleSelectTask(task)}
                  className="w-full p-3 text-left hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
                >
                  <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                    {task.title}
                  </h4>
                  {task.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1">
                      {task.description}
                    </p>
                  )}
                </motion.button>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-gray-500">
              No tasks found
            </div>
          )
        ) : (
          <div className="p-4 space-y-4">
            {/* Recent Searches */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Recent Searches
              </h3>
              <div className="space-y-1">
                {recentSearches.map((search, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuery(search)}
                    className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
                  >
                    {search}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Trending
              </h3>
              <div className="space-y-1">
                <button className="block w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg">
                  Sprint Planning
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SearchModal;