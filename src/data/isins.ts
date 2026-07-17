import type { Grade } from './types';
import type { Covenant } from './covenants';
import type { SectorId } from './sectors';
import type { ScorecardPillar } from './krazybee';
import type { ComponentScore } from './score';
import { getReport, reports } from './reports';
import { getScaledScore, gradeForPct } from './score';

// ── Issuer → ISINs layer (§C / §D) ───────────────────────────────────────────
//
// An issuer's Fundamental Score (/200) and Economic & Sector (/50) are ISSUER-level
// and shared across every one of its ISINs. Issuance (/100), Pricing (/150) and
// covenants are ISIN-specific. Total (/500) and Rating (1–10) are therefore
// ISIN-level too.
//
// ADDITIVE BY DESIGN: this layer sits alongside `reports.ts` and never mutates it.
// An issuer with no authored ISINs behaves exactly as before — `getImplicitIsin`
// synthesizes a single ISIN from its existing report so ISIN-level UI still works.
// KrazyBee and Spandana deliberately stay issuer-only.
//
// SEALED: every score/grade here is authored. Nothing is recomputed. In particular
// `combined` is authored, NOT the sum of its parts — see MIDLAND below, where the
// source rating scale's Combined (3.07) differs from its components' sum (3.19)
// because the PDF section is templated off Avanti.

export type { Covenant, CovenantCondition, Op } from './covenants';

/** Grade → fixed points (§C). */
export const GRADE_POINTS: Record<Grade, number> = {
  'Extremely Weak': 20,
  'Weak': 40,
  'Moderate': 60,
  'Strong': 80,
  'Extremely Strong': 100,
};

export interface FactorScore {
  key: string;
  label: string;
  grade: Grade;
  /** 0–100. */
  pct: number;
  commentary: string;
}

export interface Pillar {
  key: string;
  label: string;
  /** 0–100. */
  score: number;
  grade: Grade;
  factors: FactorScore[];
}

export interface PricingFactor {
  key: 'benchmark' | 'internal' | 'forward' | 'peer' | 'recent';
  label: string;
  grade: Grade;
  commentary: string;
  /** The comparison range this factor is read against, where the report gives one. */
  range?: [number, number];
}

export interface IsinIssuance {
  /** Authored, /100. */
  score: number;
  grade: Grade;
  factors: FactorScore[];
  covenants: Covenant[];
  collateral: {
    securityCover?: number;
    grade: Grade;
    note: string;
    selectionCriteria: string[];
  };
  /** Testing cadence / reporting / cure mechanics. */
  testing?: string;
}

export interface IsinPricing {
  /** Authored, /150. */
  score: number;
  grade: Grade;
  ytm?: number;
  gsec?: number;
  creditRiskPremium?: number;
  benchmarkRange?: [number, number];
  internalRange?: [number, number];
  peerRange?: [number, number];
  recentRange?: [number, number];
  factors: PricingFactor[];
  recommendation?: string;
}

export interface IsinAssessment {
  isin: string;
  issuerId: string;
  sector: SectorId;
  /** §K4 — fabricated for the demo; renders a visible "Illustrative" badge. */
  illustrative?: boolean;
  /** Synthesized from an issuer-only report rather than authored. */
  implicit?: boolean;
  /** False for lightly-seeded ISINs: terms are known, assessment is not. */
  assessed?: boolean;
  series?: string;
  coupon?: number;
  couponFrequency?: string;
  ytmIssue?: number;
  ytmCurrent?: number;
  allotment?: string;
  maturity?: string;
  residualTenor?: string;
  faceValue?: number;
  faceValueLabel?: string;
  issueSize?: number;
  ranking?: string;
  secured?: boolean;
  seniority?: 'senior' | 'subordinated';
  listing?: string;
  externalRating?: string;
  status?: 'active' | 'matured';
  principalRepayment?: string;
  structuralClauses?: string[];
  marketLiquidityNote?: string;
  issuance?: IsinIssuance;
  pricing?: IsinPricing;
  /** Authored roll-up (/500) — never recomputed. */
  combined?: { score: number; max: 500; pct: number; rating: number; label?: string };
  priceSeries?: { date: string; value: number }[];
  /** Known gaps, surfaced in the UI rather than silently filled (§B). */
  todo?: string[];
}

// ── Issuer-level fundamentals for issuers with no legacy report ───────────────
// Only Midland needs this: Avanti and Keertana derive theirs from `reports.ts`
// (their §K figures match the authored report exactly), which keeps this layer
// consistent with /app/compare and /app/sectors by construction.

interface AuthoredIssuerFundamental {
  fundamental: { score: number; max: 200; pct: number; pillars: Pillar[] };
  economicSector: { score: number; max: 50; pct: number; grade: Grade; factors: FactorScore[] };
}

const TODO_MIDLAND = 'TODO: Midland KID';

const AUTHORED_FUNDAMENTAL: Record<string, AuthoredIssuerFundamental> = {
  // §K1 — Issuer 1.14/2.00 · 57% · R8 (BBB+) → Fundamental 114/200
  midland: {
    fundamental: {
      score: 114, max: 200, pct: 57,
      pillars: [
        {
          key: 'business-management', label: 'Business & Management', score: 40, grade: 'Weak',
          factors: [
            { key: 'business-model', label: 'Business Model', grade: 'Extremely Weak', pct: 20, commentary: TODO_MIDLAND },
            { key: 'business-position', label: 'Business Position', grade: 'Weak', pct: 40, commentary: TODO_MIDLAND },
            { key: 'borrower-profile', label: 'Borrower Profile', grade: 'Extremely Weak', pct: 20, commentary: TODO_MIDLAND },
            { key: 'management-governance', label: 'Management & Governance', grade: 'Moderate', pct: 60, commentary: TODO_MIDLAND },
            { key: 'ownership', label: 'Ownership', grade: 'Strong', pct: 80, commentary: TODO_MIDLAND },
          ],
        },
        {
          key: 'financial-analysis', label: 'Financial Analysis', score: 63, grade: 'Moderate',
          factors: [
            { key: 'capitalization', label: 'Capitalization', grade: 'Moderate', pct: 58, commentary: TODO_MIDLAND },
            { key: 'funding', label: 'Funding', grade: 'Moderate', pct: 58, commentary: TODO_MIDLAND },
            { key: 'liquidity', label: 'Liquidity', grade: 'Strong', pct: 85, commentary: TODO_MIDLAND },
            { key: 'profitability', label: 'Profitability', grade: 'Moderate', pct: 53, commentary: TODO_MIDLAND },
            { key: 'asset-quality', label: 'Asset Quality', grade: 'Moderate', pct: 66, commentary: TODO_MIDLAND },
          ],
        },
      ],
    },
    economicSector: {
      score: 28, max: 50, pct: 56, grade: 'Moderate',
      factors: [
        { key: 'economic', label: 'Economic Outlook', grade: 'Moderate', pct: 60, commentary: TODO_MIDLAND },
        { key: 'monetary', label: 'Monetary Policy Outlook', grade: 'Moderate', pct: 60, commentary: TODO_MIDLAND },
        { key: 'sector', label: 'Operating Sector Outlook', grade: 'Moderate', pct: 60, commentary: TODO_MIDLAND },
        { key: 'sub-sector', label: 'Sub-operating Sector Outlook', grade: 'Weak', pct: 40, commentary: TODO_MIDLAND },
      ],
    },
  },
};

// ── Covenant actual series ───────────────────────────────────────────────────
// Periods carry an `asOf` so a scheduled threshold resolves to the one in force
// at that period. 3Q FY26 = quarter ended Dec 2025.

const P = { fy22: '2022-03', fy23: '2023-03', fy24: '2024-03', fy25: '2025-03', q3fy26: '2025-12' };

// Avanti — §K2 financials FY22→3Q26
const AV_CAR = [
  { period: 'FY24', value: 20.15, asOf: P.fy24 },
  { period: 'FY25', value: 26.72, asOf: P.fy25 },
  { period: '3Q26', value: 31.05, asOf: P.q3fy26 },
];
const AV_NETWORTH = [
  { period: 'FY22', value: 144.09, asOf: P.fy22 },
  { period: 'FY23', value: 263.56, asOf: P.fy23 },
  { period: 'FY24', value: 260.31, asOf: P.fy24 },
  { period: 'FY25', value: 310.20, asOf: P.fy25 },
  { period: '3Q26', value: 291.55, asOf: P.q3fy26 },
];
const AV_LEVERAGE = [
  { period: 'FY22', value: 1.83, asOf: P.fy22 },
  { period: 'FY23', value: 1.87, asOf: P.fy23 },
  { period: 'FY24', value: 3.78, asOf: P.fy24 },
  { period: 'FY25', value: 2.71, asOf: P.fy25 },
  { period: '3Q26', value: 1.86, asOf: P.q3fy26 },
];
const AV_GNPA = [
  { period: 'FY23', value: 12.01, asOf: P.fy23 },
  { period: 'FY24', value: 2.78, asOf: P.fy24 },
  { period: 'FY25', value: 4.39, asOf: P.fy25 },
  { period: '3Q26', value: 1.39, asOf: P.q3fy26 },
];
const AV_NNPA = [
  { period: 'FY23', value: 0.05, asOf: P.fy23 },
  { period: 'FY24', value: 1.33, asOf: P.fy24 },
  { period: 'FY25', value: 1.27, asOf: P.fy25 },
  { period: '3Q26', value: 0.53, asOf: P.q3fy26 },
];

// Keertana — §K3 financials. FY22 is omitted from covenant trends: the entity was
// pre-operational (AUM ₹1.88 cr, net worth ₹2.74 cr, CAR 145.35%), so its ratios
// are not meaningful against a covenant written in FY25.
const KE_LEVERAGE = [
  { period: 'FY23', value: 2.91, asOf: P.fy23 },
  { period: 'FY24', value: 3.42, asOf: P.fy24 },
  { period: 'FY25', value: 3.36, asOf: P.fy25 },
  { period: '3Q26', value: 3.86, asOf: P.q3fy26 },
];
const KE_CAR = [
  { period: 'FY23', value: 26.36, asOf: P.fy23 },
  { period: 'FY24', value: 23.63, asOf: P.fy24 },
  { period: 'FY25', value: 25.12, asOf: P.fy25 },
  { period: '3Q26', value: 26.21, asOf: P.q3fy26 },
];
const KE_NETWORTH = [
  { period: 'FY23', value: 174.29, asOf: P.fy23 },
  { period: 'FY24', value: 387.63, asOf: P.fy24 },
  { period: 'FY25', value: 596.29, asOf: P.fy25 },
  { period: '3Q26', value: 770.97, asOf: P.q3fy26 },
];
const KE_GNPA = [
  { period: 'FY23', value: 0.01, asOf: P.fy23 },
  { period: 'FY24', value: 0.07, asOf: P.fy24 },
  { period: 'FY25', value: 0.97, asOf: P.fy25 },
  { period: '3Q26', value: 1.38, asOf: P.q3fy26 },
];

const KID_CLAUSE = 'KID · financial covenants';

// ── Avanti — primary ISIN INE0BNQ07154 (§K2) ─────────────────────────────────

const avantiCovenants: Covenant[] = [
  {
    id: 'av-nrjn', isin: 'INE0BNQ07154', name: 'Promoter holding & board presence',
    category: 'affirmative',
    conditions: [{
      metric: 'NRJN Trust holding (fully diluted)', op: 'gte', unit: '%', threshold: 26,
      actuals: [{ period: '3Q26', value: 43, asOf: P.q3fy26 }],
    }],
    statusText: 'Held ~43% fully diluted and represented on the Board — compliant.',
    compliant: true,
    qualityGrade: 'Strong',
    qualityNote: 'A tight, well-drafted covenant: it locks in the single credit support the external rating centrally factors in. Breach is structural rather than financial, so it cannot be cured by a good quarter.',
    sourceClause: 'KID · affirmative covenants',
  },
  {
    id: 'av-car-nw', isin: 'INE0BNQ07154', name: 'Capital adequacy & net worth',
    category: 'financial',
    conditions: [
      { metric: 'Total CAR', op: 'gte', unit: '%', threshold: 17, actuals: AV_CAR },
      { metric: 'Net worth', op: 'gte', unit: '₹ cr', threshold: 200, actuals: AV_NETWORTH },
    ],
    qualityGrade: 'Moderate',
    qualityNote: 'Both limbs must hold. The 17% CAR floor sits only modestly above the regulatory minimum, and the ₹200 cr net-worth floor is well below current net worth — protective, but not demanding.',
    sourceClause: KID_CLAUSE,
    consequence: 'Penal interest of +1% if a financial covenant is unremedied beyond 60 days.',
  },
  {
    id: 'av-alm', isin: 'INE0BNQ07154', name: 'Asset-liability management',
    category: 'affirmative',
    conditions: [],
    statusText: 'No cumulative ALM shortfall up to one year; one month of liability liquidity maintained — compliant.',
    compliant: true,
    qualityGrade: 'Strong',
    qualityNote: 'A structural liquidity guardrail. It binds continuously rather than at a test date, which is what makes it protective for a wholesale-funded lender.',
    sourceClause: 'KID · affirmative covenants',
  },
  {
    id: 'av-par', isin: 'INE0BNQ07154', name: 'Portfolio at risk',
    category: 'financial',
    conditions: [
      {
        metric: '90+ PAR (on + off book)', op: 'lte', unit: '%', threshold: 8,
        schedule: [{ effectiveFrom: '2026-06', threshold: 6, label: "from Jun'26" }],
        actuals: [{ period: '3Q26', value: 1.39, asOf: P.q3fy26 }],
        indicative: true,
        indicativeNote: 'Proxied by on-book GNPA (1.39%). The issuer does not disclose combined on + off book PAR, so this reads as indicative rather than a tested position.',
      },
      {
        metric: 'PAR 30', op: 'lte', unit: '%', threshold: 15,
        actuals: [],
        indicative: true,
        indicativeNote: 'No PAR 30 disclosure available — not monitorable from published data.',
      },
    ],
    qualityGrade: 'Weak',
    qualityNote: 'Loose thresholds set far above where the book actually runs, so headroom is large and the covenant is unlikely to bind before real distress. Weak protection despite the comfortable-looking buffer.',
    sourceClause: KID_CLAUSE,
  },
  {
    id: 'av-npa', isin: 'INE0BNQ07154', name: 'Asset quality (GNPA / NNPA)',
    category: 'financial',
    conditions: [
      {
        metric: 'GNPA', op: 'lte', unit: '%', threshold: 8,
        schedule: [
          { effectiveFrom: '2026-06', threshold: 7, label: "from Jun'26" },
          { effectiveFrom: '2026-09', threshold: 6, label: "from Sep'26" },
        ],
        actuals: AV_GNPA,
      },
      {
        metric: 'NNPA', op: 'lte', unit: '%', threshold: 2.5,
        schedule: [{ effectiveFrom: '2026-06', threshold: 2, label: "from Jun'26" }],
        actuals: AV_NNPA,
      },
    ],
    qualityGrade: 'Weak',
    qualityNote: 'The step-down schedule (8% → 7% → 6%) tightens over FY27, which is the protective feature. The absolute levels remain far above the current book, so it binds late.',
    sourceClause: KID_CLAUSE,
    consequence: 'Penal interest of +1% if unremedied beyond 60 days.',
  },
  {
    id: 'av-nnpa-nw', isin: 'INE0BNQ07154', name: 'NNPA / tangible net worth',
    category: 'financial',
    conditions: [{
      metric: 'NNPA / Tangible net worth', op: 'lte', unit: '%', threshold: 12.5,
      schedule: [{ effectiveFrom: '2026-06', threshold: 10, label: "from Jun'26" }],
      actuals: [{ period: '3Q26', value: 1.16, asOf: P.q3fy26 }],
    }],
    qualityGrade: 'Weak',
    qualityNote: 'Measures net stress against loss-absorbing capital — the right shape of test, but pitched an order of magnitude above the current 1.16%.',
    sourceClause: KID_CLAUSE,
  },
  {
    id: 'av-gearing', isin: 'INE0BNQ07154', name: 'Gearing',
    category: 'financial',
    conditions: [{ metric: 'Total debt / net worth', op: 'lte', unit: 'x', threshold: 4.5, actuals: AV_LEVERAGE }],
    qualityGrade: 'Weak',
    qualityNote: 'A 4.5x ceiling against 1.86x actual leaves room to more than double the balance sheet before the covenant bites.',
    sourceClause: KID_CLAUSE,
  },
  {
    id: 'av-rating', isin: 'INE0BNQ07154', name: 'Minimum external rating',
    category: 'status',
    conditions: [],
    statusText: 'Rated BBB (Crisil) — one notch above the BBB- floor. Compliant, with limited room.',
    compliant: true,
    qualityGrade: 'Moderate',
    qualityNote: 'Consequential rather than preventative: it does not stop deterioration, it accelerates repayment once deterioration is recognised. Only one notch of room remains.',
    sourceClause: 'KID · status covenants',
    consequence: 'A downgrade below BBB- triggers mandatory redemption within 15 days.',
  },
];

const avantiPrimary: IsinAssessment = {
  isin: 'INE0BNQ07154', issuerId: 'avanti', sector: 'mfi', assessed: true,
  coupon: 11.15, couponFrequency: 'Monthly', ytmIssue: 11.74, ytmCurrent: 13.75,
  allotment: '26 Dec 2025', maturity: '30 Jun 2027', residualTenor: '406 days (as at 20 May 2026)',
  faceValue: 100000, faceValueLabel: '₹1,00,000', issueSize: 25,
  ranking: 'Senior secured', secured: true, seniority: 'senior', listing: 'Listed',
  externalRating: 'BBB (Crisil)', status: 'active',
  principalRepayment: "Quarterly principal from Jun'26",
  structuralClauses: [
    'Coupon steps up 0.25% per notch on a downgrade below BBB',
    'A downgrade below BBB- triggers mandatory redemption within 15 days',
    'Penal interest +2% on listing delay',
    'Penal interest +2% on payment default',
    'Penal interest +1% on a financial-covenant breach unremedied beyond 60 days',
    'Penal interest +2% on failure to maintain security cover',
  ],
  issuance: {
    score: 72, grade: 'Strong',
    factors: [
      { key: 'product-offering', label: 'Product Offering', grade: 'Strong', pct: 80, commentary: 'Senior secured, listed, rated NCD with monthly coupon and quarterly amortisation — a conventional, investor-friendly structure.' },
      { key: 'market-liquidity', label: 'Market Liquidity', grade: 'Weak', pct: 40, commentary: 'A ₹25 cr issue at ₹1,00,000 face value trades rarely; exit before maturity should not be assumed.' },
      { key: 'financial-covenants', label: 'Financial Covenants', grade: 'Extremely Strong', pct: 100, commentary: 'An unusually complete package — promoter-holding floor, capital, ALM, asset-quality step-downs, gearing and a rating floor with a redemption trigger.' },
      { key: 'collateral', label: 'Collateral', grade: 'Moderate', pct: 60, commentary: 'Cover of 1.10x is maintained, but the underlying receivables are unsecured microfinance loans, so cover quality is only as good as the book.' },
      { key: 'peer-comparison', label: 'Peer Comparison', grade: 'Weak', pct: 40, commentary: 'Smaller and lower-rated than the MFI issuers it competes with for the same investor rupee.' },
    ],
    covenants: avantiCovenants,
    collateral: {
      securityCover: 1.10, grade: 'Moderate',
      note: 'Cover of 1.10x over an unsecured microfinance receivable pool. The cover ratio is conventional; the weakness is the underlying, which carries no security of its own.',
      selectionCriteria: [
        'Not more than 30 days past due',
        'Unencumbered receivables only',
        'Ticket size between ₹20,000 and ₹2,00,000',
        "Single-state concentration capped at 25% from Mar'26",
        'Pool replenished within 30 days if cover falls below 1.10x',
      ],
    },
    testing: "Tested quarterly, first test Mar'26. Compliance reported within 45 days of quarter end; a breach is counted 30 days after the test date.",
  },
  pricing: {
    score: 105, grade: 'Strong',
    ytm: 13.75, gsec: 5.76, creditRiskPremium: 8.00,
    benchmarkRange: [5.45, 8.65], internalRange: [3.66, 7.76], peerRange: [7.32, 9.47], recentRange: [12.89, 14.83],
    factors: [
      { key: 'benchmark', label: 'Benchmark Credit Risk Premium', grade: 'Strong', commentary: 'The 8.00% premium sits at the upper end of the 5.45–8.65% benchmark band — investors are paid above the mid-point for this risk.', range: [5.45, 8.65] },
      { key: 'internal', label: 'Internal Assessment', grade: 'Extremely Strong', commentary: 'The premium is above the 3.66–7.76% band the internal assessment would require — priced generously against our own read.', range: [3.66, 7.76] },
      { key: 'forward', label: 'Forward-Looking Approach', grade: 'Extremely Strong', commentary: 'Around 50 bps of additional cushion is embedded for the forward view of the microfinance cycle.' },
      { key: 'peer', label: 'Comparable Peers', grade: 'Weak', commentary: 'Against a 7.32–9.47% peer band the premium looks rich, but the comparators are larger and better rated — the gap is compensation, not free yield.', range: [7.32, 9.47] },
      { key: 'recent', label: 'Recent Issuances', grade: 'Moderate', commentary: 'Recent comparable issuance cleared at 12.89–14.83%; this sits mid-band.', range: [12.89, 14.83] },
    ],
    recommendation: 'Buy around 13.75%',
  },
  combined: { score: 307, max: 500, pct: 61, rating: 7, label: 'BBB' },
};

// Avanti — lightly-seeded secondary ISINs (§K2 "Other ISINs"): terms only.
const avantiLight: IsinAssessment[] = [
  { isin: 'INE0BNQ07105', issuerId: 'avanti', sector: 'mfi', assessed: false, ytmCurrent: 11.46, residualTenor: '1–3m', issueSize: 50, maturity: '27 Jun 2026', status: 'active', secured: true, seniority: 'senior', faceValue: 100000, faceValueLabel: '₹1,00,000', todo: ['Not yet assessed — Issuance, Pricing and covenants pending KID review.'] },
  { isin: 'INE0BNQ07113', issuerId: 'avanti', sector: 'mfi', assessed: false, ytmCurrent: 12.25, residualTenor: '4–6m', issueSize: 25, maturity: '30 Sep 2026', status: 'active', secured: true, seniority: 'senior', faceValue: 100000, faceValueLabel: '₹1,00,000', todo: ['Not yet assessed — Issuance, Pricing and covenants pending KID review.'] },
  { isin: 'INE0BNQ07121', issuerId: 'avanti', sector: 'mfi', assessed: false, ytmCurrent: 11.56, residualTenor: '7–9m', issueSize: 50, maturity: '27 Dec 2026', status: 'active', secured: true, seniority: 'senior', faceValue: 100000, faceValueLabel: '₹1,00,000', todo: ['Not yet assessed — Issuance, Pricing and covenants pending KID review.'] },
];

// ── Keertana — primary ISIN INE0NES07220 (§K3) ───────────────────────────────

const keertanaCovenants: Covenant[] = [
  {
    id: 'ke-gearing', isin: 'INE0NES07220', name: 'Gearing',
    category: 'financial',
    conditions: [{ metric: 'Total debt / tangible net worth', op: 'lte', unit: 'x', threshold: 4.5, actuals: KE_LEVERAGE }],
    qualityGrade: 'Strong',
    qualityNote: 'The tightest covenant in the package and the one that actually binds: leverage of 3.86x against a 4.5x ceiling leaves limited room for a lender growing its book at this pace.',
    sourceClause: KID_CLAUSE,
    consequence: 'Penal interest of +2% on a covenant breach.',
  },
  {
    id: 'ke-car', isin: 'INE0NES07220', name: 'Capital adequacy',
    category: 'financial',
    conditions: [{ metric: 'Total CAR', op: 'gte', unit: '%', threshold: 20, actuals: KE_CAR }],
    qualityGrade: 'Moderate',
    qualityNote: 'A 20% floor sits meaningfully above the regulatory minimum, but comfortably below the 26.21% actual.',
    sourceClause: KID_CLAUSE,
  },
  {
    id: 'ke-nnpa-nw', isin: 'INE0NES07220', name: 'NNPA / net worth',
    category: 'financial',
    conditions: [{ metric: 'NNPA / net worth', op: 'lte', unit: '%', threshold: 10, actuals: [{ period: '3Q26', value: 2.92, asOf: P.q3fy26 }] }],
    qualityGrade: 'Weak',
    qualityNote: 'Set far above the 2.92% actual. For a gold-backed book where loss-given-default is structurally low, this test is unlikely ever to bind.',
    sourceClause: KID_CLAUSE,
  },
  {
    id: 'ke-gnpa', isin: 'INE0NES07220', name: 'Asset quality (GNPA > 90 days)',
    category: 'financial',
    conditions: [{
      metric: 'GNPA (>90 days)', op: 'lte', unit: '%', threshold: 5,
      schedule: [{ effectiveFrom: '2026-04', threshold: 3, label: 'from FY27' }],
      actuals: KE_GNPA,
    }],
    qualityGrade: 'Moderate',
    qualityNote: 'The step-down to 3% from FY27 is the protective feature: headline GNPA is rising as the legacy non-gold book seasons, so the covenant tightens into the trend rather than away from it.',
    sourceClause: KID_CLAUSE,
  },
  {
    id: 'ke-networth', isin: 'INE0NES07220', name: 'Minimum net worth',
    category: 'financial',
    conditions: [{ metric: 'Net worth', op: 'gte', unit: '₹ cr', threshold: 500, actuals: KE_NETWORTH }],
    qualityGrade: 'Moderate',
    qualityNote: 'A ₹500 cr floor against ₹771 cr actual. Net worth is compounding quickly, so the covenant is drifting further out of the money.',
    sourceClause: KID_CLAUSE,
  },
];

const keertanaPrimary: IsinAssessment = {
  isin: 'INE0NES07220', issuerId: 'keertana', sector: 'gold', assessed: true,
  coupon: 11.30, couponFrequency: 'Monthly', ytmIssue: 11.90, ytmCurrent: 14.02,
  allotment: '16 Sep 2025', maturity: '11 Apr 2027', residualTenor: '374 days (as at 2 Apr 2026)',
  faceValue: 100000, faceValueLabel: '₹1,00,000', issueSize: 65,
  ranking: 'Senior secured', secured: true, seniority: 'senior', listing: 'Listed',
  externalRating: 'BBB+ (India Ratings)', status: 'active',
  principalRepayment: 'Quarterly principal',
  marketLiquidityNote: "Last ten trades were in Dec'25 at a YTM of 13.60–14.41% (average 13.93%).",
  structuralClauses: [
    'No coupon step-up or step-down',
    'Penal interest +2% on a covenant breach',
    'Penal interest +1% on a listing delay beyond 3 days',
    'Penal interest +2% on delay in trust-deed execution',
    'Penal interest +2% on delay in security creation',
    'Penal interest +2% on payment default',
  ],
  issuance: {
    score: 76, grade: 'Strong',
    factors: [
      { key: 'product-offering', label: 'Product Offering', grade: 'Strong', pct: 80, commentary: 'Senior secured, listed, rated NCD with a ₹40 cr green-shoe and monthly coupon — a clean structure with quarterly amortisation.' },
      { key: 'market-liquidity', label: 'Market Liquidity', grade: 'Moderate', pct: 60, commentary: "Traded as recently as Dec'25 across ten trades at 13.60–14.41%, which is more secondary activity than most issues of this size see." },
      { key: 'financial-covenants', label: 'Financial Covenants', grade: 'Strong', pct: 80, commentary: 'Five financial covenants with a gearing ceiling that genuinely binds and a GNPA step-down into FY27.' },
      { key: 'collateral', label: 'Collateral', grade: 'Strong', pct: 80, commentary: 'Cover of 1.10x over gold receivables — liquid, short-tenor collateral with tight pool-selection criteria.' },
      { key: 'peer-comparison', label: 'Peer Comparison', grade: 'Moderate', pct: 60, commentary: 'Smaller than the listed gold majors, but the secured book narrows the gap versus similarly-rated names.' },
    ],
    covenants: keertanaCovenants,
    collateral: {
      securityCover: 1.10, grade: 'Strong',
      note: 'Cover of 1.10x over a gold-loan receivable pool. Unlike an unsecured pool, the underlying is itself secured on liquid collateral at conservative LTVs, so cover quality is materially better than the ratio alone suggests.',
      selectionCriteria: [
        'Zero days past due',
        'Originating branch GNPA below 5%',
        'Gold loan value not exceeding ₹5,00,000',
        'Tenure not exceeding 12 months',
        'Not disbursed in cash above ₹20,000',
      ],
    },
    testing: 'Tested quarterly against reported financials; penal interest applies on breach.',
  },
  pricing: {
    score: 150, grade: 'Extremely Strong',
    ytm: 14.02, gsec: 5.77, creditRiskPremium: 8.25,
    benchmarkRange: [5.83, 8.23], internalRange: [5.91, 8.18], peerRange: [6.25, 8.25], recentRange: [12.5, 14.02],
    factors: [
      { key: 'benchmark', label: 'Benchmark Credit Risk Premium', grade: 'Extremely Strong', commentary: 'The 8.25% premium sits above the entire 5.83–8.23% benchmark band.', range: [5.83, 8.23] },
      { key: 'internal', label: 'Internal Assessment', grade: 'Extremely Strong', commentary: 'Above the 5.91–8.18% band the internal assessment requires — the instrument pays more than our own read demands.', range: [5.91, 8.18] },
      { key: 'forward', label: 'Forward-Looking Approach', grade: 'Extremely Strong', commentary: 'Around 25 bps of cushion for the forward view, on top of an already generous premium.' },
      { key: 'peer', label: 'Comparable Peers', grade: 'Extremely Strong', commentary: 'At the upper end of the 6.25–8.25% peer band despite a secured, gold-backed book.', range: [6.25, 8.25] },
      { key: 'recent', label: 'Recent Issuances', grade: 'Extremely Strong', commentary: 'The best yield in the 12.5–14.02% recent-issuance range.', range: [12.5, 14.02] },
    ],
    recommendation: 'Subscribe around 14.02%',
  },
  combined: { score: 368, max: 500, pct: 74, rating: 5, label: 'BBB+' },
};

// ── Keertana — second ISIN INE0NES07162 (§K4, ILLUSTRATIVE) ──────────────────
// The ISIN and its current YTM (12.50%) are real; every other term, covenant,
// collateral and pricing grade below is FABRICATED for the demo. Same issuer, so
// Fundamental (110/200) and Economic (0.32/0.50) are shared and identical to the
// primary — only Issuance and Pricing differ. This is the ISIN-vs-ISIN showcase.

const keertanaIllustrativeCovenants: Covenant[] = [
  {
    id: 'ke2-gearing', isin: 'INE0NES07162', name: 'Gearing',
    category: 'financial',
    conditions: [{ metric: 'Total debt / tangible net worth', op: 'lte', unit: 'x', threshold: 5.0, actuals: KE_LEVERAGE }],
    qualityGrade: 'Weak',
    qualityNote: 'A 5.0x ceiling versus the primary ISIN\'s 4.5x. More headroom for the investor to look at, less protection actually purchased.',
    sourceClause: KID_CLAUSE,
  },
  {
    id: 'ke2-car', isin: 'INE0NES07162', name: 'Capital adequacy',
    category: 'financial',
    conditions: [{ metric: 'Total CAR', op: 'gte', unit: '%', threshold: 18, actuals: KE_CAR }],
    qualityGrade: 'Weak',
    qualityNote: 'An 18% floor barely clears the regulatory minimum for this class of lender.',
    sourceClause: KID_CLAUSE,
  },
  {
    id: 'ke2-nnpa-nw', isin: 'INE0NES07162', name: 'NNPA / net worth',
    category: 'financial',
    conditions: [{ metric: 'NNPA / net worth', op: 'lte', unit: '%', threshold: 12, actuals: [{ period: '3Q26', value: 2.92, asOf: P.q3fy26 }] }],
    qualityGrade: 'Weak',
    qualityNote: 'Pitched even further above the actual than the primary ISIN\'s 10% test.',
    sourceClause: KID_CLAUSE,
  },
  {
    id: 'ke2-gnpa', isin: 'INE0NES07162', name: 'Asset quality (GNPA > 90 days)',
    category: 'financial',
    conditions: [{
      metric: 'GNPA (>90 days)', op: 'lte', unit: '%', threshold: 6,
      schedule: [{ effectiveFrom: '2026-04', threshold: 4, label: 'from FY27' }],
      actuals: KE_GNPA,
    }],
    qualityGrade: 'Weak',
    qualityNote: 'Steps down like the primary, but from a looser base (6% → 4% rather than 5% → 3%).',
    sourceClause: KID_CLAUSE,
  },
  {
    id: 'ke2-networth', isin: 'INE0NES07162', name: 'Minimum net worth',
    category: 'financial',
    conditions: [{ metric: 'Net worth', op: 'gte', unit: '₹ cr', threshold: 400, actuals: KE_NETWORTH }],
    qualityGrade: 'Weak',
    qualityNote: 'A ₹400 cr floor against ₹771 cr actual — comfortably out of the money.',
    sourceClause: KID_CLAUSE,
  },
  {
    id: 'ke2-cover', isin: 'INE0NES07162', name: 'Security cover',
    category: 'financial',
    conditions: [{ metric: 'Security cover', op: 'gte', unit: 'x', threshold: 1.15, actuals: [{ period: '3Q26', value: 1.18, asOf: P.q3fy26 }] }],
    qualityGrade: 'Strong',
    qualityNote: 'The one covenant tighter than the primary ISIN: a 1.15x cover floor with only 0.03x of headroom. Tight covenants and small buffers are what protection actually looks like.',
    sourceClause: KID_CLAUSE,
  },
];

const keertanaIllustrative: IsinAssessment = {
  isin: 'INE0NES07162', issuerId: 'keertana', sector: 'gold', assessed: true, illustrative: true,
  coupon: 10.75, couponFrequency: 'Monthly', ytmIssue: 11.20, ytmCurrent: 12.50,
  maturity: '06 Mar 2027', residualTenor: '~11 months',
  faceValue: 100000, faceValueLabel: '₹1,00,000', issueSize: 100,
  ranking: 'Senior secured', secured: true, seniority: 'senior', listing: 'Listed',
  externalRating: 'BBB+ (India Ratings)', status: 'active',
  principalRepayment: 'Quarterly principal',
  issuance: {
    score: 70, grade: 'Strong',
    factors: [
      { key: 'product-offering', label: 'Product Offering', grade: 'Strong', pct: 80, commentary: 'Senior secured, listed, rated NCD with monthly coupon and quarterly amortisation.' },
      { key: 'market-liquidity', label: 'Market Liquidity', grade: 'Weak', pct: 40, commentary: 'Thinly traded relative to the primary issue.' },
      { key: 'financial-covenants', label: 'Financial Covenants', grade: 'Moderate', pct: 60, commentary: 'A looser package than the primary ISIN across gearing, capital and asset quality — offset by a tight security-cover floor.' },
      { key: 'collateral', label: 'Collateral', grade: 'Strong', pct: 80, commentary: 'Cover of 1.15x over the same gold-loan pool, on the same selection criteria as the primary.' },
      { key: 'peer-comparison', label: 'Peer Comparison', grade: 'Moderate', pct: 60, commentary: 'Comparable to similarly-rated gold lenders.' },
    ],
    covenants: keertanaIllustrativeCovenants,
    collateral: {
      securityCover: 1.15, grade: 'Strong',
      note: 'Cover of 1.15x over the same gold-loan receivable pool as the primary ISIN, and a covenanted floor at that level.',
      selectionCriteria: [
        'Zero days past due',
        'Originating branch GNPA below 5%',
        'Gold loan value not exceeding ₹5,00,000',
        'Tenure not exceeding 12 months',
        'Not disbursed in cash above ₹20,000',
      ],
    },
    testing: 'Tested quarterly against reported financials.',
  },
  pricing: {
    score: 105, grade: 'Strong',
    ytm: 12.50, gsec: 5.77, creditRiskPremium: 6.73,
    benchmarkRange: [5.83, 8.23], internalRange: [5.91, 8.18], peerRange: [6.25, 8.25], recentRange: [12.5, 14.02],
    factors: [
      { key: 'benchmark', label: 'Benchmark Credit Risk Premium', grade: 'Strong', commentary: 'The 6.73% premium sits mid-band against 5.83–8.23% — adequate, not generous.', range: [5.83, 8.23] },
      { key: 'internal', label: 'Internal Assessment', grade: 'Strong', commentary: 'Mid-band against the 5.91–8.18% internal requirement.', range: [5.91, 8.18] },
      { key: 'forward', label: 'Forward-Looking Approach', grade: 'Strong', commentary: 'Around 25 bps of forward cushion.' },
      { key: 'peer', label: 'Comparable Peers', grade: 'Weak', commentary: 'At the lower end of the 6.25–8.25% peer band — this instrument pays less than its peers for the same issuer risk.', range: [6.25, 8.25] },
      { key: 'recent', label: 'Recent Issuances', grade: 'Weak', commentary: 'The bottom of the 12.5–14.02% recent-issuance range.', range: [12.5, 14.02] },
    ],
    recommendation: 'Accumulate around 12.50%',
  },
  combined: { score: 317, max: 500, pct: 63, rating: 7, label: 'BBB+' },
  todo: ['Illustrative — terms, covenants, collateral and pricing grades are fabricated for the demo. Only the ISIN and its current YTM (12.50%) are real.'],
};

// ── Midland — own ISIN INE884Q07798 (§K1) ────────────────────────────────────
// The PDF's ISIN header, Pricing section and covenant table are Avanti's (the
// report is templated) — so terms, pricing factors and covenants are stubbed
// pending Midland's own KID rather than carried across from Avanti.

const midlandIsin: IsinAssessment = {
  isin: 'INE884Q07798', issuerId: 'midland', sector: 'mfi', assessed: true,
  ytmCurrent: 12.25, residualTenor: '19–24m', maturity: '30 Sep 2027',
  externalRating: 'A — TODO: conflicting sources', status: 'active',
  issuance: {
    score: 72, grade: 'Strong',
    factors: [],
    covenants: [],
    collateral: {
      grade: 'Moderate',
      note: `${TODO_MIDLAND} — the collateral section in the source report is templated from Avanti and does not describe this issue.`,
      selectionCriteria: [],
    },
  },
  pricing: {
    score: 105, grade: 'Strong',
    ytm: 12.25,
    factors: [],
    recommendation: undefined,
  },
  combined: { score: 307, max: 500, pct: 61, rating: 7, label: 'BBB+' },
  todo: [
    `${TODO_MIDLAND} — Issuance factors, Pricing factors and the covenant table are templated from Avanti in the source report and are not Midland's. Re-seed from Midland's own KID.`,
    "Midland's external rating is inconsistent across sources (A-/Negative from Acuité vs BBB/Stable from Crisil); the ISIN reference table shows A. Needs resolution.",
    'Combined (3.07/5.00) is carried from the templated rating scale and does not equal the sum of its components (3.19). Authored as printed — confirm against Midland\'s own scale.',
  ],
};

// ── Registry ─────────────────────────────────────────────────────────────────

export const isins: IsinAssessment[] = [
  midlandIsin,
  avantiPrimary,
  ...avantiLight,
  keertanaPrimary,
  keertanaIllustrative,
];

/** Issuers that deliberately stay issuer-only (KrazyBee, Spandana) — no authored ISINs. */
const issuerOnlyIds = (): string[] =>
  Object.keys(reports).filter(id => !isins.some(i => i.issuerId === id));

// ── Issuer-level (shared) scores ─────────────────────────────────────────────

const eq = (a: string, b: string) => a.toUpperCase() === b.toUpperCase();

/** Fundamental Score (/200) — issuer-level, identical across the issuer's ISINs. */
export const getIssuerFundamental = (issuerId: string): { score: number; max: number; pct: number; pillars: Pillar[] } | undefined => {
  const report = getReport(issuerId);
  if (report) {
    const iss = getScaledScore(report).components.find(c => c.key === 'issuer')!;
    const pillars: Pillar[] = report.scorecard
      .filter(p => p.name === 'Business & Management' || p.name === 'Financial Analysis')
      .map(p => ({
        key: p.name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''),
        label: p.name,
        score: p.pct,
        grade: p.grade,
        factors: p.factors.map(f => ({
          key: f.name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''),
          label: f.name,
          grade: f.grade,
          pct: f.pct,
          commentary: report.qualitative.find(q => q.factor === f.name)?.commentary ?? '',
        })),
      }));
    return { score: iss.score, max: iss.max, pct: iss.pct, pillars };
  }
  const authored = AUTHORED_FUNDAMENTAL[issuerId];
  return authored ? { ...authored.fundamental } : undefined;
};

/** Economic & Sector (/50) — issuer-level, shared. */
export const getIssuerEconomic = (issuerId: string): { score: number; max: number; pct: number; grade: Grade; factors: FactorScore[] } | undefined => {
  const report = getReport(issuerId);
  if (report) {
    const econ = getScaledScore(report).components.find(c => c.key === 'economic')!;
    const pillar = report.scorecard.find(p => p.name === 'Economic & Sector Outlook');
    return {
      score: econ.score, max: econ.max, pct: econ.pct, grade: pillar?.grade ?? econ.grade,
      factors: (pillar?.factors ?? []).map(f => ({
        key: f.name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''),
        label: f.name, grade: f.grade, pct: f.pct, commentary: '',
      })),
    };
  }
  const authored = AUTHORED_FUNDAMENTAL[issuerId];
  return authored ? { ...authored.economicSector } : undefined;
};

// ── Implicit ISIN (issuer-only entities) ─────────────────────────────────────

/**
 * Synthesizes a single ISIN for an issuer that has no authored `isins[]`, from data
 * already in its report. Nothing is invented: terms come from the report's current
 * issuance structure and scores from `getScaledScore`.
 */
export const getImplicitIsin = (issuerId: string): IsinAssessment | undefined => {
  const report = getReport(issuerId);
  if (!report) return undefined;
  const s = report.issuanceStructures.find(x => x.current) ?? report.issuanceStructures[0];
  if (!s) return undefined;

  const scaled = getScaledScore(report);
  const comp = (k: 'issuance' | 'pricing') => scaled.components.find(c => c.key === k)!;
  const pillarFactors = (name: string): FactorScore[] =>
    (report.scorecard.find(p => p.name === name)?.factors ?? []).map(f => ({
      key: f.name.toLowerCase().replace(/[^a-z]+/g, '-').replace(/^-|-$/g, ''),
      label: f.name, grade: f.grade, pct: f.pct, commentary: '',
    }));

  const y = report.yieldOverview;
  return {
    isin: s.isin, issuerId, sector: report.subSectorKey, implicit: true, assessed: true,
    coupon: s.coupon, couponFrequency: s.couponFrequency, ytmIssue: s.originalYtm, ytmCurrent: s.currentYtm,
    allotment: s.allotmentDate, maturity: s.maturity, residualTenor: `${s.residualDays} days`,
    faceValue: s.faceValue, faceValueLabel: s.faceValueLabel, issueSize: s.issueSize,
    ranking: s.ranking, secured: /secured/i.test(s.ranking), seniority: /subordinat/i.test(s.ranking) ? 'subordinated' : 'senior',
    listing: report.listing?.listed ? report.listing.exchanges : 'Listed',
    externalRating: report.externalRating.rating, status: 'active',
    structuralClauses: [s.stepClause, s.redemptionTrigger].filter(c => c && c !== 'None'),
    issuance: {
      score: comp('issuance').score, grade: comp('issuance').grade,
      factors: pillarFactors('Issuance Assessment'),
      // The legacy report models covenants without conditions/actuals, so they are
      // carried as authored status rows rather than monitorable conditions.
      covenants: report.covenants.map((c, i) => ({
        id: `${issuerId}-legacy-${i}`, isin: s.isin, name: c.covenant,
        category: 'status' as const, conditions: [],
        statusText: `${c.value} — ${c.commentary}`,
        qualityGrade: c.grade, qualityNote: c.commentary,
        sourceClause: KID_CLAUSE,
      })),
      collateral: { securityCover: parseFloat(s.securityCover) || undefined, grade: 'Moderate', note: `Security cover ${s.securityCover}.`, selectionCriteria: [] },
    },
    pricing: {
      score: comp('pricing').score, grade: comp('pricing').grade,
      ytm: y.currentYtm, gsec: y.gsecBase, creditRiskPremium: y.creditRiskPremium,
      peerRange: [y.rangeLow, y.rangeHigh],
      factors: (report.scorecard.find(p => p.name === 'Pricing')?.factors ?? []).map(f => ({
        key: 'benchmark' as const, label: f.name, grade: f.grade, commentary: '',
      })),
    },
    combined: { score: scaled.score, max: 500, pct: scaled.pct, rating: scaled.rating },
    todo: ['Issuer-only coverage — a single implicit ISIN synthesized from the issuer report. Author real per-ISIN coverage to unlock ISIN-level comparison.'],
  };
};

// ── Public helpers ───────────────────────────────────────────────────────────

export const getIsinsForIssuer = (issuerId: string): IsinAssessment[] => {
  const authored = isins.filter(i => i.issuerId === issuerId);
  if (authored.length) return authored;
  const implicit = getImplicitIsin(issuerId);
  return implicit ? [implicit] : [];
};

export const getIsinAssessment = (isin: string): IsinAssessment | undefined => {
  const authored = isins.find(i => eq(i.isin, isin));
  if (authored) return authored;
  for (const id of issuerOnlyIds()) {
    const implicit = getImplicitIsin(id);
    if (implicit && eq(implicit.isin, isin)) return implicit;
  }
  return undefined;
};

export interface IsinScore {
  /** Issuer-level, shared across the issuer's ISINs. */
  fundamental: number;
  /** ISIN-specific. */
  issuance: number;
  /** ISIN-specific. */
  pricing: number;
  /** Issuer-level, shared. */
  economic: number;
  /** Authored roll-up — not the sum of the parts. */
  total: number;
  pct: number;
  rating: number;
}

/**
 * The four assessments plus the authored roll-up for an ISIN.
 * Returns undefined for a lightly-seeded ISIN that has not been assessed.
 */
export const getIsinScore = (isin: string): IsinScore | undefined => {
  const a = getIsinAssessment(isin);
  if (!a || !a.issuance || !a.pricing || !a.combined) return undefined;
  const f = getIssuerFundamental(a.issuerId);
  const e = getIssuerEconomic(a.issuerId);
  if (!f || !e) return undefined;
  return {
    fundamental: f.score,
    issuance: a.issuance.score,
    pricing: a.pricing.score,
    economic: e.score,
    total: a.combined.score,
    pct: a.combined.pct,
    rating: a.combined.rating,
  };
};

/** Every ISIN the platform can route to, authored + implicit — powers ISIN search. */
export const allIsins = (): IsinAssessment[] => [
  ...isins,
  ...issuerOnlyIds().map(id => getImplicitIsin(id)).filter((x): x is IsinAssessment => !!x),
];

// ── View adapters ────────────────────────────────────────────────────────────
// Shape the ISIN layer into the structures the existing components already take,
// so `ScoreComposition` / `FactorHeatmap` are reused rather than reimplemented.
// Pure mapping — no scoring.

const PRICING_MAX = 150;

/** The four Total Score bars for an ISIN: Fundamental + Economic shared, Issuance + Pricing ISIN-level. */
export const getIsinComponents = (isin: string): ComponentScore[] | undefined => {
  const a = getIsinAssessment(isin);
  if (!a || !a.issuance || !a.pricing) return undefined;
  const f = getIssuerFundamental(a.issuerId);
  const e = getIssuerEconomic(a.issuerId);
  if (!f || !e) return undefined;

  const pricingPct = Math.round((a.pricing.score / PRICING_MAX) * 100);
  return [
    { key: 'issuer', label: 'Issuer', score: f.score, max: f.max, pct: f.pct, weightPct: 40, grade: gradeForPct(f.pct), scorecardName: ['Business & Management', 'Financial Analysis'] },
    { key: 'issuance', label: 'Issuance', score: a.issuance.score, max: 100, pct: a.issuance.score, weightPct: 20, grade: a.issuance.grade, scorecardName: 'Issuance Assessment' },
    { key: 'pricing', label: 'Pricing', score: a.pricing.score, max: PRICING_MAX, pct: pricingPct, weightPct: 30, grade: a.pricing.grade, scorecardName: 'Pricing' },
    { key: 'economic', label: 'Economic & Sector', score: e.score, max: e.max, pct: e.pct, weightPct: 10, grade: e.grade, scorecardName: 'Economic & Sector Outlook' },
  ];
};

/** The five scorecard pillars behind an ISIN's Total Score — powers the drill-down. */
export const getIsinScorecard = (isin: string): ScorecardPillar[] | undefined => {
  const a = getIsinAssessment(isin);
  if (!a || !a.issuance || !a.pricing) return undefined;
  const f = getIssuerFundamental(a.issuerId);
  const e = getIssuerEconomic(a.issuerId);
  if (!f || !e) return undefined;

  return [
    ...f.pillars.map(p => ({
      name: p.label, grade: p.grade, pct: p.score,
      factors: p.factors.map(x => ({ name: x.label, grade: x.grade, pct: x.pct })),
    })),
    {
      name: 'Issuance Assessment', grade: a.issuance.grade, pct: a.issuance.score,
      factors: a.issuance.factors.map(x => ({ name: x.label, grade: x.grade, pct: x.pct })),
    },
    {
      name: 'Pricing', grade: a.pricing.grade, pct: Math.round((a.pricing.score / PRICING_MAX) * 100),
      // PricingFactor carries a grade but no pct — fall back to the grade's fixed points (§C).
      factors: a.pricing.factors.map(x => ({ name: x.label, grade: x.grade, pct: GRADE_POINTS[x.grade] })),
    },
    {
      name: 'Economic & Sector Outlook', grade: e.grade, pct: e.pct,
      factors: e.factors.map(x => ({ name: x.label, grade: x.grade, pct: x.pct })),
    },
  ];
};
