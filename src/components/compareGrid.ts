// Shared rank-in-selection helpers for the comparison surfaces.
// Extracted from Compare.tsx so the issuer grid, the ISIN-vs-ISIN grid and the
// cross-issuer ISIN mode all highlight best/worst the same way.

export const recStyle = (rec: string): React.CSSProperties =>
  rec === 'Subscribe' ? { background: 'rgba(52,211,153,0.15)', color: '#34D399' } :
  rec === 'Avoid' ? { background: 'rgba(251,113,133,0.15)', color: '#FB7185' } :
  { background: 'rgba(251,191,36,0.15)', color: '#FBBF24' };

/** Best/worst index within a numeric row (nulls ignored) given a direction. */
export const rankExtremes = (vals: (number | null | undefined)[], better: 'high' | 'low') => {
  const idx = vals
    .map((v, i) => ({ v, i }))
    .filter((x): x is { v: number; i: number } => x.v !== null && x.v !== undefined);
  if (idx.length < 2) return { best: -1, worst: -1 };
  const sorted = [...idx].sort((a, b) => (better === 'high' ? b.v - a.v : a.v - b.v));
  // All-equal rows shouldn't crown a winner — it reads as a real difference when it isn't.
  if (sorted[0].v === sorted[sorted.length - 1].v) return { best: -1, worst: -1 };
  return { best: sorted[0].i, worst: sorted[sorted.length - 1].i };
};

export const cellRing = (i: number, best: number, worst: number): React.CSSProperties =>
  i === best ? { background: 'rgba(52,211,153,0.10)', boxShadow: 'inset 0 0 0 1px rgba(52,211,153,0.4)' } :
  i === worst ? { background: 'rgba(251,113,133,0.08)', boxShadow: 'inset 0 0 0 1px rgba(251,113,133,0.35)' } : {};
