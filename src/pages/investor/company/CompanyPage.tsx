import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Download, Bell, Star, ArrowLeft, ChevronDown, ChevronRight,
  TrendingUp, MessageSquare, Send, BookOpen, ShieldCheck, Lightbulb,
  Users, MapPin, Layers, AlertTriangle, ChevronsLeft, ChevronsRight,
  LayoutGrid, Briefcase, LineChart as LineChartIcon, Scale, Award,
  Newspaper, FileText, Globe, Table, Bot, Database, SlidersHorizontal, Grid3x3,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ScoreRing } from '../../../components/ScoreRing';
import { GradeBadge, gradeBarColor } from '../../../components/GradeBadge';
import { MetricCard } from '../../../components/MetricCard';
import { YieldGauge } from '../../../components/YieldGauge';
import { PeerYieldRange } from '../../../components/PeerYieldRange';
import { CovenantTable } from '../../../components/CovenantTable';
import { FundamentalScore } from '../../../components/FundamentalScore';
import { DataSourcesPanel } from '../../../components/DataSourcesPanel';
import { SignalsFeed } from '../../../components/SignalsFeed';
import { WeightageWhatIf } from '../../../components/WeightageWhatIf';
import { ExpandableAnalysis } from '../../../components/ExpandableAnalysis';
import { ScorecardTable } from '../../../components/ScorecardTable';
import { RatingLens } from '../../../components/RatingLens';
import type { RatingLensPillar } from '../../../components/RatingLens';
import { companies } from '../../../data/companies';
import { getReport } from '../../../data/reports';
import { getScaledScore, getIssuerTrend } from '../../../data/score';
import type { CompanyReport } from '../../../data/reports';
import type { FinancialSection } from '../../../data/krazybee';

type Section =
  | 'overview' | 'scorecard' | 'signals' | 'weightage' | 'business' | 'financial' | 'peers' | 'external'
  | 'developments' | 'ncd' | 'sector' | 'summary' | 'ai';

const VIZ_COLORS = ['#2DD4BF', '#38BDF8', '#34D399', '#FBBF24', '#FB923C', '#A78BFA', '#E9F3F1', '#0EA5A0', '#60A5FA', '#F472B6', '#FACC15', '#94A3B8', '#22D3EE'];

const latest = (sec: FinancialSection | undefined, label: string): string => {
  if (!sec) return '—';
  const m = sec.metrics.find(x => x.label === label);
  if (!m) return '—';
  const v = [...m.values].reverse().find(x => x.value !== null);
  return v && v.value !== null ? `${v.value.toLocaleString()}${m.unit === '%' ? '%' : m.unit === 'x' ? 'x' : ''}` : '—';
};

// Latest value across any of the candidate labels (ratio names differ by entity).
const latestAny = (sec: FinancialSection | undefined, labels: string[]): string => {
  if (!sec) return '—';
  for (const m of sec.metrics) {
    if (labels.some(l => m.label.toLowerCase().includes(l.toLowerCase()))) {
      const v = [...m.values].reverse().find(x => x.value !== null);
      if (v && v.value !== null) return `${v.value.toLocaleString()}${m.unit === '%' ? '%' : m.unit === 'x' ? 'x' : ''}`;
    }
  }
  return '—';
};


// ── Financial panel ─────────────────────────────────────────────────────────────

const FIN_LABELS: Record<string, string> = {
  capitalization: 'Capitalization',
  fundingLiquidity: 'Funding & Liquidity',
  profitability: 'Profitability',
  assetQuality: 'Asset Quality',
};

const FinancialPanel: React.FC<{ sec: FinancialSection | undefined; sectionKey: string }> = ({ sec, sectionKey }) => {
  if (!sec) return <p className="text-muted-text text-sm p-4">Select a financial section.</p>;
  const periods = sec.metrics[0]?.values.map(v => v.period) ?? [];
  const fmt = (n: number) => Math.abs(n) >= 1000 ? n.toLocaleString('en-IN') : String(n);
  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="t-h3 text-primary-text">{FIN_LABELS[sectionKey] ?? 'Financials'} — {sec.grade}</h3>
        <GradeBadge grade={sec.grade} compact />
      </div>

      {/* Full ratio table — sticky indicator column + sticky header, N periods */}
      <div className="overflow-x-auto rounded-xl mb-5 relative" style={{ border: '1px solid rgba(255,255,255,0.08)', maxHeight: 520 }}>
        <table className="text-sm border-separate" style={{ borderSpacing: 0, minWidth: '100%' }}>
          <thead>
            <tr>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide sticky left-0 top-0 z-20"
                style={{ background: 'rgba(13,30,32,0.98)', borderBottom: '1px solid rgba(255,255,255,0.1)', minWidth: 200 }}>
                Indicator
              </th>
              {periods.map(p => (
                <th key={p} className="text-right px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide sticky top-0 z-10"
                  style={{ background: 'rgba(13,30,32,0.98)', borderBottom: '1px solid rgba(255,255,255,0.1)', minWidth: 92 }}>
                  {p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sec.metrics.map(m => (
              <tr key={m.label} className="group">
                <td className="px-4 py-2.5 sticky left-0 z-10"
                  style={{ background: 'rgba(11,26,28,0.98)', borderBottom: '1px solid rgba(255,255,255,0.05)', minWidth: 200 }}>
                  <span className="text-primary-text text-[13px]">{m.label}</span>
                  {m.unit && <span className="text-[11px] text-muted-text ml-1.5">{m.unit}</span>}
                </td>
                {m.values.map((v, i) => {
                  const neg = v.value !== null && v.value < 0;
                  return (
                    <td key={i} className="px-4 py-2.5 text-right font-mono-nums text-[13px]"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: neg ? '#FB7185' : '#E9F3F1' }}>
                      {v.value === null ? <span className="text-muted-text">—</span>
                        : neg ? `(${fmt(Math.abs(v.value))})` : fmt(v.value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="t-caption mb-5">Negative values shown in brackets and the Weak colour. "—" where the report does not report a figure.</p>

      {/* Summary → full write-up + quarterly update + outlook */}
      <div className="rounded-xl p-5" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-2">Commentary</p>
        <ExpandableAnalysis variant="financial" commentary={sec.commentary} quarterly={sec.quarterly} outlook={sec.outlook} />
      </div>
    </div>
  );
};

// ── Donut helper ────────────────────────────────────────────────────────────────

const Donut: React.FC<{ title: string; data: { name: string; pct: number; aum?: number }[]; limit?: number }> = ({ title, data, limit }) => {
  const shown = limit ? data.slice(0, limit) : data;
  return (
    <div className="glass-card p-5">
      <h3 className="font-semibold text-primary-text text-sm mb-4">{title}</h3>
      <div className="flex gap-4 items-center">
        <PieChart width={120} height={120}>
          <Pie data={data} cx={55} cy={55} innerRadius={35} outerRadius={55} dataKey="pct" paddingAngle={1}>
            {data.map((_, i) => <Cell key={i} fill={VIZ_COLORS[i % VIZ_COLORS.length]} />)}
          </Pie>
        </PieChart>
        <div className="flex-1 space-y-1 min-w-0">
          {shown.map((o, i) => (
            <div key={o.name} className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: VIZ_COLORS[i % VIZ_COLORS.length] }} />
              <span className="truncate text-muted-text flex-1">{o.name}</span>
              <span className="font-mono-nums font-medium text-primary-text">
                {o.pct}%{o.aum != null ? ` · ₹${o.aum.toLocaleString()} Cr` : ''}
              </span>
            </div>
          ))}
          {limit && data.length > limit && <p className="text-[10px] text-muted-text pl-4 mt-1">+{data.length - limit} more</p>}
        </div>
      </div>
    </div>
  );
};

// ── Main ────────────────────────────────────────────────────────────────────────

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
  const [navCollapsed, setNavCollapsed] = useState(() => {
    const saved = sessionStorage.getItem('fl-company-nav-collapsed');
    if (saved !== null) return saved === '1';
    return typeof window !== 'undefined' && window.innerWidth < 1024;
  });
  const toggleNav = () => setNavCollapsed(v => { sessionStorage.setItem('fl-company-nav-collapsed', v ? '0' : '1'); return !v; });
  const [finOpen, setFinOpen] = useState(false);

  const company = companies.find(c => c.id === id);
  const report: CompanyReport | undefined = getReport(id);

  if (!company) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <p className="text-muted-text">Company not found.</p>
        <button onClick={() => navigate('/app/dashboard')} className="text-brand-teal hover:underline text-sm">Back to Dashboard</button>
      </div>
    );
  }

  const recStyle = (rec: string): React.CSSProperties =>
    rec === 'Subscribe' ? { background: 'rgba(52,211,153,0.15)', color: '#34D399' } :
    rec === 'Avoid' ? { background: 'rgba(251,113,133,0.15)', color: '#FB7185' } :
    { background: 'rgba(251,191,36,0.15)', color: '#FBBF24' };

  const handleAiQuery = (q: string) => {
    if (!report) return;
    const ql = q.toLowerCase();
    setAiLoading(true);
    setAiAnswer(null);
    setTimeout(() => {
      const match = report.aiQAPairs.find(p =>
        p.q.toLowerCase().split(' ').some(w => w.length > 4 && ql.includes(w))
      );
      setAiAnswer(match?.a ?? 'This prototype answers from a fixed set of grounded examples; connected to a live model it would answer any question from the report and model figures.');
      setAiLoading(false);
    }, 600);
  };

  const navItems: { key: Section; label: string; icon: typeof LayoutGrid }[] = [
    { key: 'overview', label: 'Overview', icon: LayoutGrid },
    { key: 'scorecard', label: 'Scorecard', icon: Grid3x3 },
    { key: 'signals', label: 'Data & Signals', icon: Database },
    { key: 'weightage', label: 'Adjust weightage', icon: SlidersHorizontal },
    { key: 'business', label: 'Business & Management', icon: Briefcase },
    { key: 'financial', label: 'Financial Analysis', icon: LineChartIcon },
    { key: 'peers', label: 'Peer Comparison', icon: Scale },
    { key: 'external', label: 'External Ratings', icon: Award },
    { key: 'developments', label: 'Recent Developments', icon: Newspaper },
    { key: 'ncd', label: 'NCD Issuances', icon: FileText },
    { key: 'sector', label: 'Sector Outlook', icon: Globe },
    { key: 'summary', label: 'Summary Table', icon: Table },
    { key: 'ai', label: 'Ask AI', icon: Bot },
  ];

  // Financial Analysis sub-sections (Tier-2 hierarchy)
  const finChildren: { tab: string; label: string }[] = [
    { tab: 'capitalization', label: 'Capitalization' },
    { tab: 'fundingLiquidity', label: 'Funding & liquidity' },
    { tab: 'profitability', label: 'Profitability' },
    { tab: 'assetQuality', label: 'Asset quality' },
  ];

  const firstName = company.name.split(' ')[0];
  const subSectorLabel = report?.subSectorKey === 'gold' ? 'Gold-Loan' : report?.subSectorKey === 'mfi' ? 'Microfinance (MFI)' : 'Digital Unsecured PL';
  const issuerScore = report ? getScaledScore(report).components.find(c => c.key === 'issuer') : undefined;

  return (
    <div className="flex min-h-full page-fade">
      {/* Tier 2 — single contextual section panel (off-canvas when collapsed) */}
      <aside
        className={`shrink-0 overflow-hidden transition-[width] duration-200 ease-out ${navCollapsed ? 'w-0' : 'w-60'}`}
        style={{ background: 'rgba(10,25,27,0.7)', backdropFilter: 'blur(16px)', borderRight: navCollapsed ? 'none' : '1px solid rgba(255,255,255,0.07)' }}
        aria-hidden={navCollapsed}
      >
        <div className="w-60">
          <div className="px-4 h-14 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <button onClick={() => navigate('/app/dashboard')}
              className="flex items-center gap-1.5 text-xs text-muted-text hover:text-brand-teal transition-colors">
              <ArrowLeft size={13} /> Back to dashboard
            </button>
            <button onClick={toggleNav} aria-label="Hide sections"
              className="flex items-center justify-center w-6 h-6 rounded text-muted-text hover:text-primary-text transition-colors"
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <ChevronsLeft size={15} />
            </button>
          </div>
          <nav className="py-3 px-2 space-y-0.5 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 7rem)' }}>
            {navItems.map(item => {
              if (item.key === 'financial') {
                const open = finOpen || section === 'financial';
                return (
                  <div key={item.key}>
                    <button
                      onClick={() => { setSection('financial'); setActiveFactorName(null); setFinOpen(o => !o); }}
                      aria-expanded={open}
                      className={`w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${section === 'financial' ? 'nav-item-active' : 'nav-item-inactive'}`}
                    >
                      <item.icon size={15} className="shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {open ? <ChevronDown size={14} className="shrink-0" /> : <ChevronRight size={14} className="shrink-0" />}
                    </button>
                    {open && (
                      <div className="ml-4 mt-0.5 space-y-0.5" style={{ borderLeft: '1px solid rgba(255,255,255,0.08)' }}>
                        {finChildren.map(ch => (
                          <button key={ch.tab}
                            onClick={() => { setSection('financial'); setFinancialTab(ch.tab); }}
                            className={`w-full text-left pl-4 pr-3 py-1.5 rounded-md text-xs transition-colors ${section === 'financial' && financialTab === ch.tab ? 'text-brand-teal' : 'text-muted-text hover:text-primary-text'}`}
                            style={section === 'financial' && financialTab === ch.tab ? { background: 'rgba(45,212,191,0.1)' } : {}}>
                            {ch.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <button key={item.key}
                  onClick={() => { setSection(item.key); setActiveFactorName(null); }}
                  className={`w-full flex items-center gap-2.5 text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${section === item.key ? 'nav-item-active' : 'nav-item-inactive'}`}>
                  <item.icon size={15} className="shrink-0" />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Collapsed Tier-2 → section icon rail (icons + hover tooltips), distinct from the far-left rail */}
      {navCollapsed && (
        <nav aria-label="Sections"
          className="shrink-0 w-14 flex flex-col items-center py-3 gap-1 overflow-y-auto"
          style={{ background: 'rgba(10,25,27,0.7)', backdropFilter: 'blur(16px)', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={toggleNav} aria-label="Expand sections" title="Expand sections"
            className="w-9 h-9 flex items-center justify-center rounded-md text-brand-teal mb-1 transition-colors"
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <ChevronsRight size={16} />
          </button>
          {navItems.map(item => (
            <button key={item.key} title={item.label} aria-label={item.label}
              onClick={() => { setSection(item.key); setActiveFactorName(null); if (item.key === 'financial') setFinOpen(true); }}
              className={`w-9 h-9 flex items-center justify-center rounded-md transition-colors ${section === item.key ? 'nav-item-active' : 'nav-item-inactive'}`}>
              <item.icon size={17} />
            </button>
          ))}
        </nav>
      )}

      {/* Main content */}
      <div className="flex-1 min-w-0 overflow-y-auto">
        {/* Header — full on Overview, slim on every other section */}
        {section === 'overview' ? (
          <div className="glass-card-elevated px-6 py-5 sticky top-0 z-10"
            style={{ borderRadius: 0, backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-start gap-5 flex-wrap">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h1 className="text-lg font-semibold text-primary-text">{company.name}</h1>
                  <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold" style={recStyle(company.recommendation)}>{company.recommendation}</span>
                </div>
                <p className="text-xs text-muted-text">{company.sector} · {company.subSector} · {company.hq} · Est. {company.established}</p>
                <div className="flex items-center gap-3 mt-2 flex-wrap text-xs text-muted-text">
                  <span className="px-2 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {company.externalRating} · {company.ratingAgency}
                  </span>
                  <span>Internal: {company.internalRating}/15</span>
                  <span>Combined: {company.combinedScore}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <ScoreRing score={company.healthScore} size={68} strokeWidth={6} />
                <div className="flex flex-col gap-2">
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg btn-gradient text-xs font-medium"><Bell size={13} /> Alert</button>
                  <button onClick={() => window.print()} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium btn-outline-glass"><Download size={13} /> PDF</button>
                  <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium btn-outline-glass"><Star size={13} /> Watch</button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="sticky top-0 z-10 px-6 h-12 flex items-center gap-3"
            style={{ background: 'rgba(11,31,32,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <h1 className="text-sm font-semibold text-primary-text truncate">{company.name}</h1>
            <span className="text-xs text-muted-text truncate hidden sm:inline">· {company.subSector}</span>
            {issuerScore && (
              <span className="ml-auto shrink-0 text-[11px] font-mono-nums font-semibold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.25)' }}
                title="Fundamental Score (Issuer)">
                {issuerScore.score}/{issuerScore.max}
              </span>
            )}
          </div>
        )}

        {/* No report → placeholder */}
        {!report && (
          <div className="p-8 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}>
                <TrendingUp size={28} />
              </div>
              <h2 className="text-lg font-semibold text-primary-text mb-2">Full report for {company.name}</h2>
              <p className="text-sm text-muted-text mb-4 leading-relaxed">
                This issuer is in coverage pipeline. Fully-populated reports are available for KrazyBee, Avanti Finance, Keertana Finserv and Spandana Sphoorty.
              </p>
              <button onClick={() => navigate('/app/company/krazybee')} className="px-5 py-2.5 rounded-full btn-gradient text-sm font-semibold">View a sample full report</button>
            </div>
          </div>
        )}

        {report && (
          <div className="p-6 max-w-5xl mx-auto w-full">

            {/* ── OVERVIEW ── */}
            {section === 'overview' && (
              <div>
                {/* Fundamental Score hero */}
                <FundamentalScore report={report} />

                <h2 className="text-base font-semibold text-primary-text mb-5">Overview</h2>

                {/* KPI cards (latest from financials) — 8 compact */}
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 mb-7">
                  <MetricCard label="On-book AUM" value={latest(report.financials.assetQuality, 'On-book AUM')} unit="₹ Cr" />
                  <MetricCard label="GNPA" value={latest(report.financials.assetQuality, 'GNPA')} />
                  <MetricCard label="NNPA" value={latest(report.financials.assetQuality, 'NNPA')} />
                  <MetricCard label="Total CAR" value={latest(report.financials.capitalization, 'Total CAR')} />
                  <MetricCard label="Leverage" value={latestAny(report.financials.capitalization, ['Leverage', 'Gearing'])} />
                  <MetricCard label="NIM" value={latestAny(report.financials.profitability, ['NIM', 'Net Interest Margin'])} />
                  <MetricCard label="NCD YTM" value={report.yieldOverview.currentYtm.toFixed(2)} unit="%" highlight />
                  <MetricCard label="External Rating" value={company.externalRating.split(' ')[0]} />
                </div>

                {/* Highlight cards */}
                <div className="grid sm:grid-cols-2 gap-4 mb-7">
                  <div className="glass-card p-5" style={{ borderColor: 'rgba(45,212,191,0.2)' }}>
                    <div className="flex items-center gap-2 mb-3"><Lightbulb size={16} style={{ color: '#2DD4BF' }} /><h3 className="font-semibold text-primary-text text-sm">What's comforting?</h3></div>
                    <ul className="space-y-2">
                      {report.recommendationRationale.map(r => (
                        <li key={r} className="flex gap-2 text-xs text-muted-text leading-relaxed">
                          <span style={{ color: '#2DD4BF' }} className="shrink-0">▸</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="glass-card p-5">
                    <div className="flex items-center gap-2 mb-3"><ShieldCheck size={16} style={{ color: '#34D399' }} /><h3 className="font-semibold text-primary-text text-sm">How your investment is covered</h3></div>
                    <ul className="space-y-2">
                      {report.investorProtection.map(r => (
                        <li key={r} className="flex gap-2 text-xs text-muted-text leading-relaxed">
                          <span style={{ color: '#34D399' }} className="shrink-0">✓</span>{r}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Ownership + product mix */}
                <div className="grid sm:grid-cols-2 gap-5 mb-3">
                  <Donut title="Ownership Structure" data={report.ownership} limit={5} />
                  <Donut title="Product / AUM Mix" data={report.productMix} />
                </div>
                <p className="text-xs text-muted-text leading-relaxed mb-7">{report.ownershipNote}</p>

                {/* Yield Overview — last */}
                <div>
                  <h3 className="t-h3 text-primary-text mb-3">Yield Overview</h3>
                  <YieldGauge data={report.yieldOverview} />
                </div>
              </div>
            )}

            {/* ── SCORECARD ── */}
            {section === 'scorecard' && (
              <div className="space-y-5">
                <h2 className="t-h2 text-primary-text">Scorecard</h2>

                {/* Rating scale */}
                <div className="glass-card p-5">
                  <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                    <h3 className="t-h3 text-primary-text">Rating Scale</h3>
                    <span className="t-caption">Rating 1 = best … 10 = worst</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                          <th className="text-left py-2 text-xs font-medium text-muted-text uppercase">Dimension</th>
                          <th className="text-right py-2 text-xs font-medium text-muted-text uppercase">Score (×100)</th>
                          <th className="text-right py-2 text-xs font-medium text-muted-text uppercase">%</th>
                          <th className="text-right py-2 text-xs font-medium text-muted-text uppercase">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.ratingScale.map(r => {
                          const [a, b] = r.actual.split('/').map(s => Math.round(parseFloat(s) * 100));
                          return (
                            <tr key={r.dimension} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: r.dimension === 'Combined' ? 'rgba(45,212,191,0.06)' : 'transparent' }}>
                              <td className="py-2.5 text-primary-text text-xs font-medium">{r.dimension}</td>
                              <td className="py-2.5 text-right font-mono-nums text-muted-text text-xs">{a}/{b}</td>
                              <td className="py-2.5 text-right font-mono-nums text-primary-text text-xs">{r.pct}%</td>
                              <td className="py-2.5 text-right font-mono-nums font-semibold text-brand-teal text-xs">{r.ratingNumber}{r.ratingLabel ? ` (${r.ratingLabel})` : ''}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                  {/* Rating-number reference */}
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                    {[
                      { r: '1–2', g: 'Extremely Strong', c: '#34D399' },
                      { r: '3–4', g: 'Strong', c: '#2DD4BF' },
                      { r: '5–7', g: 'Moderate', c: '#FBBF24' },
                      { r: '8–10', g: 'Weak', c: '#FB7185' },
                    ].map(x => (
                      <span key={x.r} className="inline-flex items-center gap-1.5 t-caption">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ background: `${x.c}33`, border: `1px solid ${x.c}` }} />
                        Rating {x.r} · {x.g}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Scorecard — grouped parameters with grade + commentary */}
                <div>
                  <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                    <h3 className="t-h3 text-primary-text">Assessment parameters</h3>
                    <span className="t-caption">Grades as stated in the research scorecard · expand a parameter for its commentary</span>
                  </div>
                  <ScorecardTable report={report} />
                </div>
              </div>
            )}

            {/* ── DATA & SIGNALS ── */}
            {section === 'signals' && (
              <div className="space-y-5">
                <h2 className="t-h2 text-primary-text">Data &amp; Signals</h2>
                <DataSourcesPanel sources={report.dataSources ?? []} />
                <SignalsFeed signals={report.signals ?? []} />
              </div>
            )}

            {/* ── ADJUST WEIGHTAGE ── */}
            {section === 'weightage' && (
              <div className="space-y-5">
                <h2 className="t-h2 text-primary-text">Adjust weightage</h2>
                <WeightageWhatIf report={report} />
              </div>
            )}

            {/* ── BUSINESS & MANAGEMENT ── */}
            {section === 'business' && (
              <div>
                <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
                  <h2 className="text-base font-semibold text-primary-text">Business & Management</h2>
                  <button onClick={() => setReadingMode(v => !v)}
                    className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${readingMode ? 'btn-gradient' : 'btn-outline-glass'}`}>
                    <BookOpen size={13} /> {readingMode ? 'Exit reading mode' : 'Reading mode'}
                  </button>
                </div>

                <div className="space-y-4 mb-6">
                  {report.qualitative.map(m => (
                    <div key={m.factor} className="glass-card p-5"
                      style={activeFactorName === m.factor ? { borderColor: 'rgba(45,212,191,0.3)', boxShadow: '0 0 0 1px rgba(45,212,191,0.15), 0 12px 34px rgba(0,0,0,0.38)' } : {}}>
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="t-h3 text-primary-text">{m.factor}</h3>
                        <GradeBadge grade={m.grade} />
                      </div>
                      <div className="h-1.5 rounded-full mb-4 overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-full" style={{ width: `${m.pct}%`, backgroundColor: gradeBarColor(m.grade) }} />
                      </div>
                      <ExpandableAnalysis commentary={m.commentary} readingMode={readingMode} />
                    </div>
                  ))}
                </div>

                {/* Management & governance card */}
                <div className="glass-card p-5 mb-5">
                  <div className="flex items-center gap-2 mb-4"><Users size={16} style={{ color: '#2DD4BF' }} /><h3 className="font-semibold text-primary-text text-sm">Management & Governance</h3></div>
                  <div className="space-y-3 mb-4">
                    {report.management.leadership.map(l => (
                      <div key={l.name} className="flex gap-3 items-start">
                        <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0" style={{ background: 'rgba(45,212,191,0.15)', color: '#2DD4BF' }}>
                          {l.name.split(' ').map(w => w[0]).slice(0, 2).join('')}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm text-primary-text font-medium">{l.name} <span className="text-muted-text font-normal">· {l.role}</span></p>
                          <p className="text-xs text-muted-text">{l.background}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="grid sm:grid-cols-2 gap-3 text-xs mb-4">
                    <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-muted-text mb-1">Board composition</p>
                      <p className="text-primary-text">{report.management.boardComposition}</p>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
                      <p className="text-muted-text mb-1">Statutory auditor</p>
                      <p className="text-primary-text">{report.management.auditor}{report.management.auditorFlag ? ` · ${report.management.auditorFlag}` : ''}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-2 flex items-center gap-1.5"><AlertTriangle size={12} style={{ color: '#FBBF24' }} /> Risk flags</p>
                    <div className="flex flex-wrap gap-2">
                      {report.management.riskFlags.map(f => (
                        <span key={f} className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(251,191,36,0.12)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.25)' }}>{f}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Geographic concentration */}
                <div className="glass-card p-5">
                  <div className="flex items-center gap-2 mb-4"><MapPin size={16} style={{ color: '#38BDF8' }} /><h3 className="font-semibold text-primary-text text-sm">Geographic Concentration</h3></div>
                  <div className="space-y-2 mb-3">
                    {report.geography.map((g, i) => (
                      <div key={g.region} className="flex items-center gap-3">
                        <span className="text-xs text-muted-text w-32 shrink-0 truncate">{g.region}</span>
                        <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                          <div className="h-full rounded-full" style={{ width: `${g.pct}%`, background: VIZ_COLORS[i % VIZ_COLORS.length] }} />
                        </div>
                        <span className="font-mono-nums text-xs text-primary-text w-10 text-right">{g.pct}%</span>
                      </div>
                    ))}
                  </div>
                  {report.alm.topLenderConcentration && <p className="text-[11px] text-muted-text">Lender concentration: {report.alm.topLenderConcentration}</p>}
                </div>
              </div>
            )}

            {/* ── FINANCIAL ANALYSIS ── */}
            {section === 'financial' && (
              <div>
                <h2 className="t-h2 text-primary-text mb-5">Financial Analysis</h2>
                <div className="inline-flex items-center gap-1 p-1 rounded-full mb-6 flex-wrap" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {Object.keys(report.financials).map(k => {
                    const on = financialTab === k;
                    return (
                      <button key={k} onClick={() => setFinancialTab(k)} aria-pressed={on}
                        className="px-3 py-1 rounded-full text-[13px] font-medium leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                        style={on ? { background: 'linear-gradient(135deg,#2DD4BF,#22D3EE)', color: '#0B1F20' } : { background: 'transparent', color: '#9CB3B1' }}>
                        {k === 'fundingLiquidity' ? 'Funding & Liquidity' : k === 'capitalization' ? 'Capitalization' : k === 'profitability' ? 'Profitability' : 'Asset Quality'}
                      </button>
                    );
                  })}
                </div>
                <FinancialPanel sec={report.financials[financialTab]} sectionKey={financialTab} />

                {/* Funding & liquidity extras */}
                {financialTab === 'fundingLiquidity' && (
                  <div className="grid sm:grid-cols-2 gap-5 mt-5">
                    <div className="glass-card p-5">
                      <h3 className="font-semibold text-primary-text text-sm mb-4 flex items-center gap-2"><Layers size={15} style={{ color: '#2DD4BF' }} /> Funding Mix</h3>
                      <div className="space-y-2">
                        {report.fundingMix.map((f, i) => (
                          <div key={f.name} className="flex items-center gap-3">
                            <span className="text-xs text-muted-text w-28 shrink-0 truncate">{f.name}</span>
                            <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                              <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: VIZ_COLORS[i % VIZ_COLORS.length] }} />
                            </div>
                            <span className="font-mono-nums text-xs text-primary-text w-9 text-right">{f.pct}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="glass-card p-5">
                      <h3 className="font-semibold text-primary-text text-sm mb-4">ALM &amp; Liquidity</h3>
                      <div className="space-y-3 text-xs">
                        <div className="flex justify-between"><span className="text-muted-text">Avg asset tenor</span><span className="font-mono-nums text-primary-text">{report.alm.assetTenorMonths}m</span></div>
                        <div className="flex justify-between"><span className="text-muted-text">Avg liability tenor</span><span className="font-mono-nums text-primary-text">{report.alm.liabilityTenorMonths}m</span></div>
                        <div className="flex justify-between"><span className="text-muted-text">LCR</span><span className="font-mono-nums text-brand-teal font-semibold">{report.alm.lcr}%</span></div>
                        {report.alm.ccePctOf12mRepayments != null && <div className="flex justify-between"><span className="text-muted-text">CCE / 12m repayments</span><span className="font-mono-nums text-primary-text">{report.alm.ccePctOf12mRepayments}%</span></div>}
                        <p className="text-muted-text pt-2 leading-relaxed" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>{report.alm.cumulativeGapNote}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Asset-quality detail */}
                {financialTab === 'assetQuality' && (
                  <div className="mt-5 space-y-5">
                    {report.segmentAssetQuality && (
                      <div className="glass-card p-5">
                        <h3 className="font-semibold text-primary-text text-sm mb-4">Asset Quality by Segment</h3>
                        <table className="w-full text-sm">
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                              <th className="text-left py-2 text-xs font-medium text-muted-text uppercase">Segment</th>
                              <th className="text-right py-2 text-xs font-medium text-muted-text uppercase">GNPA</th>
                              <th className="text-right py-2 text-xs font-medium text-muted-text uppercase">NNPA</th>
                            </tr>
                          </thead>
                          <tbody>
                            {report.segmentAssetQuality.map(s => (
                              <tr key={s.segment} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td className="py-2.5 text-primary-text text-xs">{s.segment}</td>
                                <td className="py-2.5 text-right font-mono-nums text-xs" style={{ color: s.gnpa > 5 ? '#FB7185' : s.gnpa > 1 ? '#FBBF24' : '#34D399' }}>{s.gnpa.toFixed(2)}%</td>
                                <td className="py-2.5 text-right font-mono-nums text-xs text-muted-text">{s.nnpa.toFixed(2)}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                    {report.ltvBuckets && (
                      <div className="glass-card p-5">
                        <h3 className="font-semibold text-primary-text text-sm mb-4">LTV Bucket Distribution</h3>
                        <div className="space-y-2">
                          {report.ltvBuckets.map((b, i) => (
                            <div key={b.bucket} className="flex items-center gap-3">
                              <span className="text-xs text-muted-text w-20 shrink-0 font-mono-nums">{b.bucket}</span>
                              <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                                <div className="h-full rounded-full" style={{ width: `${b.pct}%`, background: VIZ_COLORS[i % VIZ_COLORS.length] }} />
                              </div>
                              <span className="font-mono-nums text-xs text-primary-text w-10 text-right">{b.pct}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {report.collectionEfficiency && (
                      <div className="glass-card p-5">
                        <h3 className="font-semibold text-primary-text text-sm mb-4">Collection Efficiency Trend</h3>
                        <div className="flex items-end gap-4 h-32">
                          {report.collectionEfficiency.map(c => (
                            <div key={c.period} className="flex-1 flex flex-col items-center gap-2">
                              <div className="w-full rounded-t-lg flex items-end justify-center" style={{ height: `${c.value}%`, background: 'linear-gradient(180deg,#2DD4BF,#22D3EE)', minHeight: 8 }}>
                                <span className="font-mono-nums text-[11px] font-bold pb-1" style={{ color: '#0B1F20' }}>{c.value}%</span>
                              </div>
                              <span className="text-[11px] text-muted-text">{c.period}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* ── PEER COMPARISON ── */}
            {section === 'peers' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-2">Peer Comparison</h2>
                <p className="text-sm text-muted-text mb-5">This issue's current NCD ({report.yieldOverview.currentYtm.toFixed(2)}% YTM) vs the {subSectorLabel} peer set.</p>
                <PeerYieldRange peers={report.peers} thisIssuer={firstName} thisYtm={report.yieldOverview.currentYtm} thisRating={company.externalRating.split(' ')[0]} />
              </div>
            )}

            {/* ── EXTERNAL RATINGS ── */}
            {section === 'external' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-2">External Ratings</h2>
                <p className="text-sm text-muted-text mb-5">The agency letter is an input to our assessment — see how it sits inside the Fundamental Score.</p>

                {/* See inside the rating — agency letter → FL score by pillar */}
                {(() => {
                  const scaled = getScaledScore(report);
                  const byKey = (k: string) => scaled.components.find(c => c.key === k)!;
                  const iss = byKey('issuer');
                  const trend = getIssuerTrend(company.id);
                  const delta = trend.length >= 2 ? trend[trend.length - 1].score - trend[0].score : undefined;
                  const lensPillars: RatingLensPillar[] = [
                    { label: 'Issuer fundamentals', pct: iss.pct, weight: 40, grade: iss.grade },
                    { label: 'Pricing & yield', pct: byKey('pricing').pct, weight: 30, grade: byKey('pricing').grade },
                    { label: 'Issuance assessment', pct: byKey('issuance').pct, weight: 20, grade: byKey('issuance').grade },
                    { label: 'Economic & sector', pct: byKey('economic').pct, weight: 10, grade: byKey('economic').grade },
                  ];
                  return (
                    <div className="mb-5">
                      <RatingLens
                        agency={report.externalRating.agency}
                        agencyLetter={report.externalRating.rating.split(' ')[0]}
                        agencyNote="one letter · quarterly · issuer-paid"
                        score={iss.score}
                        max={iss.max}
                        delta={delta}
                        pillars={lensPillars}
                        compact
                      />
                    </div>
                  );
                })()}

                <div className="glass-card p-6 mb-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                    <div>
                      <p className="text-xs text-muted-text uppercase tracking-wider mb-1">{report.externalRating.agency}</p>
                      <div className="flex items-center gap-3">
                        <span className="font-mono-nums text-2xl font-bold text-primary-text">{report.externalRating.rating}</span>
                        <span className="text-xs px-2 py-0.5 rounded font-medium" style={report.externalRating.outlook === 'Stable' ? { background: 'rgba(52,211,153,0.15)', color: '#34D399' } : { background: 'rgba(251,191,36,0.15)', color: '#FBBF24' }}>{report.externalRating.outlook}</span>
                      </div>
                    </div>
                    <span className="text-xs text-muted-text px-3 py-1.5 rounded" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>{report.externalRating.date}</span>
                  </div>
                  <div className="rounded-lg p-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-2">Rating Rationale</p>
                    <p className="text-sm text-primary-text font-serif leading-relaxed">{report.externalRating.rationale}</p>
                  </div>
                </div>
                <div className="glass-card p-5">
                  <h3 className="font-semibold text-primary-text text-sm mb-3">Rating History</h3>
                  <div className="space-y-2">
                    {report.ratingHistory.map(h => (
                      <div key={h.date} className="flex gap-3 text-xs">
                        <span className="font-mono-nums text-brand-teal shrink-0 w-20">{h.date}</span>
                        <span className="text-muted-text">{h.note}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── DEVELOPMENTS ── */}
            {section === 'developments' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-5">Recent Material Developments</h2>
                <div className="space-y-4">
                  {report.materialDevelopments.map(d => (
                    <div key={d.title} className="glass-card p-5">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className="text-xs font-mono-nums font-medium px-2.5 py-1 rounded" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9CB3B1' }}>{d.date}</span>
                        <h3 className="font-semibold text-primary-text text-sm">{d.title}</h3>
                      </div>
                      <p className="text-sm text-muted-text leading-relaxed font-serif">{d.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── NCD ISSUANCES ── */}
            {section === 'ncd' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-5">NCD Issuances</h2>
                <div className="glass-card overflow-hidden mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
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
                        {report.ncdIssuances.map(n => (
                          <tr key={n.isin} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: n.current ? 'rgba(45,212,191,0.06)' : 'transparent' }}
                            onMouseEnter={e => { if (!n.current) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                            onMouseLeave={e => { if (!n.current) e.currentTarget.style.background = 'transparent'; }}>
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-2">
                                <span className="font-mono-nums text-xs text-brand-teal">{n.isin}</span>
                                {n.current && <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase" style={{ background: 'linear-gradient(135deg,#2DD4BF,#22D3EE)', color: '#0B1F20' }}>Current</span>}
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
                </div>

                {/* Issuance structure cards */}
                <h3 className="font-semibold text-primary-text text-sm mb-3">Issuance Structure</h3>
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  {report.issuanceStructures.map(s => (
                    <div key={s.isin} className="glass-card p-5" style={s.current ? { borderColor: 'rgba(45,212,191,0.25)' } : {}}>
                      <div className="flex items-center gap-2 mb-3 flex-wrap">
                        <span className="font-mono-nums text-sm text-brand-teal">{s.isin}</span>
                        {s.current && <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase" style={{ background: 'linear-gradient(135deg,#2DD4BF,#22D3EE)', color: '#0B1F20' }}>Current</span>}
                      </div>
                      <div className="space-y-1.5 text-xs">
                        {[
                          ['Instrument', s.instrument],
                          ['Ranking', s.ranking],
                          ['Coupon', `${s.coupon.toFixed(2)}% · ${s.couponFrequency}`],
                          ['YTM (orig → curr)', `${s.originalYtm.toFixed(2)}% → ${s.currentYtm.toFixed(2)}%`],
                          ['Face value', s.faceValueLabel],
                          ['Issue size', `₹${s.issueSize.toLocaleString()} Cr`],
                          ['Allotment', s.allotmentDate],
                          ['Maturity', s.maturity],
                          ['Residual tenor', `${s.residualDays} days`],
                          ['Security cover', s.securityCover],
                          ['Step clause', s.stepClause],
                          ['Mandatory redemption', s.redemptionTrigger],
                        ].map(([k, v]) => (
                          <div key={k} className="flex gap-3 justify-between">
                            <span className="text-muted-text shrink-0">{k}</span>
                            <span className="text-primary-text text-right">{v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Covenants */}
                <h3 className="font-semibold text-primary-text text-sm mb-3">Financial Covenants</h3>
                <CovenantTable covenants={report.covenants} />

                <div className="p-4 rounded-xl text-xs text-muted-text leading-relaxed mt-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  YTM figures are indicative as of the research date. Actual secondary-market YTM may vary. This is not an offer to buy or sell securities.
                </div>
              </div>
            )}

            {/* ── SECTOR OUTLOOK ── */}
            {section === 'sector' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-5">Sector Outlook</h2>
                <div className="space-y-5">
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-3"><h3 className="font-semibold text-primary-text">NBFC Sector — Operating Outlook</h3><GradeBadge grade="Moderate" /></div>
                    <p className="text-sm text-primary-text font-serif leading-relaxed">{report.sectorOutlook.operating}</p>
                  </div>
                  <div className="glass-card p-6">
                    <div className="flex items-center gap-2 mb-3"><h3 className="font-semibold text-primary-text">{subSectorLabel} Sub-sector</h3><GradeBadge grade="Moderate" /></div>
                    <p className="text-sm text-primary-text font-serif leading-relaxed">{report.sectorOutlook.subSector}</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── SUMMARY TABLE ── */}
            {section === 'summary' && (
              <div>
                <h2 className="text-base font-semibold text-primary-text mb-5">Summary Table</h2>
                <div className="glass-card overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody>
                      {[
                        { label: 'Company', value: company.name },
                        { label: 'Sector / Sub-sector', value: `${company.sector} · ${company.subSector}` },
                        { label: 'Established', value: company.established },
                        { label: 'Headquarters', value: company.hq },
                        { label: 'External Rating', value: `${company.externalRating} (${company.ratingAgency}, ${company.ratingDate})` },
                        { label: 'Our Recommendation', value: company.recommendation },
                        { label: 'Fundamental Score', value: `${company.healthScore * 5}/500 · ${company.healthScore}% · Rating ${company.internalRating}` },
                        { label: 'Internal Rating', value: `${company.internalRating}/15` },
                        { label: 'Combined Score', value: company.combinedScore },
                        { label: 'GNPA (latest)', value: latest(report.financials.assetQuality, 'GNPA') },
                        { label: 'NNPA (latest)', value: latest(report.financials.assetQuality, 'NNPA') },
                        { label: 'Total CAR (latest)', value: latest(report.financials.capitalization, 'Total CAR') },
                        { label: 'Leverage (latest)', value: latest(report.financials.capitalization, 'Leverage') },
                        { label: 'On-book AUM (latest)', value: `₹${latest(report.financials.assetQuality, 'On-book AUM')} Cr` },
                        { label: 'Current NCD YTM', value: `${report.yieldOverview.currentYtm.toFixed(2)}%` },
                      ].map((row, i) => (
                        <tr key={row.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                          <td className="px-5 py-3 text-xs font-medium text-muted-text w-52">{row.label}</td>
                          <td className="px-5 py-3 text-sm font-medium text-primary-text">{row.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* ── ASK AI ── */}
            {section === 'ai' && (
              <div>
                <div className="flex items-center gap-2 mb-5">
                  <h2 className="text-base font-semibold text-primary-text">Ask AI</h2>
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold uppercase tracking-wide" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}>Beta</span>
                </div>
                <p className="text-sm text-muted-text mb-5">Ask questions about {firstName}'s financials, business model, ratings, or risk factors. Grounded in our research data.</p>
                <div className="flex flex-wrap gap-2 mb-5">
                  {report.aiQAPairs.map(qa => (
                    <button key={qa.q} onClick={() => { setAiQuery(qa.q); handleAiQuery(qa.q); }}
                      className="text-xs px-3 py-2 rounded-full text-muted-text transition-colors"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(45,212,191,0.3)'; e.currentTarget.style.color = '#2DD4BF'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = '#9CB3B1'; }}>
                      {qa.q}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 mb-5">
                  <input type="text" value={aiQuery} onChange={e => setAiQuery(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && aiQuery.trim() && handleAiQuery(aiQuery)}
                    placeholder={`Ask a question about ${firstName}…`}
                    className="flex-1 px-4 py-3 rounded-lg text-sm focus:outline-none text-primary-text"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                  <button onClick={() => aiQuery.trim() && handleAiQuery(aiQuery)} className="px-4 py-3 rounded-lg btn-gradient"><Send size={16} /></button>
                </div>
                {aiLoading && (
                  <div className="glass-card p-5 flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#2DD4BF' }} />
                    <p className="text-sm text-muted-text">Thinking…</p>
                  </div>
                )}
                {aiAnswer && !aiLoading && (
                  <div className="glass-card p-5 page-fade" style={{ borderColor: 'rgba(45,212,191,0.2)' }}>
                    <div className="flex items-center gap-2 mb-3"><MessageSquare size={15} style={{ color: '#2DD4BF' }} /><p className="text-xs font-semibold text-brand-teal uppercase tracking-wide">Answer</p></div>
                    <p className="text-sm text-primary-text font-serif leading-relaxed">{aiAnswer}</p>
                    <p className="text-[11px] text-muted-text mt-4 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>This response is based on the research report data. Not personalised investment advice.</p>
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
