import React from "react";

export interface PillProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
  count?: number;
}

const Pill: React.FC<PillProps> = ({ label, active, onClick, count }) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-all ${
        active
          ? "bg-[#00828D] text-white"
          : "bg-[#F1F5F9] text-[#64748B] hover:bg-[#E2E8F0] hover:text-[#1E293B]"
      }`}
    >
      {label}
      {count !== undefined && (
        <span
          className={`inline-flex h-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${
            active ? "bg-white/20 text-white" : "bg-[#CBD5E1] text-[#475569]"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
};

export default Pill;
