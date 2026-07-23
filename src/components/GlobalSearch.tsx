import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Receipt } from 'lucide-react';
import { companies } from '../data/companies';
import { allIsins, getIsinScore, getIssuerFundamental } from '../data/isins';
import { sectorMeta } from '../data/sectors';
import { externalRatingLabel, isPlaceholder } from '../data/display';

// Global search — matches a company by name/sector (fuzzy) or an ISIN (prefix/exact).
// Results are grouped (Companies / Instruments) and keyboard-navigable: ↑/↓ move,
// Enter opens, Esc closes.

interface Hit {
  kind: 'company' | 'isin';
  id: string;          // route target id
  title: string;
  subtitle: string;
  trailing?: string;
  illustrative?: boolean;
}

// Company matching is a genuine substring/token match on name, sector or sub-sector.
//
// A subsequence matcher was too loose (§8): "INE" matched Avanti, Keertana, Spandana
// and Midland because their letters appear in order somewhere in the name. An ISIN
// query must not drag in unrelated companies.
const tokenMatch = (haystack: string, needle: string): boolean => {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase().trim();
  if (!n) return false;
  if (h.includes(n)) return true;
  // Also match on word starts, so "keer fin" finds "Keertana Finserv".
  const words = h.split(/[^a-z0-9]+/).filter(Boolean);
  return n.split(/\s+/).every(part => words.some(w => w.startsWith(part)));
};

const matchesCompany = (c: { name: string; sector: string; subSector: string; id: string }, term: string): boolean =>
  tokenMatch(c.name, term) || tokenMatch(c.sector, term) || tokenMatch(c.subSector, term) || tokenMatch(c.id, term);

/** Does the query look like an ISIN or an ISIN fragment? Those rank Instruments first. */
const looksLikeIsin = (term: string): boolean => {
  const t = term.trim().toUpperCase();
  return /^INE/.test(t) || (/^[A-Z0-9]{4,}$/.test(t) && /\d/.test(t));
};

export const GlobalSearch: React.FC<{ placeholder?: string; autoFocus?: boolean }> = ({
  placeholder = 'Search a company or ISIN…', autoFocus,
}) => {
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(0);
  const boxRef = useRef<HTMLDivElement>(null);

  const hits = useMemo<Hit[]>(() => {
    const term = q.trim();
    if (term.length < 2) return [];

    // Company rows are ISSUER-LEVEL ONLY (§1d): no Total Score, Rating or
    // recommendation — those require a specific instrument.
    const companyHits: Hit[] = companies
      .filter(c => matchesCompany(c, term))
      .map(c => {
        const f = getIssuerFundamental(c.id);
        return {
          kind: 'company' as const,
          id: c.id,
          title: c.name,
          subtitle: `${c.sector} · ${c.subSector}${isPlaceholder(c.hq) ? '' : ` · ${c.hq}`}`,
          trailing: f ? `Fundamental ${f.score}/200` : externalRatingLabel(c.externalRating),
        };
      });

    // ISINs match on prefix/exact, or via a real match on their issuer's name.
    const upper = term.toUpperCase();
    const isinHits: Hit[] = allIsins()
      .filter(i => {
        const issuer = companies.find(c => c.id === i.issuerId);
        return i.isin.toUpperCase().includes(upper) || (issuer ? matchesCompany(issuer, term) : false);
      })
      .map(i => {
        const issuer = companies.find(c => c.id === i.issuerId);
        const s = getIsinScore(i.isin);
        return {
          kind: 'isin' as const,
          id: i.isin,
          title: i.isin,
          subtitle: `${issuer?.name ?? i.issuerId} · ${sectorMeta(i.sector).name}${i.residualTenor ? ` · ${i.residualTenor}` : ''}`,
          // Instrument rows keep Total/Rating — they identify a specific instrument (§1d).
          trailing: s ? `${s.total}/500 · R${s.rating}` : 'Not yet assessed',
          illustrative: i.illustrative,
        };
      });

    // An ISIN-shaped query ranks Instruments first (§8).
    return looksLikeIsin(term)
      ? [...isinHits.slice(0, 8), ...companyHits.slice(0, 3)]
      : [...companyHits.slice(0, 5), ...isinHits.slice(0, 6)];
  }, [q]);

  useEffect(() => setCursor(0), [q]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const go = (hit: Hit) => {
    navigate(hit.kind === 'company' ? `/app/company/${hit.id}` : `/app/isin/${hit.id}`);
    setQ(''); setOpen(false);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { setOpen(false); return; }
    if (!hits.length) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setCursor(c => (c + 1) % hits.length); setOpen(true); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setCursor(c => (c - 1 + hits.length) % hits.length); setOpen(true); }
    if (e.key === 'Enter' && open && hits[cursor]) { e.preventDefault(); go(hits[cursor]); }
  };

  // Group order follows the ranking, so an ISIN query leads with Instruments (§8).
  const groups: { label: string; icon: typeof Building2; items: Hit[] }[] =
    (hits[0]?.kind === 'isin'
      ? [
          { label: 'Instruments', icon: Receipt, items: hits.filter(h => h.kind === 'isin') },
          { label: 'Companies', icon: Building2, items: hits.filter(h => h.kind === 'company') },
        ]
      : [
          { label: 'Companies', icon: Building2, items: hits.filter(h => h.kind === 'company') },
          { label: 'Instruments', icon: Receipt, items: hits.filter(h => h.kind === 'isin') },
        ]
    ).filter(g => g.items.length > 0);

  const showPanel = open && q.trim().length >= 2;

  return (
    <div ref={boxRef} className="relative w-full">
      <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text pointer-events-none" />
      <input
        type="search"
        role="combobox"
        aria-expanded={showPanel}
        aria-controls="global-search-results"
        aria-label="Search a company or ISIN"
        autoComplete="off"
        autoFocus={autoFocus}
        placeholder={placeholder}
        value={q}
        onChange={e => { setQ(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="w-full pl-9 pr-4 py-2 text-sm rounded-lg focus:outline-none transition-colors"
        style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#E9F3F1' }}
      />

      {showPanel && (
        <div
          id="global-search-results"
          role="listbox"
          // Fully opaque: a translucent panel let the trend chart bleed through (§7.1).
          className="overlay-surface absolute top-full mt-1 left-0 right-0 overflow-hidden max-h-[70vh] overflow-y-auto"
          style={{ zIndex: 'var(--z-dropdown)' as unknown as number }}
        >
          {!hits.length && <p className="px-4 py-3 text-xs text-muted-text">No company or ISIN matches “{q}”.</p>}

          {groups.map(g => (
            <div key={g.label}>
              <div className="px-3 py-1.5 flex items-center gap-1.5" style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <g.icon size={11} className="text-muted-text" />
                <span className="t-eyebrow text-[10px]">{g.label}</span>
              </div>
              {g.items.map(hit => {
                const idx = hits.indexOf(hit);
                const active = idx === cursor;
                return (
                  <button
                    key={`${hit.kind}-${hit.id}`}
                    role="option"
                    aria-selected={active}
                    onMouseEnter={() => setCursor(idx)}
                    onMouseDown={() => go(hit)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                    style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', background: active ? 'rgba(45,212,191,0.1)' : 'transparent' }}
                  >
                    <div className="min-w-0 flex-1">
                      <p className={`text-sm font-medium truncate ${hit.kind === 'isin' ? 'font-mono-nums' : ''} text-primary-text`}>
                        {hit.title}
                        {hit.illustrative && (
                          <span className="ml-2 text-[9px] font-semibold px-1.5 py-0.5 rounded align-middle" style={{ background: 'rgba(251,191,36,0.15)', color: '#FBBF24' }}>
                            Illustrative
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-text truncate">{hit.subtitle}</p>
                    </div>
                    {hit.trailing && (
                      <span className="text-[11px] font-mono-nums text-muted-text shrink-0">{hit.trailing}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
