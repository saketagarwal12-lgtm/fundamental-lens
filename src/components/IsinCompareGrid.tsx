import { useNavigate } from 'react-router-dom';
import { X, ShieldCheck, ShieldOff } from 'lucide-react';
import { ScoreGauge } from './ScoreGauge';
import { GradeBadge, gradeBarColor } from './GradeBadge';
import { CovenantStatusChip } from './CovenantStatusChip';
import { IllustrativeBadge } from './IllustrativeBadge';
import { rankExtremes, cellRing } from './compareGrid';
import type { IsinAssessment } from '../data/isins';
import { getIsinScore, getIssuerFundamental } from '../data/isins';
import { isinCovenantSummary } from '../data/covenantMonitor';
import { companies } from '../data/companies';
import { gradeForPct } from '../data/score';

// Side-by-side ISIN comparison.
//
// Two shapes, one grid:
// - sharedFundamental (same issuer): the Fundamental Score is shown ONCE as an
//   anchor, because it cannot differ. Everything below it is what actually varies.
// - cross-issuer: Fundamental leads per column, then the comparison continues
//   into the ISIN-level assessments.

interface Props {
  isins: IsinAssessment[];
  sharedFundamental: boolean;
  onRemove?: (isin: string) => void;
}

const PRICING_FACTORS = [
  { key: 'benchmark', label: 'Benchmark CRP' },
  { key: 'internal', label: 'Internal' },
  { key: 'forward', label: 'Forward-looking' },
  { key: 'peer', label: 'Comparable peers' },
  { key: 'recent', label: 'Recent issuances' },
] as const;

const issuerName = (id: string) => companies.find(c => c.id === id)?.name ?? id;
const shortName = (id: string) => issuerName(id).split(' ')[0];

export const IsinCompareGrid: React.FC<Props> = ({ isins, sharedFundamental, onRemove }) => {
  const navigate = useNavigate();
  const cols = `repeat(${Math.max(isins.length, 1)}, minmax(190px, 1fr))`;
  const labelCols = `190px repeat(${Math.max(isins.length, 1)}, minmax(170px, 1fr))`;

  const scores = isins.map(i => getIsinScore(i.isin));
  const covs = isins.map(i => isinCovenantSummary(i.isin));

  // A row of values with best/worst tinting.
  const Row: React.FC<{
    label: string; hint?: string;
    values: (number | null | undefined)[];
    better: 'high' | 'low';
    render: (v: number | null | undefined, i: number) => React.ReactNode;
  }> = ({ label, hint, values, better, render }) => {
    const { best, worst } = rankExtremes(values, better);
    return (
      <div className="grid gap-3 items-center py-1" style={{ gridTemplateColumns: labelCols }}>
        <span className="t-body text-muted-text" title={hint}>{label}</span>
        {values.map((v, i) => (
          <div key={i} className="rounded-lg px-3 py-2 text-right font-mono-nums text-sm text-primary-text" style={cellRing(i, best, worst)}>
            {render(v, i)}
          </div>
        ))}
      </div>
    );
  };

  // A row of non-rankable values (text/badges).
  const TextRow: React.FC<{ label: string; hint?: string; render: (a: IsinAssessment, i: number) => React.ReactNode }> = ({ label, hint, render }) => (
    <div className="grid gap-3 items-center py-1.5" style={{ gridTemplateColumns: labelCols, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span className="t-body text-muted-text" title={hint}>{label}</span>
      {isins.map((a, i) => <div key={a.isin} className="px-1">{render(a, i)}</div>)}
    </div>
  );

  const dash = <span className="text-muted-text">—</span>;
  const notAssessed = <span className="text-[10px] text-muted-text italic">not yet assessed</span>;

  return (
    <div className="overflow-x-auto">
      <div className="min-w-fit space-y-4">
        {/* Column headers */}
        <div className="grid gap-3" style={{ gridTemplateColumns: labelCols }}>
          <div />
          {isins.map(a => (
            <div key={a.isin} className="glass-card-elevated p-3">
              <div className="flex items-start justify-between gap-2">
                <button onClick={() => navigate(`/app/isin/${a.isin}`)} className="text-left min-w-0">
                  <p className="font-mono-nums text-sm font-semibold text-primary-text truncate hover:text-brand-teal transition-colors">{a.isin}</p>
                  <p className="t-caption truncate">{shortName(a.issuerId)}</p>
                </button>
                {onRemove && (
                  <button onClick={() => onRemove(a.isin)} aria-label={`Remove ${a.isin}`} className="text-muted-text hover:text-primary-text shrink-0"><X size={14} /></button>
                )}
              </div>
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {a.illustrative && <IllustrativeBadge compact />}
                {a.assessed === false && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ background: 'rgba(156,179,177,0.15)', color: '#9CB3B1' }}>Not assessed</span>
                )}
                {a.externalRating && <span className="t-caption">{a.externalRating}</span>}
              </div>
            </div>
          ))}
        </div>

        {/* Fundamental — shared anchor, or per-column when cross-issuer */}
        {sharedFundamental ? (
          (() => {
            const f = getIssuerFundamental(isins[0].issuerId);
            if (!f) return null;
            return (
              <div className="glass-card p-5 flex items-center gap-5 flex-wrap"
                style={{ background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.25)' }}>
                <ScoreGauge score={f.score} max={f.max} pct={f.pct} size={120} strokeWidth={10} caption="Fundamental Score" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="t-h3 text-primary-text">Fundamental {f.score} / 200 — shared</h3>
                    <GradeBadge grade={gradeForPct(f.pct)} compact />
                  </div>
                  <p className="t-body text-muted-text mt-1 max-w-2xl">
                    Every instrument below is issued by {issuerName(isins[0].issuerId)}, so they share one issuer
                    assessment. It is shown once, as an anchor — it is not a point of difference. What differs is
                    everything underneath: the issuance terms, the covenants, and what you are paid.
                  </p>
                </div>
              </div>
            );
          })()
        ) : (
          <div className="glass-card p-5">
            <h3 className="t-h3 text-primary-text mb-1">Fundamental Score <span className="t-caption font-normal">· issuer /200 · shared across each issuer's ISINs</span></h3>
            <p className="t-caption mb-4">Start with the issuer. Two instruments can only be compared once you know whose credit stands behind them.</p>
            {(() => {
              const pcts = isins.map(a => getIssuerFundamental(a.issuerId)?.pct ?? null);
              const { best, worst } = rankExtremes(pcts, 'high');
              return (
                <div className="grid gap-3" style={{ gridTemplateColumns: labelCols }}>
                  <div />
                  {isins.map((a, i) => {
                    const f = getIssuerFundamental(a.issuerId);
                    return (
                      <div key={a.isin} className="rounded-xl p-3 flex flex-col items-center" style={cellRing(i, best, worst)}>
                        {f
                          ? <ScoreGauge score={f.score} max={f.max} pct={f.pct} size={116} strokeWidth={10} caption={shortName(a.issuerId)} />
                          : dash}
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}

        {/* Headline scores */}
        <div className="glass-card p-5">
          <h3 className="t-h3 text-primary-text mb-1">Score — this instrument</h3>
          <p className="t-caption mb-4">
            Total and Rating are ISIN-level: same issuer, different instrument, different answer.
            Best / worst in the selection highlighted per row.
          </p>
          <Row label="Total Score" hint="/500 — the authored roll-up for this instrument"
            values={scores.map(s => s?.total ?? null)} better="high"
            render={(v) => v == null ? notAssessed : <><span className="font-bold" style={{ color: '#2DD4BF' }}>{v}</span><span className="text-muted-text"> / 500</span></>} />
          <Row label="Total %" values={scores.map(s => s?.pct ?? null)} better="high"
            render={v => v == null ? dash : `${v}%`} />
          <Row label="Rating" hint="1 = best … 10 = worst"
            values={scores.map(s => s?.rating ?? null)} better="low"
            render={v => v == null ? dash : `R${v}`} />
          <Row label="Issuance" hint="/100 — ISIN-specific"
            values={scores.map(s => s?.issuance ?? null)} better="high"
            render={v => v == null ? dash : <>{v}<span className="text-muted-text"> / 100</span></>} />
          <Row label="Pricing" hint="/150 — ISIN-specific"
            values={scores.map(s => s?.pricing ?? null)} better="high"
            render={v => v == null ? dash : <>{v}<span className="text-muted-text"> / 150</span></>} />
          {!sharedFundamental && (
            <Row label="Economic & Sector" hint="/50 — issuer-level"
              values={scores.map(s => s?.economic ?? null)} better="high"
              render={v => v == null ? dash : <>{v}<span className="text-muted-text"> / 50</span></>} />
          )}
        </div>

        {/* Pricing */}
        <div className="glass-card p-5">
          <h3 className="t-h3 text-primary-text mb-1">Pricing &amp; yield</h3>
          <p className="t-caption mb-4">What you are actually paid, and how our pricing assessment reads it.</p>
          <Row label="Current YTM" values={isins.map(a => a.ytmCurrent ?? null)} better="high"
            render={v => v == null ? dash : <span style={{ color: '#2DD4BF' }}>{v.toFixed(2)}%</span>} />
          <Row label="YTM at issue" values={isins.map(a => a.ytmIssue ?? null)} better="high"
            render={v => v == null ? dash : `${v.toFixed(2)}%`} />
          <Row label="Coupon" values={isins.map(a => a.coupon ?? null)} better="high"
            render={v => v == null ? dash : `${v.toFixed(2)}%`} />
          <Row label="Credit risk premium" hint="Spread over the G-sec base"
            values={isins.map(a => a.pricing?.creditRiskPremium ?? null)} better="high"
            render={v => v == null ? dash : `${v.toFixed(2)}%`} />
          {PRICING_FACTORS.map(pf => (
            <TextRow key={pf.key} label={pf.label}
              render={a => {
                const f = a.pricing?.factors.find(x => x.key === pf.key);
                return f ? <GradeBadge grade={f.grade} compact /> : (a.assessed === false ? notAssessed : dash);
              }} />
          ))}
          <TextRow label="Recommendation"
            render={a => a.pricing?.recommendation
              ? <span className="text-xs text-primary-text">{a.pricing.recommendation}</span>
              : (a.assessed === false ? notAssessed : dash)} />
        </div>

        {/* Instrument terms */}
        <div className="glass-card p-5">
          <h3 className="t-h3 text-primary-text mb-4">Instrument &amp; ranking</h3>
          <TextRow label="Ranking"
            render={a => a.ranking ? <span className="text-xs text-primary-text">{a.ranking}</span> : dash} />
          <TextRow label="Seniority"
            render={a => a.seniority
              ? <span className="text-xs font-medium" style={{ color: a.seniority === 'senior' ? '#34D399' : '#FBBF24' }}>{a.seniority}</span>
              : dash} />
          <TextRow label="Secured"
            render={a => a.secured == null ? dash : (
              <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: a.secured ? '#34D399' : '#FB7185' }}>
                {a.secured ? <ShieldCheck size={12} /> : <ShieldOff size={12} />}{a.secured ? 'Secured' : 'Unsecured'}
              </span>
            )} />
          <TextRow label="Residual tenor"
            render={a => a.residualTenor ? <span className="text-xs font-mono-nums text-primary-text">{a.residualTenor}</span> : dash} />
          <TextRow label="Maturity / redemption"
            render={a => a.maturity ? <span className="text-xs font-mono-nums text-primary-text">{a.maturity}</span> : dash} />
          <TextRow label="Principal repayment"
            render={a => a.principalRepayment ? <span className="text-xs text-primary-text">{a.principalRepayment}</span> : dash} />
          <Row label="Issue size" values={isins.map(a => a.issueSize ?? null)} better="high"
            render={v => v == null ? dash : `₹${v} cr`} />
          <TextRow label="Listing"
            render={a => a.listing ? <span className="text-xs text-primary-text">{a.listing}</span> : dash} />
        </div>

        {/* Collateral */}
        <div className="glass-card p-5">
          <h3 className="t-h3 text-primary-text mb-4">Collateral</h3>
          <Row label="Security cover" hint="Higher cover is better, but cover quality depends on the underlying"
            values={isins.map(a => a.issuance?.collateral.securityCover ?? null)} better="high"
            render={v => v == null ? dash : `${v.toFixed(2)}x`} />
          <TextRow label="Collateral grade"
            render={a => a.issuance ? <GradeBadge grade={a.issuance.collateral.grade} compact /> : dash} />
          <TextRow label="Pool selection criteria"
            render={a => {
              const n = a.issuance?.collateral.selectionCriteria.length ?? 0;
              return n ? <span className="text-xs text-muted-text">{n} criteria</span> : dash;
            }} />
        </div>

        {/* Covenants */}
        <div className="glass-card p-5">
          <h3 className="t-h3 text-primary-text mb-1">Covenants</h3>
          <p className="t-caption mb-4">
            Count is not protection. A long list of loose covenants is worth less than one that binds —
            read the tightest alongside the quality mix.
          </p>
          <Row label="Covenants" values={covs.map(c => c.count || null)} better="high"
            render={v => v == null ? dash : v} />
          <Row label="Monitorable" hint="Covenants with a reported actual to test against"
            values={covs.map(c => c.measured || null)} better="high"
            render={v => v == null ? dash : v} />
          <TextRow label="Tightest covenant"
            render={(_a, i) => {
              const t = covs[i].tightest;
              if (!t) return dash;
              return (
                <div className="space-y-1">
                  <p className="text-xs text-primary-text leading-tight">{t.name}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[11px] font-mono-nums text-muted-text">{t.bufferPct}%</span>
                    <CovenantStatusChip status={t.status} compact />
                  </div>
                </div>
              );
            }} />
          <TextRow label="Quality mix" hint="How protective the covenant thresholds are, as authored"
            render={(_a, i) => {
              const q = covs[i].qualityCounts;
              if (!q.length) return dash;
              return (
                <div className="flex flex-wrap gap-1">
                  {q.map(x => (
                    <span key={x.grade} className="text-[10px] font-semibold px-1.5 py-0.5 rounded"
                      title={`${x.count} × ${x.grade}`}
                      style={{ background: `${gradeBarColor(x.grade)}22`, color: gradeBarColor(x.grade) }}>
                      {x.count}× {x.grade === 'Extremely Strong' ? 'Ext. Strong' : x.grade === 'Extremely Weak' ? 'Ext. Weak' : x.grade}
                    </span>
                  ))}
                </div>
              );
            }} />
        </div>
      </div>
    </div>
  );
};
