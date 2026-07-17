import type { Covenant, CovenantCondition, CovenantStatus, BufferResult } from './covenants';
import { covenantBuffer, latestActual, covenantStatus, covenantHeadroomSeries, AS_OF } from './covenants';
import { allIsins, getIsinsForIssuer } from './isins';
import type { IsinAssessment } from './isins';
import type { Signal } from './reports';
import { companies } from './companies';
import { portfolioHoldings } from './portfolio';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
/** '2026-06' → "Jun 2026", to match the authored signal feed's date style. */
const AS_OF_LABEL = `${MONTHS[Number(AS_OF.slice(5, 7)) - 1]} ${AS_OF.slice(0, 4)}`;

// Portfolio-wide covenant monitoring + derived alerts.
//
// Everything here is derived from the authored covenant seeds and the transparent
// buffer arithmetic in covenants.ts. No thresholds, grades or scores are invented.

export type MonitorScope = 'holdings' | 'all';

export interface CovenantRow {
  key: string;
  isin: string;
  issuerId: string;
  issuerName: string;
  illustrative?: boolean;
  covenant: Covenant;
  /** The condition driving the row's status (the tightest one). Absent for status/affirmative covenants. */
  worstCondition?: CovenantCondition;
  buffer?: BufferResult;
  status?: CovenantStatus;
  /** True when the covenant is a compliance flag rather than a measured threshold. */
  flagOnly: boolean;
}

const isinsForScope = (scope: MonitorScope): IsinAssessment[] => {
  if (scope === 'all') return allIsins();
  // Holdings only — a holding may map to several ISINs, or none.
  return portfolioHoldings.flatMap(h => getIsinsForIssuer(h.companyId));
};

const issuerName = (id: string) => companies.find(c => c.id === id)?.name ?? id;

/** One row per covenant, keyed by its tightest condition. */
export const covenantRows = (scope: MonitorScope = 'holdings'): CovenantRow[] => {
  const rows: CovenantRow[] = [];

  for (const isin of isinsForScope(scope)) {
    for (const cov of isin.issuance?.covenants ?? []) {
      const base = {
        key: `${isin.isin}-${cov.id}`,
        isin: isin.isin,
        issuerId: isin.issuerId,
        issuerName: issuerName(isin.issuerId),
        illustrative: isin.illustrative,
        covenant: cov,
      };

      const measured = cov.conditions
        .map(c => ({ c, r: covenantBuffer(c, latestActual(c)?.value ?? null) }))
        .filter(x => x.r.bufferPct !== null);

      if (!measured.length) {
        rows.push({ ...base, flagOnly: true });
        continue;
      }

      const worst = measured.reduce((w, x) => (x.r.bufferPct! < w.r.bufferPct! ? x : w));
      rows.push({
        ...base,
        worstCondition: worst.c,
        buffer: worst.r,
        status: covenantStatus(worst.r.bufferPct, worst.r.breached),
        flagOnly: false,
      });
    }
  }

  return rows;
};

const STATUS_RANK: Record<CovenantStatus, number> = { Breach: 0, Tight: 1, Moderate: 2, Comfortable: 3 };

/** Worst headroom first: breaches, then tightest buffers, then compliance flags. */
export const covenantRowsWorstFirst = (scope: MonitorScope = 'holdings'): CovenantRow[] =>
  covenantRows(scope).sort((a, b) => {
    if (a.flagOnly !== b.flagOnly) return a.flagOnly ? 1 : -1;
    if (a.flagOnly && b.flagOnly) return 0;
    const rank = STATUS_RANK[a.status!] - STATUS_RANK[b.status!];
    if (rank !== 0) return rank;
    return (a.buffer!.bufferPct ?? 0) - (b.buffer!.bufferPct ?? 0);
  });

// ── Derived alerts ───────────────────────────────────────────────────────────

export interface CovenantAlert {
  id: string;
  severity: 'breach' | 'tightening';
  isin: string;
  issuerId: string;
  issuerName: string;
  illustrative?: boolean;
  covenantName: string;
  metric: string;
  title: string;
  body: string;
}

/**
 * A covenant raises an alert when it breaches, or when headroom tightens to within
 * ~10% of the threshold. Derived live from the monitor — not an authored feed.
 */
export const covenantAlerts = (scope: MonitorScope = 'holdings'): CovenantAlert[] =>
  covenantRowsWorstFirst(scope)
    .filter(r => !r.flagOnly && (r.status === 'Breach' || r.status === 'Tight'))
    .map(r => {
      const c = r.worstCondition!;
      const la = latestActual(c)!;
      const unit = c.unit === '₹ cr' ? '' : c.unit;
      const thr = `${c.op === 'gte' ? '≥' : c.op === 'lte' ? '≤' : '='} ${r.buffer!.threshold}${unit}`;
      const breach = r.status === 'Breach';
      return {
        id: r.key,
        severity: breach ? ('breach' as const) : ('tightening' as const),
        isin: r.isin,
        issuerId: r.issuerId,
        issuerName: r.issuerName,
        illustrative: r.illustrative,
        covenantName: r.covenant.name,
        metric: c.metric,
        title: breach
          ? `Covenant breach: ${r.covenant.name} — ${r.issuerName}`
          : `Covenant tightening: ${r.covenant.name} — ${r.issuerName}`,
        body: breach
          ? `${c.metric} is ${la.value}${unit} against a covenant of ${thr} (${la.period}) on ${r.isin}. ${r.covenant.consequence ?? ''}`.trim()
          : `${c.metric} is ${la.value}${unit} against a covenant of ${thr} (${la.period}) on ${r.isin} — ${r.buffer!.bufferPct}% of headroom remaining.`,
      };
    });

/** Headroom trend for a row, for the portfolio monitor's sparkline. */
export const rowTrend = (row: CovenantRow): number[] =>
  row.worstCondition
    ? covenantHeadroomSeries(row.worstCondition).map(p => p.bufferPct).filter((v): v is number => v !== null)
    : [];

/**
 * Covenant alerts, expressed as Signals so the existing SignalsFeed can carry them
 * alongside the authored feed on the company page.
 */
export const covenantSignalsForIssuer = (issuerId: string): Signal[] =>
  covenantAlerts('all')
    .filter(a => a.issuerId === issuerId)
    .map(a => ({
      date: AS_OF_LABEL,
      type: 'Covenant' as const,
      source: `Covenant monitor · ${a.isin}`,
      impact: 'down' as const,
      text: a.body,
    }));
