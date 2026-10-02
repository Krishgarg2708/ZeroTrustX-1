import React, { useState, useMemo } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { User, RiskLevel } from '../types';
import { StatusBadge, RiskScoreBadge } from '../components/common/StatusBadge';
import { UserDetailsDrawer } from './UserDetailsDrawer';
import { Modal } from '../components/common/Modal';
import {
  Users as UsersIcon,
  Search,
  UserPlus,
  Shield,
  KeyRound,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Lock,
  MoreVertical,
} from 'lucide-react';

export const UsersPage: React.FC = () => {
  const { users, addUser, toggleUserStatus, requireMFAForUser } = useSecurity();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);

  // New User Form State
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Security Analyst');
  const [newUserDept, setNewUserDept] = useState<'SOC' | 'Finance' | 'DevOps' | 'Engineering' | 'Executive' | 'HR' | 'Legal'>('SOC');
  const [newUserPrivileged, setNewUserPrivileged] = useState(false);

  const filteredUsers = useMemo(() => {
    return users.filter((u) => {
      const matchesSearch =
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.employeeId.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesDept = departmentFilter === 'all' || u.department === departmentFilter;

      return matchesSearch && matchesDept;
    });
  }, [users, searchQuery, departmentFilter]);

  const handleRowClick = (u: User) => {
    setSelectedUser(u);
    setIsDrawerOpen(true);
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    addUser({
      name: newUserName,
      email: newUserEmail,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
      department: newUserDept,
      role: newUserRole,
      employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'active',
      mfaStatus: 'enabled',
      mfaMethod: 'Authenticator App',
      deviceTrust: 'trusted',
      riskLevel: 'low',
      riskScore: 15,
      lastActive: 'Just now',
      location: 'New Delhi, India',
      ipAddress: '14.139.245.10',
      assignedResources: ['Corporate Portal', 'Slack Enterprise'],
      privileged: newUserPrivileged,
    });

    setIsAddUserOpen(false);
    setNewUserName('');
    setNewUserEmail('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header and Add User Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Identity Management</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              IAM Directory
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enterprise identities governed by continuous adaptive authentication and least-privilege RBAC.
          </p>
        </div>

        <button
          onClick={() => setIsAddUserOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-cyan-900/30 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Add User Identity</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Total Users</span>
          <div className="text-2xl font-bold text-white font-mono mt-1">2,481</div>
          <span className="text-[10px] text-emerald-400 font-mono">+14 onboarded this week</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Active Users</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">2,392</div>
          <span className="text-[10px] text-slate-400 font-mono">96.4% actively verified</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Privileged Users</span>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">48</div>
          <span className="text-[10px] text-amber-300/80 font-mono">Mandatory FIDO2 Keys</span>
        </div>
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Suspended Users</span>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">12</div>
          <span className="text-[10px] text-rose-300/80 font-mono">Quarantined / Exited</span>
        </div>
      </div>

      {/* Search and Department Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3 bg-slate-900/60 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, employee ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
          <span className="text-xs text-slate-400 shrink-0 mr-1">Dept:</span>
          {['all', 'SOC', 'Finance', 'DevOps', 'Engineering', 'HR'].map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                departmentFilter === dept
                  ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              {dept === 'all' ? 'All' : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="rounded-xl border border-slate-800 bg-[#0d131f]/90 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/80 text-slate-400 uppercase tracking-wider text-[11px] font-mono border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">User</th>
                <th className="px-4 py-3.5">Role</th>
                <th className="px-4 py-3.5">Department</th>
                <th className="px-4 py-3.5">MFA Posture</th>
                <th className="px-4 py-3.5">Device Trust</th>
                <th className="px-4 py-3.5">Risk Score</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Last Active</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-300">
              {filteredUsers.map((u, idx) => (
                <tr
                  key={`${u.id}-${idx}`}
                  onClick={() => handleRowClick(u)}
                  className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
                >
                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img
                        src={u.avatar}
                        alt={u.name}
                        className="w-8 h-8 rounded-full object-cover border border-slate-700"
                      />
                      <div>
                        <div className="font-semibold text-white group-hover:text-cyan-300 flex items-center gap-1.5">
                          <span>{u.name}</span>
                          {u.privileged && (
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" title="Privileged User" />
                          )}
                        </div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-200">
                    {u.role}
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]">
                      {u.department}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={u.mfaStatus} size="sm" />
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{u.mfaMethod}</div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={u.deviceTrust} size="sm" />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <RiskScoreBadge score={u.riskScore} />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <StatusBadge status={u.status} size="sm" />
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap font-mono text-slate-400 text-[11px]">
                    {u.lastActive}
                  </td>

                  <td
                    className="px-4 py-3.5 whitespace-nowrap text-right"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => toggleUserStatus(u.id)}
                        title={u.status === 'active' ? 'Suspend User' : 'Activate User'}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          u.status === 'active'
                            ? 'text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border-slate-700'
                            : 'text-emerald-400 hover:bg-emerald-500/10 border-emerald-500/30'
                        }`}
                      >
                        <Lock className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleRowClick(u)}
                        className="px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-cyan-400 border border-slate-700 text-xs font-medium"
                      >
                        Inspect
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Details Drawer */}
      <UserDetailsDrawer
        user={selectedUser}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />

      {/* Add User Modal */}
      <Modal
        isOpen={isAddUserOpen}
        onClose={() => setIsAddUserOpen(false)}
        title="Provision Enterprise Identity"
        subtitle="Create an IAM identity subjected to continuous Zero Trust verification"
        maxWidth="md"
      >
        <form onSubmit={handleCreateUser} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Vikram Singhania"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Enterprise Email</label>
            <input
              type="email"
              required
              placeholder="e.g. vikram@zerotrustx.demo"
              value={newUserEmail}
              onChange={(e) => setNewUserEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Department</label>
              <select
                value={newUserDept}
                onChange={(e) => setNewUserDept(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
                <option value="SOC">SOC</option>
                <option value="Finance">Finance</option>
                <option value="DevOps">DevOps</option>
                <option value="Engineering">Engineering</option>
                <option value="HR">HR</option>
                <option value="Executive">Executive</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Role Title</label>
              <input
                type="text"
                required
                placeholder="e.g. Security Analyst"
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
              >
              </input>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between p-3 rounded-lg bg-slate-900/60 border border-slate-800">
            <div>
              <span className="font-semibold text-white block">Privileged Access Account</span>
              <span className="text-[11px] text-slate-400">Requires mandatory hardware key for all sessions</span>
            </div>
            <input
              type="checkbox"
              checked={newUserPrivileged}
              onChange={(e) => setNewUserPrivileged(e.target.checked)}
              className="w-4 h-4 accent-cyan-500 rounded"
            />
          </div>

          <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsAddUserOpen(false)}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-950/40"
            >
              Provision Identity
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
