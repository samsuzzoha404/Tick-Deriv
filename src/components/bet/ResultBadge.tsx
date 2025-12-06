import { cn, getResultBg } from '@/lib/utils';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { BetDirection } from '@/types';

interface ResultBadgeProps {
  direction: BetDirection | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ResultBadge({ direction, size = 'md', className }: ResultBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  if (!direction) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1 rounded-full font-medium bg-muted text-muted-foreground",
          sizeClasses[size],
          className
        )}
      >
        <Minus className={iconSizes[size]} />
        Pending
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-medium",
        getResultBg(direction),
        sizeClasses[size],
        className
      )}
    >
      {direction === 'UP' ? (
        <ArrowUp className={iconSizes[size]} />
      ) : (
        <ArrowDown className={iconSizes[size]} />
      )}
      {direction}
    </span>
  );
}
