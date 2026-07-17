import { FlaskConical } from 'lucide-react';

// §K4 — the fabricated demo ISIN must be unmistakable wherever it appears:
// its own page, the Active ISINs panel, search, and every comparison surface.

export const IllustrativeBadge: React.FC<{ compact?: boolean }> = ({ compact }) => (
  <span
    title="Illustrative — fabricated for demonstration. Not published research."
    className={`inline-flex items-center gap-1 rounded-full font-semibold border ${compact ? 'px-1.5 py-0.5 text-[9px]' : 'px-2.5 py-0.5 text-[11px]'}`}
    style={{ background: 'rgba(251,191,36,0.15)', color: '#FBBF24', borderColor: 'rgba(251,191,36,0.35)' }}
  >
    <FlaskConical size={compact ? 9 : 11} />
    {compact ? 'Illustrative' : 'Illustrative — not published research'}
  </span>
);

export const IllustrativeNotice: React.FC<{ children?: React.ReactNode }> = ({ children }) => (
  <div
    className="rounded-xl px-4 py-3 flex items-start gap-3"
    style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)' }}
  >
    <FlaskConical size={15} className="shrink-0 mt-0.5" style={{ color: '#FBBF24' }} />
    <p className="text-xs leading-relaxed" style={{ color: '#FBBF24' }}>
      {children ?? (
        <>
          <strong className="font-semibold">Illustrative — not published research.</strong>{' '}
          This instrument is fabricated for demonstration. Only the ISIN and its current YTM are real;
          the terms, covenants, collateral and pricing grades below are invented to show how two ISINs
          of the same issuer share a Fundamental Score while diverging on Issuance, Pricing and Total.
        </>
      )}
    </p>
  </div>
);
