import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Menu, 
  X, 
  Bell, 
  Search, 
  Settings, 
  LogOut,
  Sun,
  Moon,
  User,
  ChevronDown
} from 'lucide-react';
import { useAuthStore, useThemeStore, useNotificationStore, useModalStore } from '../../store/useStore';
import { Avatar, Badge, Dropdown, DropdownItem, Tooltip } from '../common';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();
  const { openSearchModal } = useModalStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-dark-800 border-b border-gray-200 dark:border-dark-700 z-40">
      <div className="h-full px-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/50">
            <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              TaskFlow
            </span>
          </Link>
        </div>

        {/* Center Section - Search */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <button
            onClick={openSearchModal}
            className="w-full px-4 py-2 bg-gray-100 dark:bg-dark-700 rounded-lg 
                     flex items-center gap-3 text-gray-500 dark:text-gray-400
                     hover:bg-gray-200 dark:hover:bg-dark-600 transition-colors"
          >
            <Search className="w-4 h-4" />
            <span className="text-sm">Search tasks... (Ctrl + K)</span>
            <kbd className="ml-auto px-2 py-1 text-xs bg-white dark:bg-dark-800 rounded border border-gray-300 dark:border-dark-600">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Mobile Search */}
          <button
            onClick={openSearchModal}
            className="md:hidden p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <Tooltip content={theme === 'light' ? 'Dark Mode' : 'Light Mode'}>
            <button
              onClick={toggleTheme}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
            >
              {theme === 'light' ? (
                <Moon className="w-5 h-5" />
              ) : (
                <Sun className="w-5 h-5" />
              )}
            </button>
          </Tooltip>

          {/* Notifications */}
          <div className="relative">
            <Tooltip content="Notifications">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>
            </Tooltip>

            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-dark-800 
                           rounded-lg shadow-xl border border-gray-200 dark:border-dark-700 overflow-hidden"
                >
                  {/* Header */}
                  <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">
                    <h3 className="font-semibold">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm text-primary-600 hover:text-primary-700"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notifications List */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-gray-500">
                        No notifications
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification.id}
                          className={`px-4 py-3 border-b border-gray-100 dark:border-dark-700 
                                   hover:bg-gray-50 dark:hover:bg-dark-700 cursor-pointer
                                   ${!notification.read ? 'bg-primary-50/50 dark:bg-primary-900/10' : ''}`}
                        >
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {notification.title}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Footer */}
                  {notifications.length > 0 && (
                    <div className="px-4 py-3 bg-gray-50 dark:bg-dark-700 text-center">
                      <Link
                        to="/notifications"
                        className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      >
                        View all notifications
                      </Link>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* User Menu */}
          <Dropdown
            align="right"
            trigger={
              <button className="flex items-center gap-2 p-1.5 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg transition-colors">
                <Avatar
                  src={user?.avatar}
                  fallback={user?.name}
                  size="sm"
                />
                <ChevronDown className="w-4 h-4 hidden sm:block" />
              </button>
            }
          >
            <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-700">
              <p className="font-medium text-gray-900 dark:text-white">{user?.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</p>
            </div>

            <DropdownItem icon={User} onClick={() => window.location.href = '/profile'}>
              Profile
            </DropdownItem>
            <DropdownItem icon={Settings} onClick={() => window.location.href = '/settings'}>
              Settings
            </DropdownItem>
            <div className="border-t border-gray-200 dark:border-dark-700" />
            <DropdownItem icon={LogOut} onClick={handleLogout} danger>
              Logout
            </DropdownItem>
          </Dropdown>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;