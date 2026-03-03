import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Plus, MoreHorizontal } from 'lucide-react';
import KanbanCard from './KanbanCard';
import { cn } from '../../utils/cn';
import { Badge, EmptyState, Dropdown, DropdownItem } from '../common';

const KanbanColumn = ({ 
  column, 
  tasks, 
  onAddTask, 
  onEditTask, 
  onDeleteTask,
  onTaskClick,
  onEditColumn,
  onDeleteColumn 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        'flex flex-col h-full bg-gray-50 dark:bg-dark-900/50 rounded-xl p-4 min-w-[320px] max-w-[320px]',
        isOver && 'ring-2 ring-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
      )}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: column.color }}
          />
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {column.title}
          </h3>
          <Badge variant="default" size="sm">
            {tasks.length}
          </Badge>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddTask(column.id)}
            className="p-1.5 hover:bg-gray-200 dark:hover:bg-dark-700 rounded transition-colors"
          >
            <Plus className="w-4 h-4" />
          </button>

          <Dropdown
            trigger={
              <button className="p-1.5 hover:bg-gray-200 dark:hover:bg-dark-700 rounded transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            }
          >
            <DropdownItem onClick={() => onEditColumn(column)}>
              Edit Column
            </DropdownItem>
            <DropdownItem onClick={() => onDeleteColumn(column.id)} danger>
              Delete Column
            </DropdownItem>
          </Dropdown>
        </div>
      </div>

      {/* Tasks */}
      <SortableContext
        items={tasks.map(t => t.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex-1 space-y-3 overflow-y-auto custom-scrollbar">
          {tasks.length === 0 ? (
            <EmptyState
              title="No tasks"
              description="Add a new task to get started"
              actionLabel="Add Task"
              onAction={() => onAddTask(column.id)}
            />
          ) : (
            tasks.map((task) => (
              <KanbanCard
                key={task.id}
                task={task}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onClick={onTaskClick}
              />
            ))
          )}
        </div>
      </SortableContext>

      {/* Add Task Button */}
      {tasks.length > 0 && (
        <button
          onClick={() => onAddTask(column.id)}
          className="mt-3 w-full py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-dark-700 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Task
        </button>
      )}
    </div>
  );
};

export default KanbanColumn;