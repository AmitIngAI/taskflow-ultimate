import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Available widget types
export const WIDGET_TYPES = {
  STATS: 'stats',
  RECENT_TASKS: 'recentTasks',
  CALENDAR: 'calendar',
  ACTIVITY: 'activity',
  CHART: 'chart',
  QUICK_ADD: 'quickAdd',
  TEAM: 'team',
  PROGRESS: 'progress',
  UPCOMING: 'upcoming',
  CUSTOM: 'custom',
};

// Default widgets
const defaultWidgets = [
  {
    id: 'stats-1',
    type: WIDGET_TYPES.STATS,
    title: 'Overview Stats',
    position: { x: 0, y: 0, w: 3, h: 1 },
    config: {},
  },
  {
    id: 'recent-1',
    type: WIDGET_TYPES.RECENT_TASKS,
    title: 'Recent Tasks',
    position: { x: 0, y: 1, w: 2, h: 2 },
    config: { limit: 5 },
  },
  {
    id: 'calendar-1',
    type: WIDGET_TYPES.CALENDAR,
    title: 'Calendar',
    position: { x: 2, y: 1, w: 1, h: 2 },
    config: {},
  },
];

// Widget templates
const widgetTemplates = {
  [WIDGET_TYPES.STATS]: {
    name: 'Statistics',
    description: 'Show task statistics and counts',
    icon: '📊',
    defaultSize: { w: 3, h: 1 },
  },
  [WIDGET_TYPES.RECENT_TASKS]: {
    name: 'Recent Tasks',
    description: 'Display recently updated tasks',
    icon: '📝',
    defaultSize: { w: 2, h: 2 },
  },
  [WIDGET_TYPES.CALENDAR]: {
    name: 'Calendar',
    description: 'Mini calendar view',
    icon: '📅',
    defaultSize: { w: 1, h: 2 },
  },
  [WIDGET_TYPES.ACTIVITY]: {
    name: 'Activity Feed',
    description: 'Recent project activity',
    icon: '🔔',
    defaultSize: { w: 2, h: 2 },
  },
  [WIDGET_TYPES.CHART]: {
    name: 'Chart',
    description: 'Customizable charts',
    icon: '📈',
    defaultSize: { w: 2, h: 2 },
  },
  [WIDGET_TYPES.QUICK_ADD]: {
    name: 'Quick Add',
    description: 'Quickly add tasks',
    icon: '➕',
    defaultSize: { w: 1, h: 1 },
  },
  [WIDGET_TYPES.TEAM]: {
    name: 'Team Members',
    description: 'Show team members',
    icon: '👥',
    defaultSize: { w: 1, h: 2 },
  },
  [WIDGET_TYPES.PROGRESS]: {
    name: 'Progress',
    description: 'Project progress overview',
    icon: '🎯',
    defaultSize: { w: 2, h: 1 },
  },
  [WIDGET_TYPES.UPCOMING]: {
    name: 'Upcoming',
    description: 'Upcoming deadlines',
    icon: '⏰',
    defaultSize: { w: 2, h: 2 },
  },
};

export const useWidgetStore = create(
  persist(
    (set, get) => ({
      // Dashboards
      dashboards: {
        default: {
          id: 'default',
          name: 'Default Dashboard',
          widgets: defaultWidgets,
          isDefault: true,
        },
      },
      activeDashboardId: 'default',
      
      // Widget library
      widgetTemplates,
      
      // Custom widgets
      customWidgets: {},
      
      // Edit mode
      isEditMode: false,

      // Actions
      setEditMode: (isEditMode) => set({ isEditMode }),

      // Dashboard actions
      createDashboard: (name) => {
        const id = `dashboard-${Date.now()}`;
        const newDashboard = {
          id,
          name,
          widgets: [],
          isDefault: false,
        };
        
        set((state) => ({
          dashboards: {
            ...state.dashboards,
            [id]: newDashboard,
          },
          activeDashboardId: id,
        }));
        
        return id;
      },

      deleteDashboard: (id) => {
        const { dashboards, activeDashboardId } = get();
        if (dashboards[id]?.isDefault) {
          alert('Cannot delete default dashboard');
          return;
        }
        
        const { [id]: deleted, ...rest } = dashboards;
        
        set({
          dashboards: rest,
          activeDashboardId: activeDashboardId === id ? 'default' : activeDashboardId,
        });
      },

      renameDashboard: (id, name) => {
        set((state) => ({
          dashboards: {
            ...state.dashboards,
            [id]: {
              ...state.dashboards[id],
              name,
            },
          },
        }));
      },

      duplicateDashboard: (id) => {
        const { dashboards } = get();
        const original = dashboards[id];
        if (!original) return;

        const newId = `dashboard-${Date.now()}`;
        const newDashboard = {
          ...original,
          id: newId,
          name: `${original.name} (Copy)`,
          isDefault: false,
          widgets: original.widgets.map((w) => ({
            ...w,
            id: `${w.id}-copy-${Date.now()}`,
          })),
        };

        set((state) => ({
          dashboards: {
            ...state.dashboards,
            [newId]: newDashboard,
          },
        }));
      },

      setActiveDashboard: (id) => set({ activeDashboardId: id }),

      // Widget actions
      addWidget: (dashboardId, widgetType) => {
        const { dashboards, widgetTemplates } = get();
        const template = widgetTemplates[widgetType];
        
        if (!template) return;

        const newWidget = {
          id: `widget-${Date.now()}`,
          type: widgetType,
          title: template.name,
          position: {
            x: 0,
            y: Infinity, // Will be placed at bottom
            ...template.defaultSize,
          },
          config: {},
        };

        set((state) => ({
          dashboards: {
            ...state.dashboards,
            [dashboardId]: {
              ...state.dashboards[dashboardId],
              widgets: [...state.dashboards[dashboardId].widgets, newWidget],
            },
          },
        }));
      },

      removeWidget: (dashboardId, widgetId) => {
        set((state) => ({
          dashboards: {
            ...state.dashboards,
            [dashboardId]: {
              ...state.dashboards[dashboardId],
              widgets: state.dashboards[dashboardId].widgets.filter(
                (w) => w.id !== widgetId
              ),
            },
          },
        }));
      },

      updateWidget: (dashboardId, widgetId, updates) => {
        set((state) => ({
          dashboards: {
            ...state.dashboards,
            [dashboardId]: {
              ...state.dashboards[dashboardId],
              widgets: state.dashboards[dashboardId].widgets.map((w) =>
                w.id === widgetId ? { ...w, ...updates } : w
              ),
            },
          },
        }));
      },

      updateWidgetPosition: (dashboardId, widgetId, position) => {
        set((state) => ({
          dashboards: {
            ...state.dashboards,
            [dashboardId]: {
              ...state.dashboards[dashboardId],
              widgets: state.dashboards[dashboardId].widgets.map((w) =>
                w.id === widgetId ? { ...w, position } : w
              ),
            },
          },
        }));
      },

      // Custom widget actions
      createCustomWidget: (name, content) => {
        const id = `custom-${Date.now()}`;
        set((state) => ({
          customWidgets: {
            ...state.customWidgets,
            [id]: {
              id,
              name,
              content,
              type: WIDGET_TYPES.CUSTOM,
            },
          },
        }));
        return id;
      },

      // Export/Import
      exportDashboard: (id) => {
        const { dashboards } = get();
        const dashboard = dashboards[id];
        if (!dashboard) return null;
        
        return JSON.stringify(dashboard, null, 2);
      },

      importDashboard: (dashboardJson) => {
        try {
          const dashboard = JSON.parse(dashboardJson);
          const newId = `dashboard-${Date.now()}`;
          
          set((state) => ({
            dashboards: {
              ...state.dashboards,
              [newId]: {
                ...dashboard,
                id: newId,
                name: `${dashboard.name} (Imported)`,
                isDefault: false,
              },
            },
          }));
          
          return true;
        } catch (error) {
          console.error('Invalid dashboard JSON:', error);
          return false;
        }
      },

      // Get active dashboard
      getActiveDashboard: () => {
        const { dashboards, activeDashboardId } = get();
        return dashboards[activeDashboardId];
      },
    }),
    {
      name: 'widget-storage',
    }
  )
);