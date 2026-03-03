import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Clock, 
  MessageSquare, 
  Paperclip, 
  MoreVertical,
  Calendar,
  Flag
} from 'lucide-react';
import { Avatar, Badge, Dropdown, DropdownItem, Tooltip } from '../common';
import { COLORS, TASK_PRIORITY } from '../../constants/config';
import { formatRelativeTime } from '../../utils/dateUtils';
import { motion } from 'framer-motion';

const KanbanCard = ({ task, onEdit, onDelete, onClick }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'danger',
    urgent: 'danger',
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-dark-800 rounded-lg p-4 shadow-sm border border-gray-200 dark:border-dark-700 hover:shadow-md transition-shadow cursor-pointer group"
      onClick={() => onClick(task)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          {task.labels?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {task.labels.map((label, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 text-xs rounded"
                  style={{ 
                    backgroundColor: label.color + '20', 
                    color: label.color 
                  }}
                >
                  {label.name}
                </span>
              ))}
            </div>
          )}
          <h4 className="font-semibold text-gray-900 dark:text-white line-clamp-2">
            {task.title}
          </h4>
        </div>

        <Dropdown
          trigger={
            <button 
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-dark-700 rounded transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreVertical className="w-4 h-4" />
            </button>
          }
        >
          <DropdownItem onClick={() => onEdit(task)}>Edit</DropdownItem>
          <DropdownItem onClick={() => onDelete(task.id)} danger>Delete</DropdownItem>
        </Dropdown>
      </div>

      {/* Description */}
      {task.description && (
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
          {task.description}
        </p>
      )}

      {/* Priority & Due Date */}
      <div className="flex items-center gap-2 mb-3">
        {task.priority && (
          <Tooltip content={`Priority: ${task.priority}`}>
            <div className="flex items-center gap-1">
              <Flag 
                className="w-3 h-3" 
                style={{ color: COLORS[task.priority] }}
                fill={COLORS[task.priority]}
              />
            </div>
          </Tooltip>
        )}

        {task.dueDate && (
          <Tooltip content={`Due: ${formatRelativeTime(task.dueDate)}`}>
            <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
              <Calendar className="w-3 h-3" />
              <span>{new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
            </div>
          </Tooltip>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-dark-700">
        {/* Assignees */}
        <div className="flex -space-x-2">
          {task.assignees?.slice(0, 3).map((assignee, idx) => (
            <Tooltip key={idx} content={assignee.name}>
              <Avatar
                src={assignee.avatar}
                fallback={assignee.name}
                size="xs"
                className="ring-2 ring-white dark:ring-dark-800"
              />
            </Tooltip>
          ))}
          {task.assignees?.length > 3 && (
            <div className="w-6 h-6 rounded-full bg-gray-200 dark:bg-dark-700 flex items-center justify-center text-xs font-medium ring-2 ring-white dark:ring-dark-800">
              +{task.assignees.length - 3}
            </div>
          )}
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400">
          {task.comments?.length > 0 && (
            <Tooltip content={`${task.comments.length} comments`}>
              <div className="flex items-center gap-1 text-xs">
                <MessageSquare className="w-3.5 h-3.5" />
                <span>{task.comments.length}</span>
              </div>
            </Tooltip>
          )}

          {task.attachments?.length > 0 && (
            <Tooltip content={`${task.attachments.length} attachments`}>
              <div className="flex items-center gap-1 text-xs">
                <Paperclip className="w-3.5 h-3.5" />
                <span>{task.attachments.length}</span>
              </div>
            </Tooltip>
          )}

          {task.subtasks?.length > 0 && (
            <Tooltip content={`${task.subtasks.filter(s => s.completed).length}/${task.subtasks.length} subtasks`}>
              <div className="flex items-center gap-1 text-xs">
                <Clock className="w-3.5 h-3.5" />
                <span>{task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}</span>
              </div>
            </Tooltip>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default KanbanCard;