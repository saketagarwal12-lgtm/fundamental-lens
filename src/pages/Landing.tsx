import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, BarChart2, Bell, Search, ArrowRight, X, ChevronRight } from 'lucide-react';
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
    <div className="min-h-screen bg-paper">
      {/* Nav */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-hairline">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Wordmark size="lg" />
          <div className="flex items-center gap-3">
            <a href="#features" className="hidden sm:inline text-sm font-medium text-muted hover:text-[#23262C] transition-colors">Features</a>
            <a href="#how-it-works" className="hidden sm:inline text-sm font-medium text-muted hover:text-[#23262C] transition-colors">How it works</a>
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-deep transition-colors"
            >
              Sign in
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 lg:pt-28 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="page-fade">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand/10 text-brand text-xs font-semibold mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-brand inline-block"></span>
              Now covering 5 NBFC issuers · More launching soon
            </div>
            <h1 className="font-serif text-4xl lg:text-5xl font-medium text-ink leading-tight mb-5">
              {BRAND.tagline}
            </h1>
            <p className="text-lg text-muted leading-relaxed mb-8">
              {BRAND.subtagline} Credit scorecards, health scores, financial deep-dives, and real-time alerts — built for the individual fixed-income investor.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-brand text-white font-semibold hover:bg-brand-deep transition-colors"
              >
                Explore research <ArrowRight size={16} />
              </button>
              <button
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-hairline text-[#23262C] font-semibold hover:bg-white transition-colors"
              >
                See how it works
              </button>
            </div>
          </div>

          {/* Hero preview card */}
          <div className="bg-white rounded-2xl border border-hairline shadow-xl p-6 page-fade">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-xs text-muted uppercase tracking-wider mb-1">Live Preview</p>
                <h3 className="font-semibold text-[#23262C] text-[15px]">KrazyBee Services Limited</h3>
                <p className="text-xs text-muted mt-0.5">NBFC · Unsecured Personal Loans · A (Stable)</p>
              </div>
              <div className="flex items-center gap-3">
                <ScoreRing score={65} size={72} strokeWidth={6} />
                <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-[#2F8A5F]/10 text-[#2F8A5F]">Subscribe</span>
              </div>
            </div>
            <div className="space-y-2.5">
              {previewPillars.map(p => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs text-muted w-36 shrink-0 truncate">{p.name}</span>
                  <div className="flex-1 h-1.5 bg-hairline rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${p.pct}%`,
                        backgroundColor: p.grade === 'Strong' ? '#2F8A5F' : p.grade === 'Moderate' ? '#C08A2E' : '#B5524A',
                      }}
                    />
                  </div>
                  <GradeBadge grade={p.grade} compact />
                  <span className="text-xs font-mono-nums text-muted w-8 text-right">{p.pct}%</span>
                </div>
              ))}
            </div>
            <div className="mt-5 pt-4 border-t border-hairline grid grid-cols-3 gap-3 text-center">
              <div>
                <p className="font-mono-nums text-sm font-semibold text-[#23262C]">1.53%</p>
                <p className="text-[10px] text-muted mt-0.5">GNPA (4Q26)</p>
              </div>
              <div>
                <p className="font-mono-nums text-sm font-semibold text-[#23262C]">23.55%</p>
                <p className="text-[10px] text-muted mt-0.5">Total CAR</p>
              </div>
              <div>
                <p className="font-mono-nums text-sm font-semibold text-[#23262C]">10.27%</p>
                <p className="text-[10px] text-muted mt-0.5">NCD YTM</p>
              </div>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 w-full py-2.5 rounded-lg bg-brand/5 border border-brand/20 text-brand text-sm font-semibold hover:bg-brand/10 transition-colors flex items-center justify-center gap-1.5"
            >
              Read full report <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white border-y border-hairline py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl font-medium text-ink mb-3">Everything you need to evaluate fixed-income credit</h2>
            <p className="text-muted max-w-xl mx-auto">No Bloomberg terminal needed. No financial modelling degree required. Just clear, honest research.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="p-6 rounded-xl bg-paper border border-hairline hover:border-brand/30 hover:bg-brand-tint transition-colors">
                <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center mb-4">
                  <f.icon size={20} />
                </div>
                <h3 className="font-semibold text-[#23262C] mb-2">{f.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="font-serif text-3xl font-medium text-ink mb-3">How it works</h2>
            <p className="text-muted">From search to informed decision in under five minutes.</p>
          </div>
          <div className="space-y-8">
            {steps.map((s, i) => (
              <div key={s.n} className="flex gap-6 items-start">
                <div className="w-12 h-12 shrink-0 rounded-xl bg-brand text-white flex items-center justify-center font-mono-nums font-bold text-sm">
                  {s.n}
                </div>
                <div className="flex-1 pt-2">
                  <h3 className="font-semibold text-[#23262C] mb-1">{s.title}</h3>
                  <p className="text-sm text-muted">{s.body}</p>
                </div>
                {i < steps.length - 1 && (
                  <div className="absolute ml-6 mt-12 w-px h-8 bg-hairline hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-ink py-14">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="font-serif text-2xl text-white/90 mb-3">
            "The most important thing individual investors lack is access to institutional-grade credit research."
          </p>
          <p className="text-white/40 text-sm">— The founding premise of Fundamental Lens</p>
          <button
            onClick={() => setShowModal(true)}
            className="mt-8 px-8 py-3.5 rounded-lg bg-brand text-white font-semibold hover:bg-brand-deep transition-colors inline-flex items-center gap-2"
          >
            Get started — it's free <ArrowRight size={16} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-hairline py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Wordmark size="sm" />
          <p className="text-xs text-muted text-center">
            Research content is for informational purposes only. Not personalised investment advice.
            Please read all offer documents before investing.
          </p>
          <p className="text-xs text-muted">© 2026 Fundamental Lens</p>
        </div>
      </footer>

      {/* Sign-in modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 page-fade">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-muted hover:text-[#23262C] transition-colors"
            >
              <X size={20} />
            </button>
            <div className="flex justify-center mb-6">
              <Wordmark size="lg" />
            </div>
            <h2 className="text-xl font-semibold text-center text-ink mb-1">Welcome</h2>
            <p className="text-sm text-muted text-center mb-6">Choose how you'd like to enter</p>

            <div className="mb-5">
              <label className="block text-xs font-medium text-muted mb-1.5">Your name (optional)</label>
              <input
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3 py-2.5 border border-hairline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
              />
            </div>

            <div className="space-y-3">
              <button
                onClick={() => handleEnter('investor')}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 border-brand bg-brand/5 hover:bg-brand/10 transition-colors group"
              >
                <div className="text-left">
                  <p className="font-semibold text-brand">Enter as Investor</p>
                  <p className="text-xs text-muted mt-0.5">Browse research, track portfolio, set alerts</p>
                </div>
                <ArrowRight size={18} className="text-brand group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => handleEnter('creator')}
                className="w-full flex items-center justify-between px-5 py-4 rounded-xl border-2 border-hairline hover:border-[#C08A2E]/40 hover:bg-[#C08A2E]/5 transition-colors group"
              >
                <div className="text-left">
                  <p className="font-semibold text-[#23262C]">Enter as Research Creator</p>
                  <p className="text-xs text-muted mt-0.5">Manage pipeline, publish reports, configure models</p>
                </div>
                <ArrowRight size={18} className="text-muted group-hover:translate-x-1 transition-transform" />
              </button>
            </div>

            <p className="text-[11px] text-muted text-center mt-5 leading-relaxed">
              This is a prototype. No real account required. Research is for informational purposes only.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
