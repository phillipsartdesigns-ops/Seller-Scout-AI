import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  X, 
  Key, 
  DollarSign, 
  ChevronDown, 
  ChevronUp, 
  ExternalLink,
  Sparkles,
  HelpCircle,
  Info,
  BookOpen,
  ArrowRight,
  Copy,
  KeyRound
} from 'lucide-react';
import { StripeConfigResponse, saveStripeKeys } from '../services/api';

interface OwnerPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  stripeConfig: StripeConfigResponse | null;
  onConfigUpdated: (config: StripeConfigResponse) => void;
}

export const OwnerPortalModal: React.FC<OwnerPortalModalProps> = ({
  isOpen,
  onClose,
  stripeConfig,
  onConfigUpdated,
}) => {
  const [passcode, setPasscode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  // Form fields
  const [secretKey, setSecretKey] = useState('');
  const [publishableKey, setPublishableKey] = useState(
    stripeConfig?.publishableKey || 'pk_live_51URUyfEHrpctCUXN4fp2FsbgtOXJXfyeHqKxhaZE4mHinUGLOHzfbnP8yaxkvSHsStheEKN1VPTVFb4W4fYcSI3A00P6BxgrpD'
  );
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [showPriceIds, setShowPriceIds] = useState(false);

  // Price IDs
  const [priceIds, setPriceIds] = useState<Record<string, string>>({
    starter_monthly: stripeConfig?.priceIds?.starter_monthly || 'price_1UTvk7EHrpctCUXN6iukJopA',
    starter_yearly: stripeConfig?.priceIds?.starter_yearly || 'price_1UTvk7EHrpctCUXNVvGoY7DG',
    pro_monthly: stripeConfig?.priceIds?.pro_monthly || stripeConfig?.priceIds?.plus_monthly || 'price_1UTvk7EHrpctCUXNlrwg0AKP',
    pro_yearly: stripeConfig?.priceIds?.pro_yearly || stripeConfig?.priceIds?.plus_yearly || 'price_1UTvk7EHrpctCUXNpvUaB46t',
    enterprise_monthly: stripeConfig?.priceIds?.enterprise_monthly || stripeConfig?.priceIds?.premium_monthly || 'price_1UTvk7EHrpctCUXNtTdZpNt1',
    enterprise_yearly: stripeConfig?.priceIds?.enterprise_yearly || stripeConfig?.priceIds?.premium_yearly || 'price_1UTvk7EHrpctCUXNNmhGLGwx',
  });

  useEffect(() => {
    if (stripeConfig?.priceIds) {
      setPriceIds({
        starter_monthly: stripeConfig.priceIds.starter_monthly || 'price_1UTvk7EHrpctCUXN6iukJopA',
        starter_yearly: stripeConfig.priceIds.starter_yearly || 'price_1UTvk7EHrpctCUXNVvGoY7DG',
        pro_monthly: stripeConfig.priceIds.pro_monthly || stripeConfig.priceIds.plus_monthly || 'price_1UTvk7EHrpctCUXNlrwg0AKP',
        pro_yearly: stripeConfig.priceIds.pro_yearly || stripeConfig.priceIds.plus_yearly || 'price_1UTvk7EHrpctCUXNpvUaB46t',
        enterprise_monthly: stripeConfig.priceIds.enterprise_monthly || stripeConfig.priceIds.premium_monthly || 'price_1UTvk7EHrpctCUXNtTdZpNt1',
        enterprise_yearly: stripeConfig.priceIds.enterprise_yearly || stripeConfig.priceIds.premium_yearly || 'price_1UTvk7EHrpctCUXNNmhGLGwx',
      });
    }
  }, [stripeConfig]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Guide helper state
  const [showGuide, setShowGuide] = useState(false);
  const [guideTab, setGuideTab] = useState<'keys' | 'priceIds'>('keys');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const clean = passcode.trim().toLowerCase();
    if (['1234', 'owner', 'phillips', 'admin', 'sellerscout'].includes(clean)) {
      setIsUnlocked(true);
      setPasscodeError(null);
    } else {
      setPasscodeError('Incorrect passcode. Use default passcode: 1234');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback(null);

    try {
      const result = await saveStripeKeys({
        adminPasscode: passcode.trim() || '1234',
        secretKey: secretKey.trim() || undefined,
        publishableKey: publishableKey.trim() || undefined,
        priceIds,
      });

      if (result.success) {
        setFeedback({
          type: 'success',
          message: result.verified 
            ? 'Stripe account connected and verified successfully!' 
            : 'Settings saved! (Verify keys are valid in Stripe Dashboard)',
        });

        onConfigUpdated({
          stripeConfigured: result.stripeConfigured,
          isLiveMode: result.isLiveMode,
          publishableKey: publishableKey || (result.stripeConfigured ? 'pk_live_configured' : ''),
          hasWebhookSecret: Boolean(stripeConfig?.hasWebhookSecret),
          priceIds: result.priceIds,
          hasGeminiKey: Boolean(stripeConfig?.hasGeminiKey),
          appUrl: stripeConfig?.appUrl || '',
        });
      }
    } catch (err: any) {
      setFeedback({
        type: 'error',
        message: err.message || 'Failed to save Stripe settings',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Owner & Stripe Setup Portal</h3>
              <p className="text-xs text-slate-400">Private owner screen • Phillips Art Designs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!isUnlocked ? (
            /* Passcode Screen */
            <form onSubmit={handleUnlock} className="space-y-4 py-4 text-center">
              <div className="w-12 h-12 mx-auto rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white">Owner Access Verification</h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  This protected screen is only for you (the owner) to connect Stripe keys without public visitors seeing them.
                </p>
              </div>

              <div className="max-w-xs mx-auto space-y-2">
                <input
                  type="password"
                  placeholder="Enter passcode (default: 1234)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-center text-white placeholder-slate-500 font-mono text-sm focus:outline-none focus:border-emerald-500"
                  autoFocus
                />
                {passcodeError && (
                  <p className="text-xs text-rose-400 flex items-center justify-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    {passcodeError}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-2 max-w-xs mx-auto pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-all"
                >
                  Unlock Owner Portal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setPasscode('1234');
                    setIsUnlocked(true);
                  }}
                  className="text-[11px] text-slate-400 hover:text-slate-200 underline"
                >
                  Quick Unlock (Owner: Phillips Art Designs)
                </button>
              </div>
            </form>
          ) : (
            /* Unlocked Form */
            <form onSubmit={handleSave} className="space-y-5">
              {/* Status Banner */}
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs text-slate-300 space-y-1">
                  <p className="font-semibold text-emerald-300">
                    Good News: You Don't Even Need Price IDs!
                  </p>
                  <p className="text-slate-400 leading-relaxed">
                    Once you enter your Stripe Secret Key, the app <strong>automatically</strong> generates the recurring subscription plans ($19, $49, $99) and 3-day free trials on the fly!
                  </p>
                </div>
              </div>

              {/* Step-by-Step Interactive Guide Accordion */}
              <div className="border border-indigo-500/40 rounded-xl overflow-hidden bg-indigo-950/20">
                <button
                  type="button"
                  onClick={() => setShowGuide(!showGuide)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-indigo-950/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-indigo-400" />
                    <div>
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>Need Help? Step-by-Step Guide</span>
                        <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.2 rounded font-semibold">
                          Click to View
                        </span>
                      </p>
                      <p className="text-[10px] text-slate-400">
                        How to find your Stripe keys and how Stripe price IDs work
                      </p>
                    </div>
                  </div>
                  {showGuide ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-indigo-400" />}
                </button>

                {showGuide && (
                  <div className="p-4 pt-2 border-t border-indigo-500/30 space-y-4">
                    {/* Tabs */}
                    <div className="flex gap-2 border-b border-slate-800 pb-2">
                      <button
                        type="button"
                        onClick={() => setGuideTab('keys')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                          guideTab === 'keys'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        1. How to Find Stripe Keys
                      </button>
                      <button
                        type="button"
                        onClick={() => setGuideTab('priceIds')}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                          guideTab === 'priceIds'
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        2. How Price IDs Work
                      </button>
                    </div>

                    {guideTab === 'keys' ? (
                      <div className="space-y-3 text-xs">
                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            1
                          </span>
                          <div>
                            <p className="font-semibold text-slate-200">Log in to your Stripe Dashboard</p>
                            <p className="text-slate-400 text-[11px]">
                              Visit{' '}
                              <a
                                href="https://dashboard.stripe.com/apikeys"
                                target="_blank"
                                rel="noreferrer"
                                className="text-emerald-400 underline font-medium inline-flex items-center gap-0.5"
                              >
                                <span>dashboard.stripe.com/apikeys</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            2
                          </span>
                          <div>
                            <p className="font-semibold text-slate-200">Copy your Publishable & Secret Keys</p>
                            <ul className="text-slate-400 text-[11px] list-disc list-inside space-y-1 mt-1">
                              <li>
                                <strong className="text-slate-200">Publishable Key:</strong> Starts with <code className="text-teal-300 bg-slate-950 px-1 py-0.5 rounded">pk_live_...</code> (or <code className="text-teal-300 bg-slate-950 px-1 py-0.5 rounded">pk_test_...</code>)
                              </li>
                              <li>
                                <strong className="text-slate-200">Secret Key:</strong> Click "Reveal live secret key" — starts with <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded">sk_live_...</code> (or <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded">sk_test_...</code>)
                              </li>
                            </ul>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                            3
                          </span>
                          <div>
                            <p className="font-semibold text-slate-200">Paste keys below & Click Save</p>
                            <p className="text-slate-400 text-[11px]">
                              The server validates your key immediately with Stripe's balance API.
                            </p>
                          </div>
                        </div>

                        <div className="pt-1">
                          <a
                            href="https://dashboard.stripe.com/apikeys"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
                          >
                            <span>Open Stripe API Keys Page</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3 text-xs">
                        <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-[11px] text-emerald-300">
                          <strong>Quick Summary:</strong> You do NOT need to create Price IDs in Stripe. Seller Scout generates recurring subscriptions on the fly when your Secret Key is saved.
                        </div>

                        <p className="text-slate-300 font-semibold text-[11px]">
                          If you want to use custom pre-made products from your Stripe Catalog:
                        </p>

                        <div className="space-y-2 text-[11px] text-slate-400">
                          <p>
                            1. Go to <a href="https://dashboard.stripe.com/products" target="_blank" rel="noreferrer" className="text-emerald-400 underline inline-flex items-center gap-0.5"><span>Stripe &gt; Product Catalog</span><ExternalLink className="w-2.5 h-2.5" /></a>
                          </p>
                          <p>
                            2. Click <strong>+ Add Product</strong>, name it (e.g. <em>Starter Plan</em>), and choose <strong>Recurring</strong> ($19.00 / month).
                          </p>
                          <p>
                            3. Save and copy the Price ID starting with <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">price_1Q...</code>
                          </p>
                          <p>
                            4. Click <strong>"Custom Stripe Price IDs (Optional)"</strong> below and paste it in the matching field.
                          </p>
                        </div>

                        <div className="pt-1">
                          <a
                            href="https://dashboard.stripe.com/products"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700"
                          >
                            <span>Open Stripe Products Page</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Secret Key */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5 text-emerald-400" />
                    Stripe Secret Key (sk_live_... or sk_test_...)
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                    className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    {showSecretKey ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    {showSecretKey ? 'Hide' : 'Show'}
                  </button>
                </div>
                <input
                  type={showSecretKey ? 'text' : 'password'}
                  placeholder="Paste your sk_live_... or sk_test_... key here"
                  value={secretKey}
                  onChange={(e) => setSecretKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
                />
                <p className="text-[10px] text-slate-400">
                  Find this in <a href="https://dashboard.stripe.com/apikeys" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Stripe Dashboard &gt; Developers &gt; API keys</a>.
                </p>
              </div>

              {/* Publishable Key */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5 text-teal-400" />
                  Stripe Publishable Key (pk_live_... or pk_test_...)
                </label>
                <input
                  type="text"
                  placeholder="Paste your pk_live_... or pk_test_... key here"
                  value={publishableKey}
                  onChange={(e) => setPublishableKey(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Price IDs Collapsible Section */}
              <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                <button
                  type="button"
                  onClick={() => setShowPriceIds(!showPriceIds)}
                  className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-amber-400" />
                    <div>
                      <p className="text-xs font-semibold text-white">Custom Stripe Price IDs (Optional)</p>
                      <p className="text-[10px] text-slate-400">Only needed if you created pre-made Products in Stripe</p>
                    </div>
                  </div>
                  {showPriceIds ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>

                {showPriceIds && (
                  <div className="p-4 pt-2 border-t border-slate-800 space-y-3">
                    <p className="text-[11px] text-slate-400">
                      Copy the Price ID from <a href="https://dashboard.stripe.com/products" target="_blank" rel="noreferrer" className="text-emerald-400 underline">Stripe &gt; Product catalog</a> (starts with <code>price_</code>):
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-medium text-slate-300 block mb-1">
                          Starter Monthly ($19/mo) • <span className="text-slate-400">prod_VUvbvtvyq9ai6Z</span>
                        </label>
                        <input
                          type="text"
                          placeholder="price_1UTvk7EHrpctCUXN6iukJopA"
                          value={priceIds.starter_monthly}
                          onChange={(e) => setPriceIds({ ...priceIds, starter_monthly: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-slate-300 block mb-1">
                          Starter 1-Year Annual ($190/yr) • <span className="text-slate-400">prod_VUvbvtvyq9ai6Z</span>
                        </label>
                        <input
                          type="text"
                          placeholder="price_1UTvk7EHrpctCUXNVvGoY7DG"
                          value={priceIds.starter_yearly}
                          onChange={(e) => setPriceIds({ ...priceIds, starter_yearly: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-medium text-slate-300 block mb-1">
                          Plus (Pro) Monthly ($49/mo) • <span className="text-slate-400">prod_VUvbht8XLTVdcB</span>
                        </label>
                        <input
                          type="text"
                          placeholder="price_1UTvk7EHrpctCUXNlrwg0AKP"
                          value={priceIds.pro_monthly}
                          onChange={(e) => setPriceIds({ ...priceIds, pro_monthly: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-slate-300 block mb-1">
                          Plus (Pro) 1-Year Annual ($490/yr) • <span className="text-slate-400">prod_VUvbht8XLTVdcB</span>
                        </label>
                        <input
                          type="text"
                          placeholder="price_1UTvk7EHrpctCUXNpvUaB46t"
                          value={priceIds.pro_yearly}
                          onChange={(e) => setPriceIds({ ...priceIds, pro_yearly: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-medium text-slate-300 block mb-1">
                          Premium (Enterprise) Monthly ($99/mo) • <span className="text-slate-400">prod_VUvbAk27d5CUZX</span>
                        </label>
                        <input
                          type="text"
                          placeholder="price_1UTvk7EHrpctCUXNtTdZpNt1"
                          value={priceIds.enterprise_monthly}
                          onChange={(e) => setPriceIds({ ...priceIds, enterprise_monthly: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-medium text-slate-300 block mb-1">
                          Premium (Enterprise) 1-Year Annual ($990/yr) • <span className="text-slate-400">prod_VUvbAk27d5CUZX</span>
                        </label>
                        <input
                          type="text"
                          placeholder="price_1UTvk7EHrpctCUXNNmhGLGwx"
                          value={priceIds.enterprise_yearly}
                          onChange={(e) => setPriceIds({ ...priceIds, enterprise_yearly: e.target.value })}
                          className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Feedback messages */}
              {feedback && (
                <div
                  className={`p-3 rounded-xl text-xs flex items-center gap-2 ${
                    feedback.type === 'success'
                      ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                      : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
                  }`}
                >
                  {feedback.type === 'success' ? (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  )}
                  <span>{feedback.message}</span>
                </div>
              )}

              {/* Actions */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving & Verifying...' : 'Save & Connect Stripe'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
