import React, { useState, useEffect } from 'react';
import { ZeroTrustPolicy } from '../types';
import { useSecurity } from '../context/SecurityContext';
import { Modal } from '../components/common/Modal';

interface PolicyEditorModalProps {
  policy: ZeroTrustPolicy | null;
  isOpen: boolean;
  onClose: () => void;
}

export const PolicyEditorModal: React.FC<PolicyEditorModalProps> = ({
  policy,
  isOpen,
  onClose,
}) => {
  const { addPolicy, updatePolicy } = useSecurity();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState(1);
  const [status, setStatus] = useState<'active' | 'draft' | 'disabled'>('active');
  const [roles, setRoles] = useState('Senior Financial Controller, Lead Security Analyst');
  const [resources, setResources] = useState('Finance Production Database (PostgreSQL)');
  const [minDeviceTrust, setMinDeviceTrust] = useState(80);
  const [requireMFA, setRequireMFA] = useState(true);
  const [maxRiskScore, setMaxRiskScore] = useState(40);
  const [requireEDR, setRequireEDR] = useState(true);
  const [actionOnMatch, setActionOnMatch] = useState<'ALLOW' | 'STEP_UP_MFA'>('ALLOW');
  const [actionOnFail, setActionOnFail] = useState<'DENY' | 'STEP_UP_MFA'>('DENY');

  useEffect(() => {
    if (policy) {
      setName(policy.name);
      setDescription(policy.description);
      setPriority(policy.priority);
      setStatus(policy.status);
      setRoles(policy.applicableRoles.join(', '));
      setResources(policy.resources.join(', '));
      setMinDeviceTrust(policy.conditions.minDeviceTrust);
      setRequireMFA(policy.conditions.requireMFA);
      setMaxRiskScore(policy.conditions.maxRiskScore);
      setRequireEDR(policy.conditions.requireEDR);
      setActionOnMatch(policy.actionOnMatch);
      setActionOnFail(policy.actionOnFail);
    } else {
      setName('');
      setDescription('');
      setPriority(3);
      setStatus('active');
      setRoles('Lead Security Analyst, Staff Infrastructure Engineer');
      setResources('Production Kubernetes Clusters');
      setMinDeviceTrust(80);
      setRequireMFA(true);
      setMaxRiskScore(40);
      setRequireEDR(true);
      setActionOnMatch('ALLOW');
      setActionOnFail('DENY');
    }
  }, [policy, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const applicableRoles = roles.split(',').map((r) => r.trim()).filter(Boolean);
    const targetResources = resources.split(',').map((r) => r.trim()).filter(Boolean);

    if (policy) {
      updatePolicy({
        ...policy,
        name,
        description,
        priority,
        status,
        applicableRoles,
        resources: targetResources,
        conditions: {
          minDeviceTrust,
          requireMFA,
          maxRiskScore,
          requireEDR,
        },
        actionOnMatch,
        actionOnFail,
      });
    } else {
      addPolicy({
        name,
        description,
        priority,
        status,
        applicableRoles,
        resources: targetResources,
        conditions: {
          minDeviceTrust,
          requireMFA,
          maxRiskScore,
          requireEDR,
        },
        actionOnMatch,
        actionOnFail,
        lastModified: new Date().toISOString().split('T')[0],
        modifiedBy: 'Admin',
        enforcedCount: 0,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={policy ? `Edit Policy — ${policy.id}` : 'Create Zero Trust Policy'}
      subtitle="Define cryptographic micro-segmentation rules evaluated at each access request"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div>
          <label className="block text-slate-300 font-medium mb-1">Policy Rule Name</label>
          <input
            type="text"
            required
            placeholder="e.g. Production Cluster Access Policy"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Description & Objective</label>
          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe what access this policy enforces..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 resize-none"
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Enforcement Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            >
              <option value="active">Active (Enforced)</option>
              <option value="draft">Draft (Audit Mode Only)</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Priority Order</label>
            <input
              type="number"
              min={1}
              max={99}
              value={priority}
              onChange={(e) => setPriority(Number(e.target.value))}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Applicable Roles (comma separated)</label>
          <input
            type="text"
            value={roles}
            onChange={(e) => setRoles(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        <div>
          <label className="block text-slate-300 font-medium mb-1">Target Resources (comma separated)</label>
          <input
            type="text"
            value={resources}
            onChange={(e) => setResources(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
          />
        </div>

        {/* Conditions Box */}
        <div className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <span className="font-semibold text-slate-300 uppercase tracking-wider block text-[11px]">
            Contextual Conditions (IF Logic)
          </span>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Min Device Trust Score</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={40}
                  max={95}
                  value={minDeviceTrust}
                  onChange={(e) => setMinDeviceTrust(Number(e.target.value))}
                  className="w-full accent-cyan-500"
                />
                <span className="font-mono text-cyan-400 font-bold">{minDeviceTrust}%</span>
              </div>
            </div>

            <div>
              <label className="block text-slate-400 text-[11px] mb-1">Max Tolerable Risk Score</label>
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={15}
                  max={75}
                  value={maxRiskScore}
                  onChange={(e) => setMaxRiskScore(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
                <span className="font-mono text-amber-400 font-bold">{maxRiskScore}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requireMFA}
                onChange={(e) => setRequireMFA(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
              <span className="text-slate-200">Mandate Hardware MFA</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={requireEDR}
                onChange={(e) => setRequireEDR(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
              <span className="text-slate-200">Mandate Active EDR Agent</span>
            </label>
          </div>
        </div>

        {/* Action On Match / Fail */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-slate-300 font-medium mb-1">THEN Action (When Matched)</label>
            <select
              value={actionOnMatch}
              onChange={(e) => setActionOnMatch(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-emerald-400 font-semibold focus:outline-none"
            >
              <option value="ALLOW">ALLOW ACCESS</option>
              <option value="STEP_UP_MFA">STEP-UP MFA FIRST</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">OTHERWISE (When Failed)</label>
            <select
              value={actionOnFail}
              onChange={(e) => setActionOnFail(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-rose-400 font-semibold focus:outline-none"
            >
              <option value="DENY">DENY ACCESS</option>
              <option value="STEP_UP_MFA">STEP-UP CHALLENGE</option>
            </select>
          </div>
        </div>

        <div className="pt-4 flex justify-end gap-2 border-t border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold shadow-lg shadow-cyan-950/40"
          >
            {policy ? 'Save Changes' : 'Create Policy Rule'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
