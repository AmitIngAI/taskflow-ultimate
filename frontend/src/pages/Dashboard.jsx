import { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Filter,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  Loader2
} from 'lucide-react';
import { Button, Card, Badge, Avatar, Input, EmptyState, Loading } from '../components/common';
import { useTaskStore, useProjectStore, useModalStore } from '../store/useStore';
import { taskService } from '../services/taskService';
import { projectService } from '../services/projectService';
import { TASK_STATUS, TASK_PRIORITY } from '../constants/config';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { tasks, setTasks, setSelectedTask } = useTaskStore();
  const { projects, setProjects, setSelectedProject } = useProjectStore();
  const { openTaskModal, openAnalyticsModal } = useModalStore();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [tasksData, projectsData] = await Promise.all([
        taskService.getTasks(),
        projectService.getProjects(),
      ]);
      
      setTasks(tasksData);
      setProjects(projectsData);
      console.log('✅ Dashboard data loaded');
    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats
  const stats = [
    {
      label: 'Total Tasks',
      value: tasks.length,
      change: '+12%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'In Progress',
      value: tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length,
      change: '+5%',
      trend: 'up',
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      label: 'Completed',
      value: tasks.filter(t => t.status === TASK_STATUS.DONE).length,
      change: '+23%',
      trend: 'up',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'Projects',
      value: projects.length,
      change: '+2',
      trend: 'up',
      icon: AlertCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  const handleNewTask = () => {
    setSelectedTask(null);
    openTaskModal();
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    openTaskModal();
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const recentTasks = filteredTasks.slice(0, 5);

  if (loading) {
    return <Loading fullScreen text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Welcome back! Here's what's happening today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" icon={Filter}>
            Filters
          </Button>
          <Button onClick={openAnalyticsModal} icon={TrendingUp}>
            Analytics
          </Button>
          <Button onClick={handleNewTask} icon={Plus}>
            New Task
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                    {stat.label}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    {stat.change} from last week
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <div className="lg:col-span-2">
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Recent Tasks
              </h2>
              <Input
                placeholder="Search tasks..."
                icon={Search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
            </div>

            {recentTasks.length === 0 ? (
              <EmptyState
                title="No tasks yet"
                description="Create your first task to get started"
                actionLabel="Create Task"
                onAction={handleNewTask}
              />
            ) : (
              <div className="space-y-3">
                {recentTasks.map((task) => (
                  <div
                    key={task._id}
                    onClick={() => handleTaskClick(task)}
                    className="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {task.title}
                          </h3>
                          <Badge
                            variant={
                              task.priority === TASK_PRIORITY.URGENT ? 'danger' :
                              task.priority === TASK_PRIORITY.HIGH ? 'warning' :
                              'default'
                            }
                            size="sm"
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        {task.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-1 mb-2">
                            {task.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          {task.dueDate && (
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                          )}
                          {task.project && (
                            <span className="text-primary-600">
                              {task.project.name}
                            </span>
                          )}
                        </div>
                      </div>
                      <Badge
                        variant={
                          task.status === TASK_STATUS.DONE ? 'success' :
                          task.status === TASK_STATUS.IN_PROGRESS ? 'info' :
                          'default'
                        }
                      >
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Projects */}
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Projects
              </h2>
              <Button size="sm" variant="ghost">
                View All
              </Button>
            </div>
            
            {projects.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">
                No projects yet
              </p>
            ) : (
              <div className="space-y-3">
                {projects.slice(0, 4).map((project) => (
                  <div 
                    key={project._id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer"
                  >
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {project.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {tasks.filter(t => t.project?._id === project._id).length} tasks
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* Quick Actions */}
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Quick Actions
            </h2>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handleNewTask}>
                <Plus className="w-4 h-4 mr-2" />
                Create New Task
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={openAnalyticsModal}>
                <TrendingUp className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;