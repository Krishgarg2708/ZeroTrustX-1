import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { ShieldCheck, Lock, ArrowRight, Key, Sparkles, Cpu, CheckCircle2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useSecurity();
  const [email, setEmail] = useState('admin@zerotrustx.demo');
  const [password, setPassword] = useState('demo123');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  const handleQuickDemo = () => {
    login('admin@zerotrustx.demo', 'demo123');
  };

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 flex items-center justify-center p-4 lg:p-12 relative overflow-hidden cyber-grid">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main split container */}
      <div className="relative w-full max-w-5xl rounded-3xl bg-[#0b1019]/90 border border-slate-800/80 shadow-2xl shadow-cyan-950/30 overflow-hidden grid grid-cols-1 lg:grid-cols-12 backdrop-blur-xl z-10">
        {/* Left Side: Branding & Value Prop */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-800/80 bg-gradient-to-br from-slate-900/60 to-[#070b12]/90">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="relative w-11 h-11 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-700 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.4)]">
                <ShieldCheck className="w-6 h-6 text-white" />
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2 border-[#0b1019] animate-pulse" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-extrabold tracking-wider text-xl text-white font-mono">ZERO</span>
                  <span className="font-extrabold text-xl text-cyan-400 font-mono">TRUSTX</span>
                </div>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-mono font-medium">
                  Zero Trust Security Platform
                </div>
              </div>
            </div>

            {/* Headline */}
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Access without trust. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">
                Security without compromise.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-4 text-xs lg:text-sm text-slate-400 leading-relaxed">
              Continuously verify every identity, device posture, and access request across your cloud and on-premises perimeter. Never trust. Always verify.
            </p>

            {/* Highlights */}
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Continuous risk-based authentication & telemetry</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Hardware root-of-trust (FIDO2 / WebAuthn & TPM)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Dynamic micro-segmentation & zero standing privilege</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>SOC 2 Type II Certified</span>
            <span>FIPS 140-3 Compliant</span>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="lg:col-span-6 p-8 lg:p-12 flex flex-col justify-between bg-[#080d16]/70">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Sign In to Console</h2>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                mTLS Handshake Active
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Identity Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zerotrustx.demo"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
                    Password
                  </label>
                  <span className="text-[11px] text-cyan-400 hover:underline cursor-pointer">
                    Forgot Key?
                  </span>
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-white text-xs placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-950/50 flex items-center justify-center gap-2 group"
              >
                <span>Authenticate Session</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="relative py-2 flex items-center justify-center">
                <div className="border-t border-slate-800 w-full" />
                <span className="bg-[#080d16] px-3 text-[11px] text-slate-500 uppercase font-mono">
                  OR
                </span>
              </div>

              {/* SSO Button */}
              <button
                type="button"
                onClick={handleQuickDemo}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
              >
                <Key className="w-4 h-4 text-cyan-400" />
                <span>Sign in with Enterprise SAML / Okta SSO</span>
              </button>
            </form>
          </div>

          {/* Quick Demo Access Box */}
          <div className="mt-8 p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Demo Credentials
              </span>
              <button
                onClick={handleQuickDemo}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 text-[11px] font-semibold transition-colors"
              >
                Instant 1-Click Access →
              </button>
            </div>
            <div className="text-[11px] text-slate-400 font-mono space-y-0.5">
              <div>Email: <span className="text-slate-200">admin@zerotrustx.demo</span></div>
              <div>Password: <span className="text-slate-200">demo123</span></div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <span className="text-[11px] text-slate-500 flex items-center justify-center gap-1.5">
              <Lock className="w-3 h-3 text-emerald-400" /> Protected by Zero Trust Continuous Security
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
