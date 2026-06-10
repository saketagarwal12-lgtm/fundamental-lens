interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  label?: string;
}

export const ScoreRing: React.FC<Props> = ({ score, size = 80, strokeWidth = 7, showLabel = true, label }) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - score / 100);
  const color = score >= 70 ? '#2F8A5F' : score >= 55 ? '#C08A2E' : '#B5524A';
  const fontSize = size * 0.21;
  return (
    <div className="relative inline-flex flex-col items-center gap-1">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }} aria-hidden>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E4E5E0" strokeWidth={strokeWidth} />
          <circle
            cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.8s cubic-bezier(0.4,0,0.2,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-mono-nums font-bold leading-none" style={{ fontSize, color }}>{score}%</span>
          {showLabel && <span className="text-[9px] text-muted mt-0.5 leading-none">Health</span>}
        </div>
      </div>
      {label && <span className="text-xs text-muted font-medium">{label}</span>}
    </div>
  );
};
