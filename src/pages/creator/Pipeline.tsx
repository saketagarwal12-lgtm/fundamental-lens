import { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, Clock, ChevronRight, X, Plus } from 'lucide-react';

const STAGES = [
  'Documents',
  'Capture',
  'Model',
  'Gaps',
  'Score',
  'Report',
  'Review',
  'Publish',
];

type StageStatus = 'done' | 'active' | 'blocked' | 'pending';

interface PipelineIssuer {
  id: string;
  name: string;
  sector: string;
  analyst: string;
  currentStage: number;
  stageStatuses: StageStatus[];
  blockedReason?: string;
  lastUpdated: string;
}

const pipelineData: PipelineIssuer[] = [
  {
    id: 'krazybee',
    name: 'KrazyBee Services Limited',
    sector: 'NBFC – Unsecured PL',
    analyst: 'R. Mehta',
    currentStage: 7,
    stageStatuses: ['done', 'done', 'done', 'done', 'done', 'done', 'active', 'pending'],
    lastUpdated: '2 hours ago',
  },
  {
    id: 'northpoint',
    name: 'Northpoint NBFC Limited',
    sector: 'NBFC – Vehicle Finance',
    analyst: 'S. Kapoor',
    currentStage: 5,
    stageStatuses: ['done', 'done', 'done', 'done', 'done', 'active', 'pending', 'pending'],
    lastUpdated: '1 day ago',
  },
  {
    id: 'saral',
    name: 'Saral Finance Limited',
    sector: 'NBFC – Gold Loans',
    analyst: 'P. Iyer',
    currentStage: 3,
    stageStatuses: ['done', 'done', 'done', 'blocked', 'pending', 'pending', 'pending', 'pending'],
    blockedReason: 'FY26 balance sheet not yet available. Waiting for MCA filing. Contact: IR team mailed 3 Jun.',
    lastUpdated: '3 days ago',
  },
  {
    id: 'finora',
    name: 'Finora Capital Limited',
    sector: 'NBFC – MSME',
    analyst: 'A. Sharma',
    currentStage: 2,
    stageStatuses: ['done', 'done', 'active', 'pending', 'pending', 'pending', 'pending', 'pending'],
    lastUpdated: '5 hours ago',
  },
  {
    id: 'vaikha',
    name: 'Vaikha Finserv Private Limited',
    sector: 'NBFC – Rural Microfinance',
    analyst: 'T. Nair',
    currentStage: 0,
    stageStatuses: ['active', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending', 'pending'],
    lastUpdated: '2 days ago',
  },
];

const gaps = [
  { id: 1, field: 'FY26 Balance Sheet', source: 'MCA / Annual Report', status: 'missing', notes: 'Emailed IR on 3 Jun. ETA: mid-Jun.' },
  { id: 2, field: 'Auditor confirmation (new)', source: 'RoC filing', status: 'partial', notes: 'New auditor name identified from interim disclosures. Formal appointment pending.' },
  { id: 3, field: 'NPA sub-classification breakdown', source: 'Investor Presentation', status: 'missing', notes: '' },
  { id: 4, field: 'ALM maturity profile (Dec 25)', source: 'RBI return / Debenture Trustee Report', status: 'obtained', notes: '' },
];

const StageIcon: React.FC<{ status: StageStatus }> = ({ status }) => {
  if (status === 'done') return <CheckCircle2 size={14} className="text-[#2F8A5F]" />;
  if (status === 'active') return <div className="w-3.5 h-3.5 rounded-full border-2 border-brand bg-brand/20" />;
  if (status === 'blocked') return <AlertCircle size={14} className="text-[#B5524A]" />;
  return <Circle size={14} className="text-hairline" />;
};

export const Pipeline: React.FC = () => {
  const [selected, setSelected] = useState<string | null>('saral');
  const selectedIssuer = pipelineData.find(p => p.id === selected);
  const blockedIssuer = pipelineData.find(p => p.id === 'saral');

  return (
    <div className="p-6 page-fade max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-ink">Research Pipeline</h1>
          <p className="text-sm text-muted mt-0.5">{pipelineData.length} issuers in progress</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand-deep transition-colors">
          <Plus size={15} /> New Issuer
        </button>
      </div>

      {/* Stage header */}
      <div className="bg-white rounded-t-xl border border-b-0 border-hairline px-5 py-3 overflow-x-auto">
        <div className="flex items-center gap-1 min-w-max">
          <div className="w-56 shrink-0 text-xs font-medium text-muted">Issuer</div>
          {STAGES.map((s, i) => (
            <div key={s} className="w-20 shrink-0 text-center">
              <span className="text-[10px] text-muted font-medium">{s}</span>
            </div>
          ))}
          <div className="w-24 shrink-0 text-xs font-medium text-muted pl-2">Analyst</div>
        </div>
      </div>

      {/* Pipeline rows */}
      <div className="bg-white rounded-b-xl border border-hairline overflow-hidden mb-6">
        {pipelineData.map((issuer, idx) => (
          <div key={issuer.id}>
            <button
              onClick={() => setSelected(selected === issuer.id ? null : issuer.id)}
              className={`w-full flex items-center gap-1 px-5 py-4 border-b border-hairline hover:bg-paper/50 transition-colors text-left overflow-x-auto ${selected === issuer.id ? 'bg-brand-tint/30' : ''}`}
            >
              <div className="w-56 shrink-0 min-w-0 pr-2">
                <p className="text-sm font-medium text-[#23262C] truncate">{issuer.name}</p>
                <p className="text-xs text-muted mt-0.5">{issuer.sector}</p>
              </div>
              {issuer.stageStatuses.map((status, si) => (
                <div key={si} className="w-20 shrink-0 flex justify-center">
                  <div className="relative flex items-center">
                    <StageIcon status={status} />
                    {si < STAGES.length - 1 && (
                      <div className={`absolute left-full w-16 h-px ${status === 'done' ? 'bg-[#2F8A5F]/30' : 'bg-hairline'}`} />
                    )}
                  </div>
                </div>
              ))}
              <div className="w-24 shrink-0 pl-2 flex items-center gap-2">
                <span className="text-xs text-muted">{issuer.analyst}</span>
                <ChevronRight size={13} className="text-muted ml-auto" />
              </div>
            </button>

            {/* Expanded gap panel for blocked issuer */}
            {selected === issuer.id && issuer.blockedReason && (
              <div className="border-b border-hairline bg-[#B5524A]/5 px-5 py-4">
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle size={16} className="text-[#B5524A] mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-[#B5524A]">Blocked at Gaps stage</p>
                    <p className="text-xs text-muted mt-0.5">{issuer.blockedReason}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="ml-auto text-muted hover:text-[#23262C]">
                    <X size={15} />
                  </button>
                </div>

                <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">Data Gaps</h4>
                <div className="space-y-2">
                  {gaps.map(g => (
                    <div key={g.id} className="flex items-start gap-3 bg-white rounded-lg border border-hairline p-3">
                      <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${g.status === 'obtained' ? 'bg-[#2F8A5F]' : g.status === 'partial' ? 'bg-[#C08A2E]' : 'bg-[#B5524A]'}`} />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-[#23262C]">{g.field}</p>
                        <p className="text-xs text-muted">Source: {g.source}</p>
                        {g.notes && <p className="text-xs text-muted mt-0.5 italic">{g.notes}</p>}
                      </div>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded shrink-0 ${
                        g.status === 'obtained' ? 'bg-[#2F8A5F]/10 text-[#2F8A5F]' :
                        g.status === 'partial' ? 'bg-[#C08A2E]/10 text-[#C08A2E]' :
                        'bg-[#B5524A]/10 text-[#B5524A]'
                      }`}>
                        {g.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 rounded-lg bg-brand text-white text-xs font-medium hover:bg-brand-deep transition-colors">Mark gaps resolved</button>
                  <button className="px-4 py-2 rounded-lg border border-hairline text-xs font-medium hover:bg-paper transition-colors">Add note</button>
                </div>
              </div>
            )}

            {selected === issuer.id && !issuer.blockedReason && (
              <div className="border-b border-hairline bg-paper/50 px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-muted">
                  <Clock size={13} />
                  <span>Last updated {issuer.lastUpdated}</span>
                  <span>·</span>
                  <span>Stage {issuer.currentStage + 1} of {STAGES.length}: <strong className="text-[#23262C]">{STAGES[issuer.currentStage]}</strong></span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-brand text-white text-xs font-medium hover:bg-brand-deep transition-colors">Continue →</button>
                  <button onClick={() => setSelected(null)} className="px-3 py-1.5 rounded-lg border border-hairline text-xs font-medium hover:bg-white transition-colors">Collapse</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stage legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted">
        <span className="flex items-center gap-1.5"><CheckCircle2 size={13} className="text-[#2F8A5F]" /> Completed</span>
        <span className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full border-2 border-brand bg-brand/20" /> In progress</span>
        <span className="flex items-center gap-1.5"><AlertCircle size={13} className="text-[#B5524A]" /> Blocked</span>
        <span className="flex items-center gap-1.5"><Circle size={13} className="text-hairline" /> Not started</span>
      </div>
    </div>
  );
};
