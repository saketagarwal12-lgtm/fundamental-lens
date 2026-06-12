import { useCountUp } from './useCountUp';
import { scoreBand } from '../data/score';

interface Props {
  score: number;          // 0–500
  max?: number;           // default 500
  pct: number;            // 0–100
  rating?: number;        // 1 (best) … 10 (worst)
  size?: number;
  strokeWidth?: number;
  caption?: string;       // small label under the ring (e.g. "Fundamental Score")
}

// Large circular 0–500 gauge with teal→cyan gradient arc, glow, count-up + draw-in.
export const ScoreGauge: React.FC<Props> = ({
  score, max = 500, pct, rating, size = 184, strokeWidth = 14, caption = 'Fundamental Score',
}) => {
  const counted = useCountUp(score);
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const frac = Math.max(0, Math.min(1, score / max));
  const offset = circ * (1 - frac);
  const uid = `fg${size}-${score}`;
  const band = scoreBand(pct);
  const bandColor = band === 'Strong' ? '#34D399' : band === 'Adequate' ? '#FBBF24' : '#FB7185';

  return (
    <div className="inline-flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 ${Math.round(size * 0.08)}px rgba(45,212,191,0.45))` }}>
          <defs>
            <linearGradient id={uid} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
          </defs>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={`url(#${uid})`} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1.1s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="flex items-baseline gap-0.5">
            <span className="font-mono-nums font-bold leading-none text-glow-teal" style={{ fontSize: size * 0.26, color: '#2DD4BF' }}>
              {counted}
            </span>
            <span className="font-mono-nums text-muted-text leading-none" style={{ fontSize: size * 0.1 }}>/{max}</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="font-mono-nums text-xs" style={{ color: '#9CB3B1' }}>{pct}%</span>
            <span className="text-xs font-semibold" style={{ color: bandColor }}>{band}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-text">{caption}</span>
        {rating != null && rating > 0 && (
          <span
            className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.25)' }}
            title="Internal rating, 1 = best … 10 = worst"
          >
            Rating {rating}
          </span>
        )}
      </div>
    </div>
  );
};
