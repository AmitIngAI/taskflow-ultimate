import { useState } from 'react';
import { Sparkles, Lightbulb, TrendingUp, AlertTriangle, Loader2, X } from 'lucide-react';
import { Button, Card, Badge } from '../common';
import { aiService } from '../../services/aiService';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const AISuggestions = ({ onAcceptSuggestion }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [blockers, setBlockers] = useState([]);

  const loadSuggestions = async () => {
    setLoading(true);
    try {
      const [taskSuggestions, detectedBlockers] = await Promise.all([
        aiService.suggestTasks({ project: 'TaskFlow' }),
        aiService.detectBlockers([]),
      ]);
      setSuggestions(taskSuggestions);
      setBlockers(detectedBlockers);
    } catch (error) {
      toast.error('Failed to load AI suggestions');
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (suggestions.length === 0) {
      loadSuggestions();
    }
  };

  const handleAccept = (suggestion) => {
    onAcceptSuggestion(suggestion);
    toast.success('Task added to your board!');
  };

  return (
    <>
      {/* AI Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleOpen}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full shadow-2xl shadow-primary-500/50 flex items-center justify-center hover:shadow-primary-500/70 transition-all z-40 group"
      >
        <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      {/* AI Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            />

            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 20 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[480px] bg-white dark:bg-dark-800 shadow-2xl z-50 overflow-y-auto"
            >
              {/* Header */}
              <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 z-10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">AI Assistant</h2>
                      <p className="text-sm text-purple-100">Smart suggestions for your project</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-10 h-10 text-purple-600 animate-spin mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">
                      Analyzing your project...
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Blockers */}
                    {blockers.length > 0 && (
                      <div>
                        <div className="flex items-center gap-2 mb-4">
                          <AlertTriangle className="w-5 h-5 text-red-600" />
                          <h3 className="font-semibold text-gray-900 dark:text-white">
                            Potential Blockers
                          </h3>
                        </div>
                        <div className="space-y-3">
                          {blockers.map((blocker, idx) => (
                            <motion.div
                              key={idx}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: idx * 0.1 }}
                              className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
                            >
                              <div className="flex items-start justify-between mb-2">
                                <Badge variant="danger" size="sm">
                                  {blocker.severity.toUpperCase()}
                                </Badge>
                                <span className="text-xs text-red-600 dark:text-red-400">
                                  {blocker.affectedTasks} tasks
                                </span>
                              </div>
                              <p className="text-sm text-gray-900 dark:text-white font-medium">
                                {blocker.message}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Task Suggestions */}
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <Lightbulb className="w-5 h-5 text-yellow-600" />
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Suggested Tasks
                        </h3>
                      </div>
                      <div className="space-y-3">
                        {suggestions.map((suggestion, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: blockers.length * 0.1 + idx * 0.1 }}
                          >
                            <Card className="hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="font-semibold text-gray-900 dark:text-white">
                                  {suggestion.title}
                                </h4>
                                <Badge variant="info" size="sm">
                                  {suggestion.estimatedTime}
                                </Badge>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                                {suggestion.description}
                              </p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <TrendingUp className="w-4 h-4 text-purple-600" />
                                  <span className="text-xs text-gray-500">
                                    {suggestion.reasoning}
                                  </span>
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => handleAccept(suggestion)}
                                >
                                  Add Task
                                </Button>
                              </div>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </div>

                    {/* Refresh Button */}
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={loadSuggestions}
                      icon={Sparkles}
                    >
                      Generate New Suggestions
                    </Button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default AISuggestions;