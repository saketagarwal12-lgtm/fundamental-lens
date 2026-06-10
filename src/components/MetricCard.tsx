interface Props {
  label: string;
  value: string | number;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  delta?: string;
  highlight?: boolean;
}

export const MetricCard: React.FC<Props> = ({ label, value, unit, trend, delta, highlight }) => {
  const trendColor = trend === 'up' ? 'text-[#2F8A5F]' : trend === 'down' ? 'text-[#B5524A]' : 'text-muted';
  const arrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '';
  return (
    <div className={`rounded-lg border p-4 ${highlight ? 'border-brand/30 bg-brand-tint' : 'border-hairline bg-white'}`}>
      <p className="text-xs text-muted mb-1 leading-snug">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="font-mono-nums text-xl font-semibold text-[#23262C]">{value}</span>
        {unit && <span className="text-xs text-muted">{unit}</span>}
      </div>
      {delta && <p className={`text-xs mt-1 ${trendColor}`}>{arrow} {delta}</p>}
    </div>
  );
};
