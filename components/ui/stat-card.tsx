import { cn } from "@/lib/utils";
import { Card, CardTitle, CardValue } from "./card";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  footnote?: string;
  icon?: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  valueColor?: string;
  className?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  footnote,
  icon: Icon,
  iconColor = "text-nx-primary",
  iconBg = "bg-nx-primary-bg",
  valueColor,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <CardTitle>{title}</CardTitle>
          <CardValue className={cn("text-xl", valueColor)}>{value}</CardValue>
        </div>
        {Icon && (
          <div className={cn("rounded-lg p-2", iconBg)}>
            <Icon className={cn("h-4 w-4", iconColor)} />
          </div>
        )}
      </div>
      {subtitle && <p className="text-xs text-nx-text-muted mt-2">{subtitle}</p>}
      {footnote && (
        <p className="text-[10px] text-nx-text-muted mt-1 border-t border-nx-border/50 pt-1">
          {footnote}
        </p>
      )}
    </Card>
  );
}
