import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { useAuthStore, useNotificationStore } from '../store/useStore';
import { SOCKET_URL } from '../constants/config';
import toast from 'react-hot-toast';

export const useSocket = () => {
  const socketRef = useRef(null);
  const { user } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    if (!user) return;

    // Connect to socket
    socketRef.current = io(SOCKET_URL, {
      auth: { userId: user.id },
      transports: ['websocket', 'polling'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      socket.emit('join-user', user.id);
    });

    socket.on('notification', (data) => {
      console.log('🔔 Notification received:', data);
      addNotification(data);
      
      // Show toast
      toast.custom((t) => (
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow-lg p-4 max-w-md">
          <div className="flex items-start gap-3">
            <div className="text-2xl">{data.icon || '📬'}</div>
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">
                {data.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {data.message}
              </p>
            </div>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>
      ), {
        duration: 4000,
        position: 'top-right',
      });
    });

    socket.on('task-update', (data) => {
      console.log('📝 Task updated:', data);
      // Update task in store
    });

    socket.on('user-typing', (data) => {
      console.log('⌨️ User typing:', data.userName);
    });

    socket.on('disconnect', () => {
      console.log('❌ Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [user]);

  return socketRef.current;
};