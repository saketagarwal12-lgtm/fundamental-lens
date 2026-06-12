import { useNavigate } from 'react-router-dom';
import { ScoreRing } from '../../components/ScoreRing';
import { ScoreGauge } from '../../components/ScoreGauge';
import { portfolioHoldings } from '../../data/portfolio';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, Radar, Cell,
} from 'recharts';

const gradeDistribution = [
  { grade: 'Extremely Strong', count: 1, color: '#34D399' },
  { grade: 'Strong', count: 8, color: '#2DD4BF' },
  { grade: 'Moderate', count: 12, color: '#FBBF24' },
  { grade: 'Weak', count: 4, color: '#FB7185' },
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
    score: h.healthScore * 5,
    fill: h.healthScore >= 70 ? '#34D399' : h.healthScore >= 55 ? '#FBBF24' : '#FB7185',
  }));

  return (
    <div className="p-6 page-fade max-w-7xl mx-auto">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-primary-text">Portfolio Fundamental Score</h1>
        <p className="text-sm text-muted-text mt-0.5">Aggregate Fundamental Score and factor-level breakdown across your holdings</p>
      </div>

      {/* Top row */}
      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* Avg ring */}
        <div className="glass-card p-6 flex flex-col items-center justify-center">
          <p className="text-xs text-muted-text uppercase tracking-wider mb-4">Portfolio Average</p>
          <ScoreGauge score={avgScore * 5} pct={avgScore} caption="Portfolio Fundamental Score" />
          <p className="text-sm text-muted-text mt-4 text-center">Based on {portfolioHoldings.length} holdings.<br />Weighted equally.</p>
        </div>

        {/* Score bar chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <h3 className="font-semibold text-primary-text mb-5">Fundamental Scores by Issuer</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={barData} barSize={36}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#9CB3B1' }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 500]} tick={{ fontSize: 11, fill: '#9CB3B1' }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, background: 'rgba(18,42,44,0.95)', color: '#E9F3F1' }}
                formatter={(v: number) => [`${v}/500`, 'Fundamental Score']}
              />
              <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                {barData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Radar + Grade distribution */}
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-6">
          <h3 className="font-semibold text-primary-text mb-5">Pillar Comparison (Top 3)</h3>
          <ResponsiveContainer width="100%" height={240}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#9CB3B1' }} />
              <Radar name="Saral" dataKey="saral" stroke="#34D399" fill="#34D399" fillOpacity={0.15} />
              <Radar name="Northpoint" dataKey="northpoint" stroke="#2DD4BF" fill="#2DD4BF" fillOpacity={0.1} />
              <Radar name="KrazyBee" dataKey="krazybee" stroke="#FBBF24" fill="#FBBF24" fillOpacity={0.1} />
              <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)', fontSize: 12, background: 'rgba(18,42,44,0.95)', color: '#E9F3F1' }} />
            </RadarChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {[{ label: 'Saral', color: '#34D399' }, { label: 'Northpoint', color: '#2DD4BF' }, { label: 'KrazyBee', color: '#FBBF24' }].map(l => (
              <div key={l.label} className="flex items-center gap-1.5 text-xs text-muted-text">
                <span className="w-3 h-0.5 inline-block rounded" style={{ backgroundColor: l.color }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="font-semibold text-primary-text mb-5">Factor Grade Distribution</h3>
          <p className="text-xs text-muted-text mb-4">Across all 25 factors for your held issuers</p>
          <div className="space-y-4">
            {gradeDistribution.map(g => (
              <div key={g.grade}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-muted-text">{g.grade}</span>
                  <span className="font-mono-nums font-medium" style={{ color: g.color }}>{g.count}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
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
            className="glass-card p-4 text-left transition-all duration-200"
          >
            <div className="flex items-start justify-between mb-3">
              <ScoreRing score={h.healthScore} size={52} strokeWidth={5} showLabel={false} />
              <span
                className="text-xs font-semibold px-2 py-0.5 rounded-full"
                style={h.recommendation === 'Subscribe' ? { background: 'rgba(52,211,153,0.15)', color: '#34D399' } :
                  h.recommendation === 'Avoid' ? { background: 'rgba(251,113,133,0.15)', color: '#FB7185' } :
                  { background: 'rgba(251,191,36,0.15)', color: '#FBBF24' }}
              >
                {h.recommendation}
              </span>
            </div>
            <p className="font-medium text-primary-text text-sm leading-tight">{h.companyName}</p>
            <p className="text-xs text-muted-text mt-0.5">{h.sector}</p>
            <div className="mt-3 pt-3 flex justify-between text-xs" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-muted-text">GNPA</span>
              <span className="font-mono-nums font-medium" style={{ color: h.gnpa > 3 ? '#FB7185' : '#34D399' }}>{h.gnpa}%</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
