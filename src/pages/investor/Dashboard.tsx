import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, AlertCircle, Plus, Settings2 } from 'lucide-react';
import { ScoreRing } from '../../components/ScoreRing';
import { Sparkline } from '../../components/Sparkline';
import { portfolioHoldings } from '../../data/portfolio';

const recColor = (r: string) =>
  r === 'Subscribe' ? 'bg-[#2F8A5F]/10 text-[#2F8A5F]' :
  r === 'Avoid' ? 'bg-[#B5524A]/10 text-[#B5524A]' :
  'bg-[#C08A2E]/10 text-[#C08A2E]';

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
          <h1 className="text-xl font-semibold text-ink">Portfolio Dashboard</h1>
          <p className="text-sm text-muted mt-0.5">{portfolioHoldings.length} holdings tracked · Updated May 2026</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-deep transition-colors">
          <Plus size={15} /> Add Issuer
        </button>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-7">
        <div className="bg-white rounded-xl border border-hairline p-5 flex items-center gap-4">
          <ScoreRing score={avgScore} size={60} strokeWidth={5} />
          <div>
            <p className="text-xs text-muted">Avg Portfolio Score</p>
            <p className="font-mono-nums text-lg font-bold text-ink mt-0.5">{avgScore}/100</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-hairline p-5">
          <p className="text-xs text-muted mb-2">Holdings</p>
          <p className="font-mono-nums text-3xl font-bold text-ink">{portfolioHoldings.length}</p>
          <p className="text-xs text-muted mt-1">across 3 sub-sectors</p>
        </div>
        <div className="bg-white rounded-xl border border-hairline p-5">
          <p className="text-xs text-muted mb-2">Improving (30d)</p>
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-[#2F8A5F]" />
            <p className="font-mono-nums text-3xl font-bold text-[#2F8A5F]">{improving}</p>
          </div>
          <p className="text-xs text-muted mt-1">{portfolioHoldings.length - improving} stable / declining</p>
        </div>
        <div className="bg-white rounded-xl border border-hairline p-5">
          <p className="text-xs text-muted mb-2">Active Alerts</p>
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className={alertCount > 0 ? 'text-[#C08A2E]' : 'text-muted'} />
            <p className={`font-mono-nums text-3xl font-bold ${alertCount > 0 ? 'text-[#C08A2E]' : 'text-muted'}`}>{alertCount}</p>
          </div>
          <p className="text-xs text-muted mt-1">across {portfolioHoldings.filter(h => h.alerts.length > 0).length} issuers</p>
        </div>
      </div>

      {/* Holdings table */}
      <div className="bg-white rounded-xl border border-hairline overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-hairline">
          <h2 className="font-semibold text-[#23262C]">Holdings</h2>
          <div className="relative">
            <button
              onClick={() => setShowColMenu(v => !v)}
              className="flex items-center gap-1.5 text-xs text-muted hover:text-[#23262C] transition-colors px-3 py-1.5 rounded border border-hairline"
            >
              <Settings2 size={13} /> Columns
            </button>
            {showColMenu && (
              <div className="absolute right-0 top-full mt-1 w-44 bg-white border border-hairline rounded-lg shadow-lg z-20 p-2">
                {ALL_COLS.map(col => (
                  <label key={col} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-paper cursor-pointer">
                    <input
                      type="checkbox"
                      checked={visibleCols.has(col)}
                      onChange={() => toggleCol(col)}
                      className="accent-brand"
                    />
                    <span className="text-xs text-[#23262C]">{col}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-hairline bg-paper/50">
                <th className="text-left px-5 py-3 text-xs font-medium text-muted">Issuer</th>
                {visibleCols.has('Health Score') && <th className="text-center px-4 py-3 text-xs font-medium text-muted">Score</th>}
                {visibleCols.has('Trend') && <th className="text-center px-4 py-3 text-xs font-medium text-muted">Trend (12m)</th>}
                {visibleCols.has('Rating') && <th className="text-left px-4 py-3 text-xs font-medium text-muted">Ext. Rating</th>}
                {visibleCols.has('GNPA') && <th className="text-right px-4 py-3 text-xs font-medium text-muted">GNPA</th>}
                {visibleCols.has('Total CAR') && <th className="text-right px-4 py-3 text-xs font-medium text-muted">Total CAR</th>}
                {visibleCols.has('Recommendation') && <th className="text-center px-4 py-3 text-xs font-medium text-muted">Our View</th>}
                {visibleCols.has('Alerts') && <th className="text-left px-4 py-3 text-xs font-medium text-muted">Alerts</th>}
              </tr>
            </thead>
            <tbody>
              {portfolioHoldings.map(h => {
                const delta = h.healthScore - h.previousScore;
                return (
                  <tr
                    key={h.companyId}
                    className="border-b border-hairline last:border-0 hover:bg-paper/60 cursor-pointer transition-colors"
                    onClick={() => navigate(`/app/company/${h.companyId}`)}
                  >
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#23262C]">{h.companyName}</p>
                      <p className="text-xs text-muted mt-0.5">{h.sector}</p>
                    </td>
                    {visibleCols.has('Health Score') && (
                      <td className="px-4 py-4 text-center">
                        <div className="inline-flex flex-col items-center gap-1">
                          <span className="font-mono-nums font-bold text-[15px]" style={{ color: h.healthScore >= 70 ? '#2F8A5F' : h.healthScore >= 55 ? '#C08A2E' : '#B5524A' }}>
                            {h.healthScore}
                          </span>
                          <span className={`text-[10px] font-medium ${delta > 0 ? 'text-[#2F8A5F]' : delta < 0 ? 'text-[#B5524A]' : 'text-muted'}`}>
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
                        <span className="text-sm text-[#23262C]">{h.externalRating}</span>
                      </td>
                    )}
                    {visibleCols.has('GNPA') && (
                      <td className="px-4 py-4 text-right">
                        <span className={`font-mono-nums text-sm ${h.gnpa > 3 ? 'text-[#B5524A]' : h.gnpa > 2 ? 'text-[#C08A2E]' : 'text-[#2F8A5F]'}`}>
                          {h.gnpa.toFixed(2)}%
                        </span>
                      </td>
                    )}
                    {visibleCols.has('Total CAR') && (
                      <td className="px-4 py-4 text-right">
                        <span className={`font-mono-nums text-sm ${h.totalCAR < 20 ? 'text-[#B5524A]' : h.totalCAR < 25 ? 'text-[#C08A2E]' : 'text-[#2F8A5F]'}`}>
                          {h.totalCAR.toFixed(1)}%
                        </span>
                      </td>
                    )}
                    {visibleCols.has('Recommendation') && (
                      <td className="px-4 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${recColor(h.recommendation)}`}>
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
                                <AlertCircle size={11} className="text-[#C08A2E] mt-0.5 shrink-0" />
                                <span className="text-xs text-muted leading-tight">{a}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-muted">—</span>
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
      <div className="mt-6 p-5 rounded-xl border border-dashed border-hairline bg-white text-center">
        <p className="text-sm text-muted mb-3">5 issuers in our coverage universe. Don't see one you hold?</p>
        <button
          onClick={() => navigate('/app/watchlist')}
          className="inline-flex items-center gap-1.5 text-sm text-brand font-semibold hover:underline"
        >
          <Plus size={14} /> Request new coverage
        </button>
      </div>
    </div>
  );
};
