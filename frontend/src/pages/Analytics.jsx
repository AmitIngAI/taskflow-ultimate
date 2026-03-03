import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  BarChart3, 
  PieChart as PieChartIcon,
  Calendar,
  Download,
  Filter
} from 'lucide-react';
import { Button, Card, Badge, Select } from '../components/common';
import { useTaskStore } from '../store/useStore';
import { TASK_STATUS, TASK_PRIORITY, COLORS } from '../constants/config';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { motion } from 'framer-motion';

const Analytics = () => {
  const { tasks } = useTaskStore();
  const [timeRange, setTimeRange] = useState('week'); // week, month, quarter, year
  const [chartType, setChartType] = useState('bar'); // bar, line, area

  // Calculate metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.status === TASK_STATUS.DONE).length;
  const inProgressTasks = tasks.filter(t => t.status === TASK_STATUS.IN_PROGRESS).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

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

  // Weekly Progress (Mock data)
  const weeklyData = [
    { day: 'Mon', completed: 12, created: 8, inProgress: 5 },
    { day: 'Tue', completed: 15, created: 10, inProgress: 7 },
    { day: 'Wed', completed: 8, created: 12, inProgress: 9 },
    { day: 'Thu', completed: 18, created: 6, inProgress: 4 },
    { day: 'Fri', completed: 14, created: 15, inProgress: 8 },
    { day: 'Sat', completed: 6, created: 3, inProgress: 2 },
    { day: 'Sun', completed: 4, created: 2, inProgress: 1 },
  ];

  // Team Performance (Mock data)
  const teamData = [
    { member: 'HAKKA', tasksCompleted: 45, efficiency: 92 },
    { member: 'Sarah', tasksCompleted: 38, efficiency: 88 },
    { member: 'Michael', tasksCompleted: 52, efficiency: 95 },
    { member: 'Emily', tasksCompleted: 29, efficiency: 82 },
    { member: 'David', tasksCompleted: 67, efficiency: 98 },
  ];

  // Velocity Chart (Mock data)
  const velocityData = [
    { sprint: 'Sprint 1', planned: 45, completed: 42 },
    { sprint: 'Sprint 2', planned: 50, completed: 48 },
    { sprint: 'Sprint 3', planned: 48, completed: 45 },
    { sprint: 'Sprint 4', planned: 55, completed: 52 },
    { sprint: 'Sprint 5', planned: 60, completed: 58 },
  ];

  // Time Distribution
  const timeData = [
    { category: 'Development', hours: 120 },
    { category: 'Design', hours: 80 },
    { category: 'Testing', hours: 60 },
    { category: 'Meetings', hours: 40 },
    { category: 'Documentation', hours: 30 },
  ];

  const CHART_COLORS = ['#0ea5e9', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const stats = [
    {
      label: 'Total Tasks',
      value: totalTasks,
      change: '+12%',
      trend: 'up',
      icon: BarChart3,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      label: 'Completion Rate',
      value: `${completionRate}%`,
      change: '+5%',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      label: 'In Progress',
      value: inProgressTasks,
      change: '+8%',
      trend: 'up',
      icon: Calendar,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      label: 'Avg. Completion Time',
      value: '3.2 days',
      change: '-0.5 days',
      trend: 'down',
      icon: TrendingDown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive insights into your project performance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            options={[
              { value: 'week', label: 'This Week' },
              { value: 'month', label: 'This Month' },
              { value: 'quarter', label: 'This Quarter' },
              { value: 'year', label: 'This Year' },
            ]}
          />
          <Button variant="outline" icon={Filter}>
            Filters
          </Button>
          <Button icon={Download}>
            Export Report
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
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <Badge variant={stat.trend === 'up' ? 'success' : 'default'}>
                  {stat.change}
                </Badge>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                {stat.label}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">
                {stat.value}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Weekly Progress */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Weekly Progress
            </h2>
            <div className="flex gap-2">
              {['bar', 'line', 'area'].map((type) => (
                <button
                  key={type}
                  onClick={() => setChartType(type)}
                  className={`px-3 py-1 text-sm rounded ${
                    chartType === type
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                      : 'text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            {chartType === 'bar' ? (
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="created" fill="#0ea5e9" name="Created" />
                <Bar dataKey="inProgress" fill="#f59e0b" name="In Progress" />
              </BarChart>
            ) : chartType === 'line' ? (
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={2} />
                <Line type="monotone" dataKey="created" stroke="#0ea5e9" strokeWidth={2} />
                <Line type="monotone" dataKey="inProgress" stroke="#f59e0b" strokeWidth={2} />
              </LineChart>
            ) : (
              <AreaChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="completed" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="created" stackId="1" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
                <Area type="monotone" dataKey="inProgress" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
              </AreaChart>
            )}
          </ResponsiveContainer>
        </Card>

        {/* Task Distribution */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Task Distribution
          </h2>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 text-center">
                By Status
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 text-center">
                By Priority
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.value}`}
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
        </Card>
      </div>

      {/* Additional Charts */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Sprint Velocity */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Sprint Velocity
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={velocityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="sprint" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="planned" fill="#94a3b8" name="Planned" />
              <Bar dataKey="completed" fill="#0ea5e9" name="Completed" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Team Performance */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Team Performance
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={teamData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="member" />
              <PolarRadiusAxis />
              <Radar name="Tasks Completed" dataKey="tasksCompleted" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.6} />
              <Radar name="Efficiency" dataKey="efficiency" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
              <Legend />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </Card>

        {/* Time Distribution */}
        <Card>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Time Distribution
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={timeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(entry) => entry.category}
                outerRadius={80}
                fill="#8884d8"
                dataKey="hours"
              >
                {timeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Team Leaderboard */}
      <Card>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Team Leaderboard
        </h2>
        <div className="space-y-3">
          {teamData
            .sort((a, b) => b.tasksCompleted - a.tasksCompleted)
            .map((member, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-dark-700 rounded-lg"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    idx === 0 ? 'bg-yellow-100 text-yellow-600' :
                    idx === 1 ? 'bg-gray-100 text-gray-600' :
                    idx === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-gray-100 dark:bg-dark-600 text-gray-600 dark:text-gray-400'
                  }`}>
                    {idx + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {member.member}
                    </p>
                    <p className="text-sm text-gray-500">
                      {member.tasksCompleted} tasks • {member.efficiency}% efficiency
                    </p>
                  </div>
                </div>
                <Badge variant={member.efficiency > 90 ? 'success' : 'warning'}>
                  {member.efficiency}%
                </Badge>
              </div>
            ))}
        </div>
      </Card>
    </div>
  );
};

export default Analytics;