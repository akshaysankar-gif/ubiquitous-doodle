"use client";

import React from 'react';
import * as LucideIcons from 'lucide-react';

// Ported from ui-prototype/lib/Atoms.jsx
// Simplified and typed for Next.js

export const Icon = ({ name, size = 18, color = 'currentColor', stroke = 1.75 }: any) => {
  const LucideIcon = (LucideIcons as any)[name] || LucideIcons.HelpCircle;
  return <LucideIcon size={size} color={color} strokeWidth={stroke} className="inline-flex" />;
};

export const Card = ({ children, style = {}, onClick, hover = false }: any) => {
  const [h, setH] = React.useState(false);
  return (
    <div 
      onClick={onClick}
      onMouseEnter={() => setH(true)} 
      onMouseLeave={() => setH(false)}
      style={{
        background: '#fff', 
        border: '1px solid var(--ss-border)', 
        borderRadius: 12,
        padding: '16px 20px',
        boxShadow: (hover && h) ? 'var(--ss-shadow-md)' : 'var(--ss-shadow-sm)',
        cursor: onClick ? 'pointer' : 'default',
        transition: 'box-shadow .2s',
        ...style
      }}
    >
      {children}
    </div>
  );
};

export const Pill = ({ children, color = 'default', size = 'md', dot = false, style = {} }: any) => {
  const colors: any = {
    default: { bg: '#F1F1F1', fg: '#111111' },
    mint: { bg: '#CFECEE', fg: '#0A4D53' },
    green: { bg: '#D7F0D7', fg: '#1F5E2A' },
    red: { bg: '#FDD8CE', fg: '#9B2C0F' },
    orange: { bg: '#FDE2B8', fg: '#7A4A0F' },
    purple: { bg: '#E1D7FB', fg: '#3E2878' },
  };
  const c = colors[color] || colors.default;
  const s = size === 'sm' ? { h: 20, fs: 11, px: 6 } : { h: 24, fs: 12, px: 8 };

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      height: s.h, padding: `0 ${s.px}px`,
      borderRadius: 99, background: c.bg, color: c.fg,
      fontSize: s.fs, fontWeight: 500, whiteSpace: 'nowrap',
      ...style
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.fg }} />}
      {children}
    </span>
  );
};

export const Avatar = ({ size = 'md', initials, style = {} }: any) => {
  const px = size === 'sm' ? 24 : 32;
  return (
    <div style={{
      width: px, height: px, borderRadius: '50%',
      background: 'rgba(113,86,245,0.2)', color: 'rgb(113,88,245)',
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      fontSize: px * 0.4, fontWeight: 700, ...style
    }}>
      {initials}
    </div>
  );
};

export const Button = ({ children, variant = 'solid', size = 'md', onClick, style = {} }: any) => {
  const isOutline = variant === 'outline';
  return (
    <button
      onClick={onClick}
      style={{
        height: size === 'sm' ? 28 : 36,
        padding: '0 12px',
        borderRadius: 8,
        background: isOutline ? 'transparent' : 'var(--ss-primary-500)',
        color: isOutline ? 'var(--ss-primary-500)' : '#fff',
        border: isOutline ? '1.5px solid var(--ss-primary-500)' : 'none',
        fontWeight: 600,
        fontSize: size === 'sm' ? 12 : 14,
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        ...style
      }}
    >
      {children}
    </button>
  );
};
