import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { gradeBarColor } from './GradeBadge';
import { FactorHeatmap } from './FactorHeatmap';
import type { ComponentScore } from '../data/score';
import type { ScorecardPillar } from '../data/krazybee';

interface Props {
  components: ComponentScore[];
  scorecard: ScorecardPillar[];
  combinedScore: number;
  combinedMax?: number;
}

export const ScoreComposition: React.FC<Props> = ({ components, scorecard, combinedScore, combinedMax = 500 }) => {
  const [active, setActive] = useState<string | null>(null);
  const [openPillar, setOpenPillar] = useState<string | null>(null);

  const pillar = (name: string) => scorecard.find(p => p.name === name);

  const toggle = (key: string) => {
    setActive(a => (a === key ? null : key));
    setOpenPillar(null);
  };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-semibold text-primary-text text-sm">Score Composition</h3>
        <span className="font-mono-nums text-xs text-muted-text">
          sums to <span className="text-brand-teal font-semibold">{combinedScore}</span> / {combinedMax}
        </span>
      </div>

      {/* Weighted bar */}
      <div className="flex gap-1 h-12 mb-2" role="list" aria-label="Score composition">
        {components.map(c => {
          const color = gradeBarColor(c.grade);
          const isActive = active === c.key;
          return (
            <button
              key={c.key}
              role="listitem"
              onClick={() => toggle(c.key)}
              aria-expanded={isActive}
              title={`${c.label}: ${c.score}/${c.max} · ${c.pct}% — click to drill down`}
              className="relative rounded-lg overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              style={{
                width: `${c.weightPct}%`,
                background: 'rgba(255,255,255,0.06)',
                border: isActive ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isActive ? `0 0 16px ${color}55` : 'none',
              }}
            >
              <div
                className="absolute inset-y-0 left-0 transition-all duration-500"
                style={{ width: `${c.pct}%`, background: `linear-gradient(90deg, ${color}cc, ${color})`, boxShadow: `0 0 12px ${color}66` }}
              />
              <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-white drop-shadow" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.6)' }}>
                {c.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Labels row, aligned under segments */}
      <div className="flex gap-1 mb-1">
        {components.map(c => (
          <button key={c.key} onClick={() => toggle(c.key)} className="text-left" style={{ width: `${c.weightPct}%` }}>
            <p className="text-[11px] text-muted-text truncate flex items-center gap-1">
              {active === c.key ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              <span className="font-mono-nums">{c.score}/{c.max}</span>
            </p>
            <p className="text-[10px] font-mono-nums" style={{ color: gradeBarColor(c.grade) }}>{c.pct}%</p>
          </button>
        ))}
      </div>

      {/* Drill panel */}
      {active && (
        <div className="mt-4 pt-4 page-fade" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {(() => {
            const c = components.find(x => x.key === active)!;
            // Issuer → two sub-pillars
            if (c.key === 'issuer') {
              const subs = (c.scorecardName as string[]).map(n => pillar(n)).filter(Boolean) as ScorecardPillar[];
              return (
                <div className="space-y-3">
                  <p className="text-xs text-muted-text">Issuer score rolls up two sub-pillars — expand each for its factor heatmap.</p>
                  {subs.map(p => {
                    const open = openPillar === p.name;
                    const color = gradeBarColor(p.grade);
                    return (
                      <div key={p.name} className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                        <button
                          onClick={() => setOpenPillar(o => (o === p.name ? null : p.name))}
                          aria-expanded={open}
                          className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                        >
                          <span className="text-sm font-medium text-primary-text flex-1 text-left">{p.name}</span>
                          <div className="w-24 h-1.5 rounded-full overflow-hidden hidden sm:block" style={{ background: 'rgba(255,255,255,0.07)' }}>
                            <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: color }} />
                          </div>
                          <span className="font-mono-nums text-sm font-semibold w-9 text-right" style={{ color }}>{p.pct}%</span>
                          {open ? <ChevronDown size={15} className="text-muted-text" /> : <ChevronRight size={15} className="text-muted-text" />}
                        </button>
                        {open && (
                          <div className="px-4 py-3 page-fade" style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
                            <FactorHeatmap factors={p.factors} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            }
            // Others → heatmap directly
            const p = pillar(c.scorecardName as string);
            if (!p) return null;
            return (
              <div>
                <p className="text-xs text-muted-text mb-3">{p.name} — factor heatmap (latest snapshot)</p>
                <FactorHeatmap factors={p.factors} />
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
};
