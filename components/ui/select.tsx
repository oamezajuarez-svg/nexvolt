"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "children"> {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, error, className, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-nx-text">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border border-nx-border bg-nx-surface px-3 py-2 text-sm text-nx-text",
            "focus:outline-none focus:ring-2 focus:ring-nx-primary-ring focus:border-nx-primary",
            "transition-colors appearance-none",
            error && "border-nx-danger focus:ring-nx-danger/30",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" className="text-nx-text-muted">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {error && <p className="text-xs text-nx-danger">{error}</p>}
      </div>
    );
  }
);
Select.displayName = "Select";
