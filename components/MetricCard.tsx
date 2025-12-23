import React from 'react';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  trend?: 'up' | 'down' | 'neutral';
  color?: 'default' | 'danger' | 'success';
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, subtext, trend, color = 'default' }) => {
  const getTrendColor = () => {
    if (color === 'danger') return 'text-red-400';
    if (color === 'success') return 'text-green-400';
    if (trend === 'up') return 'text-green-400';
    if (trend === 'down') return 'text-red-400';
    return 'text-slate-400';
  };

  return (
    <div className="bg-slate-800 border border-slate-700 p-4 rounded-lg shadow-sm">
      <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">{label}</p>
      <div className="flex items-end justify-between">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        {subtext && <span className={`text-xs ${getTrendColor()}`}>{subtext}</span>}
      </div>
    </div>
  );
};