import { useEffect, useState } from 'react';
import { useLiveTick } from '@/hooks/useLiveTick';
import { useCurrentRound } from '@/hooks/useRound';
import { QUBIC_CONFIG } from '@/config/constants';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function CountdownTimer({ className, size = 'md' }: CountdownTimerProps) {
  const { data: tick } = useLiveTick();
  const { data: round } = useCurrentRound();
  const [ticksRemaining, setTicksRemaining] = useState(QUBIC_CONFIG.roundDuration);

  useEffect(() => {
    if (tick && round) {
      const remaining = Math.max(0, round.endTick - tick.tick);
      setTicksRemaining(remaining);
    }
  }, [tick, round]);

  const progress = ((QUBIC_CONFIG.roundDuration - ticksRemaining) / QUBIC_CONFIG.roundDuration) * 100;
  const isUrgent = ticksRemaining <= 5;

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div className="text-xs uppercase tracking-wider text-muted-foreground">
        Time Remaining
      </div>
      <div
        className={cn(
          "font-mono font-bold transition-all",
          sizeClasses[size],
          isUrgent ? "text-down animate-countdown" : "text-foreground"
        )}
      >
        {ticksRemaining}
        <span className="text-muted-foreground text-lg ml-1">ticks</span>
      </div>
      <div className="w-full max-w-[200px] h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300 rounded-full",
            isUrgent ? "bg-down" : "bg-primary"
          )}
          style={{ width: `${progress}%` }}
        />
      </div>
      {tick && (
        <div className="text-xs text-muted-foreground font-mono">
          Tick #{tick.tick.toLocaleString()}
        </div>
      )}
    </div>
  );
}
