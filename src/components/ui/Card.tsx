import React from "react";

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  title?: string;
  subtitle?: string;
  headerAction?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className, style, title, subtitle, headerAction }) => {
  return (
    <div
      className={`rounded-xl border border-[#E2E8F0] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] ${className || ""}`}
      style={{
        padding: "20px",
        ...style,
      }}
    >
      {(title || subtitle || headerAction) && (
        <div className="mb-4 flex items-center justify-between">
          <div>
            {title && <h3 className="text-sm font-bold text-[#1E293B]">{title}</h3>}
            {subtitle && <p className="mt-0.5 text-xs text-[#64748B]">{subtitle}</p>}
          </div>
          {headerAction && <div>{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
