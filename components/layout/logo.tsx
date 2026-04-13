import { cn } from "@/lib/utils";

interface LogoProps {
  collapsed?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { icon: "w-7 h-7 text-sm", text: "text-base" },
  md: { icon: "w-9 h-9 text-base", text: "text-lg" },
  lg: { icon: "w-12 h-12 text-xl", text: "text-2xl" },
};

export function Logo({ collapsed, className, size = "md" }: LogoProps) {
  const s = sizes[size];

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg bg-nx-primary/10 border border-nx-primary/20 font-bold text-nx-primary",
          s.icon
        )}
      >
        {/* N with lightning bolt effect */}
        <span className="relative z-10">N</span>
        <svg
          className="absolute -right-0.5 -top-0.5 w-3 h-3 text-nx-accent"
          viewBox="0 0 12 12"
          fill="currentColor"
        >
          <path d="M7 0L3 7h3l-1 5 4-7H6l1-5z" />
        </svg>
      </div>
      {!collapsed && (
        <span className={cn("font-semibold tracking-tight text-nx-text", s.text)}>
          Nex<span className="text-nx-primary">volt</span>
        </span>
      )}
    </div>
  );
}
