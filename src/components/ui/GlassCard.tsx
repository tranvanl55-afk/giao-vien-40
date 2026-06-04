import { cn } from "@/src/lib/utils";
import React from "react";

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
  className?: string;
  onClick?: () => void;
}

export function GlassCard({ children, className, hoverable = false, ...props }: GlassCardProps) {
  return (
    <div 
      className={cn(
        "glass-effect rounded-2xl p-6 text-slate-800",
        hoverable && "glass-card-hover cursor-pointer",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
