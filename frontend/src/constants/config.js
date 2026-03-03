export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done'
};

export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent'
};

export const USER_ROLES = {
  ADMIN: 'admin',
  MANAGER: 'manager',
  DEVELOPER: 'developer',
  QA: 'qa',
  VIEWER: 'viewer'
};

// Professional color scheme for priorities
export const COLORS = {
  [TASK_PRIORITY.LOW]: '#10b981',      // Success green
  [TASK_PRIORITY.MEDIUM]: '#f59e0b',   // Warning amber
  [TASK_PRIORITY.HIGH]: '#f97316',     // Orange
  [TASK_PRIORITY.URGENT]: '#ef4444'    // Danger red
};

// Status colors
export const STATUS_COLORS = {
  [TASK_STATUS.TODO]: '#94a3b8',         // Slate
  [TASK_STATUS.IN_PROGRESS]: '#3b82f6',  // Blue
  [TASK_STATUS.IN_REVIEW]: '#f59e0b',    // Amber
  [TASK_STATUS.DONE]: '#10b981'          // Green
};

export const BOARD_COLUMNS = [
  { 
    id: TASK_STATUS.TODO, 
    title: 'To Do', 
    color: '#94a3b8',
    gradient: 'from-slate-500 to-slate-600'
  },
  { 
    id: TASK_STATUS.IN_PROGRESS, 
    title: 'In Progress', 
    color: '#3b82f6',
    gradient: 'from-blue-500 to-blue-600'
  },
  { 
    id: TASK_STATUS.IN_REVIEW, 
    title: 'In Review', 
    color: '#f59e0b',
    gradient: 'from-amber-500 to-amber-600'
  },
  { 
    id: TASK_STATUS.DONE, 
    title: 'Done', 
    color: '#10b981',
    gradient: 'from-green-500 to-green-600'
  }
];

// Role colors
export const ROLE_COLORS = {
  [USER_ROLES.ADMIN]: '#ef4444',      // Red
  [USER_ROLES.MANAGER]: '#f59e0b',    // Amber
  [USER_ROLES.DEVELOPER]: '#3b82f6',  // Blue
  [USER_ROLES.QA]: '#10b981',         // Green
  [USER_ROLES.VIEWER]: '#6b7280'      // Gray
};