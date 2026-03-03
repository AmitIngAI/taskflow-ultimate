import { TrendingUp, CheckCircle, Clock, AlertCircle } from 'lucide-react';

const StatsWidget = ({ config }) => {
  // Mock data - replace with real data from your store
  const stats = [
    { label: 'Total Tasks', value: 24, icon: CheckCircle, color: 'text-blue-500' },
    { label: 'Completed', value: 12, icon: TrendingUp, color: 'text-green-500' },
    { label: 'In Progress', value: 8, icon: Clock, color: 'text-yellow-500' },
    { label: 'Overdue', value: 4, icon: AlertCircle, color: 'text-red-500' },
  ];

  return (
    <div className="grid grid-cols-4 gap-4 h-full">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white dark:bg-dark-700 rounded-lg p-4 border border-gray-200 dark:border-dark-600"
        >
          <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
          <div className="text-2xl font-bold">{stat.value}</div>
          <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsWidget;