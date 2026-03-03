import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  KanbanSquare, 
  BarChart3,
  Bell, 
  Users, 
  Settings,
  FolderKanban,
  Calendar,
  MessageSquare,
  FileText,
  ChevronLeft,
  Plus
} from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion } from 'framer-motion';
import { Badge, Tooltip } from '../common';

const Sidebar = ({ isOpen, onClose }) => {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      section: 'Main',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', badge: null },
        { icon: KanbanSquare, label: 'Board', path: '/board', badge: '12' },
        { icon: BarChart3, label: 'Analytics', path: '/analytics', badge: null },
        { icon: Calendar, label: 'Calendar', path: '/calendar', badge: null },
        { icon: Bell, label: 'Notifications', path: '/notifications', badge: '5' },
      ]
    },
    {
      section: 'Workspace',
      items: [
        { icon: FolderKanban, label: 'Projects', path: '/projects', badge: null },
        { icon: Users, label: 'Team', path: '/team', badge: '8' },
        { icon: MessageSquare, label: 'Messages', path: '/messages', badge: '3' },
        { icon: FileText, label: 'Documents', path: '/documents', badge: null },
      ]
    },
    {
      section: 'Settings',
      items: [
        { icon: Settings, label: 'Settings', path: '/settings', badge: null },
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 bottom-0 bg-white dark:bg-dark-800 border-r border-gray-200 dark:border-dark-700 z-30',
          'transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="h-full flex flex-col">
          {/* Collapse Button */}
          <div className="p-4 border-b border-gray-200 dark:border-dark-700 flex justify-end">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg hidden lg:block"
            >
              <ChevronLeft
                className={cn(
                  'w-5 h-5 transition-transform',
                  collapsed && 'rotate-180'
                )}
              />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-6">
            {menuItems.map((section, idx) => (
              <div key={idx}>
                {!collapsed && (
                  <h3 className="px-3 mb-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    {section.section}
                  </h3>
                )}

                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Tooltip
                      key={item.path}
                      content={collapsed ? item.label : ''}
                      position="right"
                    >
                      <NavLink
                        to={item.path}
                        className={({ isActive }) =>
                          cn(
                            'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group',
                            isActive
                              ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                              : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700',
                            collapsed && 'justify-center'
                          )
                        }
                      >
                        <item.icon className="w-5 h-5 flex-shrink-0" />
                        {!collapsed && (
                          <>
                            <span className="flex-1 font-medium">{item.label}</span>
                            {item.badge && (
                              <Badge variant="primary" size="sm">
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </NavLink>
                    </Tooltip>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Create New Button */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-700">
            <button
              className={cn(
                'w-full btn-primary flex items-center justify-center gap-2',
                collapsed && 'px-0'
              )}
            >
              <Plus className="w-5 h-5" />
              {!collapsed && 'New Task'}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;