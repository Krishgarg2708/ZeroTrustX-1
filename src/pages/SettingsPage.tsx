import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import {
  Settings,
  Shield,
  KeyRound,
  Laptop,
  Bell,
  Sliders,
  CheckCircle2,
  Lock,
  Globe,
  Radio,
  Cpu,
  RotateCcw,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToDemoDefaults, addToast } = useSecurity();

  const [activeTab, setActiveTab] = useState<'security' | 'auth' | 'org' | 'notifications'>('security');

  const [sessionTimeout, setSessionTimeout] = useState(settings.sessionTimeoutMinutes);
  const [minTrustScore, setMinTrustScore] = useState(settings.minDeviceTrustScore);
  const [riskThreshold, setRiskThreshold] = useState(settings.autoBlockRiskThreshold);
  const [continuousInterval, setContinuousInterval] = useState(settings.continuousAuthIntervalSeconds);
  const [requireHardwareMFA, setRequireHardwareMFA] = useState(settings.requireHardwareMFAForPrivileged);
  const [geoFencing, setGeoFencing] = useState(settings.geoFencingStrict);
  const [edrRequired, setEdrRequired] = useState(settings.edrRequiredForProd);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      sessionTimeoutMinutes: sessionTimeout,
      minDeviceTrustScore: minTrustScore,
      autoBlockRiskThreshold: riskThreshold,
      continuousAuthIntervalSeconds: continuousInterval,
      requireHardwareMFAForPrivileged: requireHardwareMFA,
      geoFencingStrict: geoFencing,
      edrRequiredForProd: edrRequired,
    });
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Platform Settings</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Zero Trust Policy Config
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Global security parameters, behavioral risk thresholds, and compliance baselines.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToDemoDefaults}
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-amber-500/10 text-amber-400 border border-slate-700 hover:border-amber-500/40 text-xs font-semibold flex items-center gap-2 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Defaults</span>
          </button>
        </div>
      </div>

      {/* Settings Navigation Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/60 rounded-xl border border-slate-800 w-fit">
        <button
          onClick={() => setActiveTab('security')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'security'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Security & Risk Engine</span>
        </button>

        <button
          onClick={() => setActiveTab('auth')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'auth'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Authentication & MFA</span>
        </button>

        <button
          onClick={() => setActiveTab('org')}
          className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'org'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>Organization & Gateway</span>
        </button>
      </div>

      {/* Main Settings Form */}
      <form onSubmit={handleSave} className="space-y-5">
        {activeTab === 'security' && (
          <div className="space-y-4">
            {/* Auto Block Threshold Slider Card */}
            <div className="p-5 rounded-2xl bg-[#0d131f]/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-cyan-400" />
                    <span>Automated Perimeter Block Threshold</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Any connection request with a contextual risk score exceeding this limit is denied immediately.
                  </p>
                </div>
                <span className="font-mono text-base font-bold text-rose-400 bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/30">
                  {riskThreshold} / 100
                </span>
              </div>
              <input
                type="range"
                min={40}
                max={90}
                value={riskThreshold}
                onChange={(e) => setRiskThreshold(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Strict (40)</span>
                <span>Balanced Recommended (65)</span>
                <span>Permissive (90)</span>
              </div>
            </div>

            {/* Device Trust Threshold Slider Card */}
            <div className="p-5 rounded-2xl bg-[#0d131f]/90 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Laptop className="w-4 h-4 text-cyan-400" />
                    <span>Minimum Device Compliance Score</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Endpoints falling below this score will be blocked from access to core enterprise micro-segments.
                  </p>
                </div>
                <span className="font-mono text-base font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/30">
                  {minTrustScore}%
                </span>
              </div>
              <input
                type="range"
                min={50}
                max={95}
                value={minTrustScore}
                onChange={(e) => setMinTrustScore(Number(e.target.value))}
                className="w-full accent-emerald-500"
              />
              <div className="flex justify-between text-[11px] text-slate-500 font-mono">
                <span>Baseline (50%)</span>
                <span>Zero Trust Target (70%)</span>
                <span>Military-Grade (95%)</span>
              </div>
            </div>

            {/* Continuous Auth Interval */}
            <div className="p-5 rounded-2xl bg-[#0d131f]/90 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Continuous Posture Verification Interval</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  How often active background sessions perform cryptographic mTLS and device checks.
                </p>
              </div>
              <select
                value={continuousInterval}
                onChange={(e) => setContinuousInterval(Number(e.target.value))}
                className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-cyan-400 focus:outline-none"
              >
                <option value={60}>Every 60 Seconds</option>
                <option value={300}>Every 5 Minutes (Standard)</option>
                <option value={900}>Every 15 Minutes</option>
              </select>
            </div>

            {/* Toggles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block text-xs">Mandatory EDR for Production</span>
                  <span className="text-[11px] text-slate-400">CrowdStrike/Defender must report green</span>
                </div>
                <input
                  type="checkbox"
                  checked={edrRequired}
                  onChange={(e) => setEdrRequired(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </div>

              <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-white block text-xs">Strict Geofencing Protection</span>
                  <span className="text-[11px] text-slate-400">Disallow unknown Tor/Proxy IP egress</span>
                </div>
                <input
                  type="checkbox"
                  checked={geoFencing}
                  onChange={(e) => setGeoFencing(e.target.checked)}
                  className="w-4 h-4 accent-cyan-500 rounded"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'auth' && (
          <div className="space-y-4">
            {/* Session Timeout */}
            <div className="p-5 rounded-2xl bg-[#0d131f]/90 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Maximum Session Lifetime</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Forces full re-authentication when token reaches maximum lifetime.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={15}
                  max={480}
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(Number(e.target.value))}
                  className="w-20 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs font-mono text-white text-center focus:outline-none"
                />
                <span className="text-xs text-slate-400">minutes</span>
              </div>
            </div>

            {/* Hardware Key Enforcement */}
            <div className="p-5 rounded-2xl bg-[#0d131f]/90 border border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">Require Hardware FIDO2 for Privileged Accounts</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enforces YubiKey / Google Titan / WebAuthn passkeys for SOC Analysts, DevOps, and Admins.
                </p>
              </div>
              <input
                type="checkbox"
                checked={requireHardwareMFA}
                onChange={(e) => setRequireHardwareMFA(e.target.checked)}
                className="w-4 h-4 accent-cyan-500 rounded"
              />
            </div>
          </div>
        )}

        {activeTab === 'org' && (
          <div className="p-5 rounded-2xl bg-[#0d131f]/90 border border-slate-800 space-y-4 text-xs">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Organization Realm</label>
              <input
                type="text"
                disabled
                value="ZEROTRUSTX-GLOBAL-ENTERPRISE.CORP"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-400 font-medium mb-1">Edge ZTNA Gateways</label>
              <div className="grid grid-cols-2 gap-2 text-slate-300 font-mono">
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  us-east.ztna.zerotrustx.net (Online)
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                  in-south.ztna.zerotrustx.net (Online)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Submit Save Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-950/40 flex items-center gap-2 transition-all"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Apply Global Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
