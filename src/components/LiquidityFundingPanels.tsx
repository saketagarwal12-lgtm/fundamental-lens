import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Layers, Info } from 'lucide-react';
import type { BorrowingProfile, AlmSummary } from '../data/financialAnalysis';

// Liquidity & Funding side panels (§3d). Borrowing profile is populated by funding
// TYPE composition (always available); lender-LEVEL rows appear only when authored,
// otherwise the panel is explicit that lender detail is pending source population.

const VIZ = ['#2DD4BF', '#38BDF8', '#34D399', '#FBBF24', '#FB923C', '#A78BFA'];

export const BorrowingProfilePanel: React.FC<{ profile: BorrowingProfile }> = ({ profile }) => (
  <div className="glass-card p-5">
    <div className="flex items-center justify-between mb-4 gap-2 flex-wrap">
      <h3 className="t-h3 text-primary-text flex items-center gap-2"><Layers size={15} style={{ color: '#2DD4BF' }} /> Borrowing profile</h3>
      {profile.top10Concentration > 0 && (
        <span className="text-[11px] text-muted-text">Top-10 lender concentration <span className="font-mono-nums text-primary-text">{profile.top10Concentration}%</span></span>
      )}
    </div>

    <div className="grid sm:grid-cols-[minmax(0,160px)_minmax(0,1fr)] gap-5 items-center">
      <div style={{ height: 150 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={profile.byFundingType} dataKey="pct" nameKey="type" innerRadius={40} outerRadius={64} paddingAngle={2} stroke="none">
              {profile.byFundingType.map((_, i) => <Cell key={i} fill={VIZ[i % VIZ.length]} />)}
            </Pie>
            <Tooltip contentStyle={{ background: 'rgba(12,32,34,0.96)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, fontSize: 12 }}
              formatter={(v: number | string, _n, p) => [`${v}%`, (p as { payload?: { type: string } }).payload?.type ?? '']} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="space-y-1.5">
        {profile.byFundingType.map((f, i) => (
          <div key={f.type} className="flex items-center gap-2 text-xs">
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: VIZ[i % VIZ.length] }} />
            <span className="text-muted-text flex-1 truncate">{f.type}</span>
            <span className="font-mono-nums text-primary-text">{f.pct}%</span>
          </div>
        ))}
      </div>
    </div>

    {profile.lenders?.length ? (
      <div className="overflow-x-auto mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-left" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th className="pb-1.5 pr-3 t-eyebrow font-medium">#</th>
              <th className="pb-1.5 pr-3 t-eyebrow font-medium">Lender</th>
              <th className="pb-1.5 pr-3 t-eyebrow font-medium">Type</th>
              <th className="pb-1.5 pr-3 t-eyebrow font-medium">Funding</th>
              <th className="pb-1.5 pr-3 t-eyebrow font-medium text-right">Outstanding</th>
              <th className="pb-1.5 t-eyebrow font-medium text-right">Share</th>
            </tr>
          </thead>
          <tbody>
            {profile.lenders.map(l => (
              <tr key={l.sl} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <td className="py-1.5 pr-3 text-muted-text">{l.sl}</td>
                <td className="py-1.5 pr-3 text-primary-text">{l.lender}</td>
                <td className="py-1.5 pr-3 text-muted-text">{l.lenderType}</td>
                <td className="py-1.5 pr-3 text-muted-text">{l.fundingType}</td>
                <td className="py-1.5 pr-3 text-right font-mono-nums text-primary-text">₹{l.outstanding.toLocaleString('en-IN')} cr</td>
                <td className="py-1.5 text-right font-mono-nums text-primary-text">{l.proportion}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
      <p className="text-[11px] text-muted-text mt-4 pt-3 flex items-start gap-1.5" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <Info size={12} className="shrink-0 mt-0.5" /> Composition by funding type is on record; lender-level detail is pending source-document population.
      </p>
    )}
  </div>
);

export const AlmSummaryPanel: React.FC<{ alm: AlmSummary }> = ({ alm }) => {
  const stat = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between text-xs">
      <span className="text-muted-text">{label}</span>
      <span className="font-mono-nums text-primary-text">{value}</span>
    </div>
  );
  return (
    <div className="glass-card p-5">
      <h3 className="t-h3 text-primary-text mb-4">ALM &amp; liquidity</h3>
      <div className="space-y-2.5">
        {stat('Average asset tenor', `${alm.assetTenorMonths}m`)}
        {stat('Average liability tenor', `${alm.liabilityTenorMonths}m`)}
        {stat('Liquidity coverage ratio (LCR)', <span className="text-brand-teal font-semibold">{alm.lcr}%</span>)}
        {alm.ccePctOf12mRepayments != null && stat('CCE / 12m repayments', `${alm.ccePctOf12mRepayments}%`)}
        {alm.topLenderConcentration && stat('Lender concentration', alm.topLenderConcentration)}
      </div>
      <p className="text-[11px] text-muted-text mt-3 pt-3 leading-relaxed" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {alm.cumulativeGapNote}
      </p>
      <p className="text-[10px] text-muted-text mt-2 flex items-start gap-1.5">
        <Info size={11} className="shrink-0 mt-0.5" /> Bucketed ALM (1–7d … 1826–3652d) with a cumulative-gap chart is pending source-document population.
      </p>
    </div>
  );
};
