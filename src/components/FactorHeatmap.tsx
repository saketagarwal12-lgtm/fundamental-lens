import { gradeBarColor } from './GradeBadge';
import type { ScorecardFactor } from '../data/krazybee';

// Grid of factor tiles, each tinted by its grade colour with a soft glow.
export const FactorHeatmap: React.FC<{ factors: ScorecardFactor[] }> = ({ factors }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
    {factors.map(f => {
      const c = gradeBarColor(f.grade);
      return (
        <div
          key={f.name}
          title={`${f.name}: ${f.grade} · ${f.pct}%`}
          className="rounded-lg p-2.5 flex flex-col justify-between min-h-[64px]"
          style={{ background: `${c}1f`, border: `1px solid ${c}40`, boxShadow: `0 0 10px ${c}22` }}
        >
          <span className="text-[11px] leading-tight text-primary-text/90">{f.name}</span>
          <span className="font-mono-nums text-sm font-semibold mt-1" style={{ color: c }}>{f.pct}%</span>
        </div>
      );
    })}
  </div>
);
