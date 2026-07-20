import type { CovenantStatus } from '../data/covenants';
import { COVENANT_STATUS_COLOUR } from '../data/covenants';

// Proximity to breach — computed, not authored. Distinct from the covenant's
// authored quality grade, which says how protective the threshold is.

const HINT: Record<CovenantStatus, string> = {
  Breach: 'The reported actual is the wrong side of the threshold.',
  Tight: 'Within ~10% of the threshold — little room before breach.',
  Moderate: 'Roughly 10–25% of headroom to the threshold.',
  Comfortable: 'More than ~25% of headroom to the threshold.',
};

export const CovenantStatusChip: React.FC<{ status: CovenantStatus; compact?: boolean }> = ({ status, compact }) => {
  const c = COVENANT_STATUS_COLOUR[status];
  return (
    <span
      title={HINT[status]}
      className={`inline-flex items-center rounded-full font-semibold border ${compact ? 'px-1.5 py-0.5 text-[10px]' : 'px-2.5 py-0.5 text-[11px]'}`}
      style={{ background: `${c}22`, color: c, borderColor: `${c}55` }}
    >
      {status}
    </span>
  );
};
