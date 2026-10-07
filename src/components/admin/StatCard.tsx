import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  variant?: 'default' | 'gold' | 'warning' | 'success';
}

export function StatCard({
  title,
  value,
  description,
  icon,
  variant = 'default',
}: StatCardProps) {
  const borderStyles = {
    default: 'border-[#e2ded7]',
    gold: 'border-[#c29d59]',
    warning: 'border-amber-300',
    success: 'border-emerald-300',
  };

  return (
    <div className={`p-4 md:p-5 rounded-xl bg-white border ${borderStyles[variant]} shadow-2xs space-y-2`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-[#6b645c] uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-[#faf7f2] text-[#c29d59]">
          {icon}
        </div>
      </div>
      <div className="font-serif text-2xl md:text-3xl font-bold text-[#121212]">
        {value}
      </div>
      {description && (
        <p className="text-[11px] text-[#6b645c]">{description}</p>
      )}
    </div>
  );
}
