import { useState } from 'react';
import { CheckCircle2, Circle, AlertCircle, Clock, ChevronRight, X, Plus } from 'lucide-react';

const STAGES = ['Data sources', 'Capture', 'Model', 'Gaps', 'Score', 'Report', 'Review', 'Publish'];

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
  if (status === 'done') return <CheckCircle2 size={14} style={{ color: '#34D399' }} />;
  if (status === 'active') return (
    <div className="w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: '#2DD4BF', background: 'rgba(45,212,191,0.2)' }} />
  );
  if (status === 'blocked') return <AlertCircle size={14} style={{ color: '#FB7185' }} />;
  return <Circle size={14} style={{ color: 'rgba(255,255,255,0.15)' }} />;
};

const gapStatusStyle = (s: string): React.CSSProperties =>
  s === 'obtained' ? { background: 'rgba(52,211,153,0.15)', color: '#34D399' } :
  s === 'partial' ? { background: 'rgba(251,191,36,0.15)', color: '#FBBF24' } :
  { background: 'rgba(251,113,133,0.15)', color: '#FB7185' };

const gapDotColor = (s: string) =>
  s === 'obtained' ? '#34D399' : s === 'partial' ? '#FBBF24' : '#FB7185';

export const Pipeline: React.FC = () => {
  const [selected, setSelected] = useState<string | null>('saral');

  return (
    <div className="p-6 page-fade max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-7">
        <div>
          <h1 className="text-xl font-semibold text-primary-text">Research Pipeline</h1>
          <p className="text-sm text-muted-text mt-0.5">{pipelineData.length} issuers in progress</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg btn-gradient text-sm">
          <Plus size={15} /> New Issuer
        </button>
      </div>

      {/* Stage header */}
      <div
        className="rounded-t-xl px-5 py-3 overflow-x-auto"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderBottom: 'none' }}
      >
        <div className="flex items-center gap-1 min-w-max">
          <div className="w-56 shrink-0 text-xs font-medium text-muted-text">Issuer</div>
          {STAGES.map(s => (
            <div key={s} className="w-20 shrink-0 text-center">
              <span className="text-[10px] text-muted-text font-medium">{s}</span>
            </div>
          ))}
          <div className="w-24 shrink-0 text-xs font-medium text-muted-text pl-2">Analyst</div>
        </div>
      </div>

      {/* Pipeline rows */}
      <div
        className="rounded-b-xl overflow-hidden mb-6"
        style={{ border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(18,42,44,0.4)' }}
      >
        {pipelineData.map(issuer => (
          <div key={issuer.id}>
            <button
              onClick={() => setSelected(selected === issuer.id ? null : issuer.id)}
              className="w-full flex items-center gap-1 px-5 py-4 text-left overflow-x-auto transition-colors"
              style={{
                borderBottom: '1px solid rgba(255,255,255,0.05)',
                background: selected === issuer.id ? 'rgba(45,212,191,0.06)' : 'transparent',
              }}
              onMouseEnter={e => { if (selected !== issuer.id) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={e => { if (selected !== issuer.id) e.currentTarget.style.background = 'transparent'; }}
            >
              <div className="w-56 shrink-0 min-w-0 pr-2">
                <p className="text-sm font-medium text-primary-text truncate">{issuer.name}</p>
                <p className="text-xs text-muted-text mt-0.5">{issuer.sector}</p>
              </div>
              {issuer.stageStatuses.map((status, si) => (
                <div key={si} className="w-20 shrink-0 flex justify-center">
                  <div className="relative flex items-center">
                    <StageIcon status={status} />
                    {si < STAGES.length - 1 && (
                      <div
                        className="absolute left-full w-16 h-px"
                        style={{ background: status === 'done' ? 'rgba(52,211,153,0.3)' : 'rgba(255,255,255,0.07)' }}
                      />
                    )}
                  </div>
                </div>
              ))}
              <div className="w-24 shrink-0 pl-2 flex items-center gap-2">
                <span className="text-xs text-muted-text">{issuer.analyst}</span>
                <ChevronRight size={13} className="text-muted-text ml-auto" />
              </div>
            </button>

            {/* Expanded gap panel for blocked issuer */}
            {selected === issuer.id && issuer.blockedReason && (
              <div
                className="border-b px-5 py-4"
                style={{ borderColor: 'rgba(251,113,133,0.15)', background: 'rgba(251,113,133,0.05)' }}
              >
                <div className="flex items-start gap-3 mb-4">
                  <AlertCircle size={16} style={{ color: '#FB7185' }} className="mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: '#FB7185' }}>Blocked at Gaps stage</p>
                    <p className="text-xs text-muted-text mt-0.5">{issuer.blockedReason}</p>
                  </div>
                  <button onClick={() => setSelected(null)} className="ml-auto text-muted-text hover:text-primary-text">
                    <X size={15} />
                  </button>
                </div>

                <h4 className="text-xs font-semibold text-muted-text uppercase tracking-wider mb-3">Data Gaps</h4>
                <div className="space-y-2">
                  {gaps.map(g => (
                    <div
                      key={g.id}
                      className="flex items-start gap-3 rounded-lg p-3"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                      <div
                        className="w-2 h-2 rounded-full mt-1.5 shrink-0"
                        style={{ background: gapDotColor(g.status) }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-primary-text">{g.field}</p>
                        <p className="text-xs text-muted-text">Source: {g.source}</p>
                        {g.notes && <p className="text-xs text-muted-text mt-0.5 italic">{g.notes}</p>}
                      </div>
                      <span
                        className="text-[10px] font-semibold px-2 py-0.5 rounded shrink-0"
                        style={gapStatusStyle(g.status)}
                      >
                        {g.status}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button className="px-4 py-2 rounded-lg btn-gradient text-xs font-medium">Mark gaps resolved</button>
                  <button
                    className="px-4 py-2 rounded-lg text-xs font-medium text-muted-text transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.04)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.04)')}
                  >
                    Add note
                  </button>
                </div>
              </div>
            )}

            {selected === issuer.id && !issuer.blockedReason && (
              <div
                className="border-b px-5 py-3 flex items-center justify-between"
                style={{ borderColor: 'rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
              >
                <div className="flex items-center gap-3 text-xs text-muted-text">
                  <Clock size={13} />
                  <span>Last updated {issuer.lastUpdated}</span>
                  <span>·</span>
                  <span>
                    Stage {issuer.currentStage + 1} of {STAGES.length}:{' '}
                    <strong className="text-primary-text">{STAGES[issuer.currentStage]}</strong>
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg btn-gradient text-xs font-medium">Continue →</button>
                  <button
                    onClick={() => setSelected(null)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium text-muted-text transition-colors"
                    style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    Collapse
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Stage legend */}
      <div className="flex flex-wrap gap-4 text-xs text-muted-text">
        <span className="flex items-center gap-1.5"><CheckCircle2 size={13} style={{ color: '#34D399' }} /> Completed</span>
        <span className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border-2" style={{ borderColor: '#2DD4BF', background: 'rgba(45,212,191,0.2)' }} />
          In progress
        </span>
        <span className="flex items-center gap-1.5"><AlertCircle size={13} style={{ color: '#FB7185' }} /> Blocked</span>
        <span className="flex items-center gap-1.5"><Circle size={13} style={{ color: 'rgba(255,255,255,0.2)' }} /> Not started</span>
      </div>
    </div>
  );
};
