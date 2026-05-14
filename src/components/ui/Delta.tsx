import React from 'react';
import Icon from './Icon';

interface DeltaProps {
  value: number;
  fmt?: 'pct' | 'abs';
  polarity?: 'good' | 'bad' | 'neutral';
  size?: 'sm' | 'md';
  emphasize?: boolean;
}

const Delta: React.FC<DeltaProps> = ({ value, fmt = 'pct', polarity = 'neutral', size = 'md', emphasize = false }) => {
  if (value === 0) return <span className="text-[#94A3B8] text-xs font-medium">--</span>;

  const isPositive = value > 0;
  const absValue = Math.abs(value);
  const displayValue = fmt === 'pct' ? `${Math.round(absValue * 100)}%` : absValue.toFixed(1);

  let colorClass = 'text-[#64748B]';
  if (polarity === 'good') colorClass = isPositive ? 'text-[#1F8A5B]' : 'text-[#B2401D]';
  if (polarity === 'bad') colorClass = isPositive ? 'text-[#B2401D]' : 'text-[#1F8A5B]';

  const bgClass = emphasize ? (isPositive && polarity === 'bad' ? 'bg-[#FFF1F0]' : 'bg-[#F0FDF4]') : '';

  return (
    <div className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${bgClass} ${colorClass} ${size === 'sm' ? 'text-[11px]' : 'text-xs'} font-bold tabular`}>
      <Icon name={isPositive ? 'TrendingUp' : 'TrendingDown'} size={size === 'sm' ? 12 : 14} />
      <span>{displayValue}</span>
    </div>
  );
};

export default Delta;
