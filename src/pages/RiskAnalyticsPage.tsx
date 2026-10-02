import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import {
  BarChart3,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  ShieldAlert,
  Flame,
  Filter,
  MapPin,
  Clock,
  Layers,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

export const RiskAnalyticsPage: React.FC = () => {
  const [selectedDept, setSelectedDept] = useState('all');
  const [selectedTime, setSelectedTime] = useState<'7d' | '30d' | '90d'>('7d');

  // Trend data
  const trendData = [
    { date: 'Mon', score: 38, highEvents: 8, authRisk: 24 },
    { date: 'Tue', score: 42, highEvents: 12, authRisk: 28 },
    { date: 'Wed', score: 35, highEvents: 6, authRisk: 20 },
    { date: 'Thu', score: 54, highEvents: 18, authRisk: 42 },
    { date: 'Fri', score: 45, highEvents: 14, authRisk: 30 },
    { date: 'Sat', score: 28, highEvents: 4, authRisk: 16 },
    { date: 'Sun', score: 24, highEvents: 3, authRisk: 12 },
  ];

  // Category Bar Data
  const categoryData = [
    { category: 'Authentication', riskIndex: 32, max: 100, fill: '#06b6d4' },
    { category: 'Device Posture', riskIndex: 44, max: 100, fill: '#f59e0b' },
    { category: 'Geo Location', riskIndex: 26, max: 100, fill: '#10b981' },
    { category: 'Behavioral', riskIndex: 58, max: 100, fill: '#f97316' },
    { category: 'Privileged Access', riskIndex: 68, max: 100, fill: '#f43f5e' },
  ];

  // Risk Donut Data
  const vectorDonut = [
    { name: 'Credential Stuffing', value: 35, color: '#f43f5e' },
    { name: 'Unpatched OS/EDR', value: 28, color: '#f97316' },
    { name: 'Impossible Velocity', value: 22, color: '#f59e0b' },
    { name: 'Off-hours Anomaly', value: 15, color: '#06b6d4' },
  ];

  // Mock Heatmap: 7 days x 8 hours blocks
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'];

  const getHeatmapColor = (dIndex: number, hIndex: number) => {
    // Generate deterministic risk intensity
    const seed = (dIndex * 3 + hIndex * 5) % 10;
    if (seed > 7) return 'bg-rose-500/80 border-rose-400';
    if (seed > 5) return 'bg-orange-500/70 border-orange-400';
    if (seed > 3) return 'bg-amber-500/50 border-amber-400';
    if (seed > 1) return 'bg-cyan-500/30 border-cyan-400';
    return 'bg-slate-800/40 border-slate-700/50';
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Risk Analytics</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              Heuristic Engine
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time behavioral anomalies, device threat indicators, and identity risk heatmaps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Department Filter */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900">All Departments</option>
              <option value="SOC" className="bg-slate-900">SOC</option>
              <option value="Finance" className="bg-slate-900">Finance</option>
              <option value="DevOps" className="bg-slate-900">DevOps</option>
              <option value="Engineering" className="bg-slate-900">Engineering</option>
            </select>
          </div>

          {/* Time Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setSelectedTime('7d')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedTime === '7d' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              7D
            </button>
            <button
              onClick={() => setSelectedTime('30d')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedTime === '30d' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              30D
            </button>
            <button
              onClick={() => setSelectedTime('90d')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                selectedTime === '90d' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-white'
              }`}
            >
              90D
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Risk Vector Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Authentication Risk</span>
          <div className="text-2xl font-bold text-cyan-400 font-mono mt-1">24.2 / 100</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-1">
            <TrendingDown className="w-3 h-3" />
            <span>-3.4% from hardware FIDO2</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Device Posture Risk</span>
          <div className="text-2xl font-bold text-amber-400 font-mono mt-1">36.8 / 100</div>
          <div className="flex items-center gap-1 text-[10px] text-rose-400 font-mono mt-1">
            <TrendingUp className="w-3 h-3" />
            <span>+1.8% pending kernel patch</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Location / Geo Risk</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono mt-1">14.1 / 100</div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono mt-1">
            <span>Zero Tor leaks detected</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Privileged Escalation</span>
          <div className="text-2xl font-bold text-rose-400 font-mono mt-1">52.4 / 100</div>
          <div className="flex items-center gap-1 text-[10px] text-amber-300 font-mono mt-1">
            <span>3 JIT requests pending</span>
          </div>
        </div>
      </div>

      {/* Row 1: Line Chart (Risk Trend) & Category Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Trend Chart */}
        <div className="lg:col-span-7 p-5 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white">Aggregated Risk Score Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Rolling 7-day posture score vs critical threat telemetry.</p>
            </div>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              Low Baseline Risk
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1019',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#06b6d4"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#06b6d4' }}
                  name="Risk Index"
                />
                <Line
                  type="monotone"
                  dataKey="authRisk"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  name="Auth Friction"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Bar Chart */}
        <div className="lg:col-span-5 p-5 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-white">Risk Exposure by Vector</h3>
            <p className="text-xs text-slate-400 mt-0.5">Heuristic risk index (0 = zero risk, 100 = critical threat).</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={categoryData}
                layout="vertical"
                margin={{ top: 10, right: 20, left: 30, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis
                  type="category"
                  dataKey="category"
                  stroke="#94a3b8"
                  fontSize={11}
                  tickLine={false}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1019',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="riskIndex" radius={[0, 4, 4, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Row 2: Heatmap & Vector Donut */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Risk Heatmap Matrix */}
        <div className="lg:col-span-8 p-5 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-orange-400" />
                <span>Temporal Risk Heatmap (Day × Hour)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Distribution of high-risk login challenges and anomalous access attempts.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
              <span>Low</span>
              <span className="w-3 h-3 rounded bg-cyan-500/30" />
              <span className="w-3 h-3 rounded bg-amber-500/50" />
              <span className="w-3 h-3 rounded bg-orange-500/70" />
              <span className="w-3 h-3 rounded bg-rose-500/80" />
              <span>High</span>
            </div>
          </div>

          {/* Grid of Days x Hours */}
          <div className="overflow-x-auto">
            <div className="min-w-[480px]">
              {/* Hour Labels */}
              <div className="grid grid-cols-9 gap-1 text-[10px] text-slate-400 font-mono mb-1 text-center">
                <span className="text-left pl-1">Day</span>
                {hours.map((h) => (
                  <span key={h}>{h}</span>
                ))}
              </div>

              {/* Day rows */}
              <div className="space-y-1">
                {days.map((day, dIdx) => (
                  <div key={day} className="grid grid-cols-9 gap-1 items-center">
                    <span className="text-xs font-mono text-slate-300 font-medium">{day}</span>
                    {hours.map((h, hIdx) => (
                      <div
                        key={h}
                        className={`h-7 rounded border transition-all hover:scale-105 cursor-pointer ${getHeatmapColor(
                          dIdx,
                          hIdx
                        )}`}
                        title={`${day} at ${h}: Risk activity recorded`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Vector Donut Chart */}
        <div className="lg:col-span-4 p-5 rounded-xl bg-[#0d131f]/90 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Threat Vector Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Most prevalent risk anomalies.</p>

            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={vectorDonut}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={75}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {vectorDonut.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0b1019',
                      borderColor: '#334155',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    formatter={(val) => [`${val}%`, 'Incidents']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-slate-800 text-xs">
            {vectorDonut.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300 text-[11px]">{item.name}</span>
                </div>
                <span className="font-mono text-white font-bold">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
