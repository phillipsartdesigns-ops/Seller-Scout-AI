import React, { useState } from 'react';
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Lock, 
  Clock, 
  HelpCircle, 
  ArrowRight,
  Star,
  Package,
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { SUBSCRIPTION_PLANS, ONE_TIME_UPGRADES } from '../data/plans';
import { BillingInterval, SubscriptionPlan, OneTimeUpgrade, UserSubscription } from '../types';
import { StripePricingTable } from './StripePricingTable';

interface PricingTabProps {
  subscription: UserSubscription;
  onInitiateCheckout: (plan: SubscriptionPlan, interval: BillingInterval) => void;
  onInitiateUpgrade: (upgrade: OneTimeUpgrade) => void;
  on1ClickCancel?: () => void;
}

export const PricingTab: React.FC<PricingTabProps> = ({
  subscription,
  onInitiateCheckout,
  onInitiateUpgrade,
  on1ClickCancel,
}) => {
  const [interval, setInterval] = useState<BillingInterval>('monthly');
  const [viewMode, setViewMode] = useState<'stripeTable' | 'featureGrid'>('featureGrid');
  const isSubActive = subscription.status === 'trialing' || subscription.status === 'active';

  return (
    <div className="space-y-10 pb-20 max-w-7xl mx-auto">
      {/* 1-Click Cancellation & Active Membership Card (Visible when subscribed or trialing) */}
      {isSubActive && (
        <div className="rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-rose-950/30 border border-slate-800 p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Active Plan: {subscription.planName}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${
                  subscription.status === 'trialing'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                }`}>
                  {subscription.status === 'trialing' ? '3-Day Trial Active' : 'Paid Active'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {subscription.trialEnd 
                  ? `Trial ends ${subscription.trialEnd}. No charges until trial period concludes.`
                  : `Recurring billing active via Stripe.`}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            {on1ClickCancel && (
              <button
                type="button"
                onClick={on1ClickCancel}
                className="w-full sm:w-auto px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-rose-950/40 transition-all active:scale-95 cursor-pointer"
                title="Cancel subscription & free trial in 1 click ($0 penalty, stops all renewal charges)"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>1-Click Cancel Subscription</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto pt-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Stripe Recurring Billing & 3-Day Free Trial Protection</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          Invest in High-Margin Products, <br />
          <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-300 bg-clip-text text-transparent">
            Not Costly Guesswork
          </span>
        </h1>
        <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
          Start risk-free with our 3-day trial. <strong>$0 due today.</strong> You won't be charged until your trial concludes, and you can cancel anytime with a single click.
        </p>

        {/* Prominent Monthly vs 1-Year (Annual) Subscription Switcher */}
        <div className="pt-4 flex flex-col items-center justify-center gap-3">
          <div className="inline-flex p-1.5 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl">
            <button
              type="button"
              onClick={() => setInterval('monthly')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                interval === 'monthly'
                  ? 'bg-slate-800 text-white shadow-md ring-1 ring-slate-600'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Monthly Subscription</span>
            </button>

            <button
              type="button"
              onClick={() => setInterval('yearly')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
                interval === 'yearly'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className={`w-3.5 h-3.5 ${interval === 'yearly' ? 'text-slate-950' : 'text-emerald-400'}`} />
              <span>1-Year Subscription</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                interval === 'yearly'
                  ? 'bg-slate-950 text-emerald-300'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                Save 20% (2 Mos Free)
              </span>
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>
              {interval === 'yearly' 
                ? 'Showing 1-Year Subscriptions: Get 2 full months free on all tiers + 3-day risk-free trial ($0 due today)' 
                : '1-Year Annual option available on all tiers below: Save up to $198/year with 2 months free'}
            </span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="pt-1 flex flex-wrap items-center justify-center gap-2">
          <button
            onClick={() => setViewMode('featureGrid')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'featureGrid'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Interactive Tier Breakdown</span>
          </button>

          <button
            onClick={() => setViewMode('stripeTable')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              viewMode === 'stripeTable'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Embedded Stripe Pricing Table</span>
          </button>
        </div>
      </div>

      {/* Main View: Either Custom Cards or Embedded Stripe Table */}
      {viewMode === 'stripeTable' ? (
        <StripePricingTable />
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {SUBSCRIPTION_PLANS.map((plan) => {
              const isCurrentPlan = subscription.planId === plan.id && subscription.status !== 'none';
              const isPlus = plan.id === 'plus';
              const monthlyPrice = plan.monthlyPrice;
              const yearlyPrice = plan.yearlyPrice;
              const displayPrice = interval === 'yearly' ? yearlyPrice : monthlyPrice;
              const monthlyEquivalent = Math.round((yearlyPrice / 12) * 100) / 100;
              const yearlySavings = (monthlyPrice * 12) - yearlyPrice;

              return (
                <div
                  key={plan.id}
                  className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between relative transition-all duration-300 ${
                    isPlus
                      ? 'bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border-2 border-emerald-500 shadow-2xl shadow-emerald-950/50 ring-1 ring-emerald-500/30'
                      : 'bg-slate-900/80 border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* ONLY the Plus pack has the MOST POPULAR badge */}
                  {isPlus && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-[11px] font-black tracking-wider uppercase shadow-lg shadow-emerald-500/30 flex items-center gap-1.5">
                      <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                      <span>MOST POPULAR</span>
                    </div>
                  )}

                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-2xl font-black text-white">{plan.name}</h3>
                        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Tier {plan.id === 'starter' ? '1' : plan.id === 'plus' ? '2' : '3'}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-emerald-400 min-h-[20px]">{plan.tagline}</p>
                      {plan.description && (
                        <p className="text-xs text-slate-300 mt-2.5 leading-relaxed min-h-[52px]">
                          {plan.description}
                        </p>
                      )}
                    </div>

                    {/* Price Box with Both Monthly & 1-Year Options Prominently Shown */}
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2.5">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <span className="text-4xl sm:text-5xl font-black text-white">
                            ${displayPrice}
                          </span>
                          <span className="text-xs text-slate-400 font-medium ml-1">
                            / {interval === 'yearly' ? 'year' : 'month'}
                          </span>
                        </div>
                        {interval === 'yearly' && (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                            2 Mos Free
                          </span>
                        )}
                      </div>

                      {/* Explicit 1-Year Subscription Breakdown Line */}
                      <div className="pt-2 border-t border-slate-800/80 text-xs">
                        {interval === 'yearly' ? (
                          <div className="flex items-center justify-between text-emerald-300 font-medium">
                            <span>1-Year Subscription Active:</span>
                            <strong className="text-white">${monthlyEquivalent}/mo equivalent</strong>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="text-slate-400">1-Year Subscription Option:</span>
                            <button
                              type="button"
                              onClick={() => setInterval('yearly')}
                              className="font-bold text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                              title="Switch to 1-Year Subscription"
                            >
                              ${yearlyPrice}/yr (Save ${yearlySavings})
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Trial Callout */}
                      <div className="pt-1 flex items-center gap-1.5 text-[11px] text-teal-300 font-semibold">
                        <Clock className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                        <span>Includes {plan.trialDays}-Day Free Trial ($0 Due Today)</span>
                      </div>
                    </div>

                    {/* Features List */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                        Included in {plan.name}:
                      </span>
                      <ul className="space-y-2.5 text-xs text-slate-300">
                        {plan.features.map((feat, fIdx) => (
                          <li key={fIdx} className="flex items-start gap-2.5">
                            <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {plan.limitations && (
                        <ul className="space-y-1.5 text-xs text-slate-500 pt-2 border-t border-slate-800/60">
                          {plan.limitations.map((lim, lIdx) => (
                            <li key={lIdx} className="flex items-center gap-2">
                              <span className="text-slate-600 font-bold">—</span>
                              <span>{lim}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8 pt-6 border-t border-slate-800/80 space-y-2.5">
                    <button
                      onClick={() => onInitiateCheckout(plan, interval)}
                      disabled={isCurrentPlan}
                      className={`w-full py-3.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer ${
                        isCurrentPlan
                          ? 'bg-slate-800 text-slate-400 cursor-default'
                          : isPlus
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/25'
                          : 'bg-slate-800 hover:bg-slate-700 text-white'
                      }`}
                    >
                      {isCurrentPlan ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Current Active Plan</span>
                        </>
                      ) : (
                        <>
                          <CreditCard className="w-4 h-4" />
                          <span>Start {plan.trialDays}-Day Free Trial ({interval === 'yearly' ? `1-Year: $${yearlyPrice}/yr` : `Monthly: $${monthlyPrice}/mo`})</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>

                    {/* Quick 1-Year vs Monthly Switcher Link right on card */}
                    {!isCurrentPlan && (
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => {
                            const targetInterval = interval === 'monthly' ? 'yearly' : 'monthly';
                            setInterval(targetInterval);
                            onInitiateCheckout(plan, targetInterval);
                          }}
                          className="text-[11px] text-slate-400 hover:text-emerald-400 transition-colors underline cursor-pointer"
                        >
                          {interval === 'monthly' 
                            ? `Want the 1-Year option? Click to start 1-Year trial ($${yearlyPrice}/yr — Save $${yearlySavings})` 
                            : `Want the monthly option? Click to start Monthly trial ($${monthlyPrice}/mo)`}
                        </button>
                      </div>
                    )}

                    <div className="text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Encrypted 256-bit Stripe Checkout • Cancel anytime in 1 click</span>
                    </div>

                    {plan.stripeProductId && (
                      <div className="pt-2 border-t border-slate-800/40 flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                          <span>Stripe Catalog</span>
                        </span>
                        <span className="text-slate-400 truncate max-w-[140px]" title={interval === 'yearly' ? plan.yearlyPriceId : plan.monthlyPriceId}>
                          {interval === 'yearly' ? plan.yearlyPriceId : plan.monthlyPriceId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dedicated 1-Year Subscription Savings Matrix Card */}
          <div className="rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-teal-950/30 border border-emerald-500/30 p-5">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-white">
                    1-Year Annual Subscriptions — 2 Months Free on Every Plan
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Prepay for 1 year to lock in maximum savings with $0 charged today during your 3-day trial.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs">
                <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Starter 1-Year: </span>
                  <strong className="text-white">$190/yr</strong>
                  <span className="text-emerald-400 ml-1 font-bold">(Save $38)</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-emerald-500/40 ring-1 ring-emerald-500/30">
                  <span className="text-slate-400">Plus 1-Year: </span>
                  <strong className="text-white">$490/yr</strong>
                  <span className="text-emerald-400 ml-1 font-bold">(Save $98 • Most Popular)</span>
                </div>
                <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800">
                  <span className="text-slate-400">Premium 1-Year: </span>
                  <strong className="text-white">$990/yr</strong>
                  <span className="text-emerald-400 ml-1 font-bold">(Save $198)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* One-Time Upgrades Section */}
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-800 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 mb-1">
              Add-On Upgrades
            </div>
            <h2 className="text-xl font-extrabold text-white">
              Accelerate Your Launch with One-Time Toolkits
            </h2>
            <p className="text-xs text-slate-400">
              Optional one-off power boosts. Lifetime access, zero recurring fees.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ONE_TIME_UPGRADES.map((upgrade) => (
            <div
              key={upgrade.id}
              className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/80 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-white text-base">{upgrade.title}</h3>
                    <p className="text-xs text-slate-400 mt-1">{upgrade.description}</p>
                  </div>
                  <div className="text-right shrink-0 ml-3">
                    <span className="text-2xl font-black text-white">${upgrade.price}</span>
                    <span className="text-[10px] text-slate-400 block">one-time</span>
                  </div>
                </div>

                <ul className="space-y-2 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  {upgrade.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => onInitiateUpgrade(upgrade)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-slate-950 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Unlock Upgrade for ${upgrade.price}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trial FAQs */}
      <div className="rounded-3xl bg-slate-900/60 border border-slate-800 p-8 space-y-6">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <HelpCircle className="w-4 h-4 text-emerald-400" />
          <span>Frequently Asked Questions About Free Trials & Stripe Billing</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="space-y-1">
            <h4 className="font-bold text-white">How does the 3-day free trial work?</h4>
            <p className="text-slate-400 leading-relaxed">
              When you begin your trial, you get unrestricted access to the selected tier immediately. Stripe authorizes your card with $0.00 charged today. You can scout products, export listings, and run ad scripts right away.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-white">Can I cancel before being billed?</h4>
            <p className="text-slate-400 leading-relaxed">
              Yes, absolutely. You can cancel at any moment during your trial from the Customer Portal or Billing Settings with zero cancellation fees. If you cancel, you will never be charged.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-white">How does billing and security work?</h4>
            <p className="text-slate-400 leading-relaxed">
              All transactions and recurring subscriptions are processed securely through Stripe with bank-grade 256-bit encryption. Your payment details are encrypted end-to-end and never exposed.
            </p>
          </div>

          <div className="space-y-1">
            <h4 className="font-bold text-white">What payment methods are supported?</h4>
            <p className="text-slate-400 leading-relaxed">
              Stripe natively supports Visa, Mastercard, American Express, Apple Pay, Google Pay, and standard bank cards with 3D Secure verification.
            </p>
          </div>
        </div>

        {/* Quick Actions Footer Card */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-slate-300 font-medium">Stripe Recurring Billing & 1-Click Instant Cancellation</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {isSubActive && on1ClickCancel && (
              <button
                type="button"
                onClick={on1ClickCancel}
                className="px-4 py-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors shadow-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>1-Click Cancel Subscription</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
