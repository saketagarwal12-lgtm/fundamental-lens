import { useState, useMemo } from 'react';
import { RotateCcw, SlidersHorizontal, ChevronDown, ChevronRight } from 'lucide-react';
import { gradeBarColor } from './GradeBadge';
import { getScaledScore, gradeForPct, scoreBand } from '../data/score';
import type { CompanyReport } from '../data/reports';

// Default model weights for the four Total Score components.
const DEFAULT_COMPONENT_W = { issuer: 40, issuance: 20, pricing: 30, economic: 10 };

const Slider: React.FC<{ label: string; value: number; onChange: (v: number) => void; color: string }> = ({ label, value, onChange, color }) => (
  <label className="block">
    <div className="flex items-center justify-between mb-1">
      <span className="t-label text-primary-text">{label}</span>
      <span className="font-mono-nums text-xs" style={{ color }}>{value}</span>
    </div>
    <input
      type="range" min={0} max={100} value={value}
      onChange={e => onChange(Number(e.target.value))}
      className="w-full"
      style={{ accentColor: color }}
      aria-label={`${label} weight`}
    />
  </label>
);

export const WeightageWhatIf: React.FC<{ report: CompanyReport }> = ({ report }) => {
  const scaled = getScaledScore(report);
  const comp = Object.fromEntries(scaled.components.map(c => [c.key, c.pct])) as Record<string, number>;

  const issuerFactors = report.scorecard
    .filter(p => p.name === 'Business & Management' || p.name === 'Financial Analysis')
    .flatMap(p => p.factors);

  const [w, setW] = useState({ ...DEFAULT_COMPONENT_W });
  const [factorW, setFactorW] = useState<number[]>(issuerFactors.map(() => 10));
  const [useFactors, setUseFactors] = useState(false);
  const [factorsOpen, setFactorsOpen] = useState(false);

  const issuerPct = useMemo(() => {
    if (!useFactors) return comp.issuer;
    const tot = factorW.reduce((a, b) => a + b, 0) || 1;
    return Math.round(issuerFactors.reduce((s, f, i) => s + f.pct * factorW[i], 0) / tot);
  }, [useFactors, factorW, issuerFactors, comp.issuer]);

  const whatIf = useMemo(() => {
    const pcts = { issuer: issuerPct, issuance: comp.issuance, pricing: comp.pricing, economic: comp.economic };
    const totalW = w.issuer + w.issuance + w.pricing + w.economic || 1;
    const pct = Math.round((w.issuer * pcts.issuer + w.issuance * pcts.issuance + w.pricing * pcts.pricing + w.economic * pcts.economic) / totalW);
    return { pct, score: Math.round(pct * 5) };
  }, [w, issuerPct, comp]);

  const changed = w.issuer !== DEFAULT_COMPONENT_W.issuer || w.issuance !== DEFAULT_COMPONENT_W.issuance ||
    w.pricing !== DEFAULT_COMPONENT_W.pricing || w.economic !== DEFAULT_COMPONENT_W.economic || useFactors;

  const reset = () => { setW({ ...DEFAULT_COMPONENT_W }); setFactorW(issuerFactors.map(() => 10)); setUseFactors(false); };

  const band = scoreBand(whatIf.pct);
  const bandColor = band === 'Strong' ? '#34D399' : band === 'Adequate' ? '#FBBF24' : '#FB7185';

  return (
    <div className="glass-card p-5">
      <div className="flex items-center justify-between mb-1 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={16} style={{ color: '#2DD4BF' }} />
          <h3 className="t-h3 text-primary-text">Adjust weightage</h3>
        </div>
        <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.3)' }}>
          Upgraded plan
        </span>
      </div>
      <p className="t-caption mb-4">Re-weights the existing component grades to a what-if score. It does not re-score the issuer.</p>

      <div className="grid sm:grid-cols-[1fr_200px] gap-5">
        <div className="space-y-3">
          <Slider label="Fundamental (Issuer)" value={w.issuer} color="#2DD4BF" onChange={v => setW(s => ({ ...s, issuer: v }))} />
          <Slider label="Issuance" value={w.issuance} color="#38BDF8" onChange={v => setW(s => ({ ...s, issuance: v }))} />
          <Slider label="Pricing" value={w.pricing} color="#34D399" onChange={v => setW(s => ({ ...s, pricing: v }))} />
          <Slider label="Economic & Sector" value={w.economic} color="#FBBF24" onChange={v => setW(s => ({ ...s, economic: v }))} />

          {/* Issuer factor weights (optional) */}
          <button
            onClick={() => setFactorsOpen(o => !o)}
            className="flex items-center gap-1.5 t-label text-muted-text hover:text-primary-text transition-colors pt-1"
            aria-expanded={factorsOpen}
          >
            {factorsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />} Issuer factor weights
          </button>
          {factorsOpen && (
            <div className="space-y-2.5 pt-1">
              {issuerFactors.map((f, i) => (
                <Slider
                  key={f.name}
                  label={f.name}
                  value={factorW[i]}
                  color={gradeBarColor(gradeForPct(f.pct))}
                  onChange={v => { setUseFactors(true); setFactorW(arr => arr.map((x, j) => (j === i ? v : x))); }}
                />
              ))}
              <p className="t-caption">Adjusting factor weights recomputes the Issuer % (currently {issuerPct}%).</p>
            </div>
          )}
        </div>

        {/* What-if result */}
        <div className="rounded-xl p-4 flex flex-col items-center justify-center text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <span className="t-eyebrow">What-if Total Score</span>
          <span className="t-metric text-3xl mt-1" style={{ color: bandColor }}>{whatIf.score}<span className="text-sm text-muted-text font-normal">/500</span></span>
          <span className="font-mono-nums text-xs text-muted-text mt-1">{whatIf.pct}% · {band}</span>
          <span className="t-caption mt-2">Published: {scaled.score}/500 · {scaled.pct}%</span>
          <span className="text-[10px] mt-2 px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,191,36,0.12)', color: '#FBBF24' }}>What-if — not the published score</span>
          {changed && (
            <button onClick={reset} className="mt-3 inline-flex items-center gap-1.5 t-label text-muted-text hover:text-primary-text transition-colors">
              <RotateCcw size={13} /> Reset to model default
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
