import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Scale, Check, ArrowUpRight, ArrowDownRight, X } from 'lucide-react';
import { ScoreGauge } from '../../components/ScoreGauge';
import { ScoreComposition } from '../../components/ScoreComposition';
import { YieldGauge } from '../../components/YieldGauge';
import { GradeBadge, gradeBarColor } from '../../components/GradeBadge';
import { getReport } from '../../data/reports';
import { coveredIssuers, issuerMetrics, RATIOS, SECTORS } from '../../data/sectors';
import type { SectorId, IssuerMetrics } from '../../data/sectors';

const recStyle = (rec: string): React.CSSProperties =>
  rec === 'Subscribe' ? { background: 'rgba(52,211,153,0.15)', color: '#34D399' } :
  rec === 'Avoid' ? { background: 'rgba(251,113,133,0.15)', color: '#FB7185' } :
  { background: 'rgba(251,191,36,0.15)', color: '#FBBF24' };

// Best/worst index within a numeric row (nulls ignored) given a direction.
const rankExtremes = (vals: (number | null)[], better: 'high' | 'low') => {
  const idx = vals.map((v, i) => ({ v, i })).filter((x): x is { v: number; i: number } => x.v !== null);
  if (idx.length < 2) return { best: -1, worst: -1 };
  const sorted = [...idx].sort((a, b) => better === 'high' ? b.v - a.v : a.v - b.v);
  return { best: sorted[0].i, worst: sorted[sorted.length - 1].i };
};

const cellRing = (i: number, best: number, worst: number): React.CSSProperties =>
  i === best ? { background: 'rgba(52,211,153,0.10)', boxShadow: 'inset 0 0 0 1px rgba(52,211,153,0.4)' } :
  i === worst ? { background: 'rgba(251,113,133,0.08)', boxShadow: 'inset 0 0 0 1px rgba(251,113,133,0.35)' } : {};

export const Compare: React.FC = () => {
  const all = useMemo(() => coveredIssuers(), []);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const [sector, setSector] = useState<SectorId | 'all'>('all');
  const [selected, setSelected] = useState<string[]>([]);

  // Preload from ?issuer=<id> (deep-link from a company page) — that issuer + its peers.
  useEffect(() => {
    const seed = params.get('issuer');
    if (seed) {
      const m = issuerMetrics(seed);
      if (m) {
        setSector(m.sector);
        const peers = all.filter(x => x.sector === m.sector).map(x => x.id);
        const ordered = [seed, ...peers.filter(id => id !== seed)].slice(0, 4);
        setSelected(ordered);
        return;
      }
    }
    // Default: first two covered issuers of the same sector if possible, else any two.
    const mfi = all.filter(x => x.sector === 'mfi').map(x => x.id);
    setSelected(mfi.length >= 2 ? mfi.slice(0, 2) : all.slice(0, 2).map(x => x.id));
  }, [params, all]);

  const available = sector === 'all' ? all : all.filter(m => m.sector === sector);

  const toggle = (id: string) => {
    setSelected(sel => {
      if (sel.includes(id)) return sel.filter(x => x !== id);
      if (sel.length >= 4) return sel;
      return [...sel, id];
    });
  };

  const chosen: IssuerMetrics[] = selected
    .map(id => available.find(m => m.id === id))
    .filter((x): x is IssuerMetrics => !!x);

  const setSectorFilter = (s: SectorId | 'all') => {
    setSector(s);
    if (s !== 'all') setSelected(sel => sel.filter(id => all.find(m => m.id === id)?.sector === s));
  };

  const cols = `repeat(${Math.max(chosen.length, 1)}, minmax(200px, 1fr))`;
  const labelCols = `180px repeat(${Math.max(chosen.length, 1)}, minmax(160px, 1fr))`;

  return (
    <div className="p-6 page-fade">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Scale size={18} style={{ color: '#2DD4BF' }} />
          <h1 className="t-h1 text-primary-text">Compare issuers</h1>
        </div>
        <p className="t-lead mt-1">Put 2–4 covered issuers side by side — scores, composition, factors, ratios and yield. Filter by sector to keep it like-for-like.</p>
      </div>

      {/* Controls */}
      <div className="glass-card p-5 mb-5">
        <div className="flex items-center gap-2 flex-wrap mb-4">
          <span className="t-eyebrow mr-1">Sector</span>
          {(['all', ...SECTORS.map(s => s.id)] as (SectorId | 'all')[]).map(s => {
            const on = sector === s;
            const label = s === 'all' ? 'All sectors' : SECTORS.find(x => x.id === s)!.name;
            return (
              <button key={s} onClick={() => setSectorFilter(s)}
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                aria-pressed={on}
                style={on
                  ? { background: 'rgba(45,212,191,0.15)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.35)' }
                  : { background: 'rgba(255,255,255,0.05)', color: '#9CB3B1', border: '1px solid rgba(255,255,255,0.1)' }}>
                {label}
              </button>
            );
          })}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="t-eyebrow mr-1">Issuers ({chosen.length}/4)</span>
          {available.map(m => {
            const on = selected.includes(m.id);
            const disabled = !on && selected.length >= 4;
            return (
              <button key={m.id} onClick={() => toggle(m.id)} disabled={disabled}
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                aria-pressed={on}
                style={on
                  ? { background: 'rgba(45,212,191,0.15)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.35)' }
                  : { background: 'rgba(255,255,255,0.05)', color: '#9CB3B1', border: '1px solid rgba(255,255,255,0.1)' }}>
                {on && <Check size={12} />}{m.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {chosen.length < 2 ? (
        <div className="glass-card p-10 text-center">
          <p className="t-lead">Pick at least two issuers to compare.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="min-w-fit space-y-4">
            {/* Issuer header */}
            <div className="grid gap-4" style={{ gridTemplateColumns: cols }}>
              {chosen.map(m => (
                <div key={m.id} className="glass-card-elevated p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <button onClick={() => navigate(`/app/company/${m.id}`)} className="text-left">
                        <p className="t-h3 text-primary-text truncate hover:text-brand-teal transition-colors">{m.shortName}</p>
                      </button>
                      <p className="t-caption truncate">{m.sectorName}</p>
                    </div>
                    <button onClick={() => toggle(m.id)} aria-label={`Remove ${m.shortName}`} className="text-muted-text hover:text-primary-text shrink-0"><X size={15} /></button>
                  </div>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={recStyle(m.recommendation)}>{m.recommendation}</span>
                    <span className="t-caption">{m.externalRating}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Fundamental Score gauges (higher pct = better) */}
            <div className="glass-card p-5">
              <h3 className="t-h3 text-primary-text mb-4">Fundamental Score <span className="t-caption font-normal">· issuer /200</span></h3>
              {(() => {
                const { best, worst } = rankExtremes(chosen.map(m => m.fundamental.pct), 'high');
                return (
                  <div className="grid gap-4" style={{ gridTemplateColumns: cols }}>
                    {chosen.map((m, i) => (
                      <div key={m.id} className="rounded-xl p-3 flex flex-col items-center" style={cellRing(i, best, worst)}>
                        <ScoreGauge score={m.fundamental.score} max={m.fundamental.max} pct={m.fundamental.pct} size={130} strokeWidth={11} caption={m.shortName} />
                        {m.delta12m != null && (
                          <span className="mt-1 inline-flex items-center gap-0.5 text-[11px] font-semibold" style={{ color: m.delta12m >= 0 ? '#34D399' : '#FB7185' }}>
                            {m.delta12m >= 0 ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}{m.delta12m > 0 ? '+' : ''}{m.delta12m} over 12m
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>

            {/* Total Score composition */}
            <div className="grid gap-4" style={{ gridTemplateColumns: cols }}>
              {chosen.map(m => {
                const report = getReport(m.id)!;
                return (
                  <ScoreComposition key={m.id} components={m.components} scorecard={report.scorecard}
                    combinedScore={m.total.score} combinedPct={m.total.pct} rating={m.total.rating} combinedMax={m.total.max} />
                );
              })}
            </div>

            {/* Pillar grades */}
            <div className="glass-card p-5">
              <h3 className="t-h3 text-primary-text mb-4">Pillar grades</h3>
              <div className="space-y-2">
                {chosen[0].pillarGrades.map((p, rowIdx) => (
                  <div key={p.name} className="grid gap-4 items-center py-1.5" style={{ gridTemplateColumns: labelCols, borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <span className="t-body text-muted-text">{p.name}</span>
                    {chosen.map(m => (
                      <div key={m.id}><GradeBadge grade={m.pillarGrades[rowIdx]?.grade ?? p.grade} compact /></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Factor heatmap grid (issuers × 10 issuer factors) */}
            <div className="glass-card p-5">
              <h3 className="t-h3 text-primary-text mb-1">Factor heatmap</h3>
              <p className="t-caption mb-4">The 10 issuer factors, tinted by each report's authored grade.</p>
              <div className="space-y-1.5">
                {chosen[0].issuerFactors.map((f, rowIdx) => (
                  <div key={f.name} className="grid gap-4 items-center" style={{ gridTemplateColumns: labelCols }}>
                    <span className="t-label font-normal text-primary-text/90">{f.name}</span>
                    {chosen.map(m => {
                      const g = m.issuerFactors[rowIdx]?.grade ?? f.grade;
                      const c = gradeBarColor(g);
                      return (
                        <div key={m.id} className="rounded-lg px-2.5 py-2 text-center" style={{ background: `${c}1f`, border: `1px solid ${c}40` }} title={`${m.shortName} · ${f.name}: ${g}`}>
                          <span className="text-[11px] font-semibold" style={{ color: c }}>{g}</span>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* Key financial ratios with rank-in-selection */}
            <div className="glass-card p-5">
              <h3 className="t-h3 text-primary-text mb-1">Key financial ratios</h3>
              <p className="t-caption mb-4">Latest reported value. Best / worst in the selection highlighted per row.</p>
              <div className="space-y-1">
                {RATIOS.map(r => {
                  const vals = chosen.map(m => m.ratios[r.key]);
                  const { best, worst } = rankExtremes(vals, r.better);
                  return (
                    <div key={r.key} className="grid gap-4 items-center py-1" style={{ gridTemplateColumns: labelCols }}>
                      <span className="t-body text-muted-text">{r.label} <span className="t-caption">{r.unit}</span></span>
                      {vals.map((v, i) => (
                        <div key={i} className="rounded-lg px-3 py-2 text-right font-mono-nums text-sm text-primary-text" style={cellRing(i, best, worst)}>
                          {v === null ? <span className="text-muted-text">—</span> : v}
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Yield & spread */}
            <div className="glass-card p-5">
              <h3 className="t-h3 text-primary-text mb-4">Yield &amp; spread</h3>
              <div className="grid gap-4" style={{ gridTemplateColumns: cols }}>
                {chosen.map(m => (
                  <div key={m.id}>
                    <p className="t-caption mb-2 text-center">{m.shortName}</p>
                    <YieldGauge data={m.yieldOverview} compact />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
