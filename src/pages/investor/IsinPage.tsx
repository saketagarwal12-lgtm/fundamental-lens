import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeft, Building2, ShieldCheck, Scale, AlertTriangle, Globe, Layers, Gavel, Coins,
} from 'lucide-react';
import { ScoreGauge } from '../../components/ScoreGauge';
import { ScoreComposition } from '../../components/ScoreComposition';
import { FactorHeatmap } from '../../components/FactorHeatmap';
import { GradeBadge, gradeBarColor } from '../../components/GradeBadge';
import { MetricCard } from '../../components/MetricCard';
import { YieldGauge } from '../../components/YieldGauge';
import { PeerYieldRange } from '../../components/PeerYieldRange';
import { IllustrativeBadge, IllustrativeNotice } from '../../components/IllustrativeBadge';
import { ActiveIsinsPanel } from '../../components/ActiveIsinsPanel';
import { companies } from '../../data/companies';
import { getReport } from '../../data/reports';
import type { PeerRow } from '../../data/reports';
import { peersInSector } from '../../data/peers';
import { sectorMeta } from '../../data/sectors';
import { gradeForPct } from '../../data/score';
import {
  getIsinAssessment, getIsinScore, getIsinComponents, getIsinScorecard,
  getIssuerFundamental, getIssuerEconomic,
} from '../../data/isins';
import { covenantBuffer, latestActual, activeThreshold, covenantStatus, COVENANT_STATUS_COLOUR, nextStep } from '../../data/covenants';

// ── Small building blocks ────────────────────────────────────────────────────

const Section: React.FC<{
  title: string; score: string; grade?: React.ReactNode; icon: typeof Globe;
  shared?: boolean; children: React.ReactNode;
}> = ({ title, score, grade, icon: Icon, shared, children }) => (
  <section className="space-y-4">
    <div className="flex items-center gap-3 flex-wrap">
      <Icon size={16} className="text-brand-teal shrink-0" />
      <h2 className="t-h2 text-primary-text">{title}</h2>
      <span className="font-mono-nums text-sm text-muted-text">{score}</span>
      {grade}
      {shared && (
        <span
          title="Issuer-level — identical across every ISIN of this issuer"
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(56,189,248,0.15)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.3)' }}
        >
          Shared · common to all ISINs
        </span>
      )}
      {!shared && (
        <span
          title="Assessed for this instrument specifically"
          className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
          style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.25)' }}
        >
          This ISIN
        </span>
      )}
    </div>
    {children}
  </section>
);

const Meta: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="text-[10px] text-muted-text mb-0.5">{label}</p>
    <p className="text-xs font-mono-nums text-primary-text">{value ?? '—'}</p>
  </div>
);

// A pricing comparison band with a marker for where this instrument sits.
const RangeRow: React.FC<{ label: string; range?: [number, number]; marker?: number; markerLabel: string; grade: React.ReactNode }> = ({
  label, range, marker, markerLabel, grade,
}) => {
  if (!range || marker == null) return null;
  const [lo, hi] = range;
  const min = Math.min(lo, marker) - 0.6;
  const max = Math.max(hi, marker) + 0.6;
  const span = max - min || 1;
  const pct = (v: number) => `${((v - min) / span) * 100}%`;
  const inside = marker >= lo && marker <= hi;

  return (
    <div className="py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
        <span className="text-xs font-medium text-primary-text">{label}</span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono-nums text-muted-text">{lo.toFixed(2)}–{hi.toFixed(2)}%</span>
          {grade}
        </div>
      </div>
      <div className="relative h-6">
        <div className="absolute inset-x-0 top-2.5 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <div className="absolute top-2.5 h-1 rounded-full" style={{ left: pct(lo), width: `${((hi - lo) / span) * 100}%`, background: 'rgba(45,212,191,0.35)' }} />
        <div
          className="absolute top-0 -translate-x-1/2 flex flex-col items-center"
          style={{ left: pct(marker) }}
          title={`${markerLabel} ${marker.toFixed(2)}% — ${inside ? 'within' : 'outside'} the ${label.toLowerCase()} band`}
        >
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: inside ? '#2DD4BF' : '#FBBF24', boxShadow: `0 0 8px ${inside ? '#2DD4BF' : '#FBBF24'}` }} />
          <span className="text-[9px] font-mono-nums mt-0.5 whitespace-nowrap" style={{ color: inside ? '#2DD4BF' : '#FBBF24' }}>{marker.toFixed(2)}%</span>
        </div>
      </div>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────

export const IsinPage: React.FC = () => {
  const { isin = '' } = useParams<{ isin: string }>();
  const navigate = useNavigate();

  const a = getIsinAssessment(isin);
  if (!a) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <p className="text-muted-text">No instrument on record for ISIN “{isin}”.</p>
        <button onClick={() => navigate('/app/dashboard')} className="text-brand-teal hover:underline text-sm">Back to dashboard</button>
      </div>
    );
  }

  const issuer = companies.find(c => c.id === a.issuerId);
  const report = getReport(a.issuerId);
  const score = getIsinScore(a.isin);
  const components = getIsinComponents(a.isin);
  const scorecard = getIsinScorecard(a.isin);
  const fundamental = getIssuerFundamental(a.issuerId);
  const economic = getIssuerEconomic(a.issuerId);

  const peers: PeerRow[] = report?.peers ?? peersInSector(a.sector).map(p => ({
    issuer: p.issuer, rating: p.externalRating, aum: p.aum, isin: p.isin,
    redemption: '—', ytm: p.ytm, tenor: p.tenor ?? '—',
  }));

  return (
    <div className="p-6 space-y-8 page-fade">
      {/* ── Header ── */}
      <header className="glass-card-elevated p-6">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-xs text-muted-text hover:text-brand-teal transition-colors mb-4">
          <ArrowLeft size={13} /> Back
        </button>

        <div className="flex items-start justify-between gap-6 flex-wrap">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="font-mono-nums t-h1 text-primary-text">{a.isin}</span>
              {a.illustrative && <IllustrativeBadge />}
              {a.assessed === false && (
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(156,179,177,0.15)', color: '#9CB3B1' }}>Not yet assessed</span>
              )}
            </div>

            <Link to={`/app/company/${a.issuerId}`} className="inline-flex items-center gap-1.5 text-sm text-brand-teal hover:underline">
              <Building2 size={14} /> {issuer?.name ?? a.issuerId}
            </Link>
            <p className="text-xs text-muted-text mt-1">
              {sectorMeta(a.sector).name}
              {a.ranking ? ` · ${a.ranking}` : ''}
              {a.listing ? ` · ${a.listing}` : ''}
              {a.externalRating ? ` · ${a.externalRating}` : ''}
            </p>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              <span
                title="The Fundamental Score is assessed at issuer level and is identical across every ISIN of this issuer"
                className="text-[11px] font-medium px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(56,189,248,0.12)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.28)' }}
              >
                Fundamental {fundamental?.score ?? '—'} / 200 · issuer-level
              </span>
              {a.implicit && (
                <span className="text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(156,179,177,0.12)', color: '#9CB3B1' }}>
                  Issuer-only coverage
                </span>
              )}
            </div>
          </div>

          {score && (
            <div className="text-right shrink-0">
              <p className="t-eyebrow mb-1">Total Score · this ISIN</p>
              <p className="font-mono-nums">
                <span className="text-3xl font-bold" style={{ color: '#2DD4BF' }}>{score.total}</span>
                <span className="text-muted-text text-lg"> / 500</span>
              </p>
              <p className="text-xs text-muted-text font-mono-nums mt-1">
                {score.pct}% ·{' '}
                <span className="font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }} title="Internal rating, 1 = best … 10 = worst">
                  Rating {score.rating}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Instrument meta */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mt-6 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <Meta label="Coupon" value={a.coupon != null ? `${a.coupon.toFixed(2)}%${a.couponFrequency ? ` · ${a.couponFrequency}` : ''}` : undefined} />
          <Meta label="YTM at issue" value={a.ytmIssue != null ? `${a.ytmIssue.toFixed(2)}%` : undefined} />
          <Meta label="Current YTM" value={a.ytmCurrent != null ? <span style={{ color: '#2DD4BF' }}>{a.ytmCurrent.toFixed(2)}%</span> : undefined} />
          <Meta label="Face value" value={a.faceValueLabel} />
          <Meta label="Issue size" value={a.issueSize != null ? `₹${a.issueSize} cr` : undefined} />
          <Meta label="Maturity" value={a.maturity} />
          <Meta label="Residual tenor" value={a.residualTenor} />
        </div>
      </header>

      {a.illustrative && <IllustrativeNotice />}

      {a.todo?.length && !a.illustrative ? (
        <div className="rounded-xl px-4 py-3 flex items-start gap-3" style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.25)' }}>
          <AlertTriangle size={15} className="shrink-0 mt-0.5" style={{ color: '#FBBF24' }} />
          <div className="space-y-1">
            {a.todo.map(t => <p key={t} className="text-xs leading-relaxed" style={{ color: '#FBBF24' }}>{t}</p>)}
          </div>
        </div>
      ) : null}

      {/* ── Not-yet-assessed short circuit ── */}
      {!score || !components || !scorecard ? (
        <div className="glass-card p-8 text-center space-y-3">
          <p className="t-h3 text-primary-text">This instrument is not yet assessed</p>
          <p className="text-sm text-muted-text max-w-xl mx-auto">
            Its terms are on record, but Issuance, Pricing and covenants have not been authored, so it carries no
            Total Score or Rating. The issuer's Fundamental Score of {fundamental?.score ?? '—'}/200 still applies —
            it is assessed at issuer level and shared across every ISIN.
          </p>
          <Link to={`/app/company/${a.issuerId}`} className="inline-block text-brand-teal hover:underline text-sm">
            View the issuer's research →
          </Link>
        </div>
      ) : (
        <>
          {/* ── Total Score composition ── */}
          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <ScoreComposition
              components={components}
              scorecard={scorecard}
              combinedScore={score.total}
              combinedPct={score.pct}
              rating={score.rating}
            />
            <div className="glass-card p-5 flex flex-col items-center justify-center gap-3">
              <ScoreGauge score={score.fundamental} max={200} pct={fundamental?.pct ?? 0} caption="Fundamental Score" />
              <p className="text-[11px] text-center text-muted-text max-w-[16rem]">
                Issuer-level and shared. Two ISINs of this issuer differ on Issuance and Pricing — never on this number.
              </p>
            </div>
          </section>

          {/* ── 1 · Fundamental (shared) ── */}
          <Section title="Fundamental" score={`${score.fundamental} / 200`} icon={Layers} shared
            grade={fundamental ? <GradeBadge grade={gradeForPct(fundamental.pct)} compact /> : undefined}>
            <div className="grid gap-4 md:grid-cols-2">
              {fundamental?.pillars.map(p => (
                <div key={p.key} className="glass-card p-5">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h3 className="text-sm font-semibold text-primary-text">{p.label}</h3>
                    <span className="font-mono-nums text-sm font-semibold" style={{ color: gradeBarColor(p.grade) }}>{p.score}%</span>
                  </div>
                  <FactorHeatmap factors={p.factors.map(f => ({ name: f.label, grade: f.grade, pct: f.pct }))} />
                </div>
              ))}
            </div>
          </Section>

          {/* ── 2 · Issuance (this ISIN) ── */}
          <Section title="Issuance assessment" score={`${score.issuance} / 100`} icon={ShieldCheck}
            grade={a.issuance ? <GradeBadge grade={a.issuance.grade} compact /> : undefined}>
            {a.issuance && a.issuance.factors.length > 0 ? (
              <FactorHeatmap factors={a.issuance.factors.map(f => ({ name: f.label, grade: f.grade, pct: f.pct }))} />
            ) : (
              <p className="glass-card p-4 text-xs" style={{ color: '#FBBF24' }}>
                Issuance factors are not yet authored for this instrument.
              </p>
            )}

            {a.issuance && a.issuance.factors.length > 0 && (
              <div className="glass-card p-5 space-y-3">
                {a.issuance.factors.map(f => (
                  <div key={f.key} className="flex items-start gap-3">
                    <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: gradeBarColor(f.grade) }} />
                    <p className="text-xs text-muted-text leading-relaxed">
                      <span className="font-medium text-primary-text">{f.label}</span>
                      <span className="mx-1.5" style={{ color: gradeBarColor(f.grade) }}>· {f.grade}</span>
                      — {f.commentary}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Financial covenants — the §3 monitor lands here */}
            {a.issuance && a.issuance.covenants.length > 0 && (
              <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
                  <h3 className="text-sm font-semibold text-primary-text flex items-center gap-2">
                    <Gavel size={14} className="text-brand-teal" /> Financial covenants
                  </h3>
                  <span className="text-[11px] text-muted-text">{a.issuance.covenants.length} covenants monitored</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="text-left" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <th className="pb-2 pr-3 t-eyebrow font-medium">Covenant</th>
                        <th className="pb-2 pr-3 t-eyebrow font-medium">Condition</th>
                        <th className="pb-2 pr-3 t-eyebrow font-medium text-right">Threshold</th>
                        <th className="pb-2 pr-3 t-eyebrow font-medium text-right">Latest</th>
                        <th className="pb-2 pr-3 t-eyebrow font-medium text-right">Buffer</th>
                        <th className="pb-2 pr-3 t-eyebrow font-medium">Status</th>
                        <th className="pb-2 t-eyebrow font-medium">Quality</th>
                      </tr>
                    </thead>
                    <tbody>
                      {a.issuance.covenants.map(cov =>
                        cov.conditions.length === 0 ? (
                          <tr key={cov.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td className="py-2.5 pr-3 text-primary-text font-medium align-top">{cov.name}</td>
                            <td className="py-2.5 pr-3 text-muted-text align-top" colSpan={5}>{cov.statusText}</td>
                            <td className="py-2.5 align-top"><GradeBadge grade={cov.qualityGrade} compact /></td>
                          </tr>
                        ) : (
                          cov.conditions.map((c, ci) => {
                            const la = latestActual(c);
                            const r = covenantBuffer(c, la?.value ?? null);
                            const st = covenantStatus(r.bufferPct, r.breached);
                            const step = nextStep(c);
                            return (
                              <tr key={`${cov.id}-${ci}`} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td className="py-2.5 pr-3 text-primary-text font-medium align-top">{ci === 0 ? cov.name : ''}</td>
                                <td className="py-2.5 pr-3 text-muted-text align-top">
                                  {c.metric}
                                  {c.indicative && (
                                    <span className="ml-1.5 text-[9px] font-semibold px-1 py-0.5 rounded" style={{ background: 'rgba(251,191,36,0.15)', color: '#FBBF24' }} title={c.indicativeNote}>
                                      indicative
                                    </span>
                                  )}
                                </td>
                                <td className="py-2.5 pr-3 text-right font-mono-nums text-primary-text align-top">
                                  {activeThreshold(c) != null ? `${c.op === 'gte' ? '≥' : c.op === 'lte' ? '≤' : '='} ${activeThreshold(c)}${c.unit}` : '—'}
                                  {step && <span className="block text-[9px] text-muted-text">→ {step.threshold}{c.unit} {step.label}</span>}
                                </td>
                                <td className="py-2.5 pr-3 text-right font-mono-nums text-primary-text align-top">
                                  {la ? `${la.value}${c.unit}` : <span className="text-muted-text">no data</span>}
                                </td>
                                <td className="py-2.5 pr-3 text-right font-mono-nums align-top" style={{ color: r.breached ? '#E11D48' : '#9CB3B1' }}>
                                  {r.buffer != null ? `${r.buffer > 0 ? '+' : ''}${r.buffer}${c.unit}` : '—'}
                                  {r.bufferPct != null && <span className="block text-[9px] text-muted-text">{r.bufferPct}%</span>}
                                </td>
                                <td className="py-2.5 pr-3 align-top">
                                  {la ? (
                                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${COVENANT_STATUS_COLOUR[st]}22`, color: COVENANT_STATUS_COLOUR[st] }}>{st}</span>
                                  ) : <span className="text-muted-text text-[10px]">—</span>}
                                </td>
                                <td className="py-2.5 align-top">{ci === 0 ? <GradeBadge grade={cov.qualityGrade} compact /> : null}</td>
                              </tr>
                            );
                          })
                        ),
                      )}
                    </tbody>
                  </table>
                </div>

                <p className="text-[11px] text-muted-text mt-3 leading-relaxed">
                  <strong className="text-primary-text">Quality and headroom are not the same thing.</strong> Quality is our
                  authored view of how protective a threshold is; buffer is arithmetic — how far the reported actual sits from
                  breach. A loose covenant shows a large buffer precisely because it protects you less.
                </p>
                {a.issuance.testing && <p className="text-[11px] text-muted-text mt-2">{a.issuance.testing}</p>}
              </div>
            )}

            {/* Collateral + structural clauses */}
            <div className="grid gap-4 md:grid-cols-2">
              {a.issuance && (
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <h3 className="text-sm font-semibold text-primary-text flex items-center gap-2"><Coins size={14} className="text-brand-teal" /> Collateral</h3>
                    <div className="flex items-center gap-2">
                      {a.issuance.collateral.securityCover != null && (
                        <span className="font-mono-nums text-sm font-semibold" style={{ color: '#2DD4BF' }}>{a.issuance.collateral.securityCover.toFixed(2)}x</span>
                      )}
                      <GradeBadge grade={a.issuance.collateral.grade} compact />
                    </div>
                  </div>
                  <p className="text-xs text-muted-text leading-relaxed mb-3">{a.issuance.collateral.note}</p>
                  {a.issuance.collateral.selectionCriteria.length > 0 && (
                    <>
                      <p className="t-eyebrow mb-2">Pool selection criteria</p>
                      <ul className="space-y-1.5">
                        {a.issuance.collateral.selectionCriteria.map(c => (
                          <li key={c} className="text-xs text-muted-text flex items-start gap-2">
                            <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: '#2DD4BF' }} />{c}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {a.structuralClauses && a.structuralClauses.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="text-sm font-semibold text-primary-text mb-3 flex items-center gap-2"><Scale size={14} className="text-brand-teal" /> Structural clauses</h3>
                  <ul className="space-y-2">
                    {a.structuralClauses.map(c => (
                      <li key={c} className="text-xs text-muted-text flex items-start gap-2">
                        <span className="w-1 h-1 rounded-full mt-1.5 shrink-0" style={{ background: '#FBBF24' }} />{c}
                      </li>
                    ))}
                  </ul>
                  {a.principalRepayment && (
                    <p className="text-[11px] text-muted-text mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      Principal: {a.principalRepayment}
                    </p>
                  )}
                </div>
              )}
            </div>
          </Section>

          {/* ── 3 · Pricing (this ISIN) ── */}
          <Section title="Pricing & yield" score={`${score.pricing} / 150`} icon={Coins}
            grade={a.pricing ? <GradeBadge grade={a.pricing.grade} compact /> : undefined}>
            {a.pricing && (
              <>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <MetricCard label="Current YTM" value={a.pricing.ytm?.toFixed(2) ?? '—'} unit="%" highlight />
                  <MetricCard label="G-sec base" value={a.pricing.gsec?.toFixed(2) ?? '—'} unit="%" />
                  <MetricCard label="Credit risk premium" value={a.pricing.creditRiskPremium?.toFixed(2) ?? '—'} unit="%" />
                  <MetricCard label="Recommendation" value={a.pricing.recommendation ?? 'TODO'} />
                </div>

                {a.pricing.gsec != null && a.pricing.creditRiskPremium != null && (a.pricing.recentRange || a.pricing.peerRange) && (
                  <YieldGauge data={{
                    currentYtm: a.pricing.ytm ?? 0,
                    gsecBase: a.pricing.gsec,
                    creditRiskPremium: a.pricing.creditRiskPremium,
                    rangeLow: (a.pricing.recentRange ?? a.pricing.peerRange)![0],
                    rangeHigh: (a.pricing.recentRange ?? a.pricing.peerRange)![1],
                  }} />
                )}

                {a.pricing.factors.length > 0 ? (
                  <div className="glass-card p-5">
                    <h3 className="text-sm font-semibold text-primary-text mb-1">Where this instrument prices</h3>
                    <p className="text-[11px] text-muted-text mb-3">
                      The first three bands are read against the credit risk premium; recent issuances against the YTM.
                    </p>
                    <RangeRow label="Benchmark credit risk premium" range={a.pricing.benchmarkRange} marker={a.pricing.creditRiskPremium} markerLabel="CRP"
                      grade={<GradeBadge grade={a.pricing.factors.find(f => f.key === 'benchmark')?.grade ?? 'Moderate'} compact />} />
                    <RangeRow label="Internal assessment" range={a.pricing.internalRange} marker={a.pricing.creditRiskPremium} markerLabel="CRP"
                      grade={<GradeBadge grade={a.pricing.factors.find(f => f.key === 'internal')?.grade ?? 'Moderate'} compact />} />
                    <RangeRow label="Comparable peers" range={a.pricing.peerRange} marker={a.pricing.creditRiskPremium} markerLabel="CRP"
                      grade={<GradeBadge grade={a.pricing.factors.find(f => f.key === 'peer')?.grade ?? 'Moderate'} compact />} />
                    <RangeRow label="Recent issuances" range={a.pricing.recentRange} marker={a.pricing.ytm} markerLabel="YTM"
                      grade={<GradeBadge grade={a.pricing.factors.find(f => f.key === 'recent')?.grade ?? 'Moderate'} compact />} />

                    <div className="mt-4 space-y-3 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                      {a.pricing.factors.map(f => (
                        <div key={f.key} className="flex items-start gap-3">
                          <span className="w-1 h-1 rounded-full mt-2 shrink-0" style={{ background: gradeBarColor(f.grade) }} />
                          <p className="text-xs text-muted-text leading-relaxed">
                            <span className="font-medium text-primary-text">{f.label}</span>
                            <span className="mx-1.5" style={{ color: gradeBarColor(f.grade) }}>· {f.grade}</span>
                            — {f.commentary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="glass-card p-4 text-xs" style={{ color: '#FBBF24' }}>
                    Pricing factors are not yet authored for this instrument.
                  </p>
                )}

                {a.marketLiquidityNote && (
                  <p className="text-xs text-muted-text glass-card p-4">{a.marketLiquidityNote}</p>
                )}

                {peers.length > 0 && a.pricing.ytm != null && (
                  <PeerYieldRange peers={peers} thisIssuer={issuer?.name ?? a.issuerId} thisYtm={a.pricing.ytm} thisRating={a.externalRating ?? '—'} />
                )}
              </>
            )}
          </Section>

          {/* ── 4 · Economic & Sector (shared) ── */}
          <Section title="Economic & sector" score={`${score.economic} / 50`} icon={Globe} shared
            grade={economic ? <GradeBadge grade={economic.grade} compact /> : undefined}>
            <div className="glass-card p-5">
              <FactorHeatmap factors={(economic?.factors ?? []).map(f => ({ name: f.label, grade: f.grade, pct: f.pct }))} />
              {report && (
                <p className="text-xs text-muted-text leading-relaxed mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  {report.sectorOutlook.subSector}
                </p>
              )}
            </div>
          </Section>
        </>
      )}

      {/* ── Other ISINs of this issuer ── */}
      <section className="pt-2">
        <ActiveIsinsPanel issuerId={a.issuerId} currentIsin={a.isin} />
      </section>
    </div>
  );
};
