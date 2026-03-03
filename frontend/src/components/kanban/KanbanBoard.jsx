import { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import KanbanColumn from './KanbanColumn';
import KanbanCard from './KanbanCard';
import { useTaskStore, useProjectStore, useModalStore } from '../../store/useStore';
import { taskService } from '../../services/taskService';
import { BOARD_COLUMNS } from '../../constants/config';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';

const KanbanBoard = () => {
  const { tasks, updateTask, deleteTask, setSelectedTask } = useTaskStore();
  const { selectedProject } = useProjectStore();
  const { openTaskModal } = useModalStore();
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = tasks.find((t) => t._id === active.id);
    const overColumn = BOARD_COLUMNS.find((c) => c.id === over.id);

    if (overColumn && activeTask.status !== overColumn.id) {
      try {
        // Update locally first (optimistic update)
        updateTask(activeTask._id, { status: overColumn.id });
        
        // Update in backend
        await taskService.updateTaskStatus(activeTask._id, overColumn.id);
        
        toast.success(`Task moved to ${overColumn.title}`);
      } catch (error) {
        // Revert on error
        updateTask(activeTask._id, { status: activeTask.status });
        toast.error('Failed to move task');
      }
    }

    setActiveId(null);
  };

  const handleAddTask = (columnId) => {
    setSelectedTask({ 
      status: columnId,
      project: selectedProject?._id 
    });
    openTaskModal();
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    openTaskModal();
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await taskService.deleteTask(taskId);
      deleteTask(taskId);
      toast.success('Task deleted successfully');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    openTaskModal();
  };

  const getTasksByStatus = (status) => {
    return tasks.filter((task) => task.status === status);
  };

  const activeTask = tasks.find((t) => t._id === activeId);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="h-[calc(100vh-12rem)] overflow-x-auto">
        <div className="flex gap-6 h-full pb-6">
          {BOARD_COLUMNS.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={getTasksByStatus(column.id)}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onTaskClick={handleTaskClick}
            />
          ))}

          {/* Add Column Button */}
          <button className="min-w-[280px] h-fit bg-white dark:bg-dark-800 rounded-xl p-4 border-2 border-dashed border-gray-300 dark:border-dark-600 hover:border-primary-500 dark:hover:border-primary-500 transition-colors flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400">
            <Plus className="w-5 h-5" />
            Add Column
          </button>
        </div>
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-3 scale-105">
            <KanbanCard task={activeTask} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;