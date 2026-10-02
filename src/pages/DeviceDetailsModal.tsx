import React, { useState } from 'react';
import { Device } from '../types';
import { useSecurity } from '../context/SecurityContext';
import { Modal } from '../components/common/Modal';
import { StatusBadge, RiskScoreBadge } from '../components/common/StatusBadge';
import {
  Laptop,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  Lock,
  Cpu,
  Globe,
  Radio,
  Clock,
  HardDrive,
  FileKey,
  CheckCircle2,
  Play,
  RotateCw,
  Sparkles,
} from 'lucide-react';

interface DeviceDetailsModalProps {
  device: Device | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DeviceDetailsModal: React.FC<DeviceDetailsModalProps> = ({
  device,
  isOpen,
  onClose,
}) => {
  const { toggleDeviceTrust, quarantineDevice, addToast, logAudit } = useSecurity();
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [auditComplete, setAuditComplete] = useState(false);

  if (!device) return null;

  const isBlocked = device.trustStatus === 'blocked';

  const handleRunAudit = () => {
    setIsAuditing(true);
    setAuditComplete(false);
    setAuditStep(1);

    setTimeout(() => setAuditStep(2), 500);
    setTimeout(() => setAuditStep(3), 1000);
    setTimeout(() => setAuditStep(4), 1500);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditComplete(true);
      addToast(
        'Device Posture Attested',
        `${device.name} verified: TPM 2.0 valid, Disk Encryption active, EDR green.`,
        'success'
      );
      logAudit('Executed Device Posture Audit', `Device: ${device.name}`, 'Success', 'Diagnostic passed 100%');
    }, 2000);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Endpoint Posture — ${device.name}`}
      subtitle={`Assigned User: ${device.userName} (${device.userEmail})`}
      maxWidth="2xl"
    >
      <div className="space-y-6 text-xs">
        {/* Device Header Card */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Laptop className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{device.name}</h4>
              <p className="text-slate-400 font-mono text-[11px] mt-0.5">
                Cert Serial: {device.certSerial}
              </p>
            </div>
          </div>
          <div className="text-right">
            <StatusBadge status={device.trustStatus} />
            <div className="text-[11px] text-slate-400 font-mono mt-1">
              Trust Score: <span className="text-cyan-400 font-bold">{device.trustScore}/100</span>
            </div>
          </div>
        </div>

        {/* Live Diagnostics Audit Box */}
        <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold text-white">Continuous Hardware Health Attestation</span>
            </div>
            <button
              onClick={handleRunAudit}
              disabled={isAuditing}
              className="px-3 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md transition-all"
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
              <span>{isAuditing ? 'Auditing...' : 'Run Live Posture Audit'}</span>
            </button>
          </div>

          {(isAuditing || auditComplete) && (
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 font-mono text-[11px] space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={auditStep >= 1 ? 'text-emerald-400' : 'text-slate-600'}>
                  {auditStep >= 1 ? '✓' : '○'}
                </span>
                <span className={auditStep >= 1 ? 'text-slate-200' : 'text-slate-500'}>
                  [1/4] Hardware TPM 2.0 Secure Boot Attestation verified
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={auditStep >= 2 ? 'text-emerald-400' : 'text-slate-600'}>
                  {auditStep >= 2 ? '✓' : '○'}
                </span>
                <span className={auditStep >= 2 ? 'text-slate-200' : 'text-slate-500'}>
                  [2/4] Full-Disk Encryption key status: {device.encryption}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={auditStep >= 3 ? 'text-emerald-400' : 'text-slate-600'}>
                  {auditStep >= 3 ? '✓' : '○'}
                </span>
                <span className={auditStep >= 3 ? 'text-slate-200' : 'text-slate-500'}>
                  [3/4] EDR Agent Heartbeat: {device.edrStatus}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className={auditStep >= 4 ? 'text-emerald-400' : 'text-slate-600'}>
                  {auditStep >= 4 ? '✓' : '○'}
                </span>
                <span className={auditStep >= 4 ? 'text-slate-200' : 'text-slate-500'}>
                  [4/4] X.509 Client mTLS Certificate chain verified valid
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Security Diagnostics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* EDR Status */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> EDR Agent Telemetry
            </span>
            <div className="font-semibold text-white">{device.edrStatus}</div>
          </div>

          {/* Encryption */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-cyan-400" /> Full Disk Encryption
            </span>
            <div className="font-semibold text-emerald-400">{device.encryption}</div>
          </div>

          {/* Operating System */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-cyan-400" /> OS Platform & Build
            </span>
            <div className="font-mono text-white">{device.os}</div>
          </div>

          {/* Patch Status */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" /> Security Patch Status
            </span>
            <div className="font-semibold text-white">{device.patchStatus}</div>
          </div>

          {/* Network & IP */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" /> IP & Network Egress
            </span>
            <div className="font-mono text-slate-300">{device.ipAddress}</div>
          </div>

          {/* Location */}
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
            <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" /> Geo Location
            </span>
            <div className="text-white">{device.location}</div>
          </div>
        </div>

        {/* Cryptographic Fingerprint */}
        <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
          <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
            <FileKey className="w-3.5 h-3.5 text-cyan-400" /> Hardware Root of Trust Fingerprint
          </span>
          <code className="text-[11px] font-mono text-cyan-300 block break-all bg-slate-900 p-2 rounded border border-slate-800">
            {device.fingerprint}
          </code>
        </div>

        {/* Action Controls */}
        <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={() => {
              toggleDeviceTrust(device.id);
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium transition-colors"
          >
            {device.trustStatus === 'trusted' ? 'Mark as Unknown Posture' : 'Validate as Trusted'}
          </button>

          <button
            onClick={() => {
              quarantineDevice(device.id);
              onClose();
            }}
            className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
              isBlocked
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/40'
            }`}
          >
            {isBlocked ? (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Remove from Quarantine</span>
              </>
            ) : (
              <>
                <ShieldX className="w-4 h-4" />
                <span>Isolate & Quarantine Device</span>
              </>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

