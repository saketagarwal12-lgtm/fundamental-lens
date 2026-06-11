import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BarChart2, Bell, Search, ArrowRight, X, ChevronRight, BookOpen, Activity, Bot } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { ScoreRing } from '../components/ScoreRing';
import { GradeBadge } from '../components/GradeBadge';
import { BRAND } from '../brand';
import { useAuth } from '../contexts/AuthContext';

const previewPillars = [
  { name: 'Business & Management', grade: 'Moderate' as const, pct: 59 },
  { name: 'Financial Analysis', grade: 'Strong' as const, pct: 70 },
  { name: 'Issuance Assessment', grade: 'Strong' as const, pct: 70 },
  { name: 'Pricing', grade: 'Moderate' as const, pct: 63 },
  { name: 'Econ & Sector Outlook', grade: 'Moderate' as const, pct: 56 },
];

const features = [
  {
    icon: BarChart2,
    title: 'Proprietary Health Score',
    body: 'A single 0–100 score distilled from 25+ quantitative and qualitative factors — updated as new data arrives. See how your holding has evolved over months, not just today.',
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
  { n: '01', title: 'Search your issuer', body: 'Find any NBFC or bond issuer in our coverage universe by name, ISIN, or rating.' },
  { n: '02', title: 'Read the full report', body: 'Access the scorecard, financials deep-dive, ownership breakdown, and our proprietary recommendation.' },
  { n: '03', title: 'Monitor in your portfolio', body: 'Add to your watchlist. Get alerted when the Health Score moves or material news breaks.' },
];

const valueChips = [
  { icon: BookOpen, label: 'Fundamental research' },
  { icon: Activity, label: 'Real-time financial health score' },
  { icon: BarChart2, label: 'Financial & non-financial database' },
  { icon: Bot, label: 'Interactive AI bot' },
];

export const Landing: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');

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
            <a href="#features" className="hidden sm:inline text-sm font-medium text-muted-text hover:text-primary-text transition-colors">Features</a>
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
            <div className="mb-5">
              <Wordmark size="2xl" />
            </div>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-4"
              style={{ background: 'rgba(45,212,191,0.12)', border: '1px solid rgba(45,212,191,0.25)', color: '#2DD4BF' }}
            >
              <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: '#2DD4BF' }}></span>
              Now covering 5 NBFC issuers · More launching soon
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-medium text-primary-text leading-tight mb-4 text-glow-teal">
              {BRAND.tagline}
            </h1>
            <p className="text-lg text-muted-text leading-relaxed mb-5">
              Access institutional-grade fundamental research, a real-time financial health score, financial &amp; non-financial database, and an interactive AI bot with a single click.
            </p>

            {/* Value chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {valueChips.map(chip => (
                <div
                  key={chip.label}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-sm font-medium transition-transform duration-200 hover:-translate-y-0.5"
                  style={{ background: 'rgba(22,52,54,0.72)', border: '1px solid rgba(255,255,255,0.10)', color: '#E9F3F1', boxShadow: '0 8px 22px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.06)', backdropFilter: 'blur(14px)' }}
                >
                  <chip.icon size={14} style={{ color: '#2DD4BF' }} />
                  {chip.label}
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg btn-gradient text-sm"
              >
                Explore research <ArrowRight size={16} />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-6 py-3 rounded-lg text-primary-text font-semibold text-sm transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
              >
                See how it works
              </button>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="glass-card-elevated p-6 page-fade animate-float">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs text-muted-text uppercase tracking-wider mb-1">Live Preview</p>
                <h3 className="font-semibold text-primary-text text-[15px]">KrazyBee Services Limited</h3>
                <p className="text-xs text-muted-text mt-0.5">NBFC · Unsecured Personal Loans · A (Stable)</p>
              </div>
              <div className="flex items-center gap-3">
                <ScoreRing score={65} size={72} strokeWidth={6} />
                <span
                  className="px-2.5 py-1 rounded-md text-xs font-semibold"
                  style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399' }}
                >Subscribe</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {previewPillars.map(p => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted-text w-36 shrink-0 truncate">{p.name}</span>
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${p.pct}%`,
                        backgroundColor: p.grade === 'Strong' ? '#2DD4BF' : p.grade === 'Moderate' ? '#FBBF24' : '#FB7185',
                      }}
                    />
                  </div>
                  <GradeBadge grade={p.grade} compact />
                  <span className="text-xs font-mono-nums text-muted-text w-8 text-right">{p.pct}%</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 grid grid-cols-3 gap-3 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
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

      {/* Features */}
      <section id="features" className="py-20" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', background: 'rgba(18,42,44,0.3)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl font-medium text-primary-text mb-3">Everything you need to evaluate fixed-income credit</h2>
            <p className="text-muted-text max-w-xl mx-auto">No Bloomberg terminal needed. No financial modelling degree required. Just clear, honest fundamental research.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="glass-card p-6 transition-all duration-200">
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

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl font-medium text-primary-text mb-3">How it works</h2>
            <p className="text-muted-text">From search to informed decision in under five minutes.</p>
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

      {/* Trust strip */}
      <section style={{ background: 'rgba(18,42,44,0.5)', borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)' }} className="py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-serif text-2xl text-primary-text/90 mb-3">
            "The most important thing individual investors lack is access to institutional-grade fundamental research."
          </p>
          <p className="text-muted-text text-sm">— The founding premise of Fundamental Lens</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-8 px-8 py-3.5 rounded-lg btn-gradient text-sm inline-flex items-center gap-2"
          >
            Get started — it's free <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Disclaimer band */}
      <div className="py-5 px-6" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(10,25,27,0.5)' }}>
        <div className="max-w-6xl mx-auto">
          <p className="text-[11px] text-faint-text leading-relaxed text-center">
            Fundamental Lens provides research and information for educational purposes only and does not constitute personalised investment advice or a recommendation to buy, sell or hold any security. Investments in securities are subject to market risk; past performance does not guarantee future results. Health scores and assessments are model-generated and reviewed before publishing, but may contain errors and should not be the sole basis for any investment decision. Read all offer documents carefully and consult a qualified adviser before investing. [Entity name, SEBI/regulatory registration number and grievance-redressal details to be inserted.]
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
