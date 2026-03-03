import { useState, useEffect } from 'react';
import { 
  X, 
  Calendar, 
  Loader2
} from 'lucide-react';
import { Modal, Input, Textarea, Select, Button, Badge } from '../common';
import { useModalStore, useTaskStore, useProjectStore, useAuthStore } from '../../store/useStore';
import { taskService } from '../../services/taskService';
import { TASK_PRIORITY, TASK_STATUS, COLORS } from '../../constants/config';
import toast from 'react-hot-toast';

const TaskModal = () => {
  const { taskModalOpen, closeTaskModal } = useModalStore();
  const { selectedTask, addTask, updateTask, setSelectedTask } = useTaskStore();
  const { projects } = useProjectStore();
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: TASK_STATUS.TODO,
    priority: TASK_PRIORITY.MEDIUM,
    dueDate: '',
    project: '',
  });

  useEffect(() => {
    if (selectedTask) {
      setFormData({
        title: selectedTask.title || '',
        description: selectedTask.description || '',
        status: selectedTask.status || TASK_STATUS.TODO,
        priority: selectedTask.priority || TASK_PRIORITY.MEDIUM,
        dueDate: selectedTask.dueDate ? selectedTask.dueDate.split('T')[0] : '',
        project: selectedTask.project?._id || selectedTask.project || '',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: TASK_STATUS.TODO,
        priority: TASK_PRIORITY.MEDIUM,
        dueDate: '',
        project: projects[0]?._id || '',
      });
    }
  }, [selectedTask, projects]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!formData.project) {
      toast.error('Please select a project');
      return;
    }

    setLoading(true);

    try {
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description.trim(),
        dueDate: formData.dueDate || null,
      };

      if (selectedTask?._id) {
        // Update existing task
        const updated = await taskService.updateTask(selectedTask._id, taskData);
        updateTask(selectedTask._id, updated);
        toast.success('Task updated successfully');
      } else {
        // Create new task
        const created = await taskService.createTask(taskData);
        addTask(created);
        toast.success('Task created successfully');
      }

      handleClose();
    } catch (error) {
      console.error('Task save error:', error);
      toast.error(error.response?.data?.message || 'Failed to save task');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setSelectedTask(null);
    closeTaskModal();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      isOpen={taskModalOpen}
      onClose={handleClose}
      title={selectedTask?._id ? 'Edit Task' : 'Create New Task'}
      footer={
        <>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} loading={loading}>
            {selectedTask?._id ? 'Update Task' : 'Create Task'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Selection */}
        <Select
          label="Project *"
          value={formData.project}
          onChange={(e) => handleChange('project', e.target.value)}
          options={projects.map(p => ({ value: p._id, label: p.name }))}
          placeholder="Select a project"
          required
        />

        {/* Title */}
        <Input
          label="Task Title *"
          placeholder="Enter task title..."
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />

        {/* Description */}
        <Textarea
          label="Description"
          placeholder="Add task description..."
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          rows={4}
        />

        {/* Row 1: Status & Priority */}
        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: TASK_STATUS.TODO, label: 'To Do' },
              { value: TASK_STATUS.IN_PROGRESS, label: 'In Progress' },
              { value: TASK_STATUS.IN_REVIEW, label: 'In Review' },
              { value: TASK_STATUS.DONE, label: 'Done' },
            ]}
          />

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            options={[
              { value: TASK_PRIORITY.LOW, label: 'Low' },
              { value: TASK_PRIORITY.MEDIUM, label: 'Medium' },
              { value: TASK_PRIORITY.HIGH, label: 'High' },
              { value: TASK_PRIORITY.URGENT, label: 'Urgent' },
            ]}
          />
        </div>

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          icon={Calendar}
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
        />
      </form>
    </Modal>
  );
};

export default TaskModal;