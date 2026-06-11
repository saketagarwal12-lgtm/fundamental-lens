import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronDown, ChevronRight, Download, Bell, Star, ArrowLeft,
  TrendingUp, MessageSquare, Send, BookOpen,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Area, AreaChart,
} from 'recharts';
import { ScoreRing } from '../../../components/ScoreRing';
import { GradeBadge, gradeBarColor } from '../../../components/GradeBadge';
import { MetricCard } from '../../../components/MetricCard';
import {
  healthScoreSeries, scorecard, financials,
  qualitativeMetrics, ownershipData, borrowerMix,
  ncdIssuances, materialDevelopments, externalRatings,
  sectorOutlook, aiQAPairs,
} from '../../../data/krazybee';
import { companies } from '../../../data/companies';

type Section =
  | 'overview'
  | 'business'
  | 'financial'
  | 'external'
  | 'developments'
  | 'ncd'
  | 'sector'
  | 'summary'
  | 'ai';

const VIZ_COLORS = ['#2DD4BF', '#38BDF8', '#34D399', '#FBBF24', '#FB923C', '#A78BFA', '#E9F3F1'];

// ── Health Score Chart ──────────────────────────────────────────────────────

const CustomDot = (props: {
  cx?: number; cy?: number; payload?: { event?: { direction: 'up' | 'down' } };
}) => {
  const { cx = 0, cy = 0, payload } = props;
  if (!payload?.event) return <circle cx={cx} cy={cy} r={3} fill="#2DD4BF" />;
  const color = payload.event.direction === 'up' ? '#34D399' : '#FB7185';
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={color} opacity={0.2} />
      <circle cx={cx} cy={cy} r={4} fill={color} />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ payload: { month: string; score: number; event?: { direction: string; reason: string } } }>;
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-xl p-4 max-w-xs"
      style={{ background: 'rgba(15,35,38,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}
    >
      <p className="font-medium text-primary-text text-sm">{d.month}</p>
      <p
        className="font-mono-nums font-bold text-lg"
        style={{ color: d.score >= 70 ? '#34D399' : d.score >= 55 ? '#FBBF24' : '#FB7185' }}
      >
        {d.score}/100
      </p>
      {d.event && (
        <div className="mt-2 pt-2 flex gap-2 items-start" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ color: d.event.direction === 'up' ? '#34D399' : '#FB7185' }} className="text-lg">
            {d.event.direction === 'up' ? '↑' : '↓'}
          </span>
          <p className="text-xs text-muted-text leading-relaxed">{d.event.reason}</p>
        </div>
      )}
    </div>
  );
};

// ── Scorecard Pillar ──────────────────────────────────────────────────────────

const PillarRow: React.FC<{
  pillar: typeof scorecard[0];
  onFactorClick: (name: string) => void;
  activeFactorName: string | null;
}> = ({ pillar, onFactorClick, activeFactorName }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden mb-3"
      style={{ border: '1px solid rgba(255,255,255,0.08)' }}
    >
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 transition-colors"
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-primary-text text-sm">{pillar.name}</span>
            <GradeBadge grade={pillar.grade} compact />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div
            className="w-32 h-1.5 rounded-full overflow-hidden hidden sm:block"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          >
            <div className="h-full rounded-full" style={{ width: `${pillar.pct}%`, backgroundColor: gradeBarColor(pillar.grade) }} />
          </div>
          <span
            className="font-mono-nums text-sm font-semibold w-9 text-right"
            style={{ color: gradeBarColor(pillar.grade) }}
          >
            {pillar.pct}%
          </span>
          {open
            ? <ChevronDown size={15} className="text-muted-text" />
            : <ChevronRight size={15} className="text-muted-text" />
          }
        </div>
      </button>
      {open && (
        <div
          className="border-t px-5 py-3 space-y-2"
          style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
        >
          {pillar.factors.map(f => (
            <button
              key={f.name}
              onClick={() => onFactorClick(f.name)}
              className="w-full flex items-center gap-3 py-2 px-2 rounded-lg transition-colors text-left"
              style={activeFactorName === f.name
                ? { background: 'rgba(45,212,191,0.1)', border: '1px solid rgba(45,212,191,0.15)' }
                : { border: '1px solid transparent' }}
              onMouseEnter={e => { if (activeFactorName !== f.name) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              onMouseLeave={e => { if (activeFactorName !== f.name) e.currentTarget.style.background = 'transparent'; }}
            >
              <span className="text-sm text-primary-text flex-1 min-w-0 truncate">{f.name}</span>
              <GradeBadge grade={f.grade} compact />
              <div
                className="w-20 h-1.5 rounded-full overflow-hidden hidden sm:block"
                style={{ background: 'rgba(255,255,255,0.07)' }}
              >
                <div className="h-full rounded-full" style={{ width: `${f.pct}%`, backgroundColor: gradeBarColor(f.grade) }} />
              </div>
              <span
                className="font-mono-nums text-xs font-medium w-8 text-right"
                style={{ color: gradeBarColor(f.grade) }}
              >
                {f.pct}%
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Financial Section ──────────────────────────────────────────────────────────

const FinancialPanel: React.FC<{ sectionKey: string }> = ({ sectionKey }) => {
  const sec = financials[sectionKey];
  if (!sec) return <p className="text-muted-text text-sm p-4">Select a financial section.</p>;
  const periods = sec.metrics[0]?.values.map(v => v.period) ?? [];
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <GradeBadge grade={sec.grade} />
        <span className="font-mono-nums text-sm font-semibold text-muted-text">{sec.pct}%</span>
      </div>
      <div className="overflow-x-auto rounded-xl mb-5" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Metric</th>
              {periods.map(p => (
                <th key={p} className="text-right px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sec.metrics.map(m => (
              <tr
                key={m.label}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-5 py-3">
                  <span className="font-medium text-primary-text">{m.label}</span>
                  <span className="text-xs text-muted-text ml-1.5">{m.unit}</span>
                </td>
                {m.values.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-right font-mono-nums text-primary-text">
                    {v.value !== null ? v.value.toLocaleString() : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-2">Commentary</p>
        <p className="text-sm text-primary-text font-serif leading-relaxed">{sec.commentary}</p>
      </div>
    </div>
  );
};

// ── Main Component ─────────────────────────────────────────────────────────────

export const CompanyPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>('overview');
  const [activeFactorName, setActiveFactorName] = useState<string | null>(null);
  const [financialTab, setFinancialTab] = useState('capitalization');
  const [aiQuery, setAiQuery] = useState('');
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [readingMode, setReadingMode] = useState(false);

  const company = companies.find(c => c.id === id);

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-text">Company not found.</p>
        <button onClick={() => navigate('/app/dashboard')} className="text-brand-teal hover:underline text-sm">
          Back to Dashboard
        </button>
      </div>
    );
  }

  const isKrazybee = id === 'krazybee';

  const handleAiQuery = (q: string) => {
    const q_lower = q.toLowerCase();
    setAiLoading(true);
    setAiAnswer(null);
    setTimeout(() => {
      const match = aiQAPairs.find(p =>
        q_lower.includes(p.q.toLowerCase().split(' ').slice(0, 3).join(' ').toLowerCase()) ||
        p.q.toLowerCase().split(' ').some(word => word.length > 4 && q_lower.includes(word))
      );
      setAiAnswer(match?.a ?? "This is a prototype Q&A. Try asking about liquidity, GNPA trend, NCD pricing, or ownership structure.");
      setAiLoading(false);
    }, 600);
  };

  const recStyle = (rec: string): React.CSSProperties =>
    rec === 'Subscribe' ? { background: 'rgba(52,211,153,0.15)', color: '#34D399' } :
    rec === 'Avoid' ? { background: 'rgba(251,113,133,0.15)', color: '#FB7185' } :
    { background: 'rgba(251,191,36,0.15)', color: '#FBBF24' };

  const navItems: { key: Section; label: string }[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'business', label: 'Business & Management' },
    { key: 'financial', label: 'Financial Analysis' },
    { key: 'external', label: 'External Ratings' },
    { key: 'developments', label: 'Recent Developments' },
    { key: 'ncd', label: 'NCD Issuances' },
    { key: 'sector', label: 'Sector Outlook' },
    { key: 'summary', label: 'Summary Table' },
    { key: 'ai', label: 'Ask AI' },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-full page-fade">
      {/* Left nav rail */}
      <aside
        className="lg:w-52 lg:shrink-0 border-b lg:border-b-0 lg:border-r"
        style={{ background: 'rgba(10,25,27,0.7)', backdropFilter: 'blur(16px)', borderColor: 'rgba(255,255,255,0.07)' }}
      >
        <div className="p-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <button
            onClick={() => navigate('/app/dashboard')}
            className="flex items-center gap-1.5 text-xs text-muted-text hover:text-brand-teal transition-colors"
          >
            <ArrowLeft size={13} /> Back
          </button>
        </div>
        <nav className="p-2 lg:py-4">
          <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible pb-1 lg:pb-0">
            {navItems.map(item => (
              <button
                key={item.key}
                onClick={() => { setSection(item.key); setActiveFactorName(null); }}
                className={`shrink-0 lg:w-full text-left px-3 py-2 rounded-md text-xs font-medium transition-colors ${
                  section === item.key ? 'nav-item-active' : 'nav-item-inactive'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Company header */}
        <div
          className="glass-card-elevated px-6 py-5 sticky top-0 z-10"
          style={{ borderRadius: 0, backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          <div className="flex items-start gap-5 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-lg font-semibold text-primary-text">{company.name}</h1>
                <span
                  className="text-xs px-2.5 py-0.5 rounded-full font-semibold"
                  style={recStyle(company.recommendation)}
                >
                  {company.recommendation}
                </span>
              </div>
              <p className="text-xs text-muted-text">
                {company.sector} · {company.subSector} · {company.hq} · Est. {company.established}
              </p>
              <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-muted-text">
                <span
                  className="px-2 py-0.5 rounded"
                  style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  {company.externalRating} · {company.ratingAgency}
                </span>
                <span>Internal: {company.internalRating}/15</span>
                <span>Combined: {company.combinedScore}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <ScoreRing score={company.healthScore} size={68} strokeWidth={6} />
              <div className="flex flex-col gap-2">
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-gradient text-xs font-medium"
                >
                  <Bell size={13} /> Alert
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium btn-outline-glass"
                >
                  <Download size={13} /> PDF
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium btn-outline-glass"
                >
                  <Star size={13} /> Watch
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Non-krazybee placeholder */}
        {!isKrazybee && (
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}
              >
                <TrendingUp size={28} />
              </div>
              <h2 className="text-lg font-semibold text-primary-text mb-2">Full report for {company.name}</h2>
              <p className="text-sm text-muted-text mb-4 leading-relaxed">
                This is a prototype. Detailed data is available for KrazyBee Services Limited.
                Full coverage for {company.name} is in pipeline.
              </p>
              <button
                onClick={() => navigate('/app/company/krazybee')}
                className="px-5 py-2.5 rounded-full btn-gradient text-sm font-semibold"
              >
                View KrazyBee full report
              </button>
            </div>
          </div>
        )}

        {/* Krazybee content */}
        {isKrazybee && (
          <div className="p-6 max-w-4xl">

            {/* ─ OVERVIEW ─ */}
            {section === 'overview' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-5">Overview</h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
                  <MetricCard label="On-book AUM (4Q26)" value="₹9,861" unit="Cr" trend="up" delta="₹3,900 Cr YoY" />
                  <MetricCard label="GNPA (4Q26)" value="1.53" unit="%" trend="up" delta="vs 3.13% FY25" />
                  <MetricCard label="Total CAR" value="23.55" unit="%" trend="down" delta="vs 29.59% FY25" />
                  <MetricCard label="NCD YTM" value="10.27" unit="%" highlight />
                </div>

                {/* Health score chart */}
                <div className="glass-card p-5 mb-6">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h3 className="font-semibold text-primary-text text-sm">Health Score — 12-Month Trend</h3>
                    <div className="flex items-center gap-3 text-xs text-muted-text">
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#34D399' }} />
                        Score improvement
                      </span>
                      <span className="flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full inline-block" style={{ background: '#FB7185' }} />
                        Score decline
                      </span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <AreaChart data={healthScoreSeries} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                      <defs>
                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.2} />
                          <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CB3B1' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[55, 75]} tick={{ fontSize: 11, fill: '#9CB3B1' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="score"
                        stroke="#2DD4BF"
                        strokeWidth={2}
                        fill="url(#scoreGrad)"
                        dot={(props) => <CustomDot {...props} />}
                        activeDot={{ r: 6, fill: '#2DD4BF' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                  <p className="text-[11px] text-muted-text mt-2">Hover data points with arrows to see the reason for score change.</p>
                </div>

                {/* Scorecard */}
                <div className="mb-6">
                  <h3 className="font-semibold text-primary-text text-sm mb-4">Proprietary Scorecard</h3>
                  {scorecard.map(p => (
                    <PillarRow
                      key={p.name}
                      pillar={p}
                      onFactorClick={name => {
                        setActiveFactorName(activeFactorName === name ? null : name);
                        setSection('business');
                      }}
                      activeFactorName={activeFactorName}
                    />
                  ))}
                </div>

                {/* Ownership + borrower mix */}
                <div className="grid sm:grid-cols-2 gap-5 mb-6">
                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-primary-text text-sm mb-4">Ownership Structure</h3>
                    <div className="flex gap-4 items-center">
                      <PieChart width={120} height={120}>
                        <Pie data={ownershipData} cx={55} cy={55} innerRadius={35} outerRadius={55} dataKey="pct" paddingAngle={1}>
                          {ownershipData.map((_, i) => <Cell key={i} fill={VIZ_COLORS[i % VIZ_COLORS.length]} />)}
                        </Pie>
                      </PieChart>
                      <div className="flex-1 space-y-1 min-w-0">
                        {ownershipData.slice(0, 5).map((o, i) => (
                          <div key={o.name} className="flex items-center gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: VIZ_COLORS[i % VIZ_COLORS.length] }} />
                            <span className="truncate text-muted-text flex-1">{o.name}</span>
                            <span className="font-mono-nums font-medium text-primary-text">{o.pct}%</span>
                          </div>
                        ))}
                        <p className="text-[10px] text-muted-text pl-4 mt-1">+{ownershipData.length - 5} more</p>
                      </div>
                    </div>
                  </div>

                  <div className="glass-card p-5">
                    <h3 className="font-semibold text-primary-text text-sm mb-4">Borrower Mix (AUM)</h3>
                    <div className="flex gap-4 items-center">
                      <PieChart width={120} height={120}>
                        <Pie data={borrowerMix} cx={55} cy={55} innerRadius={35} outerRadius={55} dataKey="pct" paddingAngle={2}>
                          {borrowerMix.map((_, i) => <Cell key={i} fill={VIZ_COLORS[i]} />)}
                        </Pie>
                      </PieChart>
                      <div className="flex-1 space-y-2 min-w-0">
                        {borrowerMix.map((b, i) => (
                          <div key={b.name} className="text-xs">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: VIZ_COLORS[i] }} />
                              <span className="truncate text-muted-text">{b.name}</span>
                            </div>
                            <p className="font-mono-nums font-semibold text-primary-text ml-3.5">{b.pct}% · ₹{b.aum} Cr</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─ BUSINESS & MANAGEMENT ─ */}
            {section === 'business' && (
              <div>
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <h2 className="text-base font-semibold text-primary-text">Business & Management</h2>
                  <button
                    onClick={() => setReadingMode(v => !v)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${readingMode ? 'btn-gradient' : 'btn-outline-glass'}`}
                  >
                    <BookOpen size={13} /> {readingMode ? 'Exit reading mode' : 'Reading mode'}
                  </button>
                </div>
                <div className="space-y-4">
                  {qualitativeMetrics.map(m => (
                    <div
                      key={m.factor}
                      id={`factor-${m.factor}`}
                      className={`glass-card p-5 transition-colors ${activeFactorName === m.factor ? '' : ''}`}
                      style={activeFactorName === m.factor
                        ? { borderColor: 'rgba(45,212,191,0.3)', boxShadow: '0 0 0 1px rgba(45,212,191,0.15), 0 12px 34px rgba(0,0,0,0.38)' }
                        : {}}
                    >
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="font-semibold text-primary-text">{m.factor}</h3>
                        <GradeBadge grade={m.grade} />
                        <span className="font-mono-nums text-sm text-muted-text">{m.pct}%</span>
                      </div>
                      <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: gradeBarColor(m.grade) }} />
                      </div>
                      <p
                        className="text-sm leading-relaxed"
                        style={readingMode
                          ? { background: 'rgba(245,240,230,0.95)', color: '#1a1a1a', borderRadius: '12px', padding: '1rem', fontFamily: 'Newsreader, Georgia, serif' }
                          : { color: '#E9F3F1', fontFamily: 'Newsreader, Georgia, serif' }}
                      >
                        {m.commentary}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─ FINANCIAL ANALYSIS ─ */}
            {section === 'financial' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-5">Financial Analysis</h2>
                <div className="pill-track flex gap-1 mb-6 flex-wrap">
                  {Object.keys(financials).map(k => (
                    <button
                      key={k}
                      onClick={() => setFinancialTab(k)}
                      className={financialTab === k ? 'pill-active' : 'pill-inactive'}
                    >
                      {k === 'fundingLiquidity' ? 'Funding & Liquidity' :
                       k === 'capitalization' ? 'Capitalization' :
                       k === 'profitability' ? 'Profitability' : 'Asset Quality'}
                    </button>
                  ))}
                </div>
                <FinancialPanel sectionKey={financialTab} />
              </div>
            )}

            {/* ─ EXTERNAL RATINGS ─ */}
            {section === 'external' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-5">External Ratings</h2>
                {externalRatings.map(r => (
                  <div key={r.agency} className="glass-card p-6 mb-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                      <div>
                        <p className="text-xs text-muted-text uppercase tracking-wider mb-1">{r.agency}</p>
                        <div className="flex items-center gap-3">
                          <span className="font-mono-nums text-2xl font-bold text-primary-text">{r.rating}</span>
                          <span
                            className="text-xs px-2 py-0.5 rounded font-medium"
                            style={r.outlook === 'Stable'
                              ? { background: 'rgba(52,211,153,0.15)', color: '#34D399' }
                              : { background: 'rgba(251,191,36,0.15)', color: '#FBBF24' }}
                          >
                            {r.outlook}
                          </span>
                        </div>
                      </div>
                      <span
                        className="text-xs text-muted-text px-3 py-1.5 rounded"
                        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                      >
                        {r.date}
                      </span>
                    </div>
                    <div className="rounded-lg p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <p className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-2">Rating Rationale</p>
                      <p className="text-sm text-primary-text font-serif leading-relaxed">{r.rationale}</p>
                    </div>
                  </div>
                ))}
                <div
                  className="rounded-xl p-5 text-sm"
                  style={{ background: 'rgba(45,212,191,0.06)', border: '1px solid rgba(45,212,191,0.2)' }}
                >
                  <p className="font-medium text-brand-teal mb-1">Our view vs agency view</p>
                  <p className="text-muted-text text-xs leading-relaxed">
                    Our internal rating of 7/15 (CARE: A) broadly aligns with the agency rating. Key divergence: we weight
                    liquidity thin-ness and borrower profile risk more heavily, resulting in a slightly more cautious near-term
                    outlook despite the positive unicorn development.
                  </p>
                </div>
              </div>
            )}

            {/* ─ DEVELOPMENTS ─ */}
            {section === 'developments' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-5">Recent Developments</h2>
                <div className="space-y-4">
                  {materialDevelopments.map(d => (
                    <div key={d.title} className="glass-card p-5">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span
                          className="text-xs font-mono-nums font-medium px-2.5 py-1 rounded"
                          style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9CB3B1' }}
                        >
                          {d.date}
                        </span>
                        <h3 className="font-semibold text-primary-text text-sm">{d.title}</h3>
                      </div>
                      <p className="text-sm text-muted-text leading-relaxed font-serif">{d.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─ NCD ISSUANCES ─ */}
            {section === 'ncd' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-5">NCD Issuances</h2>
                <div className="glass-card overflow-hidden mb-4">
                  <table className="w-full text-sm overflow-x-auto">
                    <thead>
                      <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        <th className="text-left px-5 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">ISIN</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Coupon</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">YTM</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Tenor</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Size (₹ Cr)</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Maturity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ncdIssuances.map(n => (
                        <tr
                          key={n.isin}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: n.current ? 'rgba(45,212,191,0.06)' : 'transparent',
                          }}
                          onMouseEnter={e => { if (!n.current) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                          onMouseLeave={e => { if (!n.current) e.currentTarget.style.background = 'transparent'; }}
                        >
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono-nums text-xs text-brand-teal">{n.isin}</span>
                              {n.current && (
                                <span
                                  className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase"
                                  style={{ background: 'linear-gradient(135deg,#2DD4BF,#22D3EE)', color: '#0B1F20' }}
                                >
                                  Current
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono-nums text-primary-text">{n.coupon.toFixed(2)}%</td>
                          <td className="px-4 py-3 text-right font-mono-nums font-semibold text-brand-teal">{n.ytm.toFixed(2)}%</td>
                          <td className="px-4 py-3 text-center text-muted-text text-xs">{n.tenor}</td>
                          <td className="px-4 py-3 text-right font-mono-nums text-primary-text">{n.size.toLocaleString()}</td>
                          <td className="px-4 py-3 text-xs text-muted-text">{n.maturity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div
                  className="p-4 rounded-xl text-xs text-muted-text leading-relaxed"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  YTM figures are indicative as of research date. Actual secondary market YTM may vary.
                  This is not an offer to buy or sell securities.
                </div>
              </div>
            )}

            {/* ─ SECTOR OUTLOOK ─ */}
            {section === 'sector' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-5">Sector Outlook</h2>
                <div className="space-y-5">
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-semibold text-primary-text">NBFC Sector — Operating Outlook</h3>
                      <GradeBadge grade="Moderate" />
                    </div>
                    <p className="text-sm text-primary-text font-serif leading-relaxed">{sectorOutlook.operating}</p>
                  </div>
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-semibold text-primary-text">Digital Unsecured PL Sub-sector</h3>
                      <GradeBadge grade="Moderate" />
                    </div>
                    <p className="text-sm text-primary-text font-serif leading-relaxed">{sectorOutlook.subSector}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ─ SUMMARY TABLE ─ */}
            {section === 'summary' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-5">Summary Table</h2>
                <div className="glass-card overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        { label: 'Company', value: company.name },
                        { label: 'Sector', value: company.sector },
                        { label: 'Sub-Sector', value: company.subSector },
                        { label: 'Established', value: company.established },
                        { label: 'Headquarters', value: company.hq },
                        { label: 'External Rating', value: `${company.externalRating} (${company.ratingAgency}, ${company.ratingDate})` },
                        { label: 'Our Recommendation', value: company.recommendation },
                        { label: 'Health Score', value: `${company.healthScore}/100` },
                        { label: 'Internal Rating', value: `${company.internalRating}/15` },
                        { label: 'Combined Score', value: company.combinedScore },
                        { label: 'GNPA (4Q26)', value: '1.53%' },
                        { label: 'NNPA (4Q26)', value: '0.14%' },
                        { label: 'Total CAR (3Q26)', value: '23.55%' },
                        { label: 'ROAA (3Q26)', value: '6.38%' },
                        { label: 'ROAE (3Q26)', value: '20.88%' },
                        { label: 'NIM (3Q26)', value: '19.34%' },
                        { label: 'Leverage (3Q26)', value: '2.40x' },
                        { label: 'AUM (4Q26)', value: '₹9,861 Cr' },
                        { label: 'Valuation (Apr 2026)', value: '~$1.5B (post Series E)' },
                      ].map((row, i) => (
                        <tr
                          key={row.label}
                          style={{
                            borderBottom: '1px solid rgba(255,255,255,0.05)',
                            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                          }}
                        >
                          <td className="px-5 py-3 text-xs font-medium text-muted-text w-48">{row.label}</td>
                          <td className="px-5 py-3 text-sm font-medium text-primary-text">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ─ AI Q&A ─ */}
            {section === 'ai' && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <h2 className="text-base font-semibold text-primary-text">Ask AI</h2>
                  <span
                    className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide"
                    style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}
                  >
                    Beta
                  </span>
                </div>
                <p className="text-sm text-muted-text mb-5">
                  Ask questions about KrazyBee's financials, business model, ratings, or risk factors. Powered by our research data.
                </p>

                {/* Pre-baked questions */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {aiQAPairs.map(qa => (
                    <button
                      key={qa.q}
                      onClick={() => { setAiQuery(qa.q); handleAiQuery(qa.q); }}
                      className="text-xs px-3 py-2 rounded-full text-muted-text transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(45,212,191,0.3)'; e.currentTarget.style.color = '#2DD4BF'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#9CB3B1'; }}
                    >
                      {qa.q}
                    </button>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-2 mb-5">
                  <input
                    type="text"
                    value={aiQuery}
                    onChange={e => setAiQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && aiQuery.trim() && handleAiQuery(aiQuery)}
                    placeholder="Ask a question about KrazyBee…"
                    className="flex-1 px-4 py-3 rounded-lg text-sm focus:outline-none text-primary-text"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  />
                  <button
                    onClick={() => aiQuery.trim() && handleAiQuery(aiQuery)}
                    className="px-4 py-3 rounded-lg btn-gradient"
                  >
                    <Send size={16} />
                  </button>
                </div>

                {/* Answer */}
                {aiLoading && (
                  <div className="glass-card p-5 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#2DD4BF' }} />
                    <p className="text-sm text-muted-text">Thinking…</p>
                  </div>
                )}
                {aiAnswer && !aiLoading && (
                  <div
                    className="glass-card p-5 page-fade"
                    style={{ borderColor: 'rgba(45,212,191,0.2)' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare size={15} style={{ color: '#2DD4BF' }} />
                      <p className="text-xs font-semibold text-brand-teal uppercase tracking-wide">Answer</p>
                    </div>
                    <p className="text-sm text-primary-text font-serif leading-relaxed">{aiAnswer}</p>
                    <p
                      className="text-[11px] text-muted-text mt-4 pt-3"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      This response is based on the research report data. Not personalised investment advice.
                    </p>
                  </div>
                )}
                {!aiLoading && !aiAnswer && (
                  <div className="text-center py-10">
                    <MessageSquare size={32} className="mx-auto mb-3" style={{ color: 'rgba(156,179,177,0.25)' }} />
                    <p className="text-sm text-muted-text">Select a question above or type your own</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
