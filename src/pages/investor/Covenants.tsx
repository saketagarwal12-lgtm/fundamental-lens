import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ShieldAlert, Gavel } from 'lucide-react';
import { PageNav } from '../../components/PageNav';
import { GradeBadge } from '../../components/GradeBadge';
import { Sparkline } from '../../components/Sparkline';
import { CovenantStatusChip } from '../../components/CovenantStatusChip';
import { BufferBar } from '../../components/BufferBar';
import { IllustrativeBadge } from '../../components/IllustrativeBadge';
import { covenantRowsWorstFirst, covenantAlerts, rowTrend } from '../../data/covenantMonitor';
import type { MonitorScope } from '../../data/covenantMonitor';
import { latestActual } from '../../data/covenants';

// Portfolio-wide covenant tracker — every covenant across the ISINs you hold,
// worst headroom first, so the thing closest to biting is the thing you see.

const fmt = (v: number, unit: string) => (unit === '₹ cr' ? `₹${v.toLocaleString()} cr` : `${v}${unit}`);
const OP = { gte: '≥', lte: '≤', eq: '=' } as const;

export const Covenants: React.FC = () => {
  const navigate = useNavigate();
  const [scope, setScope] = useState<MonitorScope>('holdings');

  const rows = useMemo(() => covenantRowsWorstFirst(scope), [scope]);
  const alerts = useMemo(() => covenantAlerts(scope), [scope]);
  const measured = rows.filter(r => !r.flagOnly);

  const counts = {
    breach: measured.filter(r => r.status === 'Breach').length,
    tight: measured.filter(r => r.status === 'Tight').length,
    moderate: measured.filter(r => r.status === 'Moderate').length,
    comfortable: measured.filter(r => r.status === 'Comfortable').length,
  };

  return (
    <div className="p-6 page-fade max-w-7xl mx-auto">
      <PageNav
        up={{ label: 'Dashboard', to: '/app/dashboard' }}
        crumbs={[{ label: 'Dashboard', to: '/app/dashboard' }, { label: 'Covenant monitor' }]}
      />

      <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
        <div>
          <h1 className="t-h1 text-primary-text flex items-center gap-2"><Gavel size={20} className="text-brand-teal" /> Covenant monitor</h1>
          <p className="text-sm text-muted-text mt-1 max-w-3xl">
            Every covenant across the instruments you hold, sorted by how close it is to breach. Buffers are
            computed live from reported actuals; the quality grade is our authored view of how protective the
            threshold is. The two frequently disagree.
          </p>
        </div>

        <div className="pill-track flex shrink-0" role="tablist" aria-label="Monitor scope">
          {(['holdings', 'all'] as MonitorScope[]).map(s => (
            <button
              key={s}
              role="tab"
              aria-selected={scope === s}
              onClick={() => setScope(s)}
              className={`px-3 py-1.5 text-xs transition-colors ${scope === s ? 'pill-active' : 'pill-inactive'}`}
            >
              {s === 'holdings' ? 'My holdings' : 'All coverage'}
            </button>
          ))}
        </div>
      </div>

      {/* Status summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {([
          ['Breach', counts.breach, '#E11D48'],
          ['Tight', counts.tight, '#FB7185'],
          ['Moderate', counts.moderate, '#FBBF24'],
          ['Comfortable', counts.comfortable, '#2DD4BF'],
        ] as const).map(([label, n, colour]) => (
          <div key={label} className="glass-card p-4">
            <p className="text-xs text-muted-text mb-1">{label}</p>
            <p className="font-mono-nums text-2xl font-bold" style={{ color: n > 0 ? colour : '#6F8584' }}>{n}</p>
          </div>
        ))}
      </div>

      {/* Derived alerts */}
      {alerts.length > 0 && (
        <div className="glass-card-elevated p-5 mb-6" style={{ borderColor: 'rgba(251,113,133,0.3)' }}>
          <h2 className="text-sm font-semibold text-primary-text mb-3 flex items-center gap-2">
            <ShieldAlert size={15} style={{ color: '#FB7185' }} /> Covenant alerts
            <span className="text-[10px] font-normal text-muted-text">· raised automatically on breach or tightening</span>
          </h2>
          <div className="space-y-2">
            {alerts.map(a => {
              const colour = a.severity === 'breach' ? '#E11D48' : '#FB7185';
              return (
                <button
                  key={a.id}
                  onClick={() => navigate(`/app/isin/${a.isin}`)}
                  className="w-full text-left rounded-lg p-3 flex items-start gap-3 transition-colors"
                  style={{ background: `${colour}11`, border: `1px solid ${colour}44` }}
                >
                  <ShieldAlert size={14} className="shrink-0 mt-0.5" style={{ color: colour }} />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-primary-text flex items-center gap-2 flex-wrap">
                      {a.title}
                      {a.illustrative && <IllustrativeBadge compact />}
                    </p>
                    <p className="text-[11px] text-muted-text mt-0.5">{a.body}</p>
                  </div>
                  <ArrowRight size={13} className="text-muted-text shrink-0 mt-0.5" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Worst-first table */}
      <div className="glass-card p-5">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="pb-2 pr-3 t-eyebrow font-medium">Issuer / ISIN</th>
                <th className="pb-2 pr-3 t-eyebrow font-medium">Covenant</th>
                <th className="pb-2 pr-3 t-eyebrow font-medium">Tightest condition</th>
                <th className="pb-2 pr-3 t-eyebrow font-medium text-right">Threshold</th>
                <th className="pb-2 pr-3 t-eyebrow font-medium text-right">Latest</th>
                <th className="pb-2 pr-3 t-eyebrow font-medium">Buffer</th>
                <th className="pb-2 pr-3 t-eyebrow font-medium">Status</th>
                <th className="pb-2 pr-3 t-eyebrow font-medium">Headroom</th>
                <th className="pb-2 t-eyebrow font-medium">Quality</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(r => {
                const c = r.worstCondition;
                const la = c ? latestActual(c) : undefined;
                const trend = rowTrend(r);
                return (
                  <tr
                    key={r.key}
                    onClick={() => navigate(`/app/isin/${r.isin}`)}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(45,212,191,0.05)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="py-3 pr-3 align-top">
                      <p className="text-xs text-primary-text font-medium">{r.issuerName}</p>
                      <p className="text-[10px] font-mono-nums text-muted-text flex items-center gap-1.5">
                        {r.isin}{r.illustrative && <IllustrativeBadge compact />}
                      </p>
                    </td>
                    <td className="py-3 pr-3 align-top text-xs text-primary-text">{r.covenant.name}</td>
                    <td className="py-3 pr-3 align-top text-xs text-muted-text">
                      {c ? c.metric : <span className="italic">{r.covenant.category} — compliance flag</span>}
                    </td>
                    <td className="py-3 pr-3 align-top text-right text-xs font-mono-nums text-primary-text whitespace-nowrap">
                      {c && r.buffer?.threshold != null ? `${OP[c.op]} ${fmt(r.buffer.threshold, c.unit)}` : '—'}
                    </td>
                    <td className="py-3 pr-3 align-top text-right text-xs font-mono-nums text-primary-text whitespace-nowrap">
                      {c && la ? fmt(la.value, c.unit) : '—'}
                    </td>
                    <td className="py-3 pr-3 align-top" style={{ minWidth: 100 }}>
                      {r.buffer && c ? (
                        <>
                          <p className="text-xs font-mono-nums whitespace-nowrap" style={{ color: r.buffer.breached ? '#E11D48' : '#E9F3F1' }}>
                            {r.buffer.buffer != null ? `${r.buffer.buffer > 0 ? '+' : ''}${fmt(r.buffer.buffer, c.unit)}` : '—'}
                            {r.buffer.bufferPct != null && <span className="text-muted-text"> · {r.buffer.bufferPct}%</span>}
                          </p>
                          <div className="mt-1.5"><BufferBar bufferPct={r.buffer.bufferPct} status={r.status!} breached={r.buffer.breached} /></div>
                        </>
                      ) : <span className="text-xs text-muted-text">—</span>}
                    </td>
                    <td className="py-3 pr-3 align-top">
                      {r.status ? <CovenantStatusChip status={r.status} compact /> : <span className="text-[10px] text-muted-text">—</span>}
                    </td>
                    <td className="py-3 pr-3 align-top">
                      {trend.length > 1 ? <Sparkline data={trend} width={64} height={26} /> : <span className="text-[10px] text-muted-text">—</span>}
                    </td>
                    <td className="py-3 align-top"><GradeBadge grade={r.covenant.qualityGrade} compact /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {rows.length === 0 && (
          <p className="text-sm text-muted-text py-6 text-center">
            None of your holdings has an ISIN with authored covenants yet. Switch to “All coverage” to see the full monitor.
          </p>
        )}
      </div>
    </div>
  );
};
