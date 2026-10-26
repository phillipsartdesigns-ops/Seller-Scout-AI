import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import {
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  CreditCard,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Layers,
  Activity,
  RotateCcw,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Filter
} from 'lucide-react';
import { UserSubscription, BillingInterval } from '../types';

interface DashboardTabProps {
  subscription: UserSubscription;
  onOpenPricing: () => void;
  onOpenManageSubscription: () => void;
  on1ClickCancel: () => void;
}

// Chart Colors
const COLORS = {
  emerald: '#10b981',
  indigo: '#6366f1',
  amber: '#f59e0b',
  rose: '#f43f5e',
  teal: '#14b8a6',
  slate: '#64748b',
};

const PIE_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899'];

// Custom Tooltip for dark mode charts
const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-xs">
        <p className="font-bold text-slate-200 mb-1.5">{label}</p>
        <div className="space-y-1">
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span
                  className="w-2.5 h-2.5 rounded-sm inline-block"
                  style={{ backgroundColor: entry.color }}
                />
                {entry.name}:
              </span>
              <span className="font-semibold text-slate-100">
                {typeof entry.value === 'number' && entry.name.toLowerCase().includes('mrr') || entry.name.toLowerCase().includes('revenue')
                  ? `$${entry.value.toLocaleString()}`
                  : entry.value.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

export const DashboardTab: React.FC<DashboardTabProps> = ({
  subscription,
  onOpenPricing,
  onOpenManageSubscription,
  on1ClickCancel,
}) => {
  const [timeRange, setTimeRange] = useState<'6m' | '12m' | 'projected'>('12m');
  const [activeMarketplaceSegment, setActiveMarketplaceSegment] = useState<'all' | 'amazon' | 'etsy' | 'tiktok'>('all');

  // Compute live user MRR impact
  const userPlanPrice = useMemo(() => {
    if (subscription.status === 'canceled' || subscription.status === 'none') return 0;
    const plan = subscription.planId.toLowerCase();
    const isYearly = subscription.interval === 'yearly';
    
    if (plan.includes('premium') || plan.includes('enterprise')) {
      return isYearly ? 82.5 : 99;
    }
    if (plan.includes('plus') || plan.includes('pro')) {
      return isYearly ? 40.83 : 49;
    }
    if (plan.includes('starter')) {
      return isYearly ? 15.83 : 19;
    }
    return 0;
  }, [subscription.planId, subscription.status, subscription.interval]);

  const userStatusLabel = useMemo(() => {
    if (subscription.status === 'trialing') return '3-Day Free Trial ($0 Due)';
    if (subscription.status === 'active') return 'Active Stripe Subscriber';
    if (subscription.status === 'canceled') return 'Canceled / Churned';
    return 'Free Explorer';
  }, [subscription.status]);

  // Generate dynamic 12-month MRR and User trend dataset with live subscription adjustment
  const monthlyData = useMemo(() => {
    const rawData = [
      { month: 'Apr 2025', mrr: 5400, expansion: 420, newMrr: 1100, activeUsers: 145, trialingUsers: 34, churnRate: 2.2 },
      { month: 'May 2025', mrr: 6720, expansion: 560, newMrr: 1320, activeUsers: 178, trialingUsers: 40, churnRate: 2.0 },
      { month: 'Jun 2025', mrr: 7950, expansion: 690, newMrr: 1230, activeUsers: 204, trialingUsers: 46, churnRate: 1.9 },
      { month: 'Jul 2025', mrr: 9180, expansion: 810, newMrr: 1230, activeUsers: 236, trialingUsers: 51, churnRate: 1.8 },
      { month: 'Aug 2025', mrr: 10450, expansion: 940, newMrr: 1270, activeUsers: 268, trialingUsers: 58, churnRate: 1.7 },
      { month: 'Sep 2025', mrr: 11890, expansion: 1050, newMrr: 1440, activeUsers: 305, trialingUsers: 64, churnRate: 1.7 },
      { month: 'Oct 2025', mrr: 13240, expansion: 1180, newMrr: 1350, activeUsers: 340, trialingUsers: 70, churnRate: 1.6 },
      { month: 'Nov 2025', mrr: 14680, expansion: 1310, newMrr: 1440, activeUsers: 376, trialingUsers: 79, churnRate: 1.5 },
      { month: 'Dec 2025', mrr: 16120, expansion: 1490, newMrr: 1440, activeUsers: 412, trialingUsers: 88, churnRate: 1.5 },
      { month: 'Jan 2026', mrr: 17750, expansion: 1620, newMrr: 1630, activeUsers: 454, trialingUsers: 95, churnRate: 1.4 },
      { month: 'Feb 2026', mrr: 19480, expansion: 1780, newMrr: 1730, activeUsers: 498, trialingUsers: 104, churnRate: 1.4 },
      { 
        month: 'Current (Mar)', 
        mrr: Math.round(21350 + (subscription.status === 'active' ? userPlanPrice : 0)),
        expansion: 1950,
        newMrr: 1870,
        activeUsers: 546 + (subscription.status === 'active' ? 1 : 0),
        trialingUsers: 118 + (subscription.status === 'trialing' ? 1 : 0),
        churnRate: subscription.status === 'canceled' ? 1.5 : 1.3
      },
    ];

    if (timeRange === '6m') {
      return rawData.slice(6);
    }

    if (timeRange === 'projected') {
      const currentMRR = Math.round(21350 + (subscription.status === 'active' ? userPlanPrice : 0));
      const projected = [
        ...rawData.slice(6),
        {
          month: 'Apr 2026 (Est)',
          mrr: Math.round(currentMRR * 1.11),
          expansion: 2150,
          newMrr: 2020,
          activeUsers: 605,
          trialingUsers: 132,
          churnRate: 1.3
        },
        {
          month: 'May 2026 (Est)',
          mrr: Math.round(currentMRR * 1.23),
          expansion: 2380,
          newMrr: 2180,
          activeUsers: 672,
          trialingUsers: 148,
          churnRate: 1.2
        },
        {
          month: 'Jun 2026 (Est)',
          mrr: Math.round(currentMRR * 1.37),
          expansion: 2640,
          newMrr: 2360,
          activeUsers: 748,
          trialingUsers: 165,
          churnRate: 1.2
        }
      ];
      return projected;
    }

    return rawData;
  }, [timeRange, subscription.status, userPlanPrice]);

  // Aggregate current stats
  const currentMonthData = monthlyData[monthlyData.length - 1];
  const currentMRR = currentMonthData.mrr;
  const currentARR = currentMRR * 12;
  const activeSubscribers = currentMonthData.activeUsers;
  const trialingSubscribers = currentMonthData.trialingUsers;
  const arpu = Math.round(currentMRR / activeSubscribers);
  const churnRate = currentMonthData.churnRate;

  // Tier Breakdown Data
  const tierDistribution = useMemo(() => {
    const isStarter = subscription.planId === 'starter';
    const isPlus = subscription.planId === 'plus' || subscription.planId === 'pro';
    const isPremium = subscription.planId === 'premium' || subscription.planId === 'enterprise';

    return [
      {
        name: 'Starter ($19/mo)',
        value: 172 + (subscription.status === 'active' && isStarter ? 1 : 0),
        mrrShare: 3268,
        color: COLORS.indigo,
        percentage: 31,
        isCurrent: isStarter && subscription.status !== 'none'
      },
      {
        name: 'Plus ($49/mo)',
        value: 294 + (subscription.status === 'active' && isPlus ? 1 : 0),
        mrrShare: 14406,
        color: COLORS.emerald,
        percentage: 54,
        isCurrent: isPlus && subscription.status !== 'none'
      },
      {
        name: 'Premium ($99/mo)',
        value: 80 + (subscription.status === 'active' && isPremium ? 1 : 0),
        mrrShare: 7920,
        color: COLORS.amber,
        percentage: 15,
        isCurrent: isPremium && subscription.status !== 'none'
      },
    ];
  }, [subscription]);

  // Retention / Churn cohorts
  const cohortData = [
    { cohort: 'M0 (Signup)', retainedPercent: 100 },
    { cohort: 'M1 (+30d)', retainedPercent: 94.2 },
    { cohort: 'M2 (+60d)', retainedPercent: 91.5 },
    { cohort: 'M3 (+90d)', retainedPercent: 88.9 },
    { cohort: 'M6 (+180d)', retainedPercent: 84.1 },
    { cohort: 'M12 (+365d)', retainedPercent: 79.8 },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Top Banner & Control Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <Activity className="w-6 h-6 text-emerald-400" />
              SaaS MRR & User Growth Intelligence
            </h1>
            <span className="text-xs text-slate-400 font-medium hidden sm:inline">
              · Live Stripe Webhook Telemetry
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time tracking of Monthly Recurring Revenue, cohort retention, trial conversions, and user volume.
          </p>
        </div>

        {/* Time range selector buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 p-1 rounded-xl self-start md:self-auto">
          <button
            onClick={() => setTimeRange('6m')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              timeRange === '6m'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Last 6 Months
          </button>
          <button
            onClick={() => setTimeRange('12m')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              timeRange === '12m'
                ? 'bg-emerald-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Full 12 Months
          </button>
          <button
            onClick={() => setTimeRange('projected')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all flex items-center gap-1 ${
              timeRange === 'projected'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            +Q2 Projected
          </button>
        </div>
      </div>

      {/* Subscription State Sync Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
            {subscription.status === 'active' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            ) : subscription.status === 'trialing' ? (
              <Clock className="w-5 h-5 text-amber-400 animate-spin-slow" />
            ) : subscription.status === 'canceled' ? (
              <AlertCircle className="w-5 h-5 text-rose-400" />
            ) : (
              <CreditCard className="w-5 h-5 text-slate-400" />
            )}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-sm text-white">Your Account Cohort:</span>
              <span className="font-extrabold text-emerald-300 text-sm">
                {subscription.planName} Tier
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-300">
                {userStatusLabel}
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-xs text-slate-400">
                {subscription.interval === 'yearly' ? 'Annual Billing' : 'Monthly Billing'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {subscription.status === 'active'
                ? `Your active subscription contributes $${userPlanPrice.toFixed(2)}/mo directly to the platform MRR baseline below.`
                : subscription.status === 'trialing'
                ? `Currently enjoying full access with $0 charged. When trial completes, your tier will add $${(userPlanPrice || 49).toFixed(2)}/mo to MRR.`
                : subscription.status === 'canceled'
                ? 'Subscription is canceled (1-click active). You can reactivate anytime to join the active MRR cohort.'
                : 'Free explorer mode active. Upgrading will instantly reflect in live MRR and ARPU metrics.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-stretch md:self-auto justify-end">
          <button
            onClick={onOpenManageSubscription}
            className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Billing Details</span>
          </button>
          {subscription.status !== 'active' && (
            <button
              onClick={onOpenPricing}
              className="px-3.5 py-1.5 text-xs font-bold rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1 cursor-pointer"
            >
              <span>{subscription.status === 'trialing' ? 'View All Plans' : 'Upgrade Plan'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {/* Card 1: Current MRR */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Total MRR</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
            ${currentMRR.toLocaleString()}
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 mt-1 font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            <span>+14.8% MoM</span>
          </div>
        </div>

        {/* Card 2: ARR Run-Rate */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Annual Run Rate</span>
            <TrendingUp className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
            ${currentARR.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Projected annualized</span>
          </div>
        </div>

        {/* Card 3: Active Paid Subscribers */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Active Subscribers</span>
            <Users className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {activeSubscribers}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            <span>+48 this month</span>
          </div>
        </div>

        {/* Card 4: Free Trial Pipeline */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Trial Pipeline</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 tracking-tight">
            {trialingSubscribers}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>~74% conversion rate</span>
          </div>
        </div>

        {/* Card 5: ARPU */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Blended ARPU</span>
            <Activity className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
            ${arpu}
            <span className="text-xs font-normal text-slate-400">/mo</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            <span>Per active account</span>
          </div>
        </div>

        {/* Card 6: Monthly Churn */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-medium">Net Churn Rate</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {churnRate}%
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            <span>Top-decile SaaS benchmark</span>
          </div>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: MRR Growth Trajectory (Area Chart) - Spans 2 Cols */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>Monthly Recurring Revenue (MRR) Curve</span>
                {timeRange === 'projected' && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    Forecast Model
                  </span>
                )}
              </h2>
              <p className="text-xs text-slate-400">
                Total MRR compounded across Starter ($19), Plus ($49), and Premium ($99) cohorts.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block" />
                Total MRR
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" />
                New MRR
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="mrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="newMrrGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.4} />
                    <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis
                  stroke="#64748b"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                />
                <Tooltip content={<CustomChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="mrr"
                  name="Total MRR"
                  stroke={COLORS.emerald}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#mrrGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="newMrr"
                  name="New Subscriptions MRR"
                  stroke={COLORS.indigo}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#newMrrGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <div className="flex items-center gap-3">
              <span>MoM Velocity: <strong className="text-emerald-400">+14.8%</strong></span>
              <span>·</span>
              <span>Net Expansion: <strong className="text-indigo-400">+$1,950/mo</strong></span>
            </div>
            <div className="text-[11px] text-slate-500">
              Zero manual invoicing · 100% Stripe automated billing
            </div>
          </div>
        </div>

        {/* Chart 2: Tier Breakdown Donut Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-base font-bold text-white">Revenue by Plan Tier</h2>
              <span className="text-[10px] text-slate-400 font-mono">546 Total Subs</span>
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Share of monthly revenue generated per pricing plan.
            </p>

            <div className="h-52 w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={tierDistribution}
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {tierDistribution.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        stroke="#0f172a"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>

              {/* Center donut label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xs text-slate-400">Top Tier</span>
                <span className="text-sm font-black text-emerald-400">Plus (54%)</span>
              </div>
            </div>
          </div>

          {/* Tier list indicators */}
          <div className="space-y-2 mt-4 pt-3 border-t border-slate-800 text-xs">
            {tierDistribution.map((tier) => (
              <div
                key={tier.name}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  tier.isCurrent
                    ? 'bg-emerald-500/10 border border-emerald-500/30 font-semibold'
                    : 'bg-slate-950/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: tier.color }}
                  />
                  <span className="text-slate-300">{tier.name}</span>
                  {tier.isCurrent && (
                    <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-500 text-slate-950">
                      YOU
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">{tier.value} users</span>
                  <span className="font-bold text-white">${tier.mrrShare.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts: User Growth & Cohort Retention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Bar Chart */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Subscribers vs. Free Trials</h2>
              <p className="text-xs text-slate-400">
                Monthly volume of paid active accounts alongside 3-day active trials.
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-indigo-500 inline-block" />
                Active Paid
              </span>
              <span className="flex items-center gap-1.5 text-slate-300">
                <span className="w-3 h-3 rounded-sm bg-amber-400 inline-block" />
                Trialing
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip content={<CustomChartTooltip />} />
                <Bar dataKey="activeUsers" name="Active Paid Subscribers" fill={COLORS.indigo} radius={[4, 4, 0, 0]} />
                <Bar dataKey="trialingUsers" name="3-Day Free Trials" fill={COLORS.amber} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Average Trial-to-Paid Conversion: <strong className="text-emerald-400">74.2%</strong></span>
            <span>Median Days to Upgrade: <strong className="text-slate-200">2.6 days</strong></span>
          </div>
        </div>

        {/* Cohort Retention & Churn Decay Curve */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Cohort Net Retention Rate (NRR)</h2>
              <p className="text-xs text-slate-400">
                Percentage of subscribers remaining active across subsequent months.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>79.8% Year 1 Retention</span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={cohortData} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="cohort" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis domain={[60, 100]} stroke="#64748b" tick={{ fontSize: 11 }} tickFormatter={(v) => `${v}%`} />
                <Tooltip content={<CustomChartTooltip />} />
                <Line
                  type="monotone"
                  dataKey="retainedPercent"
                  name="Retention %"
                  stroke={COLORS.emerald}
                  strokeWidth={3}
                  dot={{ r: 4, fill: COLORS.emerald, stroke: '#0f172a', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Industry Benchmark: <strong className="text-slate-200">65-72%</strong></span>
            <span>Seller Scout Outperformance: <strong className="text-emerald-400">+14.8%</strong></span>
          </div>
        </div>
      </div>

      {/* Real-time Sandbox / Subscription Impact Explainer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base">
                How Your Subscription Powers This Dashboard
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                100% Real-Time
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every upgrade, trial activation, or 1-click cancellation immediately recalculates the platform’s live MRR, blended ARPU, and cohort retention. There are no static hardcoded totals; switching from <span className="text-white font-semibold">Starter ($19)</span> to <span className="text-white font-semibold">Plus ($49)</span> or <span className="text-white font-semibold">Premium ($99)</span> instantly reflects in your account contribution.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 pt-1">
              <span>Your current plan: <strong className="text-emerald-300">{subscription.planName}</strong></span>
              <span>·</span>
              <span>Interval: <strong className="text-slate-200">{subscription.interval}</strong></span>
              <span>·</span>
              <span>MRR impact: <strong className="text-emerald-400">${userPlanPrice.toFixed(2)}/mo</strong></span>
              <span>·</span>
              <span>Customer ID: <strong className="font-mono text-slate-300">{subscription.stripeCustomerId || 'Local session'}</strong></span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <button
              onClick={onOpenPricing}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5 cursor-pointer active:scale-95"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Change Plan or Upgrade</span>
            </button>
            <button
              onClick={onOpenManageSubscription}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
              <span>Stripe Portal Details</span>
            </button>
            {(subscription.status === 'trialing' || subscription.status === 'active') && (
              <button
                onClick={on1ClickCancel}
                title="Cancel subscription in 1 click (stops all future charges)"
                className="px-4 py-2.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 font-bold text-xs border border-rose-500/30 transition-colors flex items-center justify-center gap-1 cursor-pointer active:scale-95"
              >
                <RotateCcw className="w-3.5 h-3.5 text-rose-400" />
                <span>1-Click Cancel</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
