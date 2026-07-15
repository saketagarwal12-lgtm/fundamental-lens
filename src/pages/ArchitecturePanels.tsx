import { useState } from 'react';
import {
  Search, Database, Boxes, ShieldCheck, ArrowRight, RefreshCw, RotateCcw,
  Lock, Users, Globe, Rss, Layers, History, FileStack, Clock,
} from 'lucide-react';
import { reports } from '../data/reports';
import { getIssuerTrend } from '../data/score';
import { companies } from '../data/companies';

const COVERED = Object.keys(reports).map(id => ({ id, name: companies.find(c => c.id === id)?.name.split(' ')[0] ?? id }));

// ── Panel 1 · Data flywheel (slide 13) ───────────────────────────────────────
const FLYWHEEL = [
  { icon: Search, title: 'Research & Score', body: 'Analysts and the model score covered issuers.' },
  { icon: Database, title: 'Proprietary database', body: 'Every factor, figure and grade is stored, versioned.' },
  { icon: Boxes, title: 'Analyst-logic models', body: 'Sector models sharpen as the database grows.' },
  { icon: ShieldCheck, title: 'Underwriting engine', body: 'Powers white-label credit decisions at scale.' },
];

export const DataFlywheel: React.FC = () => (
  <section className="glass-card p-6">
    <div className="flex items-center gap-2 mb-1">
      <RefreshCw size={17} style={{ color: '#2DD4BF' }} />
      <h2 className="t-h2 text-primary-text">The data flywheel</h2>
    </div>
    <p className="t-lead mb-6">Each turn feeds the next. The moat is the database, not the app.</p>

    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {FLYWHEEL.map((n, i) => (
        <div key={n.title} className="relative">
          <div className="glass-card-elevated p-4 h-full" style={{ borderColor: 'rgba(45,212,191,0.18)' }}>
            <div className="flex items-center justify-between mb-2">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}><n.icon size={18} /></div>
              <span className="font-mono-nums text-xs" style={{ color: '#6F8584' }}>0{i + 1}</span>
            </div>
            <h3 className="t-h3 text-primary-text">{n.title}</h3>
            <p className="t-body text-muted-text mt-1">{n.body}</p>
          </div>
          {i < FLYWHEEL.length - 1 && (
            <ArrowRight size={18} className="hidden lg:block absolute top-1/2 -right-3 -translate-y-1/2 z-10" style={{ color: '#2DD4BF' }} />
          )}
        </div>
      ))}
    </div>

    {/* Loop-back arrows — live vs roadmap */}
    <div className="grid sm:grid-cols-2 gap-3 mt-4">
      <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(45,212,191,0.07)', border: '1px solid rgba(45,212,191,0.25)' }}>
        <RotateCcw size={18} style={{ color: '#2DD4BF' }} className="shrink-0" />
        <div>
          <p className="t-label text-primary-text">Write-back loop <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-1" style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399' }}>Live</span></p>
          <p className="t-caption">Every new assessment writes fresh factors back into the database.</p>
        </div>
      </div>
      <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.2)' }}>
        <RefreshCw size={18} style={{ color: '#9CB3B1' }} className="shrink-0" />
        <div>
          <p className="t-label text-primary-text">Outcomes feedback <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full ml-1" style={{ background: 'rgba(148,163,184,0.14)', color: '#94A3B8' }}>Roadmap</span></p>
          <p className="t-caption">Realised repayment outcomes will recalibrate the models — not live yet.</p>
        </div>
      </div>
    </div>
  </section>
);

// ── Panel 2 · Six-layer architecture (slide 25) ──────────────────────────────
const LAYERS = [
  { icon: Rss, name: 'Data sources', note: 'KID & GID, filings, ratings, pricing, registry, bureau, news.' },
  { icon: Layers, name: 'Ingestion & normalisation', note: 'Cleaned, mapped and de-duplicated into a common schema.' },
  { icon: Database, name: 'Proprietary data platform', note: 'Versioned, point-in-time store of every factor.' },
  { icon: Lock, name: 'Assessment engine', note: 'Deterministic model turns factors into scores.', sealed: true },
  { icon: Users, name: 'Expert review', note: 'A research analyst reviews before anything publishes.' },
  { icon: Globe, name: 'Delivery', note: 'Web · API · white-label embed · webhooks.' },
];
const PRINCIPLES = [
  'AI captures & explains, never computes',
  'Point-in-time reproducibility',
  'Versioned & fully auditable',
  'Multi-tenant with entitlements',
];

export const SixLayerArchitecture: React.FC = () => (
  <section className="glass-card p-6">
    <div className="flex items-center gap-2 mb-1">
      <Layers size={17} style={{ color: '#2DD4BF' }} />
      <h2 className="t-h2 text-primary-text">Six-layer architecture</h2>
    </div>
    <p className="t-lead mb-6">Data flows up; the assessment engine in the middle stays sealed.</p>

    <div className="grid lg:grid-cols-[1fr_260px] gap-6">
      <div className="space-y-2">
        {LAYERS.map((l, i) => (
          <div key={l.name} className="rounded-xl p-4 flex items-center gap-3"
            style={l.sealed
              ? { background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.35)' }
              : { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="font-mono-nums text-xs w-5 shrink-0" style={{ color: '#6F8584' }}>{LAYERS.length - i}</span>
            <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: l.sealed ? 'rgba(167,139,250,0.15)' : 'rgba(45,212,191,0.12)', color: l.sealed ? '#A78BFA' : '#2DD4BF' }}>
              <l.icon size={17} />
            </div>
            <div className="min-w-0">
              <p className="t-h3 text-primary-text flex items-center gap-2">
                {l.name}
                {l.sealed && <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.35)' }}><Lock size={10} /> SEALED</span>}
              </p>
              <p className="t-caption">{l.note}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="glass-card-elevated p-5 self-start">
        <p className="t-eyebrow mb-3">Design principles</p>
        <ul className="space-y-3">
          {PRINCIPLES.map(p => (
            <li key={p} className="flex items-start gap-2 t-body text-primary-text"><ShieldCheck size={14} className="shrink-0 mt-0.5" style={{ color: '#2DD4BF' }} />{p}</li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

// ── Panel 3 · Data sources & lineage (slide 26) ──────────────────────────────
const SOURCES = [
  { source: 'KID & GID', detail: 'Structured issuer & instrument master', cadence: 'On update', primary: true },
  { source: 'Company filings', detail: 'Financial statements & disclosures', cadence: 'Quarterly', primary: false },
  { source: 'Rating actions', detail: 'Agency ratings, outlooks, rationale', cadence: 'Event-driven', primary: false },
  { source: 'Pricing / yield', detail: 'Secondary levels, YTM, spreads', cadence: 'Real-time', primary: false },
  { source: 'Registry / ISIN master', detail: 'Shareholding, ISIN, covenants', cadence: 'Daily', primary: false },
  { source: 'Credit bureau', detail: 'Debt & default (Commercial CIBIL, partner)', cadence: 'Partner feed', primary: false },
  { source: 'News / litigation', detail: 'Management, penalties, litigation', cadence: 'Real-time', primary: false },
];

export const DataLineage: React.FC = () => (
  <section className="glass-card p-6">
    <div className="flex items-center gap-2 mb-1">
      <FileStack size={17} style={{ color: '#2DD4BF' }} />
      <h2 className="t-h2 text-primary-text">Data sources &amp; lineage</h2>
    </div>
    <p className="t-lead mb-5">Every factor is stamped with its source document, timestamp and reviewer.</p>

    <div className="overflow-x-auto rounded-xl" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
      <table className="w-full text-left" style={{ borderCollapse: 'collapse', minWidth: 560 }}>
        <thead>
          <tr>
            {['Source', 'What it feeds', 'Cadence'].map(h => (
              <th key={h} className="t-eyebrow px-4 py-3" style={{ background: 'rgba(13,30,32,0.6)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {SOURCES.map(s => (
            <tr key={s.source}>
              <td className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="t-body font-medium text-primary-text">{s.source}</span>
                {s.primary && <span className="ml-2 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(45,212,191,0.14)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.3)' }}>Primary</span>}
              </td>
              <td className="px-4 py-3 t-body text-muted-text" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{s.detail}</td>
              <td className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="inline-flex items-center gap-1 t-caption"><Clock size={11} /> {s.cadence}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <p className="t-caption mt-3">Illustrative connectors — live feeds wired at go-live.</p>
  </section>
);

// ── Panel 4 · Point-in-time reproducibility ──────────────────────────────────
export const PointInTime: React.FC = () => {
  const [issuer, setIssuer] = useState(COVERED[0].id);
  const trend = getIssuerTrend(issuer);
  const months = trend.map(t => t.month);
  const [month, setMonth] = useState(months[months.length - 1]);
  const point = trend.find(t => t.month === month) ?? trend[trend.length - 1];
  const report = reports[issuer];
  const pct = Math.round((point.score / 200) * 100);

  return (
    <section className="glass-card p-6">
      <div className="flex items-center gap-2 mb-1">
        <History size={17} style={{ color: '#2DD4BF' }} />
        <h2 className="t-h2 text-primary-text">Point-in-time reproducibility</h2>
      </div>
      <p className="t-lead mb-5">Reconstruct the Fundamental Score exactly as it stood on any past date — the credit-committee guarantee.</p>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-5">
        <div className="space-y-4">
          <label className="block">
            <span className="t-label text-muted-text block mb-1.5">Issuer</span>
            <select value={issuer} onChange={e => { setIssuer(e.target.value); setMonth(getIssuerTrend(e.target.value).slice(-1)[0].month); }}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-primary-text focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {COVERED.map(c => <option key={c.id} value={c.id} style={{ background: '#0B1F20' }}>{c.name}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="t-label text-muted-text block mb-1.5">As of</span>
            <select value={month} onChange={e => setMonth(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg text-sm text-primary-text focus:outline-none"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {months.map(m => <option key={m} value={m} style={{ background: '#0B1F20' }}>{m}</option>)}
            </select>
          </label>
        </div>

        <div className="rounded-xl p-5 flex flex-col items-center justify-center text-center" style={{ background: 'rgba(45,212,191,0.06)', border: '1px solid rgba(45,212,191,0.2)' }}>
          <span className="t-eyebrow mb-1">Reconstructed score · {month}</span>
          <div className="flex items-baseline gap-1.5">
            <span className="t-metric text-4xl" style={{ color: '#2DD4BF' }}>{point.score}</span>
            <span className="font-mono-nums text-muted-text">/ 200</span>
          </div>
          <span className="t-caption mt-1">{pct}% · stored value, not recomputed</span>
          {point.event && (
            <p className="t-caption mt-3 pt-3 w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <span className="font-medium" style={{ color: point.event.direction === 'up' ? '#34D399' : '#FB7185' }}>{point.event.direction === 'up' ? '▲' : '▼'} </span>
              {point.event.reason}
            </p>
          )}
        </div>
      </div>
      <p className="t-caption mt-4">Reads the stored monthly value for {companies.find(c => c.id === issuer)?.name.split(' ')[0]} — the same number a credit committee saw on that date. Latest external action on file: {report.ratingHistory[report.ratingHistory.length - 1]?.note}.</p>
    </section>
  );
};

// Shared block that renders every architecture panel (used by the public page + creator mirror).
export const ArchitecturePanels: React.FC = () => (
  <div className="space-y-5">
    <DataFlywheel />
    <SixLayerArchitecture />
    <DataLineage />
    <PointInTime />
  </div>
);
