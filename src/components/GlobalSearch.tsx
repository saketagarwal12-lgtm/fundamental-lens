import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Building2, Receipt } from 'lucide-react';
import { companies } from '../data/companies';
import { allIsins, getIsinScore } from '../data/isins';
import { sectorMeta } from '../data/sectors';

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

// Subsequence match, so "krzy" finds "KrazyBee" and "gold" finds the sector.
const fuzzy = (haystack: string, needle: string): boolean => {
  const h = haystack.toLowerCase();
  const n = needle.toLowerCase().trim();
  if (!n) return false;
  if (h.includes(n)) return true;
  let i = 0;
  for (const ch of h) { if (ch === n[i]) i++; if (i === n.length) return true; }
  return false;
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

    const companyHits: Hit[] = companies
      .filter(c => fuzzy(c.name, term) || fuzzy(c.subSector, term) || fuzzy(c.sector, term) || fuzzy(c.id, term))
      .map(c => ({
        kind: 'company' as const,
        id: c.id,
        title: c.name,
        subtitle: `${c.sector} · ${c.subSector}`,
        trailing: c.externalRating,
      }));

    // ISINs match on prefix/exact only — a fuzzy ISIN match is noise, not a feature.
    const upper = term.toUpperCase();
    const isinHits: Hit[] = allIsins()
      .filter(i => i.isin.toUpperCase().startsWith(upper) || fuzzy(companies.find(c => c.id === i.issuerId)?.name ?? '', term))
      .map(i => {
        const issuer = companies.find(c => c.id === i.issuerId);
        const s = getIsinScore(i.isin);
        return {
          kind: 'isin' as const,
          id: i.isin,
          title: i.isin,
          subtitle: `${issuer?.name ?? i.issuerId} · ${sectorMeta(i.sector).name}${i.residualTenor ? ` · ${i.residualTenor}` : ''}`,
          trailing: s ? `${s.total}/500 · R${s.rating}` : 'Not yet assessed',
          illustrative: i.illustrative,
        };
      });

    return [...companyHits.slice(0, 5), ...isinHits.slice(0, 6)];
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

  const groups: { label: string; icon: typeof Building2; items: Hit[] }[] = [
    { label: 'Companies', icon: Building2, items: hits.filter(h => h.kind === 'company') },
    { label: 'Instruments', icon: Receipt, items: hits.filter(h => h.kind === 'isin') },
  ].filter(g => g.items.length > 0);

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
          className="absolute top-full mt-1 left-0 right-0 rounded-lg z-50 overflow-hidden max-h-[70vh] overflow-y-auto"
          style={{ background: 'rgba(18,42,44,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(18px)', boxShadow: '0 16px 40px rgba(0,0,0,0.5)' }}
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
