import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  title: string;
  description?: string;
  icon?: LucideIcon;
  badge?: React.ReactNode;
  className?: string;
}

export function SectionHeader({ title, description, icon: Icon, badge, className }: SectionHeaderProps) {
  return (
    <div className={cn("flex items-start justify-between", className)}>
      <div className="flex items-start gap-2.5">
        {Icon && (
          <div className="rounded-lg p-2 bg-nx-primary-bg shrink-0 mt-0.5">
            <Icon className="h-4 w-4 text-nx-primary" />
          </div>
        )}
        <div>
          <h3 className="text-sm font-medium text-nx-text">{title}</h3>
          {description && (
            <p className="text-xs text-nx-text-muted mt-0.5">{description}</p>
          )}
        </div>
      </div>
      {badge}
    </div>
  );
}
