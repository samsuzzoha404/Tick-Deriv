import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  glow?: 'up' | 'down' | 'primary' | 'none';
}

export function GlassCard({ children, className, hover = false, glow = 'none' }: GlassCardProps) {
  const glowClasses = {
    up: 'glow-up',
    down: 'glow-down',
    primary: 'glow-primary',
    none: '',
  };

  return (
    <div
      className={cn(
        "glass-card p-4 transition-all duration-300",
        hover && "hover:scale-[1.02] hover:shadow-2xl hover:border-primary/60 cursor-pointer",
        glowClasses[glow],
        className
      )}
    >
      {children}
    </div>
  );
}
