import { cn } from '../../utils/cn';
import { User } from 'lucide-react';

const Avatar = ({ 
  src, 
  alt = 'User', 
  size = 'md',
  className,
  fallback 
}) => {
  const sizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
    '2xl': 'w-20 h-20',
  };

  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
  };

  const getInitials = (name) => {
    return name
      ?.split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={cn(
        'rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold',
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : fallback ? (
        <span className={textSizes[size]}>{getInitials(fallback)}</span>
      ) : (
        <User className={cn('w-1/2 h-1/2')} />
      )}
    </div>
  );
};

export default Avatar;