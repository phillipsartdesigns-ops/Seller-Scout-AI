import React, { useState, useRef, useEffect } from 'react';
import { 
  Sparkles, 
  Wand2, 
  Download, 
  Copy, 
  Check, 
  BookOpen, 
  FileText, 
  Layers, 
  ShieldCheck, 
  ExternalLink, 
  Zap, 
  Wrench, 
  Palette, 
  Hammer, 
  Scissors, 
  GraduationCap, 
  DollarSign, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw,
  Info,
  HelpCircle,
  FileCode,
  Share2,
  Grid,
  Eye,
  Sliders,
  Settings,
  Printer
} from 'lucide-react';
import { DigitalProductType, DigitalProductPackage, PromptEnhanceResult, CricutCutAsset } from '../types';
import { enhancePromptApi, buildDigitalProductApi } from '../services/api';

interface DigitalProductBuilderTabProps {
  initialPrompt?: string;
  initialType?: DigitalProductType;
  onOpenListingStudio?: (productName: string, category: string) => void;
  onOpenPricing: () => void;
  hasActiveSubscription: boolean;
}

const PRESET_IDEAS: {
  label: string;
  icon: any;
  type: DigitalProductType;
  rawPrompt: string;
  description: string;
  estimatedMargin: string;
}[] = [
  {
    label: 'Cricut SVG Decals & Cut Files',
    icon: Scissors,
    type: 'cricut_svg_decals',
    rawPrompt: 'Mountain pine tree outdoor adventure geometric decal for car windows, hydro-flasks, and laptops with layered vinyl cut paths for Cricut Design Space',
    description: 'Clean cut-ready SVG vectors + DXF + 300 DPI PNG + Cricut blade & cut settings',
    estimatedMargin: '97% Net Margin ($12.99 / sale)',
  },
  {
    label: 'OEM Truck Decals & Hot Rod Flames',
    icon: Zap,
    type: 'cricut_svg_decals',
    rawPrompt: 'OEM Dodge Dakota bedside decals and flames, authentic 4x4 Magnum V8 badging, aerodynamic sweeping hot-rod fire tongues with layered vinyl cut paths for Cricut Design Space',
    description: 'Multi-layer flame vector cut paths + OEM truck typography + wet vinyl install guide',
    estimatedMargin: '98% Net Margin ($18.99 / sale)',
  },
  {
    label: 'Coloring Sheets & Books',
    icon: Palette,
    type: 'coloring_book',
    rawPrompt: 'Mindful botanical flowers, succulent gardens, and animal mandalas adult coloring book with 50 pages and swatches',
    description: 'High-margin printable 300 DPI coloring pages + Cricut SVG cut-outs',
    estimatedMargin: '94% Net Margin ($16.99 / sale)',
  },
  {
    label: 'Mechanics & Engine DIY Guides',
    icon: Wrench,
    type: 'mechanics_tutorial',
    rawPrompt: 'Small engine and lawn mower carburetor rebuild, spark plug troubleshooting, and oil maintenance step-by-step field manual',
    description: 'Illustrated flowcharts, torque specs & embedded video QR codes',
    estimatedMargin: '92% Net Margin ($29.00 / sale)',
  },
  {
    label: 'Woodworking & Furniture Plans',
    icon: Hammer,
    type: 'woodworking_plans',
    rawPrompt: 'Modern farmhouse outdoor cedar patio dining table and bench with materials cut-list, pocket hole angles, and 3D schematics',
    description: 'Precise hardware lists, exploded 3D diagrams & cut optimizers',
    estimatedMargin: '95% Net Margin ($24.95 / sale)',
  },
  {
    label: 'Hobbies DIY & Resin/Macrame',
    icon: Scissors,
    type: 'diy_hobbies',
    rawPrompt: 'Beginner epoxy resin floral jewelry and coasters step-by-step workshop masterclass with mold curing checklist and supplier links',
    description: 'Step-by-step printable patterns, supply checklists & tips',
    estimatedMargin: '91% Net Margin ($22.50 / sale)',
  },
  {
    label: 'Kids Learning & Activity Books',
    icon: GraduationCap,
    type: 'educational_ebook',
    rawPrompt: 'Kindergarten to 1st grade interactive math puzzle workbook, scissor skill cut-outs, and alphabet handwriting tracing sheets',
    description: 'Parent-friendly printable worksheets and gamified certificates',
    estimatedMargin: '96% Net Margin ($14.99 / sale)',
  },
  {
    label: 'Daily Digital Planner & Tracker',
    icon: FileText,
    type: 'digital_planner',
    rawPrompt: 'Hyperlinked aesthetic GoodNotes / iPad daily productivity planner with financial budget, habit trackers, and meal organizers',
    description: 'Clickable tabs, Canva template link + sticker packs',
    estimatedMargin: '98% Net Margin ($19.00 / sale)',
  },
];

// Curated Cut-Ready Vector SVG Decal Presets for Cricut
const CRICUT_VECTOR_TEMPLATES = [
  {
    id: 'adventure_mountains',
    title: 'Mountain Adventure Decal',
    subtitle: 'Outdoor Pine Trees & Geometric Peaks',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <g id="Sun_and_Peaks">
    <circle cx="250" cy="180" r="70" fill="#10b981" />
    <path d="M70,380 L180,210 L250,310 L320,190 L430,380 Z" fill="#0f172a" />
    <path d="M180,210 L205,250 L185,260 L215,290 L160,310 Z" fill="#ffffff" />
    <path d="M320,190 L345,235 L325,245 L355,275 L300,295 Z" fill="#ffffff" />
  </g>
  <g id="Pine_Forest">
    <path d="M110,380 L130,320 L120,320 L135,280 L125,280 L140,240 L155,280 L145,280 L160,320 L150,320 L170,380 Z" fill="#10b981" />
    <path d="M330,380 L350,310 L340,310 L355,270 L345,270 L360,230 L375,270 L365,270 L380,310 L370,310 L390,380 Z" fill="#10b981" />
    <path d="M225,380 L245,300 L235,300 L250,260 L265,300 L255,300 L275,380 Z" fill="#10b981" />
  </g>
  <g id="Decal_Banner">
    <rect x="50" y="395" width="400" height="42" rx="8" fill="#10b981" />
    <text x="250" y="424" font-family="Arial Black, Impact, sans-serif" font-size="20" font-weight="900" text-anchor="middle" fill="#022c22" letter-spacing="3">STAY WILD • EXPLORE</text>
  </g>
</svg>`,
  },
  {
    id: 'botanical_monogram',
    title: 'Floral Botanical Monogram',
    subtitle: 'Wildflower Laurel & Custom Initial Frame',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <g id="Laurel_Wreath">
    <circle cx="250" cy="250" r="185" fill="none" stroke="#10b981" stroke-width="6" stroke-dasharray="10 6" />
    <circle cx="250" cy="250" r="165" fill="none" stroke="#0f172a" stroke-width="4" />
    <path d="M120,250 C110,200 130,150 170,120 C190,140 180,180 150,210 Z" fill="#10b981" />
    <path d="M380,250 C390,200 370,150 330,120 C310,140 320,180 350,210 Z" fill="#10b981" />
    <path d="M150,330 C130,360 170,390 200,380 C190,350 170,340 150,330 Z" fill="#10b981" />
    <path d="M350,330 C370,360 330,390 300,380 C310,350 330,340 350,330 Z" fill="#10b981" />
  </g>
  <g id="Monogram_Letter">
    <text x="250" y="295" font-family="Georgia, serif" font-size="130" font-weight="bold" text-anchor="middle" fill="#0f172a">M</text>
    <text x="250" y="340" font-family="Arial, sans-serif" font-size="16" font-weight="bold" text-anchor="middle" fill="#10b981" letter-spacing="4">HANDCRAFTED</text>
  </g>
</svg>`,
  },
  {
    id: 'mama_bear',
    title: 'Mama Bear Silhouette Decal',
    subtitle: 'Woodland Bear & Geometric Cubs',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <g id="Mama_Bear_Body">
    <path d="M60,330 C60,250 110,210 170,210 C210,210 240,230 270,220 C310,200 360,180 400,210 C430,230 450,260 440,290 C430,320 410,340 380,340 C370,340 360,370 340,370 C320,370 310,340 280,340 C260,340 240,370 210,370 C190,370 180,340 150,340 C130,340 110,370 80,370 C70,370 60,350 60,330 Z" fill="#0f172a" />
    <!-- Cut Out Lettering Inside Bear Body -->
    <text x="250" y="290" font-family="Impact, Arial Black, sans-serif" font-size="44" font-weight="900" text-anchor="middle" fill="#ffffff" letter-spacing="4">MAMA BEAR</text>
    <!-- Arrow Accent -->
    <path d="M120,305 L380,305 M380,305 L360,295 M380,305 L360,315" stroke="#10b981" stroke-width="4" stroke-linecap="round" fill="none" />
  </g>
</svg>`,
  },
  {
    id: 'retro_sunset_surf',
    title: 'Retro Sunset Surf & Van Decal',
    subtitle: '70s Vintage Stripe Wave & Palm Trees',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <g id="Retro_Sunset_Stripes">
    <path d="M100,280 A150,150 0 0,1 400,280 Z" fill="#f59e0b" />
    <path d="M115,280 A135,135 0 0,1 385,280 Z" fill="#ef4444" />
    <path d="M135,280 A115,115 0 0,1 365,280 Z" fill="#ec4899" />
    <path d="M160,280 A90,90 0 0,1 340,280 Z" fill="#8b5cf6" />
    <rect x="80" y="278" width="340" height="12" fill="#0f172a" rx="4" />
  </g>
  <g id="Palms_and_Waves">
    <!-- Silhouette Palms -->
    <path d="M220,280 Q230,200 210,160 Q240,180 260,170 Q240,190 250,210 Q235,230 230,280 Z" fill="#0f172a" />
    <path d="M280,280 Q290,210 270,180 Q300,195 320,185 Q300,205 310,225 Q295,245 290,280 Z" fill="#0f172a" />
  </g>
  <g id="Ocean_Text">
    <text x="250" y="340" font-family="Arial Black, Impact, sans-serif" font-size="28" font-weight="900" text-anchor="middle" fill="#0f172a" letter-spacing="3">ENDLESS WAVES</text>
  </g>
</svg>`,
  },
  {
    id: 'dodge_dakota_flames',
    title: 'OEM Dodge Dakota Flames & 4x4',
    subtitle: 'Sweeping Bedside Hot-Rod Fire Tongues & OEM Typography',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 320" width="100%" height="100%">
  <!-- Cricut Cut Layer 1: Sweeping Bedside Hot Rod Outer Flames -->
  <g id="Layer_1_Outer_Flames" fill="#0f172a">
    <path d="M 30,160 C 80,140 120,100 160,50 C 140,90 150,120 180,130 C 220,140 270,90 320,30 C 290,80 300,120 340,135 C 390,150 450,110 520,40 C 480,95 500,135 550,145 C 610,155 680,115 760,60 C 710,110 720,150 780,170 C 710,185 680,225 720,280 C 650,230 600,215 540,240 C 480,265 460,300 420,310 C 435,270 410,230 360,215 C 310,200 270,245 230,290 C 240,240 210,205 170,195 C 120,185 80,210 30,160 Z" />
  </g>
  <!-- Cricut Cut Layer 2: Core Crimson Fire Licks -->
  <g id="Layer_2_Inner_Flame_Licks" fill="#ef4444">
    <path d="M 80,160 C 120,145 150,115 180,80 C 165,110 175,130 200,138 C 240,148 280,110 325,65 C 305,100 315,128 350,140 C 400,155 450,125 505,75 C 475,115 490,145 535,152 C 590,162 645,135 710,95 C 670,130 680,160 725,172 C 675,185 650,210 680,250 C 625,215 580,205 530,222 C 480,240 455,275 425,280 C 432,250 415,220 375,208 C 330,195 300,230 265,265 C 272,225 250,198 215,190 C 170,180 135,195 80,160 Z" />
  </g>
  <!-- Cricut Cut Layer 3: Blazing Core Yellow Tongue -->
  <g id="Layer_3_Core_Blaze" fill="#f59e0b">
    <path d="M 140,160 C 170,150 190,130 210,105 C 200,125 210,138 230,144 C 265,152 295,125 330,95 C 315,120 325,138 355,146 C 395,156 430,135 470,105 C 450,130 460,150 495,156 C 540,164 580,145 630,120 C 600,145 610,165 645,172 C 610,182 590,200 615,228 C 575,205 540,198 500,210 C 420,185 360,180 270,180 C 220,175 185,180 140,160 Z" />
  </g>
  <!-- Cricut Cut Layer 4: OEM Style Dodge Dakota Truck Typography & 4x4 Badging -->
  <g id="Layer_4_OEM_Dakota_Typography">
    <text x="400" y="215" font-family="'Impact', 'Arial Black', sans-serif" font-size="78" font-style="italic" font-weight="900" text-anchor="middle" fill="#0f172a" letter-spacing="6" stroke="#ffffff" stroke-width="4" paint-order="stroke fill">DAKOTA</text>
    <rect x="230" y="235" width="340" height="26" rx="4" fill="#0f172a" />
    <text x="300" y="253" font-family="'Arial Black', sans-serif" font-size="14" font-weight="900" text-anchor="middle" fill="#ffffff" letter-spacing="2">4X4 OFF-ROAD</text>
    <text x="400" y="253" font-family="'Arial Black', sans-serif" font-size="14" font-weight="900" text-anchor="middle" fill="#ef4444">|</text>
    <text x="480" y="253" font-family="'Arial Black', sans-serif" font-size="14" font-weight="900" text-anchor="middle" fill="#f59e0b" letter-spacing="2">MAGNUM V8</text>
  </g>
</svg>`,
  },
  {
    id: 'hot_rod_tribal_flames',
    title: 'Hot Rod Tribal Flames',
    subtitle: 'Triple-Tier Aerodynamic Fire Licks for Hoods & Rockers',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 280" width="100%" height="100%">
  <g id="Outer_Black_Silhouette" fill="#0f172a">
    <path d="M 20,140 C 70,120 120,70 170,30 C 150,75 170,105 200,115 C 245,125 300,70 350,20 C 320,70 340,105 380,120 C 435,135 500,80 570,25 C 530,80 550,115 600,125 C 670,135 730,90 780,45 C 750,95 760,130 790,145 C 740,165 710,210 750,260 C 680,210 630,200 580,225 C 520,250 490,270 440,275 C 460,230 430,200 380,185 C 330,170 290,215 250,260 C 260,210 230,180 190,170 C 130,160 80,185 20,140 Z" />
  </g>
  <g id="Middle_Crimson_Tongues" fill="#ef4444">
    <path d="M 70,140 C 110,125 150,90 190,60 C 175,95 190,115 220,122 C 260,130 305,90 350,50 C 330,90 345,115 385,128 C 430,140 485,100 545,55 C 515,95 530,122 575,130 C 630,140 680,110 730,75 C 700,115 710,140 740,150 C 700,165 670,195 700,235 C 645,198 605,190 560,208 C 510,228 480,248 440,250 C 452,218 430,192 390,180 C 345,168 315,202 280,235 C 288,198 265,172 230,165 C 180,155 140,170 70,140 Z" />
  </g>
  <g id="Inner_Blaze_Gold" fill="#f59e0b">
    <path d="M 130,140 C 160,130 190,108 220,85 C 210,110 220,122 245,128 C 280,135 315,110 350,80 C 335,105 348,122 380,130 C 420,140 460,115 505,85 C 485,112 495,130 535,135 C 580,142 620,122 665,95 C 640,122 650,140 680,148 C 650,158 630,178 655,208 C 615,182 580,178 545,190 C 490,170 430,165 350,165 C 290,160 220,165 130,140 Z" />
  </g>
</svg>`,
  }
];

export const DigitalProductBuilderTab: React.FC<DigitalProductBuilderTabProps> = ({
  initialPrompt,
  initialType = 'cricut_svg_decals',
  onOpenListingStudio,
  onOpenPricing,
  hasActiveSubscription,
}) => {
  const [prompt, setPrompt] = useState<string>(
    initialPrompt || 'Mountain pine tree outdoor adventure geometric decal for car windows, hydro-flasks, and laptops with layered vinyl cut paths for Cricut Design Space'
  );
  const [productType, setProductType] = useState<DigitalProductType>(initialType);
  const [targetAudience, setTargetAudience] = useState<string>('Cricut and Silhouette crafters, vinyl decal sellers, outdoor enthusiasts, and tumbler/car decal creators');
  const [marketplace, setMarketplace] = useState<string>('etsy');
  
  // Enhancement state
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);
  const [enhancedResult, setEnhancedResult] = useState<PromptEnhanceResult | null>(null);

  // Generation state
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const [generatedProduct, setGeneratedProduct] = useState<DigitalProductPackage | null>(null);

  // Cricut Cut Studio State
  const [selectedTemplateIndex, setSelectedTemplateIndex] = useState<number>(0);
  const [vinylColor, setVinylColor] = useState<string>('#0f172a'); // Matte Black default
  const [vinylName, setVinylName] = useState<string>('Matte Black (Permanent 651)');
  const [showCutWireframe, setShowCutWireframe] = useState<boolean>(false);
  const [selectedMachine, setSelectedMachine] = useState<string>('Cricut Maker 3');
  const [mirrorCut, setMirrorCut] = useState<boolean>(false);

  // UI state
  const [activeOutputSection, setActiveOutputSection] = useState<'overview' | 'cricut' | 'modules' | 'prompts' | 'delivery' | 'license'>('cricut');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [autoDownloadEnabled, setAutoDownloadEnabled] = useState<boolean>(true);
  const [downloadAlert, setDownloadAlert] = useState<string | null>(null);

  // Auto-detect prompt theme to default template if not manually locked
  useEffect(() => {
    if (!prompt) return;
    const pLower = prompt.toLowerCase();
    if (pLower.includes('dakota') || pLower.includes('dodge') || (pLower.includes('truck') && (pLower.includes('flame') || pLower.includes('decal')))) {
      const idx = CRICUT_VECTOR_TEMPLATES.findIndex(t => t.id === 'dodge_dakota_flames');
      if (idx !== -1 && !generatedProduct) {
        setSelectedTemplateIndex(idx);
      }
    } else if (pLower.includes('flame') || pLower.includes('fire') || pLower.includes('hot rod')) {
      const idx = CRICUT_VECTOR_TEMPLATES.findIndex(t => t.id === 'hot_rod_tribal_flames' || t.id === 'dodge_dakota_flames');
      if (idx !== -1 && !generatedProduct) {
        setSelectedTemplateIndex(idx);
      }
    }
  }, [prompt, generatedProduct]);

  // Active SVG content (from generated asset or selected template)
  const activeSvgContent = generatedProduct?.cricutCutAsset?.svgContent || CRICUT_VECTOR_TEMPLATES[selectedTemplateIndex]?.svg || CRICUT_VECTOR_TEMPLATES[0].svg;

  // Automatic trigger that sends the digital download files directly to the user's Downloads folder
  const triggerAutoDownload = (product: DigitalProductPackage) => {
    try {
      const cleanTitle = (product.title || 'digital_product').toLowerCase().replace(/[^a-z0-9]/g, '_');

      // 1. If SVG Cut File is present, trigger automatic download
      const svgData = product.cricutCutAsset?.svgContent || (productType === 'cricut_svg_decals' ? activeSvgContent : null);
      if (svgData) {
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const svgUrl = URL.createObjectURL(svgBlob);
        const svgLink = document.createElement('a');
        svgLink.href = svgUrl;
        svgLink.download = `${cleanTitle}_cricut_cut_ready.svg`;
        document.body.appendChild(svgLink);
        svgLink.click();
        document.body.removeChild(svgLink);
        setTimeout(() => URL.revokeObjectURL(svgUrl), 2000);
      }

      // 2. Full Master Deliverable Guide & Commercial PLR License Package (.md)
      const guideContent = `# ${product.title}
${product.subtitle}

=======================================================
COMMERCIAL PLR RESELL LICENSE & ASSET PACKAGE
=======================================================
Product Type: ${product.productType}
Target Audience: ${product.targetAudience}
Suggested Retail Price: $${product.suggestedPrice}
File Specifications: ${product.fileSpecs}
Delivery Format: ${product.deliveryFormat}

=======================================================
1. MASTER TUTORIAL & COMPLETE PRODUCT MANUAL
=======================================================
${product.fullGuideText}

=======================================================
2. STEP-BY-STEP MODULES & ACTIONABLE DELIVERABLES
=======================================================
${product.modules.map((m) => `--- ${m.stepOrPageNumber}. ${m.title} ---
${m.description}

Actionable Content:
${m.actionableContent}

Template / Asset Link: ${m.promptOrTemplateLink || 'Direct file included in this bundle'}
`).join('\n\n')}

=======================================================
3. CUSTOMER DELIVERY & INSTANT DOWNLOAD PAGE COPY
=======================================================
${product.customerDeliveryPage}

=======================================================
4. UNRESTRICTED COMMERCIAL PLR RESELL CERTIFICATE
=======================================================
${product.commercialLicense}

=======================================================
5. HIGH-CONVERTING BONUS LEAD MAGNET
=======================================================
${product.bonusLeadMagnet}
`;

      setTimeout(() => {
        const guideBlob = new Blob([guideContent], { type: 'text/markdown;charset=utf-8' });
        const guideUrl = URL.createObjectURL(guideBlob);
        const guideLink = document.createElement('a');
        guideLink.href = guideUrl;
        guideLink.download = `${cleanTitle}_master_guide_and_license.md`;
        document.body.appendChild(guideLink);
        guideLink.click();
        document.body.removeChild(guideLink);
        setTimeout(() => URL.revokeObjectURL(guideUrl), 2000);
      }, 400);

      setDownloadAlert(`📥 Auto-Download Sent! "${product.title}" files were automatically saved to your Downloads folder.`);
      setTimeout(() => setDownloadAlert(null), 8000);
    } catch (downloadErr) {
      console.warn('Auto-download trigger notice:', downloadErr);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setIsEnhancing(true);
    try {
      const res = await enhancePromptApi({
        rawPrompt: prompt,
        productType,
      });
      setEnhancedResult(res);
    } catch (err) {
      console.error('Failed to enhance prompt:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleApplyEnhancedPrompt = () => {
    if (enhancedResult?.enhancedPrompt) {
      setPrompt(enhancedResult.enhancedPrompt);
      if (enhancedResult.targetBuyer) {
        setTargetAudience(enhancedResult.targetBuyer);
      }
    }
  };

  const handleBuildProduct = async () => {
    if (!prompt.trim()) return;
    setIsBuilding(true);
    try {
      const res = await buildDigitalProductApi({
        prompt,
        productType,
        targetAudience,
        marketplace,
      });
      setGeneratedProduct(res);

      // Automatic Trigger sending files directly to user's download folder
      if (autoDownloadEnabled) {
        triggerAutoDownload(res);
      }

      // If Cricut type, open cut studio directly
      if (productType === 'cricut_svg_decals' || prompt.toLowerCase().includes('cricut') || prompt.toLowerCase().includes('decal')) {
        setActiveOutputSection('cricut');
      } else {
        setActiveOutputSection('overview');
      }
    } catch (err) {
      console.error('Failed to build digital product:', err);
    } finally {
      setIsBuilding(false);
    }
  };

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Download pure Scalable Vector Graphics (.svg) file for Cricut Design Space
  const handleDownloadSvg = () => {
    const svgData = activeSvgContent;
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanTitle = (generatedProduct?.title || 'cricut_decal').toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `${cleanTitle}_cricut_cut_file.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download high-resolution transparent PNG (300 DPI) for Print Then Cut
  const handleDownloadPng = () => {
    const svgData = activeSvgContent;
    const img = new Image();
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 1500;
      canvas.height = 1500;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, 1500, 1500);
        ctx.drawImage(img, 0, 0, 1500, 1500);
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            const pngUrl = URL.createObjectURL(pngBlob);
            const a = document.createElement('a');
            a.href = pngUrl;
            const cleanTitle = (generatedProduct?.title || 'cricut_decal').toLowerCase().replace(/[^a-z0-9]/g, '_');
            a.download = `${cleanTitle}_300dpi_transparent.png`;
            a.click();
            URL.revokeObjectURL(pngUrl);
          }
        }, 'image/png');
      }
      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  // Download DXF vector cut file for Silhouette & CAD
  const handleDownloadDxf = () => {
    const dxfData = generatedProduct?.cricutCutAsset?.dxfContent || `0\nSECTION\n2\nHEADER\n0\nENDSEC\n0\nSECTION\n2\nTABLES\n0\nENDSEC\n0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nPOLYLINE\n8\nCRICUT_CUT_PATH\n66\n1\n70\n1\n0\nVERTEX\n8\nCRICUT_CUT_PATH\n10\n0.0\n20\n0.0\n0\nVERTEX\n8\nCRICUT_CUT_PATH\n10\n5.0\n20\n5.0\n0\nSEQEND\n0\nENDSEC\n0\nEOF`;
    const blob = new Blob([dxfData], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const cleanTitle = (generatedProduct?.title || 'cricut_decal').toLowerCase().replace(/[^a-z0-9]/g, '_');
    a.download = `${cleanTitle}_silhouette_laser.dxf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download complete JSON package
  const handleDownloadPackageJson = () => {
    if (!generatedProduct) return;
    const blob = new Blob([JSON.stringify(generatedProduct, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedProduct.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_package.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Download full Markdown guide
  const handleDownloadFullGuide = () => {
    if (!generatedProduct) return;
    const content = `# ${generatedProduct.title}\n${generatedProduct.subtitle}\n\nSuggested Retail Price: $${generatedProduct.suggestedPrice}\nDelivery Format: ${generatedProduct.deliveryFormat}\nFile Specifications: ${generatedProduct.fileSpecs}\n\n=========================================\nMASTER GUIDE & INSTRUCTIONS\n=========================================\n${generatedProduct.fullGuideText}\n\n=========================================\nMODULES & CHAPTER BREAKDOWN\n=========================================\n${generatedProduct.modules.map(m => `--- ${m.stepOrPageNumber}. ${m.title} ---\n${m.description}\n\nActionable Content:\n${m.actionableContent}\nTemplate/Prompt Link: ${m.promptOrTemplateLink || 'N/A'}\n`).join('\n')}\n\n=========================================\nCUSTOMER DELIVERY PAGE COPY\n=========================================\n${generatedProduct.customerDeliveryPage}\n\n=========================================\nCOMMERCIAL PLR RESELL LICENSE\n=========================================\n${generatedProduct.commercialLicense}\n\n=========================================\nBONUS LEAD MAGNET\n=========================================\n${generatedProduct.bonusLeadMagnet}\n`;

    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${generatedProduct.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_master_guide.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 p-6 sm:p-8">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
            <Scissors className="w-3.5 h-3.5 text-emerald-400" />
            AI Digital Product & Cricut SVG Decal Builder • Prompt Enhancer
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            Build and export cut-ready SVG files for Cricut, decals & digital downloads.
          </h1>
          <p className="text-slate-300 text-sm">
            Generate production-grade vector cut files compatible with Cricut Design Space and Silhouette Studio. Export scalable SVG, DXF, and 300 DPI transparent PNG files with exact machine blade and cut pressure calibrations.
          </p>
        </div>

        {/* 1-Click Instant Inspiration Presets */}
        <div className="mt-6 pt-6 border-t border-slate-800/80">
          <div className="text-xs font-semibold text-slate-400 mb-2.5 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Popular High-Margin Digital Presets ($0 Inventory, Instant Download):</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {PRESET_IDEAS.map((preset, idx) => {
              const Icon = preset.icon;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setPrompt(preset.rawPrompt);
                    setProductType(preset.type);
                    if (preset.type === 'cricut_svg_decals') {
                      setActiveOutputSection('cricut');
                    }
                  }}
                  className={`p-3 rounded-xl border text-left transition-all active:scale-95 group ${
                    productType === preset.type
                      ? 'bg-indigo-950/60 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <Icon className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] font-bold text-teal-400">{preset.estimatedMargin.split(' ')[0]} Net</span>
                  </div>
                  <div className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                    {preset.label}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-2">
                    {preset.description}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Creator Input & AI Prompt Enhancer */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg shadow-slate-950/40">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-emerald-400" />
                <span>AI Digital Product Prompt Studio</span>
              </h3>
              <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                Step 1: Input Idea
              </span>
            </div>

            {/* Product Type Selector */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">Product Category / Delivery File Format:</label>
              <select
                value={productType}
                onChange={(e) => {
                  const newType = e.target.value as DigitalProductType;
                  setProductType(newType);
                  if (newType === 'cricut_svg_decals') {
                    setActiveOutputSection('cricut');
                  }
                }}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="cricut_svg_decals">✂️ Cricut SVG Decals, Vinyl Cut Paths & Stickers (Cricut Design Space Ready)</option>
                <option value="coloring_book">🎨 Coloring Sheets & Children/Adult Books</option>
                <option value="mechanics_tutorial">🔧 Mechanics Troubleshooting & Auto DIY Manual</option>
                <option value="woodworking_plans">🪚 Woodworking, Workshop & Furniture Plans</option>
                <option value="diy_hobbies">🧵 Hobbies DIY, Resin & Crafts Masterclass</option>
                <option value="digital_planner">📱 Digital Planner, Habit & Budget Tracker</option>
                <option value="educational_ebook">📚 Educational Worksheets, Math & Activity Guides</option>
                <option value="other_download">💾 Other Downloadable Templates & Digital Assets</option>
              </select>
            </div>

            {/* Prompt Input */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <label className="font-semibold text-slate-300">Raw Idea or Detailed Prompt:</label>
                <span className="text-[11px] text-slate-400">{prompt.length} chars</span>
              </div>
              <textarea
                rows={4}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g. Mountain adventure outdoor pine tree decal for car windows and hydroflasks, layered SVG cut paths for Cricut..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            {/* Target Audience & Marketplace */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Target Buyer Persona:</label>
                <input
                  type="text"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  placeholder="e.g. Cricut crafters, tumbler sellers"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-slate-300">Primary Marketplace:</label>
                <select
                  value={marketplace}
                  onChange={(e) => setMarketplace(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  <option value="etsy">Etsy (Instant Download & SVGs)</option>
                  <option value="cricut_community">Cricut Design Space & Community</option>
                  <option value="shopify">Shopify / Own DTC Craft Store</option>
                  <option value="creative_fabrica">Creative Fabrica / So Fontsy</option>
                  <option value="amazon">Amazon Handmade / KDP</option>
                  <option value="tiktok">TikTok Shop Digital Showcase</option>
                </select>
              </div>
            </div>

            {/* Automatic Trigger to User's Download Folder Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Auto-Download to Downloads Folder</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-extrabold border border-emerald-500/30">
                      {autoDownloadEnabled ? 'ACTIVE' : 'OFF'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Automatically triggers direct browser download of SVG & complete bundle to your local Downloads folder on build
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAutoDownloadEnabled(prev => !prev)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer shrink-0 ${
                  autoDownloadEnabled ? 'bg-emerald-500' : 'bg-slate-700'
                }`}
                title="Toggle automatic download directly to your Downloads folder"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 transition-transform ${
                    autoDownloadEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Action Buttons: Enhance vs Build */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={isEnhancing || !prompt.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-indigo-500/30 font-semibold text-xs transition-all disabled:opacity-50 cursor-pointer"
              >
                {isEnhancing ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Enhancing Prompt...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Enhance Prompt with AI</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleBuildProduct}
                disabled={isBuilding || !prompt.trim()}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isBuilding ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Generating & Downloading Package...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3.5 h-3.5" />
                    <span>Build & Auto-Download Product</span>
                  </>
                )}
              </button>
            </div>

            {/* Download Notification Alert Banner */}
            {downloadAlert && (
              <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between gap-3 animate-in fade-in">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="font-semibold">{downloadAlert}</span>
                </div>
                {generatedProduct && (
                  <button
                    type="button"
                    onClick={() => triggerAutoDownload(generatedProduct)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 text-[11px] font-bold shrink-0 hover:bg-emerald-400 transition-colors"
                  >
                    Download Again
                  </button>
                )}
              </div>
            )}
          </div>

          {/* AI Prompt Enhancer Card (if enhanced) */}
          {enhancedResult && (
            <div className="bg-indigo-950/30 border border-indigo-500/40 rounded-2xl p-6 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-indigo-500/20">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-indigo-200">AI Enhanced Prompt Blueprint</span>
                </div>
                <button
                  type="button"
                  onClick={handleApplyEnhancedPrompt}
                  className="px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/30 border border-indigo-500/30 text-[11px] font-semibold transition-colors flex items-center gap-1"
                >
                  <ArrowRight className="w-3 h-3" />
                  Apply to Builder
                </button>
              </div>

              {/* Strategic Insights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">🎯 Niche Opportunity:</div>
                  <div className="text-slate-200 font-medium">{enhancedResult.nicheAngle}</div>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">👤 Buyer Avatar:</div>
                  <div className="text-slate-200 font-medium">{enhancedResult.targetBuyer}</div>
                </div>
              </div>

              {/* Key Conversion Hooks */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400">High-Converting Download Hooks:</div>
                <div className="space-y-1">
                  {enhancedResult.keyHooks?.map((hook, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                      <span>{hook}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced Full Text Prompt */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-[11px]">
                  <span className="font-semibold text-slate-300">Enhanced Master Prompt:</span>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(enhancedResult.enhancedPrompt, 'enhanced_prompt')}
                    className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-medium"
                  >
                    {copiedKey === 'enhanced_prompt' ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 font-mono leading-relaxed max-h-48 overflow-y-auto">
                  {enhancedResult.enhancedPrompt}
                </div>
              </div>

              <button
                type="button"
                onClick={handleBuildProduct}
                disabled={isBuilding}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all active:scale-95"
              >
                <Wand2 className="w-4 h-4" />
                <span>Build with Enhanced Prompt</span>
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Output Package & Cricut Cut Studio */}
        <div className="lg:col-span-7 space-y-6">
          {/* Always-Visible Cricut Machine & SVG Cut Studio */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            {/* Studio Header */}
            <div className="p-5 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-emerald-500 text-slate-950">
                    CRICUT CUT READY
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    Scalable Vector .SVG + DXF + 300 DPI PNG
                  </span>
                </div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-emerald-400" />
                  <span>Cricut Machine & Decal Vector Cut Studio</span>
                </h3>
              </div>

              {/* Instant Format Download Action Buttons */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadSvg}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all active:scale-95"
                  title="Download Scalable Vector Graphics (.svg) for Cricut Design Space"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download .SVG</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadPng}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Download 300 DPI Transparent PNG for Print Then Cut stickers"
                >
                  <Printer className="w-3.5 h-3.5 text-teal-400" />
                  <span>300 DPI PNG</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadDxf}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors"
                  title="Download DXF for Silhouette Studio & CAD"
                >
                  <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                  <span>DXF</span>
                </button>
              </div>
            </div>

            {/* Template Selector Bar */}
            <div className="px-5 py-3 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between gap-3 overflow-x-auto">
              <span className="text-xs font-bold text-slate-400 whitespace-nowrap">Decal Presets:</span>
              <div className="flex items-center gap-2">
                {CRICUT_VECTOR_TEMPLATES.map((tmpl, idx) => (
                  <button
                    key={tmpl.id}
                    type="button"
                    onClick={() => setSelectedTemplateIndex(idx)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                      selectedTemplateIndex === idx
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    {tmpl.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Simulated Cricut 12" x 12" Cut Mat */}
            <div className="p-6 bg-slate-950 flex flex-col items-center">
              <div className="w-full max-w-md">
                {/* Cricut StandardGrip Mat Header */}
                <div className="bg-emerald-700 text-white rounded-t-xl px-4 py-1.5 flex items-center justify-between shadow-inner">
                  <span className="text-[10px] font-black tracking-widest uppercase">
                    CRICUT STANDARDGRIP • 12" × 12" (30.5 cm × 30.5 cm)
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="text-[9px] font-bold">READY TO CUT</span>
                  </div>
                </div>

                {/* Simulated Grid Mat Surface */}
                <div 
                  className="relative aspect-square border-2 border-emerald-700 bg-emerald-950/30 rounded-b-xl overflow-hidden p-6 flex items-center justify-center shadow-2xl"
                  style={{
                    backgroundImage: `
                      linear-gradient(to right, rgba(16, 185, 129, 0.12) 1px, transparent 1px),
                      linear-gradient(to bottom, rgba(16, 185, 129, 0.12) 1px, transparent 1px)
                    `,
                    backgroundSize: '25px 25px',
                  }}
                >
                  {/* Mat Inch Markers */}
                  <div className="absolute top-1 left-2 text-[9px] font-mono text-emerald-400/60 pointer-events-none">1"</div>
                  <div className="absolute top-1 left-1/4 text-[9px] font-mono text-emerald-400/60 pointer-events-none">3"</div>
                  <div className="absolute top-1 left-1/2 text-[9px] font-mono text-emerald-400/60 pointer-events-none">6"</div>
                  <div className="absolute top-1 left-3/4 text-[9px] font-mono text-emerald-400/60 pointer-events-none">9"</div>
                  <div className="absolute top-1 right-2 text-[9px] font-mono text-emerald-400/60 pointer-events-none">12"</div>

                  {/* Rendered SVG Design */}
                  <div 
                    className={`w-4/5 h-4/5 transition-transform duration-300 flex items-center justify-center ${
                      mirrorCut ? 'scale-x-[-1]' : ''
                    } ${
                      showCutWireframe ? 'filter drop-shadow-[0_0_8px_rgba(239,68,68,0.8)]' : 'filter drop-shadow-xl'
                    }`}
                    style={{ color: vinylColor }}
                    dangerouslySetInnerHTML={{
                      __html: showCutWireframe
                        ? activeSvgContent.replace(/fill="[^"]*"/g, 'fill="none" stroke="#ef4444" stroke-width="2.5"')
                        : activeSvgContent.replace(/fill="#0f172a"/g, `fill="${vinylColor}"`)
                    }}
                  />

                  {/* Cut Wireframe Active Notice */}
                  {showCutWireframe && (
                    <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-rose-950/90 border border-rose-500/60 text-[10px] font-extrabold text-rose-300">
                      ✂️ VECTOR CUT PATH WIREFRAME (BLADE TRAIL)
                    </div>
                  )}
                </div>
              </div>

              {/* Mat Toolbar & Vinyl Colorway Simulator */}
              <div className="w-full max-w-md mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                {/* Vinyl Color Palette */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 mr-1">Vinyl Material:</span>
                  {[
                    { name: 'Matte Black (Permanent 651)', color: '#0f172a' },
                    { name: 'Flame Orange (Oracal 651)', color: '#f97316' },
                    { name: 'Hot Rod Red (Gloss 651)', color: '#ef4444' },
                    { name: 'Blazing Yellow (Gloss 651)', color: '#f59e0b' },
                    { name: 'Pure White (Bedside Truck Decal)', color: '#ffffff' },
                    { name: 'Silver Metallic (OEM Finish)', color: '#94a3b8' },
                    { name: 'Holographic Opal Opalite', color: '#06b6d4' },
                    { name: 'Gloss Emerald Green', color: '#10b981' },
                  ].map((v) => (
                    <button
                      key={v.name}
                      type="button"
                      onClick={() => {
                        setVinylColor(v.color);
                        setVinylName(v.name);
                      }}
                      className={`w-5 h-5 rounded-full border-2 transition-transform ${
                        vinylColor === v.color ? 'scale-125 border-emerald-400 shadow-md' : 'border-slate-700 hover:scale-110'
                      }`}
                      style={{ backgroundColor: v.color }}
                      title={v.name}
                    />
                  ))}
                </div>

                {/* Cut Path Toggle & Mirror Switch */}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCutWireframe(!showCutWireframe)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                      showCutWireframe
                        ? 'bg-rose-500 text-slate-950 border-rose-400'
                        : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
                    }`}
                  >
                    {showCutWireframe ? 'View Solid Decal' : 'Inspect Cut Lines'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setMirrorCut(!mirrorCut)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-colors ${
                      mirrorCut
                        ? 'bg-amber-500 text-slate-950 border-amber-400'
                        : 'bg-slate-900 text-slate-300 hover:text-white border-slate-700'
                    }`}
                    title="Mirror required for Iron-On / HTV shirts"
                  >
                    Mirror: {mirrorCut ? 'ON (HTV)' : 'OFF (Vinyl)'}
                  </button>
                </div>
              </div>
            </div>

            {/* Cricut Machine Settings & Blade Calibration Station */}
            <div className="p-5 border-t border-slate-800 bg-slate-900/60 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Settings className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    Cricut Machine Settings & Cut Calibration
                  </span>
                </div>

                {/* Machine Tab Selector */}
                <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
                  {['Cricut Maker 3', 'Cricut Explore 3', 'Cricut Joy', 'Silhouette Cameo 4'].map((mach) => (
                    <button
                      key={mach}
                      type="button"
                      onClick={() => setSelectedMachine(mach)}
                      className={`px-2.5 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                        selectedMachine === mach
                          ? 'bg-emerald-500 text-slate-950 font-bold'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mach}
                    </button>
                  ))}
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Recommended Blade</div>
                  <div className="font-bold text-emerald-400 mt-0.5">Fine-Point Blade</div>
                  <div className="text-[10px] text-slate-400">German Carbide (45°)</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Material Setting</div>
                  <div className="font-bold text-slate-200 mt-0.5">Premium Vinyl / 651</div>
                  <div className="text-[10px] text-slate-400">Permanent Outdoor</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Cut Pressure</div>
                  <div className="font-bold text-teal-300 mt-0.5">115g (Default)</div>
                  <div className="text-[10px] text-slate-400">Clean Kiss-Cut</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Mat Requirement</div>
                  <div className="font-bold text-amber-300 mt-0.5">Green StandardGrip</div>
                  <div className="text-[10px] text-slate-400">12" × 12" Surface</div>
                </div>
              </div>

              {/* Step-by-Step Cricut Design Space Import Steps */}
              <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
                <div className="font-bold text-indigo-300 flex items-center justify-between">
                  <span>How to Cut This in Cricut Design Space (3 Simple Steps):</span>
                  <a
                    href="https://design.cricut.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                  >
                    <span>Launch Cricut Design Space</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-300">
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <strong className="text-white">1. Click Upload</strong>
                    <p className="text-slate-400 mt-0.5">Click "Upload" in Design Space, choose "Upload Image", and select this downloaded .SVG.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <strong className="text-white">2. Select Cut Image</strong>
                    <p className="text-slate-400 mt-0.5">Choose "Cut Image" (not print), then click "Add to Canvas". Scalable to any size without loss.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                    <strong className="text-white">3. Click Make It</strong>
                    <p className="text-slate-400 mt-0.5">Load vinyl on green StandardGrip mat. If cutting Iron-On (HTV), toggle Mirror ON.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Full Generated Digital Product Deliverables (if generated) */}
          {generatedProduct && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl animate-in fade-in">
              {/* Product Header Banner */}
              <div className="p-6 border-b border-slate-800 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-950">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Instant Digital Download
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Commercial PLR Rights Included
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => triggerAutoDownload(generatedProduct)}
                      className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
                      title="Send SVG and complete bundle files directly to your Downloads folder"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-950" />
                      <span>Send to Downloads Folder</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadFullGuide}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Download Markdown Guide"
                    >
                      <FileText className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Export Guide</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadPackageJson}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Download JSON Package"
                    >
                      <FileCode className="w-3.5 h-3.5 text-indigo-400" />
                      <span>JSON</span>
                    </button>
                  </div>
                </div>

                <h2 className="text-xl font-extrabold text-white mb-1.5">{generatedProduct.title}</h2>
                <p className="text-xs text-slate-300 leading-relaxed mb-4">{generatedProduct.subtitle}</p>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800/80">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Suggested Price</div>
                    <div className="text-base font-extrabold text-emerald-400">${generatedProduct.suggestedPrice.toFixed(2)}</div>
                    <div className="text-[10px] text-emerald-500">92%+ Net Profit</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Deliverables</div>
                    <div className="text-xs font-bold text-slate-200 truncate">{generatedProduct.deliveryFormat}</div>
                    <div className="text-[10px] text-slate-400">SVG + PNG + Guide</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">Cricut Ready</div>
                    <div className="text-xs font-bold text-emerald-400">Clean Vector SVG</div>
                    <div className="text-[10px] text-teal-400">Tested in Design Space</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">License</div>
                    <div className="text-xs font-bold text-amber-300">Commercial PLR</div>
                    <div className="text-[10px] text-slate-400">Cut & Sell Physical Items</div>
                  </div>
                </div>
              </div>

              {/* Sub-Tabs for Package Components */}
              <div className="flex border-b border-slate-800 bg-slate-950/80 px-4 overflow-x-auto">
                <button
                  type="button"
                  onClick={() => setActiveOutputSection('overview')}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeOutputSection === 'overview'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5 inline mr-1.5" />
                  Master Guide & Instructions
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOutputSection('modules')}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeOutputSection === 'modules'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5 inline mr-1.5" />
                  Modules & Sheets ({generatedProduct.modules?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOutputSection('prompts')}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeOutputSection === 'prompts'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 inline mr-1.5" />
                  AI Image & Vector Prompts ({generatedProduct.midjourneyPrompts?.length || 0})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOutputSection('delivery')}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeOutputSection === 'delivery'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Download className="w-3.5 h-3.5 inline mr-1.5" />
                  Customer Delivery Page
                </button>
                <button
                  type="button"
                  onClick={() => setActiveOutputSection('license')}
                  className={`px-4 py-3 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                    activeOutputSection === 'license'
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1.5" />
                  Commercial License
                </button>
              </div>

              {/* Sub-Tab Content */}
              <div className="p-6 space-y-6">
                {activeOutputSection === 'overview' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300">Complete Master Guide & Product Content:</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(generatedProduct.fullGuideText, 'full_guide')}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                      >
                        {copiedKey === 'full_guide' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'full_guide' ? 'Copied' : 'Copy Guide Text'}</span>
                      </button>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed font-sans max-h-96 overflow-y-auto">
                      {generatedProduct.fullGuideText}
                    </div>

                    {/* Bonus Lead Magnet Included */}
                    {generatedProduct.bonusLeadMagnet && (
                      <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                        <Zap className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-amber-200">Included Bonus Lead Magnet / Checklist:</div>
                          <p className="text-xs text-slate-300 mt-1">{generatedProduct.bonusLeadMagnet}</p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeOutputSection === 'modules' && (
                  <div className="space-y-4">
                    <div className="text-xs font-semibold text-slate-400">
                      Step-by-step breakdown of pages, chapters, or sheets included in this package:
                    </div>
                    <div className="space-y-3">
                      {generatedProduct.modules?.map((m) => (
                        <div key={m.stepOrPageNumber} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold">
                              Module / Layer #{m.stepOrPageNumber}
                            </span>
                            <span className="text-xs font-bold text-slate-200">{m.title}</span>
                          </div>
                          <p className="text-xs text-slate-300">{m.description}</p>
                          <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed">
                            <strong className="text-emerald-400">Actionable Content / Specs:</strong> {m.actionableContent}
                          </div>
                          {m.promptOrTemplateLink && (
                            <div className="flex items-center justify-between text-[11px] pt-1">
                              <span className="text-slate-400 font-mono truncate max-w-sm">
                                {m.promptOrTemplateLink}
                              </span>
                              <button
                                type="button"
                                onClick={() => copyToClipboard(m.promptOrTemplateLink || '', `mod_${m.stepOrPageNumber}`)}
                                className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold flex-shrink-0 ml-2"
                              >
                                {copiedKey === `mod_${m.stepOrPageNumber}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                <span>{copiedKey === `mod_${m.stepOrPageNumber}` ? 'Copied' : 'Copy'}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeOutputSection === 'prompts' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-semibold text-slate-400">
                        Copy-paste Midjourney / AI art generation prompts for artwork, covers & illustrations:
                      </span>
                    </div>
                    <div className="space-y-2.5">
                      {generatedProduct.midjourneyPrompts?.map((mjPrompt, idx) => (
                        <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between gap-3">
                          <code className="text-xs font-mono text-emerald-300 overflow-x-auto flex-1">
                            {mjPrompt}
                          </code>
                          <button
                            type="button"
                            onClick={() => copyToClipboard(mjPrompt, `mj_${idx}`)}
                            className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors flex-shrink-0"
                          >
                            {copiedKey === `mj_${idx}` ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedKey === `mj_${idx}` ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeOutputSection === 'delivery' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300">Customer Post-Purchase Download Page Copy:</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(generatedProduct.customerDeliveryPage, 'delivery_page')}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                      >
                        {copiedKey === 'delivery_page' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'delivery_page' ? 'Copied' : 'Copy Delivery Page'}</span>
                      </button>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                      {generatedProduct.customerDeliveryPage}
                    </div>
                  </div>
                )}

                {activeOutputSection === 'license' && (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-300">Official Commercial PLR Resell License Agreement:</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(generatedProduct.commercialLicense, 'license_text')}
                        className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                      >
                        {copiedKey === 'license_text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'license_text' ? 'Copied' : 'Copy License'}</span>
                      </button>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
                      {generatedProduct.commercialLicense}
                    </div>
                  </div>
                )}

                {/* Bottom CTA to Open in Listing Studio */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="text-xs text-slate-400">
                    Ready to publish this digital package to Etsy, Shopify or Amazon?
                  </div>
                  {onOpenListingStudio && (
                    <button
                      type="button"
                      onClick={() => onOpenListingStudio(generatedProduct.title, 'Digital Products & Instant Downloads')}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-500 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
                    >
                      <span>Create Listing & TikTok Script for This Product</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
