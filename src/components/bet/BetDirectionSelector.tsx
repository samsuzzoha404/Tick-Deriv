import { cn } from '@/lib/utils';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { BetDirection } from '@/types';

interface BetDirectionSelectorProps {
  selected: BetDirection | null;
  onSelect: (direction: BetDirection) => void;
  disabled?: boolean;
  className?: string;
}

export function BetDirectionSelector({
  selected,
  onSelect,
  disabled = false,
  className,
}: BetDirectionSelectorProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-4", className)}>
      <button
        onClick={() => onSelect('UP')}
        disabled={disabled}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 transition-all duration-300",
          "hover:scale-[1.02] active:scale-[0.98]",
          selected === 'UP'
            ? "border-up bg-up/10 glow-up"
            : "border-border bg-card hover:border-up/50",
          disabled && "opacity-50 cursor-not-allowed hover:scale-100"
        )}
      >
        <div
          className={cn(
            "p-4 rounded-full transition-colors",
            selected === 'UP' ? "bg-up text-up-foreground" : "bg-muted"
          )}
        >
          <ArrowUp className="h-8 w-8" />
        </div>
        <span className={cn(
          "text-xl font-bold",
          selected === 'UP' ? "text-up" : "text-foreground"
        )}>
          UP
        </span>
        <span className="text-sm text-muted-foreground">
          Price will increase
        </span>
      </button>

      <button
        onClick={() => onSelect('DOWN')}
        disabled={disabled}
        className={cn(
          "relative flex flex-col items-center justify-center gap-2 p-6 rounded-xl border-2 transition-all duration-300",
          "hover:scale-[1.02] active:scale-[0.98]",
          selected === 'DOWN'
            ? "border-down bg-down/10 glow-down"
            : "border-border bg-card hover:border-down/50",
          disabled && "opacity-50 cursor-not-allowed hover:scale-100"
        )}
      >
        <div
          className={cn(
            "p-4 rounded-full transition-colors",
            selected === 'DOWN' ? "bg-down text-down-foreground" : "bg-muted"
          )}
        >
          <ArrowDown className="h-8 w-8" />
        </div>
        <span className={cn(
          "text-xl font-bold",
          selected === 'DOWN' ? "text-down" : "text-foreground"
        )}>
          DOWN
        </span>
        <span className="text-sm text-muted-foreground">
          Price will decrease
        </span>
      </button>
    </div>
  );
}
