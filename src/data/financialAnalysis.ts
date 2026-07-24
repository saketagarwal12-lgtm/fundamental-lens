import type { CompanyReport } from './reports';
import type { FinancialSection } from './krazybee';

// Financial Analysis — the five-category indicator model (§3).
//
// ADDITIVE + SEALED: every value here is an authored model output, mapped from the
// figures already extracted into reports.ts. Nothing is computed in the app — no
// growth, CAGR, averages, LTM or ratios are derived here; a row we don't have a
// value for renders `NA`. The full §3c row schema is always present so the table
// shape is stable; gaps are pending PDF population (see the handover TODO).

export type PeriodKey = string; // 'FY22' | '1Q26' | 'LTM' | '3YAVG'
export type Unit = '%' | 'x' | '₹ crs' | 'months' | '';

export interface IndicatorRow {
  label: string;
  unit?: Unit;
  /** Sub-group header this row sits under (Off-Balance-Sheet uses these). */
  group?: string;
  values: Record<PeriodKey, number | null>; // null → 'NA'
}

export type CategoryKey =
  | 'profitability' | 'assetQuality' | 'liquidityFunding' | 'capitalization' | 'offBalanceSheet';

export interface IndicatorTable {
  category: CategoryKey;
  label: string;
  annualPeriods: PeriodKey[];
  quarterlyPeriods: PeriodKey[];
  showLtm: boolean;
  showThreeYearAvg: boolean;
  rows: IndicatorRow[];
  /** Set when the whole category is unpopulated, so the UI can explain the NA wall. */
  note?: string;
}

// ── Breakup / lender / ALM / stage structures (§3d/§3e) ──────────────────────

export interface BreakupRow {
  label: string;
  value: number;      // ₹ crs, or a percentage where the panel is share-only
  share: number;      // % of AUM (or the relevant base)
  meta?: Record<string, string | number>;
}

export interface LenderRow {
  sl: number;
  lender: string;
  lenderType: 'Top Banks' | 'Other Banks' | 'NBFC' | 'FIs/Small Finance Banks' | 'Others';
  fundingType: 'Term Loan' | 'WCDL' | 'NCD' | 'Securitization' | 'Others';
  outstanding: number;
  proportion: number;
}

export interface BorrowingProfile {
  period: PeriodKey;
  top10Concentration: number;
  /** Composition by funding type — always available from the report's funding mix. */
  byFundingType: { type: string; pct: number }[];
  /** Lender-level rows — only when authored; otherwise the panel shows composition only. */
  lenders?: LenderRow[];
}

export interface AlmSummary {
  assetTenorMonths: number;
  liabilityTenorMonths: number;
  lcr: number;
  cumulativeGapNote: string;
  ccePctOf12mRepayments?: number;
  topLenderConcentration?: string;
}

export interface SegmentAsset { segment: string; gnpa: number; nnpa: number; }

export interface AssetQualityDetail {
  period: PeriodKey;
  productMix: BreakupRow[];
  geography: BreakupRow[];
  ltvBuckets?: BreakupRow[];
  segmentAssetQuality?: SegmentAsset[];
  collectionEfficiency?: { period: string; value: number }[];
}

// ── §3c row schema (labels + units, in report order) ─────────────────────────
// `src` is the label to match against the report's financial-section metrics; a
// row with no `src` (or no match) renders NA across all periods.

interface RowDef { label: string; unit?: Unit; group?: string; src?: string[]; }

const PROFITABILITY: RowDef[] = [
  { label: 'Total operating revenue', unit: '₹ crs', src: ['Total Operating Revenue', 'Operating Revenue'] },
  { label: 'Operating revenue standard deviation', unit: '₹ crs' },
  { label: 'Operating revenue volatility', unit: '%' },
  { label: 'Operating revenue growth', unit: '%', src: ['Operating Revenue Growth'] },
  { label: '3-year revenue CAGR', unit: '%', src: ['3-Year Revenue CAGR', 'Revenue CAGR'] },
  { label: 'Net interest income', unit: '₹ crs', src: ['Net Interest Income', 'NII'] },
  { label: 'Core income', unit: '%' },
  { label: 'Net interest margin (NIM)', unit: '%', src: ['Net Interest Margin', 'NIM'] },
  { label: 'Yield on loans', unit: '%', src: ['Yield on loans'] },
  { label: 'Cost of funds', unit: '%', src: ['Cost of funds'] },
  { label: 'Return on asset (ROA)', unit: '%', src: ['ROAA', 'Return on asset'] },
  { label: 'Return on average equity (ROE)', unit: '%', src: ['ROAE', 'Return on average equity'] },
  { label: 'Cost-to-income ratio (C/I)', unit: '%', src: ['Cost-to-Income', 'Cost-to-income'] },
  { label: 'Operating cost / AUM', unit: '%', src: ['Operating cost / AUM', 'Operating cost'] },
  { label: 'Cost of risk', unit: '%', src: ['Cost of Risk'] },
  { label: 'Credit cost / pre-provision operating profit', unit: '%', src: ['Credit cost / PPOP', 'Credit cost'] },
  { label: 'PAT', unit: '₹ crs', src: ['PAT'] },
  { label: '3-year PAT CAGR', unit: '%' },
  { label: 'PAT growth', unit: '%', src: ['PAT growth'] },
];

const ASSET_QUALITY: RowDef[] = [
  { label: 'On-book AUM', unit: '₹ crs', src: ['On-book AUM'] },
  { label: 'On-book AUM growth', unit: '%' },
  { label: '3-year AUM CAGR', unit: '%' },
  { label: 'Fresh disbursement', unit: '₹ crs' },
  { label: 'Fresh disbursement / AUM', unit: '%' },
  { label: '(On-book + off-book) AUM', unit: '₹ crs' },
  { label: '(On-book + off-book) AUM growth', unit: '%' },
  { label: 'GNPLs', unit: '₹ crs' },
  { label: 'GNPLs growth', unit: '%' },
  { label: 'GNPL ratio', unit: '%', src: ['GNPA'] },
  { label: 'NNPL ratio', unit: '%', src: ['NNPA'] },
  { label: 'Write-offs', unit: '₹ crs' },
  { label: 'Write-offs', unit: '%', group: 'ratio' },
  { label: 'Delinquencies on fresh disbursement', unit: '₹ crs' },
  { label: 'Delinquencies on fresh disbursement', unit: '%', group: 'ratio' },
  { label: 'Average loan book tenor', unit: 'months' },
  { label: 'NPL coverage ratio', unit: '%' },
];

const LIQUIDITY_FUNDING: RowDef[] = [
  { label: 'CCE', unit: '₹ crs', src: ['Cash & Equivalents', 'CCE'] },
  { label: 'Investments', unit: '₹ crs' },
  { label: 'Liquid asset', unit: '₹ crs' },
  { label: 'Liquid asset maturing in next 12 months', unit: '₹ crs' },
  { label: 'Liquid asset / total asset', unit: '%', src: ['CCE / Total Assets'] },
  { label: 'Liquidity coverage ratio (LCR)', unit: '%', src: ['Liquidity Coverage Ratio'] },
  { label: 'Max ALM gap (up to 1 year) / CCE', unit: '%' },
  { label: 'Max ALM gap (after 1 year) / CCE', unit: '%' },
  { label: 'Financial liabilities maturing within next 12 months', unit: '₹ crs' },
  { label: 'CCE / financial liabilities (maturing within 12 months)', unit: 'x' },
  { label: 'CCE / cumulative ALM mismatch up to 1 year', unit: '%' },
  { label: 'Refinancing of operating cash outflow', unit: '%' },
  { label: 'Average funding profile tenor', unit: 'months' },
  { label: 'Asset-liability duration mismatch', unit: 'months' },
];

const CAPITALIZATION: RowDef[] = [
  { label: 'Absolute networth', unit: '₹ crs', src: ['Net Worth', 'Networth'] },
  { label: 'Absolute networth (adj: intangibles, DTA, sub-debt)', unit: '₹ crs' },
  { label: 'Networth growth', unit: '%' },
  { label: 'Proceeds from capital issuance', unit: '₹ crs' },
  { label: 'Proceeds from capital issuance in last 4 years', unit: '₹ crs' },
  { label: 'Proceeds from capital issuance', unit: '%', group: 'ratio' },
  { label: 'Proceeds from capital issuance (last 4 years) / networth', unit: 'x' },
  { label: 'NNPA / networth', unit: '%' },
  { label: 'Gearing / leverage ratio', unit: 'x', src: ['Leverage', 'Gearing'] },
  { label: 'Gearing / leverage ratio (adjusted)', unit: 'x' },
  { label: 'Dividend payout ratio', unit: '%' },
  { label: 'Internal capital generation', unit: '%' },
  { label: 'AUM expansion funded through internal capital generation', unit: '%' },
  { label: 'Capital adequacy ratio (Tier I CAR)', unit: '%', src: ['Tier I CAR'] },
  { label: 'Capital adequacy ratio (Tier I + Tier II CAR)', unit: '%', src: ['Total CAR'] },
  { label: 'Adjusted debt / adjusted equity', unit: '%' },
];

const OFF_BALANCE_SHEET: RowDef[] = [
  { label: 'Retention of beneficial economic interest', unit: '%', group: 'Direct Assignment (off-book)' },
  { label: 'Net gain/(loss) on sale / PBT', unit: '%', group: 'Direct Assignment (off-book)' },
  { label: 'Consideration received / financial liabilities', unit: '%', group: 'Direct Assignment (off-book)' },
  { label: 'Transaction value / gross AUM', unit: '%', group: 'Direct Assignment (off-book)' },
  { label: 'Retention of beneficial economic interest', unit: '%', group: 'Securitization (off-book)' },
  { label: 'Net gain/(loss) on sale / PBT', unit: '%', group: 'Securitization (off-book)' },
  { label: 'Carrying value of asset / gross loans', unit: '%', group: 'Securitization (off-book)' },
  { label: 'Carrying value of liabilities / financial liabilities', unit: '%', group: 'Securitization (off-book)' },
  { label: 'Total FLDG / total networth', unit: '%', group: 'Securitization (off-book)' },
  { label: 'Consideration received / financial liabilities', unit: '%', group: 'Securitization (off-book)' },
  { label: 'Transaction value / gross AUM', unit: '%', group: 'Securitization (off-book)' },
  { label: 'Gross gain/(loss) on sale', unit: '%', group: 'Sale of stressed loans' },
  { label: 'Net gain/(loss) on sale', unit: '%', group: 'Sale of stressed loans' },
  { label: 'Net gain/(loss) on sale / PBT', unit: '%', group: 'Sale of stressed loans' },
  { label: 'Consideration received / financial liabilities', unit: '%', group: 'Sale of stressed loans' },
  { label: 'Transaction value / gross AUM', unit: '%', group: 'Sale of stressed loans' },
  { label: 'Consideration received / investment in security receipts', unit: '%', group: 'Sale of stressed loans' },
];

const CATEGORY_META: { key: CategoryKey; label: string; rows: RowDef[]; from?: keyof CompanyReport['financials'] }[] = [
  { key: 'profitability', label: 'Profitability', rows: PROFITABILITY, from: 'profitability' },
  { key: 'assetQuality', label: 'Asset Quality', rows: ASSET_QUALITY, from: 'assetQuality' },
  { key: 'liquidityFunding', label: 'Liquidity & Funding', rows: LIQUIDITY_FUNDING, from: 'fundingLiquidity' },
  { key: 'capitalization', label: 'Capitalization', rows: CAPITALIZATION, from: 'capitalization' },
  { key: 'offBalanceSheet', label: 'Off-Balance-Sheet Transactions', rows: OFF_BALANCE_SHEET },
];

// ── Mapping helpers (no computation — label match only) ──────────────────────

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

const matchMetric = (section: FinancialSection | undefined, src?: string[]) => {
  if (!section || !src) return undefined;
  return section.metrics.find(m => src.some(s => {
    const a = norm(m.label), b = norm(s);
    return a === b || a.includes(b) || b.includes(a);
  }));
};

const classifyPeriods = (periods: PeriodKey[]) => {
  const annual = periods.filter(p => /^fy/i.test(p));
  const quarterly = periods.filter(p => /q/i.test(p));
  const ltm = periods.some(p => /ltm|last 12/i.test(p));
  const threeYr = periods.some(p => /3y|3-y|avg/i.test(p));
  return { annual, quarterly, ltm, threeYr };
};

/** Union of every period across a report's financial sections, first-seen order. */
const referencePeriods = (report: CompanyReport): PeriodKey[] => {
  const periods: PeriodKey[] = [];
  Object.values(report.financials).forEach(sec =>
    sec.metrics.forEach(m => m.values.forEach(v => { if (!periods.includes(v.period)) periods.push(v.period); })));
  return periods;
};

/** Build the five indicator tables for a report by mapping its authored financials. */
export const buildIndicatorTables = (report: CompanyReport): IndicatorTable[] => {
  const refPeriods = referencePeriods(report);

  return CATEGORY_META.map(meta => {
    const section = meta.from ? report.financials[meta.from] : undefined;

    // Union of periods present in the source section, in first-seen order.
    let periods: PeriodKey[] = [];
    section?.metrics.forEach(m => m.values.forEach(v => { if (!periods.includes(v.period)) periods.push(v.period); }));
    // Categories with no source section (Off-Balance-Sheet) still need columns so
    // their rows render as NA rather than collapsing to "no periods" (§3g).
    if (!periods.length) periods = refPeriods;
    const { annual, quarterly, ltm, threeYr } = classifyPeriods(periods);

    const rows: IndicatorRow[] = meta.rows.map(def => {
      const metric = matchMetric(section, def.src);
      const values: Record<PeriodKey, number | null> = {};
      for (const p of periods) {
        values[p] = metric?.values.find(v => v.period === p)?.value ?? null;
      }
      return { label: def.label, unit: def.unit, group: def.group, values };
    });

    const populated = rows.some(r => Object.values(r.values).some(v => v !== null));
    return {
      category: meta.key,
      label: meta.label,
      annualPeriods: annual,
      quarterlyPeriods: quarterly,
      showLtm: ltm,
      showThreeYearAvg: threeYr,
      rows,
      note: populated ? undefined
        : meta.key === 'offBalanceSheet'
          ? 'No off-balance-sheet transactions disclosed for the periods on record. Rows are shown for completeness; figures are pending source-document population.'
          : 'Detailed indicator rows are pending source-document population — headline figures appear in the Overview and Scorecard.',
    };
  });
};

// ── Asset-quality detail + borrowing profile from existing report fields ─────

export const buildAssetQualityDetail = (report: CompanyReport): AssetQualityDetail => {
  const latestAum = report.financials.assetQuality?.metrics
    .find(m => /on-book aum/i.test(m.label))?.values.slice().reverse().find(v => v.value != null)?.value ?? 0;

  return {
    period: '3Q26',
    productMix: report.productMix.map(p => ({ label: p.name, value: p.aum, share: p.pct })),
    geography: report.geography.map(g => ({ label: g.region, value: Math.round((g.pct / 100) * latestAum), share: g.pct })),
    ltvBuckets: report.ltvBuckets?.map(b => ({ label: b.bucket, value: b.pct, share: b.pct })),
    segmentAssetQuality: report.segmentAssetQuality,
    collectionEfficiency: report.collectionEfficiency,
  };
};

export const buildBorrowingProfile = (report: CompanyReport): BorrowingProfile => ({
  period: '3Q26',
  // Parse the authored "Top-10 lenders ~19.6% (low)" note into a number where present.
  top10Concentration: (() => {
    const m = report.alm.topLenderConcentration?.match(/(\d+(?:\.\d+)?)\s*%/);
    return m ? parseFloat(m[1]) : 0;
  })(),
  byFundingType: report.fundingMix.map(f => ({ type: f.name, pct: f.pct })),
});

export const buildAlmSummary = (report: CompanyReport): AlmSummary => ({
  assetTenorMonths: report.alm.assetTenorMonths,
  liabilityTenorMonths: report.alm.liabilityTenorMonths,
  lcr: report.alm.lcr,
  cumulativeGapNote: report.alm.cumulativeGapNote,
  ccePctOf12mRepayments: report.alm.ccePctOf12mRepayments,
  topLenderConcentration: report.alm.topLenderConcentration,
});
