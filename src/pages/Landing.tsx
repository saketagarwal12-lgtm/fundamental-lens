import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BarChart2, Bell, Search, ArrowRight, X, ChevronRight, Bot, Gauge, FileText, Database, Sparkles, Check } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { ScoreGauge } from '../components/ScoreGauge';
import { Sparkline } from '../components/Sparkline';
import { BRAND } from '../brand';
import { useAuth } from '../contexts/AuthContext';
import {
  SeeInsideTheRating, InterrogateTheRating, BuiltForCredit, MidSmallCapGap,
  CompetitiveLandscape, MarketTailwinds, Roadmap, TieringLadder,
} from './LandingSections';

// ── Phase 6.2 — Product offerings ────────────────────────────────────────────
const offerings = [
  {
    icon: Gauge, lead: true, upgraded: false,
    name: 'Fundamental Score',
    tagline: 'A real-time fundamental score for corporates',
    body: "A CIBIL-style score for an issuer's fundamentals, kept current — not a once-a-year rating. A structured, financial-model-driven fundamental analysis distilled from 119 assessment factors (40 qualitative, 79 quantitative).",
    chips: ['Quarterly financials', 'News-driven qualitative', 'Sectoral-trend signals', 'Debt & default (Commercial CIBIL, partner)', 'Corporate signals (management, ownership, litigation, penalties)', 'Real-time news', 'Score-movement graph with reasons', 'Adjustable factor weightage [Upgraded]'],
  },
  {
    icon: FileText, lead: false, upgraded: false,
    name: 'High-quality research papers',
    tagline: 'Institutional-grade research you can read',
    body: 'Company- and ISIN-specific research, written for investors.',
    chips: ['Company reports', 'ISIN reports', 'Print-friendly'],
  },
  {
    icon: Bot, lead: false, upgraded: false,
    name: 'Interactive AI bot',
    tagline: 'Ask anything about an entity',
    body: 'Get a clear, sourced answer grounded in the report and the data.',
    chips: ['Entity Q&A', 'Natural-language answers', 'Cites the data'],
  },
  {
    icon: Database, lead: false, upgraded: false,
    name: 'Financial & qualitative data platform',
    tagline: 'Every number and narrative that matters',
    body: 'The full financial and non-financial picture, scannable.',
    chips: ['Capitalization', 'Profitability', 'Funding & liquidity', 'Asset-quality / working-capital', 'Key qualitative factors'],
  },
  {
    icon: Sparkles, lead: false, upgraded: true,
    name: 'Private-company assessment',
    tagline: 'Assess unlisted companies via a guided AI relationship manager',
    body: 'A conversational AI RM collects inputs and produces a draft fundamental assessment.',
    chips: ['AI RM-led collection', 'Management Q&A', 'Structured capture', 'Assessment for private entities'],
  },
];

// ── Phase 6.3 — Who it's for ─────────────────────────────────────────────────
interface Audience { key: string; name: string; headline: string; sub: string; highlights: string[]; }
const audienceGroups: { group: string; items: Audience[] }[] = [
  {
    group: 'Individuals',
    items: [
      { key: 'retail', name: 'Retail investors', headline: 'Research that finally speaks your language.', sub: 'Institutional-grade analysis distilled into one score and a plain-language report.', highlights: ['One Fundamental Score', 'Plain-language reports', 'Interactive AI bot'] },
      { key: 'hni', name: 'HNIs', headline: 'An independent check on your fixed-income book.', sub: 'A second, unconflicted opinion on the issuers you hold, tracked over time.', highlights: ['Portfolio monitoring', '12-month score trend with reasons', 'Peer comparison'] },
    ],
  },
  {
    group: 'Institutions',
    items: [
      { key: 'family', name: 'Family offices', headline: 'Consolidated oversight, one lens.', sub: 'Monitor every bond & private-credit exposure through one framework with governance signals.', highlights: ['Holding-weighted portfolio score', 'Governance flags', 'Customisable dashboard'] },
      { key: 'mf', name: 'Mutual funds', headline: 'Surveillance that augments your credit team.', sub: 'Continuous issuer monitoring & early-warning to corroborate internal views.', highlights: ['Issuer surveillance & alerts', 'Peer benchmarking', 'Data platform'] },
      { key: 'aif', name: 'Alternative Investment Funds', headline: 'Diligence built for private credit.', sub: 'Deep diligence & covenant tracking for private-credit / venture-debt.', highlights: ['Covenants & breaches', 'Issuance-structure detail', 'Sector-specific asset quality'] },
      { key: 'banks', name: 'Banks & NBFCs', headline: 'Know your counterparties.', sub: 'Independent assessment of counterparties, co-lending partners, treasury issuers.', highlights: ['Counterparty scoring', 'Funding & liquidity analysis', 'Rating history & developments'] },
    ],
  },
  {
    group: 'Platforms & advisors',
    items: [
      { key: 'obpp', name: 'Online Bond Platforms (OBPPs)', headline: 'Transparency your investors can trust.', sub: 'Surface scores & reports inside your marketplace.', highlights: ['Embeddable score & reports', 'ISIN-level research', 'Plain-language risk context'] },
      { key: 'wealth', name: 'Wealth managers', headline: 'Defensible advice, every time.', sub: 'Client-ready research behind every recommendation.', highlights: ['Downloadable reports', '"Why this view" cards', 'Client portfolio monitoring'] },
      { key: 'boutique', name: 'Boutique research firms', headline: 'Extend your coverage universe.', sub: 'Ready sector models + structured data to scale coverage.', highlights: ['Sector models (NBFC live)', 'Structured database', 'Research-creator workflow'] },
    ],
  },
];
const allAudiences = audienceGroups.flatMap(g => g.items);

const previewComposition = [
  { label: 'Issuer', score: 134, max: 200, pct: 67, color: '#2DD4BF' },
  { label: 'Issuance', score: 70, max: 100, pct: 70, color: '#2DD4BF' },
  { label: 'Pricing', score: 95, max: 150, pct: 63, color: '#FBBF24' },
];

const features = [
  {
    icon: BarChart2,
    title: 'One Fundamental Score, tracked over time',
    body: 'A structured, financial-model-driven fundamental analysis — one Fundamental Score distilled from 119 assessment factors (40 qualitative, 79 quantitative), broken down across business, financials, issuance, pricing and sector, and followed month over month.',
  },
  {
    icon: Shield,
    title: 'Independent Scorecard',
    body: 'Five pillars. Twenty-five factors. Each graded Extremely Strong → Weak with full commentary. Institutional analysis without the institutional paywall.',
  },
  {
    icon: Bell,
    title: 'Material Change Alerts',
    body: 'Rating actions, auditor changes, management exits, covenant triggers — pushed to you in real time so you can act before the market does.',
  },
  {
    icon: Search,
    title: 'Portfolio Intelligence',
    body: 'Track multiple NBFC holdings in one dashboard. Compare asset quality, capital adequacy, and profitability across your fixed-income portfolio.',
  },
];

const steps = [
  { n: '01', title: 'Search your target company', body: 'Find any NBFC or bond issuer in our coverage universe by name, ISIN, or rating.' },
  { n: '02', title: 'Read the full report', body: 'Access the scorecard, financials deep-dive, ownership breakdown, and our proprietary recommendation.' },
  { n: '03', title: 'Monitor in your portfolio', body: 'Add to your watchlist. Get alerted when the Fundamental Score moves or material news breaks.' },
];

export const Landing: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [audienceKey, setAudienceKey] = useState('retail');
  const audience = allAudiences.find(a => a.key === audienceKey) ?? allAudiences[0];

  const handleEnter = (role: 'investor' | 'creator') => {
    login(role, name.trim() || undefined);
    setShowModal(false);
    navigate(role === 'investor' ? '/app/dashboard' : '/creator/pipeline');
  };

  return (
    <div className="min-h-screen">
      {/* Radial glows */}
      <div className="radial-glow-tl" />
      <div className="radial-glow-br" />

      {/* Nav */}
      <nav
        className="sticky top-0 z-40"
        style={{ background: 'rgba(11,31,32,0.85)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Wordmark size="xl" />
          <div className="flex items-center gap-3">
            <a href="#offerings" className="hidden sm:inline text-sm font-medium text-muted-text hover:text-primary-text transition-colors">What you get</a>
            <a href="#who" className="hidden sm:inline text-sm font-medium text-muted-text hover:text-primary-text transition-colors">Who it's for</a>
            <a href="#how-it-works" className="hidden sm:inline text-sm font-medium text-muted-text hover:text-primary-text transition-colors">How it works</a>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg btn-gradient text-sm"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-10 pb-14 lg:pt-12 lg:pb-20 relative">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <div className="page-fade">
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.25)', color: '#2DD4BF' }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#2DD4BF' }}></span>
              Now covering 4 NBFC issuers · More launching soon
            </div>
            <h1 className="font-serif text-3xl lg:text-[2.6rem] font-semibold text-primary-text leading-[1.15] mb-4">
              Investors' assessment of the company's fundamental strength, magnified through{' '}
              <span className="font-bold tracking-tight"><span className="text-primary-text">Fundamental</span><span className="text-brand-teal" style={{ textShadow: '0 0 16px rgba(45,212,191,0.5)' }}>Lens</span></span>{' '}in real-time.
            </h1>
            <p className="text-sm text-muted-text font-normal leading-relaxed mb-5">
              A structured, financial-model-driven fundamental analysis — one Fundamental Score distilled from <span className="text-primary-text font-medium">119 assessment factors</span> (40 qualitative, 79 quantitative).
            </p>

            {/* Bullets */}
            <ul className="space-y-2.5 mb-7">
              {[
                "Get a complete anatomy of a company's health parameters.",
                'No financial terminal needed.',
                'No financial modelling degree required.',
                'Just clear, structured, most transparent fundamental research.',
              ].map(b => (
                <li key={b} className="flex items-start gap-2.5 text-sm text-muted-text leading-relaxed">
                  <span className="mt-0.5 shrink-0 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(45,212,191,0.15)', color: '#2DD4BF' }}>
                    <Check size={11} strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleEnter('investor')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg btn-gradient text-sm"
              >
                Enter as Investor <ArrowRight size={16} />
              </button>
              <button
                onClick={() => handleEnter('creator')}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-primary-text font-semibold text-sm transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              >
                Enter as Research Creator
              </button>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="glass-card-elevated p-6 page-fade animate-float">
            <div className="flex items-start justify-between mb-4">
              <div>
                <p className="text-xs text-muted-text uppercase tracking-wider mb-1">Live Preview · Fundamental Score</p>
                <h3 className="font-semibold text-primary-text text-[15px]">KrazyBee Services Limited</h3>
                <p className="text-xs text-muted-text mt-0.5">NBFC · Unsecured Personal Loans · A (Stable)</p>
              </div>
              <span className="px-2.5 py-1 rounded-md text-xs font-semibold shrink-0" style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399' }}>Subscribe</span>
            </div>

            {/* Score + mini trend */}
            <div className="flex items-center gap-4 mb-4">
              <ScoreGauge score={134} max={200} pct={67} size={120} strokeWidth={10} caption="Fundamental Score" />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-muted-text mb-1.5">Fundamental Score · 12-month trend</p>
                <Sparkline data={[128, 128, 126, 128, 130, 130, 128, 132, 132, 132, 138, 134]} positive width="100%" height={44} strokeWidth={2.5} />
                <p className="text-[11px] text-muted-text mt-1.5 font-mono-nums">134 / 200 · 67%</p>
                <p className="text-[11px] text-muted-text mt-0.5 font-mono-nums">Total 327 / 500 · Rating 7</p>
              </div>
            </div>

            {/* Composition segments */}
            <div className="space-y-2 mb-1">
              <p className="text-[11px] text-muted-text uppercase tracking-wider">Composition</p>
              {previewComposition.map(c => (
                <div key={c.label} className="flex items-center gap-3">
                  <span className="text-xs text-muted-text w-20 shrink-0">{c.label}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: c.color, boxShadow: `0 0 8px ${c.color}66` }} />
                  </div>
                  <span className="text-[11px] font-mono-nums text-muted-text w-16 text-right">{c.score}/{c.max}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 grid grid-cols-3 gap-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <div>
                <p className="font-mono-nums text-sm font-semibold text-primary-text">1.53%</p>
                <p className="text-[10px] text-muted-text mt-0.5">GNPA (4Q26)</p>
              </div>
              <div>
                <p className="font-mono-nums text-sm font-semibold text-primary-text">23.55%</p>
                <p className="text-[10px] text-muted-text mt-0.5">Total CAR</p>
              </div>
              <div>
                <p className="font-mono-nums text-sm font-semibold text-primary-text">10.27%</p>
                <p className="text-[10px] text-muted-text mt-0.5">NCD YTM</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 w-full py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors"
              style={{ background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.2)', color: '#2DD4BF' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(45,212,191,0.15)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(45,212,191,0.08)')}
            >
              Read full report <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="max-w-6xl mx-auto px-6 -mt-4 mb-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { v: '4', l: 'Issuers covered' },
            { v: '3', l: 'NBFC sub-sectors' },
            { v: '119', l: 'Assessment factors' },
            { v: '0–500', l: 'Fundamental Score scale' },
          ].map(s => (
            <div key={s.l} className="rounded-2xl p-4 text-center" style={{ background: 'rgba(22,52,54,0.72)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 8px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)', backdropFilter: 'blur(14px)' }}>
              <p className="t-metric text-2xl" style={{ color: '#2DD4BF' }}>{s.v}</p>
              <p className="t-caption mt-0.5">{s.l}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-2xl px-4 py-3 text-center" style={{ background: 'rgba(22,52,54,0.72)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 8px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)', backdropFilter: 'blur(14px)' }}>
          <p className="text-sm font-medium text-primary-text">119 assessment factors · 40 qualitative · 79 quantitative</p>
        </div>
        <p className="t-caption text-center mt-3">A structured, financial-model-driven fundamental analysis — produced by a deterministic model and reviewed by a research analyst before publishing.</p>
      </section>

      {/* Tagline section */}
      <section className="py-20 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-serif text-2xl lg:text-[2rem] font-semibold text-primary-text leading-[1.2] mb-4 text-glow-teal">
            {BRAND.tagline}
          </h2>
          <p className="text-base lg:text-lg text-muted-text font-normal leading-relaxed">
            Access institutional-grade fundamental research, a real-time Fundamental Score, financial &amp; non-financial database, and an interactive AI bot with a single click.
          </p>
        </div>
      </section>

      {/* ── Deck narrative (slides 8, 2, 9, 4, 12) ── */}
      <SeeInsideTheRating />
      <InterrogateTheRating />
      <BuiltForCredit />
      <MidSmallCapGap />
      <CompetitiveLandscape />

      {/* Product offerings (Phase 6.2) */}
      <section id="offerings" className="py-20 lg:py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: 'rgba(18,42,44,0.3)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="t-eyebrow mb-2">What you get</p>
            <h2 className="t-h1 text-primary-text">Five ways Fundamental Lens works for you</h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-5 mb-5">
            {offerings.filter(o => o.lead).map(o => (
              <div key={o.name} className="glass-card-elevated p-6 lg:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}>
                    <o.icon size={24} />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="t-h3 text-primary-text">{o.name}</h3>
                      <span className="t-caption" style={{ color: '#2DD4BF' }}>· {o.tagline}</span>
                    </div>
                    <p className="t-body text-muted-text mt-1.5">{o.body}</p>
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {o.chips.map(c => {
                        const up = c.includes('[Upgraded]');
                        return (
                          <span key={c} className="text-[11px] font-medium px-2 py-1 rounded-full" style={up
                            ? { background: 'rgba(167,139,250,0.15)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.3)' }
                            : { background: 'rgba(255,255,255,0.05)', color: '#9CB3B1', border: '1px solid rgba(255,255,255,0.1)' }}>
                            {c.replace(' [Upgraded]', '')}{up ? ' · Upgraded' : ''}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {offerings.filter(o => !o.lead).map(o => (
              <div key={o.name} className="glass-card p-5 flex flex-col">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}>
                  <o.icon size={20} />
                </div>
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="t-h3 text-primary-text">{o.name}</h3>
                  {o.upgraded && <span className="text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.3)' }}>Upgraded</span>}
                </div>
                <p className="t-caption mb-2" style={{ color: '#2DD4BF' }}>{o.tagline}</p>
                <p className="t-body text-muted-text flex-1">{o.body}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {o.chips.map(c => (
                    <span key={c} className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#9CB3B1', border: '1px solid rgba(255,255,255,0.1)' }}>{c}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          {/* Tiering ladder — free teaser → paid → HNI/premium */}
          <TieringLadder />
        </div>
      </section>

      {/* Who it's for (Phase 6.3) */}
      <section id="who" className="py-20 lg:py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="t-eyebrow mb-2">Who it's for</p>
            <h2 className="t-h1 text-primary-text">Built for every kind of investor — and the platforms that serve them</h2>
          </div>
          <div className="grid lg:grid-cols-[320px_1fr] gap-6">
            {/* Tabs */}
            <div className="space-y-4" role="tablist" aria-label="Audiences">
              {audienceGroups.map(g => (
                <div key={g.group}>
                  <p className="t-eyebrow mb-2">{g.group}</p>
                  <div className="space-y-1">
                    {g.items.map(a => {
                      const on = a.key === audienceKey;
                      return (
                        <button
                          key={a.key}
                          role="tab"
                          aria-selected={on}
                          onClick={() => setAudienceKey(a.key)}
                          className="w-full text-left px-3 py-2.5 rounded-lg t-label transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                          style={on
                            ? { background: 'rgba(45,212,191,0.12)', color: '#2DD4BF', boxShadow: 'inset 3px 0 0 #2DD4BF, 0 0 16px rgba(45,212,191,0.18)' }
                            : { color: '#9CB3B1' }}
                          onMouseEnter={e => { if (!on) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                          onMouseLeave={e => { if (!on) e.currentTarget.style.background = 'transparent'; }}
                        >
                          {a.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {/* Panel */}
            <div className="glass-card-elevated p-7 flex flex-col justify-center" role="tabpanel">
              <h3 className="t-h2 text-primary-text">{audience.headline}</h3>
              <p className="t-lead mt-2 mb-5">{audience.sub}</p>
              <div className="grid sm:grid-cols-3 gap-3">
                {audience.highlights.map(h => (
                  <div key={h} className="rounded-xl p-3.5" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <span className="w-6 h-6 rounded-md flex items-center justify-center mb-2" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}><ChevronRight size={14} /></span>
                    <p className="t-body text-primary-text">{h}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 lg:py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-primary-text mb-3">How it works</h2>
            <p className="text-muted-text">From search to informed decision in under five minutes — behind every score sits a structured, financial-model-driven fundamental analysis of 119 assessment factors (40 qualitative, 79 quantitative).</p>
          </div>
          <div className="space-y-5">
            {steps.map(s => (
              <div
                key={s.n}
                className="flex gap-5 items-start p-5 rounded-2xl transition-transform duration-200 hover:-translate-y-0.5"
                style={{ background: 'rgba(22,52,54,0.72)', border: '1px solid rgba(255,255,255,0.10)', boxShadow: '0 12px 30px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.06)', backdropFilter: 'blur(14px)' }}
              >
                <div
                  className="w-12 h-12 shrink-0 rounded-xl flex items-center justify-center font-mono-nums font-bold text-sm"
                  style={{ background: 'linear-gradient(135deg, #2DD4BF 0%, #22D3EE 100%)', color: '#0B1F20', boxShadow: '0 6px 20px rgba(45,212,191,0.4)' }}
                >
                  {s.n}
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="font-semibold text-primary-text mb-1">{s.title}</h3>
                  <p className="text-sm text-muted-text">{s.body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Key aspects */}
      <section id="features" className="py-20 lg:py-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(18,42,44,0.3)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-2xl lg:text-3xl font-semibold text-primary-text mb-3">Key aspects</h2>
            <p className="text-muted-text max-w-xl mx-auto">A clear, structured read on every issuer — one Fundamental Score from 119 assessment factors, the full scorecard, real-time alerts and portfolio tools.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="glass-card p-6 h-full transition-all duration-200">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}>
                  <f.icon size={20} />
                </div>
                <h3 className="font-semibold text-primary-text mb-2">{f.title}</h3>
                <p className="text-sm text-muted-text leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deck narrative (slides 17, 18) ── */}
      <MarketTailwinds />
      <Roadmap />

      {/* Disclaimer band */}
      <div className="py-5 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,25,27,0.5)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] text-faint-text leading-relaxed text-center">
            Fundamental Lens provides research and information for educational purposes only and does not constitute personalised investment advice or a recommendation to buy, sell or hold any security. Investments in securities are subject to market risk; past performance does not guarantee future results. Fundamental Scores and assessments are model-generated and reviewed before publishing, but may contain errors and should not be the sole basis for any investment decision. Read all offer documents carefully and consult a qualified adviser before investing. [Entity name, SEBI/regulatory registration number and grievance-redressal details to be inserted.]
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8" style={{ background: 'rgba(10,25,27,0.7)', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Wordmark size="sm" />
          <p className="text-xs text-muted-text text-center">
            Research content is for informational purposes only. Not personalised investment advice.
            Please read all offer documents before investing.
          </p>
          <p className="text-xs text-muted-text">© 2026 Fundamental Lens</p>
        </div>
      </footer>

      {/* Sign-in modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative glass-card-elevated w-full max-w-md p-8 page-fade">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted-text hover:text-primary-text transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex justify-center mb-6">
              <Wordmark size="lg" />
            </div>
            <h2 className="text-xl font-semibold text-center text-primary-text mb-1">Welcome</h2>
            <p className="text-sm text-muted-text text-center mb-6">Choose how you'd like to enter</p>

            <div className="mb-5">
              <label className="block text-xs font-medium text-muted-text mb-1.5">Your name (optional)</label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none transition-colors text-primary-text"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleEnter('investor')}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl transition-colors group"
                style={{ border: '2px solid rgba(45,212,191,0.4)', background: 'rgba(45,212,191,0.08)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(45,212,191,0.15)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(45,212,191,0.08)')}
              >
                <div className="text-left">
                  <p className="font-semibold text-brand-teal">Enter as Investor</p>
                  <p className="text-xs text-muted-text mt-0.5">Browse research, track portfolio, set alerts</p>
                </div>
                <ArrowRight size={18} className="text-brand-teal group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleEnter('creator')}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl transition-colors group"
                style={{ border: '2px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              >
                <div className="text-left">
                  <p className="font-semibold text-primary-text">Enter as Research Creator</p>
                  <p className="text-xs text-muted-text mt-0.5">Manage pipeline, publish reports, configure models</p>
                </div>
                <ArrowRight size={18} className="text-muted-text group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-[11px] text-muted-text text-center mt-5 leading-relaxed">
              This is a prototype. No real account required. Research is for informational purposes only.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
