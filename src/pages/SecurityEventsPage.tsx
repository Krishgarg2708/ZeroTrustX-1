import React, { useState, useMemo } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { SecurityEvent, RiskLevel } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { EventDetailsDrawer } from './EventDetailsDrawer';
import {
  Activity,
  Search,
  Filter,
  ShieldAlert,
  MapPin,
  Laptop,
  Radio,
  Eye,
  RefreshCw,
} from 'lucide-react';

export const SecurityEventsPage: React.FC = () => {
  const { securityEvents } = useSecurity();
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<'all' | RiskLevel>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedEvent, setSelectedEvent] = useState<SecurityEvent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filteredEvents = useMemo(() => {
    return securityEvents.filter((evt) => {
      const matchesSearch =
        evt.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.ip.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.device.toLowerCase().includes(searchQuery.toLowerCase()) ||
        evt.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSeverity = severityFilter === 'all' || evt.severity === severityFilter;
      const matchesType = typeFilter === 'all' || evt.eventType === typeFilter;

      return matchesSearch && matchesSeverity && matchesType;
    });
  }, [securityEvents, searchQuery, severityFilter, typeFilter]);

  const handleOpenEvent = (evt: SecurityEvent) => {
    setSelectedEvent(evt);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Security Events</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              SOC SIEM Ingestion
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time feed of authentication handshakes, perimeter anomalies, access denials, and automated quarantines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 font-mono">
            {filteredEvents.length} events logged
          </span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search event, user, IP, or payload..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 shrink-0 mr-1">Severity:</span>
          {(['all', 'low', 'medium', 'high', 'critical'] as const).map((sev) => (
            <button
              key={sev}
              onClick={() => setSeverityFilter(sev)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors shrink-0 ${
                severityFilter === sev
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Events Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0d131f]/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Severity</th>
                <th className="px-4 py-3.5">Event Type</th>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Source IP</th>
                <th className="px-4 py-3.5">Device</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Action</th>
                <th className="px-4 py-3.5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredEvents.map((evt, idx) => (
                <tr
                  key={`${evt.id}-${idx}`}
                  onClick={() => handleOpenEvent(evt)}
                  className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                >
                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                    {evt.timestamp}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={evt.severity} size="sm" />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-semibold text-white group-hover:text-cyan-300">
                      {evt.eventType}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-medium text-slate-200">{evt.user}</div>
                    <div className="text-[10px] text-slate-500">{evt.userEmail}</div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-cyan-300 text-[11px]">
                    {evt.ip}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Laptop className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate max-w-[140px]">{evt.device}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      <span>{evt.location}</span>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={evt.action} size="sm" />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleOpenEvent(evt)}
                      className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 text-xs font-medium inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Event Details Drawer */}
      <EventDetailsDrawer
        event={selectedEvent}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
