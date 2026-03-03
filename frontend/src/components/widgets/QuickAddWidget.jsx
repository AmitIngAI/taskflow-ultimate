import { useState } from 'react';
import { Plus } from 'lucide-react';

const QuickAddWidget = ({ config }) => {
  const [taskTitle, setTaskTitle] = useState('');

  const handleAdd = () => {
    if (taskTitle.trim()) {
      // Add task logic here
      console.log('Adding task:', taskTitle);
      setTaskTitle('');
    }
  };

  return (
    <div className="h-full flex flex-col justify-center">
      <div className="space-y-3">
        <input
          type="text"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          placeholder="Quick add a task..."
          className="w-full px-4 py-3 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          onClick={handleAdd}
          className="w-full px-4 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>
    </div>
  );
};

export default QuickAddWidget;