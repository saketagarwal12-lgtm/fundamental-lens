import type { YieldOverview } from '../data/reports';

interface Props {
  data: YieldOverview;
  compact?: boolean;
}

// Horizontal yield gauge: G-sec base → typical band → this issue marker.
export const YieldGauge: React.FC<Props> = ({ data, compact }) => {
  const { currentYtm, gsecBase, creditRiskPremium, rangeLow, rangeHigh } = data;
  // Scale: from a touch below gsec to a touch above the band high / current.
  const min = Math.floor(gsecBase - 0.5);
  const max = Math.ceil(Math.max(rangeHigh, currentYtm) + 0.5);
  const span = max - min || 1;
  const pos = (v: number) => `${((v - min) / span) * 100}%`;
  const bandLeft = ((rangeLow - min) / span) * 100;
  const bandWidth = ((rangeHigh - rangeLow) / span) * 100;

  return (
    <div className="glass-card p-5">
      <div className="flex items-end justify-between mb-5 flex-wrap gap-3">
        <div>
          <p className="text-xs text-muted-text uppercase tracking-wider mb-1">Current YTM</p>
          <p className="font-mono-nums font-bold text-3xl text-glow-teal" style={{ color: '#2DD4BF' }}>
            {currentYtm.toFixed(2)}%
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-text mb-1">Credit-risk premium over G-sec</p>
          <p className="font-mono-nums font-semibold text-lg text-primary-text">
            +{creditRiskPremium.toFixed(2)}%
          </p>
          <p className="text-[11px] text-muted-text">G-sec base {gsecBase.toFixed(2)}%</p>
        </div>
      </div>

      {/* Track */}
      <div className="relative h-10 mb-2">
        <div className="absolute inset-x-0 top-4 h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.07)' }} />
        {/* Typical band */}
        <div
          className="absolute top-4 h-2 rounded-full"
          style={{ left: `${bandLeft}%`, width: `${bandWidth}%`, background: 'rgba(45,212,191,0.35)' }}
        />
        {/* G-sec marker */}
        <div className="absolute top-2.5 flex flex-col items-center" style={{ left: pos(gsecBase), transform: 'translateX(-50%)' }}>
          <span className="w-0.5 h-5 rounded" style={{ background: '#9CB3B1' }} />
        </div>
        {/* This issue marker */}
        <div className="absolute top-1 flex flex-col items-center" style={{ left: pos(currentYtm), transform: 'translateX(-50%)' }}>
          <span
            className="w-3.5 h-3.5 rounded-full border-2"
            style={{ background: '#22D3EE', borderColor: '#0B1F20', boxShadow: '0 0 12px rgba(34,211,238,0.7)' }}
          />
        </div>
      </div>

      {!compact && (
        <div className="flex items-center justify-between text-[11px] text-muted-text mt-3 flex-wrap gap-2">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#22D3EE' }} /> This issue
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-2 rounded-full inline-block" style={{ background: 'rgba(45,212,191,0.35)' }} /> Typical {rangeLow}–{rangeHigh}%
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-0.5 h-3 inline-block" style={{ background: '#9CB3B1' }} /> G-sec {gsecBase}%
          </span>
        </div>
      )}
    </div>
  );
};
