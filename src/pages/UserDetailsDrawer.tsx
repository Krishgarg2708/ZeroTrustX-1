import React from 'react';
import { User, Device, AccessRequest } from '../types';
import { useSecurity } from '../context/SecurityContext';
import { Drawer } from '../components/common/Drawer';
import { StatusBadge, RiskScoreBadge } from '../components/common/StatusBadge';
import {
  User as UserIcon,
  ShieldCheck,
  Laptop,
  KeyRound,
  AlertTriangle,
  History,
  FileCheck2,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
} from 'lucide-react';

interface UserDetailsDrawerProps {
  user: User | null;
  isOpen: boolean;
  onClose: () => void;
}

export const UserDetailsDrawer: React.FC<UserDetailsDrawerProps> = ({
  user,
  isOpen,
  onClose,
}) => {
  const { devices, accessRequests, toggleUserStatus, requireMFAForUser } = useSecurity();

  if (!user) return null;

  // Find user devices
  const userDevices = devices.filter((d) => d.userId === user.id || d.userEmail === user.email);
  // Find user requests
  const userRequests = accessRequests.filter((r) => r.userId === user.id || r.userEmail === user.email);

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Identity Profile & Posture"
      subtitle={`Enterprise ID: ${user.employeeId} • ${user.department} Organization`}
      width="xl"
    >
      <div className="space-y-6 text-xs">
        {/* Profile Card */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-start gap-4">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-14 h-14 rounded-full object-cover border-2 border-cyan-500/40 shadow-lg shadow-cyan-950/40"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">{user.name}</h3>
              <StatusBadge status={user.status} />
            </div>
            <p className="text-slate-400 mt-0.5">{user.email}</p>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950/40 text-cyan-300 font-mono text-[10px] border border-cyan-500/30">
                {user.role}
              </span>
              {user.privileged && (
                <span className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 font-mono text-[10px] border border-rose-500/30">
                  PRIVILEGED ACCOUNT
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons for User */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => toggleUserStatus(user.id)}
            className={`py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
              user.status === 'active'
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
            }`}
          >
            {user.status === 'active' ? (
              <>
                <Lock className="w-3.5 h-3.5" />
                <span>Suspend Identity</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5" />
                <span>Activate Identity</span>
              </>
            )}
          </button>
          <button
            onClick={() => requireMFAForUser(user.id)}
            className="py-2 px-3 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Enforce Hardware MFA</span>
          </button>
        </div>

        {/* Section 1: Authentication & MFA Posture */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-cyan-400" /> Authentication Posture
          </h4>
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">MFA Status</span>
              <span className="font-semibold text-white capitalize">{user.mfaStatus}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Primary Auth Factor</span>
              <span className="font-mono text-cyan-400 font-medium">{user.mfaMethod}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Last Known Location</span>
              <span className="font-medium text-slate-200">{user.location}</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
              <span className="text-slate-400 text-[11px] block">Last Active</span>
              <span className="font-mono text-slate-300">{user.lastActive}</span>
            </div>
          </div>
        </div>

        {/* Section 2: Device Trust Posture */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <Laptop className="w-3.5 h-3.5 text-cyan-400" /> Associated Endpoint Devices ({userDevices.length})
          </h4>
          {userDevices.length === 0 ? (
            <div className="py-4 text-center text-slate-500">No hardware endpoints bound yet.</div>
          ) : (
            <div className="space-y-2">
              {userDevices.map((d) => (
                <div
                  key={d.id}
                  className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold text-white">{d.name}</div>
                    <div className="text-[11px] text-slate-400 font-mono">
                      {d.os} • {d.edrStatus}
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge status={d.trustStatus} size="sm" />
                    <div className="text-[10px] text-slate-500 font-mono mt-1">Trust: {d.trustScore}/100</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: Risk Evaluation */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Identity Risk Evaluation
            </h4>
            <RiskScoreBadge score={user.riskScore} />
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Continuous identity threat detection monitors velocity of authentication requests, credential hygiene, and IP egress patterns.
          </p>
        </div>

        {/* Section 4: Accessible Resources & JIT Requests */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
            <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" /> Assigned Resources
          </h4>
          <div className="flex flex-wrap gap-2">
            {user.assignedResources.map((res, i) => (
              <span
                key={i}
                className="px-2.5 py-1 rounded bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-mono"
              >
                {res}
              </span>
            ))}
          </div>

          {userRequests.length > 0 && (
            <div className="pt-2 border-t border-slate-800 mt-2">
              <span className="text-[11px] text-slate-400 block mb-1">Recent Access Requests:</span>
              <div className="space-y-1">
                {userRequests.map((req) => (
                  <div key={req.id} className="text-[11px] text-slate-300 flex items-center justify-between">
                    <span>{req.resource}</span>
                    <StatusBadge status={req.status} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </Drawer>
  );
};
