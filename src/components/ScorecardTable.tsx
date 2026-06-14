import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { GradeBadge, gradeBarColor } from './GradeBadge';
import type { CompanyReport } from '../data/reports';
import type { Grade } from '../data/types';

// Map a Financial-Analysis factor name to its commentary section key.
const FIN_KEY: Record<string, string> = {
  'Capitalization': 'capitalization',
  'Funding': 'fundingLiquidity',
  'Liquidity': 'fundingLiquidity',
  'Profitability': 'profitability',
  'Asset Quality': 'assetQuality',
};

const commentaryFor = (report: CompanyReport, pillarName: string, factorName: string): string | undefined => {
  if (pillarName === 'Business & Management') {
    return report.qualitative.find(q => q.factor === factorName)?.commentary;
  }
  if (pillarName === 'Financial Analysis') {
    const k = FIN_KEY[factorName];
    return k ? report.financials[k]?.commentary : undefined;
  }
  return undefined;
};

const Row: React.FC<{ name: string; grade: Grade; commentary?: string }> = ({ name, grade, commentary }) => {
  const [open, setOpen] = useState(false);
  const expandable = !!commentary;
  return (
    <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
      <button
        onClick={() => expandable && setOpen(o => !o)}
        aria-expanded={expandable ? open : undefined}
        className={`w-full flex items-center gap-3 py-3 text-left ${expandable ? '' : 'cursor-default'}`}
      >
        {expandable
          ? (open ? <ChevronDown size={14} className="text-muted-text shrink-0" /> : <ChevronRight size={14} className="text-muted-text shrink-0" />)
          : <span className="w-3.5 shrink-0" />}
        <span className="t-label text-primary-text flex-1 leading-snug">{name}</span>
        <GradeBadge grade={grade} compact />
      </button>
      {expandable && (
        <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
          <div className="overflow-hidden">
            <p className="text-sm font-serif leading-relaxed text-muted-text pb-4 pl-7 max-w-prose">{commentary}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export const ScorecardTable: React.FC<{ report: CompanyReport }> = ({ report }) => (
  <div className="space-y-4">
    {report.scorecard.map(pillar => {
      const c = gradeBarColor(pillar.grade);
      return (
        <div key={pillar.name} className="glass-card p-5">
          <div className="flex items-center gap-2.5 pb-3 mb-1" style={{ borderBottom: `1px solid ${c}33` }}>
            <h3 className="t-h3 text-primary-text">{pillar.name}</h3>
            <GradeBadge grade={pillar.grade} />
          </div>
          {pillar.factors.map(f => (
            <Row key={f.name} name={f.name} grade={f.grade} commentary={commentaryFor(report, pillar.name, f.name)} />
          ))}
        </div>
      );
    })}
  </div>
);
