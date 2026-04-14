import { cn } from "@/lib/utils";

interface FieldGroupProps {
  label: string;
  value: string | number;
  unit?: string;
  className?: string;
}

export function FieldGroup({ label, value, unit, className }: FieldGroupProps) {
  return (
    <div className={cn("space-y-0.5", className)}>
      <p className="text-xs text-nx-text-muted">{label}</p>
      <p className="text-sm font-medium text-nx-text">
        {value}
        {unit && <span className="text-xs text-nx-text-muted ml-1">{unit}</span>}
      </p>
    </div>
  );
}
