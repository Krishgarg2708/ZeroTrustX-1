import React, { useState } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { Modal } from './Modal';
import {
  UserCheck,
  Laptop,
  Cpu,
  ShieldCheck,
  Server,
  ArrowRight,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Play,
  RotateCcw,
  Sparkles,
  Lock,
} from 'lucide-react';

export const ArchitectureFlowModal: React.FC = () => {
  const { isArchitectureModalOpen, setIsArchitectureModalOpen, addToast, logAudit } = useSecurity();
  const [activeStep, setActiveStep] = useState<number>(0);
  const [simulationState, setSimulationState] = useState<'idle' | 'running' | 'success' | 'blocked'>('idle');
  const [scenario, setScenario] = useState<'compliant' | 'untrusted_device' | 'tor_anomaly'>('compliant');

  const steps = [
    {
      id: 0,
      title: '1. Identity & WebAuthn',
      subtitle: 'FIDO2 Cryptographic Handshake',
      icon: UserCheck,
      color: 'cyan',
      compliantStatus: 'PASS — Cryptographic passkey assertion validated against PKI',
      threatStatus: 'PASS — User identity verified, but flagged for further inspection',
      details: [
        'Protocol: FIDO2 / WebAuthn Level 2',
        'Hardware root-of-trust: YubiKey 5 NFC / Apple Secure Enclave',
        'Phishing resistance: Bound to origin domain',
      ],
    },
    {
      id: 1,
      title: '2. Device Posture & EDR',
      subtitle: 'Hardware TPM 2.0 & Sensor Health',
      icon: Laptop,
      color: 'emerald',
      compliantStatus: 'PASS — BitLocker active, CrowdStrike sensor heartbeat green',
      threatStatus: 'BLOCKED — Missing compliant EDR sensor; disk unencrypted',
      details: [
        'TPM 2.0 Measured Boot Attestation: Valid',
        'EDR Agent: CrowdStrike Falcon (Sensor v7.14)',
        'Encryption: FileVault / BitLocker AES-XTS-256',
      ],
    },
    {
      id: 2,
      title: '3. Context & Risk Engine',
      subtitle: 'Behavioral & Geo Heuristics',
      icon: Cpu,
      color: 'amber',
      compliantStatus: 'PASS — Clean IP, normal working hours, risk score: 18/100',
      threatStatus: 'CHALLENGED — Tor exit node detected; risk score: 84/100',
      details: [
        'Geo-velocity: 0 km/h (No impossible travel)',
        'Threat Intelligence: 0 IP abuse reports in last 90 days',
        'Contextual Heuristic Score: 18 / 100 (Safe)',
      ],
    },
    {
      id: 3,
      title: '4. Policy Decision Point (PDP)',
      subtitle: 'Zero Trust Policy Enforcement',
      icon: ShieldCheck,
      color: 'indigo',
      compliantStatus: 'ALLOW — Request matches Finance Database Access Policy',
      threatStatus: 'DENY / ISOLATE — Policy POL-01 requires device trust > 80%',
      details: [
        'Rule Evaluated: POL-01 (Strict Finance Posture)',
        'Least-Privilege: Ephemeral 60m JIT session token',
        'Network Microsegment: Isolated VLAN 104',
      ],
    },
    {
      id: 4,
      title: '5. Protected Microsegment',
      subtitle: 'Encrypted Ephemeral Gateway',
      icon: Server,
      color: 'emerald',
      compliantStatus: 'CONNECTED — WireGuard tunnel active (Port 5432)',
      threatStatus: 'UNREACHABLE — Perimeter firewall dropped SYN packet',
      details: [
        'Target: PostgreSQL Finance DB Aurora',
        'Encryption: mTLS TLS 1.3 with ChaCha20-Poly1305',
        'Continuous Auth: Background re-verification every 300s',
      ],
    },
  ];

  const handleRunSimulation = () => {
    setSimulationState('running');
    setActiveStep(0);

    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (scenario === 'untrusted_device' && prev === 1) {
          clearInterval(stepInterval);
          setSimulationState('blocked');
          addToast('Zero Trust Inspection: Connection Blocked', 'Device posture check failed at Gate 2', 'error');
          logAudit('Zero Trust Pipeline Denied Request', 'Hardware Posture Engine', 'Denied', 'Device untrusted');
          return 1;
        }

        if (scenario === 'tor_anomaly' && prev === 2) {
          clearInterval(stepInterval);
          setSimulationState('blocked');
          addToast('Zero Trust Inspection: Step-Up Challenge', 'Anomalous IP detected at Gate 3', 'warning');
          logAudit('Zero Trust Pipeline Challenged Request', 'Risk Heuristics Engine', 'Warning', 'Tor egress');
          return 2;
        }

        if (prev >= 4) {
          clearInterval(stepInterval);
          setSimulationState('success');
          addToast('Zero Trust Handshake Completed', 'Ephemeral microsegment tunnel established', 'success');
          logAudit('Zero Trust Handshake Successful', 'Target Microsegment', 'Success', 'All 5 gates passed');
          return 4;
        }
        return prev + 1;
      });
    }, 700);
  };

  return (
    <Modal
      isOpen={isArchitectureModalOpen}
      onClose={() => setIsArchitectureModalOpen(false)}
      title="Zero Trust Architecture & Pipeline Visualizer"
      subtitle="Interactive inspection of the 5-stage Zero Trust verification lifecycle: 'Never Trust. Always Verify.'"
      maxWidth="3xl"
    >
      <div className="space-y-6 text-xs">
        {/* Scenario Selectors */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="text-slate-300 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Select Test Scenario:</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setScenario('compliant');
                setSimulationState('idle');
                setActiveStep(0);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                scenario === 'compliant'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950'
              }`}
            >
              1. Compliant Employee
            </button>
            <button
              onClick={() => {
                setScenario('untrusted_device');
                setSimulationState('idle');
                setActiveStep(0);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                scenario === 'untrusted_device'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950'
              }`}
            >
              2. Compromised Endpoint
            </button>
            <button
              onClick={() => {
                setScenario('tor_anomaly');
                setSimulationState('idle');
                setActiveStep(0);
              }}
              className={`px-3 py-1 rounded-lg font-medium transition-all ${
                scenario === 'tor_anomaly'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950'
              }`}
            >
              3. Tor / Proxy Egress
            </button>
          </div>
        </div>

        {/* 5-Stage Interactive Pipeline Stepper */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            const isCurrent = activeStep === idx;
            const isPassed = activeStep > idx;
            const isFailedHere = simulationState === 'blocked' && activeStep === idx;

            return (
              <div
                key={s.id}
                onClick={() => setActiveStep(idx)}
                className={`p-3 rounded-xl border text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-between ${
                  isFailedHere
                    ? 'bg-rose-950/40 border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                    : isCurrent
                    ? 'bg-cyan-950/40 border-cyan-500/80 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : isPassed
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div
                  className={`p-2 rounded-lg mb-2 ${
                    isFailedHere
                      ? 'bg-rose-500/20 text-rose-400'
                      : isCurrent
                      ? 'bg-cyan-500/20 text-cyan-400'
                      : isPassed
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <div className="font-bold text-white text-[11px] leading-tight mb-1">{s.title}</div>
                <div className="text-[10px] text-slate-400 font-mono">
                  {isFailedHere ? '✕ DROPPED' : isPassed ? '✓ PASSED' : isCurrent ? '● EXECUTING' : 'PENDING'}
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Stage Deep-Dive Inspection Panel */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-[10px] uppercase font-mono text-cyan-400 font-semibold tracking-wider">
                Stage {activeStep + 1} Deep Forensics
              </span>
              <h3 className="text-base font-bold text-white mt-0.5">{steps[activeStep].title}</h3>
              <p className="text-slate-400 text-xs">{steps[activeStep].subtitle}</p>
            </div>

            <div>
              {scenario === 'compliant' || activeStep < (scenario === 'untrusted_device' ? 1 : 2) ? (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Posture Compliant
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-mono font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1.5">
                  <XCircle className="w-3.5 h-3.5" /> Anomaly Flagged
                </span>
              )}
            </div>
          </div>

          {/* Details bullet points */}
          <div className="space-y-1.5 pt-1">
            <span className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
              Cryptographic Telemetry:
            </span>
            <ul className="space-y-1 text-slate-300 font-mono text-xs">
              {steps[activeStep].details.map((d, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="text-cyan-400">▹</span>
                  <span>{d}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-2 border-t border-slate-800/80">
            <span className="text-slate-400 text-[11px] block">Live Verdict for Scenario:</span>
            <div className="mt-1 font-mono text-xs text-white">
              {scenario === 'compliant'
                ? steps[activeStep].compliantStatus
                : steps[activeStep].threatStatus}
            </div>
          </div>
        </div>

        {/* Footer Execution Trigger */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <div className="text-xs text-slate-400">
            Status:{' '}
            <span className="font-mono text-white font-bold uppercase">
              {simulationState === 'running'
                ? 'Inspecting packet flow...'
                : simulationState === 'success'
                ? 'Access Granted (Tunnel Established)'
                : simulationState === 'blocked'
                ? 'Perimeter Block Enforced'
                : 'Ready for Test'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSimulationState('idle');
                setActiveStep(0);
              }}
              className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-white"
              title="Reset Steps"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={handleRunSimulation}
              disabled={simulationState === 'running'}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition-all"
            >
              <Play className="w-4 h-4" />
              <span>Simulate Packet Transit</span>
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
