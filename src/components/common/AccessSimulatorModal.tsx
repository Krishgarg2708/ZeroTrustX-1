import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { Modal } from './Modal';
import { evaluateZeroTrustAccess, EvaluationInput } from '../../utils/zeroTrustEngine';
import { ShieldCheck, ShieldAlert, ShieldX, Play, RotateCcw, Check, Sparkles } from 'lucide-react';
import { RiskScoreBadge } from './StatusBadge';

export const AccessSimulatorModal: React.FC = () => {
  const { isSimulatorOpen, setIsSimulatorOpen, users, devices, policies, logAudit, addToast } = useSecurity();

  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const [selectedDeviceIndex, setSelectedDeviceIndex] = useState(0);
  const [resource, setResource] = useState('Finance Production Database (PostgreSQL)');
  const [mfaVerified, setMfaVerified] = useState(true);
  const [location, setLocation] = useState('New Delhi, India');
  const [ipReputation, setIpReputation] = useState<'Low Risk' | 'Medium Risk' | 'Known Tor/Proxy' | 'High Threat'>('Low Risk');
  const [anomaly, setAnomaly] = useState<'Normal' | 'Unusual Hours' | 'Impossible Travel' | 'Elevated Privilege'>('Normal');

  const selectedUser = users[selectedUserIndex] || users[0];
  const selectedDevice = devices[selectedDeviceIndex] || devices[0];

  const evaluationInput: EvaluationInput = {
    userName: selectedUser?.name || 'Aarav Mehta',
    userRole: selectedUser?.role || 'Lead Security Analyst',
    resource,
    deviceName: selectedDevice?.name || 'MacBook Pro',
    deviceTrustScore: selectedDevice?.trustScore || 90,
    isDeviceTrusted: selectedDevice?.trustStatus === 'trusted',
    mfaVerified,
    location,
    ipReputation,
    behaviorAnomaly: anomaly,
  };

  const result = evaluateZeroTrustAccess(evaluationInput, policies);

  const handleSimulateAndLog = () => {
    logAudit(
      `Zero Trust Access Simulation (${result.decision})`,
      resource,
      result.decision === 'ALLOW' ? 'Success' : result.decision === 'CHALLENGE' ? 'Warning' : 'Denied',
      `Subject: ${selectedUser.name}, Risk: ${result.riskScore}/100, Reason: ${result.reasons[0]}`
    );
    addToast(
      `Simulation Evaluated: ${result.decision}`,
      `Risk calculated at ${result.riskScore}/100 based on active policies`,
      result.decision === 'ALLOW' ? 'success' : result.decision === 'CHALLENGE' ? 'warning' : 'error'
    );
  };

  const handlePreset = (preset: 'safe' | 'medium' | 'attack') => {
    if (preset === 'safe') {
      setSelectedUserIndex(0);
      setSelectedDeviceIndex(0);
      setResource('Finance Production Database (PostgreSQL)');
      setMfaVerified(true);
      setLocation('New Delhi, India');
      setIpReputation('Low Risk');
      setAnomaly('Normal');
    } else if (preset === 'medium') {
      setSelectedUserIndex(2); // Rohan
      setSelectedDeviceIndex(2);
      setResource('AWS Production Cloud Console (Root/Admin)');
      setMfaVerified(false);
      setLocation('Bengaluru, India');
      setIpReputation('Medium Risk');
      setAnomaly('Unusual Hours');
    } else if (preset === 'attack') {
      setSelectedUserIndex(5); // Neha or Marcus
      setSelectedDeviceIndex(4); // Non-compliant or unknown
      setResource('Financial ERP & Treasury Swift Portal');
      setMfaVerified(false);
      setLocation('High Risk Proxy');
      setIpReputation('High Threat');
      setAnomaly('Impossible Travel');
    }
  };

  return (
    <Modal
      isOpen={isSimulatorOpen}
      onClose={() => setIsSimulatorOpen(false)}
      title="Zero Trust Policy Simulator"
      subtitle="Interactive engine testing real-time context: Identity, Device Posture, Location & Anomaly vectors"
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {/* Preset quick buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Load Test Scenarios:</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePreset('safe')}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all"
            >
              1. Compliant Employee (Allow)
            </button>
            <button
              onClick={() => handlePreset('medium')}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20 transition-all"
            >
              2. Missing MFA / Off-hours (Challenge)
            </button>
            <button
              onClick={() => handlePreset('attack')}
              className="px-3 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all"
            >
              3. Rogue Egress / Threat (Deny)
            </button>
          </div>
        </div>

        {/* Configuration Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* User & Identity */}
          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Identity & Role
            </label>
            <select
              value={selectedUserIndex}
              onChange={(e) => setSelectedUserIndex(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {users.map((u, i) => (
                <option key={u.id} value={i}>
                  {u.name} — {u.role} ({u.department})
                </option>
              ))}
            </select>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-xs text-slate-300">MFA Verification Status</span>
              <button
                type="button"
                onClick={() => setMfaVerified(!mfaVerified)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  mfaVerified ? 'bg-emerald-600' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    mfaVerified ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
            <div className="text-[11px] text-slate-400">
              {mfaVerified ? '✓ Cryptographic Passkey / Hardware FIDO2 active' : '✕ No multi-factor session present'}
            </div>
          </div>

          {/* Device & Hardware Posture */}
          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Endpoint Device Posture
            </label>
            <select
              value={selectedDeviceIndex}
              onChange={(e) => setSelectedDeviceIndex(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {devices.map((d, i) => (
                <option key={d.id} value={i}>
                  {d.name} (Trust: {d.trustScore}/100 • {d.edrStatus})
                </option>
              ))}
            </select>

            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-slate-400">OS Posture:</span>
              <span className="text-white font-mono">{selectedDevice.os}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Disk Encryption:</span>
              <span className="text-emerald-400 font-mono">{selectedDevice.encryption}</span>
            </div>
          </div>

          {/* Target Resource */}
          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Target Resource (Microsegment)
            </label>
            <select
              value={resource}
              onChange={(e) => setResource(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="Finance Production Database (PostgreSQL)">Finance Production Database (PostgreSQL)</option>
              <option value="AWS Production Cloud Console (Root/Admin)">AWS Production Cloud Console (Root/Admin)</option>
              <option value="Financial ERP & Treasury Swift Portal">Financial ERP & Treasury Swift Portal</option>
              <option value="GitHub Enterprise Core Repository">GitHub Enterprise Core Repository</option>
              <option value="Workday HR & Compensation Vault">Workday HR & Compensation Vault</option>
            </select>
            <div className="text-[11px] text-slate-400">
              Enforced by Zero Trust Policy Engine rule evaluation.
            </div>
          </div>

          {/* Network & Anomalies */}
          <div className="p-4 bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              Network & Behavioral Context
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">IP Reputation</span>
                <select
                  value={ipReputation}
                  onChange={(e) => setIpReputation(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="Low Risk">Low Risk (Clean)</option>
                  <option value="Medium Risk">Medium Risk</option>
                  <option value="Known Tor/Proxy">Known Tor/Proxy</option>
                  <option value="High Threat">High Threat Botnet</option>
                </select>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block mb-1">Behavior Vector</span>
                <select
                  value={anomaly}
                  onChange={(e) => setAnomaly(e.target.value as any)}
                  className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none"
                >
                  <option value="Normal">Normal</option>
                  <option value="Unusual Hours">Unusual Hours</option>
                  <option value="Elevated Privilege">Elevated Privilege</option>
                  <option value="Impossible Travel">Impossible Travel</option>
                </select>
              </div>
            </div>
            <div className="text-[11px] text-slate-400">
              Location: <span className="text-slate-200">{location}</span>
            </div>
          </div>
        </div>

        {/* Real-time Dynamic Access Decision Box */}
        <div
          className={`p-6 rounded-2xl border transition-all duration-500 ${
            result.decision === 'ALLOW'
              ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.1)]'
              : result.decision === 'CHALLENGE'
              ? 'bg-amber-950/20 border-amber-500/40 shadow-[0_0_30px_rgba(245,158,11,0.1)]'
              : 'bg-rose-950/20 border-rose-500/40 shadow-[0_0_30px_rgba(244,63,94,0.1)]'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3">
              {result.decision === 'ALLOW' && (
                <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-8 h-8" />
                </div>
              )}
              {result.decision === 'CHALLENGE' && (
                <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  <ShieldAlert className="w-8 h-8" />
                </div>
              )}
              {result.decision === 'DENY' && (
                <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/30">
                  <ShieldX className="w-8 h-8" />
                </div>
              )}
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Zero Trust Engine Verdict
                </span>
                <div className="text-2xl font-black text-white font-mono flex items-center gap-2">
                  {result.decision === 'ALLOW' && <span className="text-emerald-400">ALLOW ACCESS</span>}
                  {result.decision === 'CHALLENGE' && <span className="text-amber-400">STEP-UP CHALLENGE</span>}
                  {result.decision === 'DENY' && <span className="text-rose-400">DENY ACCESS</span>}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  Governed by: <span className="text-cyan-400 font-medium">{result.matchedPolicyName}</span>
                </div>
              </div>
            </div>

            <div className="flex sm:flex-col items-end justify-between sm:justify-center">
              <span className="text-xs text-slate-400">Calculated Risk Score</span>
              <RiskScoreBadge score={result.riskScore} />
            </div>
          </div>

          {/* Subscores Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400">Identity Trust</span>
              <div className="text-sm font-bold font-mono text-white">{result.subScores.identityTrust}%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400">Device Posture</span>
              <div className="text-sm font-bold font-mono text-white">{result.subScores.deviceTrust}%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400">Network Egress</span>
              <div className="text-sm font-bold font-mono text-white">{result.subScores.networkTrust}%</div>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
              <span className="text-[11px] text-slate-400">Behavioral Score</span>
              <div className="text-sm font-bold font-mono text-white">{result.subScores.behaviorTrust}%</div>
            </div>
          </div>

          {/* Reasons */}
          <div className="pt-2">
            <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
              Decision Analysis Factors
            </span>
            <ul className="space-y-1.5">
              {result.reasons.map((reason, idx) => (
                <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                  <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={() => setIsSimulatorOpen(false)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-700"
          >
            Close Simulator
          </button>
          <button
            onClick={handleSimulateAndLog}
            className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 shadow-lg shadow-cyan-900/30 flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Commit Decision to SOC Audit Trail</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
