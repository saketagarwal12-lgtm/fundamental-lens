import { ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { gradeBarColor } from './GradeBadge';
import type { Grade } from '../data/types';

export interface RatingLensPillar {
  label: string;
  pct: number;
  weight: number;   // deck pillar weight: Issuer 40 · Pricing 30 · Issuance 20 · Economic 10
  grade: Grade;
}

interface Props {
  // Left — the agency letter (the "input")
  agency?: string;          // e.g. 'Rating agency' or 'CRISIL'
  agencyLetter: string;     // e.g. 'BBB'
  agencyNote?: string;      // 'one letter · quarterly · issuer-paid'
  // Right — the Fundamental Lens score (the "product")
  score: number;            // e.g. 172
  max?: number;             // default 200
  delta?: number;           // e.g. +6 (score movement over the period)
  flNote?: string;          // 'live · signal-driven · comparable'
  pillars: RatingLensPillar[];
  compact?: boolean;        // tighter padding when embedded in a page section
}

// "See inside the rating" — an agency letter (input) → the Fundamental Lens score
// broken into its four weighted pillars (product). Reused on the landing page and the
// company page's External Ratings section.
export const RatingLens: React.FC<Props> = ({
  agency = 'Rating agency',
  agencyLetter,
  agencyNote = 'one letter · quarterly · issuer-paid',
  score,
  max = 200,
  delta,
  flNote = 'live · signal-driven · comparable',
  pillars,
  compact,
}) => {
  const pad = compact ? 'p-5' : 'p-6';
  const DeltaIcon = delta != null && delta < 0 ? TrendingDown : TrendingUp;
  const deltaColor = delta != null && delta < 0 ? '#FB7185' : '#34D399';

  return (
    <div className="grid lg:grid-cols-[220px_auto_1fr] gap-4 items-stretch">
      {/* Left — the agency letter */}
      <div className={`glass-card ${pad} flex flex-col justify-center text-center`}>
        <p className="t-eyebrow mb-2">{agency}</p>
        <p className="font-mono-nums font-bold leading-none text-primary-text" style={{ fontSize: 52 }}>{agencyLetter}</p>
        <p className="t-caption mt-3 leading-snug">{agencyNote}</p>
        <span className="mt-3 mx-auto text-[10px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(148,163,184,0.14)', color: '#94A3B8', border: '1px solid rgba(148,163,184,0.25)' }}>
          An input, not the product
        </span>
      </div>

      {/* Arrow */}
      <div className="hidden lg:flex items-center justify-center">
        <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.25)' }}>
          <ArrowRight size={18} />
        </div>
      </div>

      {/* Right — the Fundamental Lens score, broken into four weighted pillars */}
      <div className={`glass-card-elevated ${pad}`} style={{ borderColor: 'rgba(45,212,191,0.25)' }}>
        <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
          <div>
            <p className="t-eyebrow mb-2" style={{ color: '#2DD4BF' }}>Fundamental Lens · Fundamental Score</p>
            <div className="flex items-baseline gap-2">
              <span className="font-mono-nums font-bold leading-none text-glow-teal" style={{ fontSize: 44, color: '#2DD4BF' }}>{score}</span>
              <span className="font-mono-nums text-muted-text" style={{ fontSize: 18 }}>/ {max}</span>
              {delta != null && (
                <span className="inline-flex items-center gap-0.5 text-sm font-semibold" style={{ color: deltaColor }}>
                  <DeltaIcon size={15} />{delta > 0 ? '+' : ''}{delta}
                </span>
              )}
            </div>
            <p className="t-caption mt-2">{flNote}</p>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0" style={{ background: 'rgba(45,212,191,0.14)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.3)' }}>
            The product
          </span>
        </div>

        <div className="space-y-2.5">
          {pillars.map(p => {
            const color = gradeBarColor(p.grade);
            return (
              <div key={p.label} className="flex items-center gap-3">
                <span className="t-label text-primary-text w-40 shrink-0 truncate">{p.label}</span>
                <span className="t-caption w-12 shrink-0 font-mono-nums" title="Pillar weight in the Total Score">{p.weight}%</span>
                <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full" style={{ width: `${p.pct}%`, background: color, boxShadow: `0 0 8px ${color}66` }} />
                </div>
                <span className="font-mono-nums text-[11px] w-9 text-right shrink-0" style={{ color }}>{p.pct}%</span>
              </div>
            );
          })}
        </div>
        <p className="t-caption mt-3">Pillar weights: Issuer 40% · Pricing 30% · Issuance 20% · Economic &amp; Sector 10%.</p>
      </div>
    </div>
  );
};
