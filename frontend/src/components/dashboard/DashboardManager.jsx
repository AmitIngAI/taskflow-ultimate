import { useState } from 'react';
import { Plus, MoreVertical, Download, Upload, Copy, Trash2, Edit2 } from 'lucide-react';
import { useWidgetStore } from '../../store/useWidgetStore';
import Dropdown from '../common/Dropdown';

const DashboardManager = () => {
  const {
    dashboards,
    activeDashboardId,
    createDashboard,
    deleteDashboard,
    renameDashboard,
    duplicateDashboard,
    setActiveDashboard,
    exportDashboard,
    importDashboard,
  } = useWidgetStore();

  const [showNewDashboard, setShowNewDashboard] = useState(false);
  const [newDashboardName, setNewDashboardName] = useState('');

  const handleCreateDashboard = () => {
    if (newDashboardName.trim()) {
      createDashboard(newDashboardName);
      setNewDashboardName('');
      setShowNewDashboard(false);
    }
  };

  const handleExport = (id) => {
    const dashboardJson = exportDashboard(id);
    const blob = new Blob([dashboardJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dashboards[id].name}-dashboard.json`;
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
        const success = importDashboard(event.target.result);
        if (success) {
          alert('Dashboard imported successfully!');
        } else {
          alert('Failed to import dashboard.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  const handleRename = (id) => {
    const newName = prompt('Enter new dashboard name:', dashboards[id].name);
    if (newName && newName.trim()) {
      renameDashboard(id, newName);
    }
  };

  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {/* Dashboard Tabs */}
      {Object.entries(dashboards).map(([id, dashboard]) => (
        <div key={id} className="flex items-center gap-1">
          <button
            onClick={() => setActiveDashboard(id)}
            className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
              activeDashboardId === id
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600'
            }`}
          >
            {dashboard.name}
          </button>

          {/* Dashboard Menu */}
          <Dropdown
            trigger={
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg">
                <MoreVertical className="w-4 h-4" />
              </button>
            }
          >
            <div className="py-1">
              <button
                onClick={() => handleRename(id)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center gap-2"
              >
                <Edit2 className="w-4 h-4" />
                Rename
              </button>
              <button
                onClick={() => duplicateDashboard(id)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center gap-2"
              >
                <Copy className="w-4 h-4" />
                Duplicate
              </button>
              <button
                onClick={() => handleExport(id)}
                className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-dark-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              {!dashboard.isDefault && (
                <button
                  onClick={() => {
                    if (confirm('Delete this dashboard?')) {
                      deleteDashboard(id);
                    }
                  }}
                  className="w-full px-4 py-2 text-left hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              )}
            </div>
          </Dropdown>
        </div>
      ))}

      {/* New Dashboard Button */}
      {showNewDashboard ? (
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={newDashboardName}
            onChange={(e) => setNewDashboardName(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreateDashboard()}
            placeholder="Dashboard name..."
            className="px-3 py-2 bg-white dark:bg-dark-700 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
          <button
            onClick={handleCreateDashboard}
            className="px-3 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            Create
          </button>
          <button
            onClick={() => setShowNewDashboard(false)}
            className="px-3 py-2 bg-gray-200 dark:bg-dark-600 rounded-lg hover:bg-gray-300 dark:hover:bg-dark-500"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowNewDashboard(true)}
          className="px-4 py-2 bg-gray-100 dark:bg-dark-700 hover:bg-gray-200 dark:hover:bg-dark-600 rounded-lg flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="w-4 h-4" />
          New Dashboard
        </button>
      )}

      {/* Import Button */}
      <button
        onClick={handleImport}
        className="p-2 hover:bg-gray-100 dark:hover:bg-dark-700 rounded-lg"
        title="Import Dashboard"
      >
        <Upload className="w-4 h-4" />
      </button>
    </div>
  );
};

export default DashboardManager;