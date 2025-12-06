import { useEffect, useState } from 'react';
import { useCurrentPrice } from '@/hooks/useCurrentPrice';
import { cn } from '@/lib/utils';

interface PriceChartProps {
  className?: string;
}

interface PricePoint {
  value: number;
  timestamp: number;
}

export function PriceChart({ className }: PriceChartProps) {
  const { data: price } = useCurrentPrice();
  const [history, setHistory] = useState<PricePoint[]>([]);

  useEffect(() => {
    if (price) {
      setHistory(prev => {
        const newHistory = [...prev, { value: price.price, timestamp: price.timestamp }];
        // Keep last 50 points
        return newHistory.slice(-50);
      });
    }
  }, [price?.timestamp]);

  if (history.length < 2) {
    return (
      <div className={cn("h-32 flex items-center justify-center bg-muted/30 rounded-lg", className)}>
        <span className="text-sm text-muted-foreground">Loading chart...</span>
      </div>
    );
  }

  const minPrice = Math.min(...history.map(p => p.value));
  const maxPrice = Math.max(...history.map(p => p.value));
  const priceRange = maxPrice - minPrice || 1;

  const latestPrice = history[history.length - 1]?.value || 0;
  const previousPrice = history[history.length - 2]?.value || latestPrice;
  const isUp = latestPrice >= previousPrice;

  const points = history.map((point, i) => {
    const x = (i / (history.length - 1)) * 100;
    const y = 100 - ((point.value - minPrice) / priceRange) * 80 - 10;
    return `${x},${y}`;
  }).join(' ');

  const gradientId = `price-gradient-${isUp ? 'up' : 'down'}`;

  return (
    <div className={cn("relative h-32 rounded-lg bg-muted/30 overflow-hidden", className)}>
      <svg
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              className={isUp ? "text-up" : "text-down"}
              stopColor="currentColor"
              stopOpacity="0.3"
            />
            <stop
              offset="100%"
              className={isUp ? "text-up" : "text-down"}
              stopColor="currentColor"
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Area fill */}
        <polygon
          points={`0,100 ${points} 100,100`}
          fill={`url(#${gradientId})`}
        />

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          className={isUp ? "stroke-up" : "stroke-down"}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Current price dot */}
        <circle
          cx="100"
          cy={100 - ((latestPrice - minPrice) / priceRange) * 80 - 10}
          r="2"
          className={cn(
            "animate-pulse-glow",
            isUp ? "fill-up" : "fill-down"
          )}
        />
      </svg>

      {/* Price labels */}
      <div className="absolute top-2 right-2 text-xs text-muted-foreground font-mono">
        ${maxPrice.toFixed(0)}
      </div>
      <div className="absolute bottom-2 right-2 text-xs text-muted-foreground font-mono">
        ${minPrice.toFixed(0)}
      </div>
    </div>
  );
}
