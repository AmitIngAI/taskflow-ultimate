import { CheckCircle, Circle } from 'lucide-react';

const RecentTasksWidget = ({ config }) => {
  // Mock data - replace with real data
  const tasks = [
    { id: 1, title: 'Complete project proposal', status: 'done', priority: 'high' },
    { id: 2, title: 'Review pull requests', status: 'in-progress', priority: 'medium' },
    { id: 3, title: 'Update documentation', status: 'todo', priority: 'low' },
    { id: 4, title: 'Team meeting', status: 'done', priority: 'medium' },
    { id: 5, title: 'Fix bug #123', status: 'in-progress', priority: 'high' },
  ];

  const priorityColors = {
    high: 'text-red-500',
    medium: 'text-yellow-500',
    low: 'text-green-500',
  };

  return (
    <div className="space-y-2 h-full overflow-y-auto">
      {tasks.slice(0, config?.limit || 5).map((task) => (
        <div
          key={task.id}
          className="flex items-center gap-3 p-3 bg-white dark:bg-dark-700 rounded-lg border border-gray-200 dark:border-dark-600 hover:bg-gray-50 dark:hover:bg-dark-600 transition-colors"
        >
          {task.status === 'done' ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <Circle className="w-5 h-5 text-gray-400" />
          )}
          <div className="flex-1 min-w-0">
            <div className={`truncate ${task.status === 'done' ? 'line-through text-gray-400' : ''}`}>
              {task.title}
            </div>
          </div>
          <div className={`text-xs font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentTasksWidget;