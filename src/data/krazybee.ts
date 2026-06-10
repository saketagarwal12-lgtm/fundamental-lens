import type { Grade } from './types';

export interface HealthScorePoint {
  month: string;
  score: number;
  event?: { direction: 'up' | 'down'; reason: string };
}

export const healthScoreSeries: HealthScorePoint[] = [
  { month: "Jun'25", score: 62 },
  { month: "Jul'25", score: 62 },
  { month: "Aug'25", score: 61, event: { direction: 'down', reason: "Statutory auditor (Tattavam & Co.) resigned; temporary governance caution pending replacement." } },
  { month: "Sep'25", score: 62 },
  { month: "Oct'25", score: 63, event: { direction: 'up', reason: "Asset quality strengthened — GNPA eased toward ~2% as write-offs and tighter underwriting flowed through." } },
  { month: "Nov'25", score: 63 },
  { month: "Dec'25", score: 62, event: { direction: 'down', reason: "Leverage rose to 2.40x and Total CAR eased to 23.55% as AUM growth outpaced internal capital generation." } },
  { month: "Jan'26", score: 64 },
  { month: "Feb'26", score: 64 },
  { month: "Mar'26", score: 64 },
  { month: "Apr'26", score: 67, event: { direction: 'up', reason: "Raised $280M Series E at ~$1.5B valuation (unicorn); materially strengthened capital and funding profile." } },
  { month: "May'26", score: 65 },
];

export interface ScorecardFactor {
  name: string;
  grade: Grade;
  pct: number;
}

export interface ScorecardPillar {
  name: string;
  grade: Grade;
  pct: number;
  factors: ScorecardFactor[];
}

export const scorecard: ScorecardPillar[] = [
  {
    name: 'Business & Management',
    grade: 'Moderate',
    pct: 59,
    factors: [
      { name: 'Business Model', grade: 'Weak', pct: 40 },
      { name: 'Business Position', grade: 'Strong', pct: 80 },
      { name: 'Borrower Profile', grade: 'Weak', pct: 40 },
      { name: 'Management & Governance', grade: 'Moderate', pct: 60 },
      { name: 'Ownership', grade: 'Strong', pct: 80 },
    ],
  },
  {
    name: 'Financial Analysis',
    grade: 'Strong',
    pct: 70,
    factors: [
      { name: 'Capitalization', grade: 'Moderate', pct: 66 },
      { name: 'Funding', grade: 'Strong', pct: 78 },
      { name: 'Liquidity', grade: 'Weak', pct: 50 },
      { name: 'Profitability', grade: 'Strong', pct: 72 },
      { name: 'Asset Quality', grade: 'Strong', pct: 79 },
    ],
  },
  {
    name: 'Issuance Assessment',
    grade: 'Strong',
    pct: 70,
    factors: [
      { name: 'Product Offering', grade: 'Extremely Strong', pct: 100 },
      { name: 'Market Liquidity', grade: 'Moderate', pct: 60 },
      { name: 'Financial Covenants', grade: 'Moderate', pct: 60 },
      { name: 'Collateral', grade: 'Moderate', pct: 60 },
      { name: 'Peer Comparison', grade: 'Strong', pct: 80 },
    ],
  },
  {
    name: 'Pricing',
    grade: 'Moderate',
    pct: 63,
    factors: [
      { name: 'Benchmark Credit Risk Premium', grade: 'Weak', pct: 40 },
      { name: 'Internal Assessment', grade: 'Strong', pct: 80 },
      { name: 'Forward-Looking Approach', grade: 'Moderate', pct: 60 },
      { name: 'Comparable Peers', grade: 'Strong', pct: 80 },
      { name: 'Recent Issuances', grade: 'Moderate', pct: 60 },
    ],
  },
  {
    name: 'Economic & Sector Outlook',
    grade: 'Moderate',
    pct: 56,
    factors: [
      { name: 'Economic Outlook', grade: 'Moderate', pct: 60 },
      { name: 'Monetary Policy Outlook', grade: 'Weak', pct: 40 },
      { name: 'Operating Sector Outlook', grade: 'Moderate', pct: 60 },
      { name: 'Sub-operating Sector Outlook', grade: 'Moderate', pct: 60 },
    ],
  },
];

export interface FinancialPeriodValue {
  period: string;
  value: number | null;
}

export interface FinancialMetric {
  label: string;
  unit: string;
  values: FinancialPeriodValue[];
}

export interface FinancialSection {
  grade: Grade;
  pct: number;
  metrics: FinancialMetric[];
  commentary: string;
}

export const financials: Record<string, FinancialSection> = {
  capitalization: {
    grade: 'Moderate',
    pct: 66,
    metrics: [
      { label: 'Net Worth', unit: '₹ Cr', values: [{ period: 'FY24', value: 2050 }, { period: 'FY25', value: 2356 }, { period: '3Q26', value: 2713 }] },
      { label: 'Leverage', unit: 'x', values: [{ period: 'FY24', value: 1.44 }, { period: 'FY25', value: 1.63 }, { period: '3Q26', value: 2.40 }] },
      { label: 'Total CAR', unit: '%', values: [{ period: 'FY24', value: 33.89 }, { period: 'FY25', value: 29.59 }, { period: '3Q26', value: 23.55 }] },
      { label: 'Tier I CAR', unit: '%', values: [{ period: 'FY24', value: 32.64 }, { period: 'FY25', value: 28.34 }, { period: '3Q26', value: 22.30 }] },
      { label: 'NNPA / Net Worth', unit: '%', values: [{ period: 'FY24', value: 1.52 }, { period: 'FY25', value: 1.84 }, { period: '3Q26', value: 1.24 }] },
      { label: 'Internal Capital Generation', unit: '%', values: [{ period: 'FY24', value: 9.16 }, { period: 'FY25', value: 10.04 }, { period: '3Q26', value: 20.88 }] },
    ],
    commentary: `Net worth has grown steadily through profit accumulation, ESOP exercises, and earlier equity raises, reaching ₹2,713 Cr in 3Q26. However, AUM growth has meaningfully outpaced internal capital generation, easing Total CAR from 33.89% in FY24 to 23.55% by 3Q26 and lifting leverage to 2.40x — a moderate but rising level. The comfort here is capital-raising ability: KrazyBee's institutional shareholder base and unicorn valuation (post the April 2026 Series E) materially reduce the risk of a capital gap. Tier I CAR at 22.30% continues to provide adequate buffer above regulatory minimums, though headroom is narrowing relative to growth aspirations.`,
  },
  fundingLiquidity: {
    grade: 'Strong',
    pct: 64,
    metrics: [
      { label: 'Cash & Equivalents', unit: '₹ Cr', values: [{ period: 'FY24', value: 289 }, { period: 'FY25', value: 395 }, { period: '3Q26', value: 708 }] },
      { label: 'CCE / Total Assets', unit: '%', values: [{ period: 'FY24', value: 5.72 }, { period: 'FY25', value: 6.33 }, { period: '3Q26', value: 6.77 }] },
      { label: 'Liquidity Coverage Ratio', unit: '%', values: [{ period: 'FY24', value: null }, { period: 'FY25', value: 149.7 }, { period: '3Q26', value: 135.5 }] },
      { label: 'Liabilities Due <12M', unit: '₹ Cr', values: [{ period: 'FY24', value: null }, { period: 'FY25', value: 3107 }, { period: '3Q26', value: 5438 }] },
      { label: 'CCE / <12M Liabilities', unit: '%', values: [{ period: 'FY24', value: null }, { period: 'FY25', value: 12.7 }, { period: '3Q26', value: 13.0 }] },
    ],
    commentary: `KrazyBee's funding profile is well diversified: NCDs (48%), term loans (34%), securitization, commercial paper, and WCDL constitute total funding of ₹6,144 Cr as of Dec'25. Top-10 lender concentration is low at ~19.6% of borrowings. Liquidity coverage ratio of 135.5% provides a statutory buffer, though absolute cash coverage of short-term liabilities is thin (~13%). There is no cumulative ALM shortfall up to one year. The key risk is short-term refinancing dependency given rapid AUM growth; however, lender diversification and access to capital markets offset this.`,
  },
  profitability: {
    grade: 'Strong',
    pct: 72,
    metrics: [
      { label: 'Total Operating Revenue', unit: '₹ Cr', values: [{ period: 'FY24', value: 1399 }, { period: 'FY25', value: 2186 }, { period: '3Q26', value: 805 }] },
      { label: 'NIM', unit: '%', values: [{ period: 'FY24', value: 27.37 }, { period: 'FY25', value: 22.52 }, { period: '3Q26', value: 19.34 }] },
      { label: 'Yield on Loans', unit: '%', values: [{ period: 'FY24', value: 33.86 }, { period: 'FY25', value: 29.48 }, { period: '3Q26', value: 27.65 }] },
      { label: 'Cost of Funds', unit: '%', values: [{ period: 'FY24', value: 11.66 }, { period: 'FY25', value: 11.83 }, { period: '3Q26', value: 11.67 }] },
      { label: 'ROAA', unit: '%', values: [{ period: 'FY24', value: 5.03 }, { period: 'FY25', value: 3.92 }, { period: '3Q26', value: 6.38 }] },
      { label: 'ROAE', unit: '%', values: [{ period: 'FY24', value: 11.01 }, { period: 'FY25', value: 10.04 }, { period: '3Q26', value: 20.88 }] },
      { label: 'Cost-to-Income', unit: '%', values: [{ period: 'FY24', value: 50.03 }, { period: 'FY25', value: 51.60 }, { period: '3Q26', value: 50.84 }] },
      { label: 'Cost of Risk', unit: '%', values: [{ period: 'FY24', value: 11.93 }, { period: 'FY25', value: 14.13 }, { period: '3Q26', value: 10.80 }] },
      { label: 'PAT', unit: '₹ Cr', values: [{ period: 'FY24', value: 200 }, { period: 'FY25', value: 221 }, { period: '3Q26', value: 138 }] },
    ],
    commentary: `Profitability has strengthened materially in recent quarters. 3Q26 ROAA of 6.38% and ROAE of 20.88% reflect operating leverage from scale, improved credit costs, and a high-yield unsecured book. NIM compression (yield declining from 33.86% to 27.65%; broadly stable cost of funds at ~11.7%) is expected as the portfolio matures. Cost-to-income is stable near 51%, while cost of risk has improved to 10.80% in 3Q26 from 14.13% in FY25. PAT of ₹138 Cr in 3Q26 alone approaches FY24 annual PAT, signalling a step-change in earnings power.`,
  },
  assetQuality: {
    grade: 'Strong',
    pct: 79,
    metrics: [
      { label: 'On-book AUM', unit: '₹ Cr', values: [{ period: 'FY24', value: 4824 }, { period: 'FY25', value: 5961 }, { period: '3Q26', value: 8418 }, { period: '4Q26', value: 9861 }] },
      { label: 'GNPA', unit: '%', values: [{ period: 'FY24', value: 3.05 }, { period: 'FY25', value: 3.13 }, { period: '3Q26', value: 1.79 }, { period: '4Q26', value: 1.53 }] },
      { label: 'NNPA', unit: '%', values: [{ period: 'FY24', value: 0.86 }, { period: 'FY25', value: 0.80 }, { period: '3Q26', value: 0.44 }, { period: '4Q26', value: 0.14 }] },
      { label: 'Write-offs', unit: '%', values: [{ period: 'FY24', value: 7.43 }, { period: 'FY25', value: 10.54 }, { period: '3Q26', value: null }] },
      { label: 'NPA Coverage', unit: '%', values: [{ period: 'FY24', value: 232 }, { period: 'FY25', value: 185 }, { period: '3Q26', value: null }] },
    ],
    commentary: `Asset quality is the standout positive in recent periods. GNPA has declined sharply from 3.13% in FY25 to 1.53% by 4Q26, reflecting tighter underwriting models, improved collections, and portfolio seasoning. NNPA of 0.14% by 4Q26 is exceptionally low for an unsecured lender. The portfolio is highly granular — 94% of AUM under ₹5 lakh ticket — which limits single-name concentration risk. The structural risk remains: 97% of the book is unsecured, making it vulnerable to income shocks and regulatory changes in digital lending.`,
  },
};

export const qualitativeMetrics = [
  {
    factor: 'Business Model',
    pillar: 'Business & Management',
    grade: 'Weak' as Grade,
    pct: 40,
    commentary: `KrazyBee operates a digital-first unsecured personal lending model through the KreditBee application, offering personal loans to salaried and self-employed individuals, predominantly in the ₹1,000–₹5 lakh ticket range. The company also participates in co-lending arrangements with banks. The model is technology-led: proprietary credit algorithms, automated KYC, and app-based disbursements drive operational efficiency and allow rapid scale. However, the credit model's ability to manage underwriting through full economic cycles is still evolving. The unsecured segment is susceptible to borrower over-leveraging and income disruption, and the digital acquisition channel introduces adverse selection risk relative to branch-based lenders.`,
  },
  {
    factor: 'Business Position',
    pillar: 'Business & Management',
    grade: 'Strong' as Grade,
    pct: 80,
    commentary: `KrazyBee (operating as KreditBee) is among the largest pure-play digital unsecured personal lenders in India, with approximately a decade of vintage by 2026. The KreditBee brand has achieved significant organic reach, with over 50 million registered users. Its digital-native distribution and underwriting advantages have attracted institutional capital from marquee investors. Competition from incumbent banks, large fintech NBFCs, and app-based lenders is intensifying. Geographic concentration in southern India (primarily Telangana, Karnataka, Tamil Nadu) remains a risk; the company is actively diversifying northward.`,
  },
  {
    factor: 'Borrower Profile',
    pillar: 'Business & Management',
    grade: 'Weak' as Grade,
    pct: 40,
    commentary: `The target borrower is a young, urban or semi-urban salaried professional, typically aged 29 (median), with an average annual income of approximately ₹6 lakh. Many borrowers are new-to-credit (NTC) or thin-file, relying on alternative data inputs for credit assessment. A meaningful share is employed in informal or gig-economy roles with variable income. This demographic is inherently sensitive to macroeconomic shocks — job losses, inflation, or stagnant wage growth — which could rapidly increase default rates. Borrower over-leveraging is a documented sector risk.`,
  },
  {
    factor: 'Management & Governance',
    pillar: 'Business & Management',
    grade: 'Moderate' as Grade,
    pct: 60,
    commentary: `The founding team — Madhusudan Ekambaram (MD & CEO) and Krishnaswamy Karthikeyan (Director) — brings over a decade of fintech and banking experience. The 11-member board includes independent directors and nominee directors from institutional shareholders. The company is regulated by the MCA, RBI and SEBI. Two governance concerns: the resignation of statutory auditor Tattavam & Co. in August 2025 (a replacement was sought) and notably elevated MD remuneration relative to NBFC peers of comparable scale.`,
  },
  {
    factor: 'Ownership',
    pillar: 'Business & Management',
    grade: 'Strong' as Grade,
    pct: 80,
    commentary: `KrazyBee has no promoter holding in the traditional sense; the founding team holds a combined ~8.4%. The cap table is dominated by PE/VC investors: PI Opportunities (Premji Invest) at 24.25%, NewQuest/TPG at 23.52%, Alpine Opportunity Fund at 16.87%, and Motilal Oswal's India Business Excellence Fund at 13.38%. This institutional concentration is a strength — it aligns board incentives with governance quality. The April 2026 unicorn round ($280M Series E at ~$1.5B valuation) further signals institutional confidence.`,
  },
];

export const ownershipData = [
  { name: 'PI Opportunities', pct: 24.25 },
  { name: 'NewQuest/TPG', pct: 23.52 },
  { name: 'Alpine Opportunity Fund', pct: 16.87 },
  { name: 'India Business Excellence Fund', pct: 13.38 },
  { name: 'Madhusudan Ekambaram', pct: 6.45 },
  { name: 'Mirae Asset', pct: 4.74 },
  { name: 'Unitary Fund', pct: 2.45 },
  { name: 'Krishnaswamy Karthikeyan', pct: 1.99 },
  { name: 'India SME Investments', pct: 1.93 },
  { name: 'Wiseanya', pct: 1.82 },
  { name: 'Others', pct: 2.00 },
  { name: 'ICICI Bank', pct: 0.58 },
  { name: 'MUFG Bank', pct: 0.01 },
];

export const borrowerMix = [
  { name: 'Unsecured Personal Loans', pct: 85.8, aum: 5116 },
  { name: 'Unsecured Business / MSME', pct: 11.6, aum: 689 },
  { name: 'LAP & Two-Wheeler', pct: 2.7, aum: 160 },
];

export const ncdIssuances = [
  { isin: 'INE07HK07817', coupon: 10.40, ytm: 10.27, tenor: '7–9m', size: 450, maturity: '25 Jan 2027', current: true },
  { isin: 'INE07HK07825', coupon: 10.40, ytm: 10.69, tenor: '10–12m', size: 475, maturity: '12 Aug 2027', current: false },
  { isin: 'INE07HK07841', coupon: 10.40, ytm: 10.83, tenor: '7–9m', size: 275, maturity: '16 Mar 2027', current: false },
  { isin: 'INE07HK07858', coupon: 10.40, ytm: 10.63, tenor: '7–9m', size: 150, maturity: '29 Mar 2027', current: false },
  { isin: 'INE07HK07809', coupon: 10.40, ytm: 9.82, tenor: '4–6m', size: 200, maturity: '06 Nov 2026', current: false },
  { isin: 'INE07HK07759', coupon: 10.40, ytm: 10.02, tenor: '4–6m', size: 22.3, maturity: '09 Nov 2026', current: false },
];

export const materialDevelopments = [
  { date: 'Apr 2026', title: 'Series E funding round — unicorn milestone', body: 'Raised $280M in Series E at approximately $1.5B post-money valuation, marking KrazyBee as a unicorn. Proceeds earmarked for lending expansion, technology infrastructure, and AI-driven underwriting improvements.' },
  { date: 'Feb 2026', title: 'Board approval for conversion to public company', body: 'The board approved initiation of the process to convert KrazyBee Services Limited from a private to a public company. The restructuring is preparatory to a potential IPO; no timeline has been officially confirmed. SEBI compliance preparations are underway.' },
  { date: 'Aug 2025', title: 'Statutory auditor resignation', body: 'Tattavam & Co., the statutory auditor, resigned from the engagement. The company initiated a search for a replacement auditor; transition was completed in subsequent months. The resignation did not trigger any qualification or audit adverse finding.' },
];

export const externalRatings = [
  {
    agency: 'CARE Ratings',
    rating: 'A (Stable)',
    date: 'Mar 2026',
    outlook: 'Stable',
    rationale: 'Strengths: strong growth momentum, healthy profitability trajectory, adequate capitalisation, and a scalable technology-led business model. Constraints: evolving personal-loan product mix with limited long-term track record, vulnerability of asset quality given 97% unsecured exposure, moderate funding profile relative to growth ambitions, and regulatory risk inherent in the digital lending segment.',
  },
];

export const sectorOutlook = {
  operating: `The Indian NBFC sector continues to demonstrate resilience, supported by robust credit demand across retail, MSME, and infrastructure segments. The RBI's phased implementation of scale-based regulation (SBR) has improved governance standards, particularly in the middle and upper layer. Credit growth in FY26 is expected to moderate compared to the FY24–25 surge, as NBFCs recalibrate growth vis-à-vis capital requirements. Funding conditions remain broadly supportive, with capital markets accessible to investment-grade issuers and bank lending rates stabilising.`,
  subSector: `The digital unsecured personal lending sub-segment is navigating a recalibration after strong pandemic-era growth. Demand CAGR of 26–28% to FY30 is projected, driven by financialisation of the new-to-credit population and increasing digital adoption in Tier 2/3 cities. Sector GNPA improved to approximately 2.5% in 1Q26, reflecting better underwriting and portfolio seasoning. Profitability is moderate (sector ROA 1–4%), with wide spreads offset by high credit costs. The RBI's digital lending guidelines (2022) have increased compliance costs. Strong institutional and VC funding continues to support capital availability for quality issuers.`,
};

export const aiQAPairs = [
  {
    q: 'Why is liquidity rated Weak?',
    a: 'Liquidity is rated Weak because cash and equivalents (₹708 Cr in 3Q26) cover only ~13% of liabilities maturing within the next 12 months (₹5,438 Cr). While the Liquidity Coverage Ratio is adequate at 135.5% (above the 100% regulatory minimum), the absolute cash buffer relative to near-term obligations is thin. This creates refinancing risk if market conditions deteriorate sharply. The company mitigates this through diversified borrowing channels and strong lender relationships, but the structural thinness of the liquidity cushion drives the Weak assessment.',
  },
  {
    q: "What's the GNPA trend?",
    a: "GNPA has improved materially: from 3.05% in FY24 → 3.13% in FY25 → 1.79% in 3Q26 → 1.53% in 4Q26. The improvement reflects AI-driven underwriting refinements, better collections infrastructure, and post-pandemic portfolio seasoning. At 1.53%, GNPA is below the sector average of ~2.5%, a notable positive for an unsecured lender. The key risk: these are cyclical low-credit-cost conditions; unsecured portfolios can deteriorate rapidly during income shocks.",
  },
  {
    q: 'Is the NCD attractively priced?',
    a: 'The current NCD (INE07HK07817, maturing 25 Jan 2027) offers a YTM of 10.27% for a 7–9 month tenor from an A-rated NBFC. Relative to a 91-day T-bill yield of approximately 6.5% and the AA-segment NCD benchmark at ~7.8–8.2%, the spread of ~200–230 bps reflects the A-rated credit quality and the unsecured-lending business risk. For investors who have assessed the credit risk, the yield appears adequate compensation. Investors should review the full issuance terms and compare against peer issuances before deciding.',
  },
  {
    q: 'Who owns the company?',
    a: "KrazyBee has no traditional promoter holding. The company is institutionally held: PI Opportunities (Premji Invest) is the largest shareholder at 24.25%, followed by NewQuest/TPG (23.52%) and Alpine Opportunity Fund (16.87%). Motilal Oswal's India Business Excellence Fund holds 13.38%. The founding team — Madhusudan Ekambaram (6.45%) and Krishnaswamy Karthikeyan (1.99%) — holds a combined ~8.4%. ICICI Bank (0.58%) and MUFG Bank (0.01%) are minority shareholders.",
  },
];
