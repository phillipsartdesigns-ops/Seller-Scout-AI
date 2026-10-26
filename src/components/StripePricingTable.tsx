import React, { useEffect, useState } from 'react';
import { ShieldCheck, Lock, ExternalLink, Sparkles, CheckCircle2 } from 'lucide-react';

interface StripePricingTableProps {
  pricingTableId?: string;
  publishableKey?: string;
  customerEmail?: string;
  className?: string;
}

export const StripePricingTable: React.FC<StripePricingTableProps> = ({
  pricingTableId = 'prctbl_1URVaTEHrpctCUXNKFTuG8oL',
  publishableKey = 'pk_live_51URUyfEHrpctCUXN4fp2FsbgtOXJXfyeHqKxhaZE4mHinUGLOHzfbnP8yaxkvSHsStheEKN1VPTVFb4W4fYcSI3A00P6BxgrpD',
  customerEmail,
  className = '',
}) => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Check if Stripe pricing-table script is already present
    const existingScript = document.querySelector('script[src="https://js.stripe.com/v3/pricing-table.js"]');
    if (existingScript) {
      setScriptLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      // Keep script in cache for fast re-renders
    };
  }, []);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Live Badge & Trust Indicators */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-slate-900 to-indigo-500/10 border border-emerald-500/30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Official Stripe Pricing Table</span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <CheckCircle2 className="w-2.5 h-2.5" />
                Live Stripe Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Direct live checkout powered by Stripe • Table ID: <code className="text-emerald-300 font-mono">{pricingTableId}</code>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1 text-slate-300">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL Encrypted</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1 text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
            <span>3-Day Free Trial Protection</span>
          </div>
        </div>
      </div>

      {/* Embedded Stripe Pricing Table Web Component */}
      <div className="rounded-3xl bg-slate-900/90 border border-slate-800 p-4 sm:p-8 shadow-2xl relative min-h-[460px] overflow-hidden">
        {/* Container with dark theme styling */}
        <div className="stripe-pricing-table-wrapper w-full">
          {React.createElement('stripe-pricing-table', {
            'pricing-table-id': pricingTableId,
            'publishable-key': publishableKey,
            ...(customerEmail ? { 'customer-email': customerEmail } : {}),
          })}
        </div>

        {/* Informational Subtext */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3 h-3 text-emerald-400" />
            <span>Payments and recurring memberships are processed securely on Stripe's PCI-DSS Level 1 servers.</span>
          </div>
          <a
            href="https://dashboard.stripe.com"
            target="_blank"
            rel="noreferrer"
            className="text-slate-400 hover:text-emerald-300 transition-colors inline-flex items-center gap-1 shrink-0"
          >
            <span>Managed via Stripe Dashboard</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
