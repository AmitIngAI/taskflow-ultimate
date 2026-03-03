import { cn } from '../../utils/cn';

const Card = ({ 
  children, 
  className,
  hoverable = false,
  onClick 
}) => {
  return (
    <div
      className={cn(
        'card',
        hoverable && 'hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;