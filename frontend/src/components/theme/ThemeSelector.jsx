import { useState } from 'react';
import { Sun, Moon, Monitor, Palette, Plus, Download, Upload, Trash2 } from 'lucide-react';
import { useThemeStore } from '../../store/useThemeStore';
import Modal from '../common/Modal';

const ThemeSelector = () => {
  const {
    currentTheme,
    mode,
    accentColor,
    themePresets,
    customThemes,
    setTheme,
    setMode,
    setAccentColor,
    createCustomTheme,
    deleteCustomTheme,
    exportTheme,
    importTheme,
  } = useThemeStore();

  const [showCustomTheme, setShowCustomTheme] = useState(false);
  const [customThemeData, setCustomThemeData] = useState({
    name: '',
    colors: {
      primary: '#6366f1',
      background: '#ffffff',
      surface: '#f3f4f6',
      text: '#111827',
      textSecondary: '#6b7280',
      border: '#e5e7eb',
    },
  });

  const handleCreateTheme = () => {
    if (customThemeData.name) {
      createCustomTheme(customThemeData.name, customThemeData.colors);
      setShowCustomTheme(false);
      setCustomThemeData({
        name: '',
        colors: {
          primary: '#6366f1',
          background: '#ffffff',
          surface: '#f3f4f6',
          text: '#111827',
          textSecondary: '#6b7280',
          border: '#e5e7eb',
        },
      });
    }
  };

  const handleExport = (themeName) => {
    const themeJson = exportTheme(themeName);
    const blob = new Blob([themeJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${themeName}-theme.json`;
    a.click();
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const success = importTheme(event.target.result);
        if (success) {
          alert('Theme imported successfully!');
        } else {
          alert('Failed to import theme. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return (
    <div className="space-y-6">
      {/* Mode Selection */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Theme Mode</h3>
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => setMode('light')}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === 'light'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-dark-600 hover:border-primary-300'
            }`}
          >
            <Sun className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Light</div>
          </button>

          <button
            onClick={() => setMode('dark')}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === 'dark'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-dark-600 hover:border-primary-300'
            }`}
          >
            <Moon className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Dark</div>
          </button>

          <button
            onClick={() => setMode('auto')}
            className={`p-4 rounded-lg border-2 transition-all ${
              mode === 'auto'
                ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                : 'border-gray-200 dark:border-dark-600 hover:border-primary-300'
            }`}
          >
            <Monitor className="w-6 h-6 mx-auto mb-2" />
            <div className="text-sm font-medium">Auto</div>
          </button>
        </div>
      </div>

      {/* Preset Themes */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Preset Themes</h3>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(themePresets).map(([key, theme]) => (
            <button
              key={key}
              onClick={() => setTheme(key)}
              className={`p-4 rounded-lg border-2 transition-all text-left ${
                currentTheme === key
                  ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                  : 'border-gray-200 dark:border-dark-600 hover:border-primary-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: theme.colors.primary }}
                />
                <span className="font-medium">{theme.name}</span>
              </div>
              <div className="flex gap-1">
                {Object.values(theme.colors).slice(0, 5).map((color, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded border border-gray-300"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Accent Color Picker */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Accent Color</h3>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={accentColor}
            onChange={(e) => setAccentColor(e.target.value)}
            className="w-20 h-20 rounded-lg cursor-pointer border-2 border-gray-200 dark:border-dark-600"
          />
          <div className="flex-1">
            <div className="text-sm text-gray-600 dark:text-gray-400">Current Color</div>
            <div className="font-mono text-lg">{accentColor}</div>
          </div>
        </div>

        {/* Popular Colors */}
        <div className="mt-3 flex gap-2 flex-wrap">
          {['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ef4444'].map(
            (color) => (
              <button
                key={color}
                onClick={() => setAccentColor(color)}
                className="w-10 h-10 rounded-lg border-2 hover:scale-110 transition-transform"
                style={{
                  backgroundColor: color,
                  borderColor: accentColor === color ? '#000' : 'transparent',
                }}
              />
            )
          )}
        </div>
      </div>

      {/* Custom Themes */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold">Custom Themes</h3>
          <div className="flex gap-2">
            <button
              onClick={handleImport}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
              title="Import Theme"
            >
              <Upload className="w-5 h-5" />
            </button>
            <button
              onClick={() => setShowCustomTheme(true)}
              className="p-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              title="Create Custom Theme"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        {Object.keys(customThemes).length === 0 ? (
          <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 dark:border-dark-600 rounded-lg">
            <Palette className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No custom themes yet</p>
            <button
              onClick={() => setShowCustomTheme(true)}
              className="mt-2 text-primary-500 hover:underline"
            >
              Create your first theme
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(customThemes).map(([key, theme]) => (
              <div
                key={key}
                className={`p-4 rounded-lg border-2 transition-all ${
                  currentTheme === key
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-dark-600'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <button
                    onClick={() => setTheme(key)}
                    className="font-medium flex-1 text-left"
                  >
                    {theme.name}
                  </button>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleExport(key)}
                      className="p-1 hover:bg-gray-200 dark:hover:bg-dark-600 rounded"
                      title="Export"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteCustomTheme(key)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500 rounded"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex gap-1">
                  {Object.values(theme.colors).slice(0, 5).map((color, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded border border-gray-300"
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Custom Theme Creator Modal */}
      <Modal
        isOpen={showCustomTheme}
        onClose={() => setShowCustomTheme(false)}
        title="Create Custom Theme"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Theme Name</label>
            <input
              type="text"
              value={customThemeData.name}
              onChange={(e) =>
                setCustomThemeData({ ...customThemeData, name: e.target.value })
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700"
              placeholder="My Awesome Theme"
            />
          </div>

          {Object.entries(customThemeData.colors).map(([key, value]) => (
            <div key={key}>
              <label className="block text-sm font-medium mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={value}
                  onChange={(e) =>
                    setCustomThemeData({
                      ...customThemeData,
                      colors: {
                        ...customThemeData.colors,
                        [key]: e.target.value,
                      },
                    })
                  }
                  className="w-16 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={value}
                  onChange={(e) =>
                    setCustomThemeData({
                      ...customThemeData,
                      colors: {
                        ...customThemeData.colors,
                        [key]: e.target.value,
                      },
                    })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg bg-white dark:bg-dark-700 font-mono"
                />
              </div>
            </div>
          ))}

          <div className="flex gap-2 pt-4">
            <button
              onClick={() => setShowCustomTheme(false)}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-700"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateTheme}
              className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
            >
              Create Theme
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ThemeSelector;