import { ProductOpportunity, ListingPackage, FlipEstimateResult, FlipPhotoAnalysisResult, BillingInterval } from '../types';

export interface StripeConfigResponse {
  stripeConfigured: boolean;
  isLiveMode: boolean;
  publishableKey: string;
  hasWebhookSecret: boolean;
  priceIds: Record<string, string>;
  hasGeminiKey: boolean;
  appUrl: string;
}

export async function fetchStripeConfig(): Promise<StripeConfigResponse> {
  const res = await fetch('/api/config');
  if (!res.ok) throw new Error('Failed to fetch config');
  return res.json();
}

export async function saveStripeKeys(payload: {
  adminPasscode: string;
  secretKey?: string;
  publishableKey?: string;
  webhookSecret?: string;
  priceIds?: Record<string, string>;
}): Promise<{
  success: boolean;
  verified: boolean;
  errorMessage?: string | null;
  isLiveMode: boolean;
  stripeConfigured: boolean;
  priceIds: Record<string, string>;
}> {
  const res = await fetch('/api/stripe/save-keys', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to update Stripe keys');
  }
  return data;
}

export async function createCheckoutSession(params: {
  planId?: string;
  billingInterval?: BillingInterval;
  customerEmail?: string;
  isUpgrade?: boolean;
  upgradeId?: string;
  trialDays?: number;
}): Promise<{
  url?: string;
  sessionId: string;
  mode: 'real_stripe' | 'sandbox_simulation';
  trialEndsAt?: string;
  nextBillingAmount?: number;
  nextBillingDate?: string;
  amountDueToday?: number;
  message?: string;
}> {
  const res = await fetch('/api/stripe/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Failed to create checkout session');
  }
  return res.json();
}

export async function getCustomerPortalUrl(customerId?: string): Promise<{ url: string; isSimulated?: boolean; message?: string }> {
  const res = await fetch('/api/stripe/customer-portal', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ customerId }),
  });
  if (!res.ok) throw new Error('Failed to get customer portal link');
  return res.json();
}

export async function scoutOpportunities(params: {
  budget: number;
  marketplace: string;
  inventoryType: string;
  category?: string;
}): Promise<{ opportunities: ProductOpportunity[] }> {
  const res = await fetch('/api/ai/scout-products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to scout product opportunities');
  return res.json();
}

export async function buildFullListing(params: {
  productName: string;
  marketplace: string;
  category?: string;
  differentiation?: string;
}): Promise<ListingPackage> {
  const res = await fetch('/api/ai/build-listing', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to build product listing package');
  return res.json();
}

export async function estimateFlipItem(params: {
  itemName: string;
  condition: string;
  purchasePrice: number;
  photoCount?: number;
  photoHighlights?: string[];
}): Promise<FlipEstimateResult> {
  const res = await fetch('/api/ai/estimate-flip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to estimate flip potential');
  return res.json();
}

export async function analyzeFlipPhotosApi(params: {
  photos: string[];
  itemName?: string;
  condition?: string;
}): Promise<FlipPhotoAnalysisResult> {
  const res = await fetch('/api/ai/analyze-flip-photos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to analyze photos');
  }
  return res.json();
}

export async function enhancePromptApi(params: {
  rawPrompt: string;
  productType?: string;
}): Promise<{
  originalPrompt: string;
  enhancedPrompt: string;
  nicheAngle: string;
  targetBuyer: string;
  keyHooks: string[];
}> {
  const res = await fetch('/api/ai/enhance-prompt', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to enhance prompt');
  return res.json();
}

export async function buildDigitalProductApi(params: {
  prompt: string;
  productType: string;
  targetAudience?: string;
  marketplace?: string;
}): Promise<any> {
  const res = await fetch('/api/ai/build-digital-product', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to build digital product');
  return res.json();
}

export async function cancelSubscriptionApi(params: {
  customerId?: string;
  subscriptionId?: string;
}): Promise<{
  success: boolean;
  status: 'canceled';
  message: string;
}> {
  const res = await fetch('/api/subscription/cancel', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || 'Failed to cancel subscription');
  }
  return data;
}

export async function translateVoiceoverApi(params: {
  text: string;
  targetLang: string;
  targetLangName: string;
}): Promise<{ translatedText: string; targetLang: string }> {
  const res = await fetch('/api/ai/translate-voiceover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) {
    return { translatedText: params.text, targetLang: params.targetLang };
  }
  return res.json();
}
