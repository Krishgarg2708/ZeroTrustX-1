import React, { useState } from 'react';
import { AccessRequest } from '../types';
import { useSecurity } from '../context/SecurityContext';
import { Drawer } from '../components/common/Drawer';
import { StatusBadge, RiskScoreBadge } from '../components/common/StatusBadge';
import {
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Laptop,
  User,
  MapPin,
  Clock,
  Radio,
  FileText,
  Key,
} from 'lucide-react';

interface AccessDecisionModalProps {
  request: AccessRequest | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AccessDecisionModal: React.FC<AccessDecisionModalProps> = ({
  request,
  isOpen,
  onClose,
}) => {
  const { approveRequest, denyRequest, challengeRequest } = useSecurity();
  const [reviewerNotes, setReviewerNotes] = useState('');

  if (!request) return null;

  const handleApprove = () => {
    approveRequest(request.id, reviewerNotes);
    onClose();
  };

  const handleDeny = () => {
    denyRequest(request.id, reviewerNotes);
    onClose();
  };

  const handleChallenge = () => {
    challengeRequest(request.id, reviewerNotes);
    onClose();
  };

  const isPending = request.status === 'pending';

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Access Evaluation — ${request.id}`}
      subtitle={`Requested by ${request.userName} for ${request.resource}`}
      width="xl"
    >
      <div className="space-y-6 text-xs">
        {/* Top summary card */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 font-mono text-sm">
                {request.userName.charAt(0)}
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">{request.userName}</h4>
                <p className="text-slate-400">{request.userEmail}</p>
              </div>
            </div>
            <StatusBadge status={request.status} />
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80">
            <div>
              <span className="text-slate-500">Department:</span>
              <span className="text-slate-200 ml-1.5 font-medium">{request.userDepartment}</span>
            </div>
            <div>
              <span className="text-slate-500">Requested Role:</span>
              <span className="text-cyan-400 ml-1.5 font-mono">{request.requestedRole}</span>
            </div>
            <div>
              <span className="text-slate-500">Target Resource:</span>
              <span className="text-slate-200 ml-1.5 font-medium">{request.resource}</span>
            </div>
            <div>
              <span className="text-slate-500">Timestamp:</span>
              <span className="text-slate-400 ml-1.5 font-mono">{request.requestedAt}</span>
            </div>
          </div>
        </div>

        {/* Zero Trust Continuous Inspection Factors */}
        <div>
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
            Zero Trust Posture Checklist
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Identity */}
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">Identity Verification</span>
              </div>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Verified
              </span>
            </div>

            {/* Device */}
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">Device Trust</span>
              </div>
              {request.isDeviceTrusted ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Trusted ({request.deviceTrustScore}%)
                </span>
              ) : (
                <span className="text-rose-400 font-semibold flex items-center gap-1">
                  <XCircle className="w-3.5 h-3.5" /> Untrusted ({request.deviceTrustScore}%)
                </span>
              )}
            </div>

            {/* MFA */}
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Key className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">MFA Verification</span>
              </div>
              {request.mfaVerified ? (
                <span className="text-emerald-400 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                </span>
              ) : (
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Missing
                </span>
              )}
            </div>

            {/* Location */}
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">Geo Egress</span>
              </div>
              <span className="text-slate-200 font-mono text-[11px]">{request.location}</span>
            </div>

            {/* IP Reputation */}
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">IP Reputation</span>
              </div>
              <span
                className={`font-semibold flex items-center gap-1 ${
                  request.ipReputation === 'Low Risk' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {request.ipReputation}
              </span>
            </div>

            {/* Behavior */}
            <div className="p-3 rounded-lg bg-slate-900/40 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-cyan-400" />
                <span className="text-slate-300">Behavioral Biometrics</span>
              </div>
              <span
                className={`font-semibold ${
                  request.behaviorAnomaly === 'Normal' ? 'text-emerald-400' : 'text-amber-400'
                }`}
              >
                {request.behaviorAnomaly}
              </span>
            </div>
          </div>
        </div>

        {/* Calculated Risk & Policy Decision Box */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-slate-300 uppercase tracking-wider">
              Contextual Risk Score
            </span>
            <RiskScoreBadge score={request.riskScore} />
          </div>

          <div className="pt-2 border-t border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-400">Zero Trust Policy Matched:</span>
              <span className="text-cyan-400 font-semibold">{request.policyMatched || 'Baseline ZTNA Rule'}</span>
            </div>

            <div className="text-[11px] text-slate-400 space-y-1 bg-slate-900/60 p-3 rounded-lg">
              <span className="font-semibold text-slate-300 block mb-1">Automated Evaluation:</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className="text-emerald-400">✓</span> Identity cryptographically confirmed
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className={request.isDeviceTrusted ? 'text-emerald-400' : 'text-rose-400'}>
                  {request.isDeviceTrusted ? '✓' : '✕'}
                </span>
                Device posture score: {request.deviceTrustScore}/100
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <span className={request.mfaVerified ? 'text-emerald-400' : 'text-amber-400'}>
                  {request.mfaVerified ? '✓' : '⚠'}
                </span>
                MFA: {request.mfaVerified ? 'Hardware key verified' : 'No MFA session found'}
              </div>
            </div>
          </div>
        </div>

        {/* Reviewer Notes Input */}
        <div>
          <label className="block text-slate-400 font-medium mb-1.5">SOC Analyst / Reviewer Notes</label>
          <textarea
            rows={3}
            placeholder="Add context or rationale for this access grant..."
            value={reviewerNotes}
            onChange={(e) => setReviewerNotes(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 text-xs focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        {/* Action Buttons */}
        {isPending ? (
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
            <button
              onClick={handleApprove}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/40 transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Allow Access</span>
            </button>
            <button
              onClick={handleChallenge}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/40 transition-colors"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>Require Step-Up MFA</span>
            </button>
            <button
              onClick={handleDeny}
              className="w-full sm:flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-rose-950/40 transition-colors"
            >
              <XCircle className="w-4 h-4" />
              <span>Deny Access</span>
            </button>
          </div>
        ) : (
          <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800 text-center text-slate-400">
            This request has already been finalized as <span className="text-white font-bold">{request.status.toUpperCase()}</span>.
          </div>
        )}
      </div>
    </Drawer>
  );
};
