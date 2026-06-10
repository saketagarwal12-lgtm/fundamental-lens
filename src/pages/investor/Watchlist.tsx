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
          <h1 className="text-xl font-semibold text-ink">Watchlist</h1>
          <p className="text-sm text-muted mt-0.5">Track issuers outside your active portfolio</p>
        </div>
        <button
          onClick={() => setShowAdd(v => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-deep transition-colors"
        >
          <Plus size={15} /> Add Issuer
        </button>
      </div>

      {showAdd && (
        <div className="mb-6 bg-white rounded-xl border border-hairline p-5">
          <h3 className="font-semibold text-[#23262C] mb-3">Search coverage universe</h3>
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
            <input
              autoFocus
              type="text"
              placeholder="Type an issuer name…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-hairline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
            />
          </div>
          {searchResults.length > 0 && (
            <div className="mt-3 space-y-2">
              {searchResults.map(c => (
                <button
                  key={c.id}
                  onClick={() => addToWatchlist(c.id)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-lg border border-hairline hover:border-brand/30 hover:bg-brand-tint transition-colors"
                >
                  <div className="text-left">
                    <p className="text-sm font-medium text-[#23262C]">{c.name}</p>
                    <p className="text-xs text-muted">{c.sector} · {c.externalRating}</p>
                  </div>
                  <span className="flex items-center gap-1 text-xs text-brand font-medium">
                    <Star size={13} /> Watch
                  </span>
                </button>
              ))}
            </div>
          )}
          {search.length > 1 && searchResults.length === 0 && (
            <p className="mt-3 text-sm text-muted text-center py-4">No un-watched issuers found for "{search}"</p>
          )}
        </div>
      )}

      {watched.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-hairline p-12 text-center">
          <Star size={36} className="mx-auto text-muted/40 mb-3" />
          <p className="text-muted">Your watchlist is empty. Add issuers to monitor them.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {watched.map(c => (
            <div key={c.id} className="bg-white rounded-xl border border-hairline p-5 hover:border-brand/30 transition-colors">
              <div className="flex items-start gap-4">
                <ScoreRing score={c.healthScore} size={56} strokeWidth={5} showLabel={false} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-semibold text-[#23262C] text-sm leading-tight">{c.name}</h3>
                      <p className="text-xs text-muted mt-0.5">{c.sector} · {c.hq}</p>
                    </div>
                    <button onClick={() => remove(c.id)} className="text-muted hover:text-[#B5524A] transition-colors shrink-0">
                      <X size={15} />
                    </button>
                  </div>
                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <span className="text-xs px-2 py-0.5 rounded bg-paper border border-hairline text-muted">{c.externalRating}</span>
                    <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                      c.recommendation === 'Subscribe' ? 'bg-[#2F8A5F]/10 text-[#2F8A5F]' :
                      c.recommendation === 'Avoid' ? 'bg-[#B5524A]/10 text-[#B5524A]' :
                      'bg-[#C08A2E]/10 text-[#C08A2E]'
                    }`}>{c.recommendation}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => navigate(`/app/company/${c.id}`)}
                className="mt-4 w-full py-2 rounded-lg border border-hairline text-xs font-medium text-[#23262C] hover:bg-paper hover:border-brand/30 transition-colors"
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
