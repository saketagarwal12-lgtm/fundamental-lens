import { ScoreGauge } from './ScoreGauge';
import { ScoreTrend } from './ScoreTrend';
import { ScoreComposition } from './ScoreComposition';
import { FactorAssessment } from './FactorAssessment';
import { getScaledScore, getIssuerTrend, scoreBand } from '../data/score';
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

  const listing = report.listing;
  const listed = !!listing?.listed;
  const badge = listed && listing
    ? `Listed · ${listing.exchanges ?? ''}${listing.ticker ? ` · ${listing.ticker}` : ''}`
    : undefined;

  const band = scoreBand(issuer.pct);
  const bandColor = band === 'Strong' ? '#34D399' : band === 'Adequate' ? '#FBBF24' : '#FB7185';
  const latestPeriod = trend.length ? trend[trend.length - 1].month : '';

  return (
    <section className="mb-8" aria-label="Fundamental Score">
      {/* Row 1 — full-width trend (with share-price overlay for listed entities) */}
      <div className="mb-5">
        <ScoreTrend
          data={trend}
          title="Fundamental Score — 12-month trend"
          max={issuer.max}
          height={280}
          price={listed ? report.priceSeries : undefined}
          badge={badge}
        />
        {!listed && listing?.note && (
          <p className="t-caption mt-1.5 px-1">{listing.note}</p>
        )}
      </div>

      {/* Row 2 — gauge · factor assessment · total score */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,28fr)_minmax(0,36fr)_minmax(0,36fr)] gap-5 items-stretch">
        <div className="glass-card-elevated p-5 flex flex-col items-center justify-center text-center">
          <ScoreGauge score={issuer.score} max={issuer.max} pct={issuer.pct} caption="Fundamental Score" />
          <div className="mt-4 pt-4 w-full" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <p className="t-label" style={{ color: bandColor }}>{band}</p>
            <p className="t-caption mt-0.5">as of {latestPeriod}</p>
          </div>
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
