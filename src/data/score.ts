import type { Grade } from './types';
import type { CompanyReport } from './reports';
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
  pct >= 80 ? 'Extremely Strong' : pct >= 65 ? 'Strong' : pct >= 50 ? 'Moderate' : 'Weak';

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

// ── Portfolio-level Fundamental Score ────────────────────────────────────────

const MONTHS = ["Jun'25", "Jul'25", "Aug'25", "Sep'25", "Oct'25", "Nov'25", "Dec'25", "Jan'26", "Feb'26", "Mar'26", "Apr'26", "May'26"];

const PORTFOLIO_EVENTS: Record<string, { direction: 'up' | 'down'; reason: string }> = {
  "Sep'25": { direction: 'down', reason: "A holding's rating downgrade (Spandana A- → BBB+) pulled the portfolio score down." },
  "Dec'25": { direction: 'down', reason: 'Broad NBFC asset-quality and leverage pressure weighed on several holdings.' },
  "Apr'26": { direction: 'up', reason: "KrazyBee's $280M unicorn raise lifted the portfolio score." },
};

export interface PortfolioScoreResult {
  score: number;       // 0–500, holding-weighted average
  pct: number;         // 0–100
  series: ScorePoint500[];
  contributions: { name: string; score: number; pct: number; delta: number; grade: Grade }[];
}

export const getPortfolioScore = (holdings: PortfolioHolding[]): PortfolioScoreResult => {
  const n = holdings.length || 1;
  const avgPct = Math.round(holdings.reduce((s, h) => s + h.healthScore, 0) / n);
  const score = Math.round(avgPct * 5);

  // Average each month across holdings' trend arrays (0–100), then ×5.
  const series: ScorePoint500[] = MONTHS.map((month, i) => {
    const vals = holdings.map(h => h.trend[i]).filter(v => v != null);
    const avg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : avgPct;
    return { month, score: Math.round(avg * 5), event: PORTFOLIO_EVENTS[month] };
  });

  const contributions = holdings
    .map(h => ({
      name: h.companyName,
      score: Math.round(h.healthScore * 5),
      pct: h.healthScore,
      delta: h.healthScore - avgPct,
      grade: gradeForPct(h.healthScore),
    }))
    .sort((a, b) => b.score - a.score);

  return { score, pct: avgPct, series, contributions };
};
