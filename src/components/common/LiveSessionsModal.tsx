import React from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { Modal } from './Modal';
import { StatusBadge, RiskScoreBadge } from './StatusBadge';
import { Radio, Laptop, ShieldX, Clock, Activity, Zap, CheckCircle2 } from 'lucide-react';

export const LiveSessionsModal: React.FC = () => {
  const {
    isLiveSessionsModalOpen,
    setIsLiveSessionsModalOpen,
    activeSessions,
    revokeSession,
  } = useSecurity();

  return (
    <Modal
      isOpen={isLiveSessionsModalOpen}
      onClose={() => setIsLiveSessionsModalOpen(false)}
      title="Continuous Verification — Active ZTNA Sessions"
      subtitle="Inspecting real-time cryptographic sessions with continuous posture heartbeat"
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs">
        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-white">
              {activeSessions.length} Active Cryptographic WireGuard Tunnels
            </span>
          </div>
          <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/40 px-2 py-0.5 rounded border border-cyan-500/20">
            Re-verifying every 300s
          </span>
        </div>

        <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
          {activeSessions.length === 0 ? (
            <div className="py-12 text-center text-slate-500">No active sessions. All tokens revoked.</div>
          ) : (
            activeSessions.map((ses, idx) => (
              <div
                key={`${ses.id}-${idx}`}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs">{ses.userName}</span>
                      <span className="text-[10px] font-mono text-slate-400">({ses.id})</span>
                    </div>
                    <div className="text-[11px] text-slate-400 font-mono">{ses.userEmail}</div>
                  </div>

                  <div className="flex items-center gap-2">
                    <RiskScoreBadge score={ses.riskScore} />
                    <button
                      onClick={() => revokeSession(ses.id)}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Force Immediate Re-authentication"
                    >
                      <ShieldX className="w-3.5 h-3.5" />
                      <span>Revoke</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-900 text-[11px] font-mono text-slate-300">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Resource</span>
                    <span className="text-cyan-300 truncate block" title={ses.connectedResource}>
                      {ses.connectedResource}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Heartbeat</span>
                    <span className="text-emerald-400">{ses.lastHeartbeat}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Token TTL</span>
                    <span className="text-white">{ses.remainingMinutes} min left</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Bandwidth</span>
                    <span className="text-slate-400">{ses.bytesTransferred}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
