import { Plus, X } from 'lucide-react';
import { useWidgetStore, WIDGET_TYPES } from '../../store/useWidgetStore';

const WidgetLibrary = ({ isOpen, onClose, dashboardId }) => {
  const { widgetTemplates, addWidget, customWidgets } = useWidgetStore();

  const handleAddWidget = (widgetType) => {
    addWidget(dashboardId, widgetType);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-dark-800 rounded-lg shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-dark-700 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Widget Library</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Built-in Widgets */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-4">Built-in Widgets</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(widgetTemplates).map(([type, template]) => (
                <button
                  key={type}
                  onClick={() => handleAddWidget(type)}
                  className="p-4 border-2 border-gray-200 dark:border-dark-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-left group"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-3xl">{template.icon}</div>
                    <Plus className="w-5 h-5 text-gray-400 group-hover:text-primary-500" />
                  </div>
                  <h4 className="font-semibold mb-1">{template.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {template.description}
                  </p>
                  <div className="mt-2 text-xs text-gray-500">
                    Size: {template.defaultSize.w} × {template.defaultSize.h}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Widgets */}
          {Object.keys(customWidgets).length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-4">Custom Widgets</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(customWidgets).map(([id, widget]) => (
                  <button
                    key={id}
                    onClick={() => handleAddWidget(id)}
                    className="p-4 border-2 border-gray-200 dark:border-dark-600 rounded-lg hover:border-primary-500 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all text-left"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="text-3xl">🎨</div>
                      <Plus className="w-5 h-5 text-gray-400" />
                    </div>
                    <h4 className="font-semibold">{widget.name}</h4>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-900">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

export default WidgetLibrary;