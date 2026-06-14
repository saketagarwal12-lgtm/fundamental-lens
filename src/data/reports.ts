import type { Grade } from './types';
import type { HealthScorePoint, ScorecardPillar, FinancialSection } from './krazybee';
import {
  healthScoreSeries as kbHealth,
  scorecard as kbScorecard,
  financials as kbFinancials,
  qualitativeMetrics as kbQual,
  ownershipData as kbOwnership,
  borrowerMix as kbBorrowerMix,
  ncdIssuances as kbNcd,
  materialDevelopments as kbDev,
  externalRatings as kbExternal,
  sectorOutlook as kbSector,
  aiQAPairs as kbAi,
} from './krazybee';

// ── New interfaces for the extended report ──────────────────────────────────

export interface RatingScaleRow {
  dimension: string;
  actual: string;
  pct: number;
  ratingNumber: number;
  ratingLabel?: string;
}

export interface QualFactor {
  factor: string;
  pillar: string;
  grade: Grade;
  pct: number;
  commentary: string;
  quarterly?: string;
  outlook?: string;
}

export interface OwnershipSlice { name: string; pct: number; }
export interface ProductMixSlice { name: string; pct: number; aum: number; }

export interface IssuanceStructure {
  isin: string;
  instrument: string;
  ranking: string;
  coupon: number;
  couponFrequency: string;
  originalYtm: number;
  currentYtm: number;
  faceValue: number;
  faceValueLabel: string;
  issueSize: number;
  allotmentDate: string;
  maturity: string;
  residualDays: number;
  securityCover: string;
  stepClause: string;
  redemptionTrigger: string;
  current: boolean;
}

export interface NcdRow {
  isin: string; coupon: number; ytm: number; tenor: string; size: number; maturity: string; current: boolean;
}

export interface Covenant {
  covenant: string;
  value: string;
  commentary: string;
  grade: Grade;
}

export interface PeerRow {
  issuer: string; rating: string; aum: string; isin: string; redemption: string; ytm: number; tenor: string;
}

export interface YieldOverview {
  currentYtm: number;
  gsecBase: number;
  creditRiskPremium: number;
  rangeLow: number;
  rangeHigh: number;
}

export interface FundingMixSlice { name: string; pct: number; }
export interface AlmView {
  assetTenorMonths: number;
  liabilityTenorMonths: number;
  cumulativeGapNote: string;
  lcr: number;
  ccePctOf12mRepayments?: number;
  topLenderConcentration?: string;
}
export interface GeoSlice { region: string; pct: number; }

export interface ManagementInfo {
  leadership: { name: string; role: string; background: string }[];
  boardComposition: string;
  auditor: string;
  auditorFlag?: string;
  riskFlags: string[];
}

export interface RatingHistoryNote { date: string; note: string; }

export interface ExternalRatingDetail {
  agency: string; rating: string; outlook: string; date: string; rationale: string;
}

export interface LtvBucket { bucket: string; pct: number; }
export interface SegmentAssetQuality { segment: string; gnpa: number; nnpa: number; }
export interface CollectionEffPoint { period: string; value: number; }

export interface Listing {
  listed: boolean;
  exchanges?: string;   // 'NSE / BSE'
  ticker?: string;      // 'SPANDANA'
  note?: string;        // shown when not listed
}
// Monthly illustrative mock share price (₹), aligned to the 12-month trend months.
export interface PricePoint { month: string; price: number; }

// ── Real-time data layer (mock connectors + signals) ─────────────────────────
export interface DataSource {
  label: string;
  cadence: string;        // 'Quarterly' | 'Real-time' | 'Monthly' | 'Partner feed'
  lastUpdated: string;    // 'as of 3Q FY26', "12 Jun 2026", …
  status: 'Connected' | 'Mock';
}
export type SignalType =
  | 'Debt raised' | 'Default / delay' | 'Auditor change' | 'Management change'
  | 'Shareholding change' | 'Litigation' | 'Regulatory penalty' | 'News';
export interface Signal {
  date: string;
  type: SignalType;
  source: string;
  impact: 'up' | 'down' | 'neutral';
  text: string;
}

export interface CompanyReport {
  id: string;
  subSectorKey: 'unsecured-pl' | 'mfi' | 'gold';
  healthScoreSeries: HealthScorePoint[];
  scorecard: ScorecardPillar[];
  ratingScale: RatingScaleRow[];
  financials: Record<string, FinancialSection>;
  qualitative: QualFactor[];
  ownership: OwnershipSlice[];
  ownershipNote: string;
  productMix: ProductMixSlice[];
  ncdIssuances: NcdRow[];
  issuanceStructures: IssuanceStructure[];
  covenants: Covenant[];
  peers: PeerRow[];
  yieldOverview: YieldOverview;
  fundingMix: FundingMixSlice[];
  alm: AlmView;
  geography: GeoSlice[];
  management: ManagementInfo;
  externalRating: ExternalRatingDetail;
  ratingHistory: RatingHistoryNote[];
  materialDevelopments: { date: string; title: string; body: string }[];
  sectorOutlook: { operating: string; subSector: string };
  recommendationRationale: string[];
  investorProtection: string[];
  aiQAPairs: { q: string; a: string }[];
  ltvBuckets?: LtvBucket[];
  segmentAssetQuality?: SegmentAssetQuality[];
  collectionEfficiency?: CollectionEffPoint[];
  listing?: Listing;
  priceSeries?: PricePoint[];   // illustrative mock — wire a real feed at go-live
  dataSources?: DataSource[];
  signals?: Signal[];
}

// ── Shared sector-outlook prose ──────────────────────────────────────────────

const NBFC_OPERATING = `The Indian NBFC sector continues to demonstrate resilience, supported by robust credit demand across retail, MSME, and infrastructure segments. The RBI's phased implementation of scale-based regulation (SBR) has improved governance standards, particularly in the middle and upper layer. Credit growth in FY26 is expected to moderate compared to the FY24–25 surge, as NBFCs recalibrate growth vis-à-vis capital requirements. Funding conditions remain broadly supportive, with capital markets accessible to investment-grade issuers and bank lending rates stabilising.`;

const MFI_SUBSECTOR = `The microfinance (NBFC-MFI) sub-segment passed through a stress cycle in FY25 as borrower over-leverage, the MFIN guardrails, and localised political/collection disruptions pushed sector GNPA and credit costs higher. Into FY26, asset quality is stabilising: collection efficiencies are recovering, fresh disbursals underwritten under tighter norms are performing, and the run-down of stressed vintages is improving headline ratios. RBI's revised MFI framework (income-based limits, no collateral, ≤2 lender cap) underpins discipline. Growth is expected to resume at a measured pace, with capital and liquidity buffers being the key differentiators across issuers.`;

const GOLD_SUBSECTOR = `The gold-loan sub-segment benefits from a structural tailwind: elevated gold prices lift sanctionable amounts and keep effective LTVs conservative, while the secured, short-tenor nature of the book limits loss-given-default. Competition is intense from large specialised gold NBFCs and banks, compressing yields at the top end. RBI's LTV cap (≤75%) and periodic conduct scrutiny (auction transparency, valuation norms) shape the operating environment. For smaller, fast-scaling lenders, geographic concentration and funding access remain the principal constraints, even as gold-segment asset quality stays exceptionally clean.`;

// ── Helper to assemble a FinancialSection ────────────────────────────────────

const mk = (
  grade: Grade,
  pct: number,
  metrics: { label: string; unit: string; vals: (number | null)[] }[],
  periods: string[],
  commentary: string,
  quarterly?: string,
  outlook?: string,
): FinancialSection => ({
  grade,
  pct,
  commentary,
  quarterly,
  outlook,
  metrics: metrics.map(m => ({
    label: m.label,
    unit: m.unit,
    values: m.vals.map((value, i) => ({ period: periods[i], value })),
  })),
});

// ── KrazyBee report (built from existing krazybee.ts exports) ─────────────────

const krazybee: CompanyReport = {
  id: 'krazybee',
  subSectorKey: 'unsecured-pl',
  healthScoreSeries: kbHealth,
  scorecard: kbScorecard,
  ratingScale: [
    { dimension: 'Issuer', actual: '1.34/2.00', pct: 67, ratingNumber: 6, ratingLabel: 'A' },
    { dimension: 'Issuance', actual: '0.70/1.00', pct: 70, ratingNumber: 6 },
    { dimension: 'Pricing', actual: '0.95/1.50', pct: 63, ratingNumber: 7 },
    { dimension: 'Economic & Sector', actual: '0.28/0.50', pct: 56, ratingNumber: 8 },
    { dimension: 'Combined', actual: '3.27/5.00', pct: 65, ratingNumber: 7, ratingLabel: 'A' },
  ],
  financials: kbFinancials,
  qualitative: kbQual.map(q => ({
    factor: q.factor, pillar: q.pillar, grade: q.grade, pct: q.pct, commentary: q.commentary,
    quarterly: (q as { quarterly?: string }).quarterly, outlook: (q as { outlook?: string }).outlook,
  })),
  ownership: kbOwnership,
  ownershipNote: 'No promoter holding; institutionally held by marquee PE/VC investors. Board and institutional quality is the key risk mitigant.',
  productMix: kbBorrowerMix.map(b => ({ name: b.name, pct: b.pct, aum: b.aum })),
  ncdIssuances: kbNcd,
  issuanceStructures: [
    {
      isin: 'INE07HK07817', instrument: 'Secured, Rated, Listed, Redeemable NCD', ranking: 'Senior secured',
      coupon: 10.40, couponFrequency: 'Quarterly', originalYtm: 10.40, currentYtm: 10.27,
      faceValue: 1000, faceValueLabel: '₹1,000', issueSize: 450, allotmentDate: '26 Apr 2024',
      maturity: '25 Jan 2027', residualDays: 270, securityCover: '1.05x',
      stepClause: 'Coupon steps up 0.25% per notch on downgrade below A-', redemptionTrigger: 'None', current: true,
    },
    {
      isin: 'INE07HK07825', instrument: 'Secured, Rated, Listed, Redeemable NCD', ranking: 'Senior secured',
      coupon: 10.40, couponFrequency: 'Quarterly', originalYtm: 10.40, currentYtm: 10.69,
      faceValue: 1000, faceValueLabel: '₹1,000', issueSize: 475, allotmentDate: '12 Aug 2024',
      maturity: '12 Aug 2027', residualDays: 460, securityCover: '1.05x',
      stepClause: 'Coupon steps up 0.25% per notch on downgrade below A-', redemptionTrigger: 'None', current: false,
    },
  ],
  covenants: [
    { covenant: 'Total CAR', value: '23.55% (min 15%)', commentary: 'Comfortably above regulatory and covenant floors', grade: 'Strong' },
    { covenant: 'GNPA cap', value: '1.53% (cap 6%)', commentary: 'Well within the covenant ceiling', grade: 'Extremely Strong' },
    { covenant: 'Asset-liability mismatch', value: 'No cumulative shortfall <1yr', commentary: 'Compliant', grade: 'Strong' },
    { covenant: 'Security cover', value: '1.05x', commentary: 'Maintained per terms', grade: 'Moderate' },
  ],
  peers: [
    { issuer: 'Fibe (EarlySalary)', rating: 'A', aum: '₹6,500 Cr', isin: 'INE0DLQ07AB1', redemption: '2027', ytm: 10.55, tenor: '10–12m' },
    { issuer: 'Moneyview', rating: 'A-', aum: '₹9,200 Cr', isin: 'INE0LFR07CD2', redemption: '2027', ytm: 11.10, tenor: '12m' },
    { issuer: 'KrazyBee (peer issue)', rating: 'A', aum: '₹9,861 Cr', isin: 'INE07HK07825', redemption: '2027', ytm: 10.69, tenor: '10–12m' },
    { issuer: 'Aye Finance', rating: 'A-', aum: '₹5,000 Cr', isin: 'INE501X07EF3', redemption: '2027', ytm: 11.35, tenor: '12m' },
  ],
  yieldOverview: { currentYtm: 10.27, gsecBase: 6.50, creditRiskPremium: 3.77, rangeLow: 9.8, rangeHigh: 10.9 },
  fundingMix: [
    { name: 'NCDs', pct: 48 }, { name: 'Term Loans', pct: 34 }, { name: 'Securitization', pct: 10 },
    { name: 'Commercial Paper', pct: 5 }, { name: 'WCDL', pct: 3 },
  ],
  alm: {
    assetTenorMonths: 14, liabilityTenorMonths: 16, cumulativeGapNote: 'No cumulative ALM shortfall up to one year',
    lcr: 135.5, ccePctOf12mRepayments: 13, topLenderConcentration: 'Top-10 lenders ~19.6% (low)',
  },
  geography: [
    { region: 'South India', pct: 55 }, { region: 'North India', pct: 18 },
    { region: 'West India', pct: 15 }, { region: 'East India', pct: 12 },
  ],
  management: {
    leadership: [
      { name: 'Madhusudan Ekambaram', role: 'MD & CEO', background: 'Co-founder; 10+ yrs fintech & banking' },
      { name: 'Krishnaswamy Karthikeyan', role: 'Director', background: 'Co-founder; technology & product' },
    ],
    boardComposition: '11-member board with independent and nominee directors',
    auditor: 'Replaced after Tattavam & Co. resignation (Aug 2025)',
    riskFlags: ['Statutory auditor resigned Aug 2025', 'Notably high MD remuneration vs peers'],
  },
  externalRating: {
    agency: kbExternal[0].agency, rating: kbExternal[0].rating, outlook: kbExternal[0].outlook,
    date: kbExternal[0].date, rationale: kbExternal[0].rationale,
  },
  ratingHistory: [{ date: 'Mar 2026', note: 'CARE affirmed A (Stable)' }],
  materialDevelopments: kbDev,
  sectorOutlook: kbSector,
  recommendationRationale: [
    'Asset quality improving sharply — GNPA down to 1.53%',
    'Strong institutional ownership and unicorn-round capital',
    'Healthy profitability (3Q26 ROAA 6.38%)',
    'Adequate but narrowing capital buffers as AUM grows',
  ],
  investorProtection: [
    'Secured NCDs with 1.05x security cover',
    'Listed instrument with transparent covenant framework',
    'No cumulative ALM shortfall within one year',
    'Strong investor base reduces refinancing risk',
  ],
  aiQAPairs: kbAi,
};

// ── Avanti Finance (MFI) ──────────────────────────────────────────────────────

const AVANTI_PERIODS = ['FY24', 'FY25', '3Q26'];
const avanti: CompanyReport = {
  id: 'avanti',
  subSectorKey: 'mfi',
  healthScoreSeries: [
    { month: "Jun'25", score: 64 },
    { month: "Jul'25", score: 64 },
    { month: "Aug'25", score: 63 },
    { month: "Sep'25", score: 60, event: { direction: 'down', reason: 'Crisil downgraded the rating to BBB from BBB+ on asset-quality and earnings pressure.' } },
    { month: "Oct'25", score: 60 },
    { month: "Nov'25", score: 60 },
    { month: "Dec'25", score: 58, event: { direction: 'down', reason: 'Breached certain lender covenants (waiver obtained); a rating-downgrade covenant breach flagged refinancing risk.' } },
    { month: "Jan'26", score: 59 },
    { month: "Feb'26", score: 60 },
    { month: "Mar'26", score: 61 },
    { month: "Apr'26", score: 62, event: { direction: 'up', reason: '₹75 cr promoter capital infusion lifted Total CAR to ~31% and cut leverage to 1.86x; GNPA improved to 1.39%.' } },
    { month: "May'26", score: 61 },
  ],
  scorecard: [
    { name: 'Business & Management', grade: 'Weak', pct: 40, factors: [
      { name: 'Business Model', grade: 'Extremely Weak', pct: 20 },
      { name: 'Business Position', grade: 'Weak', pct: 40 },
      { name: 'Borrower Profile', grade: 'Extremely Weak', pct: 20 },
      { name: 'Management & Governance', grade: 'Moderate', pct: 60 },
      { name: 'Ownership', grade: 'Strong', pct: 80 },
    ]},
    { name: 'Financial Analysis', grade: 'Moderate', pct: 54, factors: [
      { name: 'Capitalization', grade: 'Moderate', pct: 61 },
      { name: 'Funding', grade: 'Moderate', pct: 56 },
      { name: 'Liquidity', grade: 'Moderate', pct: 65 },
      { name: 'Profitability', grade: 'Weak', pct: 36 },
      { name: 'Asset Quality', grade: 'Moderate', pct: 56 },
    ]},
    { name: 'Issuance Assessment', grade: 'Strong', pct: 72, factors: [
      { name: 'Product Offering', grade: 'Strong', pct: 80 },
      { name: 'Market Liquidity', grade: 'Weak', pct: 40 },
      { name: 'Financial Covenants', grade: 'Extremely Strong', pct: 100 },
      { name: 'Collateral', grade: 'Moderate', pct: 60 },
      { name: 'Peer Comparison', grade: 'Weak', pct: 40 },
    ]},
    { name: 'Pricing', grade: 'Strong', pct: 70, factors: [
      { name: 'Benchmark Credit Risk Premium', grade: 'Strong', pct: 80 },
      { name: 'Internal Assessment', grade: 'Extremely Strong', pct: 100 },
      { name: 'Forward-Looking Approach', grade: 'Extremely Strong', pct: 100 },
      { name: 'Comparable Peers', grade: 'Weak', pct: 40 },
      { name: 'Recent Issuances', grade: 'Moderate', pct: 60 },
    ]},
    { name: 'Economic & Sector Outlook', grade: 'Moderate', pct: 56, factors: [
      { name: 'Economic Outlook', grade: 'Moderate', pct: 60 },
      { name: 'Monetary Policy Outlook', grade: 'Moderate', pct: 60 },
      { name: 'Operating Sector Outlook', grade: 'Moderate', pct: 60 },
      { name: 'Sub-operating Sector Outlook', grade: 'Weak', pct: 40 },
    ]},
  ],
  ratingScale: [
    { dimension: 'Issuer', actual: '1.02/2.00', pct: 51, ratingNumber: 9, ratingLabel: 'BBB' },
    { dimension: 'Issuance', actual: '0.72/1.00', pct: 72, ratingNumber: 6 },
    { dimension: 'Pricing', actual: '1.05/1.50', pct: 70, ratingNumber: 6 },
    { dimension: 'Economic & Sector', actual: '0.28/0.50', pct: 56, ratingNumber: 8 },
    { dimension: 'Combined', actual: '3.07/5.00', pct: 61, ratingNumber: 7, ratingLabel: 'BBB' },
  ],
  financials: {
    capitalization: mk('Moderate', 61, [
      { label: 'Net Worth', unit: '₹ Cr', vals: [260, 310, 292] },
      { label: 'Leverage', unit: 'x', vals: [3.78, 2.71, 1.86] },
      { label: 'Total CAR', unit: '%', vals: [20.15, 26.72, 31.05] },
      { label: 'Tier I CAR', unit: '%', vals: [19.50, 26.00, 30.50] },
      { label: 'ROAE', unit: '%', vals: [-5.03, -42.50, -38.70] },
    ], AVANTI_PERIODS,
      `Capitalisation has strengthened materially after the April 2026 promoter (NRJN Trust) infusion of ₹75 cr, lifting Total CAR to 31.05% and cutting leverage to 1.86x. The franchise had been capital-light through a loss-making phase, so the infusion is central to the credit story. Internal capital generation remains negative given sustained losses, leaving the issuer dependent on promoter and DFI support to fund growth. Capital adequacy is now comfortable, but the quality of capital generation — not its level — is the watch item.`),
    fundingLiquidity: mk('Moderate', 56, [
      { label: 'Cash & Equivalents', unit: '₹ Cr', vals: [243, 255, 128] },
      { label: 'CCE / Total Assets', unit: '%', vals: [18.0, 20.0, 15.0] },
      { label: 'Liquidity Coverage Ratio', unit: '%', vals: [null, null, 225.66] },
      { label: 'Total Funding', unit: '₹ Cr', vals: [null, null, 631] },
    ], AVANTI_PERIODS,
      `Total funding of ₹631 cr (Sep'25) is split term loans 55% / NCDs 45%. Top-10 lender concentration is moderate at 50.5% of borrowings — a structural vulnerability for a small issuer. Liquidity is adequate: LCR of 225.66%, CCE around 15% of assets, asset tenor of 13 months against liability tenor of 10 months, and no cumulative ALM shortfall up to one year. The principal funding risk is the December 2025 covenant episode, which underlined sensitivity to rating actions, though waivers were obtained.`),
    profitability: mk('Weak', 36, [
      { label: 'NIM', unit: '%', vals: [17.34, 16.86, 9.81] },
      { label: 'ROAA', unit: '%', vals: [-1.30, -9.99, -11.65] },
      { label: 'ROAE', unit: '%', vals: [-5.03, -42.50, -38.70] },
      { label: 'Cost-to-Income', unit: '%', vals: [90.46, 86.60, 117.40] },
      { label: 'Cost of Risk', unit: '%', vals: [4.75, 19.32, 10.03] },
      { label: 'PAT', unit: '₹ Cr', vals: [-13.18, -121.22, -25.76] },
    ], AVANTI_PERIODS,
      `Profitability is the weakest pillar. The franchise has posted sustained losses, with FY25 PAT of -₹121 cr as cost of risk spiked to 19.32% during the MFI stress cycle. NIM has compressed to 9.81% and the cost-to-income ratio exceeds 100%, reflecting a sub-scale cost base. 3Q26 losses narrowed but the issuer is some distance from break-even; a return to profitability hinges on credit costs normalising and operating leverage from AUM recovery.`),
    assetQuality: mk('Moderate', 56, [
      { label: 'On-book AUM', unit: '₹ Cr', vals: [976, 855, 554] },
      { label: 'GNPA', unit: '%', vals: [2.78, 4.39, 1.39] },
      { label: 'NNPA', unit: '%', vals: [1.33, 1.27, 0.53] },
    ], AVANTI_PERIODS,
      `Asset quality deteriorated through FY25 (GNPA 4.39%) as the microfinance cycle turned, but has since improved sharply to 1.39% by 3Q26 following write-offs and tighter underwriting. AUM contracted to ₹554 cr as the issuer de-risked. The book is ~97% unsecured microfinance to income-vulnerable rural women borrowers, so headline improvement must be read against the structural fragility of the segment.`),
  },
  qualitative: [
    { factor: 'Business Model', pillar: 'Business & Management', grade: 'Extremely Weak', pct: 20,
      commentary: `Avanti runs a technology-led, channel-partner microfinance model: 89 channel partners originate and service loans across 27 states, 350 districts and 23,000 villages, reaching ~1.1 million households. Co-lending and off-book arrangements account for 34% of AUM, which lightens the balance sheet but introduces partner-dependency and counterparty risk. The model is still proving its unit economics through a full cycle, having absorbed heavy credit costs in FY25. Scale and cost efficiency remain the open questions.` },
    { factor: 'Business Position', pillar: 'Business & Management', grade: 'Weak', pct: 40,
      commentary: `Avanti is a mid-tier MFI whose reach is meaningful in breadth but thin in depth, given its partner-led distribution. It lacks the franchise density and pricing power of the large listed MFIs. Its position is reinforced by the backing of high-profile founders, but competitively it is a price-taker in a crowded, cyclical segment.` },
    { factor: 'Borrower Profile', pillar: 'Business & Management', grade: 'Extremely Weak', pct: 20,
      commentary: `The borrower base is 87% women, with 60% exposure to agriculture and allied activities and an average ticket of ~₹43,000. The mix spans new-to-credit (24%), repeat (37%) and first-time-with-company (39%) borrowers. This is a fundamentally income-vulnerable, rural cohort highly sensitive to monsoon, inflation and localised disruption — the core reason the segment scores Extremely Weak.` },
    { factor: 'Management & Governance', pillar: 'Business & Management', grade: 'Moderate', pct: 60,
      commentary: `CEO Rahul Gupta (since July 2022) brings ex-GE Money lending experience. The 8-member board includes Nandan Nilekani and Dr Vijay Kelkar, lending considerable governance credibility. The statutory auditor is Varma & Varma (non-Big6). Governance is a relative strength versus peers, anchored by the calibre of the board and backers.` },
    { factor: 'Ownership', pillar: 'Business & Management', grade: 'Strong', pct: 80,
      commentary: `Avanti is founder-backed with a no-promoter-control style: Nandan Nilekani / NRJN Trust hold ~43%, alongside the Gates Foundation, Oikocredit, Rabo Partnerships and the legal heirs of the late Ratan Tata. This high-quality, mission-aligned investor base is the single most important credit support, and NRJN Trust backing is centrally factored into the external rating.` },
  ],
  ownership: [
    { name: 'Nandan Nilekani / NRJN Trust', pct: 43.2 },
    { name: 'Gates Foundation', pct: 15.5 },
    { name: 'Oikocredit', pct: 13.1 },
    { name: 'Rabo Partnerships', pct: 10.7 },
    { name: 'IDH Farmfit', pct: 5.2 },
    { name: 'Ratan Tata (legal heirs)', pct: 3.6 },
    { name: 'Waao Partners', pct: 3.2 },
    { name: 'MI India Capital', pct: 3.0 },
    { name: 'Others', pct: 2.5 },
  ],
  ownershipNote: 'Founder-backed (Nilekani / Kelkar / late Ratan Tata); no-promoter-control style. NRJN Trust support is centrally factored into the external rating.',
  productMix: [
    { name: 'Unsecured Microfinance', pct: 97, aum: 538 },
    { name: 'Secured / Other', pct: 3, aum: 16 },
  ],
  ncdIssuances: [
    { isin: 'INE0BNQ07154', coupon: 11.15, ytm: 13.75, tenor: '~13m', size: 25, maturity: '30 Jun 2027', current: true },
    { isin: 'INE0BNQ07105', coupon: 11.00, ytm: 11.46, tenor: '~12m', size: 50, maturity: '27 Jun 2026', current: false },
    { isin: 'INE0BNQ07113', coupon: 12.25, ytm: 12.25, tenor: '~12m', size: 25, maturity: '30 Sep 2026', current: false },
    { isin: 'INE0BNQ07121', coupon: 11.50, ytm: 11.56, tenor: '~12m', size: 50, maturity: '27 Dec 2026', current: false },
  ],
  issuanceStructures: [
    {
      isin: 'INE0BNQ07154', instrument: 'Secured, Rated, Listed, Redeemable NCD', ranking: 'Senior secured',
      coupon: 11.15, couponFrequency: 'Monthly', originalYtm: 11.15, currentYtm: 13.75,
      faceValue: 100000, faceValueLabel: '₹1,00,000', issueSize: 25, allotmentDate: '20 May 2026',
      maturity: '30 Jun 2027', residualDays: 406, securityCover: '1.10x',
      stepClause: 'Coupon steps up on rating downgrade per terms',
      redemptionTrigger: 'Rating-downgrade covenant breach can trigger mandatory redemption', current: true,
    },
    {
      isin: 'INE0BNQ07121', instrument: 'Secured, Rated, Listed, Redeemable NCD', ranking: 'Senior secured',
      coupon: 11.50, couponFrequency: 'Monthly', originalYtm: 11.50, currentYtm: 11.56,
      faceValue: 100000, faceValueLabel: '₹1,00,000', issueSize: 50, allotmentDate: '27 Dec 2024',
      maturity: '27 Dec 2026', residualDays: 200, securityCover: '1.10x',
      stepClause: 'Coupon steps up on rating downgrade per terms', redemptionTrigger: 'None', current: false,
    },
  ],
  covenants: [
    { covenant: 'Nandan Nilekani holding', value: '≥26% & on board', commentary: 'Maintained; central to rating', grade: 'Extremely Strong' },
    { covenant: 'Capital adequacy', value: 'CAR 31.05% (>17% required)', commentary: 'Comfortable post infusion', grade: 'Strong' },
    { covenant: 'ALM mismatch', value: 'No cumulative mismatch', commentary: 'Compliant', grade: 'Strong' },
    { covenant: 'GNPA cap', value: '1.39% (within cap)', commentary: 'Improved sharply', grade: 'Strong' },
  ],
  peers: [
    { issuer: 'CreditAccess Gramin', rating: 'AA-', aum: '₹26,000 Cr', isin: 'INE741K07AA1', redemption: '2027', ytm: 9.40, tenor: '24m' },
    { issuer: 'Asirvad Micro Finance', rating: 'AA-', aum: '₹12,000 Cr', isin: 'INE516Q07BB2', redemption: '2027', ytm: 9.85, tenor: '18m' },
    { issuer: 'Sarvagram', rating: 'BBB+', aum: '₹2,500 Cr', isin: 'INE0J5L07CC3', redemption: '2027', ytm: 12.90, tenor: '15m' },
    { issuer: 'Dvara KGFS', rating: 'BBB+', aum: '₹2,000 Cr', isin: 'INE516X07DD4', redemption: '2026', ytm: 13.10, tenor: '12m' },
    { issuer: 'Midland Microfin', rating: 'A-', aum: '₹3,000 Cr', isin: 'INE0FS807EE5', redemption: '2027', ytm: 12.20, tenor: '18m' },
    { issuer: 'Samunnati', rating: 'BBB', aum: '₹1,500 Cr', isin: 'INE9B1007FF6', redemption: '2026', ytm: 13.80, tenor: '12m' },
  ],
  yieldOverview: { currentYtm: 13.75, gsecBase: 5.76, creditRiskPremium: 8.00, rangeLow: 13.0, rangeHigh: 14.2 },
  fundingMix: [{ name: 'Term Loans', pct: 55 }, { name: 'NCDs', pct: 45 }],
  alm: {
    assetTenorMonths: 13, liabilityTenorMonths: 10, cumulativeGapNote: 'No cumulative ALM shortfall up to one year',
    lcr: 225.66, ccePctOf12mRepayments: 15, topLenderConcentration: 'Top-10 lenders 50.5% (moderate)',
  },
  geography: [
    { region: 'South', pct: 30 }, { region: 'West', pct: 25 }, { region: 'East', pct: 25 }, { region: 'North', pct: 20 },
  ],
  management: {
    leadership: [
      { name: 'Rahul Gupta', role: 'CEO', background: 'Since Jul 2022; ex-GE Money' },
      { name: 'Nandan Nilekani', role: 'Director / Backer', background: 'Infosys co-founder; NRJN Trust' },
      { name: 'Dr Vijay Kelkar', role: 'Director', background: 'Former Finance Secretary' },
    ],
    boardComposition: '8-member board (2 independent, 3 nominee)',
    auditor: 'Varma & Varma', auditorFlag: 'Non-Big6',
    riskFlags: ['Sustained losses; subdued earnings', 'Partner-dependent distribution', 'Dec 2025 covenant breach (waiver obtained)'],
  },
  externalRating: {
    agency: 'Crisil', rating: 'BBB (Stable)', outlook: 'Stable', date: 'Dec 2025',
    rationale: 'Centrally factors NRJN Trust (Nilekani) support and adequate capitalisation post infusion; constrained by weak asset-quality history and subdued earnings. Downgraded from BBB+ in Sep 2025.',
  },
  ratingHistory: [
    { date: 'Sep 2025', note: 'Crisil downgraded BBB+ → BBB' },
    { date: 'Dec 2025', note: 'Affirmed BBB (Stable)' },
  ],
  materialDevelopments: [
    { date: 'Apr 2026', title: '₹75 cr promoter capital infusion', body: 'NRJN Trust infused ₹75 cr, lifting Total CAR to ~31% and cutting leverage to 1.86x.' },
    { date: 'Dec 2025', title: 'Lender covenant breach — waiver obtained', body: 'Breached certain lender covenants following the rating downgrade; waivers obtained but the episode flagged refinancing sensitivity.' },
    { date: 'Sep 2025', title: 'Crisil downgrade to BBB', body: 'Rating cut from BBB+ to BBB on asset-quality and earnings pressure.' },
  ],
  sectorOutlook: { operating: NBFC_OPERATING, subSector: MFI_SUBSECTOR },
  recommendationRationale: [
    'Promoter (Nilekani / NRJN Trust) capital support is central and proven',
    'Strong covenant package incl. ≥26% promoter holding',
    'Capital adequacy comfortable at 31% post infusion',
    'Offsetting: weak earnings track record and partner-dependent model',
  ],
  investorProtection: [
    'Secured NCD with 1.10x security cover',
    'Strong financial-covenant package with promoter-holding floor',
    'LCR 225.66% and no cumulative ALM shortfall',
    'Rating-downgrade trigger provides investor protection',
  ],
  collectionEfficiency: [
    { period: '1Q26', value: 96 }, { period: '2Q26', value: 97 }, { period: '3Q26', value: 98 },
  ],
  aiQAPairs: [
    { q: 'Why was Avanti downgraded?', a: 'Crisil downgraded Avanti from BBB+ to BBB in September 2025 on the back of asset-quality deterioration (FY25 GNPA reached 4.39%) and sustained losses (FY25 PAT of -₹121 cr) during the broader microfinance stress cycle. The rating was affirmed at BBB (Stable) in December 2025 after the picture stabilised.' },
    { q: 'What is the promoter support?', a: 'Avanti is backed by Nandan Nilekani / NRJN Trust (~43%), the Gates Foundation, Oikocredit and the late Ratan Tata’s heirs. NRJN Trust support is centrally factored into the rating, and a ₹75 cr infusion in April 2026 lifted Total CAR to ~31% and cut leverage to 1.86x. A covenant requires Nilekani to hold ≥26% and remain on the board.' },
    { q: 'How strong is liquidity?', a: 'Liquidity is adequate-to-good: LCR of 225.66%, cash around 15% of assets, asset tenor of 13 months versus liability tenor of 10 months, and no cumulative ALM shortfall up to one year. The watch item is top-10 lender concentration at 50.5% and the December 2025 covenant episode, which showed sensitivity to rating actions.' },
    { q: 'Is the yield attractive vs peers?', a: 'The current NCD (INE0BNQ07154) offers a YTM of 13.75% — roughly 800 bps over the ~5.76% G-sec base. That is wide versus AA- MFI peers (CreditAccess ~9.4%, Asirvad ~9.85%) and broadly in line with BBB/BBB+ peers (Sarvagram ~12.9%, Samunnati ~13.8%). The spread compensates for the weaker rating and earnings profile; investors must assess the credit risk.' },
  ],
};

// ── Keertana Finserv (Gold Loan) ─────────────────────────────────────────────

const KEERTANA_PERIODS = ['FY24', 'FY25', '3Q26'];
const keertana: CompanyReport = {
  id: 'keertana',
  subSectorKey: 'gold',
  healthScoreSeries: [
    { month: "Jun'25", score: 70 },
    { month: "Jul'25", score: 70 },
    { month: "Aug'25", score: 70 },
    { month: "Sep'25", score: 69 },
    { month: "Oct'25", score: 69 },
    { month: "Nov'25", score: 70, event: { direction: 'up', reason: 'India Ratings affirmed BBB+ (Stable) — scalable franchise and timely promoter capital infusion.' } },
    { month: "Dec'25", score: 68, event: { direction: 'down', reason: 'GNPA/NNPA rose to 1.38%/0.69% as the microfinance & LAP book deteriorated; cost of risk climbed to 5.79%.' } },
    { month: "Jan'26", score: 69 },
    { month: "Feb'26", score: 69 },
    { month: "Mar'26", score: 69, event: { direction: 'up', reason: 'Gold-loan AUM ramped to ~91% of book (+36% YTD) as risky microfinance loans run down.' } },
    { month: "Apr'26", score: 69 },
    { month: "May'26", score: 69 },
  ],
  scorecard: [
    { name: 'Business & Management', grade: 'Weak', pct: 43, factors: [
      { name: 'Business Model', grade: 'Weak', pct: 40 },
      { name: 'Business Position', grade: 'Weak', pct: 40 },
      { name: 'Borrower Profile', grade: 'Moderate', pct: 60 },
      { name: 'Management & Governance', grade: 'Weak', pct: 20 },
      { name: 'Ownership', grade: 'Weak', pct: 40 },
    ]},
    { name: 'Financial Analysis', grade: 'Moderate', pct: 59, factors: [
      { name: 'Capitalization', grade: 'Moderate', pct: 55 },
      { name: 'Funding', grade: 'Weak', pct: 46 },
      { name: 'Liquidity', grade: 'Weak', pct: 50 },
      { name: 'Profitability', grade: 'Moderate', pct: 55 },
      { name: 'Asset Quality', grade: 'Strong', pct: 80 },
    ]},
    { name: 'Issuance Assessment', grade: 'Extremely Strong', pct: 86, factors: [
      { name: 'Product Offering', grade: 'Extremely Strong', pct: 100 },
      { name: 'Market Liquidity', grade: 'Moderate', pct: 60 },
      { name: 'Financial Covenants', grade: 'Extremely Strong', pct: 100 },
      { name: 'Collateral', grade: 'Strong', pct: 80 },
      { name: 'Peer Comparison', grade: 'Moderate', pct: 60 },
    ]},
    { name: 'Pricing', grade: 'Strong', pct: 78, factors: [
      { name: 'Benchmark Credit Risk Premium', grade: 'Strong', pct: 80 },
      { name: 'Internal Assessment', grade: 'Extremely Strong', pct: 100 },
      { name: 'Forward-Looking Approach', grade: 'Strong', pct: 80 },
      { name: 'Comparable Peers', grade: 'Strong', pct: 80 },
      { name: 'Recent Issuances', grade: 'Moderate', pct: 60 },
    ]},
    { name: 'Economic & Sector Outlook', grade: 'Moderate', pct: 64, factors: [
      { name: 'Economic Outlook', grade: 'Moderate', pct: 60 },
      { name: 'Monetary Policy Outlook', grade: 'Moderate', pct: 60 },
      { name: 'Operating Sector Outlook', grade: 'Moderate', pct: 60 },
      { name: 'Sub-operating Sector Outlook', grade: 'Strong', pct: 80 },
    ]},
  ],
  ratingScale: [
    { dimension: 'Issuer', actual: '1.10/2.00', pct: 55, ratingNumber: 8, ratingLabel: 'BBB+' },
    { dimension: 'Issuance', actual: '0.86/1.00', pct: 86, ratingNumber: 4 },
    { dimension: 'Pricing', actual: '1.17/1.50', pct: 78, ratingNumber: 5 },
    { dimension: 'Economic & Sector', actual: '0.32/0.50', pct: 64, ratingNumber: 7 },
    { dimension: 'Combined', actual: '3.45/5.00', pct: 69, ratingNumber: 6, ratingLabel: 'BBB+' },
  ],
  financials: {
    capitalization: mk('Moderate', 55, [
      { label: 'Net Worth', unit: '₹ Cr', vals: [388, 596, 771] },
      { label: 'Leverage', unit: 'x', vals: [3.42, 3.36, 3.86] },
      { label: 'Total CAR', unit: '%', vals: [23.63, 25.12, 26.21] },
    ], KEERTANA_PERIODS,
      `Net worth has scaled rapidly to ₹771 cr on retained earnings and capital infusions, but leverage has crept up to 3.86x as the gold book grows quickly. Total CAR of 26.21% remains comfortably above the 20% covenant floor. The capitalisation profile is adequate for a fast-scaling secured lender, though the rising leverage trajectory bears watching against the wholesale-funded growth model.`),
    fundingLiquidity: mk('Weak', 46, [
      { label: 'Cash & Equivalents', unit: '₹ Cr', vals: [78, 133, 211] },
      { label: 'CCE / Total Assets', unit: '%', vals: [4.5, 5.0, 6.0] },
      { label: 'Liquidity Coverage Ratio', unit: '%', vals: [null, 125, 130] },
    ], KEERTANA_PERIODS,
      `Funding is the weakest financial pillar: growth has been wholesale-funded via term loans and NCDs, leaving the issuer reliant on continued market access. Cash buffers have grown in absolute terms (₹211 cr) but remain thin relative to a fast-growing balance sheet. The short-tenor gold book (typically 3–12 months) is a natural liquidity offset, as receivables turn over quickly relative to longer-dated liabilities.`),
    profitability: mk('Moderate', 55, [
      { label: 'NIM', unit: '%', vals: [10.68, 10.44, 12.19] },
      { label: 'ROAA', unit: '%', vals: [5.96, 3.06, 1.43] },
      { label: 'ROAE', unit: '%', vals: [25.58, 13.44, 6.86] },
      { label: 'Cost-to-Income', unit: '%', vals: [65.36, 72.12, 66.50] },
      { label: 'Cost of Risk', unit: '%', vals: [1.05, 2.87, 5.79] },
      { label: 'PAT', unit: '₹ Cr', vals: [71.86, 66.10, 12.27] },
    ], KEERTANA_PERIODS,
      `Profitability has compressed as the legacy microfinance/LAP book deteriorated: ROAA fell from 5.96% (FY24) to 1.43% (3Q26) and cost of risk jumped to 5.79%, driven entirely by the non-gold segments. NIM is actually improving (12.19%) as the mix shifts to higher-yielding gold loans. As the stressed non-gold book runs off, credit costs should normalise and returns recover toward the gold-segment baseline.`),
    assetQuality: mk('Strong', 80, [
      { label: 'On-book AUM', unit: '₹ Cr', vals: [1584, 2389, 3258] },
      { label: 'GNPA', unit: '%', vals: [0.07, 0.97, 1.38] },
      { label: 'NNPA', unit: '%', vals: [0.00, 0.49, 0.69] },
    ], KEERTANA_PERIODS,
      `Headline GNPA of 1.38% masks a sharp divergence by segment: the gold book — ~91% of AUM — carries essentially zero NPAs, while the legacy microfinance (22.40% GNPA) and home/LAP (8.62%) books drive the entire stress. The strategy of running down non-gold exposures is therefore directly de-risking the portfolio. As a secured, gold-backed lender, loss-given-default is structurally low.`),
  },
  qualitative: [
    { factor: 'Business Model', pillar: 'Business & Management', grade: 'Weak', pct: 40,
      commentary: `Keertana is a gold-loan lender built via the November 2021 acquisition of Rajshree Tracom. It is actively running down its legacy microfinance/JLG and LAP books to move toward a near-100% secured gold portfolio. With 459 branches across 6 states, the model is branch-led and collateral-backed. The transitional nature of the book — part clean gold, part stressed legacy — is the reason the model scores Weak despite the secured core.` },
    { factor: 'Business Position', pillar: 'Business & Management', grade: 'Weak', pct: 40,
      commentary: `The franchise is small but scaling fast (AUM ₹3,258 cr by 3Q26, +36% YTD in gold). Its position is heavily concentrated in Andhra Pradesh (78% of AUM), exposing it to single-state regulatory and economic risk. It competes against far larger, better-funded gold NBFCs and banks, leaving it a niche, regional player.` },
    { factor: 'Borrower Profile', pillar: 'Business & Management', grade: 'Moderate', pct: 60,
      commentary: `Gold-loan borrowers pledge physical gold against short-tenor loans, so the credit profile is fundamentally secured and the collateral is liquid. This places the borrower profile a notch above unsecured peers. The residual risk sits in the run-off non-gold segments, where borrowers are income-vulnerable microfinance and LAP customers.` },
    { factor: 'Management & Governance', pillar: 'Business & Management', grade: 'Weak', pct: 20,
      commentary: `MD Padmaja Reddy — the founder of Spandana — brings 25 years of lending experience but represents significant keyman risk. The 5-member board has 3 independent directors, and the auditor is GVCA & Associates (non-Big6). Combined with very concentrated ownership, governance is the lowest-scoring factor.` },
    { factor: 'Ownership', pillar: 'Business & Management', grade: 'Weak', pct: 40,
      commentary: `Ownership is extremely concentrated: the promoter group holds 99.67%, led by Vijaya Sivarami Reddy (75.13%) and Padmaja Gangireddy (21.99%). While alignment is total, the near-absence of external institutional shareholders is flagged as a governance negative, reducing independent oversight and check-and-balance.` },
  ],
  ownership: [
    { name: 'Vijaya Sivarami Reddy', pct: 75.13 },
    { name: 'Padmaja Gangireddy', pct: 21.99 },
    { name: 'Revan Saahith Reddy', pct: 2.27 },
    { name: 'Hina Ansari', pct: 0.28 },
  ],
  ownershipNote: 'Very closely held — promoter group 99.67%. Concentrated ownership is flagged as a governance negative.',
  productMix: [
    { name: 'Gold Loan', pct: 90.7, aum: 3075 },
    { name: 'Home Loan & LAP', pct: 5.4, aum: 182 },
    { name: 'Micro-Enterprise / JLG', pct: 3.8, aum: 129 },
    { name: 'Business Personal Loan', pct: 0.2, aum: 6 },
  ],
  ncdIssuances: [
    { isin: 'INE0NES07329', coupon: 12.00, ytm: 13.57, tenor: '~17m', size: 250, maturity: '22 Sep 2027', current: true },
    { isin: 'INE0NES07139', coupon: 12.00, ytm: 13.55, tenor: '~12m', size: 75, maturity: '22 Apr 2027', current: false },
    { isin: 'INE0NES07220', coupon: 13.50, ytm: 14.02, tenor: '~12m', size: 65, maturity: '11 Apr 2027', current: false },
    { isin: 'INE0NES07147', coupon: 14.00, ytm: 14.00, tenor: '~13m', size: 40, maturity: '26 May 2027', current: false },
    { isin: 'INE0NES07162', coupon: 13.00, ytm: 13.32, tenor: '~11m', size: 100, maturity: '06 Mar 2027', current: false },
    { isin: 'INE0NES07246', coupon: 13.00, ytm: 13.42, tenor: '~12m', size: 100, maturity: '03 Apr 2027', current: false },
    { isin: 'INE0NES07253', coupon: 13.25, ytm: 13.53, tenor: '~13m', size: 100, maturity: '12 May 2027', current: false },
    { isin: 'INE0NES07261', coupon: 13.00, ytm: 13.14, tenor: '~16m', size: 50, maturity: '19 Aug 2027', current: false },
  ],
  issuanceStructures: [
    {
      isin: 'INE0NES07329', instrument: 'Secured, Rated, Listed, Redeemable NCD (incl. ₹200 cr green-shoe)', ranking: 'Senior secured',
      coupon: 12.00, couponFrequency: 'Monthly', originalYtm: 12.00, currentYtm: 13.57,
      faceValue: 10000, faceValueLabel: '₹10,000', issueSize: 250, allotmentDate: '22 Apr 2026',
      maturity: '22 Sep 2027', residualDays: 513, securityCover: '1.10x',
      stepClause: 'Coupon step-up on downgrade below BBB', redemptionTrigger: 'None', current: true,
    },
    {
      isin: 'INE0NES07162', instrument: 'Secured, Rated, Listed, Redeemable NCD', ranking: 'Senior secured',
      coupon: 13.00, couponFrequency: 'Monthly', originalYtm: 13.00, currentYtm: 13.32,
      faceValue: 10000, faceValueLabel: '₹10,000', issueSize: 100, allotmentDate: '06 Mar 2025',
      maturity: '06 Mar 2027', residualDays: 270, securityCover: '1.10x',
      stepClause: 'Coupon step-up on downgrade below BBB', redemptionTrigger: 'None', current: false,
    },
  ],
  covenants: [
    { covenant: 'TOL / Net Worth', value: '≤4.5x', commentary: 'Maintained', grade: 'Strong' },
    { covenant: 'Capital adequacy & Net worth', value: 'CAR ≥20% & NW ≥₹550 cr', commentary: 'CAR 26.21%, NW ₹771 cr — comfortable', grade: 'Strong' },
    { covenant: 'Gold share of AUM', value: '≥66.67%', commentary: '~91% gold — well above floor', grade: 'Extremely Strong' },
    { covenant: 'Security cover', value: '1.10x', commentary: 'Maintained', grade: 'Strong' },
  ],
  peers: [
    { issuer: 'Muthoot Finance', rating: 'AA+', aum: '₹90,000 Cr', isin: 'INE414G07AA1', redemption: '2027', ytm: 8.60, tenor: '24m' },
    { issuer: 'Manappuram Finance', rating: 'AA', aum: '₹40,000 Cr', isin: 'INE522D07BB2', redemption: '2027', ytm: 9.10, tenor: '24m' },
    { issuer: 'IIFL Finance', rating: 'AA', aum: '₹25,000 Cr', isin: 'INE530B07CC3', redemption: '2027', ytm: 9.50, tenor: '18m' },
    { issuer: 'Indel Money', rating: 'A', aum: '₹2,500 Cr', isin: 'INE02VS07DD4', redemption: '2027', ytm: 12.40, tenor: '18m' },
    { issuer: 'Finkurve (Arvog)', rating: 'BBB+', aum: '₹1,800 Cr', isin: 'INE0DK907EE5', redemption: '2026', ytm: 13.20, tenor: '15m' },
  ],
  yieldOverview: { currentYtm: 13.57, gsecBase: 5.76, creditRiskPremium: 7.81, rangeLow: 13.0, rangeHigh: 14.1 },
  fundingMix: [{ name: 'Term Loans', pct: 50 }, { name: 'NCDs', pct: 38 }, { name: 'Securitization', pct: 12 }],
  alm: {
    assetTenorMonths: 11, liabilityTenorMonths: 14, cumulativeGapNote: 'Short-tenor gold book vs longer liabilities — comfortable liquidity',
    lcr: 130, topLenderConcentration: 'Wholesale-funded; moderate concentration',
  },
  geography: [
    { region: 'Andhra Pradesh', pct: 78 }, { region: 'Telangana', pct: 12 },
    { region: 'Karnataka', pct: 5 }, { region: 'Tamil Nadu', pct: 3 }, { region: 'Others', pct: 2 },
  ],
  ltvBuckets: [
    { bucket: '>75%', pct: 63.5 }, { bucket: '70–75%', pct: 10.6 }, { bucket: '60–70%', pct: 15.9 },
    { bucket: '50–60%', pct: 3.7 }, { bucket: '<50%', pct: 2.3 }, { bucket: 'No-LTV', pct: 4.0 },
  ],
  segmentAssetQuality: [
    { segment: 'Gold', gnpa: 0.00, nnpa: 0.00 },
    { segment: 'Home / LAP', gnpa: 8.62, nnpa: 4.82 },
    { segment: 'Microfinance', gnpa: 22.40, nnpa: 10.40 },
  ],
  management: {
    leadership: [
      { name: 'Padmaja Reddy', role: 'MD', background: 'Ex-Spandana founder; 25 yrs in lending' },
    ],
    boardComposition: '5-member board, 3 independent',
    auditor: 'GVCA & Associates', auditorFlag: 'Non-Big6',
    riskFlags: ['Keyman risk (MD Padmaja Reddy)', 'Very closely held (99.67% promoter)', 'Geographic concentration (AP 78%)', 'Seasoning of non-gold book'],
  },
  externalRating: {
    agency: 'India Ratings', rating: 'BBB+ (Stable)', outlook: 'Stable', date: 'Nov 2025',
    rationale: 'Reflects scalable gold-loan franchise and timely promoter capital infusion; constrained by geographic concentration (AP 78%) and seasoning of the non-gold portfolio.',
  },
  ratingHistory: [{ date: 'Nov 2025', note: 'India Ratings affirmed BBB+ (Stable)' }],
  materialDevelopments: [
    { date: 'Mar 2026', title: 'Gold AUM ~91% of book', body: 'Gold-loan AUM ramped +36% YTD as legacy microfinance loans are run down, de-risking the portfolio.' },
    { date: 'Nov 2025', title: 'BBB+ affirmation', body: 'India Ratings affirmed BBB+ (Stable) citing franchise scalability and promoter support.' },
  ],
  sectorOutlook: { operating: NBFC_OPERATING, subSector: GOLD_SUBSECTOR },
  recommendationRationale: [
    'Rapidly de-risking toward ~100% secured gold book',
    'Strong covenant package incl. 66.67% gold floor',
    'Excellent gold-segment asset quality (0% GNPA)',
    'Offsetting: keyman risk and AP geographic concentration',
  ],
  investorProtection: [
    'Secured NCD with 1.10x cover backed by gold collateral',
    'Gold-share covenant floor (≥66.67%)',
    'Strong net-worth & CAR covenants',
    'Short-tenor gold book supports liquidity',
  ],
  aiQAPairs: [
    { q: 'Why is governance rated Weak?', a: 'Governance scores low for two reasons: keyman risk concentrated in MD Padmaja Reddy (the founder of Spandana), and extremely concentrated ownership — the promoter group holds 99.67% with virtually no independent institutional shareholders. The auditor is also a non-Big6 firm. Together these reduce independent oversight.' },
    { q: 'How good is gold asset quality?', a: 'The gold segment — ~91% of AUM — carries essentially zero NPAs (0.00% GNPA/NNPA), reflecting the secured, short-tenor, liquid-collateral nature of gold lending. Headline GNPA of 1.38% is driven entirely by the legacy non-gold books (microfinance 22.40%, home/LAP 8.62%), which are being run down.' },
    { q: 'What is the geographic risk?', a: 'Keertana is highly concentrated in Andhra Pradesh (78% of AUM), with Telangana adding 12%. This single-state exposure means any AP-specific regulatory, political or economic shock would disproportionately affect the book. Geographic diversification is a key item to watch as the franchise scales.' },
    { q: 'Is the NCD attractively priced vs gold peers?', a: 'The current NCD (INE0NES07329) offers a YTM of 13.57% — about 781 bps over the ~5.76% G-sec base. That is well above large gold NBFCs (Muthoot ~8.6%, Manappuram ~9.1%) and in line with similarly-rated small gold lenders (Indel ~12.4%, Finkurve ~13.2%). The spread reflects the BBB+ rating, single-state concentration and smaller scale.' },
  ],
};

// ── Spandana Sphoorty (MFI, listed) ──────────────────────────────────────────

const SPANDANA_PERIODS = ['FY24', 'FY25', '3Q26'];
const spandana: CompanyReport = {
  id: 'spandana',
  subSectorKey: 'mfi',
  healthScoreSeries: [
    { month: "Jun'25", score: 70 },
    { month: "Jul'25", score: 69 },
    { month: "Aug'25", score: 68 },
    { month: "Sep'25", score: 66, event: { direction: 'down', reason: 'India Ratings downgraded to BBB+ (Negative) from A- on asset-quality stress and FY25 losses.' } },
    { month: "Oct'25", score: 67 },
    { month: "Nov'25", score: 69, event: { direction: 'up', reason: 'Venkatesh Krishnan appointed MD & CEO; ₹200 cr of the ₹400 cr rights issue received.' } },
    { month: "Dec'25", score: 70, event: { direction: 'up', reason: 'Net collection efficiency improved to ~94% and GNPA eased to 4.20% as the fresh book (58% of AUM) stayed current.' } },
    { month: "Jan'26", score: 70 },
    { month: "Feb'26", score: 70 },
    { month: "Mar'26", score: 70 },
    { month: "Apr'26", score: 70 },
    { month: "May'26", score: 70 },
  ],
  scorecard: [
    { name: 'Business & Management', grade: 'Weak', pct: 39, factors: [
      { name: 'Business Model', grade: 'Weak', pct: 20 },
      { name: 'Business Position', grade: 'Moderate', pct: 60 },
      { name: 'Borrower Profile', grade: 'Weak', pct: 20 },
      { name: 'Management & Governance', grade: 'Weak', pct: 40 },
      { name: 'Ownership', grade: 'Moderate', pct: 60 },
    ]},
    { name: 'Financial Analysis', grade: 'Moderate', pct: 60, factors: [
      { name: 'Capitalization', grade: 'Strong', pct: 75 },
      { name: 'Funding', grade: 'Weak', pct: 39 },
      { name: 'Liquidity', grade: 'Extremely Strong', pct: 95 },
      { name: 'Profitability', grade: 'Weak', pct: 41 },
      { name: 'Asset Quality', grade: 'Moderate', pct: 54 },
    ]},
    { name: 'Issuance Assessment', grade: 'Moderate', pct: 64, factors: [
      { name: 'Product Offering', grade: 'Strong', pct: 80 },
      { name: 'Market Liquidity', grade: 'Moderate', pct: 60 },
      { name: 'Financial Covenants', grade: 'Strong', pct: 80 },
      { name: 'Collateral', grade: 'Weak', pct: 40 },
      { name: 'Peer Comparison', grade: 'Moderate', pct: 60 },
    ]},
    { name: 'Pricing', grade: 'Extremely Strong', pct: 100, factors: [
      { name: 'Benchmark Credit Risk Premium', grade: 'Extremely Strong', pct: 100 },
      { name: 'Internal Assessment', grade: 'Extremely Strong', pct: 100 },
      { name: 'Forward-Looking Approach', grade: 'Extremely Strong', pct: 100 },
      { name: 'Comparable Peers', grade: 'Extremely Strong', pct: 100 },
      { name: 'Recent Issuances', grade: 'Extremely Strong', pct: 100 },
    ]},
    { name: 'Economic & Sector Outlook', grade: 'Moderate', pct: 56, factors: [
      { name: 'Economic Outlook', grade: 'Moderate', pct: 60 },
      { name: 'Monetary Policy Outlook', grade: 'Moderate', pct: 60 },
      { name: 'Operating Sector Outlook', grade: 'Moderate', pct: 60 },
      { name: 'Sub-operating Sector Outlook', grade: 'Weak', pct: 40 },
    ]},
  ],
  ratingScale: [
    { dimension: 'Issuer', actual: '1.10/2.00', pct: 55, ratingNumber: 8, ratingLabel: 'BBB+' },
    { dimension: 'Issuance', actual: '0.64/1.00', pct: 64, ratingNumber: 7 },
    { dimension: 'Pricing', actual: '1.50/1.50', pct: 100, ratingNumber: 1 },
    { dimension: 'Economic & Sector', actual: '0.28/0.50', pct: 56, ratingNumber: 8 },
    { dimension: 'Combined', actual: '3.52/5.00', pct: 70, ratingNumber: 6, ratingLabel: 'BBB+' },
  ],
  financials: {
    capitalization: mk('Strong', 75, [
      { label: 'Net Worth', unit: '₹ Cr', vals: [3645, 2633, 2121] },
      { label: 'Leverage', unit: 'x', vals: [2.66, 2.20, 1.85] },
      { label: 'Total CAR', unit: '%', vals: [31.95, 36.31, 40.30] },
    ], SPANDANA_PERIODS,
      `Capitalisation is a clear strength: Total CAR of 40.30% (3Q26) is among the highest in the MFI universe, and leverage has fallen to 1.85x as the balance sheet contracted. The ₹400 cr rights issue (₹200 cr received by Nov'25) further bolsters the buffer. Net worth has declined from the FY24 peak due to the FY25 loss, but the capital cushion remains exceptional relative to the risk being carried.`),
    fundingLiquidity: mk('Moderate', 60, [
      { label: 'Cash & Equivalents', unit: '₹ Cr', vals: [1872, 1844, 1553] },
      { label: 'CCE / Total Assets', unit: '%', vals: [22.0, 24.0, 25.0] },
      { label: 'Liquidity Coverage Ratio', unit: '%', vals: [null, 380, 424.46] },
    ], SPANDANA_PERIODS,
      `Liquidity is exceptional: cash & equivalents of ₹1,553 cr equal ~25% of assets and cover 52% of the next 12 months’ repayments, with an LCR of 424.46%. Asset tenor of 20 months comfortably exceeds liability tenor of 10 months and there is no cumulative ALM shortfall up to one year. The offset is funding: market access tightened post-downgrade, scoring the funding factor low even as the liquidity stockpile is best-in-class.`),
    profitability: mk('Weak', 41, [
      { label: 'Total Operating Revenue', unit: '₹ Cr', vals: [1421.13, 1362.00, 2400.57, 2355.16, 229.55, 234.27] },
      { label: 'Operating Revenue Growth', unit: '%', vals: [null, -4.16, 76.25, -1.89, -23.60, 2.06] },
      { label: '3-Year Revenue CAGR', unit: '%', vals: [null, null, null, 18.34, null, null] },
      { label: 'Net Interest Income (NII)', unit: '₹ Cr', vals: [796.44, 819.61, 1311.32, 1262.06, 104.76, 116.42] },
      { label: 'Net Interest Margin (NIM)', unit: '%', vals: [12.92, 11.57, 13.55, 14.25, 8.44, 12.71] },
      { label: 'Yield on loans', unit: '%', vals: [21.67, 18.03, 23.13, 24.78, 18.09, 24.59] },
      { label: 'Cost of funds', unit: '%', vals: [14.40, 9.34, 11.99, 12.38, 10.72, 12.29] },
      { label: 'ROAA', unit: '%', vals: [0.99, 0.15, 4.40, -9.46, -14.06, -6.44] },
      { label: 'ROAE', unit: '%', vals: [2.26, 0.40, 14.85, -32.98, -41.01, -17.47] },
      { label: 'Cost-to-income (C/I)', unit: '%', vals: [63.51, 67.17, 65.85, 77.13, 134.38, 133.42] },
      { label: 'Operating cost / AUM', unit: '%', vals: [5.88, 5.71, 5.76, 13.90, 21.12, 21.72] },
      { label: 'Cost of Risk', unit: '%', vals: [7.12, 7.14, 2.68, 22.43, 20.79, 6.38] },
      { label: 'Credit cost / PPOP', unit: '%', vals: [81.92, 96.59, 27.89, 326.95, -374.31, -87.21] },
      { label: 'PAT', unit: '₹ Cr', vals: [69.83, 12.40, 500.72, -1035.16, -249.13, -94.97] },
      { label: 'PAT growth', unit: '%', vals: [null, -82.24, 3938.06, -306.73, -30.85, -61.88] },
    ], ['FY22', 'FY23', 'FY24', 'FY25', '2Q26', '3Q26'],
      `Profitability swung from a ₹501 cr profit (FY24) to a ₹1,035 cr loss (FY25) as cost of risk exploded to 22.43% during the MFI downturn and AUM contracted. 3Q26 losses have narrowed sharply (-₹95 cr) as cost of risk normalised to 6.38% and the fresh book performs. NIM remains healthy at 12.71%. The path back to profitability depends on AUM stabilising and credit costs continuing to ease.`),
    assetQuality: mk('Moderate', 54, [
      { label: 'On-book AUM', unit: '₹ Cr', vals: [11352, 6361, 3754] },
      { label: 'GNPA', unit: '%', vals: [1.97, 4.42, 4.20] },
      { label: 'NNPA', unit: '%', vals: [0.40, 0.93, 0.90] },
    ], SPANDANA_PERIODS,
      `Asset quality deteriorated sharply in FY25 (GNPA 4.42%) and AUM nearly halved as the company aggressively recognised and wrote off stress. GNPA has stabilised at 4.20% by 3Q26, and crucially the fresh book — 58% of AUM, underwritten under tighter norms — is 99.8% current. Net collection efficiency has recovered to ~94%. The legacy book overhang remains, but the trajectory is one of stabilisation.`),
  },
  qualitative: [
    { factor: 'Business Model', pillar: 'Business & Management', grade: 'Weak', pct: 20,
      commentary: `Spandana runs a joint-liability-group (JLG) microfinance model, 88% rural, through 1,667 branches across 20 states. The customer base has contracted from 24.9 lakh to 12.9 lakh as the company de-grew through the sector stress. The JLG model is inherently exposed to localised collection disruption and borrower over-leverage, which is why the business model scores Weak despite operational scale.` },
    { factor: 'Business Position', pillar: 'Business & Management', grade: 'Moderate', pct: 60,
      commentary: `Spandana is one of the larger listed MFIs in India (NSE & BSE), with a recognised brand and a multi-state footprint. Its subsidiary Criss Financial (proposed merger) adds capability. Despite the FY25 setback, its scale, listing and capital base keep its competitive position in the moderate band rather than weak.` },
    { factor: 'Borrower Profile', pillar: 'Business & Management', grade: 'Weak', pct: 20,
      commentary: `The borrower base is rural JLG women, predominantly low-income and income-vulnerable, with limited financial buffers. This cohort is highly sensitive to macro and localised shocks, as the FY25 experience demonstrated. The profile is structurally the weakest part of the assessment, common to the JLG-MFI segment.` },
    { factor: 'Management & Governance', pillar: 'Business & Management', grade: 'Weak', pct: 40,
      commentary: `Management has seen significant churn: Shalabh Saxena exited in April 2025, an interim CEO bridged the gap, and Venkatesh Krishnan (35 years’ experience) was appointed MD & CEO in November 2025. The 9-member board is over half independent, and the auditor is BSR & Co (a KPMG / Big6 firm) — a governance positive. The leadership transition and cash-collection operational risk weigh on the score.` },
    { factor: 'Ownership', pillar: 'Business & Management', grade: 'Moderate', pct: 60,
      commentary: `Spandana is PE-controlled by Kedaara Capital (~48% combined via Kangchenjunga and Fund III), with foreign institutions (20%) and retail (23%) holding the balance. Former promoters Padmaja and Vijaya have exited. The PE structure brings professional governance but the complex holding pattern and recent control transition temper the score to Moderate.` },
  ],
  ownership: [
    { name: 'Kedaara (Kangchenjunga)', pct: 41 },
    { name: 'Retail', pct: 23 },
    { name: 'Foreign institutions', pct: 20 },
    { name: 'Kedaara Fund III', pct: 7 },
    { name: 'Indian institutions', pct: 6 },
    { name: 'Non-institutions', pct: 3 },
  ],
  ownershipNote: 'PE-controlled by Kedaara Capital (~48% combined via Kangchenjunga + Fund III). Former promoters Padmaja/Vijaya have exited. Listed on NSE & BSE.',
  productMix: [
    { name: 'JLG', pct: 88, aum: 6029 },
    { name: 'Individual Loans', pct: 8, aum: 546 },
    { name: 'LAP', pct: 3, aum: 195 },
    { name: 'Nano Enterprise', pct: 1, aum: 49 },
  ],
  ncdIssuances: [
    { isin: 'INE572J07778', coupon: 11.25, ytm: 14.19, tenor: '~20m', size: 150, maturity: '17 Dec 2027', current: true },
    { isin: 'INE572J07786', coupon: 13.00, ytm: 13.00, tenor: '~26m', size: 150, maturity: '30 Jun 2028', current: false },
    { isin: 'INE572J07760', coupon: 13.00, ytm: 14.02, tenor: '~24m', size: 400, maturity: '30 Apr 2028', current: false },
    { isin: 'INE572J07794', coupon: 12.35, ytm: 12.35, tenor: '~22m', size: 75, maturity: '31 Mar 2028', current: false },
  ],
  issuanceStructures: [
    {
      isin: 'INE572J07778', instrument: 'Secured, Rated, Listed, Redeemable NCD', ranking: 'Senior secured',
      coupon: 11.25, couponFrequency: 'Monthly', originalYtm: 11.25, currentYtm: 14.19,
      faceValue: 100000, faceValueLabel: '₹1,00,000', issueSize: 150, allotmentDate: '17 Apr 2026',
      maturity: '17 Dec 2027', residualDays: 611, securityCover: '1.10x',
      stepClause: 'Coupon step-up on downgrade', redemptionTrigger: 'None', current: true,
    },
    {
      isin: 'INE572J07760', instrument: 'Secured, Rated, Listed, Redeemable NCD', ranking: 'Senior secured',
      coupon: 13.00, couponFrequency: 'Monthly', originalYtm: 13.00, currentYtm: 14.02,
      faceValue: 100000, faceValueLabel: '₹1,00,000', issueSize: 400, allotmentDate: '30 Apr 2026',
      maturity: '30 Apr 2028', residualDays: 720, securityCover: '1.10x',
      stepClause: 'Coupon step-up on downgrade', redemptionTrigger: 'None', current: false,
    },
  ],
  covenants: [
    { covenant: 'Net Worth floor', value: '≥₹2,000 cr', commentary: '₹2,121 cr — just above floor', grade: 'Moderate' },
    { covenant: 'ALM mismatch', value: 'No cumulative mismatch', commentary: 'Strong liquidity buffer', grade: 'Strong' },
    { covenant: 'Kedaara holding', value: '≥26%', commentary: 'Maintained', grade: 'Strong' },
    { covenant: 'Capital adequacy', value: 'CAR 40.30%', commentary: 'Very strong', grade: 'Extremely Strong' },
  ],
  peers: [
    { issuer: 'CreditAccess Gramin', rating: 'AA-', aum: '₹26,000 Cr', isin: 'INE741K07AA1', redemption: '2027', ytm: 9.40, tenor: '24m' },
    { issuer: 'Asirvad Micro Finance', rating: 'AA-', aum: '₹12,000 Cr', isin: 'INE516Q07BB2', redemption: '2027', ytm: 9.85, tenor: '18m' },
    { issuer: 'Sarvagram', rating: 'BBB+', aum: '₹2,500 Cr', isin: 'INE0J5L07CC3', redemption: '2027', ytm: 12.90, tenor: '15m' },
    { issuer: 'Dvara KGFS', rating: 'BBB+', aum: '₹2,000 Cr', isin: 'INE516X07DD4', redemption: '2026', ytm: 13.10, tenor: '12m' },
    { issuer: 'Midland Microfin', rating: 'A-', aum: '₹3,000 Cr', isin: 'INE0FS807EE5', redemption: '2027', ytm: 12.20, tenor: '18m' },
    { issuer: 'Samunnati', rating: 'BBB', aum: '₹1,500 Cr', isin: 'INE9B1007FF6', redemption: '2026', ytm: 13.80, tenor: '12m' },
  ],
  yieldOverview: { currentYtm: 14.19, gsecBase: 5.76, creditRiskPremium: 8.43, rangeLow: 13.5, rangeHigh: 14.5 },
  fundingMix: [{ name: 'Term Loans', pct: 45 }, { name: 'NCDs', pct: 40 }, { name: 'Securitization', pct: 15 }],
  alm: {
    assetTenorMonths: 20, liabilityTenorMonths: 10, cumulativeGapNote: 'No cumulative ALM shortfall up to one year; very strong liquidity',
    lcr: 424.46, ccePctOf12mRepayments: 52, topLenderConcentration: 'Diversified bank & DFI lenders',
  },
  geography: [
    { region: 'Madhya Pradesh', pct: 15 }, { region: 'Odisha', pct: 13 }, { region: 'Bihar', pct: 13 },
    { region: 'Andhra Pradesh', pct: 11 }, { region: 'Others', pct: 48 },
  ],
  collectionEfficiency: [
    { period: '1Q26', value: 88 }, { period: '2Q26', value: 91 }, { period: '3Q26', value: 94 },
  ],
  management: {
    leadership: [
      { name: 'Venkatesh Krishnan', role: 'MD & CEO', background: 'Appointed Nov 2025; 35 yrs in financial services' },
    ],
    boardComposition: '9-member board, >50% independent',
    auditor: 'BSR & Co (KPMG)',
    riskFlags: ['Leadership transition (CEO churn in 2025)', 'FY25 large losses', 'Cash-collection operational risk', 'AUM contraction'],
  },
  externalRating: {
    agency: 'India Ratings', rating: 'BBB+ (Negative)', outlook: 'Negative', date: '2025',
    rationale: 'Reflects FY25–1Q26 asset-quality stress and profitability pressure; supported by very strong capital (CAR 40%) and liquidity. Downgraded from A- (also by Crisil & Care).',
  },
  ratingHistory: [{ date: '2025', note: 'Downgraded A- → BBB+ (Negative) by India Ratings, Crisil & Care' }],
  materialDevelopments: [
    { date: 'Nov 2025', title: 'New MD & CEO + rights issue', body: 'Venkatesh Krishnan appointed MD & CEO; ₹200 cr of a ₹400 cr rights issue received.' },
    { date: '2026', title: 'Proposed Criss Financial merger', body: 'Proposed merger of subsidiary Criss Financial (₹650 cr AUM) into Spandana over ~6–9 months for cost synergies.' },
    { date: 'Apr 2025', title: 'CEO transition', body: 'Shalabh Saxena exited Apr 2025; interim Ashish Damani led until Venkatesh Krishnan joined Nov 2025.' },
  ],
  sectorOutlook: { operating: NBFC_OPERATING, subSector: MFI_SUBSECTOR },
  recommendationRationale: [
    'Very strong capital (CAR 40%) and liquidity (LCR 424%)',
    'Fresh book (58% of AUM) 99.8% current; collection efficiency recovering to ~94%',
    'Listed, PE-backed (Kedaara) governance',
    'Offsetting: FY25 losses, AUM contraction, leadership transition',
  ],
  investorProtection: [
    'Secured NCD with 1.10x security cover',
    'Exceptional liquidity — CCE covers 52% of 12-month repayments',
    'Strong net-worth and capital covenants',
    'Listed issuer with public disclosure discipline',
  ],
  aiQAPairs: [
    { q: 'Why was Spandana downgraded?', a: 'India Ratings (with Crisil and Care) downgraded Spandana from A- to BBB+ (Negative) in 2025, reflecting severe FY25 asset-quality stress (GNPA rose to 4.42%) and a ₹1,035 cr FY25 loss as cost of risk spiked to 22.43% during the MFI downturn. The Negative outlook signals continued caution despite strong capital and liquidity.' },
    { q: 'How strong is liquidity?', a: 'Liquidity is best-in-class: cash & equivalents of ₹1,553 cr equal ~25% of assets and cover 52% of the next 12 months’ repayments, with an LCR of 424.46%. Asset tenor (20 months) far exceeds liability tenor (10 months) and there is no cumulative ALM shortfall up to one year.' },
    { q: 'What is the collection-efficiency trend?', a: 'Net collection efficiency has recovered steadily through FY26: ~88% in 1Q26, ~91% in 2Q26, and ~94% in 3Q26. Critically, the fresh book — 58% of AUM, underwritten under tighter post-stress norms — is running at 99.8% current, which underpins the stabilisation in GNPA at ~4.20%.' },
    { q: 'Who controls the company?', a: 'Spandana is controlled by PE firm Kedaara Capital, which holds ~48% combined through Kangchenjunga (41%) and Kedaara Fund III (7%). Foreign institutions hold ~20% and retail ~23%. The former promoters (Padmaja Reddy, Vijaya) have fully exited. The company is listed on the NSE and BSE.' },
  ],
};

// ── Listing / price / data-sources / signals (attached below) ────────────────

const LISTINGS: Record<string, Listing> = {
  krazybee: { listed: false, note: 'IPO expected — not yet listed.' },
  avanti: { listed: false, note: 'Unlisted — market price unavailable.' },
  keertana: { listed: false, note: 'Unlisted — market price unavailable.' },
  spandana: { listed: true, exchanges: 'NSE / BSE', ticker: 'SPANDANA' },
};

// Illustrative mock share price (₹) — wire a real feed at go-live.
const PRICE_SERIES: Record<string, PricePoint[]> = {
  spandana: [
    { month: "Jun'25", price: 365 }, { month: "Jul'25", price: 352 }, { month: "Aug'25", price: 338 },
    { month: "Sep'25", price: 298 }, { month: "Oct'25", price: 305 }, { month: "Nov'25", price: 332 },
    { month: "Dec'25", price: 348 }, { month: "Jan'26", price: 356 }, { month: "Feb'26", price: 349 },
    { month: "Mar'26", price: 360 }, { month: "Apr'26", price: 368 }, { month: "May'26", price: 374 },
  ],
};

const dataSourcesFor = (subSectorKey: CompanyReport['subSectorKey']): DataSource[] => [
  { label: 'Financials', cadence: 'Quarterly', lastUpdated: 'as of 3Q FY26', status: 'Mock' },
  { label: 'Qualitative & news', cadence: 'Real-time', lastUpdated: '12 Jun 2026', status: 'Mock' },
  { label: 'Sectoral trend', cadence: 'Monthly', lastUpdated: 'May 2026', status: 'Mock' },
  { label: 'Debt & default — Commercial CIBIL (partner)', cadence: 'Partner feed', lastUpdated: '10 Jun 2026', status: 'Mock' },
  { label: 'Shareholding & ownership — registry (partner)', cadence: 'Partner feed', lastUpdated: '08 Jun 2026', status: 'Mock' },
  { label: `Litigation, regulatory & penalties — agency (${subSectorKey === 'gold' ? 'gold-NBFC' : 'NBFC'} desk)`, cadence: 'Partner feed', lastUpdated: '09 Jun 2026', status: 'Mock' },
];

const SIGNALS: Record<string, Signal[]> = {
  krazybee: [
    { date: 'Apr 2026', type: 'Debt raised', source: 'Company / registry', impact: 'up', text: 'Raised $280M Series E (~$1.5B valuation) — strengthens capital & funding profile.' },
    { date: 'Apr 2026', type: 'Shareholding change', source: 'Registry (partner)', impact: 'up', text: 'New institutional investors added to the cap table post Series E.' },
    { date: 'Feb 2026', type: 'News', source: 'Real-time news', impact: 'neutral', text: 'Board approves conversion to a public company ahead of a potential IPO.' },
    { date: 'Dec 2025', type: 'News', source: 'Financials (3Q FY26)', impact: 'down', text: 'Leverage rose to 2.40x and Total CAR eased to 23.55% — Capitalization.' },
    { date: 'Oct 2025', type: 'News', source: 'Financials', impact: 'up', text: 'Asset quality strengthened; GNPA eased toward ~2% — Asset Quality.' },
    { date: 'Aug 2025', type: 'Auditor change', source: 'Registry (partner)', impact: 'down', text: 'Statutory auditor (Tattavam & Co.) resigned — Management & Governance.' },
  ],
  avanti: [
    { date: 'Apr 2026', type: 'Debt raised', source: 'Company / registry', impact: 'up', text: '₹75 cr promoter (NRJN Trust) capital infusion lifted Total CAR to ~31%.' },
    { date: 'Dec 2025', type: 'Default / delay', source: 'Commercial CIBIL (partner)', impact: 'down', text: 'Breached certain lender covenants; waiver obtained — refinancing sensitivity flagged.' },
    { date: 'Sep 2025', type: 'Regulatory penalty', source: 'Crisil', impact: 'down', text: 'Crisil downgraded the rating BBB+ → BBB on asset-quality and earnings pressure.' },
    { date: 'Aug 2025', type: 'News', source: 'Real-time news', impact: 'neutral', text: 'Microfinance sector stress persists; collection efficiencies under watch.' },
  ],
  keertana: [
    { date: 'Mar 2026', type: 'News', source: 'Financials', impact: 'up', text: 'Gold-loan AUM ramped to ~91% of book (+36% YTD) as legacy MFI runs down.' },
    { date: 'Dec 2025', type: 'News', source: 'Financials (3Q FY26)', impact: 'down', text: 'GNPA/NNPA rose to 1.38%/0.69% as non-gold book deteriorated — Asset Quality.' },
    { date: 'Nov 2025', type: 'News', source: 'India Ratings', impact: 'up', text: 'India Ratings affirmed BBB+ (Stable) — scalable franchise + promoter support.' },
    { date: 'Oct 2025', type: 'Litigation', source: 'Agency (partner)', impact: 'neutral', text: 'No material litigation or regulatory action on record this period.' },
  ],
  spandana: [
    { date: 'Dec 2025', type: 'News', source: 'Financials (3Q FY26)', impact: 'up', text: 'Net collection efficiency improved to ~94%; GNPA eased to 4.20%.' },
    { date: 'Nov 2025', type: 'Management change', source: 'Registry (partner)', impact: 'up', text: 'Venkatesh Krishnan appointed MD & CEO; ₹200 cr of a ₹400 cr rights issue received.' },
    { date: 'Sep 2025', type: 'Regulatory penalty', source: 'India Ratings', impact: 'down', text: 'Downgraded A- → BBB+ (Negative) on FY25 asset-quality stress and losses.' },
    { date: 'Apr 2025', type: 'Management change', source: 'Registry (partner)', impact: 'down', text: 'CEO Shalabh Saxena exited; interim leadership until Nov 2025.' },
  ],
};

// ── Registry ──────────────────────────────────────────────────────────────────

export const reports: Record<string, CompanyReport> = {
  krazybee,
  avanti,
  keertana,
  spandana,
};

// Latest-quarter + outlook write-ups for the financial sections of the
// secondary entities (KrazyBee's are authored inline in krazybee.ts).
const FIN_NOTES: Record<string, Record<string, { quarterly: string; outlook: string }>> = {
  avanti: {
    capitalization: { quarterly: 'Post the ₹75 cr April 2026 promoter infusion, Total CAR rose to 31.05% and leverage fell to 1.86x; net worth was ₹292 cr in 3Q26.', outlook: 'Capital is now comfortable, but internal generation stays negative until earnings turn; continued promoter/DFI support underpins the buffer into FY27.' },
    fundingLiquidity: { quarterly: "Total funding was ₹631 cr (Sep'25), split 55% term loans / 45% NCDs; LCR of 225.66% with no cumulative ALM shortfall within one year.", outlook: "Top-10 lender concentration of 50.5% is the structural vulnerability; the Dec'25 covenant-waiver episode underlined sensitivity to rating actions and refinancing." },
    profitability: { quarterly: '3Q26 stayed loss-making (PAT -₹25.8 cr) with cost-to-income above 100% and credit cost normalising to ~10% from the FY25 spike.', outlook: 'A return to profitability depends on credit costs settling and AUM recovering operating leverage; break-even remains several quarters away.' },
    assetQuality: { quarterly: 'GNPA improved sharply to 1.39% and NNPA to 0.53% by 3Q26 after FY25 write-offs; AUM contracted to ₹554 cr as the book de-risked.', outlook: 'Headline ratios are clean post clean-up, but the ~97% unsecured rural-MFI mix keeps the segment cyclically fragile.' },
  },
  keertana: {
    capitalization: { quarterly: 'Net worth scaled to ₹771 cr by 3Q26 with Total CAR at 26.21%, though leverage edged up to 3.86x on rapid gold-book growth.', outlook: 'Capital is adequate for a secured lender; the rising-leverage, wholesale-funded trajectory is the item to watch as gold AUM compounds.' },
    fundingLiquidity: { quarterly: 'Growth stayed wholesale-funded via term loans and NCDs; cash rose to ₹211 cr, still thin against the fast-growing balance sheet.', outlook: 'Short-tenor gold receivables are a natural liquidity offset; deepening funding access and lengthening tenor would de-risk the profile.' },
    profitability: { quarterly: 'ROAA compressed to 1.43% in 3Q26 as legacy non-gold credit costs (cost of risk 5.79%) weighed, even as NIM improved to 12.19%.', outlook: 'As stressed non-gold books run off, credit costs should normalise and returns recover toward the clean gold-segment baseline.' },
    assetQuality: { quarterly: 'Headline GNPA of 1.38% masks a clean gold book (0% NPAs) versus stressed microfinance (22.4%) and home/LAP (8.6%) segments being wound down.', outlook: 'The shift to ~91% gold structurally de-risks the portfolio; residual risk sits in the run-off non-gold exposures and AP geographic concentration.' },
  },
  spandana: {
    capitalization: { quarterly: 'Total CAR was exceptional at 40.30% in 3Q26 with leverage down to 1.85x; the ₹400 cr rights issue (₹200 cr received) further bolstered capital.', outlook: 'Capital is a clear strength and absorbs further stress; rebuilding earnings to lift net worth is the path back to a higher score.' },
    fundingLiquidity: { quarterly: 'Liquidity was best-in-class — CCE of ₹1,553 cr (~25% of assets, 52% of 12-month repayments) and an LCR of 424.46%.', outlook: 'Funding access tightened post-downgrade, scoring the funding factor low despite the stockpile; market re-access as asset quality stabilises is the swing factor.' },
    profitability: { quarterly: '3Q26 losses narrowed to -₹95 cr as cost of risk normalised to 6.38% from the FY25 spike of 22.43%; NIM held at 12.71%.', outlook: "A return to profitability hinges on AUM stabilising and credit costs continuing to ease; the fresh book's performance is the leading indicator." },
    assetQuality: { quarterly: 'GNPA stabilised at 4.20% by 3Q26 with the fresh book (58% of AUM) 99.8% current and collection efficiency recovering to ~94%.', outlook: 'The legacy overhang persists, but the trajectory is stabilisation; sustained ~95%+ collections would confirm the turn through FY27.' },
  },
};

// Attach mock real-time data layer + write-ups to every report.
Object.entries(reports).forEach(([id, r]) => {
  r.listing = LISTINGS[id] ?? { listed: false, note: 'Unlisted — market price unavailable.' };
  r.priceSeries = PRICE_SERIES[id];
  r.dataSources = dataSourcesFor(r.subSectorKey);
  r.signals = SIGNALS[id] ?? [];
  const notes = FIN_NOTES[id];
  if (notes) {
    Object.entries(notes).forEach(([key, note]) => {
      const sec = r.financials[key];
      if (sec) { sec.quarterly = sec.quarterly ?? note.quarterly; sec.outlook = sec.outlook ?? note.outlook; }
    });
  }
});

export const getReport = (id?: string): CompanyReport | undefined =>
  id ? reports[id] : undefined;
