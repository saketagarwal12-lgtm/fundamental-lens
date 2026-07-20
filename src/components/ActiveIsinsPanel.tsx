import { useNavigate } from 'react-router-dom';
import { ArrowRight, Scale, ShieldCheck } from 'lucide-react';
import { getIsinsForIssuer, getIsinScore } from '../data/isins';
import { IllustrativeBadge } from './IllustrativeBadge';

// The issuer's ISINs, compact. Lets the user iterate between instruments of the
// same issuer — Fundamental is shared, everything else is per-ISIN.

interface Props {
  issuerId: string;
  /** Highlighted as "current" — the ISIN being viewed, if any. */
  currentIsin?: string;
}

const Cell: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div className="min-w-0">
    <p className="text-[10px] text-muted-text mb-0.5">{label}</p>
    <p className="text-xs font-mono-nums text-primary-text truncate">{value}</p>
  </div>
);

export const ActiveIsinsPanel: React.FC<Props> = ({ issuerId, currentIsin }) => {
  const navigate = useNavigate();
  const list = getIsinsForIssuer(issuerId);

  if (!list.length) {
    return (
      <div className="glass-card p-5">
        <p className="text-sm text-muted-text">No instruments on record for this issuer.</p>
      </div>
    );
  }

  const implicit = list.length === 1 && list[0].implicit;

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div>
          <h3 className="t-h3 text-primary-text">Active ISINs</h3>
          <p className="text-xs text-muted-text mt-1 max-w-2xl">
            {implicit
              ? 'Issuer-level coverage — a single instrument synthesized from the issuer report. Per-ISIN Issuance, Pricing and covenants are not yet authored.'
              : 'The Fundamental Score is shared across every ISIN below. Issuance, Pricing, covenants — and therefore Total Score and Rating — are assessed per instrument.'}
          </p>
        </div>
        {list.length > 1 && (
          <button
            onClick={() => navigate(`/app/compare-isins/${issuerId}`)}
            className="btn-gradient px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shrink-0"
          >
            <Scale size={13} /> Compare ISINs
          </button>
        )}
      </div>

      <div className="space-y-2">
        {list.map(i => {
          const s = getIsinScore(i.isin);
          const isCurrent = currentIsin ? i.isin.toUpperCase() === currentIsin.toUpperCase() : false;
          return (
            <button
              key={i.isin}
              onClick={() => navigate(`/app/isin/${i.isin}`)}
              aria-current={isCurrent ? 'true' : undefined}
              className="w-full text-left rounded-xl p-4 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
              style={{
                background: isCurrent ? 'rgba(45,212,191,0.08)' : 'rgba(255,255,255,0.03)',
                border: isCurrent ? '1px solid rgba(45,212,191,0.4)' : '1px solid rgba(255,255,255,0.08)',
                boxShadow: isCurrent ? '0 0 16px rgba(45,212,191,0.15)' : 'none',
              }}
            >
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="font-mono-nums text-sm font-semibold text-primary-text">{i.isin}</span>
                {isCurrent && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ background: 'rgba(45,212,191,0.15)', color: '#2DD4BF' }}>Viewing</span>
                )}
                {i.illustrative && <IllustrativeBadge compact />}
                {i.assessed === false && (
                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded" style={{ background: 'rgba(156,179,177,0.15)', color: '#9CB3B1' }}>Not yet assessed</span>
                )}
                {i.secured && i.seniority === 'senior' && (
                  <span className="text-[9px] font-medium px-1.5 py-0.5 rounded inline-flex items-center gap-1" style={{ background: 'rgba(52,211,153,0.12)', color: '#34D399' }}>
                    <ShieldCheck size={9} /> Senior secured
                  </span>
                )}
                <ArrowRight size={13} className="ml-auto text-muted-text shrink-0" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Cell label="Coupon" value={i.coupon != null ? `${i.coupon.toFixed(2)}%` : '—'} />
                <Cell label="Current YTM" value={i.ytmCurrent != null ? <span style={{ color: '#2DD4BF' }}>{i.ytmCurrent.toFixed(2)}%</span> : '—'} />
                <Cell label="Residual tenor" value={i.residualTenor ?? '—'} />
                <Cell label="Issue size" value={i.issueSize != null ? `₹${i.issueSize} cr` : '—'} />
                <Cell label="Rating" value={i.externalRating ?? '—'} />
                <Cell
                  label="Total (this ISIN)"
                  value={s
                    ? <span><span className="font-semibold" style={{ color: '#2DD4BF' }}>{s.total}</span><span className="text-muted-text">/500 · R{s.rating}</span></span>
                    : <span className="text-muted-text">—</span>}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
