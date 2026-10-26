import React, { useState } from 'react';
import { 
  FileText, 
  Sparkles, 
  Copy, 
  Check, 
  Video, 
  Tag, 
  ShoppingBag, 
  DollarSign, 
  Share2, 
  Download, 
  Layers,
  Flame,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { Marketplace, ListingPackage, ProductOpportunity } from '../types';

interface ListingBuilderTabProps {
  initialProduct?: ProductOpportunity | null;
  onOpenPricing: () => void;
  hasActiveSubscription: boolean;
}

export const ListingBuilderTab: React.FC<ListingBuilderTabProps> = ({
  initialProduct,
  onOpenPricing,
  hasActiveSubscription,
}) => {
  const [productName, setProductName] = useState<string>(
    initialProduct?.name || 'Collapsible Silicone Pour-Over Travel Coffee Dripper Kit'
  );
  const [marketplace, setMarketplace] = useState<Marketplace>(
    initialProduct?.marketplace || 'amazon'
  );
  const [category, setCategory] = useState<string>(
    initialProduct?.category || 'Home & Kitchen'
  );
  const [differentiation, setDifferentiation] = useState<string>(
    initialProduct?.differentiationStrategies?.join(', ') || 'Includes 50 unbleached hemp filters & heat-resistant clip ring'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [listingPackage, setListingPackage] = useState<ListingPackage | null>(null);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeOutputTab, setActiveOutputTab] = useState<'listing' | 'keywords' | 'ads' | 'tiktok'>('listing');

  const handleGenerate = async (overrideParams?: {
    name?: string;
    market?: Marketplace;
    cat?: string;
    diff?: string;
  }) => {
    const targetName = overrideParams?.name ?? productName;
    const targetMarket = overrideParams?.market ?? marketplace;
    const targetCat = overrideParams?.cat ?? category;
    const targetDiff = overrideParams?.diff ?? differentiation;

    if (!targetName.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/ai/build-listing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productName: targetName,
          marketplace: targetMarket,
          category: targetCat,
          differentiation: targetDiff,
        }),
      });
      const data = await res.json();
      setListingPackage(data);
    } catch (err) {
      console.error('Failed to build listing:', err);
    } finally {
      setLoading(false);
    }
  };

  // Sync when initialProduct prop changes
  React.useEffect(() => {
    if (initialProduct) {
      setProductName(initialProduct.name);
      setMarketplace(initialProduct.marketplace);
      setCategory(initialProduct.category);
      const diff = initialProduct.differentiationStrategies?.join(', ') || '';
      setDifferentiation(diff);
      handleGenerate({
        name: initialProduct.name,
        market: initialProduct.marketplace,
        cat: initialProduct.category,
        diff,
      });
    } else if (!listingPackage) {
      handleGenerate();
    }
  }, [initialProduct]);

  const copyToClipboard = (text: string, sectionKey: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionKey);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const exportMarkdown = () => {
    if (!listingPackage) return;
    const md = `# Listing Package: ${listingPackage.productName}
Marketplace: ${listingPackage.marketplace.toUpperCase()}

## Optimized SEO Title
${listingPackage.optimizedTitle}

## Key Product Bullet Points
${listingPackage.bulletPoints.map((b) => `- ${b}`).join('\n')}

## Product Description
${listingPackage.description}

## Backend Search Keywords
${listingPackage.keywords.join(', ')}

## Paid Ad Angles
${listingPackage.adCopy.map((ad) => `### ${ad.targetAngle}\nHook: ${ad.hook}\nBody: ${ad.body}\nCTA: ${ad.cta}\n`).join('\n')}

## Viral TikTok Script
Hook: ${listingPackage.tiktokScript.hookAudio} (Visual: ${listingPackage.tiktokScript.hookVisual})
Body: ${listingPackage.tiktokScript.bodyAudio} (Visual: ${listingPackage.tiktokScript.bodyVisual})
CTA: ${listingPackage.tiktokScript.ctaAudio} (Visual: ${listingPackage.tiktokScript.ctaVisual})
`;

    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${productName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-listing.md`;
    a.click();
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            AI E-Commerce Listing & TikTok Launch Studio
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Build Complete High-Converting Listings in Seconds
          </h1>
          <p className="text-slate-300 text-sm">
            Generate marketplace-compliant SEO titles, psychological bullet points, backend search tags, and viral 30-second TikTok video scripts tailored to your target audience.
          </p>
        </div>

        {/* Input Parameters Form */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          <div className="md:col-span-5 space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Product Name or Concept:</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="e.g. Ergonomic Memory Foam Travel Pillow"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-3 space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Target Marketplace:</label>
            <select
              value={marketplace}
              onChange={(e) => setMarketplace(e.target.value as Marketplace)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="amazon">Amazon FBA</option>
              <option value="tiktok">TikTok Shop</option>
              <option value="shopify">Shopify / DTC</option>
              <option value="etsy">Etsy</option>
              <option value="ebay">eBay</option>
              <option value="mercari">Mercari</option>
              <option value="poshmark">Poshmark</option>
            </select>
          </div>

          <div className="md:col-span-4 space-y-1.5">
            <label className="text-xs font-semibold text-slate-200">Standout Differentiation Angle:</label>
            <input
              type="text"
              value={differentiation}
              onChange={(e) => setDifferentiation(e.target.value)}
              placeholder="e.g. Bundled with leather carrying case"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="md:col-span-12 flex justify-end gap-3 pt-2">
            <button
              onClick={() => handleGenerate()}
              disabled={loading}
              className="py-2.5 px-6 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" />
                  <span>Building Listing Package...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Full Listing Package</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Product Presets */}
        <div className="mt-4 pt-4 border-t border-slate-800/60 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 font-medium">Quick Presets:</span>
          {[
            {
              name: 'Mindful Floral Coloring Books & Kids Activity Sheets Megapack',
              cat: 'Digital Products & Instant Downloads',
              market: 'etsy' as Marketplace,
              diff: 'Includes editable Canva template links + 120 300 DPI pages + Commercial PLR rights',
              label: '🎨 Coloring Sheets & Books (Digital)',
            },
            {
              name: 'DIY Auto & Small Engine Mechanics Troubleshooting Guide & Video Vault',
              cat: 'Digital Products & Instant Downloads',
              market: 'shopify' as Marketplace,
              diff: 'Clickable interactive diagnostic flowcharts + printable laminated torque specs + video QR codes',
              label: '🔧 Mechanics DIY Tutorial (Digital)',
            },
            {
              name: 'Woodworking & Workshop Furniture DIY Build Plans & Cut-Lists',
              cat: 'Digital Products & Instant Downloads',
              market: 'etsy' as Marketplace,
              diff: 'Includes exact hardware store shopping list + 3D CAD schematics + cut-list optimizer',
              label: '🪵 Woodworking Plans (Digital)',
            },
            {
              name: 'Ultimate Hobby DIY Crafts, Resin & Macrame Video Masterclass',
              cat: 'Digital Products & Instant Downloads',
              market: 'tiktok' as Marketplace,
              diff: '40+ printable 1:1 scale cutting stencils + raw materials supplier vault + step-by-step videos',
              label: '🧵 Hobby DIY Masterclass (Digital)',
            },
          ].map((preset, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setProductName(preset.name);
                setCategory(preset.cat);
                setMarketplace(preset.market);
                setDifferentiation(preset.diff);
                handleGenerate({
                  name: preset.name,
                  cat: preset.cat,
                  market: preset.market,
                  diff: preset.diff,
                });
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/70 hover:border-emerald-500/50 transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Output Content */}
      {listingPackage && (
        <div className="space-y-6">
          {/* Subnavigation Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/80 p-2 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-1 overflow-x-auto no-scrollbar w-full sm:w-auto">
              <button
                onClick={() => setActiveOutputTab('listing')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeOutputTab === 'listing'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>SEO Listing & Bullets</span>
              </button>

              <button
                onClick={() => setActiveOutputTab('keywords')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeOutputTab === 'keywords'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>Backend Keywords ({listingPackage.keywords.length})</span>
              </button>

              <button
                onClick={() => setActiveOutputTab('ads')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeOutputTab === 'ads'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Paid Ad Hooks</span>
              </button>

              <button
                onClick={() => setActiveOutputTab('tiktok')}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeOutputTab === 'tiktok'
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>TikTok / Reels Script</span>
              </button>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <button
                onClick={exportMarkdown}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-800 text-xs text-slate-200 hover:bg-slate-700 font-medium"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Markdown</span>
              </button>
            </div>
          </div>

          {/* TAB 1: Listing & Bullets */}
          {activeOutputTab === 'listing' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Title & Bullets */}
              <div className="lg:col-span-8 space-y-6">
                {/* Optimized Title Card */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Optimized SEO Title
                      </span>
                      <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                        {listingPackage.optimizedTitle.length} / 200 chars
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(listingPackage.optimizedTitle, 'title')}
                      className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      {copiedSection === 'title' ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Title
                        </>
                      )}
                    </button>
                  </div>
                  <p className="text-slate-100 font-medium text-sm leading-relaxed p-3 bg-slate-950/70 rounded-xl border border-slate-800/80">
                    {listingPackage.optimizedTitle}
                  </p>
                </div>

                {/* 5 Bullet Points */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      5 Conversion-Focused Feature Bullets
                    </span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          listingPackage.bulletPoints.map((b) => `• ${b}`).join('\n\n'),
                          'all-bullets'
                        )
                      }
                      className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      {copiedSection === 'all-bullets' ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied All!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy All Bullets
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-3">
                    {listingPackage.bulletPoints.map((bullet, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-start justify-between gap-3 group"
                      >
                        <p className="text-xs text-slate-200 leading-relaxed">
                          {bullet}
                        </p>
                        <button
                          onClick={() => copyToClipboard(bullet, `b-${idx}`)}
                          className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-white transition-opacity shrink-0 p-1"
                          title="Copy bullet"
                        >
                          {copiedSection === `b-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Full Product Description Copy
                    </span>
                    <button
                      onClick={() => copyToClipboard(listingPackage.description, 'desc')}
                      className="flex items-center gap-1 text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                      {copiedSection === 'desc' ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> Copied!
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" /> Copy Description
                        </>
                      )}
                    </button>
                  </div>
                  <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed whitespace-pre-line">
                    {listingPackage.description}
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing Engine & Tips */}
              <div className="lg:col-span-4 space-y-6">
                <div className="rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <DollarSign className="w-4 h-4 text-emerald-400" />
                    <span>Algorithmic Pricing Tiers</span>
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-200">Recommended Retail</div>
                        <div className="text-[11px] text-slate-400">Optimal margin & search volume</div>
                      </div>
                      <div className="text-base font-extrabold text-emerald-400">
                        ${listingPackage.pricingRecommendation?.recommendedPrice?.toFixed(2) || '34.99'}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-200">Psychological Price</div>
                        <div className="text-[11px] text-slate-400">Sub-$30 impulse buy velocity</div>
                      </div>
                      <div className="text-base font-extrabold text-teal-300">
                        ${listingPackage.pricingRecommendation?.psychologicalPrice?.toFixed(2) || '29.99'}
                      </div>
                    </div>

                    <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                      <div>
                        <div className="font-semibold text-slate-200">Bundled / 2-Pack</div>
                        <div className="text-[11px] text-slate-400">Higher AOV & shipping leverage</div>
                      </div>
                      <div className="text-base font-extrabold text-indigo-300">
                        ${listingPackage.pricingRecommendation?.bundleOpportunityPrice?.toFixed(2) || '44.90'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Listing Quality Checklist */}
                <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Listing Optimization Score
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="text-3xl font-extrabold text-emerald-400">96/100</div>
                    <div className="text-xs text-slate-400">A+ Content Ready. Exceeds standard marketplace guidelines.</div>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-2 pt-2 border-t border-slate-800">
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Primary keywords placed in first 80 chars</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Mobile-scannable bullet points with hooks</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Zero banned guarantee or trademark infringement</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Backend Search Keywords */}
          {activeOutputTab === 'keywords' && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-base font-bold text-white">Backend Search Terms & Tags</h3>
                  <p className="text-xs text-slate-400">
                    Paste these high-intent indexing tags into your Seller Central backend search terms or Shopify tags.
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(listingPackage.keywords.join(', '), 'all-keywords')}
                  className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-2"
                >
                  {copiedSection === 'all-keywords' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  <span>Copy All Comma-Separated</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2">
                {listingPackage.keywords.map((kw, i) => (
                  <button
                    key={i}
                    onClick={() => copyToClipboard(kw, `kw-${i}`)}
                    className="group px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 text-xs font-medium text-slate-200 flex items-center gap-2 transition-colors"
                  >
                    <span>{kw}</span>
                    <span className="text-[10px] text-slate-500 group-hover:text-emerald-400">
                      {copiedSection === `kw-${i}` ? '✓' : '+'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Paid Ad Angles */}
          {activeOutputTab === 'ads' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {listingPackage.adCopy.map((ad, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-slate-900 border border-slate-800 p-6 flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                        Angle {idx + 1}: {ad.targetAngle}
                      </span>
                      <button
                        onClick={() =>
                          copyToClipboard(
                            `Hook: ${ad.hook}\n\n${ad.body}\n\nCTA: ${ad.cta}`,
                            `ad-${idx}`
                          )
                        }
                        className="text-slate-400 hover:text-white"
                      >
                        {copiedSection === `ad-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <div>
                        <span className="font-semibold text-slate-400 block mb-0.5">Scroll-Stopping Hook:</span>
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 font-medium">
                          "{ad.hook}"
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold text-slate-400 block mb-0.5">Ad Body Copy:</span>
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-300">
                          {ad.body}
                        </div>
                      </div>

                      <div>
                        <span className="font-semibold text-slate-400 block mb-0.5">Call to Action:</span>
                        <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-bold">
                          {ad.cta}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: TikTok / Reels Video Script */}
          {activeOutputTab === 'tiktok' && (
            <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Video className="w-5 h-5 text-rose-400" />
                    <span>30-Second Viral TikTok / Reels Video Script</span>
                  </h3>
                  <p className="text-xs text-slate-400">
                    Format: Visual Cues & Spoken Audio for maximum organic watch-time retention.
                  </p>
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <a
                    href="https://www.tiktok.com/tiktokstudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-rose-950/40 transition-all cursor-pointer"
                    title="Open TikTok Studio for Reels & Shorts"
                  >
                    <Video className="w-4 h-4" />
                    <span>Open TikTok Studio</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                  </a>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `[0-3s HOOK]\nVisual: ${listingPackage.tiktokScript.hookVisual}\nAudio: "${listingPackage.tiktokScript.hookAudio}"\n\n[4-22s DEMONSTRATION]\nVisual: ${listingPackage.tiktokScript.bodyVisual}\nAudio: "${listingPackage.tiktokScript.bodyAudio}"\n\n[23-30s CTA]\nVisual: ${listingPackage.tiktokScript.ctaVisual}\nAudio: "${listingPackage.tiktokScript.ctaAudio}"`,
                        'tt-script'
                      )
                    }
                    className="flex-1 sm:flex-none px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {copiedSection === 'tt-script' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    <span>Copy Full Script</span>
                  </button>
                </div>
              </div>

              {/* TikTok Studio & Reels Creator Quick Launch Hub */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-slate-950 via-slate-900 to-rose-950/40 border border-rose-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-500/20 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0 mt-0.5">
                    <Video className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">TikTok Studio for Reels & Video Commerce</h4>
                      <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.5 rounded font-extrabold uppercase tracking-wide">
                        Creator Hub
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Ready to film? Record your 9:16 vertical reel using this script, upload directly to TikTok Studio or Instagram Reels, and link your product showcase.
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
                  <a
                    href="https://www.tiktok.com/tiktokstudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none px-3.5 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer"
                  >
                    <span>Launch TikTok Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                    title="Trending hashtags and viral sounds"
                  >
                    <span>Trending Sounds</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href="https://business.facebook.com/creatorstudio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 md:flex-none px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs flex items-center justify-center gap-1.5 border border-slate-700 transition-all cursor-pointer"
                    title="Instagram & Facebook Reels Studio"
                  >
                    <span>Instagram Reels</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* 0-3s Hook */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                      Part 1: The Hook (0-3s)
                    </span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded font-bold">
                      Stop The Scroll
                    </span>
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Visual Action:</span>
                      <p className="text-slate-200 italic">{listingPackage.tiktokScript.hookVisual}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Spoken Voiceover:</span>
                      <p className="text-emerald-300 font-medium">"{listingPackage.tiktokScript.hookAudio}"</p>
                    </div>
                  </div>
                </div>

                {/* 4-22s Demonstration */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Part 2: Demonstration (4-22s)
                    </span>
                    <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                      Show Transformation
                    </span>
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Visual Action:</span>
                      <p className="text-slate-200 italic">{listingPackage.tiktokScript.bodyVisual}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Spoken Voiceover:</span>
                      <p className="text-slate-100 font-medium">"{listingPackage.tiktokScript.bodyAudio}"</p>
                    </div>
                  </div>
                </div>

                {/* 23-30s Call To Action */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      Part 3: Call to Action (23-30s)
                    </span>
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
                      Drive Sales
                    </span>
                  </div>
                  <div className="text-xs space-y-2">
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Visual Action:</span>
                      <p className="text-slate-200 italic">{listingPackage.tiktokScript.ctaVisual}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-semibold block text-[11px]">Spoken Voiceover:</span>
                      <p className="text-emerald-300 font-bold">"{listingPackage.tiktokScript.ctaAudio}"</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
