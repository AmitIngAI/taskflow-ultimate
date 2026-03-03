import { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  Filter
} from 'lucide-react';
import { Button, Badge, Avatar, Card } from '../components/common';
import { useTaskStore, useModalStore } from '../store/useStore';
import { TASK_PRIORITY, COLORS } from '../constants/config';
import { motion, AnimatePresence } from 'framer-motion';

const Calendar = () => {
  const { tasks, setSelectedTask } = useTaskStore();
  const { openTaskModal } = useModalStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month'); // month, week, day

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonth = new Date(year, month, 0);
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonth.getDate() - i),
        isCurrentMonth: false,
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    
    // Next month days
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    
    return days;
  };

  const getTasksForDate = (date) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === date.getDate() &&
        taskDate.getMonth() === date.getMonth() &&
        taskDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (date) => {
    if (!selectedDate) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  const handleAddTaskOnDate = (date) => {
    setSelectedTask({ 
      dueDate: date.toISOString().split('T')[0] 
    });
    openTaskModal();
  };

  const days = getDaysInMonth(currentDate);
  const selectedDateTasks = selectedDate ? getTasksForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Calendar
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage tasks by date
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex bg-gray-100 dark:bg-dark-800 rounded-lg p-1">
            {['month', 'week', 'day'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  view === v
                    ? 'bg-white dark:bg-dark-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          <Button variant="outline" icon={Filter}>
            Filter
          </Button>
          <Button onClick={() => handleAddTaskOnDate(new Date())} icon={Plus}>
            Add Task
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-3">
          <Card className="p-0 overflow-hidden">
            {/* Month Navigation */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-dark-700">
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-3 py-1 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-600 rounded-lg hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                >
                  Today
                </button>
              </div>
              
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Days of Week Header */}
            <div className="grid grid-cols-7 border-b border-gray-200 dark:border-dark-700">
              {daysOfWeek.map((day) => (
                <div
                  key={day}
                  className="p-3 text-center text-sm font-semibold text-gray-600 dark:text-gray-400"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7">
              {days.map((day, idx) => {
                const dayTasks = getTasksForDate(day.date);
                const hasUrgent = dayTasks.some(t => t.priority === TASK_PRIORITY.URGENT);
                const hasHigh = dayTasks.some(t => t.priority === TASK_PRIORITY.HIGH);

                return (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.02 }}
                    onClick={() => handleDateClick(day.date)}
                    className={`min-h-[100px] p-2 border-b border-r border-gray-100 dark:border-dark-700 cursor-pointer transition-colors ${
                      !day.isCurrentMonth ? 'bg-gray-50 dark:bg-dark-900/50' : ''
                    } ${isSelected(day.date) ? 'bg-primary-50 dark:bg-primary-900/20' : ''} ${
                      isToday(day.date) ? 'bg-primary-100 dark:bg-primary-900/30' : ''
                    } hover:bg-gray-50 dark:hover:bg-dark-800`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-sm font-medium ${
                          !day.isCurrentMonth
                            ? 'text-gray-400 dark:text-gray-600'
                            : isToday(day.date)
                            ? 'text-primary-600 dark:text-primary-400'
                            : 'text-gray-900 dark:text-white'
                        } ${isToday(day.date) ? 'w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center' : ''}`}
                      >
                        {day.date.getDate()}
                      </span>
                      
                      {dayTasks.length > 0 && (
                        <Badge 
                          variant={hasUrgent ? 'danger' : hasHigh ? 'warning' : 'primary'} 
                          size="sm"
                        >
                          {dayTasks.length}
                        </Badge>
                      )}
                    </div>

                    {/* Task Pills */}
                    <div className="space-y-1">
                      {dayTasks.slice(0, 2).map((task) => (
                        <div
                          key={task.id}
                          className="text-xs px-2 py-1 rounded truncate"
                          style={{
                            backgroundColor: COLORS[task.priority] + '20',
                            color: COLORS[task.priority],
                          }}
                        >
                          {task.title}
                        </div>
                      ))}
                      {dayTasks.length > 2 && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 px-2">
                          +{dayTasks.length - 2} more
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Selected Date Tasks */}
        <div className="lg:col-span-1">
          <Card>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {selectedDate
                  ? selectedDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                    })
                  : 'Select a date'}
              </h3>
              {selectedDate && (
                <Button
                  size="sm"
                  variant="ghost"
                  icon={Plus}
                  onClick={() => handleAddTaskOnDate(selectedDate)}
                />
              )}
            </div>

            <AnimatePresence mode="wait">
              {selectedDate ? (
                <motion.div
                  key={selectedDate.toISOString()}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-3"
                >
                  {selectedDateTasks.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No tasks scheduled</p>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="mt-2"
                        onClick={() => handleAddTaskOnDate(selectedDate)}
                      >
                        Add Task
                      </Button>
                    </div>
                  ) : (
                    selectedDateTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-600 cursor-pointer transition-colors"
                        onClick={() => {
                          setSelectedTask(task);
                          openTaskModal();
                        }}
                      >
                        <div className="flex items-start gap-2">
                          <div
                            className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                            style={{ backgroundColor: COLORS[task.priority] }}
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-900 dark:text-white text-sm truncate">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mt-1">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <Badge size="sm" variant={
                                task.priority === TASK_PRIORITY.URGENT ? 'danger' :
                                task.priority === TASK_PRIORITY.HIGH ? 'warning' : 'default'
                              }>
                                {task.priority}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </motion.div>
              ) : (
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <p className="text-sm">Click on a date to view tasks</p>
                </div>
              )}
            </AnimatePresence>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Calendar;