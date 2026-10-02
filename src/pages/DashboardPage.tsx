import React, { useState } from 'react';
import { useSecurity } from '../context/SecurityContext';
import { StatCard } from '../components/common/StatCard';
import { ZeroTrustScoreGauge } from '../components/common/ZeroTrustScoreGauge';
import { StatusBadge, RiskScoreBadge } from '../components/common/StatusBadge';
import { GlobalThreatMap } from '../components/common/GlobalThreatMap';
import {
  ShieldCheck,
  Laptop,
  Radio,
  ShieldBan,
  AlertTriangle,
  RotateCw,
  Calendar,
  Filter,
  ArrowRight,
  TrendingUp,
  Activity,
  Layers,
  MapPin,
  Clock,
  Sparkles,
  Zap,
  Flame,
} from 'lucide-react';
import {
  AreaChart,
  Area,
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

interface DashboardPageProps {
  onNavigate: (page: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const {
    securityEvents,
    accessRequests,
    users,
    devices,
    activeSessions,
    setIsSimulatorOpen,
    setIsArchitectureModalOpen,
    setIsLiveSessionsModalOpen,
    triggerAttackScenario,
    addToast,
  } = useSecurity();

  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [activityFilter, setActivityFilter] = useState<'all' | 'allowed' | 'denied' | 'challenged'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      addToast('Telemetry Synchronized', 'Real-time telemetry gathered from all Zero Trust edge proxies', 'success');
    }, 600);
  };

  // Access activity chart data
  const activityData = [
    { time: '00:00', allowed: 120, denied: 12, challenged: 18 },
    { time: '03:00', allowed: 65, denied: 8, challenged: 9 },
    { time: '06:00', allowed: 140, denied: 19, challenged: 22 },
    { time: '09:00', allowed: 480, denied: 34, challenged: 45 },
    { time: '12:00', allowed: 620, denied: 28, challenged: 39 },
    { time: '15:00', allowed: 580, denied: 31, challenged: 42 },
    { time: '18:00', allowed: 390, denied: 22, challenged: 26 },
    { time: '21:00', allowed: 240, denied: 15, challenged: 17 },
  ];

  // Risk Distribution Donut Data
  const riskDonutData = [
    { name: 'Low Risk', value: 72, color: '#10b981' },
    { name: 'Medium Risk', value: 19, color: '#f59e0b' },
    { name: 'High Risk', value: 7, color: '#f97316' },
    { name: 'Critical', value: 2, color: '#f43f5e' },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Security Overview</h1>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              SOC Command Center
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Monitor identity, device trust and access activity across your environment.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Time Range Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setTimeRange('24h')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                timeRange === '24h' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Last 24 Hours
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                timeRange === '7d' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 rounded-lg font-medium transition-colors ${
                timeRange === '30d' ? 'bg-cyan-500/20 text-cyan-300 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Last 30 Days
            </button>
          </div>

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all flex items-center gap-1.5 text-xs"
            title="Refresh Security Telemetry"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* 5 Major KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Protected Identities"
          value="2,481"
          change="+8.4%"
          changeType="positive"
          icon={ShieldCheck}
          subtext="vs last month"
          color="cyan"
          sparklineData={[30, 35, 42, 50, 58, 64, 75, 88]}
        />
        <StatCard
          title="Trusted Devices"
          value="1,842"
          change="+5.2%"
          changeType="positive"
          icon={Laptop}
          subtext="hardware verified"
          color="emerald"
          sparklineData={[25, 29, 36, 44, 52, 60, 72, 82]}
        />
        <StatCard
          title="Active Sessions"
          value="327"
          change="Real-time"
          changeType="neutral"
          icon={Radio}
          subtext="continuous auth"
          color="indigo"
          sparklineData={[40, 48, 52, 45, 62, 70, 65, 74]}
        />
        <StatCard
          title="Blocked Requests"
          value="143"
          change="+12.8%"
          changeType="negative"
          icon={ShieldBan}
          subtext="threats isolated"
          color="rose"
          sparklineData={[12, 18, 25, 30, 28, 45, 52, 60]}
        />
        <StatCard
          title="High Risk Events"
          value="18"
          change="-4.1%"
          changeType="positive"
          icon={AlertTriangle}
          subtext="mitigated by SOC"
          color="amber"
          sparklineData={[35, 32, 28, 25, 22, 20, 19, 18]}
        />
      </div>

      {/* Main Grid: Security Score + Quick Simulator CTA */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Zero Trust Score Component (Large) */}
        <div className="lg:col-span-8">
          <ZeroTrustScoreGauge score={87} />
        </div>

        {/* Quick ZTNA Quick Actions & Posture Card */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-[#0d131f]/90 border border-slate-800 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold text-cyan-400 uppercase tracking-widest flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Fast Enforcement
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                ACTIVE
              </span>
            </div>

            <h3 className="text-base font-bold text-white">Continuous Policy Enforcement</h3>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              Every request is authenticated dynamically using contextual device posture, identity trust, and behavioral heuristics.
            </p>

            <div className="mt-4 space-y-2 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Pending Access Requests</span>
                <span className="font-mono font-bold text-cyan-400">
                  {accessRequests.filter((r) => r.status === 'pending').length}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <span className="text-slate-300">Quarantined Endpoints</span>
                <span className="font-mono font-bold text-rose-400">
                  {devices.filter((d) => d.trustStatus === 'blocked').length}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 space-y-2">
            <button
              onClick={() => setIsSimulatorOpen(true)}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white font-semibold text-xs transition-all shadow-lg shadow-cyan-900/25 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch Policy Simulator</span>
            </button>
            <button
              onClick={() => setIsArchitectureModalOpen(true)}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Inspect 5-Gate Architecture</span>
            </button>
            <button
              onClick={() => onNavigate('requests')}
              className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-medium transition-colors flex items-center justify-center gap-1"
            >
              <span>Review Pending Requests</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Global Threat & Mesh Map */}
      <GlobalThreatMap />

      {/* Real-time Attack Simulation Test Bar */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-400" />
            <span className="font-bold text-white text-xs">Live Defense Reflex Simulator</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-rose-500/10 text-rose-300 border border-rose-500/20">
              Interactive Test
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Trigger real-time simulated attacks against the perimeter to test continuous Zero Trust detection reflexes.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => triggerAttackScenario('credential_stuffing')}
            className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>1. Tor Credential Stuffing</span>
          </button>
          <button
            onClick={() => triggerAttackScenario('impossible_travel')}
            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>2. Impossible Travel</span>
          </button>
          <button
            onClick={() => triggerAttackScenario('malware_outbreak')}
            className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>3. Malware Auto-Quarantine</span>
          </button>
        </div>
      </div>

      {/* Charts Row: Access Activity & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Access Activity Graph */}
        <div className="lg:col-span-8 p-6 rounded-xl bg-[#0d131f]/90 border border-slate-800">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Access Activity</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Volume of allowed, denied, and step-up authentication challenges.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs">
              {(['all', 'allowed', 'denied', 'challenged'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActivityFilter(filter)}
                  className={`px-2.5 py-1 rounded font-medium capitalize transition-colors ${
                    activityFilter === filter
                      ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorAllowed" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorDenied" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="colorChallenged" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="time" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0b1019',
                    borderColor: '#334155',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#f8fafc',
                  }}
                />
                {(activityFilter === 'all' || activityFilter === 'allowed') && (
                  <Area
                    type="monotone"
                    dataKey="allowed"
                    stroke="#10b981"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorAllowed)"
                    name="Allowed Requests"
                  />
                )}
                {(activityFilter === 'all' || activityFilter === 'challenged') && (
                  <Area
                    type="monotone"
                    dataKey="challenged"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorChallenged)"
                    name="Step-Up MFA"
                  />
                )}
                {(activityFilter === 'all' || activityFilter === 'denied') && (
                  <Area
                    type="monotone"
                    dataKey="denied"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorDenied)"
                    name="Denied Requests"
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution Donut */}
        <div className="lg:col-span-4 p-6 rounded-xl bg-[#0d131f]/90 border border-slate-800 flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Risk Distribution</h3>
            <p className="text-xs text-slate-400 mt-0.5">Categorization across active enterprise sessions.</p>

            <div className="h-52 w-full mt-3 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDonutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {riskDonutData.map((entry, index) => (
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
                    formatter={(val) => [`${val}%`, 'Sessions']}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Breakdown legend */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs">
            {riskDonutData.map((d) => (
              <div key={d.name} className="flex items-center gap-2 p-1.5 rounded-lg bg-slate-900/40">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-300 font-medium text-[11px]">{d.name}</span>
                <span className="font-mono text-white font-bold ml-auto">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Security Events Feed */}
      <div className="p-6 rounded-xl bg-[#0d131f]/90 border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
            </span>
            <h3 className="text-base font-bold text-white">Live Security Events</h3>
            <span className="text-xs text-slate-500 font-mono hidden sm:inline">(Real-time SOC stream)</span>
          </div>

          <button
            onClick={() => onNavigate('events')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            <span>View All Events</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="divide-y divide-slate-800/80">
          {securityEvents.slice(0, 5).map((evt, idx) => (
            <div
              key={`${evt.id}-${idx}`}
              onClick={() => onNavigate('events')}
              className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-900/40 px-2 rounded-lg transition-colors cursor-pointer group"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5">
                  <StatusBadge status={evt.severity} size="sm" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                      {evt.eventType}
                    </span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-300">{evt.user}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{evt.details}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs text-slate-400 shrink-0 self-end md:self-auto font-mono">
                <span className="flex items-center gap-1 text-slate-400">
                  <MapPin className="w-3 h-3 text-slate-500" />
                  {evt.location}
                </span>
                <span className="text-slate-500">{evt.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
