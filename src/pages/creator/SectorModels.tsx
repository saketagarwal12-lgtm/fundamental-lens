import { useState } from 'react';
import { Plus, ChevronDown, ChevronRight, CheckCircle2 } from 'lucide-react';
import { GradeBadge } from '../../components/GradeBadge';
import { scorecard } from '../../data/krazybee';

const models = [
  { id: 'nbfc', name: 'NBFC', description: 'Non-Banking Financial Companies — all sub-sectors', active: true, issuers: 5, lastUpdated: 'Jun 2026' },
  { id: 'realestate', name: 'Real Estate', description: 'Developers, REITs, and housing finance', active: false, issuers: 0, lastUpdated: '—' },
  { id: 'infra', name: 'Infrastructure', description: 'Roads, ports, power, and allied sectors', active: false, issuers: 0, lastUpdated: '—' },
  { id: 'bank', name: 'Banks', description: 'Scheduled commercial and co-operative banks', active: false, issuers: 0, lastUpdated: '—' },
];

const GRADE_OPTIONS = ['Extremely Strong', 'Strong', 'Moderate', 'Weak'];

export const SectorModels: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<string>('nbfc');
  const [expandedPillar, setExpandedPillar] = useState<string | null>('Business & Management');

  return (
    <div className="p-6 page-fade max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-primary-text">Sector Models</h1>
          <p className="text-sm text-muted-text mt-0.5">Configure scoring frameworks per sector</p>
        </div>
        <button
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium btn-outline-glass"
        >
          <Plus size={15} /> New Sector Model
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Model list */}
        <div className="space-y-2">
          {models.map(m => (
            <button
              key={m.id}
              onClick={() => m.active && setSelectedModel(m.id)}
              className={`w-full text-left p-4 rounded-xl transition-colors ${!m.active ? 'opacity-50 cursor-default' : ''}`}
              style={{
                border: selectedModel === m.id
                  ? '1px solid rgba(45,212,191,0.4)'
                  : '1px solid rgba(255,255,255,0.08)',
                background: selectedModel === m.id
                  ? 'rgba(45,212,191,0.08)'
                  : 'rgba(255,255,255,0.03)',
              }}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-primary-text text-sm">{m.name}</span>
                {m.active && (
                  <span
                    className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded font-semibold"
                    style={{ background: 'rgba(52,211,153,0.15)', color: '#34D399' }}
                  >
                    <CheckCircle2 size={10} /> Active
                  </span>
                )}
                {!m.active && (
                  <span
                    className="text-[10px] px-1.5 py-0.5 rounded font-medium text-muted-text"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                  >
                    Add soon
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-text">{m.description}</p>
              {m.active && (
                <p className="text-[10px] text-muted-text mt-2">
                  {m.issuers} issuers · Updated {m.lastUpdated}
                </p>
              )}
            </button>
          ))}
        </div>

        {/* Model detail */}
        <div className="lg:col-span-2">
          {selectedModel === 'nbfc' && (
            <div className="glass-card overflow-hidden">
              <div
                className="px-5 py-4 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div>
                  <h2 className="font-semibold text-primary-text">NBFC Scoring Model</h2>
                  <p className="text-xs text-muted-text mt-0.5">5 pillars · 25 factors · Version 2.1</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg btn-gradient text-xs font-medium">
                  Save Changes
                </button>
              </div>

              <div className="p-5 space-y-3">
                {scorecard.map(pillar => (
                  <div
                    key={pillar.name}
                    className="rounded-xl overflow-hidden"
                    style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    <button
                      onClick={() => setExpandedPillar(expandedPillar === pillar.name ? null : pillar.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 transition-colors"
                      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      <div className="flex-1 text-left">
                        <span className="font-medium text-primary-text text-sm">{pillar.name}</span>
                      </div>
                      <span className="text-xs text-muted-text">{pillar.factors.length} factors</span>
                      <GradeBadge grade={pillar.grade} compact />
                      {expandedPillar === pillar.name
                        ? <ChevronDown size={14} className="text-muted-text" />
                        : <ChevronRight size={14} className="text-muted-text" />
                      }
                    </button>

                    {expandedPillar === pillar.name && (
                      <div
                        className="border-t p-4"
                        style={{ borderColor: 'rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
                      >
                        <p className="text-[10px] font-semibold text-muted-text uppercase tracking-wider mb-3">
                          Factor Weights & Grade Anchors
                        </p>
                        <div className="space-y-2">
                          {pillar.factors.map(f => (
                            <div
                              key={f.name}
                              className="flex items-center gap-3 rounded-lg p-3"
                              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}
                            >
                              <span className="text-xs font-medium text-primary-text flex-1">{f.name}</span>
                              <select
                                defaultValue={f.grade}
                                className="text-xs rounded px-2 py-1 text-muted-text focus:outline-none font-mono-nums"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#9CB3B1' }}
                              >
                                {GRADE_OPTIONS.map(g => (
                                  <option key={g} value={g}>{g}</option>
                                ))}
                              </select>
                              <input
                                type="number"
                                defaultValue={20}
                                min={5}
                                max={40}
                                className="w-16 text-xs rounded px-2 py-1 font-mono-nums text-right focus:outline-none text-primary-text"
                                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                              />
                              <span className="text-[10px] text-muted-text">wt%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div
                className="px-5 py-4 text-xs text-muted-text"
                style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
              >
                Changes to model weights will recalculate all scores on next re-run. Requires senior analyst approval before publishing.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
