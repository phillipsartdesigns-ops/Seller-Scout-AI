import React from 'react';
import { 
  Radar, 
  Sparkles, 
  CreditCard, 
  Settings, 
  CheckCircle2, 
  Clock, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Layers,
  FileText,
  TrendingUp,
  DollarSign,
  Plug,
  RotateCcw,
  Activity
} from 'lucide-react';
import { UserSubscription } from '../types';
import { StripeConfigResponse } from '../services/api';

interface HeaderProps {
  activeTab: 'scout' | 'digital' | 'listing' | 'integrations' | 'flip' | 'launch' | 'pricing' | 'dashboard';
  setActiveTab: (tab: 'scout' | 'digital' | 'listing' | 'integrations' | 'flip' | 'launch' | 'pricing' | 'dashboard') => void;
  subscription: UserSubscription;
  stripeConfig: StripeConfigResponse | null;
  onOpenManageSubscription: () => void;
  on1ClickCancel?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  subscription,
  stripeConfig,
  onOpenManageSubscription,
  on1ClickCancel,
}) => {
  const isTrialActive = subscription.status === 'trialing';
  const isPaidActive = subscription.status === 'active';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/80 backdrop-blur-md">
      {/* Top Banner Notice: Recurring Billing & Trial active indicator */}
      <div className="bg-gradient-to-r from-emerald-950/60 via-slate-900 to-indigo-950/60 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800/80 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <ShieldCheck className="w-3 h-3 mr-1 text-emerald-400" />
              Stripe Recurring Billing Protected
            </span>
            <span className="hidden sm:inline text-slate-400">
              Zero risk: All plans include a full 3-day free trial ($0 due today, cancel anytime).
            </span>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-slate-300">256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => setActiveTab('scout')}
          className="flex items-center gap-3 cursor-pointer group select-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform border border-emerald-400/30">
            <Radar className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                Seller Scout
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded bg-emerald-500 text-slate-950">
                AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 leading-none">Find What to Sell & Scale Fast</p>
          </div>
        </div>

        {/* Center Tabs */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('scout')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'scout'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Radar className="w-3.5 h-3.5" />
            Product Scout
          </button>

          <button
            onClick={() => setActiveTab('digital')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'digital'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
            <span>AI Digital Builder</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-extrabold bg-emerald-400 text-slate-950">
              $0 MOQ
            </span>
          </button>

          <button
            onClick={() => setActiveTab('listing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'listing'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Listing & TikTok Studio
          </button>

          <button
            onClick={() => setActiveTab('integrations')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'integrations'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Plug className="w-3.5 h-3.5 text-teal-300" />
            <span>Plugins & Channels</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-bold bg-indigo-500/30 text-indigo-200">
              Sync
            </span>
          </button>

          <button
            onClick={() => setActiveTab('flip')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'flip'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            Flip Estimator
          </button>

          <button
            onClick={() => setActiveTab('launch')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'launch'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            12-Step Launch Plan
          </button>

          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'dashboard'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>Dashboard</span>
            <span className="px-1 py-0.2 rounded text-[9px] font-extrabold bg-indigo-500/30 text-indigo-200">
              MRR
            </span>
          </button>

          <button
            onClick={() => setActiveTab('pricing')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeTab === 'pricing'
                ? 'bg-emerald-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            Plans & Pricing
          </button>
        </nav>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2">
          {/* Subscription status pill */}
          <button
            onClick={onOpenManageSubscription}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all cursor-pointer ${
              isTrialActive
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20'
                : isPaidActive
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/20'
                : 'bg-slate-900 border-slate-700 text-slate-300 hover:border-slate-600'
            }`}
            title="Click to view subscription details"
          >
            {isTrialActive ? (
              <>
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-spin-slow" />
                <span className="font-semibold">{subscription.planName} Trial</span>
                <span className="hidden md:inline text-amber-400/80 font-normal">($0 active)</span>
              </>
            ) : isPaidActive ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="font-semibold">{subscription.planName}</span>
                <span className="hidden md:inline text-emerald-400/80 font-normal">(Active)</span>
              </>
            ) : (
              <>
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>Free Explorer</span>
              </>
            )}
          </button>

          {/* High-Visibility 1-Click Cancel Button when trial or subscription is active */}
          {(isTrialActive || isPaidActive) && (
            <button
              onClick={on1ClickCancel || onOpenManageSubscription}
              title="Cancel your trial or recurring membership with 1 click (Zero fee, stops all billing)"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <RotateCcw className="w-3 h-3 text-rose-400" />
              <span>1-Click Cancel</span>
            </button>
          )}

          {/* Upgrade / Pricing CTA */}
          <button
            onClick={() => setActiveTab('pricing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all active:scale-95 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Pricing & Trials</span>
            <span className="sm:hidden">Plans</span>
          </button>
        </div>
      </div>

      {/* Mobile subnav */}
      <div className="flex md:hidden overflow-x-auto px-4 py-2 gap-1 border-t border-slate-800 bg-slate-950/90 no-scrollbar">
        <button
          onClick={() => setActiveTab('scout')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'scout' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Product Scout
        </button>
        <button
          onClick={() => setActiveTab('digital')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'digital' ? 'bg-indigo-600 text-white font-bold' : 'text-indigo-300'
          }`}
        >
          AI Digital Builder
        </button>
        <button
          onClick={() => setActiveTab('listing')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'listing' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Listing & TikTok
        </button>
        <button
          onClick={() => setActiveTab('integrations')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'integrations' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Plugins & Channels
        </button>
        <button
          onClick={() => setActiveTab('flip')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'flip' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Flip Estimator
        </button>
        <button
          onClick={() => setActiveTab('launch')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'launch' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          12 Steps
        </button>
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'dashboard' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Dashboard (MRR)
        </button>
        <button
          onClick={() => setActiveTab('pricing')}
          className={`px-3 py-1 text-xs rounded-md whitespace-nowrap ${
            activeTab === 'pricing' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400'
          }`}
        >
          Plans & Pricing
        </button>
      </div>
    </header>
  );
};
