import React, { useState, useMemo } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { AuditLog } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  History,
  Search,
  Download,
  Filter,
  CheckCircle2,
  XCircle,
  FileSpreadsheet,
} from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs, addToast } = useSecurity();
  const [searchQuery, setSearchQuery] = useState('');
  const [resultFilter, setResultFilter] = useState<string>('all');

  const filteredLogs = useMemo(() => {
    return auditLogs.filter((log) => {
      const matchesSearch =
        log.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.metadata && log.metadata.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesResult = resultFilter === 'all' || log.result.toLowerCase() === resultFilter.toLowerCase();

      return matchesSearch && matchesResult;
    });
  }, [auditLogs, searchQuery, resultFilter]);

  const handleExportCSV = () => {
    if (filteredLogs.length === 0) {
      addToast('No Data to Export', 'There are no audit logs matching your current filters.', 'warning');
      return;
    }

    const headers = ['Log ID', 'Timestamp', 'Actor', 'Actor Role', 'Action', 'Target Resource', 'IP Address', 'Result', 'Metadata'];
    const rows = filteredLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      `"${l.actor}"`,
      `"${l.actorRole}"`,
      `"${l.action}"`,
      `"${l.resource}"`,
      l.ipAddress,
      l.result,
      `"${l.metadata || ''}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `zerotrustx_audit_trail_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    addToast('Audit Log Exported', 'CSV file generated and downloaded successfully', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Audit Trail</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Immutable Ledger
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tamper-resistant cryptographic audit trail capturing administrative modifications, policy changes, and access grants.
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-xs flex items-center gap-2 transition-all shadow-md self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-cyan-400" />
          <span>Export Audit Trail (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search actor, action, resource, or IP..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Result Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 shrink-0 mr-1">Result:</span>
          {(['all', 'success', 'denied', 'warning', 'failed'] as const).map((res) => (
            <button
              key={res}
              onClick={() => setResultFilter(res)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors shrink-0 ${
                resultFilter === res
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              {res}
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0d131f]/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Log ID</th>
                <th className="px-4 py-3.5">Timestamp</th>
                <th className="px-4 py-3.5">Actor</th>
                <th className="px-4 py-3.5">Action Executed</th>
                <th className="px-4 py-3.5">Target Resource</th>
                <th className="px-4 py-3.5">Source IP</th>
                <th className="px-4 py-3.5">Result</th>
                <th className="px-4 py-3.5">Metadata / Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredLogs.map((log, idx) => (
                <tr key={`${log.id}-${idx}`} className="hover:bg-slate-900/50 transition-colors">
                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-cyan-400 font-semibold text-[11px]">
                    {log.id}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                    {log.timestamp}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="font-semibold text-white">{log.actor}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{log.actorRole}</div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-slate-200 font-medium">
                    {log.action}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-cyan-300 font-mono text-[11px]">
                    {log.resource}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                    {log.ipAddress}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={log.result} size="sm" />
                  </td>

                  <td className="px-4 py-3.5 text-slate-400 text-[11px] font-mono max-w-xs truncate">
                    {log.metadata || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
