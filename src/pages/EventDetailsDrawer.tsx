import React from 'react';
import { SecurityEvent } from '../types';
import { Drawer } from '../components/common/Drawer';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  ShieldAlert,
  Laptop,
  User,
  Globe,
  Radio,
  Clock,
  FileText,
  AlertTriangle,
  Lock,
} from 'lucide-react';

interface EventDetailsDrawerProps {
  event: SecurityEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EventDetailsDrawer: React.FC<EventDetailsDrawerProps> = ({
  event,
  isOpen,
  onClose,
}) => {
  if (!event) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`Security Incident — ${event.id}`}
      subtitle={`Type: ${event.eventType} • Logged ${event.timestamp}`}
      width="lg"
    >
      <div className="space-y-6 text-xs">
        {/* Event Header Banner */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-cyan-400" />
              <span>{event.eventType}</span>
            </span>
            <StatusBadge status={event.severity} />
          </div>
          <p className="text-slate-300 leading-relaxed pt-1">{event.details}</p>
        </div>

        {/* Forensics Grid */}
        <div className="space-y-3">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
            Incident Telemetry & Forensics
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-cyan-400" /> Subject Identity
              </span>
              <div className="font-semibold text-white">{event.user}</div>
              <div className="text-[10px] text-slate-400">{event.userEmail}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
                <Laptop className="w-3.5 h-3.5 text-cyan-400" /> Client Hardware
              </span>
              <div className="font-semibold text-white">{event.device}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 text-cyan-400" /> Source IP Address
              </span>
              <div className="font-mono text-cyan-300">{event.ip}</div>
            </div>

            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-slate-500 text-[11px] flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" /> Geo Origin
              </span>
              <div className="text-white">{event.location}</div>
            </div>
          </div>
        </div>

        {/* Action Taken */}
        <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
          <span className="text-slate-400 text-[11px] uppercase tracking-wider block">
            Automated Gateway Action
          </span>
          <div className="flex items-center gap-2">
            <StatusBadge status={event.action} />
            <span className="text-slate-300">Target: {event.resourceTarget || 'Perimeter Gateway'}</span>
          </div>
        </div>

        {/* SOC Analyst Remediation */}
        <div className="pt-2">
          <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider block mb-2">
            SOC Remediation Playbook
          </span>
          <div className="space-y-2">
            <button
              onClick={onClose}
              className="w-full py-2 px-3 rounded-lg bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 hover:bg-cyan-600/30 text-xs font-semibold text-left flex items-center justify-between"
            >
              <span>Dispatch Step-Up Authentication Challenge</span>
              <span>→</span>
            </button>
            <button
              onClick={onClose}
              className="w-full py-2 px-3 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/30 hover:bg-rose-600/30 text-xs font-semibold text-left flex items-center justify-between"
            >
              <span>Block Source IP at Edge Gateway</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
};
