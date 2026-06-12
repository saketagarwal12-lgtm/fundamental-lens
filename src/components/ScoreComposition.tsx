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
  combinedPct: number;
  rating: number;
  combinedMax?: number;
}

const displayLabel = (c: ComponentScore) => (c.key === 'issuer' ? 'Fundamental' : c.label);

export const ScoreComposition: React.FC<Props> = ({ components, scorecard, combinedScore, combinedPct, rating, combinedMax = 500 }) => {
  const [active, setActive] = useState<string | null>(null);
  const [openPillar, setOpenPillar] = useState<string | null>(null);

  const pillar = (name: string) => scorecard.find(p => p.name === name);
  const toggle = (key: string) => { setActive(a => (a === key ? null : key)); setOpenPillar(null); };

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-2">
        <h3 className="font-semibold text-primary-text text-sm">Total Score</h3>
        <span className="font-mono-nums text-sm">
          <span className="text-brand-teal font-bold">{combinedScore}</span>
          <span className="text-muted-text"> / {combinedMax}</span>
          <span className="text-muted-text"> · {combinedPct}%</span>
          <span className="ml-2 text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.25)' }} title="Internal rating, 1 = best … 10 = worst">
            Rating {rating}
          </span>
        </span>
      </div>

      {/* Vertical bars — width ∝ max, fill height ∝ score/max */}
      <div className="flex gap-3 items-end mb-2" style={{ height: 168 }} role="list" aria-label="Total Score composition">
        {components.map(c => {
          const color = gradeBarColor(c.grade);
          const isActive = active === c.key;
          return (
            <button
              key={c.key}
              role="listitem"
              onClick={() => toggle(c.key)}
              aria-expanded={isActive}
              title={`${displayLabel(c)}: ${c.score}/${c.max} · ${c.pct}% — click to drill down`}
              className="relative h-full rounded-xl overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              style={{
                width: `${c.weightPct}%`,
                background: 'rgba(255,255,255,0.05)',
                border: isActive ? `1px solid ${color}` : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isActive ? `0 0 16px ${color}55` : 'none',
              }}
            >
              {/* fill from bottom */}
              <div
                className="absolute inset-x-0 bottom-0 transition-all duration-700"
                style={{ height: `${c.pct}%`, background: `linear-gradient(0deg, ${color}, ${color}aa)`, boxShadow: `0 0 14px ${color}66` }}
              />
              <span className="absolute top-2 inset-x-0 text-center font-mono-nums text-xs font-bold" style={{ color: '#E9F3F1', textShadow: '0 1px 3px rgba(0,0,0,0.7)' }}>
                {c.pct}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Labels under bars */}
      <div className="flex gap-3 mb-1">
        {components.map(c => (
          <button key={c.key} onClick={() => toggle(c.key)} className="text-left" style={{ width: `${c.weightPct}%` }}>
            <p className="text-[11px] font-medium text-primary-text truncate flex items-center gap-1">
              {active === c.key ? <ChevronDown size={11} className="shrink-0" /> : <ChevronRight size={11} className="shrink-0" />}
              <span className="truncate">{displayLabel(c)}</span>
            </p>
            <p className="text-[11px] font-mono-nums text-muted-text">{c.score}/{c.max}</p>
            <p className="text-[10px] font-mono-nums" style={{ color: gradeBarColor(c.grade) }}>{c.pct}%</p>
          </button>
        ))}
      </div>

      {/* Drill panel */}
      {active && (
        <div className="mt-4 pt-4 page-fade" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {(() => {
            const c = components.find(x => x.key === active)!;
            if (c.key === 'issuer') {
              const subs = (c.scorecardName as string[]).map(n => pillar(n)).filter(Boolean) as ScorecardPillar[];
              return (
                <div className="space-y-3">
                  <p className="text-xs text-muted-text">The Fundamental Score rolls up two sub-pillars — expand each for its factor heatmap.</p>
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
