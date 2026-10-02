import React, { useState, useMemo } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { Device } from '../types';
import { StatusBadge, RiskScoreBadge } from '../components/common/StatusBadge';
import { DeviceDetailsModal } from './DeviceDetailsModal';
import {
  Laptop,
  Search,
  ShieldCheck,
  ShieldAlert,
  ShieldX,
  AlertTriangle,
  Eye,
  Lock,
  Unlock,
} from 'lucide-react';

export const DevicesPage: React.FC = () => {
  const { devices, toggleDeviceTrust, quarantineDevice } = useSecurity();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'trusted' | 'unknown' | 'at_risk' | 'blocked'>('all');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredDevices = useMemo(() => {
    return devices.filter((d) => {
      const matchesSearch =
        d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.os.toLowerCase().includes(searchQuery.toLowerCase()) ||
        d.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || d.trustStatus === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [devices, searchQuery, statusFilter]);

  const handleOpenDetails = (d: Device) => {
    setSelectedDevice(d);
    setIsDetailsOpen(true);
  };

  const trustedCount = devices.filter((d) => d.trustStatus === 'trusted').length;
  const unknownCount = devices.filter((d) => d.trustStatus === 'unknown').length;
  const atRiskCount = devices.filter((d) => d.trustStatus === 'at_risk').length;
  const blockedCount = devices.filter((d) => d.trustStatus === 'blocked').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Device Trust & Inventory</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Endpoint Posture
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Continuous health telemetry inspecting disk encryption, EDR agent integrity, OS patches, and hardware certificates.
          </p>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Trusted Devices</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">1,842</div>
          <span className="text-[10px] text-slate-400 font-mono">+5.2% verified compliant</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Unknown Devices</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">64</div>
          <span className="text-[10px] text-slate-400 font-mono">Pending enrollment cert</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">At Risk Endpoints</span>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">39</div>
          <span className="text-[10px] text-amber-300/80 font-mono">Missing EDR or patches</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Blocked Devices</span>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">17</div>
          <span className="text-[10px] text-rose-300/80 font-mono">Quarantined from network</span>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search device name, user, OS, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          {(['all', 'trusted', 'unknown', 'at_risk', 'blocked'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors shrink-0 ${
                statusFilter === status
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              {status.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Devices Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0d131f]/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Device Name</th>
                <th className="px-4 py-3.5">Assigned User</th>
                <th className="px-4 py-3.5">OS & Kernel</th>
                <th className="px-4 py-3.5">Location</th>
                <th className="px-4 py-3.5">Trust Score</th>
                <th className="px-4 py-3.5">EDR Posture</th>
                <th className="px-4 py-3.5">Last Seen</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredDevices.map((d, idx) => (
                <tr
                  key={`${d.id}-${idx}`}
                  onClick={() => handleOpenDetails(d)}
                  className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                >
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300">
                        <Laptop className="w-4 h-4 text-cyan-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white group-hover:text-cyan-300">
                          {d.name}
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono">{d.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-medium text-slate-200">{d.userName}</div>
                    <div className="text-[11px] text-slate-400">{d.userEmail}</div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-300">
                    {d.os}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-300">
                    {d.location}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-xs">{d.trustScore}%</span>
                      <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            d.trustScore >= 80
                              ? 'bg-emerald-400'
                              : d.trustScore >= 50
                              ? 'bg-amber-400'
                              : 'bg-rose-500'
                          }`}
                          style={{ width: `${d.trustScore}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-300 font-mono text-[11px]">
                    {d.edrStatus}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                    {d.lastSeen}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={d.trustStatus} size="sm" />
                  </td>

                  <td
                    className="px-4 py-3.5 whitespace-nowrap text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => quarantineDevice(d.id)}
                        title={d.trustStatus === 'blocked' ? 'Restore Endpoint' : 'Quarantine Endpoint'}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          d.trustStatus === 'blocked'
                            ? 'text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30'
                            : 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border-slate-700'
                        }`}
                      >
                        <ShieldX className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleOpenDetails(d)}
                        className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 text-xs font-medium flex items-center gap-1"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      <DeviceDetailsModal
        device={selectedDevice}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </div>
  );
};
