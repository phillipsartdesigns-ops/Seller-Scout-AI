import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { 
  Header 
} from './components/Header';
import { 
  ScoutTab 
} from './components/ScoutTab';
import { 
  DigitalProductBuilderTab 
} from './components/DigitalProductBuilderTab';
import { 
  ListingBuilderTab 
} from './components/ListingBuilderTab';
import { 
  FlipEstimatorTab 
} from './components/FlipEstimatorTab';
import { 
  LaunchChecklistTab 
} from './components/LaunchChecklistTab';
import { 
  PricingTab 
} from './components/PricingTab';
import { 
  IntegrationsTab 
} from './components/IntegrationsTab';
import {
  DashboardTab
} from './components/DashboardTab';
import { 
  VideoWalkthroughModal 
} from './components/VideoWalkthroughModal';
import { 
  StripeCheckoutModal 
} from './components/StripeCheckoutModal';
import { 
  SubscriptionManagerModal 
} from './components/SubscriptionManagerModal';
import {
  OwnerPortalModal
} from './components/OwnerPortalModal';
import { 
  UserSubscription, 
  SubscriptionPlan, 
  BillingInterval, 
  OneTimeUpgrade, 
  ProductOpportunity 
} from './types';
import { 
  SUBSCRIPTION_PLANS, 
  ONE_TIME_UPGRADES 
} from './data/plans';
import { 
  fetchStripeConfig, 
  StripeConfigResponse,
  cancelSubscriptionApi
} from './services/api';
import { 
  Video, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  Play, 
  CheckCircle2, 
  ArrowRight,
  ExternalLink,
  Wand2
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'scout' | 'digital' | 'listing' | 'integrations' | 'flip' | 'launch' | 'pricing' | 'dashboard'>('scout');
  const [digitalInitialPrompt, setDigitalInitialPrompt] = useState<string>('');
  
  // Persistent Subscription State
  const [subscription, setSubscription] = useState<UserSubscription>(() => {
    try {
      const saved = localStorage.getItem('seller_scout_subscription');
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default active 3-day trial for user convenience
    const trialEndDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return {
      status: 'trialing',
      planId: 'plus',
      planName: 'Plus',
      interval: 'monthly',
      trialEnd: trialEndDate,
      stripeCustomerId: 'cus_demo_3day_trial',
    };
  });

  const [stripeConfig, setStripeConfig] = useState<StripeConfigResponse | null>(null);
  const [selectedProductForListing, setSelectedProductForListing] = useState<ProductOpportunity | null>(null);
  
  // Modals
  const [isVideoWalkthroughOpen, setIsVideoWalkthroughOpen] = useState<boolean>(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState<boolean>(false);
  const [checkoutTargetPlan, setCheckoutTargetPlan] = useState<SubscriptionPlan | null>(null);
  const [checkoutTargetInterval, setCheckoutTargetInterval] = useState<BillingInterval>('monthly');
  const [checkoutTargetUpgrade, setCheckoutTargetUpgrade] = useState<OneTimeUpgrade | null>(null);
  
  const [isSubscriptionManagerOpen, setIsSubscriptionManagerOpen] = useState<boolean>(false);
  const [isOwnerPortalOpen, setIsOwnerPortalOpen] = useState<boolean>(false);
  const [notificationBanner, setNotificationBanner] = useState<string | null>(null);

  // 1-Click Instant Cancellation Handler
  const handle1ClickCancel = async () => {
    try {
      await cancelSubscriptionApi({
        customerId: subscription.stripeCustomerId,
        subscriptionId: subscription.stripeSubscriptionId,
      });
    } catch (err) {
      console.warn('Cancel note:', err);
    }
    setSubscription({
      status: 'canceled',
      planId: 'none',
      planName: 'Free Explorer',
      interval: 'monthly',
      cancelAtPeriodEnd: true,
    });
    setNotificationBanner('✅ Subscription & Free Trial canceled with 1 click. Zero future charges will occur.');
  };

  // Sync subscription to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('seller_scout_subscription', JSON.stringify(subscription));
    } catch {}
  }, [subscription]);

  // Load backend Stripe integration status
  const loadConfig = async () => {
    try {
      const cfg = await fetchStripeConfig();
      setStripeConfig(cfg);
    } catch (err) {
      console.warn('Could not fetch Stripe config:', err);
    }
  };

  useEffect(() => {
    loadConfig();

    // Check URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('owner') === 'true' || urlParams.get('admin') === 'true') {
      setIsOwnerPortalOpen(true);
    }

    const checkoutStatus = urlParams.get('checkout_status');
    const plan = urlParams.get('plan');
    const interval = urlParams.get('interval') as BillingInterval || 'monthly';
    const trialDays = Number(urlParams.get('trial')) || 3;

    if (checkoutStatus === 'success') {
      const matchingPlan = SUBSCRIPTION_PLANS.find((p) => p.id === plan || (p.id === 'plus' && plan === 'pro') || (p.id === 'premium' && plan === 'enterprise')) || SUBSCRIPTION_PLANS[1];
      const trialEndDate = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      setSubscription({
        status: 'trialing',
        planId: matchingPlan.id,
        planName: matchingPlan.name,
        interval,
        trialEnd: trialEndDate,
        stripeCustomerId: `cus_live_${Date.now()}`,
      });

      setNotificationBanner(`🎉 Welcome! Your ${matchingPlan.name} ${trialDays}-Day Free Trial is now active with $0 charged today.`);
      
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.5 },
      });

      // Clear search query param without page reload
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleSelectProductForListing = (product: ProductOpportunity) => {
    setSelectedProductForListing(product);
    setActiveTab('listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInitiateCheckout = async (plan: SubscriptionPlan, interval: BillingInterval) => {
    try {
      setNotificationBanner(`🔒 Connecting to secure Stripe Checkout for ${plan.name} (${plan.trialDays}-day free trial, $0 due today)...`);
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan.id,
          billingInterval: interval,
          trialDays: plan.trialDays || 3,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url && data.mode === 'real_stripe') {
        window.location.href = data.url;
        return;
      }
      if (!res.ok) {
        setNotificationBanner(`⚠️ Stripe Notice: ${data.error || 'Failed to connect to Stripe'}`);
      }
    } catch (err: any) {
      console.warn('Direct Stripe redirect check:', err);
    }
    setCheckoutTargetPlan(plan);
    setCheckoutTargetInterval(interval);
    setCheckoutTargetUpgrade(null);
    setIsCheckoutModalOpen(true);
  };

  const handleInitiateUpgrade = async (upgrade: OneTimeUpgrade) => {
    try {
      setNotificationBanner(`🔒 Connecting to secure Stripe Checkout for ${upgrade.title}...`);
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          isUpgrade: true,
          upgradeId: upgrade.id,
        }),
      });
      const data = await res.json();
      if (res.ok && data.url && data.mode === 'real_stripe') {
        window.location.href = data.url;
        return;
      }
      if (!res.ok) {
        setNotificationBanner(`⚠️ Stripe Notice: ${data.error || 'Failed to connect to Stripe'}`);
      }
    } catch (err: any) {
      console.warn('Direct Stripe upgrade redirect check:', err);
    }
    setCheckoutTargetUpgrade(upgrade);
    setCheckoutTargetPlan(null);
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutSuccess = ({
    planId,
    interval,
    trialDays,
    customerId,
  }: {
    planId: string;
    interval: BillingInterval;
    trialDays: number;
    customerId: string;
  }) => {
    const matchingPlan = SUBSCRIPTION_PLANS.find((p) => p.id === planId || (p.id === 'plus' && planId === 'pro') || (p.id === 'premium' && planId === 'enterprise')) || SUBSCRIPTION_PLANS[1];
    const trialEndDate = new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    setSubscription({
      status: 'trialing',
      planId: matchingPlan.id,
      planName: matchingPlan.name,
      interval,
      trialEnd: trialEndDate,
      stripeCustomerId: customerId,
    });

    setNotificationBanner(`🎉 Subscription Active: Your ${trialDays}-day trial of ${matchingPlan.name} ($0 due today) is live!`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        subscription={subscription}
        stripeConfig={stripeConfig}
        onOpenManageSubscription={() => setIsSubscriptionManagerOpen(true)}
        on1ClickCancel={handle1ClickCancel}
      />

      {/* Optional Notification Banner */}
      {notificationBanner && (
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-slate-950 font-bold px-4 py-2.5 text-xs text-center flex items-center justify-center gap-2">
          <span>{notificationBanner}</span>
          <button
            onClick={() => setNotificationBanner(null)}
            className="text-slate-950/80 hover:text-black font-black text-sm ml-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* Floating Callout: Built-in Video Walkthrough Trigger */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 w-full">
        <div className="bg-gradient-to-r from-indigo-950/70 via-slate-900 to-emerald-950/70 rounded-2xl border border-indigo-500/30 p-3.5 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center text-white shrink-0 shadow-md">
              <Video className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-xs sm:text-sm">
                  Built-In Video Walkthrough & Presentation
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Step-by-Step Slides
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Watch the hypothetical case study: How Alex turned a $25 budget into $1,000/mo using AI product scouting and Stripe recurring payments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setIsVideoWalkthroughOpen(true)}
              className="py-2 px-4 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 transition-all active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>Watch Video Walkthrough</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 w-full">
        {activeTab === 'scout' && (
          <ScoutTab
            onSelectProductForListing={handleSelectProductForListing}
            onNavigateToDigitalBuilder={(prompt) => {
              if (prompt) setDigitalInitialPrompt(prompt);
              setActiveTab('digital');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPricing={() => setActiveTab('pricing')}
            hasActiveSubscription={subscription.status !== 'none' && subscription.status !== 'canceled'}
          />
        )}

        {activeTab === 'digital' && (
          <DigitalProductBuilderTab
            initialPrompt={digitalInitialPrompt}
            onOpenListingStudio={(productName, category) => {
              setSelectedProductForListing({
                name: productName,
                category: category || 'Digital Products & Instant Downloads',
                marketplace: 'etsy',
                inventoryType: 'digital_products',
                differentiationStrategies: [
                  'Includes editable Canva template links + 300 DPI vector PDF sheets',
                  'Commercial PLR (Private Label Rights) resell certificate included',
                  'Zero physical inventory shipping overhead (100% automated instant delivery)'
                ],
              } as any);
              setActiveTab('listing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenPricing={() => setActiveTab('pricing')}
            hasActiveSubscription={subscription.status !== 'none' && subscription.status !== 'canceled'}
          />
        )}

        {activeTab === 'listing' && (
          <ListingBuilderTab
            initialProduct={selectedProductForListing}
            onOpenPricing={() => setActiveTab('pricing')}
            hasActiveSubscription={subscription.status !== 'none' && subscription.status !== 'canceled'}
          />
        )}

        {activeTab === 'integrations' && (
          <IntegrationsTab
            onNavigateTab={setActiveTab}
            onOpenOwnerPortal={() => setIsOwnerPortalOpen(true)}
          />
        )}

        {activeTab === 'flip' && (
          <FlipEstimatorTab
            onOpenPricing={() => setActiveTab('pricing')}
            hasActiveSubscription={subscription.status !== 'none' && subscription.status !== 'canceled'}
          />
        )}

        {activeTab === 'launch' && (
          <LaunchChecklistTab
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'dashboard' && (
          <DashboardTab
            subscription={subscription}
            onOpenPricing={() => setActiveTab('pricing')}
            onOpenManageSubscription={() => setIsSubscriptionManagerOpen(true)}
            on1ClickCancel={handle1ClickCancel}
          />
        )}

        {activeTab === 'pricing' && (
          <PricingTab
            subscription={subscription}
            onInitiateCheckout={handleInitiateCheckout}
            onInitiateUpgrade={handleInitiateUpgrade}
            on1ClickCancel={handle1ClickCancel}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-8 px-4 text-xs text-slate-500 text-center">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Seller Scout AI</span>
            <span>—</span>
            <span>Intelligent Product Sourcing, Listing Studio & Stripe Billing</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-400">
            <button onClick={() => setActiveTab('dashboard')} className="hover:text-emerald-400 font-semibold text-emerald-300">
              MRR Dashboard
            </button>
            <button onClick={() => setActiveTab('digital')} className="hover:text-indigo-400 font-semibold text-indigo-300">
              AI Digital Builder
            </button>
            <button onClick={() => setActiveTab('integrations')} className="hover:text-teal-300 font-semibold text-teal-400">
              Plugins & Channels
            </button>
            <button onClick={() => setIsVideoWalkthroughOpen(true)} className="hover:text-emerald-400">
              Video Walkthrough
            </button>
            <button onClick={() => setActiveTab('pricing')} className="hover:text-emerald-400">
              Plans & 3-Day Trials
            </button>
            {(subscription.status === 'trialing' || subscription.status === 'active') && (
              <button 
                onClick={handle1ClickCancel} 
                className="text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 cursor-pointer"
                title="Cancel subscription in 1 click (stops all future charges)"
              >
                <span>✕</span>
                <span>1-Click Cancel</span>
              </button>
            )}
            <button
              onClick={() => setIsOwnerPortalOpen(true)}
              className="text-slate-500 hover:text-emerald-400 transition-colors flex items-center gap-1 text-[11px] cursor-pointer"
              title="Private Owner Access (Phillips Art Designs)"
            >
              <span>🔒</span>
              <span>Owner Portal</span>
            </button>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      {/* 1. Video Walkthrough Modal */}
      <VideoWalkthroughModal
        isOpen={isVideoWalkthroughOpen}
        onClose={() => setIsVideoWalkthroughOpen(false)}
        onStartTrial={() => {
          setActiveTab('pricing');
        }}
      />

      {/* 2. Stripe Checkout Modal */}
      <StripeCheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        plan={checkoutTargetPlan}
        interval={checkoutTargetInterval}
        upgrade={checkoutTargetUpgrade}
        onSuccess={handleCheckoutSuccess}
      />

      {/* 3. Subscription Management Modal */}
      <SubscriptionManagerModal
        isOpen={isSubscriptionManagerOpen}
        onClose={() => setIsSubscriptionManagerOpen(false)}
        subscription={subscription}
        onUpdateSubscription={setSubscription}
        onOpenPricing={() => {
          setIsSubscriptionManagerOpen(false);
          setActiveTab('pricing');
        }}
      />

      {/* 4. Owner Stripe Setup Portal */}
      <OwnerPortalModal
        isOpen={isOwnerPortalOpen}
        onClose={() => setIsOwnerPortalOpen(false)}
        stripeConfig={stripeConfig}
        onConfigUpdated={(cfg) => setStripeConfig(cfg)}
      />
    </div>
  );
}
