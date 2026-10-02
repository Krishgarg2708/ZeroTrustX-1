import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { StatusBadge } from '../components/common/StatusBadge';
import {
  KeyRound,
  ShieldCheck,
  Smartphone,
  Fingerprint,
  Key,
  MessageSquare,
  AlertTriangle,
  RotateCw,
  Search,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export const MfaPage: React.FC = () => {
  const { users, requireMFAForUser } = useSecurity();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'enabled' | 'disabled' | 'enforced'>('all');

  const methodsData = [
    { name: 'Authenticator App (TOTP)', adoption: 92, count: '2,282 users', color: '#06b6d4' },
    { name: 'Hardware FIDO2 Key', adoption: 38, count: '942 users', color: '#10b981' },
    { name: 'SMS OTP (Legacy)', adoption: 21, count: '521 users', color: '#f59e0b' },
    { name: 'Biometric Passkey', adoption: 17, count: '421 users', color: '#6366f1' },
  ];

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.role.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || u.mfaStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">MFA & Authentication</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              FIDO2 / WebAuthn
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enforce phishing-resistant multi-factor authentication across all workforce identities and privileged roles.
          </p>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">MFA Adoption</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">96.4%</div>
          <span className="text-[10px] text-slate-400 font-mono">+2.1% from last audit</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Protected Users</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">2,392</div>
          <span className="text-[10px] text-emerald-400 font-mono">Compliant with baseline</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Failed Attempts</span>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">34</div>
          <span className="text-[10px] text-rose-300/80 font-mono">Blocked at perimeter</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Step-Up Challenges</span>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">128</div>
          <span className="text-[10px] text-amber-300/80 font-mono">Anomalous session prompts</span>
        </div>
      </div>

      {/* Method Breakdown & Security Notice */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Method Chart & Progress */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-[#0d131f]/90 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-white">Registered Multi-Factor Methods</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Workforce distribution of hardware security keys, biometrics, authenticator apps, and SMS.
            </p>
          </div>

          <div className="space-y-3.5 pt-2">
            {methodsData.map((m) => (
              <div key={m.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-200 font-medium">{m.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500 text-[11px]">{m.count}</span>
                    <span className="font-mono font-bold text-white">{m.adoption}%</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden p-0.5 border border-slate-700/60">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${m.adoption}%`, backgroundColor: m.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Key FIDO2 Card */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0d131f]/90 border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="p-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 inline-block mb-3">
              <Key className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Phishing-Resistant Standard</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              FIDO2 hardware tokens (YubiKey / Google Titan) and WebAuthn platform biometrics are strictly required for all privileged roles (SOC, DevOps, Finance).
            </p>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs">
            <span className="font-semibold block mb-0.5">Deprecated Auth Notice</span>
            SMS OTP is slated for complete phaseout in Q4 2026 due to SIM-swapping vulnerability.
          </div>
        </div>
      </div>

      {/* User MFA Table */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Filter users by name or role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
            {(['all', 'enabled', 'disabled', 'enforced'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-colors shrink-0 ${
                  filterStatus === status
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white bg-slate-950/60'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0d131f]/90 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">User</th>
                  <th className="px-4 py-3.5">Role</th>
                  <th className="px-4 py-3.5">Department</th>
                  <th className="px-4 py-3.5">MFA Status</th>
                  <th className="px-4 py-3.5">Method</th>
                  <th className="px-4 py-3.5">Last Verified</th>
                  <th className="px-4 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-900/50 transition-colors">
                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-full object-cover border border-slate-700" />
                        <div>
                          <div className="font-semibold text-white">{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-slate-200">
                      {u.role}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                        {u.department}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap">
                      <StatusBadge status={u.mfaStatus} size="sm" />
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-cyan-400">
                      {u.mfaMethod}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                      {u.lastActive}
                    </td>

                    <td className="px-4 py-3.5 whitespace-nowrap text-right">
                      {u.mfaStatus !== 'enforced' && (
                        <button
                          onClick={() => requireMFAForUser(u.id)}
                          className="px-2.5 py-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs transition-colors shadow-md shadow-cyan-950/40"
                        >
                          Require MFA
                        </button>
                      )}
                      {u.mfaStatus === 'enforced' && (
                        <span className="text-[11px] text-cyan-400 font-mono">Enforced ✓</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
