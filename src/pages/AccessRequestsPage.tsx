import React, { useState, useMemo } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { AccessRequest } from '../types';
import { StatusBadge, RiskScoreBadge } from '../components/common/StatusBadge';
import { AccessDecisionModal } from './AccessDecisionModal';
import {
  FileCheck2,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Eye,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Laptop,
} from 'lucide-react';

export const AccessRequestsPage: React.FC = () => {
  const { accessRequests, approveRequest, denyRequest, challengeRequest } = useSecurity();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'denied' | 'challenged'>('all');
  const [selectedRequest, setSelectedRequest] = useState<AccessRequest | null>(null);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const filteredRequests = useMemo(() => {
    return accessRequests.filter((req) => {
      const matchesSearch =
        req.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.resource.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.requestedRole.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || req.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [accessRequests, searchQuery, statusFilter]);

  const handleOpenReview = (req: AccessRequest) => {
    setSelectedRequest(req);
    setIsReviewOpen(true);
  };

  const pendingCount = accessRequests.filter((r) => r.status === 'pending').length;
  const approvedCount = accessRequests.filter((r) => r.status === 'approved').length;
  const deniedCount = accessRequests.filter((r) => r.status === 'denied').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Stats bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Access Requests</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Zero Trust Evaluation Panel
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Review Just-in-Time (JIT) access requests evaluated against identity, device trust, and risk heuristics.
          </p>
        </div>

        {/* Quick Summary Pill Counters */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center gap-2 text-xs">
            <span className="text-slate-400">Pending:</span>
            <span className="font-mono font-bold text-cyan-400">{pendingCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-xs">
            <span className="text-slate-400">Approved:</span>
            <span className="font-mono font-bold text-emerald-400">{approvedCount}</span>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-xs">
            <span className="text-slate-400">Denied:</span>
            <span className="font-mono font-bold text-rose-400">{deniedCount}</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by ID, user or resource..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Status Tab Filters */}
        <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto">
          {(['all', 'pending', 'approved', 'challenged', 'denied'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors shrink-0 ${
                statusFilter === status
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0d131f]/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Request ID</th>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Resource</th>
                <th className="px-4 py-3.5">Requested Role</th>
                <th className="px-4 py-3.5">Device</th>
                <th className="px-4 py-3.5">Risk Score</th>
                <th className="px-4 py-3.5">Time</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300 font-normal">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500">
                    <FileCheck2 className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                    <span>No access requests matching current filters</span>
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req, idx) => (
                  <tr
                    key={`${req.id}-${idx}`}
                    className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                    onClick={() => handleOpenReview(req)}
                  >
                    <td className="px-4 py-3.5 font-mono text-cyan-400 font-semibold whitespace-nowrap">
                      {req.id}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="font-semibold text-white group-hover:text-cyan-300">
                        {req.userName}
                      </div>
                      <div className="text-[11px] text-slate-400">{req.userDepartment}</div>
                    </td>

                    <td className="px-4 py-3.5">
                      <div className="font-medium text-slate-200 line-clamp-1 max-w-[220px]">
                        {req.resource}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">{req.resourceCategory}</div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-300">
                      {req.requestedRole}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-300">
                        <Laptop className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.deviceName.split(' ')[0]} {req.deviceName.split(' ')[1] || ''}</span>
                      </div>
                      <span className={`text-[10px] ${req.isDeviceTrusted ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {req.isDeviceTrusted ? 'Trusted' : 'Untrusted'} ({req.deviceTrustScore}%)
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <RiskScoreBadge score={req.riskScore} />
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                      {req.requestedAt}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={req.status} size="sm" />
                    </td>

                    <td
                      className="px-4 py-3.5 whitespace-nowrap text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-end gap-1.5">
                        {req.status === 'pending' && (
                          <>
                            <button
                              onClick={() => approveRequest(req.id)}
                              title="Approve Access"
                              className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20 transition-all"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => challengeRequest(req.id)}
                              title="Step-up Challenge"
                              className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 border border-amber-500/20 transition-all"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => denyRequest(req.id)}
                              title="Deny Access"
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleOpenReview(req)}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-medium flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Review</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Drawer */}
      <AccessDecisionModal
        request={selectedRequest}
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
      />
    </div>
  );
};
