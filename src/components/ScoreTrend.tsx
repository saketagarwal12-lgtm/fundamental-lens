import { useState } from 'react';
import { ComposedChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart as LineIcon } from 'lucide-react';
import type { ScorePoint500 } from '../data/score';
import type { PricePoint } from '../data/reports';

type Period = '3M' | '6M' | '12M' | 'All';
const PERIODS: Period[] = ['3M', '6M', '12M', 'All'];

interface Row extends ScorePoint500 { price?: number; }

const Dot = (props: { cx?: number; cy?: number; payload?: Row }) => {
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

const TrendTooltip = ({ active, payload, max = 500, showPrice = false }: {
  active?: boolean;
  payload?: Array<{ payload: Row }>;
  max?: number;
  showPrice?: boolean;
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="rounded-xl p-4 max-w-xs" style={{ background: 'rgba(15,35,38,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(20px)' }}>
      <p className="font-medium text-primary-text text-sm">{d.month}</p>
      <p className="font-mono-nums font-bold text-lg" style={{ color: '#2DD4BF' }}>{d.score} <span className="text-xs text-muted-text font-normal">/ {max}</span></p>
      {showPrice && d.price != null && (
        <p className="font-mono-nums text-sm" style={{ color: '#38BDF8' }}>₹{d.price} <span className="text-xs text-muted-text font-normal">share price</span></p>
      )}
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
  price?: PricePoint[];   // illustrative mock share price (₹) — listed entities only
  badge?: string;         // e.g. "Listed · NSE/BSE · SPANDANA"
}

export const ScoreTrend: React.FC<Props> = ({ data, title = 'Fundamental Score — trend', height = 200, max = 500, price, badge }) => {
  const [period, setPeriod] = useState<Period>('12M');
  const [showPrice, setShowPrice] = useState(true);
  const hasPrice = !!price && price.length > 0;

  const n = period === '3M' ? 3 : period === '6M' ? 6 : period === '12M' ? 12 : data.length;
  const sliced = data.slice(-n);
  const priceByMonth = new Map((price ?? []).map(p => [p.month, p.price]));
  const rows: Row[] = sliced.map(p => ({ ...p, price: priceByMonth.get(p.month) }));

  const vals = rows.map(d => d.score);
  const step = max <= 200 ? 5 : 10;
  const pad = max <= 200 ? 8 : 15;
  const lo = Math.max(0, Math.floor((Math.min(...vals) - pad) / step) * step);
  const hi = Math.min(max, Math.ceil((Math.max(...vals) + pad) / step) * step);

  const pVals = rows.map(d => d.price).filter((v): v is number => v != null);
  const pLo = pVals.length ? Math.floor((Math.min(...pVals) - 20) / 10) * 10 : 0;
  const pHi = pVals.length ? Math.ceil((Math.max(...pVals) + 20) / 10) * 10 : 100;
  const priceOn = hasPrice && showPrice;

  return (
    <div className="glass-card p-4 h-full flex flex-col">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="font-semibold text-primary-text text-sm">{title}</h3>
          {badge && (
            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(56,189,248,0.12)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.25)' }}>
              {badge}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {hasPrice && (
            <button
              onClick={() => setShowPrice(v => !v)}
              aria-pressed={showPrice}
              className="inline-flex items-center gap-1.5 text-[12px] font-medium px-2.5 py-1 rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              style={showPrice
                ? { background: 'rgba(56,189,248,0.15)', color: '#38BDF8', border: '1px solid rgba(56,189,248,0.3)' }
                : { background: 'transparent', color: '#9CB3B1', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              <LineIcon size={12} /> Share price (₹)
            </button>
          )}
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
      </div>
      <ResponsiveContainer width="100%" height={height}>
        <ComposedChart data={rows} margin={{ top: 10, right: priceOn ? 6 : 10, bottom: 0, left: -10 }}>
          <defs>
            <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#2DD4BF" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#2DD4BF" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.07)" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CB3B1' }} axisLine={false} tickLine={false} />
          <YAxis yAxisId="score" domain={[lo, hi]} tick={{ fontSize: 11, fill: '#9CB3B1' }} axisLine={false} tickLine={false} width={42} />
          {priceOn && (
            <YAxis yAxisId="price" orientation="right" domain={[pLo, pHi]} tick={{ fontSize: 11, fill: '#38BDF8' }} axisLine={false} tickLine={false} width={44} />
          )}
          <Tooltip content={<TrendTooltip max={max} showPrice={priceOn} />} />
          <Area
            yAxisId="score"
            type="monotone" dataKey="score" stroke="#2DD4BF" strokeWidth={2.5} fill="url(#trendGrad)"
            dot={(props) => { const { key, ...rest } = props as { key?: string }; return <Dot key={key} {...rest} />; }}
            activeDot={{ r: 6, fill: '#2DD4BF' }}
          />
          {priceOn && (
            <Line yAxisId="price" type="monotone" dataKey="price" stroke="#38BDF8" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: '#38BDF8' }} />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      <p className="text-[11px] text-muted-text mt-1.5">
        Hover a point with an arrow to see why the score moved.
        {hasPrice && <span> Share price is illustrative mock data.</span>}
      </p>
    </div>
  );
};
