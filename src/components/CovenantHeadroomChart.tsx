import { ResponsiveContainer, ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Dot } from 'recharts';
import type { CovenantCondition } from '../data/covenants';
import { covenantHeadroomSeries, activeThreshold, nextStep } from '../data/covenants';

// Reported actual against the covenanted threshold, over time.
// The threshold is a step function when the covenant has a schedule, so it is
// plotted as its own line rather than a single reference line — otherwise a
// step-down covenant looks like it was always at today's level.

interface Props {
  condition: CovenantCondition;
  height?: number;
}

const AXIS = { stroke: '#6F8584', fontSize: 10 };

export const CovenantHeadroomChart: React.FC<Props> = ({ condition, height = 180 }) => {
  const series = covenantHeadroomSeries(condition);
  if (!series.length) {
    return <p className="text-xs text-muted-text py-4">No reported actuals — this condition cannot be monitored from published data.</p>;
  }

  const current = activeThreshold(condition);
  const step = nextStep(condition);
  const scheduled = (condition.schedule?.length ?? 0) > 0;

  const data = series.map(p => ({
    period: p.period,
    actual: p.value,
    threshold: p.threshold ?? null,
    breached: p.breached,
  }));

  return (
    <div>
      <div style={{ width: '100%', height }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
            <CartesianGrid stroke="rgba(255,255,255,0.06)" vertical={false} />
            <XAxis dataKey="period" tick={AXIS} axisLine={false} tickLine={false} />
            <YAxis tick={AXIS} axisLine={false} tickLine={false} width={44} unit={condition.unit === '₹ cr' ? '' : condition.unit} />
            <Tooltip
              contentStyle={{ background: 'rgba(12,32,34,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, fontSize: 12 }}
              labelStyle={{ color: '#9CB3B1' }}
              formatter={(v, name) => [v == null ? '—' : `${v}${condition.unit}`, name === 'actual' ? 'Reported actual' : 'Covenant threshold']}
            />
            {/* Threshold: stepped when scheduled, flat otherwise */}
            <Line
              type="stepAfter" dataKey="threshold" name="threshold"
              stroke="#FB7185" strokeWidth={1.5} strokeDasharray="5 4" dot={false} isAnimationActive={false}
            />
            <Line
              type="monotone" dataKey="actual" name="actual"
              stroke="#2DD4BF" strokeWidth={2} isAnimationActive={false}
              dot={props => {
                // Breached points are called out — a covenant that was breached in
                // the past is a fact the trend should not quietly smooth over.
                const { key, payload, ...rest } = props as { key?: string; payload?: { breached?: boolean } };
                const breached = payload?.breached;
                return <Dot key={key} {...rest} r={breached ? 4.5 : 3} fill={breached ? '#E11D48' : '#2DD4BF'} stroke="none" />;
              }}
            />
            {!scheduled && current != null && (
              <ReferenceLine y={current} stroke="#FB7185" strokeDasharray="5 4" strokeWidth={1.5} />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center gap-4 flex-wrap mt-2">
        <span className="flex items-center gap-1.5 text-[10px] text-muted-text">
          <span className="w-4 h-0.5 rounded" style={{ background: '#2DD4BF' }} /> Reported actual
        </span>
        <span className="flex items-center gap-1.5 text-[10px] text-muted-text">
          <span className="w-4 h-0.5 rounded" style={{ background: '#FB7185' }} /> Covenant threshold
        </span>
        {data.some(d => d.breached) && (
          <span className="flex items-center gap-1.5 text-[10px]" style={{ color: '#E11D48' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#E11D48' }} /> Breached at the time
          </span>
        )}
        {step && (
          <span className="text-[10px] ml-auto" style={{ color: '#FBBF24' }}>
            Tightens to {step.threshold}{condition.unit} {step.label}
          </span>
        )}
      </div>
    </div>
  );
};
