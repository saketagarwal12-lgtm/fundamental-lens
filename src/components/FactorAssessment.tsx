import { gradeBarColor } from './GradeBadge';
import { gradeForPct } from '../data/score';
import type { ScorecardPillar } from '../data/krazybee';

// Right-of-trend card: the 10 issuer factors that drive the Fundamental Score,
// grouped by pillar, each as name · slim filled track · %.
export const FactorAssessment: React.FC<{ pillars: ScorecardPillar[] }> = ({ pillars }) => (
  <div className="glass-card p-5 h-full flex flex-col">
    <h3 className="font-semibold text-primary-text text-sm mb-4">What's driving the score</h3>
    <div className="space-y-4 flex-1">
      {pillars.map(pillar => {
        const pColor = gradeBarColor(gradeForPct(pillar.pct));
        return (
          <div key={pillar.name}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-primary-text">{pillar.name}</span>
              <span
                className="text-[11px] font-mono-nums font-semibold px-1.5 py-0.5 rounded"
                style={{ background: `${pColor}1f`, color: pColor, border: `1px solid ${pColor}40` }}
              >
                {pillar.pct}%
              </span>
            </div>
            <div className="space-y-1.5">
              {pillar.factors.map(f => {
                const c = gradeBarColor(gradeForPct(f.pct));
                return (
                  <div key={f.name} className="flex items-center gap-2">
                    <span className="text-[11px] text-muted-text flex-1 min-w-0 truncate" title={f.name}>{f.name}</span>
                    <div className="w-16 h-1.5 rounded-full overflow-hidden shrink-0" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <div className="h-full rounded-full" style={{ width: `${f.pct}%`, background: c, boxShadow: `0 0 6px ${c}88` }} />
                    </div>
                    <span className="text-[11px] font-mono-nums font-medium w-8 text-right shrink-0" style={{ color: c }}>{f.pct}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
