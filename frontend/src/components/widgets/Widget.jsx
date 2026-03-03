import { Settings, X, Move } from 'lucide-react';
import { WIDGET_TYPES } from '../../store/useWidgetStore';
import StatsWidget from './StatsWidget';
import RecentTasksWidget from './RecentTasksWidget';
import CalendarWidget from './CalendarWidget';
import ActivityWidget from './ActivityWidget';
import QuickAddWidget from './QuickAddWidget';

const widgetComponents = {
  [WIDGET_TYPES.STATS]: StatsWidget,
  [WIDGET_TYPES.RECENT_TASKS]: RecentTasksWidget,
  [WIDGET_TYPES.CALENDAR]: CalendarWidget,
  [WIDGET_TYPES.ACTIVITY]: ActivityWidget,
  [WIDGET_TYPES.QUICK_ADD]: QuickAddWidget,
};

const Widget = ({ widget, isEditMode, onRemove, onConfigure }) => {
  const WidgetComponent = widgetComponents[widget.type];

  if (!WidgetComponent) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        Widget not found
      </div>
    );
  }

  return (
    <div className="h-full bg-white dark:bg-dark-800 rounded-lg border border-gray-200 dark:border-dark-700 shadow-sm overflow-hidden flex flex-col">
      {/* Widget Header */}
      <div className="px-4 py-3 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between bg-gray-50 dark:bg-dark-900">
        <div className="flex items-center gap-2">
          {isEditMode && <Move className="w-4 h-4 text-gray-400 cursor-move" />}
          <h3 className="font-semibold text-sm">{widget.title}</h3>
        </div>
        {isEditMode && (
          <div className="flex items-center gap-1">
            <button
              onClick={onConfigure}
              className="p-1 hover:bg-gray-200 dark:hover:bg-dark-700 rounded"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onRemove}
              className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Widget Content */}
      <div className="flex-1 p-4 overflow-auto">
        <WidgetComponent config={widget.config} />
      </div>
    </div>
  );
};

export default Widget;