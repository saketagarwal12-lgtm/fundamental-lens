import { useNavigate } from 'react-router-dom';
import { FileText, Download, ExternalLink, Clock } from 'lucide-react';
import { companies } from '../../data/companies';

const reports = [
  { companyId: 'krazybee', date: 'Jun 2026', type: 'Full Credit Report', pages: 38, new: true },
  { companyId: 'saral', date: 'May 2026', type: 'Full Credit Report', pages: 31, new: false },
  { companyId: 'northpoint', date: 'May 2026', type: 'Full Credit Report', pages: 34, new: false },
  { companyId: 'finora', date: 'Apr 2026', type: 'Full Credit Report', pages: 29, new: false },
  { companyId: 'vaikha', date: 'Mar 2026', type: 'Full Credit Report', pages: 26, new: false },
];

export const Reports: React.FC = () => {
  const navigate = useNavigate();
  const getCompany = (id: string) => companies.find(c => c.id === id);

  return (
    <div className="p-6 page-fade max-w-4xl mx-auto">
      <div className="mb-7">
        <h1 className="text-xl font-semibold text-ink">Research Reports</h1>
        <p className="text-sm text-muted mt-0.5">Full credit research reports for all covered issuers</p>
      </div>

      <div className="space-y-3">
        {reports.map(r => {
          const co = getCompany(r.companyId);
          if (!co) return null;
          return (
            <div key={r.companyId} className="bg-white rounded-xl border border-hairline p-5 flex items-center gap-4 hover:border-brand/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-brand/10 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-brand" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-[#23262C] text-sm">{co.name}</h3>
                  {r.new && (
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-brand text-white uppercase tracking-wide">New</span>
                  )}
                </div>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted flex-wrap">
                  <span>{r.type}</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {r.date}</span>
                  <span>{r.pages} pages</span>
                  <span className={`font-medium ${
                    co.recommendation === 'Subscribe' ? 'text-[#2F8A5F]' :
                    co.recommendation === 'Avoid' ? 'text-[#B5524A]' : 'text-[#C08A2E]'
                  }`}>{co.recommendation}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => navigate(`/app/company/${r.companyId}`)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-hairline text-xs font-medium text-[#23262C] hover:bg-paper transition-colors"
                >
                  <ExternalLink size={12} /> View
                </button>
                <button className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-paper border border-hairline text-xs font-medium text-muted hover:text-[#23262C] transition-colors">
                  <Download size={12} /> PDF
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-5 bg-brand-tint rounded-xl border border-brand/20 text-sm">
        <p className="font-medium text-brand mb-1">Coverage expanding</p>
        <p className="text-muted text-xs leading-relaxed">
          New reports are published as coverage is added. Subscribe to alerts to be notified when new issuers are added to the platform.
        </p>
      </div>
    </div>
  );
};
