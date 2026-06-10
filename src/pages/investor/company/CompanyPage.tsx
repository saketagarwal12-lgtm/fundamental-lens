import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ChevronDown, ChevronRight, Download, Bell, Star, ArrowLeft,
  TrendingUp, TrendingDown, MessageSquare, Send,
} from 'lucide-react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
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

const COLORS = ['#0F6E64', '#2F8A5F', '#C08A2E', '#1B6E4B', '#B5524A', '#6A6E76', '#4A7FA5', '#8B6FC8', '#D4956A', '#5BA88B', '#A8B5C2', '#7D8B5E', '#C4A882'];

// ── Health Score Chart ──────────────────────────────────────────────────────

const CustomDot = (props: {
  cx?: number; cy?: number; payload?: { event?: { direction: 'up' | 'down' } };
}) => {
  const { cx = 0, cy = 0, payload } = props;
  if (!payload?.event) return <circle cx={cx} cy={cy} r={3} fill="#0F6E64" />;
  const color = payload.event.direction === 'up' ? '#2F8A5F' : '#B5524A';
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={color} opacity={0.15} />
      <circle cx={cx} cy={cy} r={4} fill={color} />
    </g>
  );
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { month: string; score: number; event?: { direction: string; reason: string } } }> }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-white border border-hairline rounded-xl shadow-lg p-4 max-w-xs">
      <p className="font-medium text-[#23262C] text-sm">{d.month}</p>
      <p className="font-mono-nums font-bold text-lg" style={{ color: d.score >= 70 ? '#2F8A5F' : d.score >= 55 ? '#C08A2E' : '#B5524A' }}>
        {d.score}/100
      </p>
      {d.event && (
        <div className={`mt-2 pt-2 border-t border-hairline flex gap-2 items-start`}>
          <span className={`text-lg ${d.event.direction === 'up' ? 'text-[#2F8A5F]' : 'text-[#B5524A]'}`}>
            {d.event.direction === 'up' ? '↑' : '↓'}
          </span>
          <p className="text-xs text-muted leading-relaxed">{d.event.reason}</p>
        </div>
      )}
    </div>
  );
};

// ── Scorecard Pillar ──────────────────────────────────────────────────────────

const PillarRow: React.FC<{ pillar: typeof scorecard[0]; onFactorClick: (name: string) => void; activeFactorName: string | null }> = ({ pillar, onFactorClick, activeFactorName }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-hairline rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-paper/50 transition-colors"
      >
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-[#23262C] text-sm">{pillar.name}</span>
            <GradeBadge grade={pillar.grade} compact />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-32 h-1.5 bg-hairline rounded-full overflow-hidden hidden sm:block">
            <div className="h-full rounded-full" style={{ width: `${pillar.pct}%`, backgroundColor: gradeBarColor(pillar.grade) }} />
          </div>
          <span className="font-mono-nums text-sm font-semibold w-9 text-right" style={{ color: gradeBarColor(pillar.grade) }}>{pillar.pct}%</span>
          {open ? <ChevronDown size={15} className="text-muted" /> : <ChevronRight size={15} className="text-muted" />}
        </div>
      </button>
      {open && (
        <div className="border-t border-hairline bg-paper/30 px-5 py-3 space-y-2">
          {pillar.factors.map(f => (
            <button
              key={f.name}
              onClick={() => onFactorClick(f.name)}
              className={`w-full flex items-center gap-3 py-2 px-2 rounded-lg transition-colors text-left ${activeFactorName === f.name ? 'bg-brand/10' : 'hover:bg-white'}`}
            >
              <span className="text-sm text-[#23262C] flex-1 min-w-0 truncate">{f.name}</span>
              <GradeBadge grade={f.grade} compact />
              <div className="w-20 h-1.5 bg-hairline rounded-full overflow-hidden hidden sm:block">
                <div className="h-full rounded-full" style={{ width: `${f.pct}%`, backgroundColor: gradeBarColor(f.grade) }} />
              </div>
              <span className="font-mono-nums text-xs font-medium w-8 text-right" style={{ color: gradeBarColor(f.grade) }}>{f.pct}%</span>
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
  if (!sec) return <p className="text-muted text-sm p-4">Select a financial section.</p>;
  const periods = sec.metrics[0]?.values.map(v => v.period) ?? [];
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <GradeBadge grade={sec.grade} />
        <span className="font-mono-nums text-sm font-semibold text-muted">{sec.pct}%</span>
      </div>
      <div className="overflow-x-auto rounded-xl border border-hairline mb-5">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-paper/70 border-b border-hairline">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted">Metric</th>
              {periods.map(p => (
                <th key={p} className="text-right px-4 py-3 text-xs font-medium text-muted">{p}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sec.metrics.map(m => (
              <tr key={m.label} className="border-b border-hairline last:border-0 hover:bg-paper/30 transition-colors">
                <td className="px-5 py-3">
                  <span className="font-medium text-[#23262C]">{m.label}</span>
                  <span className="text-xs text-muted ml-1.5">{m.unit}</span>
                </td>
                {m.values.map((v, i) => (
                  <td key={i} className="px-4 py-3 text-right font-mono-nums text-[#23262C]">
                    {v.value !== null ? v.value.toLocaleString() : '—'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-paper/50 rounded-xl border border-hairline p-5">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Commentary</p>
        <p className="text-sm text-[#23262C] leading-relaxed">{sec.commentary}</p>
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

  const company = companies.find(c => c.id === id);

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted">Company not found.</p>
        <button onClick={() => navigate('/app/dashboard')} className="text-brand hover:underline text-sm">Back to Dashboard</button>
      </div>
    );
  }

  // For non-krazybee companies, show a placeholder
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

  const activeFactorData = activeFactorName
    ? qualitativeMetrics.find(m => m.factor === activeFactorName)
    : null;

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
      <aside className="lg:w-52 lg:shrink-0 border-b lg:border-b-0 lg:border-r border-hairline bg-white">
        <div className="p-4 border-b border-hairline">
          <button
            onClick={() => navigate('/app/dashboard')}
            className="flex items-center gap-1.5 text-xs text-muted hover:text-brand transition-colors"
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
                  section === item.key ? 'bg-brand text-white' : 'text-muted hover:text-[#23262C] hover:bg-paper'
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
        <div className="bg-white border-b border-hairline px-6 py-5 sticky top-0 z-10">
          <div className="flex items-start gap-5 flex-wrap">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h1 className="text-lg font-semibold text-ink">{company.name}</h1>
                <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                  company.recommendation === 'Subscribe' ? 'bg-[#2F8A5F]/10 text-[#2F8A5F]' :
                  company.recommendation === 'Avoid' ? 'bg-[#B5524A]/10 text-[#B5524A]' :
                  'bg-[#C08A2E]/10 text-[#C08A2E]'
                }`}>{company.recommendation}</span>
              </div>
              <p className="text-xs text-muted">
                {company.sector} · {company.subSector} · {company.hq} · Est. {company.established}
              </p>
              <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-muted">
                <span className="bg-paper px-2 py-0.5 rounded border border-hairline">{company.externalRating} · {company.ratingAgency}</span>
                <span>Internal: {company.internalRating}/15</span>
                <span>Combined: {company.combinedScore}</span>
              </div>
            </div>
            <div className="flex items-center gap-4 shrink-0">
              <ScoreRing score={company.healthScore} size={68} strokeWidth={6} />
              <div className="flex flex-col gap-2">
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-medium hover:bg-brand-deep transition-colors">
                  <Bell size={13} /> Alert
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hairline text-xs font-medium hover:bg-paper transition-colors">
                  <Download size={13} /> PDF
                </button>
                <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hairline text-xs font-medium hover:bg-paper transition-colors">
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
              <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
                <TrendingUp size={28} className="text-brand" />
              </div>
              <h2 className="text-lg font-semibold text-ink mb-2">Full report for {company.name}</h2>
              <p className="text-sm text-muted mb-4 leading-relaxed">
                This is a prototype. Detailed data is available for KrazyBee Services Limited. Full coverage for {company.name} is in pipeline.
              </p>
              <button
                onClick={() => navigate('/app/company/krazybee')}
                className="px-5 py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-deep transition-colors"
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
                <h2 className="text-base font-semibold text-ink mb-5">Overview</h2>

                {/* Summary metric cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-7">
                  <MetricCard label="On-book AUM (4Q26)" value="₹9,861" unit="Cr" trend="up" delta="₹3,900 Cr YoY" />
                  <MetricCard label="GNPA (4Q26)" value="1.53" unit="%" trend="up" delta="vs 3.13% FY25" />
                  <MetricCard label="Total CAR" value="23.55" unit="%" trend="down" delta="vs 29.59% FY25" />
                  <MetricCard label="NCD YTM" value="10.27" unit="%" highlight />
                </div>

                {/* Health score chart */}
                <div className="bg-white rounded-xl border border-hairline p-5 mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#23262C] text-sm">Health Score — 12-Month Trend</h3>
                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2F8A5F] inline-block" /> Score improvement</span>
                      <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#B5524A] inline-block" /> Score decline</span>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={healthScoreSeries} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E4E5E0" vertical={false} />
                      <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6A6E76' }} axisLine={false} tickLine={false} />
                      <YAxis domain={[55, 75]} tick={{ fontSize: 11, fill: '#6A6E76' }} axisLine={false} tickLine={false} />
                      <Tooltip content={<CustomTooltip />} />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#0F6E64"
                        strokeWidth={2}
                        dot={(props) => <CustomDot {...props} />}
                        activeDot={{ r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                  <p className="text-[11px] text-muted mt-2">Hover data points with arrows to see the reason for score change.</p>
                </div>

                {/* Scorecard */}
                <div className="mb-6">
                  <h3 className="font-semibold text-[#23262C] text-sm mb-4">Proprietary Scorecard</h3>
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
                  <div className="bg-white rounded-xl border border-hairline p-5">
                    <h3 className="font-semibold text-[#23262C] text-sm mb-4">Ownership Structure</h3>
                    <div className="flex gap-4 items-center">
                      <PieChart width={120} height={120}>
                        <Pie data={ownershipData} cx={55} cy={55} innerRadius={35} outerRadius={55} dataKey="pct" paddingAngle={1}>
                          {ownershipData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                      </PieChart>
                      <div className="flex-1 space-y-1 min-w-0">
                        {ownershipData.slice(0, 5).map((o, i) => (
                          <div key={o.name} className="flex items-center gap-2 text-xs">
                            <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                            <span className="truncate text-muted flex-1">{o.name}</span>
                            <span className="font-mono-nums font-medium text-[#23262C]">{o.pct}%</span>
                          </div>
                        ))}
                        <p className="text-[10px] text-muted pl-4 mt-1">+{ownershipData.length - 5} more</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-hairline p-5">
                    <h3 className="font-semibold text-[#23262C] text-sm mb-4">Borrower Mix (AUM)</h3>
                    <div className="flex gap-4 items-center">
                      <PieChart width={120} height={120}>
                        <Pie data={borrowerMix} cx={55} cy={55} innerRadius={35} outerRadius={55} dataKey="pct" paddingAngle={2}>
                          {borrowerMix.map((_, i) => <Cell key={i} fill={['#0F6E64', '#C08A2E', '#6A6E76'][i]} />)}
                        </Pie>
                      </PieChart>
                      <div className="flex-1 space-y-2 min-w-0">
                        {borrowerMix.map((b, i) => (
                          <div key={b.name} className="text-xs">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: ['#0F6E64', '#C08A2E', '#6A6E76'][i] }} />
                              <span className="truncate text-muted">{b.name}</span>
                            </div>
                            <p className="font-mono-nums font-semibold text-[#23262C] ml-3.5">{b.pct}% · ₹{b.aum} Cr</p>
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
                <h2 className="text-base font-semibold text-ink mb-5">Business & Management</h2>
                <div className="space-y-4">
                  {qualitativeMetrics.map(m => (
                    <div
                      key={m.factor}
                      id={`factor-${m.factor}`}
                      className={`bg-white rounded-xl border p-5 transition-colors ${activeFactorName === m.factor ? 'border-brand/40 ring-1 ring-brand/20' : 'border-hairline'}`}
                    >
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="font-semibold text-[#23262C]">{m.factor}</h3>
                        <GradeBadge grade={m.grade} />
                        <span className="font-mono-nums text-sm text-muted">{m.pct}%</span>
                      </div>
                      <div className="h-1.5 bg-hairline rounded-full mb-4 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: gradeBarColor(m.grade) }} />
                      </div>
                      <p className="text-sm text-[#23262C] leading-relaxed">{m.commentary}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─ FINANCIAL ANALYSIS ─ */}
            {section === 'financial' && (
              <div>
                <h2 className="text-base font-semibold text-ink mb-5">Financial Analysis</h2>
                <div className="flex gap-2 flex-wrap mb-6">
                  {Object.keys(financials).map(k => (
                    <button
                      key={k}
                      onClick={() => setFinancialTab(k)}
                      className={`px-4 py-2 rounded-lg text-xs font-medium transition-colors ${
                        financialTab === k ? 'bg-brand text-white' : 'bg-white border border-hairline text-muted hover:text-[#23262C]'
                      }`}
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
                <h2 className="text-base font-semibold text-ink mb-5">External Ratings</h2>
                {externalRatings.map(r => (
                  <div key={r.agency} className="bg-white rounded-xl border border-hairline p-6 mb-4">
                    <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                      <div>
                        <p className="text-xs text-muted uppercase tracking-wider mb-1">{r.agency}</p>
                        <div className="flex items-center gap-3">
                          <span className="font-mono-nums text-2xl font-bold text-ink">{r.rating}</span>
                          <span className={`text-xs px-2 py-0.5 rounded font-medium ${r.outlook === 'Stable' ? 'bg-[#2F8A5F]/10 text-[#2F8A5F]' : 'bg-[#C08A2E]/10 text-[#C08A2E]'}`}>
                            {r.outlook}
                          </span>
                        </div>
                      </div>
                      <span className="text-xs text-muted bg-paper px-3 py-1.5 rounded border border-hairline">{r.date}</span>
                    </div>
                    <div className="bg-paper/60 rounded-lg p-4">
                      <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Rating Rationale</p>
                      <p className="text-sm text-[#23262C] leading-relaxed">{r.rationale}</p>
                    </div>
                  </div>
                ))}
                <div className="bg-brand-tint rounded-xl border border-brand/20 p-5 text-sm">
                  <p className="font-medium text-brand mb-1">Our view vs agency view</p>
                  <p className="text-muted text-xs leading-relaxed">
                    Our internal rating of 7/15 (CARE: A) broadly aligns with the agency rating. Key divergence: we weight liquidity thin-ness and borrower profile risk more heavily, resulting in a slightly more cautious near-term outlook despite the positive unicorn development.
                  </p>
                </div>
              </div>
            )}

            {/* ─ DEVELOPMENTS ─ */}
            {section === 'developments' && (
              <div>
                <h2 className="text-base font-semibold text-ink mb-5">Recent Developments</h2>
                <div className="space-y-4">
                  {materialDevelopments.map(d => (
                    <div key={d.title} className="bg-white rounded-xl border border-hairline p-5">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-mono-nums font-medium bg-paper px-2.5 py-1 rounded border border-hairline text-muted">{d.date}</span>
                        <h3 className="font-semibold text-[#23262C] text-sm">{d.title}</h3>
                      </div>
                      <p className="text-sm text-muted leading-relaxed">{d.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─ NCD ISSUANCES ─ */}
            {section === 'ncd' && (
              <div>
                <h2 className="text-base font-semibold text-ink mb-5">NCD Issuances</h2>
                <div className="overflow-x-auto rounded-xl border border-hairline">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-paper/70 border-b border-hairline">
                        <th className="text-left px-5 py-3 text-xs font-medium text-muted">ISIN</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-muted">Coupon</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-muted">YTM</th>
                        <th className="text-center px-4 py-3 text-xs font-medium text-muted">Tenor</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-muted">Size (₹ Cr)</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-muted">Maturity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ncdIssuances.map(n => (
                        <tr key={n.isin} className={`border-b border-hairline last:border-0 transition-colors ${n.current ? 'bg-brand-tint' : 'hover:bg-paper/30'}`}>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs text-[#23262C]">{n.isin}</span>
                              {n.current && <span className="text-[10px] px-1.5 py-0.5 bg-brand text-white rounded font-bold uppercase">Current</span>}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-right font-mono-nums">{n.coupon.toFixed(2)}%</td>
                          <td className="px-4 py-3 text-right font-mono-nums font-semibold text-brand">{n.ytm.toFixed(2)}%</td>
                          <td className="px-4 py-3 text-center text-muted text-xs">{n.tenor}</td>
                          <td className="px-4 py-3 text-right font-mono-nums">{n.size.toLocaleString()}</td>
                          <td className="px-4 py-3 text-xs text-muted">{n.maturity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="mt-4 p-4 bg-paper rounded-xl border border-hairline text-xs text-muted leading-relaxed">
                  YTM figures are indicative as of research date. Actual secondary market YTM may vary. This is not an offer to buy or sell securities.
                </div>
              </div>
            )}

            {/* ─ SECTOR OUTLOOK ─ */}
            {section === 'sector' && (
              <div>
                <h2 className="text-base font-semibold text-ink mb-5">Sector Outlook</h2>
                <div className="space-y-5">
                  <div className="bg-white rounded-xl border border-hairline p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-semibold text-[#23262C]">NBFC Sector — Operating Outlook</h3>
                      <GradeBadge grade="Moderate" />
                    </div>
                    <p className="text-sm text-[#23262C] leading-relaxed">{sectorOutlook.operating}</p>
                  </div>
                  <div className="bg-white rounded-xl border border-hairline p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="font-semibold text-[#23262C]">Digital Unsecured PL Sub-sector</h3>
                      <GradeBadge grade="Moderate" />
                    </div>
                    <p className="text-sm text-[#23262C] leading-relaxed">{sectorOutlook.subSector}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ─ SUMMARY TABLE ─ */}
            {section === 'summary' && (
              <div>
                <h2 className="text-base font-semibold text-ink mb-5">Summary Table</h2>
                <div className="overflow-x-auto rounded-xl border border-hairline">
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
                        <tr key={row.label} className={`border-b border-hairline last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-paper/30'}`}>
                          <td className="px-5 py-3 text-xs font-medium text-muted w-48">{row.label}</td>
                          <td className="px-5 py-3 text-sm font-medium text-[#23262C]">{row.value}</td>
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
                  <h2 className="text-base font-semibold text-ink">Ask AI</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-brand/10 text-brand font-semibold uppercase tracking-wide">Beta</span>
                </div>
                <p className="text-sm text-muted mb-5">
                  Ask questions about KrazyBee's financials, business model, ratings, or risk factors. Powered by our research data.
                </p>

                {/* Pre-baked questions */}
                <div className="flex flex-wrap gap-2 mb-5">
                  {aiQAPairs.map(qa => (
                    <button
                      key={qa.q}
                      onClick={() => { setAiQuery(qa.q); handleAiQuery(qa.q); }}
                      className="text-xs px-3 py-2 rounded-full bg-white border border-hairline text-muted hover:border-brand/30 hover:text-brand transition-colors"
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
                    className="flex-1 px-4 py-3 border border-hairline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/40 focus:border-brand transition-colors"
                  />
                  <button
                    onClick={() => aiQuery.trim() && handleAiQuery(aiQuery)}
                    className="px-4 py-3 rounded-lg bg-brand text-white hover:bg-brand-deep transition-colors"
                  >
                    <Send size={16} />
                  </button>
                </div>

                {/* Answer */}
                {aiLoading && (
                  <div className="bg-white rounded-xl border border-hairline p-5 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-brand animate-pulse" />
                    <p className="text-sm text-muted">Thinking…</p>
                  </div>
                )}
                {aiAnswer && !aiLoading && (
                  <div className="bg-white rounded-xl border border-brand/20 p-5 page-fade">
                    <div className="flex items-center gap-2 mb-3">
                      <MessageSquare size={15} className="text-brand" />
                      <p className="text-xs font-semibold text-brand uppercase tracking-wide">Answer</p>
                    </div>
                    <p className="text-sm text-[#23262C] leading-relaxed">{aiAnswer}</p>
                    <p className="text-[11px] text-muted mt-4 pt-3 border-t border-hairline">
                      This response is based on the research report data. Not personalised investment advice.
                    </p>
                  </div>
                )}
                {!aiLoading && !aiAnswer && (
                  <div className="text-center py-10">
                    <MessageSquare size={32} className="mx-auto text-muted/30 mb-3" />
                    <p className="text-sm text-muted">Select a question above or type your own</p>
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
