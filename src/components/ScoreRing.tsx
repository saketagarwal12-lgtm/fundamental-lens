interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
  animated?: boolean;
}

export const ScoreRing: React.FC<Props> = ({ score, size = 80, strokeWidth = 10, showLabel = true, label, animated = true }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const gradId = `ring-grad-${size}-${score}`;
  const glowId = `ring-glow-${size}`;
  const fontSize = size * 0.2;

  return (
    <div className="relative inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: `drop-shadow(0 0 ${size * 0.1}px rgba(45,212,191,0.4))` }}>
          <defs>
            <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2DD4BF" />
              <stop offset="100%" stopColor="#22D3EE" />
            </linearGradient>
            <filter id={glowId}>
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
          {/* Track */}
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.07)" strokeWidth={strokeWidth} />
          {/* Progress */}
          <circle
            cx={size/2} cy={size/2} r={r} fill="none"
            stroke={`url(#${gradId})`} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: animated ? 'stroke-dashoffset 1s cubic-bezier(0.4,0,0.2,1)' : 'none' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className="font-mono-nums font-bold leading-none text-glow-teal"
            style={{ fontSize, color: '#2DD4BF' }}
          >
            {score}%
          </span>
          {showLabel && <span style={{ fontSize: size * 0.1 }} className="text-muted-text mt-0.5 leading-none">Score</span>}
        </div>
      </div>
      {label && <span className="text-xs text-muted-text font-medium">{label}</span>}
    </div>
  );
};
