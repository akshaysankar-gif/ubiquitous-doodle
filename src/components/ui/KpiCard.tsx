import React from 'react';
import Card from './Card';
import Icon from './Icon';
import Delta from './Delta';

interface KpiCardProps {
  icon: string;
  label: string;
  value: string | number;
  delta?: number;
  deltaFmt?: 'pct' | 'abs';
  polarity?: 'good' | 'bad' | 'neutral';
  accent?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ icon, label, value, delta, deltaFmt = 'pct', polarity = 'neutral', accent = 'primary' }) => {
  const accentColors: any = {
    primary: 'bg-[#E6F5F6] text-[#00828D]',
    accent: 'bg-[#EAE9FE] text-[#7158F5]',
    warning: 'bg-[#FFF6EF] text-[#F59E0B]',
    negative: 'bg-[#FFF6F3] text-[#F65633]',
    highlight: 'bg-[#FFFCDA] text-[#E6CF00]',
  };

  return (
    <Card className="flex flex-col p-4">
      <div className="flex items-center justify-between mb-3">
        <div className={`p-2 rounded-lg ${accentColors[accent] || accentColors.primary}`}>
          <Icon name={icon} size={18} />
        </div>
        {delta !== undefined && (
          <Delta value={delta} fmt={deltaFmt} polarity={polarity} size="sm" />
        )}
      </div>
      <div className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider mb-1">{label}</div>
      <div className="text-2xl font-bold text-[#1E293B] tabular">{value}</div>
    </Card>
  );
};

export default KpiCard;
