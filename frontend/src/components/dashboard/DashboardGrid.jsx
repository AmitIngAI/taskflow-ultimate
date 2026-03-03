import { Responsive, WidthProvider } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import Widget from '../widgets/Widget';
import { useWidgetStore } from '../../store/useWidgetStore';

const ResponsiveGridLayout = WidthProvider(Responsive);

const DashboardGrid = ({ dashboardId }) => {
  const {
    dashboards,
    isEditMode,
    removeWidget,
    updateWidgetPosition,
  } = useWidgetStore();

  const dashboard = dashboards[dashboardId];
  if (!dashboard) return null;

  const handleLayoutChange = (layout) => {
    if (!isEditMode) return;

    layout.forEach((item) => {
      const widget = dashboard.widgets.find((w) => w.id === item.i);
      if (widget) {
        updateWidgetPosition(dashboardId, item.i, {
          x: item.x,
          y: item.y,
          w: item.w,
          h: item.h,
        });
      }
    });
  };

  const layouts = {
    lg: dashboard.widgets.map((widget) => ({
      i: widget.id,
      x: widget.position.x,
      y: widget.position.y,
      w: widget.position.w,
      h: widget.position.h,
      minW: 1,
      minH: 1,
    })),
  };

  return (
    <ResponsiveGridLayout
      className="layout"
      layouts={layouts}
      breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
      cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
      rowHeight={150}
      isDraggable={isEditMode}
      isResizable={isEditMode}
      onLayoutChange={handleLayoutChange}
      draggableHandle=".drag-handle"
    >
      {dashboard.widgets.map((widget) => (
        <div key={widget.id} className="widget-container">
          <Widget
            widget={widget}
            isEditMode={isEditMode}
            onRemove={() => removeWidget(dashboardId, widget.id)}
            onConfigure={() => {
              // Open widget configuration modal
              console.log('Configure widget:', widget.id);
            }}
          />
        </div>
      ))}
    </ResponsiveGridLayout>
  );
};

export default DashboardGrid;