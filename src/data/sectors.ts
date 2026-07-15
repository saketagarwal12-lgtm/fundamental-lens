import type { Grade } from './types';
import type { Recommendation } from './types';
import type { CompanyReport, FundingMixSlice, Signal } from './reports';
import { reports } from './reports';
import { companies } from './companies';
import { getScaledScore, getIssuerTrend } from './score';

// ── Sector taxonomy (derived from covered issuers' subSectorKey) ──────────────

export type SectorId = CompanyReport['subSectorKey']; // 'unsecured-pl' | 'mfi' | 'gold'

export interface SectorMeta {
  id: SectorId;
  name: string;       // display name
  short: string;      // compact chip label
  outlook: string;    // one-line outlook
}

export const SECTORS: SectorMeta[] = [
  { id: 'mfi', name: 'NBFC-MFI', short: 'MFI', outlook: 'Stabilising after the FY25 stress cycle; capital and liquidity buffers now the key differentiators.' },
  { id: 'gold', name: 'Gold loan', short: 'Gold', outlook: 'Structural tailwind from elevated gold prices; funding access and concentration the constraints for smaller lenders.' },
  { id: 'unsecured-pl', name: 'Unsecured personal loans', short: 'Unsecured PL', outlook: 'Digital-led growth with improving asset quality; capital buffers narrowing as books scale.' },
];

export const sectorMeta = (id: SectorId): SectorMeta =>
  SECTORS.find(s => s.id === id) ?? SECTORS[0];

// ── Per-issuer derived metrics (no re-scoring — reads authored data only) ──────

export interface RatioDef {
  key: string;
  label: string;
  unit: string;
  better: 'high' | 'low';   // which direction is stronger, for rank-in-selection
}

// The comparable ratio set, drawn from reports.ts financial sections.
export const RATIOS: RatioDef[] = [
  { key: 'gnpa', label: 'GNPA', unit: '%', better: 'low' },
  { key: 'nnpa', label: 'NNPA', unit: '%', better: 'low' },
  { key: 'crar', label: 'Total CAR', unit: '%', better: 'high' },
  { key: 'roaa', label: 'RoAA', unit: '%', better: 'high' },
  { key: 'nim', label: 'NIM', unit: '%', better: 'high' },
  { key: 'cof', label: 'Cost of funds', unit: '%', better: 'low' },
  { key: 'leverage', label: 'Leverage', unit: 'x', better: 'low' },
];

// Latest non-null value of the first metric whose label matches any candidate.
const latestByLabels = (report: CompanyReport, candidates: string[]): number | null => {
  for (const sec of Object.values(report.financials)) {
    for (const m of sec.metrics) {
      if (candidates.some(c => m.label.toLowerCase() === c.toLowerCase() || m.label.toLowerCase().includes(c.toLowerCase()))) {
        const v = [...m.values].reverse().find(x => x.value !== null);
        if (v && v.value !== null) return v.value;
      }
    }
  }
  return null;
};

const RATIO_CANDIDATES: Record<string, string[]> = {
  gnpa: ['GNPA'],
  nnpa: ['NNPA'],
  crar: ['Total CAR'],
  roaa: ['ROAA'],
  nim: ['Net Interest Margin (NIM)', 'NIM'],
  cof: ['Cost of funds'],
  leverage: ['Leverage'],
};

export interface IssuerFactor { name: string; grade: Grade; }

export interface IssuerMetrics {
  id: string;
  name: string;
  shortName: string;
  sector: SectorId;
  sectorName: string;
  fundamental: { score: number; max: number; pct: number; grade: Grade };  // issuer /200
  total: { score: number; max: number; pct: number; rating: number };      // /500
  components: ReturnType<typeof getScaledScore>['components'];
  pillarGrades: { name: string; grade: Grade; pct: number }[];
  issuerFactors: IssuerFactor[];   // the 10 issuer factors (B&M + Financial Analysis)
  ratios: Record<string, number | null>;
  yieldOverview: CompanyReport['yieldOverview'];
  fundingMix: FundingMixSlice[];
  externalRating: string;
  recommendation: Recommendation;
  delta12m: number | null;         // issuer-score change over the 12m trend
}

export const issuerMetrics = (id: string): IssuerMetrics | undefined => {
  const report = reports[id];
  const company = companies.find(c => c.id === id);
  if (!report || !company) return undefined;

  const scaled = getScaledScore(report);
  const iss = scaled.components.find(c => c.key === 'issuer')!;

  const issuerFactors: IssuerFactor[] = report.scorecard
    .filter(p => p.name === 'Business & Management' || p.name === 'Financial Analysis')
    .flatMap(p => p.factors.map(f => ({ name: f.name, grade: f.grade })));

  const pillarGrades = report.scorecard.map(p => ({ name: p.name, grade: p.grade, pct: p.pct }));

  const ratios: Record<string, number | null> = {};
  for (const r of RATIOS) ratios[r.key] = latestByLabels(report, RATIO_CANDIDATES[r.key]);

  const trend = getIssuerTrend(id);
  const delta12m = trend.length >= 2 ? trend[trend.length - 1].score - trend[0].score : null;

  return {
    id,
    name: company.name,
    shortName: company.name.split(' ')[0],
    sector: report.subSectorKey,
    sectorName: sectorMeta(report.subSectorKey).name,
    fundamental: { score: iss.score, max: iss.max, pct: iss.pct, grade: iss.grade },
    total: { score: scaled.score, max: scaled.max, pct: scaled.pct, rating: scaled.rating },
    components: scaled.components,
    pillarGrades,
    issuerFactors,
    ratios,
    yieldOverview: report.yieldOverview,
    fundingMix: report.fundingMix,
    externalRating: company.externalRating,
    recommendation: company.recommendation,
    delta12m,
  };
};

// Covered issuers (those with a full report), as IssuerMetrics.
export const coveredIssuers = (): IssuerMetrics[] =>
  Object.keys(reports).map(id => issuerMetrics(id)).filter((x): x is IssuerMetrics => !!x);

export const issuersInSector = (sector: SectorId): IssuerMetrics[] =>
  coveredIssuers().filter(m => m.sector === sector);

// ── Sector-level aggregates (averaged across covered issuers) ─────────────────

export interface SectorAggregate {
  id: SectorId;
  name: string;
  short: string;
  outlook: string;
  count: number;
  avgFundamental: number;        // avg issuer score /200
  avgFundamentalPct: number;
  gradeBands: { grade: Grade; count: number }[];
  ratios: Record<string, number | null>;  // averaged key ratios
  members: IssuerMetrics[];
}

const GRADE_ORDER: Grade[] = ['Extremely Strong', 'Strong', 'Moderate', 'Weak', 'Extremely Weak'];

// Band an issuer /200 pct into a Grade, for the distribution chart.
export const bandForPct = (pct: number): Grade =>
  pct >= 80 ? 'Extremely Strong' : pct >= 65 ? 'Strong' : pct >= 50 ? 'Moderate' : pct >= 35 ? 'Weak' : 'Extremely Weak';

const avg = (nums: (number | null)[]): number | null => {
  const vs = nums.filter((n): n is number => n !== null);
  if (!vs.length) return null;
  return Math.round((vs.reduce((a, b) => a + b, 0) / vs.length) * 100) / 100;
};

export const sectorAggregate = (sector: SectorId): SectorAggregate => {
  const meta = sectorMeta(sector);
  const members = issuersInSector(sector).sort((a, b) => b.fundamental.score - a.fundamental.score);

  const avgFundamental = members.length ? Math.round(members.reduce((s, m) => s + m.fundamental.score, 0) / members.length) : 0;
  const avgFundamentalPct = members.length ? Math.round(members.reduce((s, m) => s + m.fundamental.pct, 0) / members.length) : 0;

  const gradeBands = GRADE_ORDER.map(grade => ({
    grade,
    count: members.filter(m => bandForPct(m.fundamental.pct) === grade).length,
  }));

  const ratios: Record<string, number | null> = {};
  for (const r of RATIOS) ratios[r.key] = avg(members.map(m => m.ratios[r.key]));

  return {
    id: sector, name: meta.name, short: meta.short, outlook: meta.outlook,
    count: members.length, avgFundamental, avgFundamentalPct, gradeBands, ratios, members,
  };
};

export const allSectorAggregates = (): SectorAggregate[] =>
  SECTORS.map(s => sectorAggregate(s.id)).filter(a => a.count > 0);

// ── Sector-level signals feed (consolidated from members' authored signals) ────

export const sectorSignals = (sector: SectorId): Signal[] => {
  const members = issuersInSector(sector);
  const merged: Signal[] = [];
  // Interleave: take the most recent from each member in turn so the feed reads as
  // a sector-wide stream rather than one issuer at a time.
  const perMember = members.map(m => {
    const r = reports[m.id];
    return { name: m.shortName, sigs: (r.signals ?? []) };
  });
  const maxLen = Math.max(0, ...perMember.map(p => p.sigs.length));
  for (let i = 0; i < maxLen; i++) {
    for (const p of perMember) {
      const s = p.sigs[i];
      if (s) merged.push({ ...s, text: `${p.name}: ${s.text}` });
    }
  }
  return merged;
};

// Consolidated outlook prose for the sector (members share the sub-sector write-up).
export const sectorOutlookProse = (sector: SectorId): { operating: string; subSector: string } => {
  const members = issuersInSector(sector);
  const r = members.length ? reports[members[0].id] : undefined;
  return r ? r.sectorOutlook : { operating: '', subSector: '' };
};
