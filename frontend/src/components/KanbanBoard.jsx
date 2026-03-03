import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, MoreVertical, MessageSquare, Paperclip, Clock, FolderKanban, GripVertical, Trash2, Edit } from 'lucide-react';
import { useStore } from '../store/useStore';

export default function KanbanBoard() {
  const { tasks, updateTask, deleteTask, toggleTaskModal } = useStore();
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [taskMenuOpen, setTaskMenuOpen] = useState(null);

  const columns = {
    todo: { title: 'To Do', color: '#3b82f6', emoji: '📋' },
    inprogress: { title: 'In Progress', color: '#a855f7', emoji: '🔄' },
    review: { title: 'Review', color: '#eab308', emoji: '👀' },
    done: { title: 'Done', color: '#22c55e', emoji: '✅' },
  };

  const getColumnTasks = (status) => tasks.filter(t => t.status === status);

  // Drag handlers
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    // Add drag image styling
    e.target.style.opacity = '0.5';
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, columnId) => {
    e.preventDefault();
    if (draggedTask && draggedTask.status !== columnId) {
      updateTask(draggedTask._id, { status: columnId });
    }
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {Object.entries(columns).map(([columnId, column], colIndex) => {
        const columnTasks = getColumnTasks(columnId);
        const isOver = dragOverColumn === columnId;

        return (
          <motion.div
            key={columnId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: colIndex * 0.1 }}
            className="flex flex-col"
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 px-1">
              <div className="flex items-center gap-3">
                <span className="text-xl">{column.emoji}</span>
                <h3 className="font-semibold text-white">{column.title}</h3>
                <span 
                  className="text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{ backgroundColor: `${column.color}20`, color: column.color }}
                >
                  {columnTasks.length}
                </span>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleTaskModal}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>

            {/* Drop Zone */}
            <div
              onDragOver={(e) => handleDragOver(e, columnId)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, columnId)}
              className={`flex-1 glass rounded-2xl p-3 space-y-3 min-h-[300px] transition-all duration-300 ${
                isOver 
                  ? 'ring-2 ring-blue-500/50 bg-blue-500/5 scale-[1.02]' 
                  : ''
              }`}
            >
              <AnimatePresence>
                {columnTasks.map((task, taskIndex) => (
                  <motion.div
                    key={task._id}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8, y: -20 }}
                    transition={{ delay: taskIndex * 0.05 }}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task)}
                    onDragEnd={handleDragEnd}
                    whileHover={{ scale: 1.02, y: -2 }}
                    className={`glass-card p-4 rounded-xl cursor-grab active:cursor-grabbing group relative overflow-hidden ${
                      draggedTask?._id === task._id ? 'opacity-50' : ''
                    }`}
                  >
                    {/* Drag Handle */}
                    <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition">
                      <GripVertical className="w-4 h-4 text-white/30" />
                    </div>

                    {/* Priority Badge & Menu */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                      
                      <div className="relative">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTaskMenuOpen(taskMenuOpen === task._id ? null : task._id);
                          }}
                          className="p-1 rounded-lg hover:bg-white/10 text-white/50 opacity-0 group-hover:opacity-100 transition"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </motion.button>

                        {/* Task Menu */}
                        <AnimatePresence>
                          {taskMenuOpen === task._id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.9, y: -10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.9, y: -10 }}
                              className="absolute right-0 top-8 glass-card rounded-xl p-2 shadow-xl z-10 min-w-[140px]"
                            >
                              <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition text-sm">
                                <Edit className="w-4 h-4" />
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  deleteTask(task._id);
                                  setTaskMenuOpen(null);
                                }}
                                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 transition text-sm"
                              >
                                <Trash2 className="w-4 h-4" />
                                Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Title & Description */}
                    <h4 className="font-semibold text-white mb-2 line-clamp-2 pl-4">{task.title}</h4>
                    <p className="text-sm text-white/50 line-clamp-2 mb-4 pl-4">{task.description}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4 pl-4">
                      {task.tags?.slice(0, 2).map((tag, i) => (
                        <span
                          key={i}
                          className="text-xs bg-white/5 text-white/60 px-2 py-1 rounded-lg border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                      {task.tags?.length > 2 && (
                        <span className="text-xs text-white/40">+{task.tags.length - 2}</span>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4 pl-4">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-white/50">Progress</span>
                        <span className="text-white font-medium">{task.progress}%</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${task.progress}%` }}
                          transition={{ delay: 0.3, duration: 0.5 }}
                          className="h-full rounded-full"
                          style={{
                            background: `linear-gradient(90deg, ${column.color}, ${column.color}88)`
                          }}
                        />
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pl-4">
                      <div className="flex items-center gap-2">
                        <img
                          src={task.assignee?.avatar}
                          alt=""
                          className="w-7 h-7 rounded-lg ring-2 ring-white/10"
                        />
                        <span className="text-xs text-white/50">{task.assignee?.name?.split(' ')[0]}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white/40">
                        <div className="flex items-center gap-1 text-xs">
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{task.comments}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs">
                          <Paperclip className="w-3.5 h-3.5" />
                          <span>{task.attachments}</span>
                        </div>
                      </div>
                    </div>

                    {/* Hover Glow Effect */}
                    <div 
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{
                        background: `radial-gradient(circle at 50% 50%, ${column.color}10 0%, transparent 70%)`
                      }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Empty State */}
              {columnTasks.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`flex flex-col items-center justify-center h-48 text-white/30 transition-all ${
                    isOver ? 'text-blue-400 scale-105' : ''
                  }`}
                >
                  <FolderKanban className={`w-12 h-12 mb-3 ${isOver ? 'animate-bounce' : ''}`} />
                  <p className="text-sm font-medium">
                    {isOver ? 'Drop here!' : 'No tasks'}
                  </p>
                  <p className="text-xs mt-1">
                    {isOver ? '' : 'Drag tasks or create new'}
                  </p>
                </motion.div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}