import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

const BOOT_STEPS = [
  'Initializing zero-trust kernel',
  'Verifying device posture',
  'Evaluating identity risk signals',
  'Enforcing least-privilege policies',
  'Establishing encrypted micro-tunnels',
  'All checks passed',
];

const TOTAL_MS = 4200;

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [progress, setProgress] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const total = reduce ? 1200 : TOTAL_MS;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const t = Math.min((now - start) / total, 1);
      // ease-in-out so the bar feels like real work happening
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setProgress(Math.round(eased * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        setLeaving(true);
        window.setTimeout(onFinish, 900);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onFinish]);

  const stepIndex = Math.min(
    BOOT_STEPS.length - 1,
    Math.floor((progress / 100) * BOOT_STEPS.length)
  );
  const done = progress >= 100;

  return (
    <AnimatePresence>
      <motion.div
        key="splash"
        className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-[#050810]"
        initial={{ opacity: 1 }}
        animate={leaving ? { opacity: 0, scale: 1.08 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        aria-label="Loading ZeroTrustX AI"
        role="status"
      >
        {/* Ambient background */}
        <div className="absolute inset-0 cyber-grid opacity-70" />
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(60% 50% at 50% 42%, rgba(56,120,255,0.20), transparent 70%), radial-gradient(40% 35% at 62% 58%, rgba(168,85,247,0.14), transparent 70%)',
          }}
        />
        <div className="splash-vignette absolute inset-0" />

        {/* Rising data particles */}
        {Array.from({ length: 22 }).map((_, i) => (
          <span
            key={i}
            className="splash-particle"
            style={{
              left: `${(i * 4.7 + 3) % 100}%`,
              animationDelay: `${(i % 7) * 0.45}s`,
              animationDuration: `${3.2 + (i % 5) * 0.7}s`,
              background: i % 3 === 0 ? '#a855f7' : '#38bdf8',
            }}
          />
        ))}

        <div className="relative z-10 flex w-full max-w-xl flex-col items-center px-6">
          {/* Shield + rings */}
          <div className="relative flex h-[300px] w-[300px] items-center justify-center sm:h-[340px] sm:w-[340px]">
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox="0 0 340 340"
              fill="none"
              aria-hidden
            >
              <defs>
                <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <circle cx="170" cy="170" r="160" stroke="rgba(56,189,248,0.12)" strokeWidth="1" />
              <g className="splash-spin-slow" style={{ transformOrigin: '170px 170px' }}>
                <circle
                  cx="170" cy="170" r="150"
                  stroke="url(#ringGrad)" strokeWidth="1.5"
                  strokeDasharray="2 10" strokeLinecap="round"
                />
              </g>
              <g className="splash-spin-rev" style={{ transformOrigin: '170px 170px' }}>
                <circle
                  cx="170" cy="170" r="132"
                  stroke="url(#ringGrad)" strokeWidth="2"
                  strokeDasharray="90 60 20 60" strokeLinecap="round" opacity="0.8"
                />
              </g>
              {/* Orbiting nodes */}
              <g className="splash-spin-slow" style={{ transformOrigin: '170px 170px', animationDuration: '6s' }}>
                <circle cx="170" cy="10" r="4" fill="#22d3ee" />
                <circle cx="170" cy="10" r="9" fill="#22d3ee" opacity="0.25" />
              </g>
              <g className="splash-spin-rev" style={{ transformOrigin: '170px 170px', animationDuration: '9s' }}>
                <circle cx="170" cy="38" r="3.5" fill="#a855f7" />
                <circle cx="170" cy="38" r="8" fill="#a855f7" opacity="0.25" />
              </g>
            </svg>

            {/* Pulse shockwaves */}
            <span className="splash-shock" />
            <span className="splash-shock" style={{ animationDelay: '1.1s' }} />

            {/* Shield logo with scan beam */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.6, filter: 'blur(14px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            >
              <img
                src="/logo-shield.png"
                alt="ZeroTrustX AI shield"
                draggable={false}
                className={`splash-shield h-[210px] w-auto select-none sm:h-[240px] ${done ? 'splash-shield-done' : ''}`}
                
              />
              <div className="splash-scan" />
            </motion.div>
          </div>

          {/* Wordmark */}
          <motion.div
            className="-mt-2 w-full max-w-[440px]"
            initial={{ opacity: 0, y: 14, letterSpacing: '0.2em' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '0em' }}
            transition={{ delay: 0.7, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <img
              src="/logo-wordmark.png"
              alt="ZeroTrustX AI"
              draggable={false}
              className="splash-wordmark w-full select-none"
              
            />
          </motion.div>

          {/* Progress */}
          <motion.div
            className="mt-5 w-full max-w-[380px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.6 }}
          >
            <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg,#22d3ee,#3b82f6,#a855f7)',
                  boxShadow: '0 0 14px rgba(59,130,246,0.9)',
                }}
              />
              <div className="splash-bar-shine" />
            </div>

            <div className="mt-3 flex items-center justify-between font-mono text-[11px] text-slate-400">
              <div className="flex min-w-0 items-center gap-2">
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${
                    done ? 'bg-emerald-400' : 'animate-pulse bg-cyan-400'
                  }`}
                />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={stepIndex}
                    className={`truncate ${done ? 'text-emerald-300' : ''}`}
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 6 }}
                    transition={{ duration: 0.2 }}
                  >
                    {BOOT_STEPS[stepIndex]}
                    {!done && <span className="splash-dots" />}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="ml-3 tabular-nums text-slate-300">
                {String(progress).padStart(3, '0')}%
              </span>
            </div>
          </motion.div>

          <motion.p
            className="mt-7 text-center text-[11px] tracking-[0.32em] text-slate-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            TRUST NOTHING. VERIFY EVERYTHING.
          </motion.p>
        </div>

        {/* Access verified flash */}
        {done && <div className="splash-flash" />}
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
