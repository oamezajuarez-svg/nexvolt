"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number; // 0-100
  label?: string;
  showPercent?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "accent" | "warning" | "danger";
  className?: string;
}

const colorMap = {
  primary: "bg-nx-primary",
  accent: "bg-nx-accent",
  warning: "bg-nx-warning",
  danger: "bg-nx-danger",
};

const sizeMap = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
};

export function ProgressBar({
  value,
  label,
  showPercent = true,
  size = "md",
  color = "primary",
  className,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div className={cn("w-full", className)}>
      {(label || showPercent) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && <span className="text-xs text-nx-text-muted">{label}</span>}
          {showPercent && (
            <span className="text-xs font-medium text-nx-text">{Math.round(clamped)}%</span>
          )}
        </div>
      )}
      <div className={cn("w-full rounded-full bg-nx-surface overflow-hidden", sizeMap[size])}>
        <div
          className={cn("h-full rounded-full transition-all duration-500", colorMap[color])}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
