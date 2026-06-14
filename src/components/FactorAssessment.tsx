import { GradeBadge, gradeBarColor } from './GradeBadge';
import { gradeForPct } from '../data/score';
import type { ScorecardPillar } from '../data/krazybee';

// Right-of-trend card: the 10 issuer factors that drive the Fundamental Score,
// grouped by pillar. Grade labels (not %), full factor names (no truncation).
export const FactorAssessment: React.FC<{ pillars: ScorecardPillar[] }> = ({ pillars }) => (
  <div className="glass-card p-5 h-full flex flex-col">
    <h3 className="t-h3 text-primary-text mb-4">What's driving the score</h3>
    <div className="space-y-5 flex-1">
      {pillars.map((pillar, pi) => (
        <div key={pillar.name} className={pi > 0 ? 'pt-4' : ''} style={pi > 0 ? { borderTop: '1px solid rgba(255,255,255,0.07)' } : {}}>
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <span className="t-label text-primary-text">{pillar.name}</span>
            <GradeBadge grade={gradeForPct(pillar.pct)} compact />
          </div>
          <div className="space-y-2">
            {pillar.factors.map(f => {
              const c = gradeBarColor(gradeForPct(f.pct));
              return (
                <div key={f.name} className="flex items-center gap-3">
                  <span className="t-label font-normal text-muted-text flex-1 leading-snug">{f.name}</span>
                  <div className="w-10 h-1.5 rounded-full overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: c, boxShadow: `0 0 6px ${c}88` }} />
                  </div>
                  <span className="text-[12px] font-medium w-20 text-right shrink-0" style={{ color: c }}>{gradeForPct(f.pct)}</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  </div>
);
