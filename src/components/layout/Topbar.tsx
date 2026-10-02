import React, { useState, useRef, useEffect } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import {
  Search,
  Bell,
  ShieldCheck,
  Globe,
  ChevronDown,
  CheckCheck,
  Sparkles,
  RotateCcw,
  LogOut,
  ExternalLink,
  Shield,
  Laptop,
  AlertCircle,
  Compass,
  Layers,
  Radio,
  Menu,
  Zap,
  Bot,
} from 'lucide-react';

interface TopbarProps {
  onNavigate: (page: string) => void;
  onToggleMobileMenu?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onNavigate, onToggleMobileMenu }) => {
  const {
    currentUser,
    environment,
    setEnvironment,
    setIsSearchOpen,
    setIsSimulatorOpen,
    setIsArchitectureModalOpen,
    setIsLiveSessionsModalOpen,
    setIsTourModalOpen,
    isLiveStreamActive,
    toggleLiveStream,
    notifications,
    activeSessions,
    markNotificationAsRead,
    markAllNotificationsRead,
    resetToDemoDefaults,
    logout,
  } = useSecurity();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (userRef.current && !userRef.current.contains(e.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotifClick = (notifId: string, actionUrl?: string) => {
    markNotificationAsRead(notifId);
    if (actionUrl) {
      onNavigate(actionUrl);
      setIsNotifOpen(false);
    }
  };

  return (
    <header className="h-16 bg-[#080c14]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-6 flex items-center justify-between z-10 shrink-0 gap-3">
      {/* Mobile Menu & Global Search Bar Trigger */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        {onToggleMobileMenu && (
          <button
            onClick={onToggleMobileMenu}
            className="md:hidden p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            title="Open Menu"
          >
            <Menu className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => setIsSearchOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-slate-400 hover:text-slate-200 transition-all text-xs group"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            <span className="truncate">Search users, devices, policies, events...</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 font-mono text-[10px] bg-slate-800/80 px-2 py-0.5 rounded text-slate-300 border border-slate-700 shrink-0">
            <span>Ctrl</span>
            <span>+</span>
            <span>K</span>
          </div>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Guided Demo Tour Button */}
        <button
          onClick={() => setIsTourModalOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 text-xs font-semibold transition-all shadow-[0_0_12px_rgba(99,102,241,0.15)]"
          title="Interactive Product Presentation Walkthrough"
        >
          <Compass className="w-3.5 h-3.5 text-indigo-400" />
          <span>Demo Tour</span>
        </button>

        {/* 5-Gate Architecture Flow Visualizer */}
        <button
          onClick={() => setIsArchitectureModalOpen(true)}
          className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-all"
          title="Inspect the 5-Stage Zero Trust Verification Pipeline"
        >
          <Layers className="w-3.5 h-3.5 text-cyan-400" />
          <span>Architecture Flow</span>
        </button>

        {/* Active Sessions Live Monitor Trigger */}
        <button
          onClick={() => setIsLiveSessionsModalOpen(true)}
          className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 text-xs font-medium font-mono transition-all"
          title="View Continuous Active Sessions"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{activeSessions.length} Sessions</span>
        </button>

        {/* Live SOC Stream Simulation Toggle */}
        <button
          onClick={toggleLiveStream}
          className={`hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-mono transition-all ${
            isLiveStreamActive
              ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
          }`}
          title="Toggle Real-Time Telemetry Stream"
        >
          <Radio className={`w-3.5 h-3.5 ${isLiveStreamActive ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`} />
          <span className="text-[11px]">{isLiveStreamActive ? 'LIVE STREAM' : 'STREAM PAUSED'}</span>
        </button>

        {/* Environment Selector */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={environment}
            onChange={(e) => setEnvironment(e.target.value as any)}
            className="bg-transparent text-white font-medium focus:outline-none cursor-pointer text-xs"
          >
            <option value="Production" className="bg-slate-900 text-white">Prod Edge</option>
            <option value="Staging" className="bg-slate-900 text-white">Staging</option>
            <option value="DR-East" className="bg-slate-900 text-white">DR East</option>
          </select>
        </div>

        {/* Quick Simulator Button */}
        <button
          onClick={() => setIsSimulatorOpen(true)}
          className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20 text-xs font-semibold transition-all shadow-[0_0_10px_rgba(6,182,212,0.15)]"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Simulate Access</span>
        </button>

        {/* Notifications Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            title="Security Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center font-mono">
                {unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-[#0b1019] border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden z-50">
              <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between bg-slate-900/60">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Security Alerts</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-rose-500/20 text-rose-400 font-mono">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1 font-medium"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-800/60">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-slate-500 text-xs">No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => handleNotifClick(n.id, n.actionUrl)}
                      className={`p-3.5 cursor-pointer hover:bg-slate-800/40 transition-colors flex items-start gap-3 ${
                        !n.read ? 'bg-cyan-950/15' : ''
                      }`}
                    >
                      <div className="mt-0.5">
                        {n.severity === 'critical' ? (
                          <div className="w-2 h-2 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
                        ) : n.severity === 'high' ? (
                          <div className="w-2 h-2 rounded-full bg-orange-400" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-cyan-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className={`text-xs font-semibold ${!n.read ? 'text-white' : 'text-slate-300'}`}>
                            {n.title}
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono shrink-0">{n.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-relaxed">
                          {n.message}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2.5 border-t border-slate-800 bg-slate-900/40 text-center">
                <button
                  onClick={() => {
                    onNavigate('events');
                    setIsNotifOpen(false);
                  }}
                  className="text-xs text-cyan-400 hover:text-cyan-300 font-medium"
                >
                  View All SOC Security Incidents →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar & Menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 pl-1.5 rounded-full hover:bg-slate-800/60 border border-slate-800 transition-colors"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-full object-cover border border-cyan-500/50"
            />
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 mr-1" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-[#0b1019] border border-slate-700/80 rounded-xl shadow-2xl shadow-cyan-950/40 overflow-hidden z-50 py-1 divide-y divide-slate-800">
              <div className="px-4 py-3">
                <div className="text-xs font-bold text-white">{currentUser.name}</div>
                <div className="text-[11px] text-slate-400 truncate">{currentUser.email}</div>
                <div className="mt-1 text-[10px] font-mono text-cyan-400 bg-cyan-950/40 px-1.5 py-0.5 rounded border border-cyan-500/30 inline-block">
                  {currentUser.role}
                </div>
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    onNavigate('users');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span>Identity Management</span>
                </button>
                <button
                  onClick={() => {
                    onNavigate('settings');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2"
                >
                  <Shield className="w-4 h-4 text-slate-400" />
                  <span>Security Settings</span>
                </button>
                <button
                  onClick={() => {
                    resetToDemoDefaults();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Reset Demo State</span>
                </button>
              </div>

              <div className="py-1 text-xs">
                <button
                  onClick={() => {
                    logout();
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4 text-rose-400" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
