import React, { useState, useEffect } from 'react';
import { 
  Radar, 
  DollarSign, 
  ShoppingBag, 
  TrendingUp, 
  ShieldAlert, 
  Sparkles, 
  Layers, 
  ArrowRight, 
  CheckCircle, 
  Info, 
  Package, 
  BarChart3,
  Flame,
  Truck,
  HelpCircle,
  ExternalLink,
  Download,
  BookOpen,
  Wand2,
  FileText,
  Palette,
  Wrench,
  Hammer,
  Search,
  Globe,
  RefreshCw,
  Zap,
  Tag
} from 'lucide-react';
import { Marketplace, InventoryType, ProductOpportunity, WebGroundingSource } from '../types';

interface ScoutTabProps {
  onSelectProductForListing: (product: ProductOpportunity) => void;
  onNavigateToDigitalBuilder?: (prompt?: string, type?: string) => void;
  onOpenPricing: () => void;
  hasActiveSubscription: boolean;
}

interface RealtimeSearchMeta {
  scrapedAt?: string;
  queries?: string[];
  marketSignals?: string[];
  groundingSourcesCount?: number;
  engine?: string;
}

export const ScoutTab: React.FC<ScoutTabProps> = ({
  onSelectProductForListing,
  onNavigateToDigitalBuilder,
  onOpenPricing,
  hasActiveSubscription,
}) => {
  const [budget, setBudget] = useState<number>(500);
  const [marketplace, setMarketplace] = useState<Marketplace>('amazon');
  const [inventoryType, setInventoryType] = useState<InventoryType>('private_label');
  const [category, setCategory] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<number>(0);
  const [opportunities, setOpportunities] = useState<ProductOpportunity[]>([]);
  const [hasSearched, setHasSearched] = useState<boolean>(false);
  const [selectedFeeModal, setSelectedFeeModal] = useState<ProductOpportunity | null>(null);
  const [realtimeMeta, setRealtimeMeta] = useState<RealtimeSearchMeta | null>(null);
  const [expandedSourcesId, setExpandedSourcesId] = useState<string | null>(null);

  const marketplaces: { id: Marketplace; label: string; icon: string; tag: string }[] = [
    { id: 'amazon', label: 'Amazon FBA / KDP', icon: '📦', tag: 'Highest Volume' },
    { id: 'tiktok', label: 'TikTok Shop / Showcase', icon: '🎵', tag: 'Fastest Viral Trend' },
    { id: 'shopify', label: 'Shopify / DTC Digital', icon: '🛍️', tag: 'Highest Margins' },
    { id: 'etsy', label: 'Etsy Digital Downloads', icon: '🌿', tag: 'Low Fee / High Demand' },
    { id: 'ebay', label: 'eBay', icon: '🏷️', tag: 'Immediate Cash Flow' },
    { id: 'mercari', label: 'Mercari', icon: '⚡', tag: 'Fast Clearance' },
    { id: 'poshmark', label: 'Poshmark', icon: '👠', tag: 'Apparel & Accessories' },
  ];

  const inventoryOptions: { id: InventoryType; label: string; desc: string }[] = [
    { id: 'digital_products', label: 'Digital Products & Instant Downloads', desc: 'Coloring sheets, books, DIY tutorials, mechanics manuals (0% shipping, 90%+ margins)' },
    { id: 'private_label', label: 'Private Label Physical', desc: 'Custom branded products with high margins' },
    { id: 'wholesale', label: 'Wholesale & B2B', desc: 'Established brands from verified distributors' },
    { id: 'dropshipping', label: 'Fast Fulfillment / DTC', desc: 'Low initial capital with fast test velocity' },
    { id: 'arbitrage', label: 'Retail & Online Arbitrage', desc: 'Clearance and underpriced brand flips' },
    { id: 'print_on_demand', label: 'Print On Demand', desc: 'Zero inventory risk custom designs' },
    { id: 'liquidation', label: 'Pallets & Liquidation', desc: 'High ROI overstock & customer returns' },
  ];

  const categories = [
    { id: 'all', label: 'All High-Yield Opportunities' },
    { id: 'Digital Products & Instant Downloads', label: '🎨 Digital Downloads (Coloring, Tutorials, Guides & Books)' },
    { id: 'Home & Kitchen', label: 'Home & Kitchen' },
    { id: 'Electronics & Accessories', label: 'Electronics & Tech Gadgets' },
    { id: 'Beauty & Sustainable Home', label: 'Beauty & Self Care' },
    { id: 'Sports & Fitness', label: 'Sports & Active Lifestyle' },
    { id: 'Pet Supplies', label: 'Pet Products & Toys' },
    { id: 'Outdoor & Travel', label: 'Outdoor, Travel & EDC' },
  ];

  const scrapingProgressSteps = [
    'Connecting to live Google Search index & autocomplete feeds...',
    'Scraping TikTok Shop trending showcases & Amazon Movers & Shakers...',
    'Extracting competitor pricing spreads & supplier wholesale cost...',
    'Synthesizing verified high-yield opportunity blueprints...',
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      setLoadingStep(0);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev < scrapingProgressSteps.length - 1 ? prev + 1 : prev));
      }, 900);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleScout = async (overrideParams?: {
    customMarketplace?: Marketplace;
    customInventoryType?: InventoryType;
    customCategory?: string;
  }) => {
    setLoading(true);
    setHasSearched(true);
    
    const targetMarketplace = overrideParams?.customMarketplace || marketplace;
    const targetInventoryType = overrideParams?.customInventoryType || inventoryType;
    const targetCategory = overrideParams?.customCategory || category;

    if (overrideParams?.customMarketplace) setMarketplace(overrideParams.customMarketplace);
    if (overrideParams?.customInventoryType) setInventoryType(overrideParams.customInventoryType);
    if (overrideParams?.customCategory) setCategory(overrideParams.customCategory);

    try {
      const res = await fetch('/api/ai/scout-products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget,
          marketplace: targetMarketplace,
          inventoryType: targetInventoryType,
          category: targetCategory,
        }),
      });
      const data = await res.json();
      if (data.opportunities) {
        setOpportunities(data.opportunities);
      }
      if (data.realtimeSearch) {
        setRealtimeMeta(data.realtimeSearch);
      }
    } catch (err) {
      console.error('Failed to scout:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run initial scout if empty
  useEffect(() => {
    if (opportunities.length === 0 && !hasSearched) {
      handleScout();
    }
  }, []);

  return (
    <div className="space-y-8 pb-16">
      {/* Live Deep Internet Search & Scrape Banner Header */}
      <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-indigo-950/70 border border-emerald-500/30 rounded-2xl p-4 sm:p-5 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-lg">
              <Globe className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-extrabold text-white text-sm sm:text-base">
                  Real-Time Deep Internet Search & Web Scraper
                </span>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 text-slate-950">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-ping inline-block" />
                  LIVE SEARCH ACTIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Crawl real-time trending products, search query volumes, and competitor price spreads across Google Search, TikTok Shop, Amazon Movers & Shakers, and Etsy.
              </p>
            </div>
          </div>

          {/* Quick preset live scrape triggers */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => handleScout({ customMarketplace: 'tiktok', customInventoryType: 'private_label' })}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Scrape Viral TikTok Shop Trending Showcase"
            >
              <span>🎵 TikTok Viral</span>
            </button>
            <button
              onClick={() => handleScout({ customMarketplace: 'amazon', customInventoryType: 'private_label' })}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Scrape Amazon Movers & Shakers"
            >
              <span>📦 Amazon Bestsellers</span>
            </button>
            <button
              onClick={() => handleScout({ customMarketplace: 'etsy', customInventoryType: 'digital_products', customCategory: 'Digital Products & Instant Downloads' })}
              disabled={loading}
              className="px-3 py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              title="Scrape Trending Etsy Digital Downloads ($0 MOQ)"
            >
              <span>🎨 Etsy Digital Downloads</span>
            </button>
          </div>
        </div>

        {/* Real-time telemetry ticker */}
        {realtimeMeta && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <Search className="w-3 h-3" />
                Live Queries Scraped:
              </span>
              {realtimeMeta.queries?.slice(0, 3).map((q, i) => (
                <span key={i} className="text-slate-300 bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
                  "{q}"
                </span>
              ))}
            </div>
            <div className="text-slate-500">
              Scraped timestamp: {new Date(realtimeMeta.scrapedAt || Date.now()).toLocaleTimeString()}
            </div>
          </div>
        )}
      </div>

      {/* Main Filter / Input Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-2">
            Tell us your budget & marketplace. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-200 bg-clip-text text-transparent">
              We scout real-time trending products & calculate exact margins.
            </span>
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Eliminate guesswork. Start with as little as <strong className="text-emerald-400 font-bold">$5</strong> for zero-inventory digital downloads (coloring sheets, DIY tutorials, mechanics guides) or scale up to physical private label.
          </p>
        </div>

        {/* Filter Input Grid */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          {/* Budget Input (starting at $5) */}
          <div className="md:col-span-4 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <label className="font-semibold text-slate-200 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                Starting Capital / Budget:
              </label>
              <div className="flex items-center gap-1">
                <span className="text-slate-400 text-[11px]">Min $5</span>
                <span className="font-extrabold text-emerald-400 text-sm">
                  ${budget.toLocaleString()} USD
                </span>
              </div>
            </div>

            <input
              type="range"
              min="5"
              max="10000"
              step="5"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />

            {/* Quick preset buttons starting at $5 */}
            <div className="flex justify-between gap-1 text-[11px] text-slate-400 pt-1">
              {[5, 25, 100, 500, 1500, 5000].map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBudget(b)}
                  className={`px-2 py-0.5 rounded border transition-colors ${
                    budget === b
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold'
                      : 'border-slate-800 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  ${b >= 1000 ? `${b / 1000}k` : b}
                </button>
              ))}
            </div>
          </div>

          {/* Marketplace Selector */}
          <div className="md:col-span-3 space-y-2">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <ShoppingBag className="w-3.5 h-3.5 text-teal-400" />
              Target Marketplace:
            </label>
            <select
              value={marketplace}
              onChange={(e) => setMarketplace(e.target.value as Marketplace)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {marketplaces.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.icon} {m.label} ({m.tag})
                </option>
              ))}
            </select>
          </div>

          {/* Inventory Model */}
          <div className="md:col-span-3 space-y-2">
            <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-indigo-400" />
              Inventory Model:
            </label>
            <select
              value={inventoryType}
              onChange={(e) => setInventoryType(e.target.value as InventoryType)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {inventoryOptions.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.label}
                </option>
              ))}
            </select>
          </div>

          {/* Action Button */}
          <div className="md:col-span-2">
            <button
              onClick={() => handleScout()}
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Radar className="w-4 h-4 animate-spin" />
                  <span>Scraping...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Deep Web Scout</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Loading Step Progress Banner */}
        {loading && (
          <div className="mt-4 p-3 rounded-xl bg-slate-950/80 border border-emerald-500/40 text-xs text-slate-300 flex items-center gap-3">
            <RefreshCw className="w-4 h-4 text-emerald-400 animate-spin shrink-0" />
            <div className="flex-1">
              <span className="font-bold text-emerald-300">Live Web Crawler: </span>
              <span>{scrapingProgressSteps[loadingStep]}</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              Step {loadingStep + 1}/4
            </span>
          </div>
        )}

        {/* Low-Budget ($5-$100) Digital Product Callout Banner */}
        {budget <= 100 && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-200">
              <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>
                <strong>Starting with ${budget}?</strong> Digital Products (coloring sheets, DIY tutorials, auto/mechanics repair guides, woodworking plans) require virtually <strong>$0 inventory</strong> and provide <strong>90%+ pure profit margins</strong>.
              </span>
            </div>
            {onNavigateToDigitalBuilder && (
              <button
                type="button"
                onClick={() => onNavigateToDigitalBuilder()}
                className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs whitespace-nowrap hover:bg-emerald-400 transition-colors flex items-center gap-1 shadow-sm"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Open Digital Builder</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <span className="text-xs text-slate-400 whitespace-nowrap flex items-center gap-1">
          <Package className="w-3.5 h-3.5" />
          Filter by Niche:
        </span>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => {
              setCategory(c.id);
              handleScout({ customCategory: c.id });
            }}
            className={`text-xs px-3 py-1.5 rounded-full whitespace-nowrap border transition-all cursor-pointer ${
              category === c.id
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 font-bold'
                : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Product Opportunities List */}
      <div className="space-y-6">
        {opportunities.map((opp, index) => {
          const isDigitalProduct = 
            opp.inventoryType === 'digital_products' || 
            opp.category.toLowerCase().includes('digital') ||
            opp.name.toLowerCase().includes('coloring') ||
            opp.name.toLowerCase().includes('mechanic') ||
            opp.name.toLowerCase().includes('tutorial') ||
            opp.name.toLowerCase().includes('download');

          const isExpandedSources = expandedSourcesId === opp.id;

          return (
            <div
              key={opp.id || index}
              className={`rounded-2xl border transition-all duration-300 p-6 sm:p-7 relative overflow-hidden group ${
                isDigitalProduct
                  ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border-indigo-500/40 shadow-xl shadow-indigo-950/20 hover:border-indigo-400'
                  : 'bg-slate-900 border-slate-800 hover:border-slate-700 shadow-xl'
              }`}
            >
              {/* Top Accent Ribbon for Digital Products */}
              {isDigitalProduct && (
                <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-500 to-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider px-3 py-1 rounded-bl-xl shadow-md flex items-center gap-1">
                  <Wand2 className="w-3 h-3" />
                  <span>Instant Digital Download • 90%+ Pure Profit</span>
                </div>
              )}

              <div className="space-y-5">
                {/* Title & Real-time Scrape Badges */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pt-1">
                  <div className="space-y-1.5 flex-1 pr-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                        <Globe className="w-3 h-3 text-emerald-400" />
                        REALTIME SCRAPED
                      </span>

                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {opp.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {opp.marketplace.toUpperCase()}
                      </span>
                      {isDigitalProduct ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                          ⚡ Instant Download (Zero Shipping Cost)
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800/80 text-slate-400">
                          {opp.inventoryType.replace('_', ' ')}
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-emerald-300 transition-colors leading-snug">
                      {opp.name}
                    </h3>

                    {/* Live Market Signal Line */}
                    {opp.liveMarketSignal && (
                      <p className="text-xs text-emerald-400 font-medium flex items-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{opp.liveMarketSignal}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col items-end shrink-0">
                    <div className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 px-2 py-1 rounded-lg text-emerald-300 text-xs font-extrabold">
                      <Flame className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{opp.demandScore}/100 Demand</span>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-0.5 font-semibold text-right">
                      {opp.trendVelocity}
                    </span>
                    {opp.scrapedSearchVolume && (
                      <span className="text-[10px] text-slate-500 mt-0.5">
                        {opp.scrapedSearchVolume}
                      </span>
                    )}
                  </div>
                </div>

                {/* Scraped Competitor Price Range & Numbers Bar */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 space-y-2">
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Creation / Source</div>
                      <div className="text-sm font-bold text-slate-200">
                        ${opp.sourcingCost <= 0.5 ? '0.00' : opp.sourcingCost.toFixed(2)}
                      </div>
                    </div>

                    <div>
                      <div className="text-[10px] text-slate-400 font-medium">Target Sell Price</div>
                      <div className="text-sm font-bold text-slate-100">${opp.sellingPrice.toFixed(2)}</div>
                    </div>

                    <div>
                      <button 
                        onClick={() => setSelectedFeeModal(opp)}
                        className="text-[10px] text-slate-400 font-medium hover:text-emerald-400 underline flex items-center justify-center gap-0.5 mx-auto cursor-pointer"
                      >
                        <span>Platform Fees</span>
                        <Info className="w-2.5 h-2.5" />
                      </button>
                      <div className="text-sm font-bold text-rose-400">
                        -${(opp.fees.totalPlatformFees + opp.shippingCost).toFixed(2)}
                      </div>
                    </div>

                    <div className="bg-emerald-950/40 rounded-lg py-0.5 border border-emerald-500/30">
                      <div className="text-[10px] text-emerald-400 font-extrabold">Net Profit / Unit</div>
                      <div className="text-sm font-black text-emerald-300">
                        +${opp.netProfit.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Scraped Competitor Spread Indicator */}
                  {opp.competitorPriceRange && (
                    <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center justify-between text-[11px] text-slate-400 px-1">
                      <span className="flex items-center gap-1">
                        <Tag className="w-3 h-3 text-slate-500" />
                        Scraped Competitor Price Range: <strong className="text-slate-200">{opp.competitorPriceRange}</strong>
                      </span>
                      <span>
                        Net Margin: <strong className="text-emerald-400">{opp.profitMarginPercent}%</strong> (Est. ROI: <strong className="text-emerald-300">+{opp.estimatedRoiPercent}%</strong>)
                      </span>
                    </div>
                  )}
                </div>

                {/* 3 Differentiation Strategies */}
                <div className="space-y-1.5">
                  <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>How to Win (Scraped Unfair Advantage Strategies):</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {opp.differentiationStrategies.map((strat, i) => (
                      <div key={i} className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-2.5 text-xs text-slate-300 flex items-start gap-2">
                        <span className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 font-black text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{strat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Grounding Links & Citations Bar */}
                {opp.groundingSources && opp.groundingSources.length > 0 && (
                  <div className="bg-slate-950/40 border border-slate-800/70 rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
                        <Globe className="w-3.5 h-3.5 text-teal-400" />
                        <span>Live Internet Search Citations & Verification Grounding:</span>
                      </div>
                      <button
                        onClick={() => setExpandedSourcesId(isExpandedSources ? null : opp.id)}
                        className="text-[11px] text-emerald-400 hover:text-emerald-300 font-semibold cursor-pointer"
                      >
                        {isExpandedSources ? 'Hide Sources' : `View ${opp.groundingSources.length} Live Links ↗`}
                      </button>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {opp.groundingSources.slice(0, isExpandedSources ? undefined : 3).map((source, sIdx) => (
                        <a
                          key={sIdx}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 text-[11px] transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 text-slate-400" />
                          <span className="truncate max-w-[220px]">{source.title}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>Est. Volume: <strong className="text-slate-200">{opp.estimatedMonthlyUnits} units/mo</strong></span>
                    <span>·</span>
                    <span>Est. Profit: <strong className="text-emerald-400">+${(opp.estimatedMonthlyProfit || 0).toLocaleString()}/mo</strong></span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    {/* Re-Scrape Live Data button */}
                    <button
                      onClick={() => handleScout()}
                      disabled={loading}
                      title="Re-scrape fresh live search results right now"
                      className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      <span>Re-Scrape</span>
                    </button>

                    {/* Digital Builder CTA if digital */}
                    {isDigitalProduct && onNavigateToDigitalBuilder && (
                      <button
                        onClick={() => onNavigateToDigitalBuilder(opp.name)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Build Digital Assets ($0 MOQ)</span>
                      </button>
                    )}

                    {/* Listing Studio CTA */}
                    <button
                      onClick={() => onSelectProductForListing(opp)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Create SEO Listing & Ads</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fee Breakdown Modal */}
      {selectedFeeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-white text-base">Platform Fee & Margin Audit</h3>
                <p className="text-xs text-slate-400 truncate max-w-[280px]">
                  {selectedFeeModal.name}
                </p>
              </div>
              <button
                onClick={() => setSelectedFeeModal(null)}
                className="text-slate-400 hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs divide-y divide-slate-800">
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Retail Sell Price:</span>
                <span className="font-bold text-white">${selectedFeeModal.sellingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Creation / Sourcing Cost:</span>
                <span className="font-bold text-slate-300">-${selectedFeeModal.sourcingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Marketplace Referral / Cut:</span>
                <span className="font-bold text-rose-400">-${selectedFeeModal.fees.referralFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Payment Processing & Listing Fees:</span>
                <span className="font-bold text-rose-400">-${selectedFeeModal.fees.paymentFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-slate-400">Shipping / Fulfillment:</span>
                <span className="font-bold text-slate-300">
                  {selectedFeeModal.shippingCost === 0 ? '$0.00 (Instant Download)' : `-$${selectedFeeModal.shippingCost.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between pt-3 font-bold text-sm text-emerald-400">
                <span>Net Cash Profit / Sale:</span>
                <span>+${selectedFeeModal.netProfit.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 text-slate-300">
                <span>Net Profit Margin:</span>
                <span className="font-bold text-emerald-400">{selectedFeeModal.profitMarginPercent}%</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedFeeModal(null)}
              className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
            >
              Close Fee Audit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
