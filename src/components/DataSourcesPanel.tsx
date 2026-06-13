import { Database, Clock } from 'lucide-react';
import type { DataSource } from '../data/reports';

export const DataSourcesPanel: React.FC<{ sources: DataSource[] }> = ({ sources }) => (
  <div className="glass-card p-5">
    <div className="flex items-center gap-2 mb-4">
      <Database size={16} style={{ color: '#2DD4BF' }} />
      <h3 className="t-h3 text-primary-text">Data sources &amp; freshness</h3>
    </div>
    <div className="space-y-2">
      {sources.map(s => (
        <div key={s.label} className="flex items-center gap-3 py-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <span className="t-body text-primary-text flex-1 min-w-0">{s.label}</span>
          <span className="t-caption hidden sm:flex items-center gap-1 shrink-0"><Clock size={11} /> {s.cadence} · {s.lastUpdated}</span>
          <span
            className="text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0"
            style={s.status === 'Connected'
              ? { background: 'rgba(52,211,153,0.15)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)' }
              : { background: 'rgba(56,189,248,0.12)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.25)' }}
          >
            {s.status}
          </span>
        </div>
      ))}
    </div>
    <p className="t-caption mt-3">Illustrative connectors — live feeds wired at go-live.</p>
  </div>
);
