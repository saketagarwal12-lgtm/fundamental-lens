import { ScoreGauge } from './ScoreGauge';
import { ScoreTrend } from './ScoreTrend';
import { gradeBarColor } from './GradeBadge';
import { getPortfolioScore } from '../data/score';
import type { PortfolioHolding } from '../data/portfolio';

// Portfolio-level Fundamental Score hero: weighted-average gauge + trend + contribution strip.
export const PortfolioFundamentalScore: React.FC<{ holdings: PortfolioHolding[] }> = ({ holdings }) => {
  const { score, max, pct, covered, series, contributions } = getPortfolioScore(holdings);

  return (
    <section className="mb-7" aria-label="Portfolio Fundamental Score">
      <div className="grid lg:grid-cols-[260px_1fr] gap-5 mb-4">
        <div className="glass-card-elevated p-5 flex flex-col items-center justify-center">
          <ScoreGauge score={score} max={max} pct={pct} caption="Portfolio Fundamental Score" />
          <p className="text-[11px] text-muted-text mt-3 text-center">Holding-average issuer score across {covered} covered holdings</p>
        </div>
        <ScoreTrend data={series} title="Portfolio Fundamental Score — 12-month trend" max={max} />
      </div>

      {/* Contribution by holding */}
      <div className="glass-card p-5">
        <h3 className="font-semibold text-primary-text text-sm mb-4">Contribution by holding</h3>
        <div className="grid sm:grid-cols-2 gap-x-6 gap-y-3">
          {contributions.map(c => {
            const color = gradeBarColor(c.grade);
            const up = c.delta >= 0;
            return (
              <div key={c.name} className="flex items-center gap-3">
                <span className="text-xs text-primary-text flex-1 min-w-0 truncate">{c.name}</span>
                <div className="w-24 h-1.5 rounded-full overflow-hidden hidden sm:block" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full" style={{ width: `${c.pct}%`, background: color }} />
                </div>
                <span className="font-mono-nums text-xs font-semibold w-12 text-right" style={{ color }}>{c.score}</span>
                <span className="font-mono-nums text-[11px] w-12 text-right" style={{ color: up ? '#34D399' : '#FB7185' }}>
                  {up ? '+' : ''}{c.delta} pp
                </span>
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-muted-text mt-3">Each holding's Fundamental Score (/200) and how far it sits above/below the portfolio average, in percentage points.</p>
      </div>
    </section>
  );
};
