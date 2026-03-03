import { GitBranch, MessageSquare, CheckCircle, UserPlus } from 'lucide-react';

const ActivityWidget = ({ config }) => {
  const activities = [
    {
      id: 1,
      type: 'task',
      icon: CheckCircle,
      color: 'text-green-500',
      text: 'John completed "Design Homepage"',
      time: '2 hours ago',
    },
    {
      id: 2,
      type: 'comment',
      icon: MessageSquare,
      color: 'text-blue-500',
      text: 'Sarah commented on "API Integration"',
      time: '3 hours ago',
    },
    {
      id: 3,
      type: 'member',
      icon: UserPlus,
      color: 'text-purple-500',
      text: 'Mike joined the project',
      time: '5 hours ago',
    },
    {
      id: 4,
      type: 'branch',
      icon: GitBranch,
      color: 'text-orange-500',
      text: 'New branch created: feature/auth',
      time: '1 day ago',
    },
  ];

  return (
    <div className="space-y-3 h-full overflow-y-auto">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start gap-3">
          <div className={`p-2 rounded-lg bg-gray-100 dark:bg-dark-700 ${activity.color}`}>
            <activity.icon className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm">{activity.text}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{activity.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityWidget;