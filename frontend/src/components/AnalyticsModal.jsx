import { Modal } from './common';
import { useModalStore, useTaskStore } from '../store/useStore';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TASK_STATUS, TASK_PRIORITY, COLORS } from '../constants/config';

const AnalyticsModal = () => {
  const { analyticsModalOpen, closeAnalyticsModal } = useModalStore();
  const { tasks } = useTaskStore();

  // Status Distribution
  const statusData = Object.values(TASK_STATUS).map((status) => ({
    name: status.replace('_', ' ').toUpperCase(),
    value: tasks.filter((t) => t.status === status).length,
  }));

  // Priority Distribution
  const priorityData = Object.values(TASK_PRIORITY).map((priority) => ({
    name: priority.toUpperCase(),
    value: tasks.filter((t) => t.priority === priority).length,
    color: COLORS[priority],
  }));

  const CHART_COLORS = ['#0ea5e9', '#3b82f6', '#f59e0b', '#10b981'];

  return (
    <Modal
      isOpen={analyticsModalOpen}
      onClose={closeAnalyticsModal}
      title="📊 Analytics Dashboard"
      size="xl"
    >
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="card text-center">
            <p className="text-3xl font-bold text-primary-600">{tasks.length}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Total Tasks</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-green-600">
              {tasks.filter(t => t.status === TASK_STATUS.DONE).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Completed</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-blue-600">
              {tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">In Progress</p>
          </div>
          <div className="card text-center">
            <p className="text-3xl font-bold text-yellow-600">
              {tasks.filter(t => t.priority === TASK_PRIORITY.URGENT).length}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Urgent</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-2 gap-6">
          {/* Status Chart */}
          <div className="card">
            <h3 className="font-semibold mb-4">Tasks by Status</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={statusData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Priority Chart */}
          <div className="card">
            <h3 className="font-semibold mb-4">Tasks by Priority</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default AnalyticsModal;