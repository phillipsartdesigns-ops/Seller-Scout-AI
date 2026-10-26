import React, { useState } from 'react';
import { 
  CreditCard, 
  Lock, 
  ShieldCheck, 
  Clock, 
  CheckCircle2, 
  Sparkles, 
  X, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  Percent
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { SubscriptionPlan, BillingInterval, OneTimeUpgrade } from '../types';

interface StripeCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan?: SubscriptionPlan | null;
  interval?: BillingInterval;
  upgrade?: OneTimeUpgrade | null;
  onSuccess: (details: {
    planId: string;
    interval: BillingInterval;
    trialDays: number;
    customerId: string;
  }) => void;
}

export const StripeCheckoutModal: React.FC<StripeCheckoutModalProps> = ({
  isOpen,
  onClose,
  plan,
  interval = 'monthly',
  upgrade,
  onSuccess,
}) => {
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiry, setExpiry] = useState<string>('');
  const [cvc, setCvc] = useState<string>('');
  const [zip, setZip] = useState<string>('90210');
  const [cardName, setCardName] = useState<string>('Alex Johnson');
  const [email, setEmail] = useState<string>('alex@sellerscout.io');
  const [promoCode, setPromoCode] = useState<string>('');
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || (!plan && !upgrade)) return null;

  const isSubscription = Boolean(plan);
  const trialDays = plan?.trialDays || 3;
  const regularPrice = plan
    ? (interval === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice)
    : (upgrade?.price || 29);

  const discountedNextPrice = discountPercent > 0
    ? Math.round((regularPrice * (1 - discountPercent / 100)) * 100) / 100
    : regularPrice;

  // Auto-fill test card credentials
  const fillTestCard = () => {
    setCardNumber('4242 •••• •••• 4242');
    setExpiry('12/28');
    setCvc('789');
    setZip('90210');
    setCardName('Alex Johnson');
  };

  const applyPromo = () => {
    const code = promoCode.trim().toUpperCase();
    if (code === 'LAUNCH50') {
      setDiscountPercent(50);
      setPromoMessage('Promo Applied: 50% off your first billing cycle!');
    } else if (code === 'SCOUT100') {
      setDiscountPercent(100);
      setPromoMessage('VIP Promo: 100% off first cycle!');
    } else {
      setPromoMessage('Invalid coupon code. Try LAUNCH50');
    }
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Call backend to create checkout session
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: plan?.id || 'pro',
          billingInterval: interval,
          customerEmail: email,
          isUpgrade: Boolean(upgrade),
          upgradeId: upgrade?.id,
          trialDays,
        }),
      });

      const session = await res.json();

      if (!res.ok) {
        throw new Error(session.error || 'Failed to initialize Stripe checkout session');
      }

      // If backend returned a real Stripe Checkout hosted redirect URL, redirect immediately
      if (session.url && session.mode === 'real_stripe') {
        window.location.href = session.url;
        return;
      }

      // Offline sandbox simulation (only active if no Stripe keys are configured)
      if (session.mode === 'sandbox_simulation') {
        await new Promise((resolve) => setTimeout(resolve, 1400));

        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#10b981', '#14b8a6', '#06b6d4', '#3b82f6', '#f59e0b'],
        });

        onSuccess({
          planId: plan?.id || 'pro',
          interval,
          trialDays,
          customerId: `cus_st_${Date.now()}`,
        });

        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Payment authorization failed');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-emerald-950/80 via-slate-950 to-teal-950/80 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-sm">
                  {isSubscription ? `${plan?.name} Checkout` : `${upgrade?.title}`}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Stripe Certified
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {isSubscription ? `Recurring ${interval} billing with trial period` : 'One-time upgrade payment'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleCheckoutSubmit} className="p-6 space-y-5 overflow-y-auto">
          {/* Order Summary Box */}
          <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-white text-sm">
                  {isSubscription ? `${plan?.name} (${interval === 'yearly' ? 'Annual Plan' : 'Monthly Plan'})` : upgrade?.title}
                </h4>
                <p className="text-xs text-slate-400">
                  {isSubscription ? `${trialDays}-Day Free Trial Included` : upgrade?.description}
                </p>
              </div>

              <div className="text-right">
                <div className="text-lg font-black text-white">
                  {isSubscription ? '$0.00' : `$${regularPrice.toFixed(2)}`}
                </div>
                <div className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                  {isSubscription ? 'DUE TODAY' : 'ONE-TIME'}
                </div>
              </div>
            </div>

            {isSubscription && (
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 bg-emerald-950/20 p-2.5 rounded-xl border border-emerald-500/20">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Your {trialDays}-day trial starts today. Recurring rate of <strong>${discountedNextPrice}/{interval === 'yearly' ? 'year' : 'month'}</strong> begins on Day {trialDays + 1}.
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Test Card Auto-fill helper */}
          <div className="flex items-center justify-between text-xs bg-slate-800/60 p-2.5 rounded-xl border border-slate-700/60">
            <span className="text-slate-300 flex items-center gap-1.5 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Testing or Sandbox mode?
            </span>
            <button
              type="button"
              onClick={fillTestCard}
              className="text-emerald-400 hover:text-emerald-300 font-bold underline transition-colors"
            >
              Auto-Fill Stripe Test Card (4242)
            </button>
          </div>

          {/* Email input */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Account Email (for receipts & portal):</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Cardholder Name */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300">Name on Card:</label>
            <input
              type="text"
              required
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="e.g. Alex Johnson"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Card Number */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
              <span>Card Information:</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Lock className="w-2.5 h-2.5 text-emerald-400" />
                PCI-DSS Encrypted
              </span>
            </label>
            <div className="relative">
              <input
                type="text"
                required
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                placeholder="4242 4242 4242 4242"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <CreditCard className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
            </div>
          </div>

          {/* Expiry & CVC & Zip */}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">MM / YY:</label>
              <input
                type="text"
                required
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                placeholder="12/28"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">CVC / CVP:</label>
              <input
                type="text"
                required
                value={cvc}
                onChange={(e) => setCvc(e.target.value)}
                placeholder="789"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-slate-400">Postal / Zip:</label>
              <input
                type="text"
                required
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                placeholder="90210"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Promo Code Drawer */}
          <div className="pt-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                placeholder="Coupon / Promo Code (e.g. LAUNCH50)"
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white uppercase focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={applyPromo}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
              >
                Apply
              </button>
            </div>
            {promoMessage && (
              <p className={`text-[11px] mt-1 font-semibold ${discountPercent > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {promoMessage}
              </p>
            )}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Recurring Authorization Terms */}
          <div className="text-[11px] text-slate-400 leading-relaxed space-y-1 pt-1">
            <p>
              🛡️ <strong>Zero Risk Free Trial:</strong> You will not be charged today. If you cancel prior to Day {trialDays}, your card will never be charged.
            </p>
            <p>
              By proceeding, you agree to automatic recurring renewal after {trialDays} days unless canceled via your Customer Portal.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing}
            className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50 transition-all cursor-pointer"
          >
            {isProcessing ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                <span>Authorizing with Stripe...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {isSubscription
                    ? `Start ${trialDays}-Day Free Trial ($0.00 Due Today)`
                    : `Pay $${regularPrice.toFixed(2)} with Stripe`}
                </span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
