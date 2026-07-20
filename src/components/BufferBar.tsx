import type { CovenantStatus } from '../data/covenants';
import { COVENANT_STATUS_COLOUR } from '../data/covenants';

interface Props {
  /** Distance to breach as a % of the threshold. Null when there is no reported actual. */
  bufferPct: number | null;
  status: CovenantStatus;
  breached?: boolean;
}

// How much of the way to breach we are. The bar fills with *remaining headroom*,
// so a short bar is a covenant close to biting. Capped at 100% so a wildly loose
// covenant doesn't render a misleadingly heroic bar.
export const BufferBar: React.FC<Props> = ({ bufferPct, status, breached }) => {
  const colour = COVENANT_STATUS_COLOUR[status];

  if (bufferPct === null) {
    return (
      <div className="h-1.5 rounded-full w-full" style={{ background: 'rgba(255,255,255,0.06)' }} title="No reported actual — not monitorable" />
    );
  }

  const width = breached ? 100 : Math.max(2, Math.min(100, bufferPct));

  return (
    <div
      className="h-1.5 rounded-full w-full overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.06)' }}
      title={breached ? 'Breached' : `${bufferPct}% headroom to the threshold`}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${width}%`,
          background: breached ? `repeating-linear-gradient(45deg, ${colour}, ${colour} 4px, transparent 4px, transparent 8px)` : colour,
          boxShadow: `0 0 8px ${colour}66`,
        }}
      />
    </div>
  );
};
