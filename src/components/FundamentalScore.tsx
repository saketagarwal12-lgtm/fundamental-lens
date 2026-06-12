import { ScoreGauge } from './ScoreGauge';
import { ScoreTrend } from './ScoreTrend';
import { ScoreComposition } from './ScoreComposition';
import { getScaledScore, toSeries500 } from '../data/score';
import type { CompanyReport } from '../data/reports';

// Entity-level Fundamental Score hero: gauge + 12-month trend + composition drill-down.
export const FundamentalScore: React.FC<{ report: CompanyReport }> = ({ report }) => {
  const scaled = getScaledScore(report);
  const series = toSeries500(report.healthScoreSeries, scaled.score);

  return (
    <section className="mb-8" aria-label="Fundamental Score">
      <div className="grid lg:grid-cols-[260px_1fr] gap-5 mb-5">
        <div className="glass-card-elevated p-5 flex items-center justify-center">
          <ScoreGauge score={scaled.score} pct={scaled.pct} rating={scaled.rating} />
        </div>
        <ScoreTrend data={series} title="Fundamental Score — 12-month trend" />
      </div>
      <ScoreComposition components={scaled.components} scorecard={report.scorecard} combinedScore={scaled.score} />
    </section>
  );
};
