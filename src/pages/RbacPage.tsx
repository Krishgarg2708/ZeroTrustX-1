import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { RoleDefinition } from '../types';
import { StatusBadge } from '../components/common/StatusBadge';
import { RolePermissionsDrawer } from './RolePermissionsDrawer';
import {
  KeyRound,
  Shield,
  Users,
  Layers,
  ArrowRight,
  Sliders,
  CheckCircle2,
  Lock,
} from 'lucide-react';

export const RbacPage: React.FC = () => {
  const { roles } = useSecurity();
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenRole = (role: RoleDefinition) => {
    setSelectedRole(role);
    setIsDrawerOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Role-Based Access Control</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              RBAC Governance
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enforce least-privilege principles by binding granular CRUD & approval capabilities to verified identities.
          </p>
        </div>
      </div>

      {/* Role Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roles.map((role, idx) => (
          <div
            key={`${role.id}-${idx}`}
            onClick={() => handleOpenRole(role)}
            className="p-5 rounded-xl bg-[#0d131f]/90 border border-slate-800 hover:border-cyan-500/40 transition-all duration-200 cursor-pointer group flex flex-col justify-between shadow-lg hover:shadow-cyan-950/20"
          >
            <div>
              {/* Card top */}
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 font-semibold uppercase tracking-wider">
                    {role.code}
                  </span>
                  <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors mt-0.5">
                    {role.name}
                  </h3>
                </div>
                <StatusBadge status={role.riskLevel} size="sm" />
              </div>

              <p className="text-xs text-slate-400 mt-3 leading-relaxed min-h-[36px]">
                {role.description}
              </p>

              {/* Metrics Grid */}
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-800/80">
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Users</span>
                  <span className="text-sm font-bold font-mono text-white mt-0.5 block">
                    {role.usersCount}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Perms</span>
                  <span className="text-sm font-bold font-mono text-cyan-400 mt-0.5 block">
                    {role.permissionsCount}
                  </span>
                </div>
                <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Targets</span>
                  <span className="text-sm font-bold font-mono text-slate-300 mt-0.5 block">
                    {role.resourcesCount}
                  </span>
                </div>
              </div>
            </div>

            {/* Card Action footer */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 group-hover:text-cyan-400 transition-colors">
              <span className="flex items-center gap-1.5 font-medium">
                <Sliders className="w-3.5 h-3.5" />
                <span>Configure Permissions Matrix</span>
              </span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>

      {/* Permissions Drawer */}
      <RolePermissionsDrawer
        role={selectedRole}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
