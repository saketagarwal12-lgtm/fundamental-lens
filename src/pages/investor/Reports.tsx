import { useNavigate } from 'react-router-dom';
import { FileText, Download, ExternalLink, Clock } from 'lucide-react';
import { companies } from '../../data/companies';

const reports = [
  { companyId: 'krazybee', date: 'Jun 2026', type: 'Full Fundamental Research Report', pages: 38, new: true },
  { companyId: 'saral', date: 'May 2026', type: 'Full Fundamental Research Report', pages: 31, new: false },
  { companyId: 'northpoint', date: 'May 2026', type: 'Full Fundamental Research Report', pages: 34, new: false },
  { companyId: 'finora', date: 'Apr 2026', type: 'Full Fundamental Research Report', pages: 29, new: false },
  { companyId: 'vaikha', date: 'Mar 2026', type: 'Full Fundamental Research Report', pages: 26, new: false },
];

// (recStyle removed — recommendations are instrument-level, §1d.)

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const getCompany = (id: string) => companies.find(c => c.id === id);

  return (
    <div className="p-6 page-fade max-w-4xl mx-auto">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-primary-text">Research Reports</h1>
        <p className="text-sm text-muted-text mt-0.5">Full fundamental research reports for all covered issuers</p>
      </div>

      <div className="space-y-3">
        {reports.map(r => {
          const co = getCompany(r.companyId);
          if (!co) return null;
          return (
            <div
              key={r.companyId}
              className="glass-card p-5 flex items-center gap-4"
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' }}
              >
                <FileText size={18} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-primary-text text-sm">{co.name}</h3>
                  {r.new && (
                    <span
                      className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide"
                      style={{ background: 'linear-gradient(135deg,#2DD4BF,#22D3EE)', color: '#0B1F20' }}
                    >New</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-text flex-wrap">
                  <span>{r.type}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {r.date}</span>
                  <span>{r.pages} pages</span>
                  {/* Issuer-level listing — no recommendation (§1d). */}
                  <span className="font-mono-nums">{co.sector} · {co.subSector}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate(`/app/company/${r.companyId}`)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-primary-text transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(45,212,191,0.08)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                >
                  <ExternalLink size={12} /> View
                </button>
                <button
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-muted-text transition-colors"
                  style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.03)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.03)')}
                >
                  <Download size={12} /> PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div
        className="mt-6 p-5 rounded-xl text-sm"
        style={{ background: 'rgba(45,212,191,0.08)', border: '1px solid rgba(45,212,191,0.2)' }}
      >
        <p className="font-medium text-brand-teal mb-1">Coverage expanding</p>
        <p className="text-muted-text text-xs leading-relaxed">
          New reports are published as coverage is added. Subscribe to alerts to be notified when new issuers are added to the platform.
        </p>
      </div>
    </div>
  );
};
