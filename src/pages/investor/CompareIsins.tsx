import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Scale, Check, ArrowLeft, Building2 } from 'lucide-react';
import { IsinCompareGrid } from '../../components/IsinCompareGrid';
import { IllustrativeBadge } from '../../components/IllustrativeBadge';
import { getIsinsForIssuer } from '../../data/isins';
import { companies } from '../../data/companies';

// ISIN vs ISIN, within one issuer.
//
// The whole point of this surface: the Fundamental Score cannot differ here, so
// everything you see IS the difference the instrument makes.

export const CompareIsins: React.FC = () => {
  const { issuerId = '' } = useParams<{ issuerId: string }>();
  const navigate = useNavigate();

  const all = useMemo(() => getIsinsForIssuer(issuerId), [issuerId]);
  const issuer = companies.find(c => c.id === issuerId);
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    // Prefer assessed ISINs — a column of "not yet assessed" teaches nothing.
    const assessed = all.filter(i => i.assessed !== false).map(i => i.isin);
    const seed = (assessed.length >= 2 ? assessed : all.map(i => i.isin)).slice(0, 4);
    setSelected(seed);
  }, [all]);

  const chosen = selected.map(isin => all.find(i => i.isin === isin)).filter((x): x is NonNullable<typeof x> => !!x);

  const toggle = (isin: string) =>
    setSelected(sel => {
      if (sel.includes(isin)) return sel.length <= 1 ? sel : sel.filter(x => x !== isin);
      if (sel.length >= 4) return sel;
      return [...sel, isin];
    });

  if (!issuer) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4 p-8">
        <p className="text-muted-text">No issuer on record for “{issuerId}”.</p>
        <button onClick={() => navigate('/app/dashboard')} className="text-brand-teal hover:underline text-sm">Back to dashboard</button>
      </div>
    );
  }

  if (all.length < 2) {
    return (
      <div className="p-6 page-fade max-w-3xl mx-auto">
        <button onClick={() => navigate(`/app/company/${issuerId}`)} className="flex items-center gap-1.5 text-xs text-muted-text hover:text-brand-teal transition-colors mb-4">
          <ArrowLeft size={13} /> Back to {issuer.name}
        </button>
        <div className="glass-card p-10 text-center space-y-3">
          <p className="t-h3 text-primary-text">Only one instrument on record</p>
          <p className="t-body text-muted-text max-w-lg mx-auto">
            {issuer.name} has a single ISIN in coverage, so there is nothing to compare against yet.
            ISIN-vs-ISIN comparison needs at least two instruments from the same issuer.
          </p>
          <Link to={`/app/compare`} className="inline-block text-brand-teal hover:underline text-sm">
            Compare across issuers instead →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 page-fade">
      <button onClick={() => navigate(`/app/company/${issuerId}`)} className="flex items-center gap-1.5 text-xs text-muted-text hover:text-brand-teal transition-colors mb-4">
        <ArrowLeft size={13} /> Back to {issuer.name}
      </button>

      <div className="mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <Scale size={18} style={{ color: '#2DD4BF' }} />
          <h1 className="t-h1 text-primary-text">Compare ISINs</h1>
          <Link to={`/app/company/${issuerId}`} className="inline-flex items-center gap-1.5 text-sm text-brand-teal hover:underline">
            <Building2 size={14} /> {issuer.name}
          </Link>
        </div>
        <p className="t-lead mt-1 max-w-3xl">
          Same issuer, different instruments. The Fundamental Score is identical by construction — so every
          difference below comes from the instrument itself: how it is priced, how it is secured, and what the
          covenants actually oblige.
        </p>
      </div>

      {/* Selector */}
      <div className="glass-card p-5 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="t-eyebrow mr-1">Instruments ({chosen.length}/4)</span>
          {all.map(i => {
            const on = selected.includes(i.isin);
            const disabled = !on && selected.length >= 4;
            return (
              <button key={i.isin} onClick={() => toggle(i.isin)} disabled={disabled}
                aria-pressed={on}
                className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors inline-flex items-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                style={on
                  ? { background: 'rgba(45,212,191,0.15)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.35)' }
                  : { background: 'rgba(255,255,255,0.05)', color: '#9CB3B1', border: '1px solid rgba(255,255,255,0.1)' }}>
                {on && <Check size={12} />}
                <span className="font-mono-nums">{i.isin}</span>
                {i.illustrative && <IllustrativeBadge compact />}
                {i.assessed === false && <span className="text-[9px] opacity-70">· not assessed</span>}
              </button>
            );
          })}
        </div>
      </div>

      {chosen.length < 2 ? (
        <div className="glass-card p-10 text-center"><p className="t-lead">Pick at least two instruments to compare.</p></div>
      ) : (
        <IsinCompareGrid isins={chosen} sharedFundamental onRemove={chosen.length > 2 ? toggle : undefined} />
      )}
    </div>
  );
};
