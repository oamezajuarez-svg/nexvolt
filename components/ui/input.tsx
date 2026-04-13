import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-nx-text-secondary">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          "w-full rounded-lg border bg-nx-surface px-4 py-2.5 text-sm text-nx-text placeholder:text-nx-text-muted",
          "focus:outline-none focus:ring-2 focus:ring-nx-primary-ring focus:border-nx-primary",
          "transition-colors",
          error ? "border-nx-danger" : "border-nx-border",
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-nx-danger">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";
