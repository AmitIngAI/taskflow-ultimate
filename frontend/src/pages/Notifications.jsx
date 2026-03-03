import { useState } from 'react';
import { 
  Bell, 
  BellOff, 
  Check, 
  CheckCheck, 
  Trash2, 
  Filter,
  Archive,
  AlertCircle,
  MessageSquare,
  UserPlus,
  Calendar
} from 'lucide-react';
import { Button, Card, Badge, Avatar, EmptyState } from '../components/common';
import { useNotificationStore } from '../store/useStore';
import { formatRelativeTime } from '../utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const Notifications = () => {
  const { notifications, markAsRead, markAllAsRead, clearNotifications } = useNotificationStore();
  const [filter, setFilter] = useState('all'); // all, unread, read

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });

  const getIcon = (type) => {
    switch (type) {
      case 'task_assigned':
        return <Bell className="w-5 h-5" />;
      case 'comment':
        return <MessageSquare className="w-5 h-5" />;
      case 'mention':
        return <UserPlus className="w-5 h-5" />;
      case 'deadline':
        return <Calendar className="w-5 h-5" />;
      default:
        return <AlertCircle className="w-5 h-5" />;
    }
  };

  const getColor = (type) => {
    switch (type) {
      case 'task_assigned':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
      case 'comment':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30';
      case 'mention':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30';
      case 'deadline':
        return 'text-red-600 bg-red-100 dark:bg-red-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-900/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Notifications
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Stay updated with your latest activities
          </p>
        </div>

        <div className="flex items-center gap-3">
          {notifications.some(n => !n.read) && (
            <Button
              variant="outline"
              icon={CheckCheck}
              onClick={() => {
                markAllAsRead();
                toast.success('All notifications marked as read');
              }}
            >
              Mark all read
            </Button>
          )}
          <Button
            variant="outline"
            icon={Trash2}
            onClick={() => {
              if (window.confirm('Clear all notifications?')) {
                clearNotifications();
                toast.success('All notifications cleared');
              }
            }}
          >
            Clear all
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {[
          { id: 'all', label: 'All' },
          { id: 'unread', label: 'Unread' },
          { id: 'read', label: 'Read' },
        ].map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.id
                ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-700'
            }`}
          >
            {f.label}
            {f.id === 'unread' && notifications.filter(n => !n.read).length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 bg-primary-600 text-white rounded-full text-xs">
                {notifications.filter(n => !n.read).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <Card className="p-0 overflow-hidden">
        <AnimatePresence>
          {filteredNotifications.length === 0 ? (
            <EmptyState
              icon={filter === 'unread' ? BellOff : Bell}
              title={filter === 'unread' ? 'No unread notifications' : 'No notifications'}
              description={filter === 'unread' ? 'You\'re all caught up!' : 'Notifications will appear here'}
            />
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-dark-700">
              {filteredNotifications.map((notification, idx) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`p-4 hover:bg-gray-50 dark:hover:bg-dark-700 transition-colors ${
                    !notification.read ? 'bg-primary-50/30 dark:bg-primary-900/10' : ''
                  }`}
                >
                  <div className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white">
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <span className="w-2 h-2 bg-primary-600 rounded-full" />
                            )}
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          {!notification.read && (
                            <button
                              onClick={() => markAsRead(notification.id)}
                              className="p-2 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            className="p-2 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg transition-colors"
                            title="Archive"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default Notifications;