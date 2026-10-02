import React from 'react';
import { RoleDefinition } from '../types';
import { useSecurity } from '../context/SecurityContext';
import { Drawer } from '../components/common/Drawer';
import { StatusBadge } from '../components/common/StatusBadge';
import { KeyRound, ShieldAlert, Check, X } from 'lucide-react';

interface RolePermissionsDrawerProps {
  role: RoleDefinition | null;
  isOpen: boolean;
  onClose: () => void;
}

export const RolePermissionsDrawer: React.FC<RolePermissionsDrawerProps> = ({
  role,
  isOpen,
  onClose,
}) => {
  const { togglePermission } = useSecurity();

  if (!role) return null;

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={`${role.name} — Permissions Matrix`}
      subtitle={`Code: ${role.code} • ${role.usersCount} Active Users Assigned`}
      width="2xl"
    >
      <div className="space-y-6 text-xs">
        {/* Role Overview Box */}
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-cyan-400" />
              <span>{role.name} Entitlements</span>
            </h4>
            <StatusBadge status={role.riskLevel} size="sm" />
          </div>
          <p className="text-slate-400 leading-relaxed">{role.description}</p>
        </div>

        {/* Categories Matrix */}
        <div className="space-y-5">
          {role.categories.map((category) => (
            <div
              key={category.category}
              className="p-4 rounded-xl bg-slate-900/40 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-semibold text-slate-200 tracking-wider uppercase text-[11px]">
                  {category.category} Domain
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {category.permissions.length} Action Controls
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {category.permissions.map((perm) => (
                  <div
                    key={perm.id}
                    className="p-3 rounded-lg bg-slate-950 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <div className="font-semibold text-white">{perm.label}</div>
                      <div className="text-[10px] text-slate-500 font-mono">ID: {perm.id}</div>
                    </div>

                    {/* Permission Action Toggles */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {(['view', 'create', 'edit', 'delete', 'approve'] as const).map((action) => {
                        const isGranted = perm[action];
                        return (
                          <button
                            key={action}
                            onClick={() =>
                              togglePermission(role.id, category.category, perm.id, action)
                            }
                            className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-medium uppercase transition-all flex items-center gap-1 border ${
                              isGranted
                                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-[0_0_8px_rgba(6,182,212,0.2)]'
                                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-400'
                            }`}
                          >
                            {isGranted ? (
                              <Check className="w-3 h-3 text-cyan-400" />
                            ) : (
                              <X className="w-3 h-3 text-slate-600" />
                            )}
                            <span>{action}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Drawer>
  );
};
