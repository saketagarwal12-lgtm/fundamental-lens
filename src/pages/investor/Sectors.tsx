import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layers, ChevronRight } from 'lucide-react';
import { gradeColor } from '../../components/GradeBadge';
import { allSectorAggregates } from '../../data/sectors';

// Segmented grade-band distribution bar.
const BandBar: React.FC<{ bands: { grade: string; count: number }[]; total: number }> = ({ bands, total }) => (
  <div className="flex h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }} role="img" aria-label="Grade-band distribution">
    {bands.filter(b => b.count > 0).map(b => (
      <div key={b.grade} title={`${b.grade}: ${b.count}`} style={{ width: `${(b.count / total) * 100}%`, background: gradeColor(b.grade as never), boxShadow: `0 0 8px ${gradeColor(b.grade as never)}66` }} />
    ))}
  </div>
);

export const Sectors: React.FC = () => {
  const navigate = useNavigate();
  const aggregates = useMemo(() => allSectorAggregates(), []);

  return (
    <div className="p-6 page-fade">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Layers size={18} style={{ color: '#2DD4BF' }} />
          <h1 className="t-h1 text-primary-text">Sectors</h1>
        </div>
        <p className="t-lead mt-1">A sector index derived from covered issuers — the Economic &amp; Sector pillar, made visible. Averages are computed live from the issuer data.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {aggregates.map(a => (
          <button
            key={a.id}
            onClick={() => navigate(`/app/sector/${a.id}`)}
            className="glass-card glass-card-hover p-6 text-left flex flex-col focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="t-h2 text-primary-text">{a.name}</h2>
                <p className="t-caption mt-0.5">{a.count} covered issuer{a.count > 1 ? 's' : ''}</p>
              </div>
              <ChevronRight size={18} className="text-muted-text mt-1" />
            </div>

            <div className="flex items-baseline gap-2 mb-1">
              <span className="t-metric text-3xl" style={{ color: '#2DD4BF' }}>{a.avgFundamental}</span>
              <span className="font-mono-nums text-muted-text">/ 200</span>
              <span className="t-caption ml-1">· {a.avgFundamentalPct}%</span>
            </div>
            <p className="t-caption mb-3">Average Fundamental Score</p>

            <BandBar bands={a.gradeBands} total={a.count} />
            <p className="t-body text-muted-text mt-4 flex-1">{a.outlook}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
