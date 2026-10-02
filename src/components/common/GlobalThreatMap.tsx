import React, { useState } from 'react';
import { Globe, ShieldCheck, ShieldAlert, Radio, Activity, Lock, ArrowUpRight, Zap } from 'lucide-react';

interface GatewayNode {
  id: string;
  name: string;
  country: string;
  x: number; // percentage in SVG coordinate space
  y: number;
  ip: string;
  latency: string;
  activeTunnels: number;
  threatStatus: 'nominal' | 'elevated' | 'under_attack';
  cipher: string;
  throughput: string;
}

export const GlobalThreatMap: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GatewayNode | null>(null);
  const [filterMode, setFilterMode] = useState<'all' | 'tunnels' | 'threats'>('all');

  const nodes: GatewayNode[] = [
    {
      id: 'gw-delhi',
      name: 'New Delhi Edge ZTNA',
      country: 'India',
      x: 64,
      y: 45,
      ip: '14.139.245.1',
      latency: '14ms',
      activeTunnels: 124,
      threatStatus: 'nominal',
      cipher: 'ChaCha20-Poly1305 (Post-Quantum)',
      throughput: '4.8 Gbps',
    },
    {
      id: 'gw-mumbai',
      name: 'Mumbai Finance Vault',
      country: 'India',
      x: 62,
      y: 50,
      ip: '115.112.89.1',
      latency: '18ms',
      activeTunnels: 88,
      threatStatus: 'nominal',
      cipher: 'AES-256-GCM (Hardware TPM)',
      throughput: '6.2 Gbps',
    },
    {
      id: 'gw-bengaluru',
      name: 'Bengaluru Cloud Mesh',
      country: 'India',
      x: 63,
      y: 55,
      ip: '49.207.180.1',
      latency: '12ms',
      activeTunnels: 96,
      threatStatus: 'nominal',
      cipher: 'WireGuard mTLS v1.3',
      throughput: '7.1 Gbps',
    },
    {
      id: 'gw-singapore',
      name: 'Singapore APAC Hub',
      country: 'Singapore',
      x: 72,
      y: 60,
      ip: '103.252.200.1',
      latency: '32ms',
      activeTunnels: 64,
      threatStatus: 'nominal',
      cipher: 'AES-256-GCM',
      throughput: '3.9 Gbps',
    },
    {
      id: 'gw-london',
      name: 'London EMEA Core',
      country: 'United Kingdom',
      x: 46,
      y: 32,
      ip: '82.165.197.1',
      latency: '115ms',
      activeTunnels: 42,
      threatStatus: 'elevated',
      cipher: 'WireGuard mTLS v1.3',
      throughput: '2.4 Gbps',
    },
    {
      id: 'gw-frankfurt',
      name: 'Frankfurt Perimeter Guard',
      country: 'Germany',
      x: 50,
      y: 34,
      ip: '185.220.101.1',
      latency: '128ms',
      activeTunnels: 38,
      threatStatus: 'under_attack',
      cipher: 'AES-256-GCM',
      throughput: '1.9 Gbps',
    },
    {
      id: 'gw-useast',
      name: 'US-East AWS Core Plane',
      country: 'United States',
      x: 25,
      y: 38,
      ip: '54.210.88.1',
      latency: '184ms',
      activeTunnels: 110,
      threatStatus: 'nominal',
      cipher: 'ChaCha20-Poly1305',
      throughput: '8.4 Gbps',
    },
    {
      id: 'gw-tokyo',
      name: 'Tokyo North Edge',
      country: 'Japan',
      x: 84,
      y: 42,
      ip: '133.242.18.1',
      latency: '74ms',
      activeTunnels: 51,
      threatStatus: 'nominal',
      cipher: 'AES-256-GCM',
      throughput: '3.1 Gbps',
    },
  ];

  // Inter-gateway connection paths
  const connections = [
    { from: 'gw-delhi', to: 'gw-mumbai', status: 'secure' },
    { from: 'gw-mumbai', to: 'gw-bengaluru', status: 'secure' },
    { from: 'gw-delhi', to: 'gw-singapore', status: 'secure' },
    { from: 'gw-singapore', to: 'gw-tokyo', status: 'secure' },
    { from: 'gw-delhi', to: 'gw-london', status: 'secure' },
    { from: 'gw-london', to: 'gw-frankfurt', status: 'attack' },
    { from: 'gw-london', to: 'gw-useast', status: 'secure' },
    { from: 'gw-useast', to: 'gw-tokyo', status: 'secure' },
  ];

  const getNode = (id: string) => nodes.find((n) => n.id === id);

  return (
    <div className="p-6 rounded-2xl bg-[#0d131f]/95 border border-slate-800 relative overflow-hidden shadow-2xl">
      {/* Background cyber grid & glow */}
      <div className="absolute top-0 right-1/4 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 relative z-10">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Globe className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white tracking-wide">
              Global Zero Trust Mesh & Telemetry Map
            </h3>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              ● 8 Edge PoPs Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time cryptographic mTLS WireGuard overlay routing across corporate microsegments.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterMode === 'all'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All PoPs (8)
          </button>
          <button
            onClick={() => setFilterMode('tunnels')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterMode === 'tunnels'
                ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Active Tunnels (563)
          </button>
          <button
            onClick={() => setFilterMode('threats')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors ${
              filterMode === 'threats'
                ? 'bg-rose-500/20 text-rose-300 font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Threat Vectors (2)
          </button>
        </div>
      </div>

      {/* SVG Interactive Map Canvas */}
      <div className="relative w-full h-80 sm:h-96 rounded-xl bg-slate-950/80 border border-slate-800/80 overflow-hidden">
        {/* World Grid Background Pattern */}
        <svg className="w-full h-full" viewBox="0 0 1000 500" preserveAspectRatio="none">
          <defs>
            <pattern id="gridPattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
            </pattern>
            {/* Pulsing Gradient for Secure Line */}
            <linearGradient id="secureLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#22d3ee" stopOpacity="1" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.8" />
            </linearGradient>
            {/* Attack Line Gradient */}
            <linearGradient id="attackLine" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* Grid Background */}
          <rect width="1000" height="500" fill="url(#gridPattern)" />

          {/* Continent contours simulated with subtle vector paths */}
          <path
            d="M 150 180 Q 250 120 320 200 Q 280 340 180 320 Z M 440 140 Q 560 110 580 220 Q 510 320 450 260 Z M 600 160 Q 750 120 860 220 Q 820 360 670 330 Z"
            fill="none"
            stroke="rgba(56, 189, 248, 0.08)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          {/* Connections between PoPs */}
          {connections.map((c, i) => {
            const fromNode = getNode(c.from);
            const toNode = getNode(c.to);
            if (!fromNode || !toNode) return null;

            const x1 = fromNode.x * 10;
            const y1 = fromNode.y * 5;
            const x2 = toNode.x * 10;
            const y2 = toNode.y * 5;
            const midX = (x1 + x2) / 2;
            const midY = (y1 + y2) / 2 - 30; // arch curve

            const isAttack = c.status === 'attack';
            if (filterMode === 'threats' && !isAttack) return null;

            return (
              <g key={i}>
                {/* Curved Connection Path */}
                <path
                  d={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                  fill="none"
                  stroke={isAttack ? 'url(#attackLine)' : 'url(#secureLine)'}
                  strokeWidth={isAttack ? 2.5 : 1.8}
                  strokeDasharray={isAttack ? '6 4' : 'none'}
                  className="transition-all duration-300"
                />

                {/* Animated Packet Pulse Circle */}
                <circle r={isAttack ? 3.5 : 2.5} fill={isAttack ? '#f43f5e' : '#22d3ee'}>
                  <animateMotion
                    path={`M ${x1} ${y1} Q ${midX} ${midY} ${x2} ${y2}`}
                    dur={`${2.5 + (i % 3)}s`}
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            );
          })}

          {/* Gateway Node Markers */}
          {nodes.map((node) => {
            const cx = node.x * 10;
            const cy = node.y * 5;
            const isSelected = selectedNode?.id === node.id;
            const isThreat = node.threatStatus === 'under_attack';

            return (
              <g
                key={node.id}
                className="cursor-pointer group"
                onClick={() => setSelectedNode(node)}
              >
                {/* Outer Ping Ring */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isThreat ? 14 : 10}
                  fill={isThreat ? 'rgba(244, 63, 94, 0.25)' : 'rgba(6, 182, 212, 0.2)'}
                  className="animate-pulse"
                />

                {/* Core Dot */}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isSelected ? 6 : 4.5}
                  fill={isThreat ? '#f43f5e' : '#06b6d4'}
                  stroke="#ffffff"
                  strokeWidth={1.5}
                  className="transition-all duration-200"
                />

                {/* Node Label */}
                <text
                  x={cx + 10}
                  y={cy + 4}
                  fill={isSelected ? '#22d3ee' : '#cbd5e1'}
                  fontSize="10"
                  fontFamily="monospace"
                  fontWeight="600"
                >
                  {node.name.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Forensics Floating Popover */}
        {selectedNode && (
          <div className="absolute top-4 right-4 z-20 w-72 p-4 rounded-xl bg-[#0b1019]/95 border border-cyan-500/40 shadow-2xl backdrop-blur-md space-y-2.5 text-xs animate-in fade-in duration-200">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-white">
                <Radio className="w-3.5 h-3.5 text-cyan-400" />
                <span>{selectedNode.name}</span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-500 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5 text-[11px] font-mono">
              <div className="flex justify-between">
                <span className="text-slate-400">Gateway IP:</span>
                <span className="text-cyan-300">{selectedNode.ip}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Transit Latency:</span>
                <span className="text-emerald-400 font-bold">{selectedNode.latency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Active ZTNA Tunnels:</span>
                <span className="text-white font-bold">{selectedNode.activeTunnels}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Perimeter Cipher:</span>
                <span className="text-slate-200 truncate max-w-[130px]" title={selectedNode.cipher}>
                  {selectedNode.cipher}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Bandwidth:</span>
                <span className="text-cyan-400">{selectedNode.throughput}</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <span
                className={`px-2 py-0.5 rounded font-mono uppercase ${
                  selectedNode.threatStatus === 'under_attack'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                    : selectedNode.threatStatus === 'elevated'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}
              >
                {selectedNode.threatStatus.replace(/_/g, ' ')}
              </span>
              <span className="text-slate-500 font-mono">Zero Trust Verified</span>
            </div>
          </div>
        )}
      </div>

      {/* Real-time telemetry summary footer */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-3 border-t border-slate-800/80">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-[10px] text-slate-400">Active WireGuard Tunnels</div>
            <div className="font-mono font-bold text-white">563 Endpoints</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" />
          <div>
            <div className="text-[10px] text-slate-400">Network Throughput</div>
            <div className="font-mono font-bold text-emerald-400">34.7 Gbps Aggregate</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <div>
            <div className="text-[10px] text-slate-400">Anomalies Isolated</div>
            <div className="font-mono font-bold text-amber-300">143 Attacks Blocked</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <div>
            <div className="text-[10px] text-slate-400">Mean Auth Latency</div>
            <div className="font-mono font-bold text-cyan-300">16.4 ms</div>
          </div>
        </div>
      </div>
    </div>
  );
};
