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

const statusStyle: Record<string, string> = {
  published: 'bg-[#2F8A5F]/10 text-[#2F8A5F]',
  'in-review': 'bg-brand/10 text-brand',
  draft: 'bg-[#C08A2E]/10 text-[#C08A2E]',
  'in-progress': 'bg-paper text-muted border border-hairline',
};

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
          <h1 className="text-xl font-semibold text-ink">Coverage Universe</h1>
          <p className="text-sm text-muted mt-0.5">{companies.length} issuers · {companies.filter(c => statusMap[c.id] === 'published').length} published</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-deep transition-colors"
        >
          <Plus size={15} /> Add Coverage
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-5 flex-wrap">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            type="text"
            placeholder="Search issuers…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-8 pr-4 py-2 text-sm border border-hairline rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/40 bg-white"
          />
        </div>
        <div className="flex items-center gap-1.5 text-xs">
          <Filter size={13} className="text-muted" />
          {['all', 'published', 'in-review', 'draft', 'in-progress'].map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors ${statusFilter === s ? 'bg-brand text-white' : 'bg-white border border-hairline text-muted hover:text-[#23262C]'}`}
            >
              {s === 'all' ? 'All' : s.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </button>
          ))}
        </div>
      </div>

      {/* Coverage table */}
      <div className="bg-white rounded-xl border border-hairline overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-hairline bg-paper/50">
              <th className="text-left px-5 py-3 text-xs font-medium text-muted">Issuer</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-muted">Score</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted">Ext. Rating</th>
              <th className="text-center px-4 py-3 text-xs font-medium text-muted">Status</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-muted">Analyst</th>
              <th className="text-right px-5 py-3 text-xs font-medium text-muted">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} className="border-b border-hairline last:border-0 hover:bg-paper/30 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-[#23262C]">{c.name}</p>
                  <p className="text-xs text-muted mt-0.5">{c.sector} · {c.hq}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <ScoreRing score={c.healthScore} size={44} strokeWidth={4} showLabel={false} />
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs text-[#23262C]">{c.externalRating}</span>
                  <p className="text-[10px] text-muted mt-0.5">{c.ratingAgency}</p>
                </td>
                <td className="px-4 py-4 text-center">
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wide ${statusStyle[statusMap[c.id]] ?? 'text-muted'}`}>
                    {statusMap[c.id]?.replace('-', ' ')}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-xs text-muted">
                    {['R. Mehta', 'P. Iyer', 'T. Nair', 'S. Kapoor', 'A. Sharma'][i]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1 justify-end">
                    <button className="p-1.5 rounded hover:bg-paper text-muted hover:text-[#23262C] transition-colors" title="View">
                      <Eye size={14} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-paper text-muted hover:text-brand transition-colors" title="Edit">
                      <Edit3 size={14} />
                    </button>
                    <button className="p-1.5 rounded hover:bg-paper text-muted hover:text-[#C08A2E] transition-colors" title="Archive">
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
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 page-fade">
            <h2 className="text-lg font-semibold text-ink mb-5">Add New Coverage</h2>
            <div className="space-y-4">
              {[
                { label: 'Company Name', placeholder: 'e.g. ABC Finance Limited', type: 'text' },
                { label: 'Sector', placeholder: 'e.g. NBFC – Gold Loans', type: 'text' },
                { label: 'CIN / Registration No.', placeholder: 'e.g. U65910MH2010PLC123456', type: 'text' },
                { label: 'Primary Analyst', placeholder: 'Assign analyst', type: 'text' },
              ].map(f => (
                <div key={f.label}>
                  <label className="block text-xs font-medium text-muted mb-1.5">{f.label}</label>
                  <input
                    type={f.type}
                    placeholder={f.placeholder}
                    className="w-full px-3 py-2.5 border border-hairline rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-lg border border-hairline text-sm font-medium hover:bg-paper transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-deep transition-colors"
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
