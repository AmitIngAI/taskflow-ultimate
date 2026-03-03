import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Flag, User, Tag, Paperclip, Plus, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import FileUpload from '../FileUpload';

export default function TaskModal() {
  const { taskModalOpen, toggleTaskModal, createTask, teamMembers } = useStore();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee: null,
    dueDate: '',
    tags: [],
  });
  
  const [newTag, setNewTag] = useState('');
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (taskModalOpen) {
      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee: null,
        dueDate: '',
        tags: [],
      });
      setStep(1);
    }
  }, [taskModalOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') toggleTaskModal();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    createTask({
      ...formData,
      assignee: formData.assignee || teamMembers[0],
      dueDate: formData.dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    });
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, newTag.trim()] });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tagToRemove) });
  };

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-500', textColor: 'text-green-400' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500', textColor: 'text-yellow-400' },
    { value: 'high', label: 'High', color: 'bg-red-500', textColor: 'text-red-400' },
  ];

  const statuses = [
    { value: 'todo', label: 'To Do', color: '#3b82f6' },
    { value: 'inprogress', label: 'In Progress', color: '#a855f7' },
    { value: 'review', label: 'Review', color: '#eab308' },
    { value: 'done', label: 'Done', color: '#22c55e' },
  ];

  return (
    <AnimatePresence>
      {taskModalOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleTaskModal}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="w-full max-w-2xl glass-card rounded-3xl shadow-2xl overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div>
                  <h2 className="text-2xl font-bold text-white">Create New Task</h2>
                  <p className="text-white/50 text-sm mt-1">Fill in the details below</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTaskModal}
                  className="p-2 rounded-xl hover:bg-white/10 text-white/70 transition"
                >
                  <X className="w-6 h-6" />
                </motion.button>
              </div>

              {/* Progress Steps */}
              <div className="px-6 py-4 border-b border-white/5">
                <div className="flex items-center justify-between">
                  {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center">
                      <motion.div
                        animate={{
                          backgroundColor: step >= s ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                          scale: step === s ? 1.1 : 1,
                        }}
                        className="w-10 h-10 rounded-full flex items-center justify-center font-semibold text-white"
                      >
                        {step > s ? <Check className="w-5 h-5" /> : s}
                      </motion.div>
                      {s < 3 && (
                        <div className="w-20 md:w-32 h-1 mx-2 rounded-full bg-white/10 overflow-hidden">
                          <motion.div
                            animate={{ width: step > s ? '100%' : '0%' }}
                            className="h-full bg-blue-500"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-2 text-xs text-white/50">
                  <span>Basic Info</span>
                  <span>Details</span>
                  <span>Assign</span>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit}>
                <div className="p-6 max-h-[400px] overflow-y-auto">
                  <AnimatePresence mode="wait">
                    {/* Step 1: Basic Info */}
                    {step === 1 && (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <div>
                          <label className="text-white/80 text-sm mb-2 block">Task Title *</label>
                          <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Enter task title..."
                            className="w-full glass px-4 py-3.5 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition text-lg"
                            autoFocus
                          />
                        </div>

                        <div>
                          <label className="text-white/80 text-sm mb-2 block">Description</label>
                          <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Describe the task..."
                            rows={4}
                            className="w-full glass px-4 py-3.5 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition resize-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 2: Details */}
                    {step === 2 && (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        {/* Priority */}
                        <div>
                          <label className="text-white/80 text-sm mb-3 block flex items-center gap-2">
                            <Flag className="w-4 h-4" /> Priority
                          </label>
                          <div className="flex gap-3">
                            {priorities.map((p) => (
                              <motion.button
                                key={p.value}
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFormData({ ...formData, priority: p.value })}
                                className={`flex-1 py-3 rounded-xl font-medium transition ${
                                  formData.priority === p.value
                                    ? `${p.color} text-white`
                                    : 'glass text-white/70 hover:text-white'
                                }`}
                              >
                                {p.label}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Status */}
                        <div>
                          <label className="text-white/80 text-sm mb-3 block">Status</label>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            {statuses.map((s) => (
                              <motion.button
                                key={s.value}
                                type="button"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setFormData({ ...formData, status: s.value })}
                                className={`py-3 rounded-xl font-medium transition flex items-center justify-center gap-2 ${
                                  formData.status === s.value
                                    ? 'text-white'
                                    : 'glass text-white/70 hover:text-white'
                                }`}
                                style={{
                                  backgroundColor: formData.status === s.value ? s.color : undefined,
                                }}
                              >
                                <div
                                  className="w-2 h-2 rounded-full"
                                  style={{ backgroundColor: s.color }}
                                />
                                {s.label}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Due Date */}
                        <div>
                          <label className="text-white/80 text-sm mb-2 block flex items-center gap-2">
                            <Calendar className="w-4 h-4" /> Due Date
                          </label>
                          <input
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                            className="w-full glass px-4 py-3.5 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                          />
                        </div>

                        {/* Tags */}
                        <div>
                          <label className="text-white/80 text-sm mb-2 block flex items-center gap-2">
                            <Tag className="w-4 h-4" /> Tags
                          </label>
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {formData.tags.map((tag, i) => (
                              <motion.span
                                key={i}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                              >
                                #{tag}
                                <button
                                  type="button"
                                  onClick={() => removeTag(tag)}
                                  className="hover:text-white"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </motion.span>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                              placeholder="Add tag..."
                              className="flex-1 glass px-4 py-2.5 rounded-xl text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition"
                            />
                            <motion.button
                              type="button"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={addTag}
                              className="px-4 py-2.5 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 transition"
                            >
                              <Plus className="w-5 h-5" />
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}

                      {/* File Upload */}
                        <div>
                          <label className="text-white/80 text-sm mb-2 block flex items-center gap-2">
                            <Paperclip className="w-4 h-4" /> Attach Files
                          </label>
                          <FileUpload 
                            taskId={formData._id} // replace with selectedTask?._id if needed
                            onUploadSuccess={(attachments) => {
                              console.log('Uploaded:', attachments);
                              // Optionally update formData or store
                              // setFormData({ ...formData, attachments });
                            }}
                          />
                        </div>
                      </motion.div>
                    )}

                    {/* Step 3: Assign */}
                    {step === 3 && (
                      <motion.div
                        key="step3"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-5"
                      >
                        <div>
                          <label className="text-white/80 text-sm mb-3 block flex items-center gap-2">
                            <User className="w-4 h-4" /> Assign to Team Member
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {teamMembers.map((member) => (
                              <motion.button
                                key={member.id}
                                type="button"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setFormData({ ...formData, assignee: member })}
                                className={`p-4 rounded-xl transition flex items-center gap-4 ${
                                  formData.assignee?.id === member.id
                                    ? 'bg-gradient-to-r from-blue-500/20 to-purple-500/20 ring-2 ring-blue-500/50'
                                    : 'glass hover:bg-white/10'
                                }`}
                              >
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-12 h-12 rounded-xl"
                                />
                                <div className="text-left">
                                  <p className="text-white font-medium">{member.name}</p>
                                  <p className="text-white/50 text-sm">{member.role}</p>
                                </div>
                                {formData.assignee?.id === member.id && (
                                  <Check className="w-5 h-5 text-green-400 ml-auto" />
                                )}
                              </motion.button>
                            ))}
                          </div>
                        </div>

                        {/* Summary */}
                        <div className="glass rounded-xl p-4 mt-6">
                          <h4 className="text-white font-medium mb-3">Task Summary</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-white/50">Title:</span>
                              <span className="text-white">{formData.title || '-'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/50">Priority:</span>
                              <span className={priorities.find(p => p.value === formData.priority)?.textColor}>
                                {formData.priority}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/50">Status:</span>
                              <span className="text-white">{statuses.find(s => s.value === formData.status)?.label}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-white/50">Assignee:</span>
                              <span className="text-white">{formData.assignee?.name || 'Not assigned'}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between p-6 border-t border-white/10">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(Math.max(1, step - 1))}
                    disabled={step === 1}
                    className="px-6 py-3 rounded-xl text-white/70 hover:text-white hover:bg-white/5 transition disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    Back
                  </motion.button>

                  {step < 3 ? (
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setStep(step + 1)}
                      disabled={step === 1 && !formData.title.trim()}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Continue
                    </motion.button>
                  ) : (
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold shadow-lg flex items-center gap-2"
                    >
                      <Check className="w-5 h-5" />
                      Create Task
                    </motion.button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}