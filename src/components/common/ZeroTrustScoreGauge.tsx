import React from 'react';
import { ShieldCheck, Award, AlertTriangle } from 'lucide-react';

interface ZeroTrustScoreGaugeProps {
  score?: number;
}

export const ZeroTrustScoreGauge: React.FC<ZeroTrustScoreGaugeProps> = ({ score = 87 }) => {
  // SVG circular calculations
  const radius = 68;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const breakdowns = [
    { label: 'Identity Trust', value: 92, target: '90%+ SLA', color: 'bg-emerald-400' },
    { label: 'Device Trust', value: 84, target: '80%+ Baseline', color: 'bg-cyan-400' },
    { label: 'Policy Coverage', value: 89, target: 'Strict ZTNA', color: 'bg-indigo-400' },
    { label: 'MFA Adoption', value: 96, target: 'FIDO2 / TOTP', color: 'bg-emerald-400' },
    { label: 'Risk Detection', value: 82, target: 'Real-time EDR', color: 'bg-amber-400' },
  ];

  return (
    <div className="p-6 rounded-xl bg-[#0d131f]/90 border border-slate-800 relative overflow-hidden">
      {/* Background ambient gradient */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Continuous Verification
          </span>
          <h3 className="text-lg font-bold text-white mt-1">Zero Trust Security Score</h3>
        </div>
        <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-medium">
          <Award className="w-3.5 h-3.5" />
          <span>SOC Certified</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Radial gauge section */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="relative w-44 h-44 flex items-center justify-center">
            {/* SVG circle */}
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-slate-800"
                strokeWidth={strokeWidth}
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="text-cyan-400 transition-all duration-1000 ease-out"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                stroke="url(#cyanGradient)"
                fill="transparent"
              />
              <defs>
                <linearGradient id="cyanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4" />
                  <stop offset="50%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner Content */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-white font-mono tracking-tight">{score}</span>
              <span className="text-xs text-slate-400 font-mono">/ 100</span>
              <span className="mt-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Excellent Posture
              </span>
            </div>
          </div>
          <p className="text-xs text-slate-400 text-center mt-3 max-w-[200px]">
            Based on 2,481 live identities and 1,842 verified hardware endpoints.
          </p>
        </div>

        {/* Breakdown bars */}
        <div className="lg:col-span-7 space-y-3.5">
          {breakdowns.map((item) => (
            <div key={item.label} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-500 text-[11px]">{item.target}</span>
                  <span className="font-mono font-bold text-white">{item.value}%</span>
                </div>
              </div>
              <div className="w-full h-2 bg-slate-800/80 rounded-full overflow-hidden p-0.5 border border-slate-700/50">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${item.color}`}
                  style={{ width: `${item.value}%` }}
                />
              </div>
            </div>
          ))}

          <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-slate-800">
            <span className="flex items-center gap-1 text-amber-400 text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5" /> 39 non-compliant devices need updates
            </span>
            <span className="text-[11px] text-slate-500">Recalculates every 5m</span>
          </div>
        </div>
      </div>
    </div>
  );
};
