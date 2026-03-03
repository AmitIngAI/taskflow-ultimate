import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { ChevronDown } from 'lucide-react';

const Dropdown = ({ 
  trigger, 
  children, 
  align = 'left',
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignments = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2',
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <button className="btn-secondary flex items-center gap-2">
            Options
            <ChevronDown className={cn(
              'w-4 h-4 transition-transform',
              isOpen && 'rotate-180'
            )} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full mt-2 z-50 min-w-[200px]',
              'bg-white dark:bg-dark-800 rounded-lg shadow-lg',
              'border border-gray-200 dark:border-dark-700',
              'py-1',
              alignments[align],
              className
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DropdownItem = ({ children, onClick, icon: Icon, danger = false }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full px-4 py-2 text-left flex items-center gap-3',
        'hover:bg-gray-100 dark:hover:bg-dark-700',
        'transition-colors text-sm',
        danger 
          ? 'text-red-600 dark:text-red-400' 
          : 'text-gray-700 dark:text-gray-300'
      )}
    >
      {Icon && <Icon className="w-4 h-4" />}
      {children}
    </button>
  );
};

export default Dropdown;