"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={id} className="block text-sm font-medium text-nx-text">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={id}
          className={cn(
            "w-full rounded-lg border border-nx-border bg-nx-surface px-3 py-2 text-sm text-nx-text",
            "placeholder:text-nx-text-muted resize-y min-h-[80px]",
            "focus:outline-none focus:ring-2 focus:ring-nx-primary-ring focus:border-nx-primary",
            "transition-colors",
            error && "border-nx-danger focus:ring-nx-danger/30",
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-nx-danger">{error}</p>}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";
