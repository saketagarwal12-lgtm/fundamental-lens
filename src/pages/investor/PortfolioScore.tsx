import { useNavigate } from 'react-router-dom';
import { ScoreRing } from '../../components/ScoreRing';
import { portfolioHoldings } from '../../data/portfolio';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar,
} from 'recharts';

const gradeDistribution = [
  { grade: 'Extremely Strong', count: 1, color: '#1B6E4B' },
  { grade: 'Strong', count: 8, color: '#2F8A5F' },
  { grade: 'Moderate', count: 12, color: '#C08A2E' },
  { grade: 'Weak', count: 4, color: '#B5524A' },
];

const radarData = [
  { subject: 'Business', saral: 80, krazybee: 59, northpoint: 72 },
  { subject: 'Financial', saral: 88, krazybee: 70, northpoint: 74 },
  { subject: 'Issuance', saral: 82, krazybee: 70, northpoint: 76 },
  { subject: 'Pricing', saral: 75, krazybee: 63, northpoint: 68 },
  { subject: 'Sector', saral: 62, krazybee: 56, northpoint: 60 },
];

export const PortfolioScore: React.FC = () => {
  const navigate = useNavigate();
  const avgScore = Math.round(portfolioHoldings.reduce((a, b) => a + b.healthScore, 0) / portfolioHoldings.length);

  const barData = portfolioHoldings.map(h => ({
    name: h.companyName.split(' ')[0],
    score: h.healthScore,
    fill: h.healthScore >= 70 ? '#2F8A5F' : h.healthScore >= 55 ? '#C08A2E' : '#B5524A',
  }));

  return (
    <div className="p-6 page-fade max-w-7xl mx-auto">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-ink">Portfolio Score</h1>
        <p className="text-sm text-muted mt-0.5">Aggregate health and factor-level breakdown across your holdings</p>
      </div>

      {/* Top row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Avg ring */}
        <div className="bg-white rounded-xl border border-hairline p-6 flex flex-col items-center justify-center">
          <p className="text-xs text-muted uppercase tracking-wider mb-4">Portfolio Average</p>
          <ScoreRing score={avgScore} size={120} strokeWidth={10} />
          <p className="text-sm text-muted mt-4 text-center">Based on {portfolioHoldings.length} holdings.<br />Weighted equally.</p>
        </div>

        {/* Score bar chart */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-hairline p-6">
          <h3 className="font-semibold text-[#23262C] mb-5">Health Scores by Issuer</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E5E0" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6A6E76' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6A6E76' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #E4E5E0', fontSize: 12 }}
                formatter={(v: number) => [`${v}/100`, 'Health Score']}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <rect key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar + Grade distribution */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-hairline p-6">
          <h3 className="font-semibold text-[#23262C] mb-5">Pillar Comparison (Top 3)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#E4E5E0" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#6A6E76' }} />
              <Radar name="Saral" dataKey="saral" stroke="#2F8A5F" fill="#2F8A5F" fillOpacity={0.15} />
              <Radar name="Northpoint" dataKey="northpoint" stroke="#0F6E64" fill="#0F6E64" fillOpacity={0.1} />
              <Radar name="KrazyBee" dataKey="krazybee" stroke="#C08A2E" fill="#C08A2E" fillOpacity={0.1} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #E4E5E0', fontSize: 12 }} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {[{ label: 'Saral', color: '#2F8A5F' }, { label: 'Northpoint', color: '#0F6E64' }, { label: 'KrazyBee', color: '#C08A2E' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted">
                <span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-hairline p-6">
          <h3 className="font-semibold text-[#23262C] mb-5">Factor Grade Distribution</h3>
          <p className="text-xs text-muted mb-4">Across all 25 factors for your held issuers</p>
          <div className="space-y-4">
            {gradeDistribution.map(g => (
              <div key={g.grade}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted">{g.grade}</span>
                  <span className="font-mono-nums font-medium" style={{ color: g.color }}>{g.count}</span>
                </div>
                <div className="h-2 bg-hairline rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${(g.count / 25) * 100}%`, backgroundColor: g.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Holding detail cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {portfolioHoldings.map(h => (
          <button
            key={h.companyId}
            onClick={() => navigate(`/app/company/${h.companyId}`)}
            className="bg-white rounded-xl border border-hairline p-4 text-left hover:border-brand/30 hover:shadow-sm transition-all"
          >
            <div className="flex items-start justify-between mb-3">
              <ScoreRing score={h.healthScore} size={52} strokeWidth={5} showLabel={false} />
              <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                h.recommendation === 'Subscribe' ? 'bg-[#2F8A5F]/10 text-[#2F8A5F]' :
                h.recommendation === 'Avoid' ? 'bg-[#B5524A]/10 text-[#B5524A]' :
                'bg-[#C08A2E]/10 text-[#C08A2E]'
              }`}>
                {h.recommendation}
              </span>
            </div>
            <p className="font-medium text-[#23262C] text-sm leading-tight">{h.companyName}</p>
            <p className="text-xs text-muted mt-0.5">{h.sector}</p>
            <div className="mt-3 pt-3 border-t border-hairline flex justify-between text-xs">
              <span className="text-muted">GNPA</span>
              <span className={`font-mono-nums font-medium ${h.gnpa > 3 ? 'text-[#B5524A]' : 'text-[#2F8A5F]'}`}>{h.gnpa}%</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
