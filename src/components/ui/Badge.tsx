import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "danger" | "info" | "neutral";
  size?: "sm" | "md";
}

const Badge: React.FC<BadgeProps> = ({ children, variant = "neutral", size = "md" }) => {
  const styles: Record<string, React.CSSProperties> = {
    success: { backgroundColor: "#DCFCE7", color: "#166534" },
    warning: { backgroundColor: "#FEF9C3", color: "#854D0E" },
    danger: { backgroundColor: "#FEE2E2", color: "#991B1B" },
    info: { backgroundColor: "#E0F2FE", color: "#075985" },
    neutral: { backgroundColor: "#F1F5F9", color: "#475569" },
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px]",
    md: "px-2.5 py-0.5 text-xs",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full font-bold uppercase tracking-wider ${sizes[size]}`}
      style={styles[variant]}
    >
      {children}
    </span>
  );
};

export default Badge;
