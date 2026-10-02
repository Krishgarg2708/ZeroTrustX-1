import React from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { Modal } from './Modal';
import {
  Compass,
  ArrowRight,
  ShieldCheck,
  FileCheck2,
  Sliders,
  Laptop,
  Flame,
  Globe,
  Sparkles,
  Zap,
} from 'lucide-react';

interface GuidedTourModalProps {
  onNavigate: (pageId: string) => void;
}

export const GuidedTourModal: React.FC<GuidedTourModalProps> = ({ onNavigate }) => {
  const {
    isTourModalOpen,
    setIsTourModalOpen,
    setIsSimulatorOpen,
    setIsArchitectureModalOpen,
    triggerAttackScenario,
  } = useSecurity();

  const tourStops = [
    {
      title: '1. Executive Security Score & Real-Time SOC Command Center',
      description: 'Observe the 87/100 Zero Trust score breakdown across Identity, Device, Policy, and MFA metrics along with live access requests.',
      pageId: 'dashboard',
      icon: ShieldCheck,
      badge: 'Overview',
    },
    {
      title: '2. Zero Trust Access Decision Panel',
      description: 'Open a pending JIT request to inspect the live multi-factor posture check, IP reputation, behavioral biometrics, and approve/challenge/deny.',
      pageId: 'requests',
      icon: FileCheck2,
      badge: 'Evaluation',
    },
    {
      title: '3. Interactive Policy Simulator Engine',
      description: 'Test what-if scenarios across arbitrary users, devices, locations, and resources to observe dynamic Zero Trust policy enforcement.',
      action: () => setIsSimulatorOpen(true),
      icon: Sliders,
      badge: 'Simulator',
    },
    {
      title: '4. Endpoint Trust & Device Quarantine',
      description: 'Audit compliant versus compromised hardware, review BitLocker/FileVault encryption, and isolate endpoints with one click.',
      pageId: 'devices',
      icon: Laptop,
      badge: 'Device Trust',
    },
    {
      title: '5. RBAC Granular Permission Matrix',
      description: 'Toggle granular View/Create/Edit/Delete/Approve entitlements across 6 enterprise roles and 7 system domains.',
      pageId: 'roles',
      icon: Compass,
      badge: 'Governance',
    },
  ];

  const handleStopClick = (stop: (typeof tourStops)[0]) => {
    setIsTourModalOpen(false);
    if (stop.pageId) {
      onNavigate(stop.pageId);
    } else if (stop.action) {
      stop.action();
    }
  };

  return (
    <Modal
      isOpen={isTourModalOpen}
      onClose={() => setIsTourModalOpen(false)}
      title="ZeroTrustX — Demonstration Guide & Presentation Story"
      subtitle="Follow the step-by-step storyline to demonstrate complete Zero Trust architecture"
      maxWidth="2xl"
    >
      <div className="space-y-4 text-xs">
        {/* Quick Attack Simulator Trigger Banner */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-rose-950/40 via-slate-900/60 to-slate-900/80 border border-rose-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-1.5 font-bold text-rose-300">
              <Flame className="w-4 h-4 text-rose-400" />
              <span>Live Demonstration Feature: Attack Simulation</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Simulate an incoming Tor Exit credential stuffing attack. Watch the Zero Trust engine detect, challenge, and log the incident!
            </p>
          </div>

          <button
            onClick={() => {
              triggerAttackScenario('credential_stuffing');
              setIsTourModalOpen(false);
              onNavigate('events');
            }}
            className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shrink-0 flex items-center gap-1.5 shadow-lg shadow-rose-950/50 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Simulate Live Attack</span>
          </button>
        </div>

        {/* Guided Storyline Steps */}
        <div className="space-y-2.5">
          {tourStops.map((stop, idx) => {
            const Icon = stop.icon;
            return (
              <div
                key={idx}
                onClick={() => handleStopClick(stop)}
                className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-900/60 transition-all cursor-pointer group flex items-start justify-between gap-4"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 group-hover:bg-cyan-500/20 transition-colors mt-0.5">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-xs group-hover:text-cyan-300 transition-colors">
                        {stop.title}
                      </span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono uppercase bg-slate-800 text-slate-300 border border-slate-700">
                        {stop.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                      {stop.description}
                    </p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-1 transition-all shrink-0 mt-2" />
              </div>
            );
          })}
        </div>

        <div className="pt-2 flex justify-between items-center text-[11px] text-slate-500 font-mono border-t border-slate-800">
          <span>College / Evaluation / SOC Architecture Ready</span>
          <button
            onClick={() => {
              setIsTourModalOpen(false);
              setIsArchitectureModalOpen(true);
            }}
            className="text-cyan-400 hover:text-cyan-300 font-medium"
          >
            Open 5-Gate Architecture Visualizer →
          </button>
        </div>
      </div>
    </Modal>
  );
};
