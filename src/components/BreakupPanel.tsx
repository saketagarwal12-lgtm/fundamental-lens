import { ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import type { BreakupRow } from '../data/financialAnalysis';

// A reusable breakup: chart + table. Drives product mix, LTV buckets, geography,
// sectoral and loan-book granularity (§3e). Authored shares rendered as given.

const VIZ = ['#2DD4BF', '#38BDF8', '#34D399', '#FBBF24', '#FB923C', '#A78BFA', '#E9F3F1', '#0EA5A0', '#60A5FA', '#F472B6'];

interface Props {
  title: string;
  rows: BreakupRow[];
  chart?: 'donut' | 'bar';
  /** Column header for the absolute value column; omit to show share only. */
  valueLabel?: string;
  valuePrefix?: string;
}

export const BreakupPanel: React.FC<Props> = ({ title, rows, chart = 'donut', valueLabel, valuePrefix = '₹' }) => {
  if (!rows.length) return null;

  return (
    <div className="glass-card p-5">
      <h3 className="t-h3 text-primary-text mb-4">{title}</h3>
      <div className="grid sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)] gap-5 items-center">
        <div style={{ height: 170 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chart === 'donut' ? (
              <PieChart>
                <Pie data={rows} dataKey="share" nameKey="label" innerRadius={45} outerRadius={72} paddingAngle={2} stroke="none">
                  {rows.map((_, i) => <Cell key={i} fill={VIZ[i % VIZ.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'rgba(12,32,34,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, fontSize: 12 }}
                  formatter={(v: number | string, _n, p) => [`${v}%`, (p as { payload?: BreakupRow }).payload?.label ?? '']} />
              </PieChart>
            ) : (
              <BarChart data={rows} margin={{ top: 4, right: 8, bottom: 0, left: -14 }}>
                <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#9CB3B1' }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={40} />
                <YAxis tick={{ fontSize: 10, fill: '#9CB3B1' }} axisLine={false} tickLine={false} unit="%" width={34} />
                <Tooltip contentStyle={{ background: 'rgba(12,32,34,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, fontSize: 12 }} formatter={(v: number | string) => [`${v}%`, 'Share']} />
                <Bar dataKey="share" radius={[3, 3, 0, 0]}>
                  {rows.map((_, i) => <Cell key={i} fill={VIZ[i % VIZ.length]} />)}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <th className="pb-1.5 pr-3 t-eyebrow font-medium">Segment</th>
                {valueLabel && <th className="pb-1.5 pr-3 t-eyebrow font-medium text-right">{valueLabel}</th>}
                <th className="pb-1.5 t-eyebrow font-medium text-right">Share</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.label} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-1.5 pr-3">
                    <span className="inline-flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: VIZ[i % VIZ.length] }} />
                      <span className="text-primary-text/90 truncate" title={r.label}>{r.label}</span>
                    </span>
                  </td>
                  {valueLabel && <td className="py-1.5 pr-3 text-right font-mono-nums text-muted-text">{valuePrefix}{r.value.toLocaleString('en-IN')}</td>}
                  <td className="py-1.5 text-right font-mono-nums text-primary-text">{r.share}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
