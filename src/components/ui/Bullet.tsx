import React from 'react';

interface BulletProps {
  value: number; // 0 to 1
  color?: string;
  width?: string | number;
  height?: number;
}

const Bullet: React.FC<BulletProps> = ({ value, color = '#00828D', width = '100%', height = 6 }) => {
  return (
    <div 
      className="bg-[#F1F5F9] rounded-full overflow-hidden" 
      style={{ width, height }}
    >
      <div 
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ 
          width: `${Math.min(100, Math.max(0, value * 100))}%`,
          backgroundColor: color 
        }}
      />
    </div>
  );
};

export default Bullet;
