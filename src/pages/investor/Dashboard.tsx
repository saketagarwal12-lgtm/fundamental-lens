import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, AlertCircle, Plus, Settings2 } from 'lucide-react';
import { ScoreRing } from '../../components/ScoreRing';
import { Sparkline } from '../../components/Sparkline';
import { portfolioHoldings } from '../../data/portfolio';

const recColor = (r: string): React.CSSProperties =>
  r === 'Subscribe' ? { background: 'rgba(52,211,153,0.15)', color: '#34D399' } :
  r === 'Avoid' ? { background: 'rgba(251,113,133,0.15)', color: '#FB7185' } :
  { background: 'rgba(251,191,36,0.15)', color: '#FBBF24' };

const ALL_COLS = ['Health Score', 'Trend', 'Rating', 'GNPA', 'Total CAR', 'Recommendation', 'Alerts'];

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [visibleCols, setVisibleCols] = useState(new Set(ALL_COLS));
  const [showColMenu, setShowColMenu] = useState(false);

  const avgScore = Math.round(portfolioHoldings.reduce((a, b) => a + b.healthScore, 0) / portfolioHoldings.length);
  const improving = portfolioHoldings.filter(h => h.healthScore > h.previousScore).length;
  const alertCount = portfolioHoldings.filter(h => h.alerts.length > 0).reduce((a, b) => a + b.alerts.length, 0);

  const toggleCol = (col: string) => {
    const s = new Set(visibleCols);
    s.has(col) ? s.delete(col) : s.add(col);
    setVisibleCols(s);
  };

  return (
    <div className="p-6 page-fade max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-primary-text">Portfolio Dashboard</h1>
          <p className="text-sm text-muted-text mt-0.5">{portfolioHoldings.length} holdings tracked · Updated May 2026</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg btn-gradient text-sm">
          <Plus size={15} /> Add Issuer
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <div className="glass-card p-5 flex items-center gap-4">
          <ScoreRing score={avgScore} size={60} strokeWidth={5} />
          <div>
            <p className="text-xs text-muted-text">Avg Portfolio Score</p>
            <p className="font-mono-nums text-lg font-bold text-primary-text mt-0.5">{avgScore}/100</p>
          </div>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted-text mb-2">Holdings</p>
          <p className="font-mono-nums text-3xl font-bold text-primary-text">{portfolioHoldings.length}</p>
          <p className="text-xs text-muted-text mt-1">across 3 sub-sectors</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted-text mb-2">Improving (30d)</p>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} style={{ color: '#34D399' }} />
            <p className="font-mono-nums text-3xl font-bold" style={{ color: '#34D399' }}>{improving}</p>
          </div>
          <p className="text-xs text-muted-text mt-1">{portfolioHoldings.length - improving} stable / declining</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-xs text-muted-text mb-2">Active Alerts</p>
          <div className="flex items-center gap-2">
            <AlertCircle size={18} style={{ color: alertCount > 0 ? '#FBBF24' : '#9CB3B1' }} />
            <p className="font-mono-nums text-3xl font-bold" style={{ color: alertCount > 0 ? '#FBBF24' : '#9CB3B1' }}>{alertCount}</p>
          </div>
          <p className="text-xs text-muted-text mt-1">across {portfolioHoldings.filter(h => h.alerts.length > 0).length} issuers</p>
        </div>
      </div>

      {/* Holdings table */}
      <div className="glass-card overflow-hidden" style={{ borderRadius: '18px' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="font-semibold text-primary-text">Holdings</h2>
          <div className="relative">
            <button
              onClick={() => setShowColMenu(v => !v)}
              className="flex items-center gap-1.5 text-xs text-muted-text hover:text-primary-text transition-colors px-3 py-1.5 rounded"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <Settings2 size={13} /> Columns
            </button>
            {showColMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-44 rounded-lg z-20 p-2"
                style={{ background: 'rgba(18,42,44,0.95)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(18px)' }}
              >
                {ALL_COLS.map(col => (
                  <label key={col} className="flex items-center gap-2 px-2 py-1.5 rounded cursor-pointer text-muted-text hover:text-primary-text">
                    <input
                      type="checkbox"
                      checked={visibleCols.has(col)}
                      onChange={() => toggleCol(col)}
                      className="accent-brand-teal"
                    />
                    <span className="text-xs">{col}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                <th className="text-left px-5 py-3 text-xs font-medium text-muted-text">Issuer</th>
                {visibleCols.has('Health Score') && <th className="text-center px-4 py-3 text-xs font-medium text-muted-text">Score</th>}
                {visibleCols.has('Trend') && <th className="text-center px-4 py-3 text-xs font-medium text-muted-text">Trend (12m)</th>}
                {visibleCols.has('Rating') && <th className="text-left px-4 py-3 text-xs font-medium text-muted-text">Ext. Rating</th>}
                {visibleCols.has('GNPA') && <th className="text-right px-4 py-3 text-xs font-medium text-muted-text">GNPA</th>}
                {visibleCols.has('Total CAR') && <th className="text-right px-4 py-3 text-xs font-medium text-muted-text">Total CAR</th>}
                {visibleCols.has('Recommendation') && <th className="text-center px-4 py-3 text-xs font-medium text-muted-text">Our View</th>}
                {visibleCols.has('Alerts') && <th className="text-left px-4 py-3 text-xs font-medium text-muted-text">Alerts</th>}
              </tr>
            </thead>
            <tbody>
              {portfolioHoldings.map(h => {
                const delta = h.healthScore - h.previousScore;
                return (
                  <tr
                    key={h.companyId}
                    className="cursor-pointer transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                    onClick={() => navigate(`/app/company/${h.companyId}`)}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-primary-text">{h.companyName}</p>
                      <p className="text-xs text-muted-text mt-0.5">{h.sector}</p>
                    </td>
                    {visibleCols.has('Health Score') && (
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className="font-mono-nums font-bold text-[15px]" style={{ color: h.healthScore >= 70 ? '#34D399' : h.healthScore >= 55 ? '#FBBF24' : '#FB7185' }}>
                            {h.healthScore}
                          </span>
                          <span className="text-[10px] font-medium" style={{ color: delta > 0 ? '#34D399' : delta < 0 ? '#FB7185' : '#9CB3B1' }}>
                            {delta > 0 ? `+${delta}` : delta < 0 ? `${delta}` : '—'}
                          </span>
                        </div>
                      </td>
                    )}
                    {visibleCols.has('Trend') && (
                      <td className="px-4 py-4 text-center">
                        <div className="flex justify-center">
                          <Sparkline data={h.trend} />
                        </div>
                      </td>
                    )}
                    {visibleCols.has('Rating') && (
                      <td className="px-4 py-4">
                        <span className="text-sm text-primary-text">{h.externalRating}</span>
                      </td>
                    )}
                    {visibleCols.has('GNPA') && (
                      <td className="px-4 py-4 text-right">
                        <span className="font-mono-nums text-sm" style={{ color: h.gnpa > 3 ? '#FB7185' : h.gnpa > 2 ? '#FBBF24' : '#34D399' }}>
                          {h.gnpa.toFixed(2)}%
                        </span>
                      </td>
                    )}
                    {visibleCols.has('Total CAR') && (
                      <td className="px-4 py-4 text-right">
                        <span className="font-mono-nums text-sm" style={{ color: h.totalCAR < 20 ? '#FB7185' : h.totalCAR < 25 ? '#FBBF24' : '#34D399' }}>
                          {h.totalCAR.toFixed(1)}%
                        </span>
                      </td>
                    )}
                    {visibleCols.has('Recommendation') && (
                      <td className="px-4 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold" style={recColor(h.recommendation)}>
                          {h.recommendation}
                        </span>
                      </td>
                    )}
                    {visibleCols.has('Alerts') && (
                      <td className="px-4 py-4 max-w-xs">
                        {h.alerts.length > 0 ? (
                          <div className="space-y-1">
                            {h.alerts.map((a, i) => (
                              <div key={i} className="flex items-start gap-1.5">
                                <AlertCircle size={11} className="mt-0.5 shrink-0" style={{ color: '#FBBF24' }} />
                                <span className="text-xs text-muted-text leading-tight">{a}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-text">—</span>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Discover more */}
      <div
        className="mt-6 p-5 rounded-xl text-center"
        style={{ border: '1px dashed rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.02)' }}
      >
        <p className="text-sm text-muted-text mb-3">5 issuers in our coverage universe. Don't see one you hold?</p>
        <button
          onClick={() => navigate('/app/watchlist')}
          className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          style={{ color: '#2DD4BF' }}
        >
          <Plus size={14} /> Request new coverage
        </button>
      </div>
    </div>
  );
};
