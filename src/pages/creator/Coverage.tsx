import { useState } from 'react';
import { Plus, Edit3, Eye, Archive, Search, Filter } from 'lucide-react';
import { companies } from '../../data/companies';
import { ScoreRing } from '../../components/ScoreRing';

const statusMap: Record<string, string> = {
  krazybee: 'published',
  saral: 'published',
  northpoint: 'in-review',
  finora: 'draft',
  vaikha: 'in-progress',
};

const statusStyle = (s: string): React.CSSProperties =>
  s === 'published' ? { background: 'rgba(52,211,153,0.15)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)' } :
  s === 'in-review' ? { background: 'rgba(45,212,191,0.15)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.3)' } :
  s === 'draft' ? { background: 'rgba(251,191,36,0.15)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.3)' } :
  { background: 'rgba(255,255,255,0.06)', color: '#9CB3B1', border: '1px solid rgba(255,255,255,0.1)' };

export const Coverage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  const filtered = companies.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || statusMap[c.id] === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="p-6 page-fade max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-primary-text">Coverage Universe</h1>
          <p className="text-sm text-muted-text mt-0.5">
            {companies.length} issuers · {companies.filter(c => statusMap[c.id] === 'published').length} published
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg btn-gradient text-sm"
        >
          <Plus size={15} /> Add Coverage
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-text" />
          <input
            type="text"
            placeholder="Search issuers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 text-sm rounded-lg focus:outline-none text-primary-text"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Filter size={13} className="text-muted-text" />
          <div className="pill-track flex gap-1">
            {['all', 'published', 'in-review', 'draft', 'in-progress'].map(s => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={statusFilter === s ? 'pill-active px-3 py-1.5' : 'pill-inactive px-3 py-1.5'}
              >
                {s === 'all' ? 'All' : s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coverage table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
              <th className="text-left px-5 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Issuer</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Score</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Ext. Rating</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Analyst</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr
                key={c.id}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <td className="px-5 py-4">
                  <p className="font-medium text-primary-text">{c.name}</p>
                  <p className="text-xs text-muted-text mt-0.5">{c.sector} · {c.hq}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <ScoreRing score={c.healthScore} size={44} strokeWidth={4} showLabel={false} />
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs text-primary-text">{c.externalRating}</span>
                  <p className="text-[10px] text-muted-text mt-0.5">{c.ratingAgency}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span
                    className="text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide"
                    style={statusStyle(statusMap[c.id])}
                  >
                    {statusMap[c.id]?.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs text-muted-text">
                    {['R. Mehta', 'P. Iyer', 'T. Nair', 'S. Kapoor', 'A. Sharma'][i]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 justify-end">
                    <button
                      className="p-1.5 rounded text-muted-text transition-colors"
                      title="View"
                      onMouseEnter={e => (e.currentTarget.style.color = '#E9F3F1')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#9CB3B1')}
                    >
                      <Eye size={14} />
                    </button>
                    <button
                      className="p-1.5 rounded text-muted-text transition-colors"
                      title="Edit"
                      onMouseEnter={e => (e.currentTarget.style.color = '#2DD4BF')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#9CB3B1')}
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="p-1.5 rounded text-muted-text transition-colors"
                      title="Archive"
                      onMouseEnter={e => (e.currentTarget.style.color = '#FBBF24')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#9CB3B1')}
                    >
                      <Archive size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Coverage Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative glass-card-elevated w-full max-w-lg p-8 page-fade">
            <h2 className="text-lg font-semibold text-primary-text mb-5">Add New Coverage</h2>
            <div className="space-y-4">
              {[
                { label: 'Company Name', placeholder: 'e.g. ABC Finance Limited', type: 'text' },
                { label: 'Sector', placeholder: 'e.g. NBFC – Gold Loans', type: 'text' },
                { label: 'CIN / Registration No.', placeholder: 'e.g. U65910MH2010PLC123456', type: 'text' },
                { label: 'Primary Analyst', placeholder: 'Assign analyst', type: 'text' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-medium text-muted-text mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none text-primary-text"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-lg text-sm font-medium btn-outline-glass"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-lg btn-gradient text-sm font-semibold"
              >
                Create & Start Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
