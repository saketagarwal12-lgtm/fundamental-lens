interface Props {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  delta?: string;
  highlight?: boolean;
}

export const MetricCard: React.FC<Props> = ({ label, value, unit, trend, delta, highlight }) => {
  const trendColor = trend === 'up' ? '#34D399' : trend === 'down' ? '#FB7185' : '#9CB3B1';
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '';
  return (
    <div
      className={`glass-card p-4 transition-all duration-200 ${highlight ? 'border-brand-teal/20' : ''}`}
      style={highlight ? { borderColor: 'rgba(45,212,191,0.25)', background: 'rgba(45,212,191,0.08)' } : {}}
    >
      <p className="text-xs text-muted-text mb-1 leading-snug">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="font-mono-nums text-xl font-bold text-primary-text">{value}</span>
        {unit && <span className="text-xs text-muted-text">{unit}</span>}
      </div>
      {delta && <p className="text-xs mt-1 font-medium" style={{ color: trendColor }}>{arrow} {delta}</p>}
    </div>
  );
};
