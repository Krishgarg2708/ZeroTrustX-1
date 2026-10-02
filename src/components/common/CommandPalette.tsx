import React, { useState, useMemo } from 'react';
import { useSecurity } from '../../context/SecurityContext';
import { Search, User, Laptop, Shield, AlertCircle, FileKey, X, ArrowRight, Bot, Sparkles, Layers, Radio, Compass } from 'lucide-react';

interface CommandPaletteProps {
  onNavigate: (pageId: string) => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({ onNavigate }) => {
  const {
    isSearchOpen,
    setIsSearchOpen,
    users,
    devices,
    policies,
    securityEvents,
    accessRequests,
    setIsSimulatorOpen,
    setIsArchitectureModalOpen,
    setIsLiveSessionsModalOpen,
    setIsTourModalOpen,
  } = useSecurity();
  const [query, setQuery] = useState('');

  const filteredResults = useMemo(() => {
    if (!query.trim()) {
      return {
        users: users.slice(0, 3),
        devices: devices.slice(0, 2),
        policies: policies.slice(0, 2),
        events: securityEvents.slice(0, 2),
        requests: accessRequests.slice(0, 2),
      };
    }
    const q = query.toLowerCase();

    return {
      users: users.filter((u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.toLowerCase().includes(q)),
      devices: devices.filter((d) => d.name.toLowerCase().includes(q) || d.userName.toLowerCase().includes(q) || d.os.toLowerCase().includes(q)),
      policies: policies.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)),
      events: securityEvents.filter((e) => e.eventType.toLowerCase().includes(q) || e.user.toLowerCase().includes(q) || e.details.toLowerCase().includes(q)),
      requests: accessRequests.filter((r) => r.userName.toLowerCase().includes(q) || r.resource.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)),
    };
  }, [query, users, devices, policies, securityEvents, accessRequests]);

  if (!isSearchOpen) return null;

  const handleSelect = (pageId: string) => {
    onNavigate(pageId);
    setIsSearchOpen(false);
    setQuery('');
  };

  const totalResults =
    filteredResults.users.length +
    filteredResults.devices.length +
    filteredResults.policies.length +
    filteredResults.events.length +
    filteredResults.requests.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Palette Box */}
      <div className="relative w-full max-w-2xl bg-[#0b1019] border border-slate-700/80 rounded-2xl shadow-2xl shadow-cyan-950/40 overflow-hidden z-10 flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-800 bg-slate-900/80">
          <Search className="w-5 h-5 text-cyan-400 mr-3" />
          <input
            type="text"
            placeholder="Search users, devices, policies, SOC events, access requests... (ESC to close)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent border-0 text-white placeholder-slate-500 text-sm focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-white p-1 text-xs mr-2"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-4">
          {/* Quick Actions Shortcuts */}
          {(!query || 'copilot simulator architecture tour sessions'.includes(query.toLowerCase())) && (
            <div>
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Quick Operations & Tools
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    handleSelect('copilot');
                  }}
                  className="p-2.5 rounded-lg bg-cyan-950/20 hover:bg-cyan-950/40 border border-cyan-500/20 hover:border-cyan-500/40 text-left flex items-center gap-2.5 group transition-all"
                >
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                      AI SOC Threat Copilot
                    </div>
                    <div className="text-[10px] text-slate-400">Gemini intelligence & live CVE search</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setIsSimulatorOpen(true);
                  }}
                  className="p-2.5 rounded-lg bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/20 hover:border-emerald-500/40 text-left flex items-center gap-2.5 group transition-all"
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                      Policy Access Simulator
                    </div>
                    <div className="text-[10px] text-slate-400">Test identity, device & risk heuristics</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setIsArchitectureModalOpen(true);
                  }}
                  className="p-2.5 rounded-lg bg-indigo-950/20 hover:bg-indigo-950/40 border border-indigo-500/20 hover:border-indigo-500/40 text-left flex items-center gap-2.5 group transition-all"
                >
                  <Layers className="w-4 h-4 text-indigo-400" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-indigo-300">
                      5-Gate Architecture Explorer
                    </div>
                    <div className="text-[10px] text-slate-400">Step through ZTNA pipeline flow</div>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setIsSearchOpen(false);
                    setIsLiveSessionsModalOpen(true);
                  }}
                  className="p-2.5 rounded-lg bg-rose-950/20 hover:bg-rose-950/40 border border-rose-500/20 hover:border-rose-500/40 text-left flex items-center gap-2.5 group transition-all"
                >
                  <Radio className="w-4 h-4 text-rose-400" />
                  <div>
                    <div className="text-xs font-semibold text-white group-hover:text-rose-300">
                      Active Sessions & Break-Glass
                    </div>
                    <div className="text-[10px] text-slate-400">Revoke live WireGuard cryptographic tunnels</div>
                  </div>
                </button>
              </div>
            </div>
          )}

          {totalResults === 0 && query ? (
            <div className="py-12 text-center text-slate-500 text-sm">
              No Zero Trust entities found matching "{query}"
            </div>
          ) : (
            <>
              {/* Access Requests */}
              {filteredResults.requests.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <FileKey className="w-3.5 h-3.5 text-cyan-400" /> Access Requests ({filteredResults.requests.length})
                  </div>
                  <div className="space-y-1">
                    {filteredResults.requests.map((req, idx) => (
                      <button
                        key={`${req.id}-${idx}`}
                        onClick={() => handleSelect('requests')}
                        className="w-full text-left p-2.5 rounded-lg bg-slate-900/40 hover:bg-cyan-950/30 border border-slate-800/80 hover:border-cyan-500/30 flex items-center justify-between group transition-all"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                            {req.userName} → {req.resource}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {req.id} • Risk Score: {req.riskScore} • Status: {req.status.toUpperCase()}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Users */}
              {filteredResults.users.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" /> Identities & Users ({filteredResults.users.length})
                  </div>
                  <div className="space-y-1">
                    {filteredResults.users.map((u, idx) => (
                      <button
                        key={`${u.id}-${idx}`}
                        onClick={() => handleSelect('users')}
                        className="w-full text-left p-2.5 rounded-lg bg-slate-900/40 hover:bg-indigo-950/30 border border-slate-800/80 hover:border-indigo-500/30 flex items-center justify-between group transition-all"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                          <div>
                            <div className="text-xs font-semibold text-white group-hover:text-indigo-300">
                              {u.name} ({u.department})
                            </div>
                            <div className="text-[11px] text-slate-400">
                              {u.email} • {u.role} • MFA: {u.mfaMethod}
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-transform group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Devices */}
              {filteredResults.devices.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Laptop className="w-3.5 h-3.5 text-emerald-400" /> Endpoints & Devices ({filteredResults.devices.length})
                  </div>
                  <div className="space-y-1">
                    {filteredResults.devices.map((d, idx) => (
                      <button
                        key={`${d.id}-${idx}`}
                        onClick={() => handleSelect('devices')}
                        className="w-full text-left p-2.5 rounded-lg bg-slate-900/40 hover:bg-emerald-950/30 border border-slate-800/80 hover:border-emerald-500/30 flex items-center justify-between group transition-all"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white group-hover:text-emerald-300">
                            {d.name} • {d.userName}
                          </div>
                          <div className="text-[11px] text-slate-400">
                            {d.os} • Trust: {d.trustScore}/100 • EDR: {d.edrStatus}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-transform group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Policies */}
              {filteredResults.policies.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5 text-cyan-400" /> Zero Trust Policies ({filteredResults.policies.length})
                  </div>
                  <div className="space-y-1">
                    {filteredResults.policies.map((p, idx) => (
                      <button
                        key={`${p.id}-${idx}`}
                        onClick={() => handleSelect('policies')}
                        className="w-full text-left p-2.5 rounded-lg bg-slate-900/40 hover:bg-cyan-950/30 border border-slate-800/80 hover:border-cyan-500/30 flex items-center justify-between group transition-all"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white group-hover:text-cyan-300">
                            {p.name}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            Min Trust: {p.conditions.minDeviceTrust} • Status: {p.status.toUpperCase()}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Events */}
              {filteredResults.events.length > 0 && (
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-400" /> Security Incidents & Events ({filteredResults.events.length})
                  </div>
                  <div className="space-y-1">
                    {filteredResults.events.map((e, idx) => (
                      <button
                        key={`${e.id}-${idx}`}
                        onClick={() => handleSelect('events')}
                        className="w-full text-left p-2.5 rounded-lg bg-slate-900/40 hover:bg-amber-950/30 border border-slate-800/80 hover:border-amber-500/30 flex items-center justify-between group transition-all"
                      >
                        <div className="min-w-0">
                          <div className="text-xs font-semibold text-white group-hover:text-amber-300">
                            {e.eventType}: {e.user}
                          </div>
                          <div className="text-[11px] text-slate-400 truncate">
                            {e.details} ({e.timestamp})
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-transform group-hover:translate-x-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">ESC</kbd> to close
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Ctrl+K</kbd> quick open
            </span>
          </div>
          <span>ZeroTrustX Global Index</span>
        </div>
      </div>
    </div>
  );
};
