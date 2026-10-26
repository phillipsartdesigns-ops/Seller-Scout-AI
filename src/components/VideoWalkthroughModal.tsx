import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack, 
  Maximize2, 
  Minimize2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  CreditCard, 
  Video,
  X,
  CheckCircle2,
  Clock,
  Calculator,
  BarChart3,
  PieChart,
  ArrowUpRight,
  Percent,
  Layers,
  Zap,
  ExternalLink,
  Download,
  Send,
  Smartphone,
  Globe,
  ShoppingCart,
  Plug,
  Tag,
  FileText
} from 'lucide-react';
import { translateVoiceoverApi } from '../services/api';

interface SlideCalculation {
  label: string;
  formula?: string;
  result: string;
  detail?: string;
}

interface Slide {
  id: number;
  stepNumber: string;
  chapter: string;
  title: string;
  subtitle: string;
  scenario: string;
  voiceoverText: string;
  highlightStats: { label: string; value: string; color: string; sub?: string }[];
  calculations: SlideCalculation[];
  keyTakeaway: string;
}

export type WalkthroughTrack = 'startToSale' | 'financialProof';

const START_TO_SALE_SLIDES: Slide[] = [
  {
    id: 1,
    stepNumber: 'Stage 1 of 5',
    chapter: 'Stage 1: AI Opportunity Discovery',
    title: 'Finding What Sells on Amazon, Etsy, TikTok & eBay',
    subtitle: 'Zero Guesswork Sourcing Algorithm with Upfront Profit Calculations',
    scenario: 'You start by setting your working capital budget ($5 to $1,000+) and target marketplace. Seller Scout AI analyzes competitor listing sales velocity, review barrier, referral fees, and shipping costs to pinpoint high-margin, low-competition products before you spend a dime.',
    voiceoverText: "Welcome to the complete start to sale Seller Scout walkthrough. Stage One begins with Opportunity Discovery. You select your budget and target marketplace—whether Amazon, Etsy, TikTok Shop, or eBay. Our AI scout analyzes historical sales velocity, review barriers, and every hidden fee—including platform cuts, card interchange, and fulfillment. You see your exact net margin in green before investing a single dollar.",
    highlightStats: [
      { label: 'Target Marketplace', value: 'Multi-Channel', color: 'text-indigo-400', sub: 'Amazon, Etsy, TikTok, eBay' },
      { label: 'Calculated Net Margin', value: '56.3% - 94.8%', color: 'text-emerald-400', sub: 'Pre-computed after all fees' },
      { label: 'Initial Capital', value: '$25 - $500', color: 'text-amber-400', sub: 'Flexible budget slider' },
    ],
    calculations: [
      { label: 'Estimated Monthly Demand', formula: 'Calculated from Amazon BSR & category volume', result: '420 units / mo', detail: 'Consistent organic buyer searches' },
      { label: 'Gross Retail Price', formula: 'Target consumer price based on market median', result: '$24.99 retail', detail: 'Optimized psychological pricing' },
      { label: 'Total Deductions', formula: '15% referral ($3.75) + FBA ($6.82) + processing ($1.03)', result: '-$11.60 total fees', detail: 'Zero unexpected surprise costs' },
      { label: 'Net Take-Home Profit', formula: '$24.99 retail - $4.10 cost - $11.60 platform fees', result: '+$14.07 net profit', detail: '56.3% clean margin on physical' }
    ],
    keyTakeaway: 'Never guess what to sell. Let algorithmic calculations prove net profitability and platform fees before spending money.'
  },
  {
    id: 2,
    stepNumber: 'Stage 2 of 5',
    chapter: 'Stage 2: Zero-Inventory Product Creation',
    title: 'Generating 100% Margin Digital Assets & Sourcing Specs',
    subtitle: 'Zero Factory Minimums, Zero Freight Shipping, and Zero Overhead',
    scenario: 'Beginner sellers struggle when buying 500 units of physical inventory from overseas factories. In the AI Digital Builder tab, you generate instant, sellable digital products—automotive mechanics cheat-sheets, Cricut SVG vector decal packs, or woodworking blueprints—complete with commercial resale licenses.',
    voiceoverText: "In Stage Two, you create your product with zero upfront inventory costs. Traditional manufacturing requires thousands of dollars in factory minimums and months of ocean transit. With Seller Scout's AI Digital Builder, you generate ready-to-sell printable guides, Cricut cut files, or planners in seconds. Sourcing cost is zero dollars, shipping is zero dollars, and profit margins exceed ninety percent.",
    highlightStats: [
      { label: 'Inventory Cost', value: '$0.00', color: 'text-emerald-400', sub: 'Zero Factory Minimum (MOQ)' },
      { label: 'Digital Net Margin', value: '96.2%', color: 'text-teal-300', sub: 'Instant Automated Delivery' },
      { label: 'Downside Risk', value: '0% Capital Loss', color: 'text-amber-400', sub: 'Commercial License Included' },
    ],
    calculations: [
      { label: 'Factory Sourcing & MOQ', formula: '0 units minimum requirement', result: '$0.00', detail: 'Zero cash tied up in warehouse' },
      { label: 'Ocean Freight & Customs', formula: 'Zero container or import tariff charges', result: '$0.00', detail: 'Instant digital delivery token' },
      { label: 'Digital Processing Fee', formula: '2.9% + $0.30 standard encryption fee', result: '-$0.88', detail: 'Payment gateway deduction' },
      { label: 'Net Profit per Download', formula: '$19.99 sale price - $0.88 processing', result: '+$19.11 net / sale', detail: '95.6% return on each customer' }
    ],
    keyTakeaway: 'Zero-inventory digital assets eliminate supply chain delays and allow you to launch profitable offers on Day 1.'
  },
  {
    id: 3,
    stepNumber: 'Stage 3 of 5',
    chapter: 'Stage 3: Multi-Marketplace Listing Sync',
    title: 'Automated SEO Titles, 5 Bullet Points & 13 Etsy Tags',
    subtitle: 'Marketplace-Compliant Formats for Amazon FBA, Etsy, and eBay',
    scenario: 'The AI Listing Studio crafts 200-character Amazon titles packed with search volume, 5 psychological benefit bullets that convert browsers to buyers, and 249-byte backend search terms. For Etsy, it generates all 13 long-tail tags and exportable CSVs for 1-click batch upload.',
    voiceoverText: "Stage Three prepares your product for launch. The AI Listing Studio automatically writes Amazon-compliant two-hundred character titles, five psychological bullet points that drive conversions, and backend search keywords. For Etsy, it formats thirteen high-intent tags. In the new Plugins and Channels tab, you can export Amazon Flat Files or publish directly into Etsy Shop Manager with a single click.",
    highlightStats: [
      { label: 'Amazon Title Length', value: '200 Chars', color: 'text-amber-400', sub: 'A9 Algorithm SEO Optimized' },
      { label: 'Etsy Search Tags', value: '13 / 13 Tags', color: 'text-emerald-400', sub: 'Long-Tail High Volume' },
      { label: '1-Click Push Sync', value: 'Flat File & API', color: 'text-indigo-400', sub: 'Amazon, Etsy, eBay, Shopify' },
    ],
    calculations: [
      { label: 'Search Keyword Coverage', formula: 'High-intent search terms aggregated across platforms', result: '45+ Keywords', detail: 'Captures primary & secondary search intent' },
      { label: 'Amazon Bullet Points', formula: '5 Benefit-driven bullets addressing objections', result: '5 Conversion Hooks', detail: 'Optimized for mobile shoppers' },
      { label: 'Etsy Tag Allocation', formula: '13/13 Allowed tags utilized with zero wasted space', result: '13 Mapped Tags', detail: 'Ranks across multiple Etsy search queries' },
      { label: 'Listing Export Format', formula: 'Amazon Inventory Loader TSV + Etsy CSV template', result: '1-Click Download', detail: 'Ready for batch upload to Seller Central' }
    ],
    keyTakeaway: 'Marketplace-compliant SEO formatting ensures your products rank on page one organically without paying for expensive ads.'
  },
  {
    id: 4,
    stepNumber: 'Stage 4 of 5',
    chapter: 'Stage 4: TikTok Reels & TikTok Studio Submission',
    title: 'Submitting Viral 30-Second Video Reels to TikTok Studio',
    subtitle: 'Hook, Demonstration, and Direct Shop Anchor Links',
    scenario: 'The secret to free organic sales is short-form vertical video. Seller Scout writes a high-retention 30-second script with a 0-3 second scroll-stopping hook, visual cues, and call to action. Click "Open TikTok Studio" to upload your 9:16 vertical reel, paste the voiceover captions, add trending sounds, and link your TikTok Shop product.',
    voiceoverText: "Stage Four unlocks explosive organic traffic. Seller Scout crafts a viral thirty-second script specifically structured for TikTok Reels and Instagram Shorts. You get an exact three-second hook to stop the scroll, clear visual demonstration cues, and a compelling call to action. Simply open TikTok Studio at tiktok dot com slash tiktokstudio, upload your vertical video reel, paste your captions, add a trending sound from the Creative Center, and tag your product showcase link.",
    highlightStats: [
      { label: 'Video Duration', value: '30 Seconds', color: 'text-rose-400', sub: 'Maximum Retention Curve' },
      { label: 'Scroll Stop Hook', value: '0 - 3 Seconds', color: 'text-amber-400', sub: 'Audio & Visual Pattern Interrupt' },
      { label: 'Organic Traffic Cost', value: '$0.00 Ad Spend', color: 'text-emerald-400', sub: 'Direct TikTok Studio Link' },
    ],
    calculations: [
      { label: 'Part 1: The Hook (0-3s)', formula: 'Pattern interrupt audio + sudden visual movement', result: '85% Watch Retention', detail: 'Stops viewers from swiping past' },
      { label: 'Part 2: Demonstration (4-22s)', formula: 'Show product in action solving painful problem', result: '18s Demonstration', detail: 'Builds desire and credibility' },
      { label: 'Part 3: Call to Action (23-30s)', formula: 'Direct viewer to TikTok Shop anchor link or bio', result: 'High Conversion CTR', detail: 'Drives qualified buyers to checkout' },
      { label: 'Platform Direct Link', formula: 'Direct creator uploader for desktop & mobile', result: 'tiktok.com/tiktokstudio', detail: 'Integrated into Seller Scout UI' }
    ],
    keyTakeaway: '30-second vertical video reels submitted through TikTok Studio drive massive free buyer traffic directly to your shop link.'
  },
  {
    id: 5,
    stepNumber: 'Stage 5 of 5',
    chapter: 'Stage 5: The Sale, Subscriptions & Stripe Bank Deposits',
    title: 'Customer Checkout to Real Cash Deposited in Your Bank',
    subtitle: '3-Day Risk-Free Trials, Automated Billing, and Weekly Direct Deposits',
    scenario: 'When viewers click your link, they arrive on an encrypted checkout page with a 3-day risk-free trial ($0 due today). Conversion rates jump 300%. Stripe automatically bills the recurring membership ($25/mo), deducts card processing ($1.03), and deposits the remaining $22.87 directly into your personal bank account every week.',
    voiceoverText: "Stage Five is where the sale converts into money in your bank account. When a buyer clicks your link, they encounter an encrypted Stripe checkout offering a three-day risk-free trial with zero dollars due today. This risk reversal dramatically multiplies conversions. Stripe automatically charges recurring memberships on schedule, deducts standard card fees, and deposits pure net cash into your checking account every week. That is the complete start to sale engine.",
    highlightStats: [
      { label: 'Free Trial Offer', value: '3-Day Free', color: 'text-emerald-400', sub: '$0 Due Today at Checkout' },
      { label: 'Conversion Boost', value: '+300% Higher', color: 'text-teal-300', sub: 'Zero Risk For Buyers' },
      { label: 'Weekly Payout', value: 'Direct to Bank', color: 'text-indigo-400', sub: 'Automated Stripe Transfers' },
    ],
    calculations: [
      { label: 'Initial Checkout Amount', formula: 'Customer card verified and authorized', result: '$0.00 Due Today', detail: 'Eliminates checkout friction' },
      { label: 'Trial-to-Paid Conversion', formula: 'Recurring membership initiates after 3 days', result: '82% Retained', detail: 'Automatic recurring Stripe invoice' },
      { label: 'Merchant Gateway Deductions', formula: '2.9% + $0.30 per subscription transaction', result: '-$1.03 fee', detail: 'PCI-DSS Level 1 Secure Processing' },
      { label: 'Net Bank Transfer', formula: '$25.00 billed - $1.03 Stripe processing deduction', result: '+$23.97 net / member', detail: 'Deposited directly to your checking account' }
    ],
    keyTakeaway: 'The loop is complete: from AI scouting to viral reels to automated Stripe weekly bank deposits, the system works 24/7.'
  }
];

const FINANCIAL_PROOF_SLIDES: Slide[] = [
  {
    id: 1,
    stepNumber: 'Step 1 of 5',
    chapter: 'Act 1: The Growth Model',
    title: 'How $25 Compounds into $1,000/Month Recurring Income',
    subtitle: 'The 60-Day Capital Compounding Trajectory',
    scenario: 'Alex starts with a modest $25 budget from his personal account and zero warehouse stock. Instead of borrowing money or waiting months for ocean freight, Alex deploys his $25 into low-cost digital assets and local micro-flips, reinvesting 100% of profit into an automated Stripe subscription engine.',
    voiceoverText: "Welcome to the five-step Seller Scout case study. In Step One, we trace how twenty-five dollars compounds into a dependable one thousand dollar monthly income. Alex doesn't borrow money or gamble on expensive overseas inventory. Day One begins with twenty-five dollars of seed capital deployed into two digital products. By Day Thirty, initial sales generate three hundred and eighty-five dollars in profit. By Day Sixty, reinvesting profits into forty recurring Stripe subscribers delivers exactly one thousand dollars every month in predictable, recurring cash flow.",
    highlightStats: [
      { label: 'Initial Seed Capital', value: '$25.00', color: 'text-amber-400', sub: 'Zero Debt Required' },
      { label: 'Day 30 Cash Generated', value: '$385.00', color: 'text-teal-300', sub: 'From 17 Digital Sales' },
      { label: 'Day 60 Recurring MRR', value: '$1,000 / mo', color: 'text-emerald-400', sub: '40 Active Subscribers' },
    ],
    calculations: [
      { label: 'Seed Capital Allocation', formula: '$15.00 digital assets + $10.00 launch fee', result: '$25.00', detail: '100% of initial budget utilized' },
      { label: 'Month 1 Cash Compounding', formula: '17 sales × $22.87 net profit/sale', result: '$388.79', detail: '15.5x capital multiple achieved' },
      { label: 'Month 2 Recurring Scale', formula: '40 club members × $25.00/mo subscription', result: '$1,000.00 / mo', detail: 'Permanent monthly cash flow' },
      { label: '60-Day Capital ROI', formula: '($1,000 net monthly / $25 seed) × 100', result: '+3,900%', detail: 'Total return on invested capital' }
    ],
    keyTakeaway: 'Small starting capital is not a handicap when deployed into zero-overhead digital assets and recurring subscriptions.'
  },
  {
    id: 2,
    stepNumber: 'Step 2 of 5',
    chapter: 'Act 2: Margin Architecture',
    title: 'Unit Economics: Physical Sourcing vs. Digital Assets',
    subtitle: 'Why 91.5% Net Margin Beats 22% Physical Margin Every Time',
    scenario: 'Traditional e-commerce fails beginner sellers because physical inventory requires 100+ minimum units ($600+) with brutal fees: ocean freight, warehousing, and Amazon referral fees eat 75% of revenue. Digital products eliminate manufacturing, storage, and shipping entirely.',
    voiceoverText: "In Step Two, Seller Scout's calculations expose why traditional physical sourcing traps beginners. Physical products require six hundred dollars in factory minimums, yielding only five dollars and forty-nine cents in net profit after Amazon takes half the revenue in storage and FBA fees. In contrast, Alex's twenty-five dollar digital asset has zero factory cost, zero freight, and zero warehouse fees. Selling at twenty-five dollars delivers twenty-two dollars and eighty-seven cents in pure net margin per transaction.",
    highlightStats: [
      { label: 'Physical Net Margin', value: '22.0%', color: 'text-rose-400', sub: '$5.49 profit on $24.99' },
      { label: 'Digital Net Margin', value: '91.5%', color: 'text-emerald-400', sub: '$22.87 profit on $25.00' },
      { label: 'Breakeven Units Needed', value: '2 Units', color: 'text-teal-300', sub: 'vs. 110 units for physical' },
    ],
    calculations: [
      { label: 'Physical Product Cost', formula: '$6.20 sourcing + $9.80 FBA/fees + $3.50 ship', result: '$19.50 / unit', detail: 'Only $5.49 net kept on $24.99 retail' },
      { label: 'Digital Product Cost', formula: '$0.00 sourcing + $0.00 storage + $2.13 processing', result: '$2.13 / unit', detail: '$22.87 net kept on $25.00 retail' },
      { label: 'Capital at Risk', formula: 'Physical: $744 minimum batch vs. Digital: $25 seed', result: '30x Lower Risk', detail: 'Zero inventory loss downside' },
      { label: 'Sales to Breakeven', formula: '$25.00 seed budget / $22.87 net profit per unit', result: '1.09 (2 Sales)', detail: 'Profitable from customer #2 onward' }
    ],
    keyTakeaway: 'High-margin digital assets maximize cash velocity, making a $25 budget more profitable than a $1,000 physical batch.'
  },
  {
    id: 3,
    stepNumber: 'Step 3 of 5',
    chapter: 'Act 3: Fee Deconstruction',
    title: 'The Unit Profit Waterfall: Where Every Dollar Goes',
    subtitle: 'Transparent Breakdown of a $25.00 Sale to $22.87 Net In The Bank',
    scenario: 'Most beginner sellers fail because they don’t account for transaction fees, payment processing, and platform takes. Seller Scout analyzes every cent: Stripe takes 2.9% + $0.30 ($1.03), and platform delivery infrastructure takes $1.10, leaving $22.87 pure cash profit.',
    voiceoverText: "Step Three reveals the exact profit waterfall. When a customer purchases Alex's product for twenty-five dollars, where does the money go? Stripe takes eighty-eight cents plus thirty cents for encrypted card processing, total one dollar and three cents. Platform interchange and delivery takes one dollar and ten cents. Alex keeps twenty-two dollars and eighty-seven cents. To reach one thousand dollars per month, Alex needs exactly forty-four sales, or less than one and a half sales per day.",
    highlightStats: [
      { label: 'Gross Sale Price', value: '$25.00', color: 'text-white', sub: 'Customer Pays' },
      { label: 'Total Deductions', value: '-$2.13', color: 'text-rose-400', sub: 'Stripe & Delivery' },
      { label: 'Clean Net Profit', value: '+$22.87', color: 'text-emerald-400', sub: 'Deposited to Bank' },
    ],
    calculations: [
      { label: 'Stripe Processing Fee', formula: '(2.9% × $25.00) + $0.30 standard gateway fee', result: '-$1.03', detail: 'PCI-DSS Level 1 Encrypted' },
      { label: 'Delivery & Platform Cut', formula: 'Automated download & secure token hosting', result: '-$1.10', detail: 'Zero shipping or handling fees' },
      { label: 'Net Take-Home per Sale', formula: '$25.00 gross - $1.03 Stripe - $1.10 delivery', result: '+$22.87', detail: '91.48% Net Profit Margin' },
      { label: 'Monthly Volume for $1,000', formula: '$1,000.00 target / $22.87 net profit per unit', result: '43.7 ≈ 44 Sales', detail: 'Just 1.46 sales per day required' }
    ],
    keyTakeaway: 'At 1.5 sales per day, reaching $1,000 monthly profit is achievable with organic video hooks and zero paid ad spend.'
  },
  {
    id: 4,
    stepNumber: 'Step 4 of 5',
    chapter: 'Act 4: Automated Subscriptions',
    title: 'The Compounding Power of 40 Subscribers @ $25/Month',
    subtitle: 'Transitioning from One-Off Sales to Predictable Monthly Recurring Revenue',
    scenario: 'Selling one-off downloads requires hustle every single month. Alex connects his Stripe account to launch a recurring "VIP Sourcing & Digital Drops Club" for $25/month with a 3-day free trial ($0 due today). With an 82% trial conversion rate, 40 members lock in $1,000 MRR on autopilot.',
    voiceoverText: "Step Four transitions the business from erratic one-time sales to predictable monthly recurring revenue. Alex connects his Stripe account and launches a twenty-five dollar monthly membership club with a three-day risk-free trial. With zero dollars charged today, visitor conversion jumps three hundred percent. With an eighty-two percent trial-to-paid conversion rate, Alex only needs forty active members to generate one thousand dollars every single month on autopilot.",
    highlightStats: [
      { label: 'Free Trial Offer', value: '3-Day Free', color: 'text-emerald-400', sub: '$0 Due Today' },
      { label: 'Members Required', value: '40 Members', color: 'text-teal-300', sub: '@ $25.00 / month' },
      { label: 'Monthly Recurring MRR', value: '$1,000 / mo', color: 'text-indigo-400', sub: '$12,000 Annualized' },
    ],
    calculations: [
      { label: 'Free Trial Conversion Rate', formula: '3-day trial ($0 due today) conversion', result: '82% Retention', detail: 'Bank card authorized on Day 1' },
      { label: 'Monthly Cash Flow (MRR)', formula: '40 active subscribers × $25.00/mo fee', result: '$1,000.00 / mo', detail: 'Billed automatically by Stripe' },
      { label: 'Annual Run Rate (ARR)', formula: '$1,000.00 / mo × 12 calendar months', result: '$12,000.00 / yr', detail: 'Predictable baseline revenue' },
      { label: 'Customer Lifetime Value (LTV)', formula: '$25.00/mo × 6-month average member lifespan', result: '$150.00 / member', detail: '6x return per enrolled member' }
    ],
    keyTakeaway: 'Subscriptions eliminate revenue fluctuations: each new member stacks permanently on top of existing recurring revenue.'
  },
  {
    id: 5,
    stepNumber: 'Step 5 of 5',
    chapter: 'Act 5: The Financial Statement',
    title: 'Master P&L Statement: $25 Seed to $1,000/Month Net Profit',
    subtitle: 'Audited 60-Day Financial Performance & Balance Sheet',
    scenario: 'The complete financial summary after 60 days. Alex launched with $25. Total gross billing reached $1,090.00, operating expenses totaled $90.00 (Stripe fees + hosting), resulting in $1,000.00 clean monthly net profit with 91.7% net operating margin.',
    voiceoverText: "Step Five presents the complete audited financial balance sheet. Alex started with just twenty-five dollars. Total gross billings over sixty days reached one thousand and ninety dollars. Total operating expenses, including card processing and delivery, totaled ninety dollars. Net recurring monthly income now stands at one thousand dollars, representing an astonishing thirty-nine hundred percent return on initial capital. The playbook is proven, realistic, and repeatable. Start your three-day free trial today and begin your journey.",
    highlightStats: [
      { label: 'Total Capital Seed', value: '$25.00', color: 'text-slate-400', sub: 'Initial Out of Pocket' },
      { label: 'Gross Revenue Billed', value: '$1,090.00', color: 'text-white', sub: '40 Members + Downloads' },
      { label: 'Net Monthly Income', value: '$1,000.00', color: 'text-emerald-400', sub: '91.7% Net Margin' },
    ],
    calculations: [
      { label: 'Gross Billings Received', formula: '40 memberships @ $25 + 4 download packs @ $22.50', result: '+$1,090.00', detail: 'Stripe verified payments' },
      { label: 'Stripe Processing Deductions', formula: '2.9% + $0.30 per charge across transactions', result: '-$45.20', detail: 'Automatic gateway deduction' },
      { label: 'Hosting & Domain Overhead', formula: 'Cloud hosting & digital delivery bandwidth', result: '-$44.80', detail: 'Zero warehouse or freight cost' },
      { label: 'Net Monthly Cash Profit', formula: '$1,090.00 gross - $90.00 total operating cost', result: '+$1,000.00 / mo', detail: '3,900% Return on Initial $25 Seed' }
    ],
    keyTakeaway: 'By focusing on high margins and recurring subscriptions, you can turn a $25 starter budget into a permanent $1,000/month income stream.'
  }
];

// -------------------------------------------------------------------
// START-TO-SALE VISUAL DIAGRAMS (STAGES 1 TO 5)
// -------------------------------------------------------------------

// VISUAL 1: AI Opportunity Discovery (Amazon, Etsy, TikTok, eBay)
const StartToSaleStage1Visual: React.FC = () => {
  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full shadow-inner space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white">AI Scout: Sourcing & Fee Algorithm</span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          94/100 Viability
        </span>
      </div>

      {/* Interactive Budget Slider Preview */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium">Your Working Budget:</span>
          <span className="font-extrabold text-amber-400 font-mono text-sm">$25.00 Seed</span>
        </div>
        <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-amber-400 to-emerald-400 w-1/4 rounded-full"></div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>$5 Min</span>
          <span>$25 Selected</span>
          <span>$1,000 Max</span>
        </div>
      </div>

      {/* Multi-Marketplace Channel Badges */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
          Analyzed Marketplaces
        </span>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-200">📦 Amazon FBA</span>
            <span className="text-[10px] text-emerald-400 font-bold">BSR 1,240</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-200">🎨 Etsy Shop</span>
            <span className="text-[10px] text-teal-300 font-bold">96% Margin</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-200">🎵 TikTok Shop</span>
            <span className="text-[10px] text-rose-400 font-bold">Viral Reach</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-200">🏷️ eBay Hub</span>
            <span className="text-[10px] text-blue-400 font-bold">Fast Flips</span>
          </div>
        </div>
      </div>

      {/* Pre-Calculated Net Margin Gauge */}
      <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="text-emerald-300 font-bold">Upfront Net Profit Math:</span>
          <span className="text-emerald-400 font-black font-mono text-sm">+$14.07 Kept (56.3%)</span>
        </div>
        <div className="flex justify-between text-[10px] text-slate-300">
          <span>Retail: $24.99</span>
          <span>Platform Fees: -$6.82</span>
          <span>Sourcing: $4.10</span>
        </div>
      </div>
    </div>
  );
};

// VISUAL 2: Zero-Inventory Product Creation ($0 Inventory)
const StartToSaleStage2Visual: React.FC = () => {
  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full shadow-inner space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-bold text-white">AI Digital Asset & Product Creator</span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
          $0 Factory Sourcing
        </span>
      </div>

      {/* Generated Digital Asset Card */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">
            Generated Digital Product Pack
          </span>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-bold">
            100% Margin
          </span>
        </div>
        <h4 className="text-xs font-bold text-white leading-snug">
          Small Engine & Lawn Mower Carburetor Troubleshooting Printable Guide + SVG Decal Kit
        </h4>
        <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            📄 High-Res PDF (300 DPI)
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            ✂️ Cricut SVG Vector
          </span>
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
            🛡️ Commercial PLR License
          </span>
        </div>
      </div>

      {/* Sourcing Cost Comparison */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs">
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Factory MOQ</span>
          <span className="font-bold text-emerald-400">0 Units ($0)</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Ocean Freight</span>
          <span className="font-bold text-emerald-400">$0.00</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
          <span className="text-[10px] text-slate-400 block">Fulfillment</span>
          <span className="font-bold text-teal-300">Instant Download</span>
        </div>
      </div>

      {/* Key Advantage Banner */}
      <div className="p-3 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-[11px] text-indigo-200 flex items-center justify-between">
        <span>Zero Inventory Downside:</span>
        <span className="font-extrabold text-white">Test 10 products with $0 risk</span>
      </div>
    </div>
  );
};

// VISUAL 3: Multi-Marketplace Listing Sync (Amazon & Etsy)
const StartToSaleStage3Visual: React.FC = () => {
  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full shadow-inner space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white">Marketplace SEO & Batch Flat Files</span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          1-Click Export
        </span>
      </div>

      {/* Amazon SEO Section */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-bold text-amber-400 text-[11px]">📦 Amazon FBA Listing Ready</span>
          <span className="text-[10px] text-slate-400 font-mono">198 / 200 Chars</span>
        </div>
        <p className="text-slate-300 text-[11px] font-mono leading-relaxed line-clamp-2">
          "Carburetor Rebuild Guide & Diagnostic Chart for Lawn Mower, Weed Eater & Small Engine Repair - Instant Digital PDF & Tuning Specs"
        </p>
        <div className="flex items-center gap-2 text-[10px] text-slate-400">
          <span className="text-emerald-400 font-semibold">✓ 5 Benefit Bullets</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">✓ 249-Byte Search Terms</span>
        </div>
      </div>

      {/* Etsy Shop Manager Section */}
      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5 text-xs">
        <div className="flex justify-between items-center">
          <span className="font-bold text-emerald-300 text-[11px]">🎨 Etsy Shop Manager Ready</span>
          <span className="text-[10px] text-emerald-400 font-mono">13 / 13 Tags Mapped</span>
        </div>
        <div className="flex flex-wrap gap-1 text-[10px]">
          {['mechanic guide', 'carburetor fix', 'small engine', 'lawn mower', 'diy cheat sheet'].map((t, idx) => (
            <span key={idx} className="px-2 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800">
              #{t}
            </span>
          ))}
          <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            +8 more tags
          </span>
        </div>
      </div>

      {/* 1-Click Push Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <div className="flex-1 p-2 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-[11px] text-center font-bold">
          Push to Amazon (Flat File TSV)
        </div>
        <div className="flex-1 p-2 rounded-lg bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-[11px] text-center font-bold">
          Publish to Etsy (Open API v3)
        </div>
      </div>
    </div>
  );
};

// VISUAL 4: TikTok Reels & TikTok Studio Submission
const StartToSaleStage4Visual: React.FC = () => {
  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full shadow-inner space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <Video className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-bold text-white">TikTok Studio 30s Reels Submission</span>
        </div>
        <a
          href="https://www.tiktok.com/tiktokstudio"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1 hover:bg-rose-500/30 transition-colors"
        >
          <span>Open TikTok Studio</span>
          <ExternalLink className="w-2.5 h-2.5" />
        </a>
      </div>

      {/* Simulated 9:16 Video Script Timeline */}
      <div className="space-y-2">
        {/* 0-3s Hook */}
        <div className="p-2.5 rounded-xl bg-slate-900 border border-rose-500/40 flex items-start gap-2.5 text-xs">
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-500 text-slate-950 shrink-0">
            0-3s HOOK
          </span>
          <div className="space-y-0.5">
            <span className="text-[10px] text-rose-400 font-semibold block">Stop-The-Scroll Audio:</span>
            <p className="text-slate-100 font-medium italic">"Stop buying new carburetors before checking this 30-second fix."</p>
          </div>
        </div>

        {/* 4-22s Demonstration */}
        <div className="p-2.5 rounded-xl bg-slate-900 border border-amber-500/40 flex items-start gap-2.5 text-xs">
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-amber-400 text-slate-950 shrink-0">
            4-22s PROOF
          </span>
          <div className="space-y-0.5">
            <span className="text-[10px] text-amber-400 font-semibold block">Visual Cue & Voiceover:</span>
            <p className="text-slate-200">Point spray tube at pilot air jet: "90% of small engines just have varnish right here."</p>
          </div>
        </div>

        {/* 23-30s CTA */}
        <div className="p-2.5 rounded-xl bg-slate-900 border border-emerald-500/40 flex items-start gap-2.5 text-xs">
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-400 text-slate-950 shrink-0">
            23-30s CTA
          </span>
          <div className="space-y-0.5">
            <span className="text-[10px] text-emerald-400 font-semibold block">TikTok Shop Link:</span>
            <p className="text-emerald-300 font-bold">"Download the instant 1-page PDF printable diagram in the product link below."</p>
          </div>
        </div>
      </div>

      {/* Direct Creator Action Buttons */}
      <div className="flex items-center gap-2 pt-1">
        <a
          href="https://www.tiktok.com/tiktokstudio"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-2 px-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition-all"
        >
          <Video className="w-3.5 h-3.5" />
          <span>Upload Reel to TikTok Studio</span>
          <ExternalLink className="w-3 h-3" />
        </a>
        <a
          href="https://ads.tiktok.com/business/creativecenter/inspiration/popular/hashtag/pc/en"
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-xs border border-slate-700 flex items-center gap-1"
          title="Trending TikTok Audio"
        >
          <span>Trends</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};

// VISUAL 5: The Sale, Subscriptions & Stripe Bank Deposits
const StartToSaleStage5Visual: React.FC = () => {
  return (
    <div className="bg-slate-950/90 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between h-full shadow-inner space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
        <div className="flex items-center gap-2">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-white">Stripe Checkout to Bank Account</span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          Weekly Deposits
        </span>
      </div>

      {/* Customer Checkout Pill */}
      <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-medium">Customer Checkout:</span>
          <span className="font-extrabold text-emerald-400 font-mono text-sm">$0.00 Due Today</span>
        </div>
        <p className="text-slate-300 text-[11px] leading-relaxed">
          3-Day Risk-Free Trial card authorization. First automated recurring renewal of <strong>$25.00/mo</strong> triggers on Day 4.
        </p>
      </div>

      {/* Bank Payout Ledger */}
      <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/40 space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Direct Checking Account Deposit</span>
          </div>
          <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black text-[10px]">
            ACH Direct
          </span>
        </div>
        <div className="flex justify-between items-center pt-1 border-t border-emerald-500/20">
          <span className="text-slate-300 text-[11px]">40 Members @ $25/mo:</span>
          <span className="font-black text-emerald-400 font-mono text-base">+$1,000.00 / month</span>
        </div>
      </div>

      {/* Security Credentials */}
      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
        <span>256-Bit SSL PCI-DSS Level 1</span>
        <span className="text-emerald-400 font-medium">Encrypted Stripe Gateway</span>
      </div>
    </div>
  );
};

// -------------------------------------------------------------------
// FINANCIAL PROOF CHARTS & GRAPHS
// -------------------------------------------------------------------

// GRAPH 1: Growth Trajectory Curve ($25 -> $1,000/mo)
const Slide1GrowthChart: React.FC = () => {
  const points = [
    { label: 'Day 1', amount: 25, x: 30, y: 155, desc: '$25 Seed' },
    { label: 'Day 15', amount: 145, x: 95, y: 135, desc: '6 Sales' },
    { label: 'Day 30', amount: 385, x: 165, y: 100, desc: '17 Sales' },
    { label: 'Day 45', amount: 690, x: 235, y: 55, desc: '28 Subs' },
    { label: 'Day 60', amount: 1000, x: 300, y: 20, desc: '$1k MRR' }
  ];

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-full shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <TrendingUp className="w-4 h-4 text-emerald-400" />
          <span>Capital Compounding Curve (60 Days)</span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          +3,900% ROI
        </span>
      </div>

      <div className="relative w-full h-44 sm:h-52">
        <svg viewBox="0 0 330 180" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="lineGlow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#14b8a6" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line x1="25" y1="20" x2="310" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="25" y1="65" x2="310" y2="65" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="25" y1="110" x2="310" y2="110" stroke="#1e293b" strokeDasharray="3 3" />
          <line x1="25" y1="155" x2="310" y2="155" stroke="#334155" />

          {/* Target line $1,000 */}
          <text x="5" y="24" fill="#10b981" fontSize="9" fontWeight="bold">$1,000</text>
          <text x="12" y="69" fill="#64748b" fontSize="8">$700</text>
          <text x="12" y="114" fill="#64748b" fontSize="8">$350</text>
          <text x="18" y="158" fill="#f59e0b" fontSize="8">$25</text>

          {/* Shaded Area under Curve */}
          <path
            d="M 30,155 Q 95,140 165,100 T 235,55 T 300,20 L 300,155 L 30,155 Z"
            fill="url(#curveGradient)"
          />

          {/* Main Trajectory Line */}
          <path
            d="M 30,155 Q 95,140 165,100 T 235,55 T 300,20"
            fill="none"
            stroke="url(#lineGlow)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* Data Points */}
          {points.map((pt, i) => (
            <g key={i}>
              <circle cx={pt.x} cy={pt.y} r="5" fill="#0f172a" stroke={i === 4 ? '#10b981' : i === 0 ? '#f59e0b' : '#14b8a6'} strokeWidth="2.5" />
              <text x={pt.x} y={pt.y - 10} fill="#f1f5f9" fontSize="9" fontWeight="bold" textAnchor="middle">
                ${pt.amount}
              </text>
              <text x={pt.x} y="172" fill="#94a3b8" fontSize="8" textAnchor="middle">
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-800 text-center text-[10px]">
        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block">Day 1 Out of Pocket</span>
          <span className="font-bold text-amber-400">$25 Seed</span>
        </div>
        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block">Day 30 Compounding</span>
          <span className="font-bold text-teal-300">$385 Net</span>
        </div>
        <div className="p-1.5 rounded bg-slate-900 border border-slate-800">
          <span className="text-slate-400 block">Day 60 MRR</span>
          <span className="font-bold text-emerald-400">$1,000 / mo</span>
        </div>
      </div>
    </div>
  );
};

// GRAPH 2: Unit Margin Comparison (Physical vs Digital)
const Slide2MarginComparison: React.FC = () => {
  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-full shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <BarChart3 className="w-4 h-4 text-emerald-400" />
          <span>Margin Comparison per $25 Sale</span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          4.1x Higher Profit
        </span>
      </div>

      <div className="space-y-4 my-auto">
        {/* Physical Product Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-slate-400 font-medium">Physical Sourcing ($24.99 Retail)</span>
            <span className="text-rose-400 font-bold">$5.49 Net (22%)</span>
          </div>
          <div className="h-6 w-full bg-slate-900 rounded-lg overflow-hidden flex border border-slate-800">
            <div style={{ width: '25%' }} className="bg-rose-950/80 border-r border-rose-500/30 text-[9px] text-rose-300 flex items-center justify-center font-bold" title="Factory Sourcing: $6.20">
              Sourcing $6.20
            </div>
            <div style={{ width: '39%' }} className="bg-amber-950/80 border-r border-amber-500/30 text-[9px] text-amber-300 flex items-center justify-center font-bold" title="Amazon FBA & Platform: $9.80">
              FBA/Fees $9.80
            </div>
            <div style={{ width: '14%' }} className="bg-indigo-950/80 border-r border-indigo-500/30 text-[9px] text-indigo-300 flex items-center justify-center font-bold" title="Freight & Shipping: $3.50">
              Ship $3.50
            </div>
            <div style={{ width: '22%' }} className="bg-rose-500 text-[10px] text-slate-950 flex items-center justify-center font-black">
              $5.49
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Total Overhead: $19.50 (78%)</span>
            <span>Needs 110 sales to break even</span>
          </div>
        </div>

        {/* Digital Product Bar (Alex's Strategy) */}
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-white font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              Seller Scout Digital Asset ($25.00)
            </span>
            <span className="text-emerald-400 font-extrabold text-sm">$22.87 Net (91.5%)</span>
          </div>
          <div className="h-8 w-full bg-slate-900 rounded-lg overflow-hidden flex border-2 border-emerald-500/40 shadow-lg shadow-emerald-950/30">
            <div style={{ width: '4.5%' }} className="bg-slate-800 text-[8px] text-slate-400 flex items-center justify-center" title="Stripe Processing: $1.03">
              $1
            </div>
            <div style={{ width: '4.5%' }} className="bg-slate-700 text-[8px] text-slate-300 flex items-center justify-center" title="Bandwidth: $1.10">
              $1
            </div>
            <div style={{ width: '91%' }} className="bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1">
              <span>Pure Net Profit Deposited: +$22.87 (91.5%)</span>
            </div>
          </div>
          <div className="flex justify-between text-[10px] text-emerald-400/90 font-medium">
            <span>Total Overhead: $2.13 (8.5%)</span>
            <span className="font-bold text-emerald-300">Breakeven after just 2 sales!</span>
          </div>
        </div>
      </div>

      <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-[11px] text-slate-300 flex items-center justify-between">
        <span className="text-slate-400">Net Profit Multiplier:</span>
        <span className="font-bold text-emerald-300">1 Digital Sale = 4.2 Physical Sales</span>
      </div>
    </div>
  );
};

// GRAPH 3: Profit Waterfall ($25.00 -> $22.87)
const Slide3WaterfallChart: React.FC = () => {
  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-full shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <Calculator className="w-4 h-4 text-emerald-400" />
          <span>The $25.00 Profit Waterfall</span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          44 Sales = $1,000
        </span>
      </div>

      <div className="relative w-full h-44 sm:h-48 my-auto">
        <svg viewBox="0 0 320 160" className="w-full h-full overflow-visible">
          {/* Base Zero Line */}
          <line x1="20" y1="135" x2="305" y2="135" stroke="#334155" strokeWidth="1.5" />

          {/* Bar 1: Gross Price $25.00 */}
          <rect x="30" y="20" width="48" height="115" rx="4" fill="#3b82f6" />
          <text x="54" y="15" fill="#93c5fd" fontSize="9" fontWeight="bold" textAnchor="middle">+$25.00</text>
          <text x="54" y="148" fill="#94a3b8" fontSize="8" textAnchor="middle">Retail</text>

          {/* Minus indicator */}
          <text x="92" y="75" fill="#f43f5e" fontSize="12" fontWeight="bold">−</text>

          {/* Bar 2: Stripe Processing -$1.03 */}
          <rect x="105" y="20" width="42" height="16" rx="3" fill="#f43f5e" opacity="0.9" />
          <text x="126" y="15" fill="#fda4af" fontSize="8" fontWeight="bold" textAnchor="middle">-$1.03</text>
          <text x="126" y="148" fill="#94a3b8" fontSize="8" textAnchor="middle">Stripe</text>

          {/* Minus indicator */}
          <text x="162" y="75" fill="#f43f5e" fontSize="12" fontWeight="bold">−</text>

          {/* Bar 3: Platform & Delivery -$1.10 */}
          <rect x="175" y="36" width="42" height="17" rx="3" fill="#e11d48" opacity="0.9" />
          <text x="196" y="30" fill="#fda4af" fontSize="8" fontWeight="bold" textAnchor="middle">-$1.10</text>
          <text x="196" y="148" fill="#94a3b8" fontSize="8" textAnchor="middle">Host</text>

          {/* Equals indicator */}
          <text x="232" y="75" fill="#10b981" fontSize="12" fontWeight="bold">=</text>

          {/* Bar 4: Net Profit $22.87 */}
          <rect x="245" y="30" width="56" height="105" rx="4" fill="#10b981" />
          <text x="273" y="22" fill="#6ee7b7" fontSize="10" fontWeight="black" textAnchor="middle">+$22.87</text>
          <text x="273" y="148" fill="#6ee7b7" fontSize="8" fontWeight="bold" textAnchor="middle">Net Cash</text>
        </svg>
      </div>

      <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
        <div className="flex items-center justify-between text-slate-300">
          <span>Target Monthly Income:</span>
          <span className="font-bold text-white">$1,000.00</span>
        </div>
        <div className="flex items-center justify-between text-emerald-400 font-semibold mt-0.5">
          <span>Required Monthly Sales:</span>
          <span>$1,000 ÷ $22.87 = <strong>43.7 ≈ 44 Sales</strong> (1.46/day)</span>
        </div>
      </div>
    </div>
  );
};

// GRAPH 4: Stripe Recurring MRR (40 Subscribers @ $25/mo)
const Slide4SubscriberMRRChart: React.FC = () => {
  const tiers = [
    { week: 'Week 1', subs: 10, mrr: 250, height: 28 },
    { week: 'Week 2', subs: 20, mrr: 500, height: 55 },
    { week: 'Week 3', subs: 30, mrr: 750, height: 82 },
    { week: 'Week 4', subs: 40, mrr: 1000, height: 110 },
  ];

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-full shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <CreditCard className="w-4 h-4 text-emerald-400" />
          <span>Stripe Monthly Recurring Revenue (MRR)</span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          3-Day Free Trial
        </span>
      </div>

      <div className="relative w-full h-44 sm:h-48 my-auto flex items-end justify-around gap-2 px-3 pt-6 pb-2 border-b border-slate-800">
        {tiers.map((t, idx) => (
          <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
            <span className="text-[10px] font-bold text-emerald-400">${t.mrr}</span>
            <div 
              style={{ height: `${t.height}px` }} 
              className={`w-full max-w-[50px] rounded-t-lg transition-all ${
                idx === 3 
                  ? 'bg-gradient-to-t from-emerald-600 to-teal-400 border-2 border-emerald-300 shadow-lg shadow-emerald-500/20' 
                  : 'bg-slate-800 hover:bg-slate-700'
              } flex flex-col justify-between p-1 text-center`}
            >
              <span className="text-[9px] font-bold text-slate-950 mt-1 block">
                {t.subs}
              </span>
            </div>
            <span className="text-[10px] text-slate-400 font-medium">{t.week}</span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 text-[11px]">
        <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
          <span className="text-slate-400">Subscription Price:</span>
          <span className="font-bold text-white">$25 / mo</span>
        </div>
        <div className="p-2 rounded bg-slate-900 border border-slate-800 flex justify-between">
          <span className="text-slate-400">Target MRR:</span>
          <span className="font-bold text-emerald-400">$1,000 / mo</span>
        </div>
      </div>
    </div>
  );
};

// GRAPH 5: 60-Day Audited Balance Sheet & Allocation Donut
const Slide5BalanceSheetChart: React.FC = () => {
  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-full shadow-inner">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-bold text-white">
          <PieChart className="w-4 h-4 text-emerald-400" />
          <span>60-Day P&L Statement & Capital Efficiency</span>
        </div>
        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          91.7% Net Margin
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 my-auto items-center">
        {/* Visual Allocation Ring */}
        <div className="relative flex items-center justify-center p-2">
          <svg viewBox="0 0 120 120" className="w-28 h-28 transform -rotate-90">
            {/* Background ring */}
            <circle cx="60" cy="60" r="45" fill="none" stroke="#1e293b" strokeWidth="16" />
            {/* Net profit slice: 91.7% */}
            <circle 
              cx="60" 
              cy="60" 
              r="45" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="16" 
              strokeDasharray="259.2 282.7" 
              strokeLinecap="round" 
            />
            {/* Fees slice: 8.3% */}
            <circle 
              cx="60" 
              cy="60" 
              r="45" 
              fill="none" 
              stroke="#f43f5e" 
              strokeWidth="16" 
              strokeDasharray="23.5 282.7" 
              strokeDashoffset="-259.2" 
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-[10px] text-slate-400">Net Profit</span>
            <span className="text-base font-black text-emerald-400">$1,000</span>
          </div>
        </div>

        {/* Financial Ledger Breakdown */}
        <div className="space-y-1.5 text-[11px]">
          <div className="flex justify-between items-center p-1.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-300">Gross Billings:</span>
            <span className="font-bold text-white">+$1,090.00</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Stripe Fees (2.9%):</span>
            <span className="font-semibold text-rose-400">-$45.20</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded bg-slate-900 border border-slate-800">
            <span className="text-slate-400">Delivery Hosting:</span>
            <span className="font-semibold text-rose-400">-$44.80</span>
          </div>
          <div className="flex justify-between items-center p-1.5 rounded bg-emerald-950/40 border border-emerald-500/40">
            <span className="font-bold text-emerald-300">Clean Net Income:</span>
            <span className="font-black text-emerald-400">+$1,000.00 / mo</span>
          </div>
        </div>
      </div>

      <div className="p-2 rounded bg-slate-900 border border-slate-800 text-[11px] flex justify-between items-center">
        <span className="text-slate-400">Initial Out-Of-Pocket Seed:</span>
        <span className="font-bold text-amber-400">$25.00 (Compounded 40x)</span>
      </div>
    </div>
  );
};

// Supported world languages for video walkthrough narration
export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

const BASE_SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'en-US', name: 'English (US - American Male)', nativeName: 'English (US)', flag: '🇺🇸' },
  { code: 'es-ES', name: 'Spanish (Español)', nativeName: 'Español', flag: '🇪🇸' },
  { code: 'fr-FR', name: 'French (Français)', nativeName: 'Français', flag: '🇫🇷' },
  { code: 'de-DE', name: 'German (Deutsch)', nativeName: 'Deutsch', flag: '🇩🇪' },
  { code: 'it-IT', name: 'Italian (Italiano)', nativeName: 'Italiano', flag: '🇮🇹' },
  { code: 'pt-BR', name: 'Portuguese (Português)', nativeName: 'Português', flag: '🇧🇷' },
  { code: 'ja-JP', name: 'Japanese (日本語)', nativeName: '日本語', flag: '🇯🇵' },
  { code: 'zh-CN', name: 'Chinese (中文 - 普通话)', nativeName: '简体中文', flag: '🇨🇳' },
  { code: 'ko-KR', name: 'Korean (한국어)', nativeName: '한국어', flag: '🇰🇷' },
  { code: 'ar-SA', name: 'Arabic (العربية)', nativeName: 'العربية', flag: '🇸🇦' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'nl-NL', name: 'Dutch (Nederlands)', nativeName: 'Nederlands', flag: '🇳🇱' },
  { code: 'ru-RU', name: 'Russian (Русский)', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'pl-PL', name: 'Polish (Polski)', nativeName: 'Polski', flag: '🇵🇱' },
  { code: 'tr-TR', name: 'Turkish (Türkçe)', nativeName: 'Türkçe', flag: '🇹🇷' },
  { code: 'sv-SE', name: 'Swedish (Svenska)', nativeName: 'Svenska', flag: '🇸🇪' },
  { code: 'no-NO', name: 'Norwegian (Norsk)', nativeName: 'Norsk', flag: '🇳🇴' },
  { code: 'da-DK', name: 'Danish (Dansk)', nativeName: 'Dansk', flag: '🇩🇰' },
  { code: 'fi-FI', name: 'Finnish (Suomi)', nativeName: 'Suomi', flag: '🇫🇮' },
  { code: 'el-GR', name: 'Greek (Ελληνικά)', nativeName: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'he-IL', name: 'Hebrew (עברית)', nativeName: 'עברית', flag: '🇮🇱' },
  { code: 'id-ID', name: 'Indonesian (Bahasa Indonesia)', nativeName: 'Bahasa Indonesia', flag: '🇮🇩' },
  { code: 'vi-VN', name: 'Vietnamese (Tiếng Việt)', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'th-TH', name: 'Thai (ไทย)', nativeName: 'ไทย', flag: '🇹🇭' },
  { code: 'uk-UA', name: 'Ukrainian (Українська)', nativeName: 'Українська', flag: '🇺🇦' },
  { code: 'cs-CZ', name: 'Czech (Čeština)', nativeName: 'Čeština', flag: '🇨🇿' },
  { code: 'ro-RO', name: 'Romanian (Română)', nativeName: 'Română', flag: '🇷🇴' },
  { code: 'hu-HU', name: 'Hungarian (Magyar)', nativeName: 'Magyar', flag: '🇭🇺' },
  { code: 'fil-PH', name: 'Tagalog / Filipino', nativeName: 'Filipino', flag: '🇵🇭' },
];

// Helper to filter out feminine voice identifiers
const isLikelyFemaleVoice = (name: string): boolean => {
  const lower = name.toLowerCase();
  return (
    lower.includes('female') ||
    lower.includes('samantha') ||
    lower.includes('karen') ||
    lower.includes('zira') ||
    lower.includes('jenny') ||
    lower.includes('aria') ||
    lower.includes('victoria') ||
    lower.includes('susan') ||
    lower.includes('moira') ||
    lower.includes('fiona') ||
    lower.includes('tessa') ||
    lower.includes('veena') ||
    lower.includes('catherine') ||
    lower.includes('anna') ||
    lower.includes('stephanie') ||
    lower.includes('heather') ||
    lower.includes('ava') ||
    lower.includes('allison')
  );
};

// Scorer specifically prioritizing a normal American male voice of someone in their late 20s, mature, with ZERO accent (General American)
const getAmericanMaleVoiceScore = (v: SpeechSynthesisVoice): number => {
  const lower = v.name.toLowerCase();
  const lang = (v.lang || '').toLowerCase().replace('_', '-');

  // Must be strictly General American English (en-US). Exclude UK, Australia, India, Ireland, South Africa, etc.
  if (lang !== 'en-us' && lang !== 'en') {
    return -200;
  }
  // Heavily penalize foreign and regional accents
  if (
    lower.includes('uk') ||
    lower.includes('united kingdom') ||
    lower.includes('british') ||
    lower.includes('australia') ||
    lower.includes('australian') ||
    lower.includes('india') ||
    lower.includes('indian') ||
    lower.includes('scottish') ||
    lower.includes('irish') ||
    lower.includes('south africa') ||
    lower.includes('new zealand')
  ) {
    return -200;
  }
  // Penalize female voices
  if (isLikelyFemaleVoice(v.name)) return -100;

  let score = 0;

  // #1 Tier: Premium Late 20s Mature Neutral American Male Voices (Zero foreign or regional accent)
  // Microsoft Guy Natural (en-US) - widely considered the premier late 20s/early 30s mature, neutral American male
  if (lower.includes('guy') && (lower.includes('natural') || lower.includes('online'))) score += 120;
  // Microsoft Davis Natural (en-US) - mature, confident, clear American male
  if (lower.includes('davis') && (lower.includes('natural') || lower.includes('online'))) score += 110;
  // Microsoft Christopher Natural (en-US) - articulate American broadcast tone
  if (lower.includes('christopher') && (lower.includes('natural') || lower.includes('online'))) score += 105;
  // Microsoft Eric / Ryan Natural
  if ((lower.includes('eric') || lower.includes('ryan')) && lower.includes('natural')) score += 95;
  // Google US English (Journey-D, Neural2-D, Standard-B, Wavenet-D) - clean, accentless American male
  if (lower.includes('google') && (lower.includes('us english') || lang === 'en-us') && !isLikelyFemaleVoice(v.name)) {
    score += 90;
  }
  // Apple Alex (en-US) - macOS/iOS articulate, mature American male standard
  if (lower === 'alex' || lower.includes('alex (en-us)')) score += 85;
  // Apple Tom / Fred / Evan / Nathan (en-US)
  if (lower.includes('tom') || lower.includes('evan') || lower.includes('nathan')) score += 80;
  if (lower.includes('fred')) score += 70;

  // Generic natural / neural indicators
  if (lower.includes('natural') || lower.includes('neural')) score += 30;
  if (lower.includes('male') || lower.includes('man')) score += 25;
  if (lower.includes('david') || lower.includes('mark')) score += 20;
  if (lang === 'en-us') score += 15;

  return score;
};

// Generic scorer for international languages
const getLanguageVoiceScore = (v: SpeechSynthesisVoice, targetLang: string): number => {
  const vLang = (v.lang || '').toLowerCase().replace('_', '-');
  const target = targetLang.toLowerCase().replace('_', '-');
  const base = target.split('-')[0];

  if (!vLang.startsWith(base)) return -100;

  let score = 50;
  if (vLang === target) score += 30;
  if (!isLikelyFemaleVoice(v.name)) score += 20; // Default to male
  const lower = v.name.toLowerCase();
  if (lower.includes('natural') || lower.includes('neural') || lower.includes('online')) score += 25;
  if (lower.includes('google') || lower.includes('microsoft') || lower.includes('apple')) score += 15;
  return score;
};

// Formats voice name for clean UI selector
const formatVoiceDisplayLabel = (v: SpeechSynthesisVoice, currentLang: string): string => {
  const clean = v.name
    .replace(/Microsoft |Google |Online \(Natural\) - |English \(United States\)|en-US-|en-GB-/gi, '')
    .trim() || v.name;
    
  if (currentLang === 'en-US') {
    const isGuy = v.name.toLowerCase().includes('guy');
    const isDavis = v.name.toLowerCase().includes('davis');
    const isAlex = v.name.toLowerCase().includes('alex');
    const isChris = v.name.toLowerCase().includes('christopher');
    
    if (isGuy) return `⭐ ${clean} (Late 20s American Male • Mature & Neutral)`;
    if (isDavis) return `⭐ ${clean} (American Male • Confident & Deep)`;
    if (isChris) return `⭐ ${clean} (American Male • Broadcast Narrator)`;
    if (isAlex) return `⭐ ${clean} (American Male • Articulate Classic)`;
    return `${clean} (American Male)`;
  }
  return `${clean} (${v.lang})`;
};

interface VideoWalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartTrial: () => void;
}

export const VideoWalkthroughModal: React.FC<VideoWalkthroughModalProps> = ({
  isOpen,
  onClose,
  onStartTrial,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [slideProgress, setSlideProgress] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showCaptions, setShowCaptions] = useState<boolean>(true);
  const [autoAdvance, setAutoAdvance] = useState<boolean>(false);
  
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [hasFinishedSpeech, setHasFinishedSpeech] = useState<boolean>(false);
  const [transitionCountdown, setTransitionCountdown] = useState<number | null>(null);

  // Multi-Language & Voice Selection State
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  const [allLanguageOptions, setAllLanguageOptions] = useState<SupportedLanguage[]>(BASE_SUPPORTED_LANGUAGES);
  const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');
  const [translatedCaptions, setTranslatedCaptions] = useState<Record<string, string>>({});
  const [isTranslating, setIsTranslating] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const autoAdvanceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const keepAliveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const sentenceIndexRef = useRef<number>(0);
  const isCancelledRef = useRef<boolean>(false);

  // Walkthrough Mode: Start-to-Sale Guide vs. 60-Day Financial Proof
  const [walkthroughTrack, setWalkthroughTrack] = useState<WalkthroughTrack>('startToSale');
  const activeSlides = walkthroughTrack === 'startToSale' ? START_TO_SALE_SLIDES : FINANCIAL_PROOF_SLIDES;
  const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0];

  const handleTrackChange = (newTrack: WalkthroughTrack) => {
    clearAllTimers();
    if (synthRef.current) synthRef.current.cancel();
    setWalkthroughTrack(newTrack);
    setCurrentSlideIndex(0);
  };

  // Helper to split text into manageable sentences (avoids Chrome 15s cutoff bug)
  const getSentences = (text: string): string[] => {
    const raw = text.match(/[^.!?]+[.!?]+(\s|$)|[^.!?]+$/g);
    return raw ? raw.map((s) => s.trim()).filter((s) => s.length > 0) : [text];
  };

  const filterAndSetVoices = (allVoices: SpeechSynthesisVoice[], langCode: string) => {
    let matching: SpeechSynthesisVoice[] = [];
    if (langCode === 'en-US' || langCode.startsWith('en')) {
      // Strictly en-US American male voices without accent
      const usVoices = allVoices.filter((v) => {
        const l = (v.lang || '').toLowerCase().replace('_', '-');
        return l === 'en-us' || l === 'en';
      });
      matching = [...usVoices].sort((a, b) => getAmericanMaleVoiceScore(b) - getAmericanMaleVoiceScore(a));
      // Fallback if system has no en-US tagged voices
      if (matching.length === 0) {
        matching = allVoices.filter((v) => (v.lang || '').startsWith('en'));
      }
    } else {
      const base = langCode.split('-')[0].toLowerCase();
      const langVoices = allVoices.filter((v) => (v.lang || '').toLowerCase().startsWith(base));
      matching = [...langVoices].sort((a, b) => getLanguageVoiceScore(b, langCode) - getLanguageVoiceScore(a, langCode));
      if (matching.length === 0) {
        matching = allVoices; // fallback if no specific voice exists for rare locale
      }
    }

    setAvailableVoices(matching);
    if (matching.length > 0) {
      // If current selected voice is not in matching voices, select top one
      const stillValid = matching.some((v) => v.name === selectedVoiceName);
      if (!stillValid) {
        setSelectedVoiceName(matching[0].name);
      }
    }
  };

  const loadVoices = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const allVoices = window.speechSynthesis.getVoices();
      if (allVoices.length > 0) {
        // Dynamically discover all unique languages installed on user device
        const discoveredCodes = new Set<string>();
        allVoices.forEach((v) => {
          if (v.lang) discoveredCodes.add(v.lang);
        });

        // Merge discovered languages into language options
        const dynamicLanguages = [...BASE_SUPPORTED_LANGUAGES];
        discoveredCodes.forEach((code) => {
          const normalized = code.replace('_', '-');
          if (!dynamicLanguages.some((l) => l.code.toLowerCase() === normalized.toLowerCase())) {
            dynamicLanguages.push({
              code: normalized,
              name: `Language (${normalized})`,
              nativeName: normalized,
              flag: '🌐',
            });
          }
        });
        setAllLanguageOptions(dynamicLanguages);

        // Filter voices for currently selected language
        filterAndSetVoices(allVoices, selectedLanguage);
      }
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          loadVoices();
        };
      }
    }
    return () => {
      clearAllTimers();
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const clearAllTimers = () => {
    isCancelledRef.current = true;
    if (autoAdvanceTimeoutRef.current) {
      clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
    if (keepAliveIntervalRef.current) {
      clearInterval(keepAliveIntervalRef.current);
      keepAliveIntervalRef.current = null;
    }
  };

  const playNarration = async () => {
    clearAllTimers();
    isCancelledRef.current = false;
    setSlideProgress(0);
    setIsSpeaking(false);
    setHasFinishedSpeech(false);
    setTransitionCountdown(null);

    const synth = synthRef.current;
    if (!synth) return;

    synth.cancel();
    if (isMuted || !isPlaying) return;

    // Resolve text in chosen language
    let textToSpeak = currentSlide.voiceoverText;
    const isEnglish = selectedLanguage === 'en-US' || selectedLanguage.startsWith('en');

    if (!isEnglish) {
      const cacheKey = `${selectedLanguage}:${currentSlide.id}:${walkthroughTrack}`;
      if (translatedCaptions[cacheKey]) {
        textToSpeak = translatedCaptions[cacheKey];
      } else {
        setIsTranslating(true);
        try {
          const langObj = allLanguageOptions.find((l) => l.code === selectedLanguage);
          const res = await translateVoiceoverApi({
            text: currentSlide.voiceoverText,
            targetLang: selectedLanguage,
            targetLangName: langObj?.name || selectedLanguage,
          });
          if (res && res.translatedText && !isCancelledRef.current) {
            textToSpeak = res.translatedText;
            setTranslatedCaptions((prev) => ({ ...prev, [cacheKey]: res.translatedText }));
          }
        } catch (tErr) {
          console.warn('Voiceover translation error:', tErr);
        } finally {
          setIsTranslating(false);
        }
      }
    }

    if (isCancelledRef.current || !isOpen) return;

    const sentences = getSentences(textToSpeak);
    sentenceIndexRef.current = 0;

    keepAliveIntervalRef.current = setInterval(() => {
      if (synth.speaking && !synth.paused) {
        synth.pause();
        synth.resume();
      }
    }, 8000);

    const speakChunk = (index: number) => {
      if (isCancelledRef.current || !isOpen || index >= sentences.length) {
        if (index >= sentences.length && !isCancelledRef.current) {
          setIsSpeaking(false);
          setHasFinishedSpeech(true);
          setSlideProgress(100);

          if (autoAdvance) {
            let count = 4;
            setTransitionCountdown(count);

            countdownIntervalRef.current = setInterval(() => {
              count -= 1;
              if (count > 0) {
                setTransitionCountdown(count);
              } else {
                if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
              }
            }, 1000);

            autoAdvanceTimeoutRef.current = setTimeout(() => {
              setTransitionCountdown(null);
              advanceSlideNext();
            }, 4200);
          }
        }
        return;
      }

      const textChunk = sentences[index];
      const utterance = new SpeechSynthesisUtterance(textChunk);
      
      // Calibrated specifically for a normal American male in his late 20s (mature, clear, resonant, no accent)
      if (isEnglish) {
        utterance.rate = Math.max(0.75, Math.min(1.5, playbackSpeed * 0.98)); // Mature, smooth, natural pace
        utterance.pitch = 0.95; // Warm, resonant late-20s male fundamental pitch (avoids high or robotic)
      } else {
        utterance.rate = Math.max(0.75, Math.min(1.5, playbackSpeed * 1.0));
        utterance.pitch = 1.0;
      }

      const voices = synth.getVoices();
      let chosenVoice: SpeechSynthesisVoice | undefined;

      if (selectedVoiceName) {
        chosenVoice = voices.find((v) => v.name === selectedVoiceName);
      }
      if (!chosenVoice) {
        if (isEnglish) {
          const sorted = voices.filter((v) => {
            const l = (v.lang || '').toLowerCase().replace('_', '-');
            return l === 'en-us' || l === 'en';
          }).sort((a, b) => getAmericanMaleVoiceScore(b) - getAmericanMaleVoiceScore(a));
          chosenVoice = sorted[0];
        } else {
          const sorted = voices.filter((v) => (v.lang || '').toLowerCase().startsWith(selectedLanguage.split('-')[0].toLowerCase()))
            .sort((a, b) => getLanguageVoiceScore(b, selectedLanguage) - getLanguageVoiceScore(a, selectedLanguage));
          chosenVoice = sorted[0];
        }
      }

      if (chosenVoice) utterance.voice = chosenVoice;

      (window as any).__sellerScoutUtterance = utterance;

      utterance.onstart = () => {
        if (!isCancelledRef.current) {
          setIsSpeaking(true);
          setHasFinishedSpeech(false);
          const progressPercent = Math.round((index / sentences.length) * 100);
          setSlideProgress(progressPercent);
        }
      };

      utterance.onend = () => {
        if (!isCancelledRef.current) {
          sentenceIndexRef.current = index + 1;
          speakChunk(index + 1);
        }
      };

      utterance.onerror = (e) => {
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        if (!isCancelledRef.current) speakChunk(index + 1);
      };

      synth.speak(utterance);
    };

    speakChunk(0);
  };

  useEffect(() => {
    if (!isOpen) {
      clearAllTimers();
      if (synthRef.current) synthRef.current.cancel();
      return;
    }

    playNarration();

    return () => {
      clearAllTimers();
      if (synthRef.current) synthRef.current.cancel();
    };
  }, [currentSlideIndex, walkthroughTrack, isMuted, isPlaying, playbackSpeed, isOpen, autoAdvance, selectedLanguage]);

  const getActiveTranscriptText = (): string => {
    if (selectedLanguage === 'en-US' || selectedLanguage.startsWith('en')) {
      return currentSlide.voiceoverText;
    }
    const key = `${selectedLanguage}:${currentSlide.id}:${walkthroughTrack}`;
    return translatedCaptions[key] || currentSlide.voiceoverText;
  };

  const advanceSlideNext = () => {
    clearAllTimers();
    if (synthRef.current) synthRef.current.cancel();
    if (currentSlideIndex < activeSlides.length - 1) {
      setCurrentSlideIndex((c) => c + 1);
    } else {
      setIsPlaying(false);
    }
  };

  const handleNext = () => {
    clearAllTimers();
    if (synthRef.current) synthRef.current.cancel();
    advanceSlideNext();
  };

  const handlePrev = () => {
    clearAllTimers();
    if (synthRef.current) synthRef.current.cancel();
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleRestartSlideAudio = () => {
    playNarration();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md animate-in fade-in">
      <div 
        ref={containerRef}
        className={`bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-6xl flex flex-col overflow-hidden shadow-2xl transition-all ${
          isFullscreen ? 'h-full max-w-none rounded-none' : 'max-h-[94vh]'
        }`}
      >
        {/* Top Video Header */}
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white tracking-wide">
                  {walkthroughTrack === 'startToSale'
                    ? 'Start-to-Sale Guide (Amazon, Etsy, TikTok & Stripe)'
                    : 'Seller Scout AI Case Study: From $25 to $1,000/Month'}
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-500/20 text-indigo-300">
                  Slide {currentSlideIndex + 1} of {activeSlides.length}
                </span>
                {isSpeaking && (
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Narrator Speaking
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">{currentSlide.chapter}</p>
            </div>
          </div>

          {/* Center Mode Switcher Tabs */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900 border border-slate-800 p-0.5 rounded-xl">
            <button
              onClick={() => handleTrackChange('startToSale')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                walkthroughTrack === 'startToSale'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🚀 Start-to-Sale Guide
            </button>
            <button
              onClick={() => handleTrackChange('financialProof')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                walkthroughTrack === 'financialProof'
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 $25 to $1k/mo Financial P&L
            </button>
          </div>

          <div className="flex items-center gap-2">
            {/* Auto-Advance Toggle */}
            <button
              onClick={() => {
                if (transitionCountdown !== null) clearAllTimers();
                setAutoAdvance(!autoAdvance);
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors flex items-center gap-1.5 ${
                autoAdvance
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
              }`}
              title="Toggle automatic slide advancing after narration finishes"
            >
              <span>Auto-Advance:</span>
              <span className={autoAdvance ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
                {autoAdvance ? 'ON (4s)' : 'OFF'}
              </span>
            </button>

            {/* Captions Toggle */}
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className={`px-2 py-1 rounded text-xs font-medium border ${
                showCaptions ? 'bg-slate-800 text-emerald-400 border-emerald-500/40' : 'text-slate-400 border-slate-800'
              }`}
              title="Toggle Subtitles / Captions"
            >
              CC
            </button>

            {/* Fullscreen */}
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-200"
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Track Switcher */}
        <div className="flex md:hidden px-3 py-2 bg-slate-950/90 border-b border-slate-800 items-center justify-center gap-2">
          <button
            onClick={() => handleTrackChange('startToSale')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
              walkthroughTrack === 'startToSale'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            🚀 Start-to-Sale
          </button>
          <button
            onClick={() => handleTrackChange('financialProof')}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold transition-all ${
              walkthroughTrack === 'financialProof'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
            }`}
          >
            📊 Financial P&L
          </button>
        </div>

        {/* Video Canvas / Slide Viewport with Graphs and Calculations */}
        <div className="relative flex-1 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 sm:p-6 overflow-y-auto min-h-[460px]">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-72 h-72 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

          {/* Main Slide Content: 2-Column Responsive Layout */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-5 max-w-6xl mx-auto w-full">
            
            {/* Left Column: Narrative, Key Stats, and Actual Step-by-Step Calculations */}
            <div className="lg:col-span-7 space-y-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentSlide.stepNumber} &bull; {currentSlide.chapter}
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-snug">
                  {currentSlide.title}
                </h2>
                <p className="text-xs text-indigo-300 font-medium mt-0.5">
                  {currentSlide.subtitle}
                </p>
              </div>

              {/* Scenario Narrative */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 leading-relaxed shadow-inner">
                <strong className="text-emerald-400 font-bold block mb-1">Hypothetical Case Scenario:</strong>
                {currentSlide.scenario}
              </div>

              {/* 3 Key Numerical Stats */}
              <div className="grid grid-cols-3 gap-2">
                {currentSlide.highlightStats.map((stat, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="text-[10px] text-slate-400 font-medium truncate">{stat.label}</div>
                    <div className={`text-base sm:text-lg font-black mt-0.5 ${stat.color}`}>
                      {stat.value}
                    </div>
                    {stat.sub && (
                      <div className="text-[9px] text-slate-500 truncate mt-0.5">{stat.sub}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Actual Step-by-Step Calculations Table */}
              <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 space-y-2">
                <div className="flex items-center justify-between border-b border-slate-800 pb-1.5">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <Calculator className="w-3.5 h-3.5 text-emerald-400" />
                    Actual Mathematical Calculations
                  </span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Verified Math</span>
                </div>

                <div className="space-y-2 text-xs">
                  {currentSlide.calculations.map((calc, cIdx) => (
                    <div key={cIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80">
                      <div>
                        <span className="font-semibold text-slate-200 block sm:inline">{calc.label}:</span>
                        {calc.formula && (
                          <span className="text-[11px] text-slate-400 sm:ml-1.5 font-mono">
                            {calc.formula}
                          </span>
                        )}
                        {calc.detail && (
                          <span className="text-[10px] text-slate-500 block">{calc.detail}</span>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 font-bold font-mono text-xs">
                          {calc.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strategic Takeaway */}
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-indigo-950/30 border border-indigo-500/30 text-xs text-indigo-200">
                <Zap className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span><strong>Core Strategic Lesson:</strong> {currentSlide.keyTakeaway}</span>
              </div>
            </div>

            {/* Right Column: Dynamic Interactive Graph & Chart Specific to Slide */}
            <div className="lg:col-span-5 flex flex-col justify-center">
              {walkthroughTrack === 'startToSale' ? (
                <>
                  {currentSlide.id === 1 && <StartToSaleStage1Visual />}
                  {currentSlide.id === 2 && <StartToSaleStage2Visual />}
                  {currentSlide.id === 3 && <StartToSaleStage3Visual />}
                  {currentSlide.id === 4 && <StartToSaleStage4Visual />}
                  {currentSlide.id === 5 && <StartToSaleStage5Visual />}
                </>
              ) : (
                <>
                  {currentSlide.id === 1 && <Slide1GrowthChart />}
                  {currentSlide.id === 2 && <Slide2MarginComparison />}
                  {currentSlide.id === 3 && <Slide3WaterfallChart />}
                  {currentSlide.id === 4 && <Slide4SubscriberMRRChart />}
                  {currentSlide.id === 5 && <Slide5BalanceSheetChart />}
                </>
              )}
            </div>

          </div>

          {/* Auto-Advance Countdown Toast */}
          {transitionCountdown !== null && (
            <div className="relative z-20 mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-between text-xs text-emerald-200 shadow-lg max-w-6xl mx-auto">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 animate-spin" />
                <span>Narration completed. Advancing to next step in <strong>{transitionCountdown}s</strong>...</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => clearAllTimers()}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-xs"
                >
                  Stay on this slide
                </button>
                <button
                  onClick={handleNext}
                  className="px-2.5 py-1 rounded bg-emerald-500 text-slate-950 font-bold text-xs"
                >
                  Next Now
                </button>
              </div>
            </div>
          )}

          {/* Subtitles / Captions Box */}
          {showCaptions && (
            <div className="relative z-10 mt-4 p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-200 leading-relaxed font-sans shadow-md max-w-6xl mx-auto">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Narration Transcript</span>
                  {selectedLanguage !== 'en-US' && (
                    <span className="ml-1 text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                      {allLanguageOptions.find(l => l.code === selectedLanguage)?.name || selectedLanguage}
                    </span>
                  )}
                  {isTranslating && (
                    <span className="ml-1.5 text-[9px] text-indigo-300 animate-pulse font-normal">
                      (Translating speech...)
                    </span>
                  )}
                </span>
                <button
                  onClick={handleRestartSlideAudio}
                  className="text-[11px] text-slate-400 hover:text-emerald-300 flex items-center gap-1 font-medium cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Replay Audio
                </button>
              </div>
              <p className="italic text-slate-300">
                "{getActiveTranscriptText()}"
              </p>
            </div>
          )}
        </div>

        {/* Video Scrubber & Playhead Controls */}
        <div className="p-3.5 bg-slate-950 border-t border-slate-800 space-y-3">
          {/* Progress Timeline across 5 slides */}
          <div className="grid grid-cols-5 gap-2">
            {activeSlides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => {
                  clearAllTimers();
                  if (synthRef.current) synthRef.current.cancel();
                  setCurrentSlideIndex(idx);
                }}
                className={`h-2.5 rounded-full transition-all relative overflow-hidden ${
                  idx < currentSlideIndex
                    ? 'bg-emerald-500'
                    : idx === currentSlideIndex
                    ? 'bg-slate-700 ring-1 ring-emerald-400/50'
                    : 'bg-slate-800 hover:bg-slate-700'
                }`}
                title={`Slide ${idx + 1}: ${slide.title}`}
              >
                {idx === currentSlideIndex && (
                  <div 
                    className="absolute inset-y-0 left-0 bg-emerald-400 transition-all duration-300"
                    style={{ width: `${slideProgress}%` }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Player Bottom Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
            {/* Left Controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (isPlaying) {
                    clearAllTimers();
                    if (synthRef.current) synthRef.current.cancel();
                    setIsPlaying(false);
                  } else {
                    setIsPlaying(true);
                  }
                }}
                className="w-8 h-8 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center font-bold transition-all shadow-md"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>

              <button
                onClick={handlePrev}
                disabled={currentSlideIndex === 0}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                title="Previous Slide"
              >
                <SkipBack className="w-4 h-4" />
              </button>

              <button
                onClick={handleNext}
                disabled={currentSlideIndex === activeSlides.length - 1}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-40"
                title="Next Slide"
              >
                <SkipForward className="w-4 h-4" />
              </button>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-1.5 rounded-lg border transition-colors ${
                  isMuted ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' : 'bg-slate-800 border-slate-700 text-slate-300'
                }`}
                title={isMuted ? 'Unmute Narration' : 'Mute Narration'}
              >
                {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Speed selector */}
              <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[11px]">
                {[1.0, 1.25, 1.5].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-1.5 py-0.5 rounded font-medium ${
                      playbackSpeed === spd ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>

              {/* All Known Languages Dropdown */}
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                <Globe className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                <span className="text-slate-400 font-medium hidden sm:inline">Language:</span>
                <select
                  value={selectedLanguage}
                  onChange={(e) => {
                    const newLang = e.target.value;
                    clearAllTimers();
                    if (synthRef.current) synthRef.current.cancel();
                    setSelectedLanguage(newLang);
                    if (synthRef.current) {
                      filterAndSetVoices(synthRef.current.getVoices(), newLang);
                    }
                    setTimeout(() => playNarration(), 100);
                  }}
                  className="bg-transparent text-indigo-300 font-bold focus:outline-none cursor-pointer max-w-[130px] sm:max-w-[160px] truncate"
                  title="Select narration language (All known world languages supported)"
                >
                  {allLanguageOptions.map((lang) => (
                    <option key={lang.code} value={lang.code} className="bg-slate-900 text-white">
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Normal American Male Voice Selector (Late 20s, Mature, Accent-Free) */}
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px]">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-slate-400 font-medium">Voice:</span>
                <select
                  value={selectedVoiceName}
                  onChange={(e) => {
                    clearAllTimers();
                    if (synthRef.current) synthRef.current.cancel();
                    setSelectedVoiceName(e.target.value);
                    setTimeout(() => playNarration(), 50);
                  }}
                  className="bg-transparent text-emerald-300 font-bold focus:outline-none cursor-pointer max-w-[150px] sm:max-w-[210px] truncate"
                  title="Voice Tone: Normal American Male in Late 20s (Mature, Accent-Free)"
                >
                  {availableVoices.slice(0, 15).map((v) => (
                    <option key={v.name} value={v.name} className="bg-slate-900 text-white">
                      {formatVoiceDisplayLabel(v, selectedLanguage)}
                    </option>
                  ))}
                </select>
              </div>

              {selectedLanguage === 'en-US' && (
                <div className="hidden xl:flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-300 font-semibold shrink-0">
                  <span>Late 20s American Male • Mature & Accent-Free</span>
                </div>
              )}
            </div>

            {/* Right Action CTA */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400 hidden sm:inline text-[11px]">
                {hasFinishedSpeech ? '✓ Narration Complete' : 'Listening...'}
              </span>

              <button
                onClick={() => {
                  onClose();
                  onStartTrial();
                }}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 flex items-center gap-1.5 transition-all"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Start 3-Day Free Trial ($0 Today)</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
