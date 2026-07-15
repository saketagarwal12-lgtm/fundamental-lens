import { Link } from 'react-router-dom';
import {
  ArrowRight, Clock, Eye, Layers, Boxes, X, Check, TrendingUp,
  Search, Plug, Sparkles, ShieldCheck, ChevronRight,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { RatingLens } from '../components/RatingLens';
import type { RatingLensPillar } from '../components/RatingLens';

const sectionShell = 'py-16 lg:py-20';
const container = 'max-w-6xl mx-auto px-6';

// ── Slide 8 — See inside the rating ──────────────────────────────────────────
const LENS_PILLARS: RatingLensPillar[] = [
  { label: 'Issuer fundamentals', pct: 86, weight: 40, grade: 'Extremely Strong' },
  { label: 'Pricing & yield', pct: 72, weight: 30, grade: 'Strong' },
  { label: 'Issuance assessment', pct: 78, weight: 20, grade: 'Strong' },
  { label: 'Economic & sector', pct: 62, weight: 10, grade: 'Moderate' },
];

export const SeeInsideTheRating: React.FC = () => (
  <section className={sectionShell} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div className={container}>
      <div className="text-center mb-10">
        <p className="t-eyebrow mb-2">See inside the rating</p>
        <h2 className="t-h1 text-primary-text">A rating is one letter. A lens shows every factor.</h2>
        <p className="t-lead mt-3 max-w-2xl mx-auto">Agency ratings are an input to our assessment — not the product. Fundamental Lens turns that single symbol into a live, comparable, factor-level score.</p>
      </div>
      <RatingLens
        agency="Rating agency"
        agencyLetter="BBB"
        agencyNote="one letter · quarterly · issuer-paid"
        score={172}
        max={200}
        delta={6}
        flNote="live · signal-driven · comparable"
        pillars={LENS_PILLARS}
      />
    </div>
  </section>
);

// ── Slide 2 — A rating report you cannot interrogate (before → after) ─────────
const ARROWS = [
  { icon: Clock, before: 'Periodic', after: 'Real-time', note: 'Refreshed as signals arrive, not once a year.' },
  { icon: Eye, before: 'Limited transparency', after: 'Every factor visible', note: '119 factors, each graded and explained.' },
  { icon: Layers, before: 'Not comparable', after: 'Standardised', note: 'One scale — compare any issuer, any sector.' },
  { icon: Boxes, before: 'No models', after: 'Expert-built models', note: 'Deterministic, peer-calibrated, analyst-reviewed.' },
];

export const InterrogateTheRating: React.FC = () => (
  <section className={sectionShell} style={{ background: 'rgba(18,42,44,0.3)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div className={container}>
      <div className="text-center mb-10">
        <p className="t-eyebrow mb-2">The problem</p>
        <h2 className="t-h1 text-primary-text">A rating report you cannot interrogate</h2>
        <p className="t-lead mt-3 max-w-2xl mx-auto">Four things change when fundamental research is opened up.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ARROWS.map(a => (
          <div key={a.before} className="glass-card p-5 flex flex-col">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}>
              <a.icon size={20} />
            </div>
            <span className="t-caption line-through" style={{ color: '#6F8584' }}>{a.before}</span>
            <div className="flex items-center gap-1.5 mt-1">
              <ArrowRight size={14} style={{ color: '#2DD4BF' }} />
              <span className="t-h3 text-primary-text">{a.after}</span>
            </div>
            <p className="t-body text-muted-text mt-2">{a.note}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// ── Slide 9 — Built for credit, not equities ─────────────────────────────────
const EQUITY_ROWS = [
  { label: 'Earnings growth', struck: false },
  { label: 'Relative valuation', struck: true },
  { label: 'Price momentum', struck: true },
  { label: 'Profitability quality', struck: false },
];
const CREDIT_ROWS = [
  'Issuer fundamentals /200',
  'Issuance assessment',
  'Pricing & yield',
  'Collateral & covenant',
  'Economic & sector',
];

export const BuiltForCredit: React.FC = () => (
  <section className={sectionShell} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div className={container}>
      <div className="text-center mb-10">
        <p className="t-eyebrow mb-2">Credit-native by design</p>
        <h2 className="t-h1 text-primary-text">Built for credit, not equities</h2>
        <p className="t-lead mt-3 max-w-2xl mx-auto">A quant equity score answers the wrong question for a bondholder. Our pillars are the ones that decide whether you get paid back.</p>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        {/* Equity score */}
        <div className="glass-card p-6">
          <p className="t-eyebrow mb-1">Generic quant equity score</p>
          <p className="t-caption mb-4">Optimised for total return, not repayment.</p>
          <div className="space-y-2">
            {EQUITY_ROWS.map(r => (
              <div key={r.label} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                {r.struck
                  ? <X size={15} className="shrink-0" style={{ color: '#FB7185' }} />
                  : <Check size={15} className="shrink-0" style={{ color: '#9CB3B1' }} />}
                <span className={`t-body ${r.struck ? 'line-through' : ''}`} style={{ color: r.struck ? '#6F8584' : '#9CB3B1' }}>{r.label}</span>
                {r.struck && <span className="ml-auto t-caption" style={{ color: '#FB7185' }}>irrelevant to credit</span>}
              </div>
            ))}
          </div>
        </div>
        {/* Credit pillars */}
        <div className="glass-card-elevated p-6" style={{ borderColor: 'rgba(45,212,191,0.25)' }}>
          <p className="t-eyebrow mb-1" style={{ color: '#2DD4BF' }}>Fundamental Lens · credit-native pillars</p>
          <p className="t-caption mb-4">Every pillar maps to a repayment risk.</p>
          <div className="space-y-2">
            {CREDIT_ROWS.map(r => (
              <div key={r} className="flex items-center gap-2.5 rounded-lg px-3 py-2.5" style={{ background: 'rgba(45,212,191,0.07)', border: '1px solid rgba(45,212,191,0.18)' }}>
                <Check size={15} className="shrink-0" style={{ color: '#2DD4BF' }} />
                <span className="t-body text-primary-text">{r}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p className="t-lead text-center mt-8 max-w-3xl mx-auto">
        The market has no purpose-built fundamental credit score — <span className="text-primary-text font-medium">that's the whitespace.</span>
      </p>
    </div>
  </section>
);

// ── Slide 4 — The gap is in mid & small caps ─────────────────────────────────
export const MidSmallCapGap: React.FC = () => (
  <section className={sectionShell} style={{ background: 'rgba(18,42,44,0.3)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div className={container}>
      <div className="text-center mb-10">
        <p className="t-eyebrow mb-2">Where the gap is</p>
        <h2 className="t-h1 text-primary-text">The gap is in mid &amp; small caps</h2>
      </div>
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="t-h3 text-primary-text">Large-cap issuers</h3>
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(148,163,184,0.14)', color: '#94A3B8', border: '1px solid rgba(148,163,184,0.25)' }}>Saturated</span>
          </div>
          <ul className="space-y-2.5">
            {['20–30 analysts already cover each name', 'No informational asymmetry left to capture', 'Research is a commodity here'].map(t => (
              <li key={t} className="flex items-start gap-2.5 t-body text-muted-text">
                <X size={15} className="shrink-0 mt-0.5" style={{ color: '#6F8584' }} />{t}
              </li>
            ))}
          </ul>
        </div>
        <div className="glass-card-elevated p-6" style={{ borderColor: 'rgba(45,212,191,0.25)' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="t-h3 text-primary-text">Mid &amp; small-cap issuers</h3>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(45,212,191,0.14)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.3)' }}>Whitespace</span>
          </div>
          <ul className="space-y-2.5">
            {['Thin-to-no independent coverage', 'Real informational asymmetry to price', 'Exactly where a scalable engine wins'].map(t => (
              <li key={t} className="flex items-start gap-2.5 t-body text-primary-text">
                <Check size={15} className="shrink-0 mt-0.5" style={{ color: '#2DD4BF' }} />{t}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="glass-card p-5 mt-5">
        <p className="t-lead text-center">
          An analyst costs the same to cover a <span className="text-primary-text font-medium">₹500 cr</span> issuer as a <span className="text-primary-text font-medium">₹50,000 cr</span> one — but the revenue doesn't. A deterministic engine breaks that unit economics.
        </p>
      </div>
    </div>
  </section>
);

// ── Slide 12 — Competitive landscape ─────────────────────────────────────────
const LANDSCAPE = [
  { who: 'OBPPs (bond platforms)', offer: 'Distribution & execution', gap: 'No independent fundamental view', fl: false },
  { who: 'Rating agencies', offer: 'One issuer-paid letter, periodic', gap: 'Not comparable, not interrogable', fl: false },
  { who: 'Commercial CIBIL Rank', offer: 'Bureau-style default signal', gap: 'No fundamental depth or narrative', fl: false },
  { who: 'Institutional analytics', offer: 'Deep but terminal-gated', gap: 'Priced out of mid/small caps & retail', fl: false },
  { who: 'Fundamental Lens', offer: 'Live fundamental credit score + report', gap: 'Purpose-built for the whitespace', fl: true },
];

export const CompetitiveLandscape: React.FC = () => (
  <section className={sectionShell} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div className={container}>
      <div className="text-center mb-10">
        <p className="t-eyebrow mb-2">Competitive landscape</p>
        <h2 className="t-h1 text-primary-text">Everyone owns a piece. Nobody owns the score.</h2>
      </div>
      <div className="glass-card overflow-x-auto">
        <table className="w-full text-left" style={{ borderCollapse: 'collapse', minWidth: 640 }}>
          <thead>
            <tr>
              {['Player', 'What they offer', 'The gap'].map(h => (
                <th key={h} className="t-eyebrow px-5 py-3.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {LANDSCAPE.map(r => (
              <tr key={r.who} style={r.fl ? { background: 'rgba(45,212,191,0.08)' } : {}}>
                <td className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className={`t-body font-medium ${r.fl ? 'text-brand-teal' : 'text-primary-text'}`}>{r.who}</span>
                </td>
                <td className="px-5 py-4 t-body text-muted-text" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{r.offer}</td>
                <td className="px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="t-body" style={{ color: r.fl ? '#2DD4BF' : '#9CB3B1' }}>{r.gap}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

// ── Slide 17 — Market & tailwinds ────────────────────────────────────────────
const ISSUANCE = [
  { year: 'FY14', v: 3.3 }, { year: 'FY24', v: 8.6 }, { year: 'FY25', v: 9.9 }, { year: 'FY26E', v: 11.0 },
];
const STATS = [
  { v: '₹53.6 trn', l: 'corporate bonds outstanding' },
  { v: '₹1,000+', l: 'minimum ticket (retail-accessible)' },
  { v: '₹100–120 trn', l: 'NITI Aayog projection by 2030' },
];

export const MarketTailwinds: React.FC = () => (
  <section className={sectionShell} style={{ background: 'rgba(18,42,44,0.3)', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div className={container}>
      <div className="text-center mb-10">
        <p className="t-eyebrow mb-2">Market &amp; tailwinds</p>
        <h2 className="t-h1 text-primary-text">A market that is deepening — and opening up</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {STATS.map(s => (
          <div key={s.l} className="glass-card p-5 text-center">
            <p className="t-metric text-2xl lg:text-3xl" style={{ color: '#2DD4BF' }}>{s.v}</p>
            <p className="t-caption mt-1.5">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="glass-card p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <h3 className="t-h3 text-primary-text">Corporate-bond issuance</h3>
          <span className="t-caption">₹ trillion</span>
        </div>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ISSUANCE} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <XAxis dataKey="year" tick={{ fill: '#9CB3B1', fontSize: 12 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} />
              <YAxis tick={{ fill: '#9CB3B1', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip
                cursor={{ fill: 'rgba(45,212,191,0.08)' }}
                contentStyle={{ background: 'rgba(18,42,44,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#E9F3F1' }}
                formatter={(v: number) => [`₹${v} trn`, 'Issuance']}
              />
              <Bar dataKey="v" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                {ISSUANCE.map((d, i) => (
                  <Cell key={d.year} fill={i === ISSUANCE.length - 1 ? '#22D3EE' : '#2DD4BF'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="t-caption mt-3">Illustrative figures. FY26E is an estimate.</p>
      </div>
    </div>
  </section>
);

// ── Slide 18 — Roadmap: one engine, four markets ─────────────────────────────
const ROADMAP = [
  { icon: Search, phase: 'Now', title: 'Research & Score', body: 'Live fundamental scores, reports and monitoring for covered issuers.' },
  { icon: Plug, phase: 'Near', title: 'Embed / data / API', body: 'Scores and data surfaced inside platforms via embed, feed and API.' },
  { icon: Sparkles, phase: 'Near-mid', title: 'Private assessment', body: 'Guided assessment of unlisted issuers — AI captures, model scores.' },
  { icon: ShieldCheck, phase: 'Envisioned', title: 'Underwriting engine', body: 'White-label credit underwriting — hours, not days, and auditable.' },
];

export const Roadmap: React.FC = () => (
  <section className={sectionShell} style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
    <div className={container}>
      <div className="text-center mb-10">
        <p className="t-eyebrow mb-2">Roadmap</p>
        <h2 className="t-h1 text-primary-text">One engine, four markets</h2>
        <p className="t-lead mt-3 max-w-2xl mx-auto">Same analytical core; the database compounds with every assessment.</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {ROADMAP.map((r, i) => (
          <div key={r.title} className="glass-card p-5 flex flex-col relative">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}>
                <r.icon size={20} />
              </div>
              <span className="font-mono-nums text-xs" style={{ color: '#6F8584' }}>0{i + 1}</span>
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-wider mb-1" style={{ color: i === 0 ? '#34D399' : '#9CB3B1' }}>{r.phase}</span>
            <h3 className="t-h3 text-primary-text mb-1.5">{r.title}</h3>
            <p className="t-body text-muted-text flex-1">{r.body}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-6">
        <Link to="/how-it-works/architecture" className="inline-flex items-center gap-1.5 t-label text-brand-teal hover:underline">
          See the architecture &amp; data flywheel <ChevronRight size={15} />
        </Link>
      </div>
    </div>
  </section>
);

// ── Cross-cutting — tiering ladder for the product-offerings section ──────────
const TIERS = [
  { tier: 'Free teaser', color: '#9CB3B1', items: ['Headline Fundamental Score', 'Score-movement graph', 'Basic issuer profile'] },
  { tier: 'Paid', color: '#2DD4BF', items: ['Full scorecard & reports', 'Financial & qualitative data', 'Interactive AI bot'] },
  { tier: 'HNI / Premium', color: '#A78BFA', items: ['Adjustable factor weightage', 'Private-company assessment', 'Priority coverage requests'] },
];

export const TieringLadder: React.FC = () => (
  <div className="mt-8">
    <div className="grid sm:grid-cols-3 gap-4">
      {TIERS.map((t, i) => (
        <div key={t.tier} className="glass-card p-5 flex flex-col relative" style={i === 2 ? { borderColor: 'rgba(167,139,250,0.3)' } : {}}>
          <div className="flex items-center gap-2 mb-3">
            {i > 0 && <ArrowRight size={14} className="hidden sm:block absolute -left-3 top-6" style={{ color: '#6F8584' }} />}
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: `${t.color}22`, color: t.color, border: `1px solid ${t.color}44` }}>{t.tier}</span>
          </div>
          <ul className="space-y-1.5">
            {t.items.map(it => (
              <li key={it} className="flex items-start gap-2 t-body text-muted-text">
                <Check size={14} className="shrink-0 mt-0.5" style={{ color: t.color }} />{it}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <p className="t-caption text-center mt-4 flex items-center justify-center gap-1.5">
      <TrendingUp size={13} style={{ color: '#2DD4BF' }} /> Everything is usable in this prototype — tiers are illustrative.
    </p>
  </div>
);
