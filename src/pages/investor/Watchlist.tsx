import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, Plus, Search, X } from 'lucide-react';
import { companies } from '../../data/companies';
import { ScoreRing } from '../../components/ScoreRing';

export const Watchlist: React.FC = () => {
  const navigate = useNavigate();
  const [watchlist, setWatchlist] = useState<string[]>(['krazybee', 'saral']);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  const watched = companies.filter(c => watchlist.includes(c.id));
  const searchResults = search.length > 1
    ? companies.filter(c => !watchlist.includes(c.id) && c.name.toLowerCase().includes(search.toLowerCase()))
    : [];

  const addToWatchlist = (id: string) => {
    setWatchlist(w => [...w, id]);
    setSearch('');
    setShowAdd(false);
  };

  const remove = (id: string) => setWatchlist(w => w.filter(x => x !== id));

  return (
    <div className="p-6 page-fade max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-primary-text">Watchlist</h1>
          <p className="text-sm text-muted-text mt-0.5">Track issuers outside your active portfolio</p>
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg btn-gradient text-sm"
        >
          <Plus size={15} /> Add Issuer
        </button>
      </div>

      {showAdd && (
        <div className="mb-6 glass-card p-5">
          <h3 className="font-semibold text-primary-text mb-3">Search coverage universe</h3>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
            <input
              autoFocus
              type="text"
              placeholder="Type an issuer name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-lg text-sm focus:outline-none text-primary-text"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-3 space-y-2">
              {searchResults.map(c => (
                <button
                  key={c.id}
                  onClick={() => addToWatchlist(c.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(45,212,191,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-primary-text">{c.name}</p>
                    <p className="text-xs text-muted-text">{c.sector} · {c.externalRating}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#2DD4BF' }}>
                    <Star size={13} /> Watch
                  </span>
                </button>
              ))}
            </div>
          )}
          {search.length > 1 && searchResults.length === 0 && (
            <p className="mt-3 text-sm text-muted-text text-center py-4">No un-watched issuers found for "{search}"</p>
          )}
        </div>
      )}

      {watched.length === 0 ? (
        <div className="glass-card p-12 text-center" style={{ border: '1px dashed rgba(255,255,255,0.12)' }}>
          <Star size={36} className="mx-auto mb-3" style={{ color: 'rgba(156,179,177,0.3)' }} />
          <p className="text-muted-text">Your watchlist is empty. Add issuers to monitor them.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {watched.map(c => (
            <div key={c.id} className="glass-card p-5 transition-all duration-200">
              <div className="flex items-start gap-4">
                <ScoreRing score={c.healthScore} size={56} strokeWidth={5} showLabel={false} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-primary-text text-sm leading-tight">{c.name}</h3>
                      <p className="text-xs text-muted-text mt-0.5">{c.sector} · {c.hq}</p>
                    </div>
                    <button onClick={() => remove(c.id)} className="text-muted-text hover:text-[#FB7185] transition-colors shrink-0">
                      <X size={15} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span
                      className="text-xs px-2 py-0.5 rounded text-muted-text"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >{c.externalRating}</span>
                    <span
                      className="text-xs px-2 py-0.5 rounded font-medium"
                      style={c.recommendation === 'Subscribe' ? { background: 'rgba(52,211,153,0.15)', color: '#34D399' } :
                        c.recommendation === 'Avoid' ? { background: 'rgba(251,113,133,0.15)', color: '#FB7185' } :
                        { background: 'rgba(251,191,36,0.15)', color: '#FBBF24' }}
                    >{c.recommendation}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/app/company/${c.id}`)}
                className="mt-4 w-full py-2 rounded-lg text-xs font-medium text-primary-text transition-colors"
                style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(45,212,191,0.08)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
              >
                View Full Report
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
