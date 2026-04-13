import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

type BadgeVariant = "default" | "primary" | "accent" | "danger" | "warning";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variants: Record<BadgeVariant, string> = {
  default: "bg-nx-surface text-nx-text-secondary border-nx-border",
  primary: "bg-nx-primary-bg text-nx-primary border-nx-primary/20",
  accent: "bg-nx-accent-bg text-nx-accent border-nx-accent/20",
  danger: "bg-nx-danger-bg text-nx-danger border-nx-danger/20",
  warning: "bg-nx-warning-bg text-nx-warning border-nx-warning/20",
};

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
