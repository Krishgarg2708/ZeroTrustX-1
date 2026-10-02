import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  subtext?: string;
  sparklineData?: number[];
  color?: 'cyan' | 'emerald' | 'amber' | 'rose' | 'indigo';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  icon: Icon,
  subtext,
  sparklineData = [35, 42, 38, 55, 62, 58, 70, 75, 84],
  color = 'cyan',
}) => {
  const colorMap = {
    cyan: {
      bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
      glow: 'hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.12)]',
      line: '#06b6d4',
    },
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      glow: 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.12)]',
      line: '#10b981',
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'hover:border-amber-500/40 hover:shadow-[0_0_20px_rgba(245,158,11,0.12)]',
      line: '#f59e0b',
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      glow: 'hover:border-rose-500/40 hover:shadow-[0_0_20px_rgba(244,63,94,0.12)]',
      line: '#f43f5e',
    },
    indigo: {
      bg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
      glow: 'hover:border-indigo-500/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.12)]',
      line: '#6366f1',
    },
  };

  const currentTheme = colorMap[color];

  // Simple SVG mini sparkline
  const minVal = Math.min(...sparklineData);
  const maxVal = Math.max(...sparklineData);
  const points = sparklineData
    .map((d, i) => {
      const x = (i / (sparklineData.length - 1)) * 64;
      const y = 24 - ((d - minVal) / (maxVal - minVal || 1)) * 18;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div
      className={`relative p-5 rounded-xl bg-[#0d131f]/90 border border-slate-800/80 transition-all duration-300 ${currentTheme.glow} group overflow-hidden`}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-slate-800/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-xs font-medium text-slate-400 tracking-wider uppercase">{title}</span>
          <div className="text-2xl lg:text-3xl font-bold tracking-tight text-white font-mono">{value}</div>
        </div>
        <div className={`p-2.5 rounded-lg border ${currentTheme.bg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between pt-2 border-t border-slate-800/60">
        <div className="flex items-center gap-1.5 text-xs">
          {change && (
            <span
              className={`font-semibold font-mono ${
                changeType === 'positive'
                  ? 'text-emerald-400'
                  : changeType === 'negative'
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              {change}
            </span>
          )}
          {subtext && <span className="text-slate-500">{subtext}</span>}
        </div>

        {/* Mini SVG Sparkline */}
        <div className="w-16 h-6">
          <svg className="w-full h-full overflow-visible" viewBox="0 0 64 24">
            <polyline fill="none" stroke={currentTheme.line} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" points={points} />
          </svg>
        </div>
      </div>
    </div>
  );
};
