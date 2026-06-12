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
      <div className="grid grid-cols-1 lg:grid-cols-[250px_minmax(0,1fr)_300px] gap-5 mb-5">
        <div className="glass-card-elevated p-5 flex items-center justify-center">
          <ScoreGauge score={issuer.score} max={issuer.max} pct={issuer.pct} caption="Fundamental Score" />
        </div>
        <ScoreTrend data={trend} title="Fundamental Score — 12-month trend" max={issuer.max} />
        <FactorAssessment pillars={issuerPillars} />
      </div>
      <ScoreComposition
        components={scaled.components}
        scorecard={report.scorecard}
        combinedScore={scaled.score}
        combinedPct={scaled.pct}
        rating={scaled.rating}
      />
    </section>
  );
};
