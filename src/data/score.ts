import type { Grade } from './types';
import type { CompanyReport } from './reports';
import { getReport } from './reports';
import type { HealthScorePoint } from './krazybee';
import type { PortfolioHolding } from './portfolio';

// ── Fundamental Score scale helpers (0–500) ──────────────────────────────────

export interface ComponentScore {
  key: 'issuer' | 'issuance' | 'pricing' | 'economic';
  label: string;
  score: number;       // actual ×100, e.g. 134
  max: number;         // e.g. 200
  pct: number;         // 0–100
  weightPct: number;   // share of the 500 (max/500*100)
  grade: Grade;        // derived from pct, for colouring
  scorecardName: string | string[]; // which scorecard pillar(s) this maps to
}

export interface ScaledScore {
  score: number;       // combined ×100, e.g. 327
  max: 500;
  pct: number;         // 0–100
  rating: number;      // 1 (best) … 10 (worst)
  band: 'Strong' | 'Adequate' | 'Weak';
  components: ComponentScore[];
}

// Grade from a 0–100 percentage, used to colour gauge segments / arcs.
export const gradeForPct = (pct: number): Grade =>
  pct >= 80 ? 'Extremely Strong' : pct >= 60 ? 'Strong' : pct >= 40 ? 'Moderate' : 'Weak';

export const scoreBand = (pct: number): 'Strong' | 'Adequate' | 'Weak' =>
  pct >= 70 ? 'Strong' : pct >= 55 ? 'Adequate' : 'Weak';

const COMPONENT_META: { key: ComponentScore['key']; dim: string; label: string; scorecardName: string | string[] }[] = [
  { key: 'issuer', dim: 'Issuer', label: 'Issuer', scorecardName: ['Business & Management', 'Financial Analysis'] },
  { key: 'issuance', dim: 'Issuance', label: 'Issuance', scorecardName: 'Issuance Assessment' },
  { key: 'pricing', dim: 'Pricing', label: 'Pricing', scorecardName: 'Pricing' },
  { key: 'economic', dim: 'Economic & Sector', label: 'Economic & Sector', scorecardName: 'Economic & Sector Outlook' },
];

// Parse "1.34/2.00" → { num: 1.34, den: 2.0 }
const parseActual = (actual: string): { num: number; den: number } => {
  const [a, b] = actual.split('/').map(s => parseFloat(s.trim()));
  return { num: a || 0, den: b || 1 };
};

export const getScaledScore = (report: CompanyReport): ScaledScore => {
  const combinedRow = report.ratingScale.find(r => r.dimension === 'Combined');
  const combined = combinedRow ? parseActual(combinedRow.actual) : { num: 0, den: 5 };
  const score = Math.round(combined.num * 100);
  const pct = combinedRow?.pct ?? Math.round((combined.num / combined.den) * 100);

  const components: ComponentScore[] = COMPONENT_META.map(meta => {
    const row = report.ratingScale.find(r => r.dimension === meta.dim);
    const { num, den } = row ? parseActual(row.actual) : { num: 0, den: 1 };
    const cScore = Math.round(num * 100);
    const cMax = Math.round(den * 100);
    const cPct = row?.pct ?? Math.round((num / den) * 100);
    return {
      key: meta.key,
      label: meta.label,
      score: cScore,
      max: cMax,
      pct: cPct,
      weightPct: Math.round((cMax / 500) * 100),
      grade: gradeForPct(cPct),
      scorecardName: meta.scorecardName,
    };
  });

  return {
    score,
    max: 500,
    pct,
    rating: combinedRow?.ratingNumber ?? 0,
    band: scoreBand(pct),
    components,
  };
};

// Re-express a 0–100 monthly series on the 0–500 scale, anchoring the LAST
// point to the combined score so the trend's latest value equals the gauge.
export interface ScorePoint500 {
  month: string;
  score: number;
  event?: { direction: 'up' | 'down'; reason: string };
}

export const toSeries500 = (series: HealthScorePoint[], combinedScore: number): ScorePoint500[] => {
  if (!series.length) return [];
  const last = series[series.length - 1].score;
  const offset = combinedScore - Math.round(last * 5);
  return series.map(p => ({
    month: p.month,
    score: Math.round(p.score * 5) + offset,
    event: p.event,
  }));
};

// ── Issuer (Fundamental) Score trend, /200 scale ─────────────────────────────

const ISSUER_MONTHS = ["Jun'25", "Jul'25", "Aug'25", "Sep'25", "Oct'25", "Nov'25", "Dec'25", "Jan'26", "Feb'26", "Mar'26", "Apr'26", "May'26"];

interface RawTrend {
  values: number[];
  events: Record<string, { direction: 'up' | 'down'; reason: string }>;
}

const ISSUER_TREND: Record<string, RawTrend> = {
  krazybee: {
    values: [128, 128, 126, 128, 130, 130, 128, 132, 132, 132, 138, 134],
    events: {
      "Aug'25": { direction: 'down', reason: 'Statutory auditor (Tattavam & Co.) resigned — Management & Governance.' },
      "Oct'25": { direction: 'up', reason: 'Asset quality strengthened, GNPA eased toward ~2% — Asset Quality.' },
      "Dec'25": { direction: 'down', reason: 'Leverage rose to 2.40x and Total CAR eased to 23.55% — Capitalization.' },
      "Apr'26": { direction: 'up', reason: 'Raised $280M Series E (unicorn) — Ownership / Capitalization.' },
    },
  },
  avanti: {
    values: [108, 108, 106, 100, 100, 100, 96, 98, 100, 102, 104, 102],
    events: {
      "Sep'25": { direction: 'down', reason: 'Crisil downgrade BBB+ → BBB.' },
      "Dec'25": { direction: 'down', reason: 'Covenant breach (waiver obtained).' },
      "Apr'26": { direction: 'up', reason: '₹75 cr capital infusion lifted Total CAR to ~31%.' },
    },
  },
  keertana: {
    values: [112, 112, 112, 110, 110, 112, 108, 110, 110, 110, 110, 110],
    events: {
      "Nov'25": { direction: 'up', reason: 'India Ratings affirmed BBB+ (Stable).' },
      "Dec'25": { direction: 'down', reason: 'GNPA/NNPA rose to 1.38%/0.69% — Asset Quality.' },
      "Mar'26": { direction: 'up', reason: 'Gold AUM ramped to ~91% of book.' },
    },
  },
  spandana: {
    values: [110, 108, 106, 102, 104, 108, 110, 110, 110, 110, 110, 110],
    events: {
      "Sep'25": { direction: 'down', reason: 'Downgrade A- → BBB+ (Negative).' },
      "Nov'25": { direction: 'up', reason: 'New MD & CEO appointed + ₹200 cr rights issue.' },
      "Dec'25": { direction: 'up', reason: 'Collection efficiency ~94%, GNPA eased to 4.20%.' },
    },
  },
};

export const getIssuerTrend = (id: string): ScorePoint500[] => {
  const raw = ISSUER_TREND[id];
  if (!raw) return [];
  return ISSUER_MONTHS.map((month, i) => ({ month, score: raw.values[i], event: raw.events[month] }));
};

// ── Portfolio-level Fundamental Score ────────────────────────────────────────

const MONTHS = ["Jun'25", "Jul'25", "Aug'25", "Sep'25", "Oct'25", "Nov'25", "Dec'25", "Jan'26", "Feb'26", "Mar'26", "Apr'26", "May'26"];

const PORTFOLIO_EVENTS: Record<string, { direction: 'up' | 'down'; reason: string }> = {
  "Sep'25": { direction: 'down', reason: "A holding's rating downgrade (Spandana A- → BBB+) pulled the portfolio score down." },
  "Dec'25": { direction: 'down', reason: 'Broad NBFC asset-quality and leverage pressure weighed on several holdings.' },
  "Apr'26": { direction: 'up', reason: "KrazyBee's $280M unicorn raise lifted the portfolio score." },
};

export interface PortfolioScoreResult {
  score: number;       // 0–200, holding-average Fundamental (issuer) score
  max: 200;
  pct: number;         // 0–100
  covered: number;     // holdings with a full report
  series: ScorePoint500[];
  contributions: { name: string; score: number; pct: number; delta: number; grade: Grade }[];
}

// Portfolio Fundamental Score = holding-average of issuer scores (/200), over
// holdings that have a full report. Total Score (0–500) is a separate rollup.
export const getPortfolioScore = (holdings: PortfolioHolding[]): PortfolioScoreResult => {
  const covered = holdings
    .map(h => ({ h, report: getReport(h.companyId) }))
    .filter((x): x is { h: PortfolioHolding; report: NonNullable<ReturnType<typeof getReport>> } => !!x.report)
    .map(x => ({ name: x.h.companyName, id: x.h.companyId, issuer: getScaledScore(x.report).components.find(c => c.key === 'issuer')! }));

  const n = covered.length || 1;
  const avgPct = Math.round(covered.reduce((s, c) => s + c.issuer.pct, 0) / n);
  const score = Math.round(covered.reduce((s, c) => s + c.issuer.score, 0) / n);

  // Average each month across covered holdings' issuer (/200) trends.
  const series: ScorePoint500[] = MONTHS.map((month, i) => {
    const vals = covered.map(c => getIssuerTrend(c.id)[i]?.score).filter((v): v is number => v != null);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : score;
    return { month, score: Math.round(avg), event: PORTFOLIO_EVENTS[month] };
  });

  const contributions = covered
    .map(c => ({
      name: c.name,
      score: c.issuer.score,
      pct: c.issuer.pct,
      delta: c.issuer.pct - avgPct,
      grade: gradeForPct(c.issuer.pct),
    }))
    .sort((a, b) => b.score - a.score);

  return { score, max: 200, pct: avgPct, covered: covered.length, series, contributions };
};
