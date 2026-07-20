import { Fragment, useState } from 'react';
import { ChevronDown, ChevronRight, Info, CircleCheck, CircleAlert, Gavel } from 'lucide-react';
import type { Covenant, CovenantCondition } from '../data/covenants';
import { covenantBuffer, latestActual, activeThreshold, nextStep, covenantStatus, covenantHeadroomSeries } from '../data/covenants';
import { GradeBadge } from './GradeBadge';
import { Sparkline } from './Sparkline';
import { CovenantStatusChip } from './CovenantStatusChip';
import { BufferBar } from './BufferBar';
import { CovenantHeadroomChart } from './CovenantHeadroomChart';

// Real-time covenant monitoring.
//
// The load-bearing idea: QUALITY and HEADROOM are different, and often opposite.
// - Quality (authored) — how protective the threshold is.
// - Headroom (computed) — how far the reported actual sits from breach.
// A loose covenant shows a big comfortable buffer precisely because it protects
// you less. The table shows both side by side and the tooltip names the inversion.

const OP_SYMBOL = { gte: '≥', lte: '≤', eq: '=' } as const;

const fmt = (v: number, unit: CovenantCondition['unit']) =>
  unit === '₹ cr' ? `₹${v.toLocaleString()} cr` : `${v}${unit}`;

const QUALITY_HINT =
  'Authored view of how protective this threshold is — not how much room is left. ' +
  'A Weak covenant is set so far from the business that it will not bite until real distress; ' +
  'that is exactly why it shows a large, comfortable-looking buffer.';

const ConditionRow: React.FC<{ condition: CovenantCondition; first: boolean; covenant: Covenant }> = ({ condition, first, covenant }) => {
  const la = latestActual(condition);
  const r = covenantBuffer(condition, la?.value ?? null);
  const status = covenantStatus(r.bufferPct, r.breached);
  const step = nextStep(condition);
  const trend = covenantHeadroomSeries(condition).map(p => p.bufferPct).filter((v): v is number => v !== null);

  return (
    <>
      <td className="py-3 pr-3 align-top">
        <p className="text-xs text-primary-text">{condition.metric}</p>
        {condition.indicative && (
          <span
            title={condition.indicativeNote}
            className="mt-1 inline-flex items-center gap-1 text-[9px] font-semibold px-1.5 py-0.5 rounded"
            style={{ background: 'rgba(251,191,36,0.15)', color: '#FBBF24' }}
          >
            <Info size={8} /> indicative proxy
          </span>
        )}
      </td>

      <td className="py-3 pr-3 align-top text-right">
        <p className="text-xs font-mono-nums text-primary-text whitespace-nowrap">
          {r.threshold != null ? `${OP_SYMBOL[condition.op]} ${fmt(r.threshold, condition.unit)}` : '—'}
        </p>
        {step && (
          <p className="text-[9px] font-mono-nums whitespace-nowrap" style={{ color: '#FBBF24' }}>
            → {fmt(step.threshold, condition.unit)} {step.label}
          </p>
        )}
      </td>

      <td className="py-3 pr-3 align-top text-right">
        <p className="text-xs font-mono-nums text-primary-text whitespace-nowrap">
          {la ? fmt(la.value, condition.unit) : <span className="text-muted-text">no data</span>}
        </p>
        {la && <p className="text-[9px] text-muted-text">{la.period}</p>}
      </td>

      <td className="py-3 pr-3 align-top" style={{ minWidth: 110 }}>
        <p className="text-xs font-mono-nums whitespace-nowrap" style={{ color: r.breached ? '#E11D48' : '#E9F3F1' }}>
          {r.buffer != null ? `${r.buffer > 0 ? '+' : ''}${fmt(r.buffer, condition.unit)}` : '—'}
          {r.bufferPct != null && <span className="text-muted-text"> · {r.bufferPct}%</span>}
        </p>
        <div className="mt-1.5"><BufferBar bufferPct={r.bufferPct} status={status} breached={r.breached} /></div>
      </td>

      <td className="py-3 pr-3 align-top">
        {la ? <CovenantStatusChip status={status} compact /> : <span className="text-[10px] text-muted-text">—</span>}
      </td>

      <td className="py-3 pr-3 align-top">
        {trend.length > 1
          ? <Sparkline data={trend} width={64} height={26} />
          : <span className="text-[10px] text-muted-text">—</span>}
      </td>

      <td className="py-3 align-top">
        {first ? <span title={QUALITY_HINT}><GradeBadge grade={covenant.qualityGrade} compact /></span> : null}
      </td>
    </>
  );
};

export const CovenantMonitor: React.FC<{ covenants: Covenant[]; testing?: string }> = ({ covenants, testing }) => {
  const [open, setOpen] = useState<string | null>(null);

  if (!covenants.length) {
    return <p className="glass-card p-4 text-xs" style={{ color: '#FBBF24' }}>No covenants authored for this instrument.</p>;
  }

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-1 gap-2 flex-wrap">
        <h3 className="text-sm font-semibold text-primary-text flex items-center gap-2">
          <Gavel size={14} className="text-brand-teal" /> Financial covenants — live monitor
        </h3>
        <span className="text-[11px] text-muted-text">{covenants.length} monitored</span>
      </div>
      <p className="text-[11px] text-muted-text mb-4 max-w-3xl leading-relaxed">
        <strong className="text-primary-text">Quality and headroom are not the same thing, and often move opposite.</strong>{' '}
        Quality is our authored view of how protective a threshold is. Buffer is arithmetic — how far the
        reported actual sits from breach. A loose covenant shows a large buffer precisely because it protects you less.
      </p>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th className="pb-2 pr-3 t-eyebrow font-medium">Covenant</th>
              <th className="pb-2 pr-3 t-eyebrow font-medium">Condition</th>
              <th className="pb-2 pr-3 t-eyebrow font-medium text-right">Threshold</th>
              <th className="pb-2 pr-3 t-eyebrow font-medium text-right">Latest actual</th>
              <th className="pb-2 pr-3 t-eyebrow font-medium">Buffer</th>
              <th className="pb-2 pr-3 t-eyebrow font-medium">Status</th>
              <th className="pb-2 pr-3 t-eyebrow font-medium">Headroom</th>
              <th className="pb-2 t-eyebrow font-medium" title={QUALITY_HINT}>Quality</th>
            </tr>
          </thead>
          <tbody>
            {covenants.map(cov => {
              const isOpen = open === cov.id;
              const monitorable = cov.conditions.length > 0;

              return (
                <Fragment key={cov.id}>
                  {/* Status / affirmative covenants — a compliance flag, not a number */}
                  {!monitorable ? (
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td className="py-3 pr-3 align-top">
                        <button
                          onClick={() => setOpen(o => (o === cov.id ? null : cov.id))}
                          aria-expanded={isOpen}
                          className="flex items-start gap-1.5 text-left text-xs font-medium text-primary-text hover:text-brand-teal transition-colors"
                        >
                          {isOpen ? <ChevronDown size={12} className="mt-0.5 shrink-0" /> : <ChevronRight size={12} className="mt-0.5 shrink-0" />}
                          {cov.name}
                        </button>
                        <span className="ml-4 text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', color: '#9CB3B1' }}>{cov.category}</span>
                      </td>
                      <td className="py-3 pr-3 align-top text-xs text-muted-text" colSpan={5}>
                        <span className="inline-flex items-start gap-1.5">
                          {cov.compliant === true && <CircleCheck size={12} className="mt-0.5 shrink-0" style={{ color: '#34D399' }} />}
                          {cov.compliant === false && <CircleAlert size={12} className="mt-0.5 shrink-0" style={{ color: '#E11D48' }} />}
                          {cov.statusText}
                        </span>
                      </td>
                      <td className="py-3 pr-3 align-top" />
                      <td className="py-3 align-top"><span title={QUALITY_HINT}><GradeBadge grade={cov.qualityGrade} compact /></span></td>
                    </tr>
                  ) : (
                    cov.conditions.map((c, ci) => (
                      <tr key={`${cov.id}-${ci}`} style={{ borderBottom: ci === cov.conditions.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                        {ci === 0 ? (
                          <td className="py-3 pr-3 align-top" rowSpan={cov.conditions.length}>
                            <button
                              onClick={() => setOpen(o => (o === cov.id ? null : cov.id))}
                              aria-expanded={isOpen}
                              className="flex items-start gap-1.5 text-left text-xs font-medium text-primary-text hover:text-brand-teal transition-colors"
                            >
                              {isOpen ? <ChevronDown size={12} className="mt-0.5 shrink-0" /> : <ChevronRight size={12} className="mt-0.5 shrink-0" />}
                              {cov.name}
                            </button>
                            {cov.conditions.length > 1 && (
                              <span className="ml-4 text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}>
                                both must hold
                              </span>
                            )}
                          </td>
                        ) : null}
                        <ConditionRow condition={c} first={ci === 0} covenant={cov} />
                      </tr>
                    ))
                  )}

                  {/* Expanded: authored quality note + actual-vs-threshold per condition */}
                  {isOpen && (
                    <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td colSpan={8} className="py-4 px-2 page-fade" style={{ background: 'rgba(255,255,255,0.02)' }}>
                        <div className="rounded-lg p-3 mb-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <p className="t-eyebrow mb-1">Why this grade</p>
                          <p className="text-xs text-muted-text leading-relaxed">{cov.qualityNote}</p>
                        </div>

                        {cov.conditions.map((c, ci) => (
                          <div key={ci} className="mb-4 last:mb-0">
                            <p className="text-xs font-medium text-primary-text mb-1">{c.metric}</p>
                            {c.indicative && c.indicativeNote && (
                              <p className="text-[11px] mb-2 leading-relaxed" style={{ color: '#FBBF24' }}>{c.indicativeNote}</p>
                            )}
                            <CovenantHeadroomChart condition={c} />
                          </div>
                        ))}

                        <div className="flex flex-wrap gap-x-6 gap-y-1 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                          <p className="text-[11px] text-muted-text">Source: {cov.sourceClause}</p>
                          {cov.consequence && <p className="text-[11px]" style={{ color: '#FB7185' }}>Consequence: {cov.consequence}</p>}
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>

      {testing && (
        <p className="text-[11px] text-muted-text mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <strong className="text-primary-text">Testing & cure:</strong> {testing}
        </p>
      )}
    </div>
  );
};
