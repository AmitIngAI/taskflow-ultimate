import { Inbox } from 'lucide-react';
import Button from './Button';

const EmptyState = ({ 
  icon: Icon = Inbox,
  title = 'No data found',
  description,
  action,
  actionLabel,
  onAction 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="w-16 h-16 bg-gray-100 dark:bg-dark-800 rounded-full flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      
      {description && (
        <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
          {description}
        </p>
      )}
      
      {action || (actionLabel && onAction) ? (
        action || <Button onClick={onAction}>{actionLabel}</Button>
      ) : null}
    </div>
  );
};

export default EmptyState;