import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { ZeroTrustPolicy } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { PolicyEditorModal } from './PolicyEditorModal';
import {
  Shield,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Layers,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const { policies, togglePolicyStatus, deletePolicy } = useSecurity();
  const [selectedPolicy, setSelectedPolicy] = useState<ZeroTrustPolicy | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const handleEdit = (p: ZeroTrustPolicy) => {
    setSelectedPolicy(p);
    setIsEditorOpen(true);
  };

  const handleNew = () => {
    setSelectedPolicy(null);
    setIsEditorOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Zero Trust Policies</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Microsegmentation Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Declarative conditional access policies evaluated dynamically at every network edge and cloud proxy.
          </p>
        </div>

        <button
          onClick={handleNew}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Policy Rule</span>
        </button>
      </div>

      {/* Policy Cards Grid */}
      <div className="space-y-4">
        {policies.map((policy, idx) => {
          const isActive = policy.status === 'active';

          return (
            <div
              key={`${policy.id}-${idx}`}
              className={`p-5 rounded-2xl bg-[#0d131f]/90 border transition-all duration-200 ${
                isActive
                  ? 'border-slate-800 hover:border-cyan-500/40 shadow-lg'
                  : 'border-slate-800/40 opacity-70 bg-slate-950/40'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                {/* Left metadata */}
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="px-2 py-0.5 rounded bg-cyan-950/50 text-cyan-400 font-mono text-[11px] font-semibold border border-cyan-500/30">
                      PRIORITY {policy.priority}
                    </span>
                    <h3 className="text-base font-bold text-white tracking-tight">{policy.name}</h3>
                    <StatusBadge status={policy.status} size="sm" />
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                    {policy.description}
                  </p>

                  {/* Targeted Roles & Resources */}
                  <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="text-slate-500 font-medium">Roles:</span>
                      <div className="flex flex-wrap gap-1">
                        {policy.applicableRoles.map((role) => (
                          <span
                            key={role}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300 font-mono text-[10px]"
                          >
                            {role}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-slate-400">
                      <span className="text-slate-500 font-medium">Resources:</span>
                      <div className="flex flex-wrap gap-1">
                        {policy.resources.map((res) => (
                          <span
                            key={res}
                            className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-300 font-mono text-[10px]"
                          >
                            {res}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-2 self-end lg:self-start shrink-0">
                  <button
                    onClick={() => togglePolicyStatus(policy.id)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
                        : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                    }`}
                  >
                    {isActive ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => handleEdit(policy)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700 transition-colors"
                    title="Edit Policy"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deletePolicy(policy.id)}
                    className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-500/10 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors"
                    title="Delete Policy"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Zero Trust IF / THEN Logic Block */}
              <div className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs space-y-2">
                <div className="flex flex-wrap items-center gap-2 text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 font-bold border border-cyan-500/30">
                    IF
                  </span>
                  <span>User Role in [ {policy.applicableRoles.join(', ')} ]</span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-slate-400">
                  <span className="px-1.5 py-0.5 rounded bg-blue-950/80 text-blue-400 font-bold border border-blue-500/30">
                    AND
                  </span>
                  <span>Device Trust Score ≥ {policy.conditions.minDeviceTrust}%</span>
                  <span className="text-slate-600">•</span>
                  <span>MFA Status == {policy.conditions.requireMFA ? 'Verified' : 'Optional'}</span>
                  <span className="text-slate-600">•</span>
                  <span>Risk Score &lt; {policy.conditions.maxRiskScore}</span>
                  {policy.conditions.requireEDR && (
                    <>
                      <span className="text-slate-600">•</span>
                      <span>EDR Agent == Active</span>
                    </>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <span className="px-1.5 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      THEN
                    </span>
                    <span>{policy.actionOnMatch}</span>
                  </div>

                  <span className="text-slate-600">|</span>

                  <div className="flex items-center gap-2 text-rose-400 font-bold">
                    <span className="px-1.5 py-0.5 rounded bg-rose-950/80 text-rose-400 border border-rose-500/30">
                      OTHERWISE
                    </span>
                    <span>{policy.actionOnFail}</span>
                  </div>
                </div>
              </div>

              {/* Policy footer stats */}
              <div className="mt-3 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                <span>Last modified: {policy.lastModified} by {policy.modifiedBy}</span>
                <span className="text-cyan-400">
                  {policy.enforcedCount.toLocaleString()} enforcement events
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Policy Editor Modal */}
      <PolicyEditorModal
        policy={selectedPolicy}
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
      />
    </div>
  );
};
