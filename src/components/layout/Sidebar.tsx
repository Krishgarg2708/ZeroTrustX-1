import React from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  LayoutDashboard,
  Users,
  ShieldAlert,
  FileCheck2,
  KeyRound,
  Laptop,
  Shield,
  BarChart3,
  Activity,
  History,
  Settings,
  ShieldCheck,
  ChevronRight,
  LogOut,
  Sparkles,
  Bot,
} from 'lucide-react';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPage, onNavigate }) => {
  const { currentUser, logout, setIsSimulatorOpen, accessRequests, securityEvents } = useSecurity();

  const pendingRequestsCount = accessRequests.filter((r) => r.status === 'pending').length;
  const criticalEventsCount = securityEvents.filter((e) => e.severity === 'critical' || e.severity === 'high').length;

  const navSections = [
    {
      title: 'OVERVIEW',
      items: [
        { id: 'dashboard', label: 'Security Overview', icon: LayoutDashboard },
      ],
    },
    {
      title: 'INTELLIGENCE',
      items: [
        {
          id: 'copilot',
          label: 'AI SOC Copilot',
          icon: Bot,
          badge: 'GEMINI',
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        },
      ],
    },
    {
      title: 'IDENTITY',
      items: [
        { id: 'users', label: 'Users & IAM', icon: Users },
        { id: 'roles', label: 'RBAC / Roles', icon: KeyRound },
        {
          id: 'requests',
          label: 'Access Requests',
          icon: FileCheck2,
          badge: pendingRequestsCount > 0 ? pendingRequestsCount : undefined,
          badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
        },
      ],
    },
    {
      title: 'SECURITY',
      items: [
        { id: 'mfa', label: 'MFA & Auth', icon: ShieldCheck },
        { id: 'devices', label: 'Device Trust', icon: Laptop },
        { id: 'policies', label: 'Zero Trust Policies', icon: Shield },
      ],
    },
    {
      title: 'MONITORING',
      items: [
        { id: 'risk', label: 'Risk Analytics', icon: BarChart3 },
        {
          id: 'events',
          label: 'Security Events',
          icon: Activity,
          badge: criticalEventsCount > 0 ? criticalEventsCount : undefined,
          badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
        },
        { id: 'audit', label: 'Audit Logs', icon: History },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-64 bg-[#0a0e17] border-r border-slate-800/80 flex flex-col h-screen select-none shrink-0 z-20">
      {/* Brand Logo Header */}
      <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          {/* Custom Shield + Node Cyber Icon */}
          <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.35)]">
            <ShieldCheck className="w-6 h-6 text-white" />
            <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#0a0e17] animate-pulse" />
          </div>
          <div>
            <div className="flex items-baseline gap-1">
              <span className="font-extrabold tracking-wider text-base text-white font-mono">ZERO</span>
              <span className="font-extrabold text-base text-cyan-400 font-mono">TRUSTX</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-400 font-medium font-mono">
              Zero Trust Security
            </div>
          </div>
        </div>
      </div>

      {/* Simulator Shortcut Banner */}
      <div className="px-3 pt-3">
        <button
          onClick={() => setIsSimulatorOpen(true)}
          className="w-full px-3 py-2 rounded-xl bg-gradient-to-r from-cyan-950/60 to-blue-950/60 border border-cyan-500/30 hover:border-cyan-500/60 text-left flex items-center justify-between group transition-all"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-semibold text-cyan-200">Policy Simulator</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">
            LIVE
          </span>
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {navSections.map((section) => (
          <div key={section.title}>
            <div className="px-3 mb-2 text-[10px] font-bold tracking-widest text-slate-300 uppercase font-mono">
              {section.title}
            </div>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-[0_0_12px_rgba(6,182,212,0.15)] font-semibold'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full border ${item.badgeColor}`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Operational Status & User Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-[#070b12] space-y-3">
        {/* System Status Indicator */}
        <div className="px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] font-medium text-slate-300">System Operational</span>
          </div>
          <span className="text-[10px] text-slate-500 font-mono">v4.8-ZT</span>
        </div>

        {/* User Profile Tile */}
        <div className="flex items-center justify-between px-2 py-1.5 rounded-lg hover:bg-slate-800/40 transition-colors">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full object-cover border border-cyan-500/40"
            />
            <div className="min-w-0">
              <div className="text-xs font-semibold text-white truncate">{currentUser.name}</div>
              <div className="text-[10px] text-slate-400 truncate">{currentUser.role}</div>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out of Zero Trust console"
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
