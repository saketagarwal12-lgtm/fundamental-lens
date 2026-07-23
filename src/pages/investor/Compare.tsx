import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Scale, Check, ArrowUpRight, ArrowDownRight, X, Building2, Receipt } from 'lucide-react';
import { ScoreGauge } from '../../components/ScoreGauge';
import { GradeBadge, gradeBarColor } from '../../components/GradeBadge';
import { IsinCompareGrid } from '../../components/IsinCompareGrid';
import { IllustrativeBadge } from '../../components/IllustrativeBadge';
import { rankExtremes, cellRing } from '../../components/compareGrid';
import { PageNav } from '../../components/PageNav';
import { externalRatingLabel } from '../../data/display';
import { coveredIssuers, issuerMetrics, RATIOS, SECTORS, sectorMeta } from '../../data/sectors';
import type { SectorId, IssuerMetrics } from '../../data/sectors';
import { allIsins } from '../../data/isins';
import { companies } from '../../data/companies';
import { peerUniverse } from '../../data/peers';

type Mode = 'issuers' | 'isins';

export const Compare: React.FC = () => {
  const all = useMemo(() => coveredIssuers(), []);
  const [params, setParams] = useSearchParams();
  const navigate = useNavigate();

  // Selection lives in the URL (§2c) so browser back/forward and shared links
  // reproduce the exact view: ?mode=&sector=&issuers=a,b&isins=X,Y
  const [mode, setMode] = useState<Mode>(params.get('mode') === 'isins' ? 'isins' : 'issuers');
  const [sector, setSector] = useState<SectorId | 'all'>((params.get('sector') as SectorId | 'all') ?? 'all');
  const [selected, setSelected] = useState<string[]>([]);

  // Preload from ?issuers=… , or ?issuer=<id> (deep-link from a company page).
  useEffect(() => {
    const listed = params.get('issuers')?.split(',').filter(Boolean);
    if (listed?.length) {
      setSelected(listed.filter(id => all.some(m => m.id === id)).slice(0, 4));
      return;
    }
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
    // Intentionally seeded once from the initial URL; later edits write back below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all]);

  const available = sector === 'all' ? all : all.filter(m => m.sector === sector);

  // ── Mode B — cross-issuer, ISIN level ──────────────────────────────────────
  const assessedIsins = useMemo(() => allIsins().filter(i => i.assessed !== false), []);
  const [selectedIsins, setSelectedIsins] = useState<string[]>([]);

  useEffect(() => {
    const listed = params.get('isins')?.split(',').filter(Boolean);
    if (listed?.length) {
      setSelectedIsins(listed.filter(x => assessedIsins.some(i => i.isin === x)).slice(0, 4));
      return;
    }
    // Default to one ISIN from each of two different issuers — the point of Mode B
    // is cross-issuer, so seeding two of the same issuer's would miss it.
    const byIssuer = new Map<string, string>();
    for (const i of assessedIsins) if (!byIssuer.has(i.issuerId)) byIssuer.set(i.issuerId, i.isin);
    setSelectedIsins([...byIssuer.values()].slice(0, 2));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assessedIsins]);

  // Write the current view back to the URL (replace, so we don't spam history).
  useEffect(() => {
    const next = new URLSearchParams();
    if (mode !== 'issuers') next.set('mode', mode);
    if (sector !== 'all') next.set('sector', sector);
    if (selected.length) next.set('issuers', selected.join(','));
    if (selectedIsins.length) next.set('isins', selectedIsins.join(','));
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, sector, selected, selectedIsins]);

  const chosenIsins = selectedIsins
    .map(isin => assessedIsins.find(i => i.isin === isin))
    .filter((x): x is NonNullable<typeof x> => !!x);

  const toggleIsin = (isin: string) =>
    setSelectedIsins(sel => {
      if (sel.includes(isin)) return sel.length <= 1 ? sel : sel.filter(x => x !== isin);
      if (sel.length >= 4) return sel;
      return [...sel, isin];
    });

  // §K5 market-reference comparators, limited to the sectors on screen.
  const sectorsOnScreen = new Set(chosenIsins.map(i => i.sector));
  const referencePeers = peerUniverse
    .filter(p => sectorsOnScreen.has(p.sector))
    .sort((a, b) => a.ytm - b.ytm);

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
      <PageNav
        up={{ label: 'Dashboard', to: '/app/dashboard' }}
        crumbs={[{ label: 'Dashboard', to: '/app/dashboard' }, { label: mode === 'isins' ? 'Compare instruments' : 'Compare issuers' }]}
      />

      <div className="mb-5">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <Scale size={18} style={{ color: '#2DD4BF' }} />
              <h1 className="t-h1 text-primary-text">Compare</h1>
            </div>
            <p className="t-lead mt-1 max-w-3xl">
              {mode === 'issuers'
                ? 'Put 2–4 covered issuers side by side — scores, composition, factors, ratios and yield. Filter by sector to keep it like-for-like.'
                : 'Compare instruments across issuers. It starts with the issuer — you cannot read a bond without knowing whose credit stands behind it — then continues into what differs at the instrument level.'}
            </p>
          </div>

          <div className="pill-track flex shrink-0" role="tablist" aria-label="Comparison mode">
            {([
              ['issuers', 'By issuer', Building2],
              ['isins', 'By ISIN', Receipt],
            ] as const).map(([m, label, Icon]) => (
              <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}
                className={`px-3 py-1.5 text-xs transition-colors inline-flex items-center gap-1.5 ${mode === m ? 'pill-active' : 'pill-inactive'}`}>
                <Icon size={12} /> {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {mode === 'isins' ? (
        <>
          {/* ISIN selector — grouped by issuer */}
          <div className="glass-card p-5 mb-5">
            <span className="t-eyebrow">Instruments ({chosenIsins.length}/4)</span>
            <div className="mt-3 space-y-3">
              {companies
                .filter(c => assessedIsins.some(i => i.issuerId === c.id))
                .map(c => (
                  <div key={c.id} className="flex items-center gap-2 flex-wrap">
                    <span className="t-caption w-32 shrink-0 truncate" title={c.name}>{c.name.split(' ')[0]}</span>
                    {assessedIsins.filter(i => i.issuerId === c.id).map(i => {
                      const on = selectedIsins.includes(i.isin);
                      const disabled = !on && selectedIsins.length >= 4;
                      return (
                        <button key={i.isin} onClick={() => toggleIsin(i.isin)} disabled={disabled}
                          aria-pressed={on}
                          className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                          style={on
                            ? { background: 'rgba(45,212,191,0.15)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.35)' }
                            : { background: 'rgba(255,255,255,0.05)', color: '#9CB3B1', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {on && <Check size={12} />}
                          <span className="font-mono-nums">{i.isin}</span>
                          {i.illustrative && <IllustrativeBadge compact />}
                        </button>
                      );
                    })}
                  </div>
                ))}
            </div>
            <p className="t-caption mt-3">
              Comparing two ISINs of the same issuer? <button onClick={() => navigate(`/app/compare-isins/${chosenIsins[0]?.issuerId ?? 'keertana'}`)} className="text-brand-teal hover:underline">Use ISIN-vs-ISIN</button> — it anchors the shared Fundamental Score once.
            </p>
          </div>

          {chosenIsins.length < 2 ? (
            <div className="glass-card p-10 text-center"><p className="t-lead">Pick at least two instruments to compare.</p></div>
          ) : (
            <div className="space-y-4">
              <IsinCompareGrid isins={chosenIsins} sharedFundamental={false} onRemove={chosenIsins.length > 2 ? toggleIsin : undefined} />

              {/* §K5 market reference */}
              {referencePeers.length > 0 && (
                <div className="glass-card p-5">
                  <h3 className="t-h3 text-primary-text mb-1">Market reference</h3>
                  <p className="t-caption mb-4">
                    Comparable instruments in {[...sectorsOnScreen].map(s => sectorMeta(s).name).join(' and ')}, by yield.
                    These are market comparators only — they carry no Fundamental Score, because they are not in coverage.
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                          <th className="pb-2 pr-3 t-eyebrow font-medium">Issuer</th>
                          <th className="pb-2 pr-3 t-eyebrow font-medium">ISIN</th>
                          <th className="pb-2 pr-3 t-eyebrow font-medium">Sector</th>
                          <th className="pb-2 pr-3 t-eyebrow font-medium">Rating</th>
                          <th className="pb-2 pr-3 t-eyebrow font-medium text-right">AUM</th>
                          <th className="pb-2 pr-3 t-eyebrow font-medium text-right">YTM</th>
                          <th className="pb-2 t-eyebrow font-medium">Tenor</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chosenIsins.map(i => (
                          <tr key={i.isin} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(45,212,191,0.06)' }}>
                            <td className="py-2 pr-3 font-medium" style={{ color: '#2DD4BF' }}>
                              {companies.find(c => c.id === i.issuerId)?.name.split(' ')[0]} <span className="t-caption">· in coverage</span>
                            </td>
                            <td className="py-2 pr-3 font-mono-nums text-primary-text">{i.isin}</td>
                            <td className="py-2 pr-3 text-muted-text">{sectorMeta(i.sector).name}</td>
                            <td className="py-2 pr-3 text-muted-text">{i.externalRating ?? '—'}</td>
                            <td className="py-2 pr-3 text-right text-muted-text">—</td>
                            <td className="py-2 pr-3 text-right font-mono-nums font-semibold" style={{ color: '#2DD4BF' }}>{i.ytmCurrent?.toFixed(2)}%</td>
                            <td className="py-2 text-muted-text">{i.residualTenor ?? '—'}</td>
                          </tr>
                        ))}
                        {referencePeers.map(p => (
                          <tr key={p.isin} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                            <td className="py-2 pr-3 text-primary-text">{p.issuer}</td>
                            <td className="py-2 pr-3 font-mono-nums text-muted-text">{p.isin}</td>
                            <td className="py-2 pr-3 text-muted-text">{sectorMeta(p.sector).name}</td>
                            <td className="py-2 pr-3 text-muted-text">{p.externalRating}</td>
                            <td className="py-2 pr-3 text-right font-mono-nums text-muted-text">{p.aum}</td>
                            <td className="py-2 pr-3 text-right font-mono-nums text-primary-text">{p.ytm.toFixed(2)}%</td>
                            <td className="py-2 text-muted-text">{p.tenor ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
      <>
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
                  {/* Mode A is issuer-level: no recommendation (§1d). */}
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className="t-caption">{externalRatingLabel(m.externalRating)}</span>
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

            {/* Total Score composition removed from Mode A (§1d): Total /500 and its
                Rating fold in Issuance and Pricing, which are instrument-level.
                Switch to Mode B to compare instruments. */}

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

            {/* Yield & spread removed from Mode A (§1d) — yield is a property of an
                instrument, not an issuer. It is compared in Mode B. */}

            {/* Bridge into the instrument level */}
            <div className="glass-card p-5 flex items-center justify-between gap-4 flex-wrap"
              style={{ background: 'rgba(45,212,191,0.05)', border: '1px solid rgba(45,212,191,0.2)' }}>
              <p className="t-body text-muted-text max-w-2xl">
                This is the issuer. The instrument is a separate question — two bonds from the same issuer share
                every score above and can still differ on Total Score and Rating.
              </p>
              <button onClick={() => setMode('isins')} className="btn-gradient px-4 py-2 rounded-lg text-xs inline-flex items-center gap-1.5 shrink-0">
                <Receipt size={13} /> Compare by ISIN
              </button>
            </div>
          </div>
        </div>
      )}
      </>
      )}
    </div>
  );
};
