import { ScoreGauge } from './ScoreGauge';
import { ScoreTrend } from './ScoreTrend';
import { ScoreComposition } from './ScoreComposition';
import { FactorAssessment } from './FactorAssessment';
import { getScaledScore, getIssuerTrend } from '../data/score';
import type { CompanyReport } from '../data/reports';

// Entity-level hero: Fundamental (Issuer /200) gauge + trend + factor assessment,
// then the full Total Score (0–500) composition.
export const FundamentalScore: React.FC<{ report: CompanyReport }> = ({ report }) => {
  const scaled = getScaledScore(report);
  const issuer = scaled.components.find(c => c.key === 'issuer')!;
  const trend = getIssuerTrend(report.id);

  const issuerPillars = report.scorecard.filter(
    p => p.name === 'Business & Management' || p.name === 'Financial Analysis',
  );

  return (
    <section className="mb-8" aria-label="Fundamental Score">
      {/* Row 1 — full-width trend */}
      <div className="mb-5">
        <ScoreTrend data={trend} title="Fundamental Score — 12-month trend" max={issuer.max} height={280} />
      </div>

      {/* Row 2 — gauge · factor assessment · total score */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,28fr)_minmax(0,36fr)_minmax(0,36fr)] gap-5 items-stretch">
        <div className="glass-card-elevated p-5 flex items-center justify-center">
          <ScoreGauge score={issuer.score} max={issuer.max} pct={issuer.pct} caption="Fundamental Score" />
        </div>
        <FactorAssessment pillars={issuerPillars} />
        <ScoreComposition
          components={scaled.components}
          scorecard={report.scorecard}
          combinedScore={scaled.score}
          combinedPct={scaled.pct}
          rating={scaled.rating}
        />
      </div>
    </section>
  );
};
