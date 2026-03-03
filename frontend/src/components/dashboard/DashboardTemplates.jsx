import { Check } from 'lucide-react';
import { useWidgetStore, WIDGET_TYPES } from '../../store/useWidgetStore';

const templates = [
  {
    id: 'developer',
    name: 'Developer Dashboard',
    description: 'Perfect for tracking development tasks and progress',
    icon: '💻',
    widgets: [
      { type: WIDGET_TYPES.STATS, position: { x: 0, y: 0, w: 4, h: 1 } },
      { type: WIDGET_TYPES.RECENT_TASKS, position: { x: 0, y: 1, w: 2, h: 2 } },
      { type: WIDGET_TYPES.ACTIVITY, position: { x: 2, y: 1, w: 2, h: 2 } },
      { type: WIDGET_TYPES.CALENDAR, position: { x: 4, y: 0, w: 1, h: 3 } },
    ],
  },
  {
    id: 'manager',
    name: 'Manager Dashboard',
    description: 'Overview of team performance and project status',
    icon: '📊',
    widgets: [
      { type: WIDGET_TYPES.STATS, position: { x: 0, y: 0, w: 4, h: 1 } },
      { type: WIDGET_TYPES.CHART, position: { x: 0, y: 1, w: 3, h: 2 } },
      { type: WIDGET_TYPES.TEAM, position: { x: 3, y: 1, w: 1, h: 2 } },
      { type: WIDGET_TYPES.PROGRESS, position: { x: 0, y: 3, w: 4, h: 1 } },
    ],
  },
  {
    id: 'minimal',
    name: 'Minimal Dashboard',
    description: 'Clean and simple layout with essential widgets',
    icon: '✨',
    widgets: [
      { type: WIDGET_TYPES.QUICK_ADD, position: { x: 0, y: 0, w: 2, h: 1 } },
      { type: WIDGET_TYPES.UPCOMING, position: { x: 2, y: 0, w: 2, h: 2 } },
      { type: WIDGET_TYPES.RECENT_TASKS, position: { x: 0, y: 1, w: 2, h: 2 } },
    ],
  },
  {
    id: 'productivity',
    name: 'Productivity Focused',
    description: 'Maximize productivity with focused task management',
    icon: '🚀',
    widgets: [
      { type: WIDGET_TYPES.QUICK_ADD, position: { x: 0, y: 0, w: 1, h: 1 } },
      { type: WIDGET_TYPES.STATS, position: { x: 1, y: 0, w: 3, h: 1 } },
      { type: WIDGET_TYPES.UPCOMING, position: { x: 0, y: 1, w: 2, h: 2 } },
      { type: WIDGET_TYPES.CALENDAR, position: { x: 2, y: 1, w: 1, h: 2 } },
      { type: WIDGET_TYPES.ACTIVITY, position: { x: 3, y: 1, w: 1, h: 2 } },
    ],
  },
];

const DashboardTemplates = ({ onSelect, onClose }) => {
  const { createDashboard, addWidget, setActiveDashboard } = useWidgetStore();

  const handleSelectTemplate = (template) => {
    const dashboardId = createDashboard(template.name);
    
    // Add widgets from template
    template.widgets.forEach((widgetConfig) => {
      addWidget(dashboardId, widgetConfig.type);
      // Note: Position will be set by the grid layout
    });

    setActiveDashboard(dashboardId);
    onSelect?.();
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {templates.map((template) => (
        <button
          key={template.id}
          onClick={() => handleSelectTemplate(template)}
          className="p-6 border-2 border-gray-200 dark:border-dark-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-left group"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="text-4xl">{template.icon}</div>
            <div className="w-8 h-8 rounded-full border-2 border-gray-300 dark:border-dark-600 group-hover:border-primary-500 group-hover:bg-primary-500 flex items-center justify-center transition-colors">
              <Check className="w-5 h-5 text-white opacity-0 group-hover:opacity-100" />
            </div>
          </div>
          
          <h3 className="text-lg font-bold mb-2">{template.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            {template.description}
          </p>

          {/* Widget Preview */}
          <div className="flex gap-2 flex-wrap">
            {template.widgets.map((widget, index) => (
              <div
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-dark-700 rounded text-xs"
              >
                {widget.type}
              </div>
            ))}
          </div>
        </button>
      ))}
    </div>
  );
};

export default DashboardTemplates;