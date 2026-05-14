import React from 'react';

interface SentimentBarProps {
  distribution: {
    calm: number;
    annoyed: number;
    frustrated: number;
    furious: number;
    total: number;
  };
  height?: number;
  showLabels?: boolean;
}

const SentimentBar: React.FC<SentimentBarProps> = ({ distribution, height = 14, showLabels = false }) => {
  const { calm, annoyed, frustrated, furious, total } = distribution;
  if (total === 0) return <div className="bg-[#F1F5F9] rounded-full w-full" style={{ height }} />;

  const segments = [
    { key: 'calm', count: calm, color: '#D7F0D7', label: 'Calm' },
    { key: 'annoyed', count: annoyed, color: '#FDE2B8', label: 'Annoyed' },
    { key: 'frustrated', count: frustrated, color: '#FDD8CE', label: 'Frustrated' },
    { key: 'furious', count: furious, color: '#F4C2C2', label: 'Furious' },
  ];

  return (
    <div className="w-full">
      <div className="flex w-full rounded-full overflow-hidden" style={{ height }}>
        {segments.map((seg) => {
          const width = (seg.count / total) * 100;
          if (width === 0) return null;
          return (
            <div 
              key={seg.key} 
              style={{ width: `${width}%`, backgroundColor: seg.color }}
              title={`${seg.label}: ${seg.count}`}
            />
          );
        })}
      </div>
      {showLabels && (
        <div className="flex justify-between mt-2">
          {segments.map((seg) => (
            <div key={seg.key} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: seg.color }} />
              <span className="text-[10px] font-bold text-[#64748B] uppercase">{seg.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentimentBar;
