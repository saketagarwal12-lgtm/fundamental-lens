import { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { ScorePoint500 } from '../data/score';

type Period = '3M' | '6M' | '12M' | 'All';
const PERIODS: Period[] = ['3M', '6M', '12M', 'All'];

const Dot = (props: { cx?: number; cy?: number; payload?: ScorePoint500 }) => {
  const { cx = 0, cy = 0, payload } = props;
  if (!payload?.event) return <circle cx={cx} cy={cy} r={3} fill="#2DD4BF" />;
  const color = payload.event.direction === 'up' ? '#34D399' : '#FB7185';
  return (
    <g>
      <circle cx={cx} cy={cy} r={6} fill={color} opacity={0.2} />
      <circle cx={cx} cy={cy} r={4} fill={color} />
    </g>
  );
};

const TrendTooltip = ({ active, payload, max = 500 }: {
  active?: boolean;
  payload?: Array<{ payload: ScorePoint500 }>;
  max?: number;
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl p-4 max-w-xs" style={{ background: 'rgba(15,35,38,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
      <p className="font-medium text-primary-text text-sm">{d.month}</p>
      <p className="font-mono-nums font-bold text-lg" style={{ color: '#2DD4BF' }}>{d.score} <span className="text-xs text-muted-text font-normal">/ {max}</span></p>
      {d.event && (
        <div className="mt-2 pt-2 flex gap-2 items-start" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <span style={{ color: d.event.direction === 'up' ? '#34D399' : '#FB7185' }} className="text-lg leading-none">
            {d.event.direction === 'up' ? '↑' : '↓'}
          </span>
          <p className="text-xs text-muted-text leading-relaxed">{d.event.reason}</p>
        </div>
      )}
    </div>
  );
};

interface Props {
  data: ScorePoint500[];
  title?: string;
  height?: number;
  max?: number;
}

export const ScoreTrend: React.FC<Props> = ({ data, title = 'Fundamental Score — trend', height = 200, max = 500 }) => {
  const [period, setPeriod] = useState<Period>('12M');
  const sliced =
    period === '3M' ? data.slice(-3) :
    period === '6M' ? data.slice(-6) :
    period === '12M' ? data.slice(-12) : data;

  const vals = sliced.map(d => d.score);
  const step = max <= 200 ? 5 : 10;
  const pad = max <= 200 ? 8 : 15;
  const lo = Math.max(0, Math.floor((Math.min(...vals) - pad) / step) * step);
  const hi = Math.min(max, Math.ceil((Math.max(...vals) + pad) / step) * step);

  return (
    <div className="glass-card p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h3 className="font-semibold text-primary-text text-sm">{title}</h3>
        {/* Segmented pill selector */}
        <div
          className="inline-flex items-center gap-1 p-1 rounded-full shrink-0"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          role="tablist"
          aria-label="Trend period"
        >
          {PERIODS.map(p => {
            const on = period === p;
            return (
              <button
                key={p}
                role="tab"
                aria-selected={on}
                onClick={() => setPeriod(p)}
                className="px-3 py-1 rounded-full text-[12px] font-medium leading-none transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                style={on
                  ? { background: 'linear-gradient(135deg,#2DD4BF,#22D3EE)', color: '#0B1F20', boxShadow: '0 2px 10px rgba(45,212,191,0.35)' }
                  : { background: 'transparent', color: '#9CB3B1' }}
              >
                {p}
              </button>
            );
          })}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={sliced} margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CB3B1' }} axisLine={false} tickLine={false} />
          <YAxis domain={[lo, hi]} tick={{ fontSize: 11, fill: '#9CB3B1' }} axisLine={false} tickLine={false} width={42} />
          <Tooltip content={<TrendTooltip max={max} />} />
          <Area
            type="monotone" dataKey="score" stroke="#2DD4BF" strokeWidth={2.5} fill="url(#trendGrad)"
            dot={(props) => { const { key, ...rest } = props as { key?: string }; return <Dot key={key} {...rest} />; }}
            activeDot={{ r: 6, fill: '#2DD4BF' }}
          />
        </AreaChart>
      </ResponsiveContainer>
      <p className="text-[11px] text-muted-text mt-2">Hover a point with an arrow to see why the score moved.</p>
    </div>
  );
};
