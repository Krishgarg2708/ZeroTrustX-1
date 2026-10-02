import React from 'react';
import { RiskLevel } from '../../types';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const normalized = status.toLowerCase();

  let colorClasses = 'bg-slate-800 text-slate-300 border-slate-700';
  let dotColor = 'bg-slate-400';

  if (['trusted', 'active', 'approved', 'allow', 'success', 'compliant (latest)'].includes(normalized)) {
    colorClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    dotColor = 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]';
  } else if (['pending', 'challenged', 'step_up_mfa', 'warning', 'partially_trusted', 'pending 1 update'].includes(normalized)) {
    colorClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    dotColor = 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]';
  } else if (['blocked', 'denied', 'deny', 'suspended', 'critical', 'untrusted', 'out of date (critical)', 'failed'].includes(normalized)) {
    colorClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    dotColor = 'bg-rose-400 shadow-[0_0_8px_rgba(244,63,94,0.6)]';
  } else if (['enforced', 'configured', 'hardware fido2 key', 'biometric passkey'].includes(normalized)) {
    colorClasses = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30';
    dotColor = 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]';
  } else if (['at_risk', 'unknown'].includes(normalized)) {
    colorClasses = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    dotColor = 'bg-orange-400 shadow-[0_0_8px_rgba(251,146,60,0.6)]';
  }

  const padding = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md uppercase tracking-wider ${padding} ${colorClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
      <span>{status.replace(/_/g, ' ')}</span>
    </span>
  );
};

interface RiskScoreBadgeProps {
  score: number;
  level?: RiskLevel;
  showScore?: boolean;
}

export const RiskScoreBadge: React.FC<RiskScoreBadgeProps> = ({ score, showScore = true }) => {
  let label = 'LOW';
  let badgeClasses = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
  let barColor = 'bg-emerald-400';

  if (score >= 70) {
    label = 'CRITICAL';
    badgeClasses = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    barColor = 'bg-rose-500';
  } else if (score >= 45) {
    label = 'HIGH';
    badgeClasses = 'bg-orange-500/10 text-orange-400 border-orange-500/30';
    barColor = 'bg-orange-500';
  } else if (score >= 25) {
    label = 'MEDIUM';
    badgeClasses = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    barColor = 'bg-amber-400';
  }

  return (
    <div className="inline-flex items-center gap-2">
      <div className={`px-2 py-0.5 rounded border text-xs font-mono font-semibold ${badgeClasses}`}>
        {showScore ? `${score}/100 • ${label}` : label}
      </div>
      <div className="w-12 h-1.5 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
        <div className={`h-full ${barColor}`} style={{ width: `${Math.min(100, Math.max(8, score))}%` }} />
      </div>
    </div>
  );
};
