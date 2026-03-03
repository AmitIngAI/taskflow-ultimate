import { useEffect } from 'react';
import { useNotificationStore, useAuthStore } from '../store/useStore';
import toast from 'react-hot-toast';

export const useNotifications = () => {
  const { addNotification } = useNotificationStore();
  const { user } = useAuthStore();

  useEffect(() => {
    // Simulate real-time notifications
    const interval = setInterval(() => {
      const notifications = [
        {
          id: Date.now().toString(),
          type: 'task_assigned',
          title: 'New Task Assigned',
          message: 'You have been assigned to "Fix login bug"',
          time: 'Just now',
          read: false,
          icon: '📋',
        },
        {
          id: Date.now().toString(),
          type: 'comment',
          title: 'New Comment',
          message: 'Sarah commented on your task',
          time: 'Just now',
          read: false,
          icon: '💬',
        },
        {
          id: Date.now().toString(),
          type: 'mention',
          title: 'You were mentioned',
          message: 'Michael mentioned you in a comment',
          time: 'Just now',
          read: false,
          icon: '👤',
        },
        {
          id: Date.now().toString(),
          type: 'deadline',
          title: 'Deadline Approaching',
          message: 'Task "UI Design" is due tomorrow',
          time: 'Just now',
          read: false,
          icon: '⏰',
        },
      ];

      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      
      if (Math.random() > 0.7) { // 30% chance every 30 seconds
        addNotification(randomNotification);
        
        // Show toast notification
        toast.custom((t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } max-w-md w-full bg-white dark:bg-dark-800 shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <div className="flex items-start">
                <div className="text-2xl mr-3">{randomNotification.icon}</div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {randomNotification.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {randomNotification.message}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex border-l border-gray-200 dark:border-dark-700">
              <button
                onClick={() => toast.dismiss(t.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-primary-600 hover:text-primary-500"
              >
                Close
              </button>
            </div>
          </div>
        ), {
          duration: 5000,
          position: 'top-right',
        });
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [addNotification, user]);
};