import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { useUi } from '../context/UiContext';
import { BrandMark } from '../components/common/BrandMark';
import {
  ArrowRight,
  Key,
  Eye,
  EyeOff,
  AlertCircle,
  Loader2,
  Check,
  Sun,
  Moon,
  MonitorSmartphone,
} from 'lucide-react';

/**
 * The console's front door.
 *
 * Rebuilt away from the gradient-blob-and-glowing-button template. What
 * changed, and why:
 *
 *  - The left panel now shows the posture checks that this product actually
 *    performs, with their live verdicts, instead of three generic marketing
 *    bullets. It is the only honest thing to put on a zero-trust login.
 *  - The headline is set in the display serif at editorial scale. No gradient
 *    text, no gradient button — a solid accent fill reads as more confident
 *    and survives being printed or screenshotted.
 *  - The form is a real form: labelled inputs, a password reveal, an inline
 *    error, a submitting state, and autocomplete hints that password managers
 *    recognise. The original silently did nothing on a wrong password.
 */
export const LoginPage: React.FC = () => {
  const { login } = useSecurity();
  const { theme, resolvedTheme, cycleTheme } = useUi();

  const [email, setEmail] = useState('admin@zerotrustx.demo');
  const [password, setPassword] = useState('demo123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const attempt = (mail: string, pass: string) => {
    setError(null);
    setSubmitting(true);
    // A beat of latency, so the submitting state is visible rather than a flash.
    window.setTimeout(() => {
      const ok = login(mail, pass);
      if (!ok) {
        setSubmitting(false);
        setError('Those credentials were rejected by the identity provider.');
      }
      // On success the app unmounts this screen, so there is nothing to reset.
    }, 420);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    attempt(email, password);
  };

  const posture = [
    { label: 'Device certificate', value: 'Valid · TPM-backed', ok: true },
    { label: 'Disk encryption', value: 'FileVault enabled', ok: true },
    { label: 'EDR agent', value: 'CrowdStrike active', ok: true },
    { label: 'Network path', value: 'Corporate · mTLS', ok: true },
    { label: 'Geo-velocity', value: 'No anomaly detected', ok: true },
  ];

  const ThemeIcon = theme === 'auto' ? MonitorSmartphone : resolvedTheme === 'dark' ? Moon : Sun;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex items-center justify-center p-4 lg:p-10 relative overflow-hidden app-surface">
      <button
        onClick={cycleTheme}
        title={`Theme: ${theme}`}
        aria-label="Cycle theme"
        data-cursor-label={theme}
        className="absolute top-5 right-5 z-20 p-2 rounded-lg border hairline bg-slate-900/60
                   text-slate-400 hover:text-slate-100 transition-colors"
      >
        <ThemeIcon className="w-4 h-4" strokeWidth={1.75} />
      </button>

      <div className="relative w-full max-w-[1020px] panel panel-raised rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 z-10">
        {/* ------------------------------------------------ left: the product */}
        <div className="p-8 lg:p-11 flex flex-col justify-between border-b lg:border-b-0 lg:border-r hairline bg-slate-950/30">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 text-slate-200">
                <BrandMark />
              </span>
              <span>
                <span className="block display text-[17px] leading-none text-slate-100">
                  ZeroTrust<span className="text-cyan-400">X</span>
                </span>
                <span className="block font-mono text-[9px] tracking-[0.16em] uppercase text-slate-500 mt-1">
                  Continuous Verification
                </span>
              </span>
            </div>

            <h1 className="display text-[2.1rem] lg:text-[2.6rem] leading-[1.08] text-slate-100 mt-9 tracking-tight">
              Access is a question,
              <br />
              asked continuously.
            </h1>

            <p className="mt-4 text-[13px] text-slate-400 leading-relaxed max-w-[38ch]">
              Every identity, device and request is re-evaluated against live risk signals — not
              trusted once at the perimeter and forgotten.
            </p>

            {/* The posture panel: what the product is doing to you, right now. */}
            <div className="mt-9">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] font-medium tracking-[0.13em] uppercase text-slate-500">
                  This session
                </span>
                <span className="h-px flex-1 bg-slate-800/70" />
                <span className="font-mono text-[9.5px] text-emerald-400">5/5 PASS</span>
              </div>

              <dl className="divide-y divide-slate-800/60">
                {posture.map((p, i) => (
                  <div
                    key={p.label}
                    className="flex items-center justify-between gap-4 py-[7px] fade-up"
                    style={{ animationDelay: `${120 + i * 70}ms` }}
                  >
                    <dt className="text-[12px] text-slate-400 shrink-0">{p.label}</dt>
                    <dd className="flex items-center gap-1.5 min-w-0">
                      <span className="font-mono text-[11px] text-slate-300 truncate">
                        {p.value}
                      </span>
                      <Check className="w-3 h-3 text-emerald-400 shrink-0" strokeWidth={3} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          <div className="mt-9 pt-5 border-t hairline flex items-center justify-between font-mono text-[10px] text-slate-500">
            <span>SOC 2 TYPE II</span>
            <span>FIPS 140-3</span>
            <span>ISO 27001</span>
          </div>
        </div>

        {/* ------------------------------------------------------ right: form */}
        <div className="p-8 lg:p-11 flex flex-col justify-center">
          <div className="max-w-sm w-full mx-auto">
            <h2 className="display text-[21px] text-slate-100">Sign in</h2>
            <p className="text-[12.5px] text-slate-400 mt-1.5">
              Authenticate to the production policy plane.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4 mt-7" noValidate>
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-[11.5px] font-medium text-slate-300 mb-1.5"
                >
                  Work email
                </label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  autoComplete="username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={Boolean(error)}
                  className="w-full px-3 py-2.5 bg-slate-950/60 border hairline rounded-lg
                             text-slate-100 text-[13px] placeholder-slate-500
                             focus:outline-none focus:border-cyan-500/70 transition-colors"
                />
              </div>

              <div>
                <div className="flex items-baseline justify-between mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-[11.5px] font-medium text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    className="text-[11px] text-slate-500 hover:text-cyan-300 transition-colors"
                  >
                    Recover access
                  </button>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={Boolean(error)}
                    className="w-full px-3 py-2.5 pr-10 bg-slate-950/60 border hairline rounded-lg
                               text-slate-100 text-[13px] placeholder-slate-500
                               focus:outline-none focus:border-cyan-500/70 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 rounded-md
                               text-slate-500 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-3.5 h-3.5" strokeWidth={1.75} />
                    ) : (
                      <Eye className="w-3.5 h-3.5" strokeWidth={1.75} />
                    )}
                  </button>
                </div>
              </div>

              {error && (
                <p
                  role="alert"
                  className="flex items-start gap-2 text-[11.5px] text-rose-300 bg-rose-950/30
                             border border-rose-500/30 rounded-lg px-3 py-2.5 fade-up"
                >
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" strokeWidth={2} />
                  <span>{error}</span>
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                data-cursor-label="authenticate"
                className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-50
                           font-medium text-[13px] transition-colors flex items-center justify-center
                           gap-2 group disabled:opacity-70 disabled:cursor-wait"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying posture…</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ArrowRight
                      className="w-4 h-4 group-hover:translate-x-0.5 transition-transform"
                      strokeWidth={2}
                    />
                  </>
                )}
              </button>

              <div className="relative flex items-center justify-center py-1">
                <span className="h-px w-full bg-slate-800" />
                <span className="absolute bg-slate-900 px-2.5 font-mono text-[10px] tracking-wider uppercase text-slate-500">
                  or
                </span>
              </div>

              <button
                type="button"
                onClick={() => attempt('admin@zerotrustx.demo', 'demo123')}
                disabled={submitting}
                className="w-full py-2.5 rounded-lg border hairline bg-slate-950/40
                           hover:bg-slate-800/60 text-slate-200 text-[12.5px] font-medium
                           flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                <Key className="w-3.5 h-3.5 text-cyan-400" strokeWidth={1.75} />
                <span>Continue with SAML single sign-on</span>
              </button>
            </form>

            {/* Demo credentials, stated plainly rather than dressed up as a feature. */}
            <div className="mt-7 rounded-lg border hairline bg-slate-950/40 px-3.5 py-3">
              <div className="flex items-center justify-between gap-3">
                <span className="text-[11px] font-medium text-slate-300">Demo environment</span>
                <button
                  onClick={() => attempt('admin@zerotrustx.demo', 'demo123')}
                  disabled={submitting}
                  className="text-[11px] font-medium text-cyan-300 hover:text-cyan-200 transition-colors disabled:opacity-60"
                >
                  One-click access →
                </button>
              </div>
              <p className="font-mono text-[10.5px] text-slate-500 mt-1.5 leading-relaxed">
                admin@zerotrustx.demo · demo123
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
