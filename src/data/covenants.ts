import type { Grade } from './types';

// ── Covenant model (§D) ──────────────────────────────────────────────────────
//
// Covenant buffer / headroom is the ONE place where arithmetic is transparent and
// computed client-side (see §B "transparent vs sealed"): it is simple proximity-to-
// threshold maths, not scoring. Every grade/score in this file is still authored.

export type Op = 'gte' | 'lte' | 'eq';

/** A reported actual. `asOf` ('YYYY-MM') lets a scheduled threshold be resolved for the period. */
export interface CovenantActual { period: string; value: number; asOf?: string; }

/** A forward-dated threshold step, e.g. GNPA 8% → 7% from Jun'26 → 6% from Sep'26. */
export interface CovenantScheduleStep { effectiveFrom: string; threshold: number; label?: string; }

export interface CovenantCondition {
  metric: string;
  op: Op;
  unit: '%' | 'x' | '₹ cr' | '';
  /** Base threshold. When `schedule` is present this is the threshold before the first step. */
  threshold?: number;
  schedule?: CovenantScheduleStep[];
  actuals: CovenantActual[];
  /** True when the actual is a proxy for the covenanted metric (e.g. on-book GNPA for 90+ PAR). */
  indicative?: boolean;
  indicativeNote?: string;
}

export interface Covenant {
  id: string;
  isin: string;
  name: string;
  category: 'financial' | 'affirmative' | 'negative' | 'status';
  conditions: CovenantCondition[];
  /** For affirmative/status covenants that are a compliant/non-compliant flag, not a number. */
  statusText?: string;
  compliant?: boolean;
  /** Authored: how protective the threshold is (NOT how much headroom there is). */
  qualityGrade: Grade;
  qualityNote: string;
  /** Kept generic per §B — never a real clause/page reference. */
  sourceClause: string;
  testing?: string;
  consequence?: string;
}

// ── Mock "now" ───────────────────────────────────────────────────────────────
// The app's data layer is as of 3Q FY26 / Jun 2026 (see reports.ts data sources).
export const AS_OF = '2026-06';

// ── Helpers (transparent arithmetic) ─────────────────────────────────────────

const round = (n: number, dp = 2): number => Math.round(n * 10 ** dp) / 10 ** dp;

/**
 * The threshold in force at `asOf`. Schedule steps are 'YYYY-MM' so they compare
 * lexicographically. Falls back to the base threshold before the first step.
 */
export const activeThreshold = (c: CovenantCondition, asOf: string = AS_OF): number | undefined => {
  if (!c.schedule?.length) return c.threshold;
  const applicable = c.schedule
    .filter(s => s.effectiveFrom <= asOf)
    .sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom));
  return applicable.length ? applicable[applicable.length - 1].threshold : c.threshold;
};

/** The next scheduled tightening after `asOf`, if any — for "steps to 6% in Sep'26" hints. */
export const nextStep = (c: CovenantCondition, asOf: string = AS_OF): CovenantScheduleStep | undefined =>
  c.schedule?.filter(s => s.effectiveFrom > asOf).sort((a, b) => a.effectiveFrom.localeCompare(b.effectiveFrom))[0];

export interface BufferResult {
  threshold?: number;
  /** Distance to breach in the condition's unit. Negative = breached. */
  buffer: number | null;
  /** Distance to breach as a % of the threshold. */
  bufferPct: number | null;
  breached: boolean;
}

/** gte → value − threshold · lte → threshold − value · eq → −|value − threshold| */
export const covenantBuffer = (
  c: CovenantCondition,
  value: number | null,
  asOf: string = AS_OF,
): BufferResult => {
  const threshold = activeThreshold(c, asOf);
  if (threshold === undefined || value === null) {
    return { threshold, buffer: null, bufferPct: null, breached: false };
  }
  const buffer =
    c.op === 'gte' ? value - threshold :
    c.op === 'lte' ? threshold - value :
    -Math.abs(value - threshold);
  const bufferPct = threshold === 0 ? null : round((buffer / Math.abs(threshold)) * 100, 1);
  return { threshold, buffer: round(buffer), bufferPct, breached: buffer < 0 };
};

export const latestActual = (c: CovenantCondition): CovenantActual | undefined =>
  c.actuals.length ? c.actuals[c.actuals.length - 1] : undefined;

export type CovenantStatus = 'Breach' | 'Tight' | 'Moderate' | 'Comfortable';

/** Breach · Tight 0–10% · Moderate 10–25% · Comfortable >25% (§3). */
export const covenantStatus = (bufferPct: number | null, breached: boolean): CovenantStatus =>
  breached ? 'Breach'
  : bufferPct === null ? 'Moderate'
  : bufferPct <= 10 ? 'Tight'
  : bufferPct <= 25 ? 'Moderate'
  : 'Comfortable';

export const COVENANT_STATUS_COLOUR: Record<CovenantStatus, string> = {
  Breach: '#E11D48',
  Tight: '#FB7185',
  Moderate: '#FBBF24',
  Comfortable: '#2DD4BF',
};

export interface HeadroomPoint {
  period: string;
  value: number;
  threshold?: number;
  buffer: number | null;
  bufferPct: number | null;
  breached: boolean;
}

/** Actual-vs-threshold series for the headroom sparkline / chart. */
export const covenantHeadroomSeries = (c: CovenantCondition, asOf: string = AS_OF): HeadroomPoint[] =>
  c.actuals.map(a => {
    const at = covenantBuffer(c, a.value, a.asOf ?? asOf);
    return { period: a.period, value: a.value, threshold: at.threshold, buffer: at.buffer, bufferPct: at.bufferPct, breached: at.breached };
  });

/** Worst (smallest) bufferPct across a covenant's conditions — drives worst-first sorting. */
export const covenantWorstBuffer = (cov: Covenant, asOf: string = AS_OF): BufferResult | undefined => {
  const results = cov.conditions
    .map(c => covenantBuffer(c, latestActual(c)?.value ?? null, asOf))
    .filter(r => r.bufferPct !== null);
  if (!results.length) return undefined;
  return results.reduce((worst, r) => (r.bufferPct! < worst.bufferPct! ? r : worst));
};
