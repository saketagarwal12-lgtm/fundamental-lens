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
          <h1 className="text-xl font-semibold text-ink">Sector Models</h1>
          <p className="text-sm text-muted mt-0.5">Configure scoring frameworks per sector</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-hairline text-sm font-medium hover:bg-white transition-colors">
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
              className={`w-full text-left p-4 rounded-xl border transition-colors ${
                selectedModel === m.id ? 'border-brand bg-brand-tint' :
                m.active ? 'border-hairline bg-white hover:border-brand/30' :
                'border-hairline bg-paper/30 opacity-60 cursor-default'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-[#23262C] text-sm">{m.name}</span>
                {m.active && (
                  <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-[#2F8A5F]/10 text-[#2F8A5F] font-semibold">
                    <CheckCircle2 size={10} /> Active
                  </span>
                )}
                {!m.active && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-paper border border-hairline text-muted font-medium">
                    Add soon
                  </span>
                )}
              </div>
              <p className="text-xs text-muted">{m.description}</p>
              {m.active && (
                <p className="text-[10px] text-muted mt-2">
                  {m.issuers} issuers · Updated {m.lastUpdated}
                </p>
              )}
            </button>
          ))}
        </div>

        {/* Model detail */}
        <div className="lg:col-span-2">
          {selectedModel === 'nbfc' && (
            <div className="bg-white rounded-xl border border-hairline overflow-hidden">
              <div className="px-5 py-4 border-b border-hairline flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-[#23262C]">NBFC Scoring Model</h2>
                  <p className="text-xs text-muted mt-0.5">5 pillars · 25 factors · Version 2.1</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-medium hover:bg-brand-deep transition-colors">
                  Save Changes
                </button>
              </div>

              <div className="p-5 space-y-3">
                {scorecard.map(pillar => (
                  <div key={pillar.name} className="border border-hairline rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedPillar(expandedPillar === pillar.name ? null : pillar.name)}
                      className="w-full flex items-center gap-3 px-4 py-3 hover:bg-paper/50 transition-colors"
                    >
                      <div className="flex-1 text-left">
                        <span className="font-medium text-[#23262C] text-sm">{pillar.name}</span>
                      </div>
                      <span className="text-xs text-muted">{pillar.factors.length} factors</span>
                      <GradeBadge grade={pillar.grade} compact />
                      {expandedPillar === pillar.name
                        ? <ChevronDown size={14} className="text-muted" />
                        : <ChevronRight size={14} className="text-muted" />
                      }
                    </button>

                    {expandedPillar === pillar.name && (
                      <div className="border-t border-hairline bg-paper/30 p-4">
                        <p className="text-[10px] font-semibold text-muted uppercase tracking-wider mb-3">Factor Weights & Grade Anchors</p>
                        <div className="space-y-2">
                          {pillar.factors.map(f => (
                            <div key={f.name} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-hairline">
                              <span className="text-xs font-medium text-[#23262C] flex-1">{f.name}</span>
                              <select
                                defaultValue={f.grade}
                                className="text-xs border border-hairline rounded px-2 py-1 text-muted focus:outline-none focus:ring-1 focus:ring-brand/40 bg-white"
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
                                className="w-16 text-xs border border-hairline rounded px-2 py-1 font-mono-nums text-right focus:outline-none focus:ring-1 focus:ring-brand/40"
                              />
                              <span className="text-[10px] text-muted">wt%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="px-5 py-4 border-t border-hairline bg-paper/30 text-xs text-muted">
                Changes to model weights will recalculate all scores on next re-run. Requires senior analyst approval before publishing.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
