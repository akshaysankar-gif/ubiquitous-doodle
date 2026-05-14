import React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    const variants = {
      primary: {
        backgroundColor: "var(--brand-teal)",
        color: "#FFFFFF",
        border: "none",
      },
      secondary: {
        backgroundColor: "#E2E8F0",
        color: "#1E293B",
        border: "none",
      },
      outline: {
        backgroundColor: "transparent",
        color: "#1E293B",
        border: "1px solid #E2E8F0",
      },
      ghost: {
        backgroundColor: "transparent",
        color: "#64748B",
        border: "none",
      },
      danger: {
        backgroundColor: "#EF4444",
        color: "#FFFFFF",
        border: "none",
      },
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-4 py-2 text-sm",
      lg: "px-6 py-3 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed",
          sizes[size],
          className
        )}
        style={variants[variant]}
        {...props}
      >
        {isLoading ? (
          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export default Button;
