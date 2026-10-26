export type Marketplace = 
  | 'amazon' 
  | 'ebay' 
  | 'shopify' 
  | 'etsy' 
  | 'tiktok' 
  | 'mercari' 
  | 'poshmark';

export type InventoryType = 
  | 'digital_products'
  | 'private_label' 
  | 'wholesale' 
  | 'dropshipping' 
  | 'arbitrage' 
  | 'print_on_demand' 
  | 'liquidation';

export interface FeeBreakdown {
  referralFee: number;
  fulfillmentFee: number;
  paymentFee: number;
  totalPlatformFees: number;
}

export interface WebGroundingSource {
  title: string;
  url: string;
  domain?: string;
}

export interface ProductOpportunity {
  id: string;
  name: string;
  category: string;
  marketplace: Marketplace;
  inventoryType: InventoryType;
  sourcingCost: number;
  sellingPrice: number;
  fees: FeeBreakdown;
  shippingCost: number;
  netProfit: number;
  profitMarginPercent: number;
  estimatedRoiPercent: number;
  competitionLevel: 'Low' | 'Medium' | 'High';
  reviewBarrier: string;
  seasonality: 'All-Year Evergreen' | 'Spring/Summer Peak' | 'Q4 Holiday Spike' | 'Moderate Seasonal';
  demandScore: number; // 1-100
  trendVelocity: 'Rapid Growth' | 'Steady Climber' | 'Viral Surge' | 'Stable High Demand' | string;
  differentiationStrategies: string[];
  whyItWorks: string;
  supplierRecommendation: string;
  riskNotice: string;
  estimatedMonthlyUnits: number;
  estimatedMonthlyProfit: number;
  realtimeScraped?: boolean;
  scrapedAt?: string;
  groundingSources?: WebGroundingSource[];
  searchQueries?: string[];
  liveMarketSignal?: string;
  scrapedSearchVolume?: string;
  competitorPriceRange?: string;
}

export interface ListingPackage {
  productName: string;
  marketplace: Marketplace;
  optimizedTitle: string;
  bulletPoints: string[];
  description: string;
  keywords: string[];
  adCopy: {
    hook: string;
    body: string;
    cta: string;
    targetAngle: string;
  }[];
  tiktokScript: {
    hookVisual: string;
    hookAudio: string;
    bodyVisual: string;
    bodyAudio: string;
    ctaVisual: string;
    ctaAudio: string;
  };
  pricingRecommendation: {
    recommendedPrice: number;
    psychologicalPrice: number;
    bundleOpportunityPrice: number;
  };
}

export interface FlipChannelEstimate {
  channel: string;
  marketplaceName: string;
  typicalSalePrice: number;
  estimatedPlatformFees: number;
  estimatedShipping: number;
  netPayout: number;
  netProfit: number;
  roiPercent: number;
  daysToSellEstimate: string;
  recommended: boolean;
}

export interface FlipPhotoAnalysisResult {
  identifiedItem: string;
  brand: string;
  model: string;
  detectedCondition: string;
  confidenceScore: number;
  visualHighlights: string[];
  cosmeticFlaws: string[];
  estimatedResaleRange: {
    min: number;
    max: number;
    suggestedAverage: number;
  };
  photoQualityScore: number;
  marketplaceTips: string[];
}

export interface FlipEstimateResult {
  itemName: string;
  condition: string;
  purchasePrice: number;
  bestChannel: string;
  maxNetProfit: number;
  channels: FlipChannelEstimate[];
  quickListingTitle: string;
  quickListingDescription: string;
  confidenceScore: number;
  photoCount?: number;
  photoHighlights?: string[];
  isCurrencyOrFaceValue?: boolean;
  flipViability?: 'Unprofitable / Face Value Only' | 'Risky / Thin Margin' | 'Moderate Flip' | 'Highly Profitable';
  valuationNotes?: string;
  marketPriceLow?: number;
  marketPriceHigh?: number;
  estimatedMarketValue?: number;
}

export interface LaunchStep {
  id: number;
  title: string;
  phase: 'Phase 1: Validation & Sourcing' | 'Phase 2: Branding & Listing' | 'Phase 3: Launch & Scale';
  description: string;
  actionItem: string;
  completed: boolean;
  proTip: string;
}

export type BillingInterval = 'monthly' | 'yearly';

export interface SubscriptionPlan {
  id: string;
  name: string;
  tagline: string;
  description?: string;
  badge?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  monthlyPriceId?: string;
  yearlyPriceId?: string;
  stripeProductId?: string;
  trialDays: number;
  features: string[];
  limitations?: string[];
  popular?: boolean;
}

export interface UserSubscription {
  status: 'trialing' | 'active' | 'past_due' | 'canceled' | 'none';
  planId: string;
  planName: string;
  interval: BillingInterval;
  trialStart?: string;
  trialEnd?: string;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd?: boolean;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  activationPasscode?: string;
  isActivated?: boolean;
}

export interface StripeConfigStatus {
  isConfigured: boolean;
  publishableKey?: string;
  isLiveMode: boolean;
  hasWebhookSecret: boolean;
  accountEmail?: string;
}

export interface OneTimeUpgrade {
  id: string;
  title: string;
  price: number;
  description: string;
  features: string[];
}

export type DigitalProductType = 
  | 'cricut_svg_decals'
  | 'coloring_book'
  | 'mechanics_tutorial'
  | 'diy_hobbies'
  | 'woodworking_plans'
  | 'digital_planner'
  | 'educational_ebook'
  | 'other_download';

export interface CricutCutAsset {
  svgContent: string;
  dxfContent?: string;
  previewWidthInches: number;
  previewHeightInches: number;
  recommendedBlade: string;
  materialPreset: string;
  cutPressure: string;
  mirrorRequired: boolean;
  layerCount: number;
  layerColors?: string[];
  weedingDifficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  compatibleMachinery: string[];
}

export interface PromptEnhanceResult {
  originalPrompt: string;
  enhancedPrompt: string;
  nicheAngle: string;
  targetBuyer: string;
  keyHooks: string[];
}

export interface DigitalProductModule {
  stepOrPageNumber: number;
  title: string;
  description: string;
  actionableContent: string;
  promptOrTemplateLink?: string;
}

export interface DigitalProductPackage {
  id: string;
  title: string;
  subtitle: string;
  productType: DigitalProductType;
  targetAudience: string;
  suggestedPrice: number;
  deliveryFormat: string;
  fileSpecs: string;
  modules: DigitalProductModule[];
  fullGuideText: string;
  midjourneyPrompts?: string[];
  customerDeliveryPage: string;
  commercialLicense: string;
  bonusLeadMagnet: string;
  cricutCutAsset?: CricutCutAsset;
}
