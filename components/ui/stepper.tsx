"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface Step {
  label: string;
  description?: string;
}

interface StepperProps {
  steps: Step[];
  current: number; // 0-based index
  onStepClick?: (index: number) => void;
  className?: string;
}

export function Stepper({ steps, current, onStepClick, className }: StepperProps) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      {steps.map((step, i) => {
        const isComplete = i < current;
        const isCurrent = i === current;

        return (
          <div key={i} className="flex items-center gap-2 flex-1 last:flex-none">
            {/* Circle */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onStepClick?.(i)}
                disabled={!onStepClick}
                className={cn(
                  "h-8 w-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors border-2",
                  onStepClick && "cursor-pointer",
                  isComplete && "bg-nx-accent border-nx-accent text-white",
                  isCurrent && "bg-nx-primary border-nx-primary text-white",
                  !isComplete && !isCurrent && "border-nx-border text-nx-text-muted bg-nx-surface"
                )}
              >
                {isComplete ? <Check className="h-4 w-4" /> : i + 1}
              </button>
              <div className="hidden sm:block">
                <p
                  className={cn(
                    "text-xs font-medium",
                    isCurrent ? "text-nx-text" : "text-nx-text-muted"
                  )}
                >
                  {step.label}
                </p>
              </div>
            </div>

            {/* Connector line */}
            {i < steps.length - 1 && (
              <div
                className={cn(
                  "flex-1 h-0.5 rounded-full min-w-[20px]",
                  i < current ? "bg-nx-accent" : "bg-nx-border"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
