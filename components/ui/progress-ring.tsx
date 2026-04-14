"use client";

import { cn } from "@/lib/utils";

interface ProgressRingProps {
  value: number; // 0-100
  size?: number; // px
  strokeWidth?: number;
  color?: "primary" | "accent" | "warning" | "danger";
  label?: string;
  className?: string;
}

const colorMap = {
  primary: "stroke-nx-primary",
  accent: "stroke-nx-accent",
  warning: "stroke-nx-warning",
  danger: "stroke-nx-danger",
};

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 6,
  color = "primary",
  label,
  className,
}: ProgressRingProps) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={cn("inline-flex flex-col items-center gap-1.5", className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-nx-surface"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={cn("transition-all duration-700", colorMap[color])}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        {/* Center text */}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="fill-nx-text text-sm font-bold rotate-90"
          style={{ transformOrigin: "center" }}
        >
          {Math.round(clamped)}%
        </text>
      </svg>
      {label && <span className="text-xs text-nx-text-muted text-center">{label}</span>}
    </div>
  );
}
