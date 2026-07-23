import { useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Layers, GitCompare } from 'lucide-react';
import { PageNav, fromState } from '../../components/PageNav';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, Tooltip } from 'recharts';
import { GradeBadge, gradeColor } from '../../components/GradeBadge';
import { MetricCard } from '../../components/MetricCard';
import { SignalsFeed } from '../../components/SignalsFeed';
import {
  SECTORS, sectorAggregate, sectorSignals, sectorOutlookProse, RATIOS,
} from '../../data/sectors';
import type { SectorId } from '../../data/sectors';
import type { Grade } from '../../data/types';

const GRADE_SHORT: Record<Grade, string> = {
  'Extremely Strong': 'Ext. Strong', 'Strong': 'Strong', 'Moderate': 'Moderate', 'Weak': 'Weak', 'Extremely Weak': 'Ext. Weak',
};

const AGG_RATIOS = ['gnpa', 'cof', 'roaa', 'crar'];

export const SectorDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const valid = SECTORS.some(s => s.id === id);
  const agg = useMemo(() => (valid ? sectorAggregate(id as SectorId) : null), [id, valid]);
  const outlook = useMemo(() => (valid ? sectorOutlookProse(id as SectorId) : null), [id, valid]);
  const signals = useMemo(() => (valid ? sectorSignals(id as SectorId) : []), [id, valid]);
  const [compareWith, setCompareWith] = useState<SectorId | null>(null);

  if (!agg) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <p className="text-muted-text">Sector not found.</p>
        <button onClick={() => navigate('/app/sectors')} className="text-brand-teal hover:underline text-sm">Back to Sectors</button>
      </div>
    );
  }

  const maxScore = 200;
  const distData = agg.gradeBands.map(b => ({ grade: GRADE_SHORT[b.grade], count: b.count, fill: gradeColor(b.grade) }));
  const other = compareWith ? sectorAggregate(compareWith) : null;

  return (
    <div className="p-6 page-fade">
      <PageNav
        up={{ label: 'Sectors', to: '/app/sectors' }}
        crumbs={[{ label: 'Sectors', to: '/app/sectors' }, { label: agg.name }]}
      />

      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Layers size={18} style={{ color: '#2DD4BF' }} />
            <h1 className="t-h1 text-primary-text">{agg.name}</h1>
          </div>
          <p className="t-caption mt-1">{agg.count} covered issuer{agg.count > 1 ? 's' : ''}</p>
        </div>
        <div className="text-right">
          <div className="flex items-baseline gap-2 justify-end">
            <span className="t-metric text-3xl" style={{ color: '#2DD4BF' }}>{agg.avgFundamental}</span>
            <span className="font-mono-nums text-muted-text">/ 200</span>
          </div>
          <p className="t-caption">Average Fundamental Score · {agg.avgFundamentalPct}%</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-5 mb-5">
        {/* Issuer leaderboard */}
        <div className="glass-card p-5">
          <h3 className="t-h3 text-primary-text mb-4">Issuer leaderboard <span className="t-caption font-normal">· by Fundamental Score /200</span></h3>
          <div className="space-y-2.5">
            {agg.members.map((m, i) => (
              // Pass the referrer so the issuer page's up-control returns here (§2c).
              <button key={m.id} onClick={() => navigate(`/app/company/${m.id}`, { state: fromState(agg.name, `/app/sector/${agg.id}`) })}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(45,212,191,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              >
                <span className="font-mono-nums text-sm w-5 shrink-0" style={{ color: '#6F8584' }}>{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="t-body text-primary-text truncate">{m.shortName}</p>
                  <div className="h-1.5 rounded-full overflow-hidden mt-1" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full" style={{ width: `${(m.fundamental.score / maxScore) * 100}%`, background: gradeColor(m.fundamental.grade), boxShadow: `0 0 8px ${gradeColor(m.fundamental.grade)}66` }} />
                  </div>
                </div>
                <span className="font-mono-nums text-sm font-semibold text-primary-text shrink-0 w-16 text-right">{m.fundamental.score}/200</span>
                <div className="shrink-0"><GradeBadge grade={m.fundamental.grade} compact /></div>
              </button>
            ))}
          </div>
        </div>

        {/* Grade-band distribution */}
        <div className="glass-card p-5">
          <h3 className="t-h3 text-primary-text mb-4">Grade-band distribution</h3>
          <div style={{ width: '100%', height: 240 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={distData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <XAxis dataKey="grade" tick={{ fill: '#9CB3B1', fontSize: 11 }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} tickLine={false} interval={0} />
                <YAxis allowDecimals={false} tick={{ fill: '#9CB3B1', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'rgba(45,212,191,0.08)' }} contentStyle={{ background: 'rgba(18,42,44,0.95)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12, color: '#E9F3F1' }} formatter={(v: number) => [`${v} issuer${v === 1 ? '' : 's'}`, 'Count']} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {distData.map((d, i) => <Cell key={i} fill={d.fill} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sector aggregates */}
      <div className="mb-5">
        <h3 className="t-h3 text-primary-text mb-3">Sector aggregates <span className="t-caption font-normal">· averaged across covered issuers</span></h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {AGG_RATIOS.map(k => {
            const def = RATIOS.find(r => r.key === k)!;
            const v = agg.ratios[k];
            return <MetricCard key={k} label={`Avg ${def.label}`} value={v === null ? '—' : v} unit={v === null ? undefined : def.unit} />;
          })}
        </div>
      </div>

      {/* Cross-sector compare */}
      <div className="glass-card p-5 mb-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <GitCompare size={16} style={{ color: '#2DD4BF' }} />
          <h3 className="t-h3 text-primary-text">Cross-sector compare</h3>
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            {SECTORS.filter(s => s.id !== agg.id && sectorAggregate(s.id).count > 0).map(s => {
              const on = compareWith === s.id;
              return (
                <button key={s.id} onClick={() => setCompareWith(on ? null : s.id)}
                  className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                  aria-pressed={on}
                  style={on ? { background: 'rgba(45,212,191,0.15)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.35)' } : { background: 'rgba(255,255,255,0.05)', color: '#9CB3B1', border: '1px solid rgba(255,255,255,0.1)' }}>
                  {s.name}
                </button>
              );
            })}
          </div>
        </div>
        {other ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left" style={{ minWidth: 480, borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th className="t-eyebrow px-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Metric</th>
                  <th className="t-eyebrow px-3 py-2 text-right" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', color: '#2DD4BF' }}>{agg.name}</th>
                  <th className="t-eyebrow px-3 py-2 text-right" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>{other.name}</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-3 py-2.5 t-body text-muted-text" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Avg Fundamental Score</td>
                  <td className="px-3 py-2.5 text-right font-mono-nums text-sm text-primary-text" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{agg.avgFundamental}/200</td>
                  <td className="px-3 py-2.5 text-right font-mono-nums text-sm text-primary-text" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{other.avgFundamental}/200</td>
                </tr>
                {RATIOS.map(r => (
                  <tr key={r.key}>
                    <td className="px-3 py-2.5 t-body text-muted-text" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>Avg {r.label} <span className="t-caption">{r.unit}</span></td>
                    <td className="px-3 py-2.5 text-right font-mono-nums text-sm text-primary-text" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{agg.ratios[r.key] ?? '—'}</td>
                    <td className="px-3 py-2.5 text-right font-mono-nums text-sm text-primary-text" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{other.ratios[r.key] ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="t-caption">Pick another sector to place its aggregates side by side.</p>
        )}
      </div>

      {/* Outlook + signals */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="glass-card p-5">
          <h3 className="t-h3 text-primary-text mb-3">Sector outlook</h3>
          {outlook?.subSector && <p className="t-body text-primary-text/90 font-serif leading-relaxed mb-3">{outlook.subSector}</p>}
          {outlook?.operating && (
            <>
              <p className="t-eyebrow mb-1.5">Operating environment</p>
              <p className="t-body text-muted-text font-serif leading-relaxed">{outlook.operating}</p>
            </>
          )}
        </div>
        <SignalsFeed signals={signals} />
      </div>
    </div>
  );
};
