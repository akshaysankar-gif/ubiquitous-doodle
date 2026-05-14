import React from 'react';

interface SectionHeadProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

const SectionHead: React.FC<SectionHeadProps> = ({ title, subtitle, actions }) => {
  return (
    <div className="flex items-start justify-between mb-4 gap-4">
      <div className="min-w-0">
        <h3 className="text-[14px] font-bold text-[var(--ss-fg)] leading-tight">{title}</h3>
        {subtitle && (
          <p className="text-[11px] text-[var(--ss-fg-muted)] mt-1 font-medium leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
};

export default SectionHead;
