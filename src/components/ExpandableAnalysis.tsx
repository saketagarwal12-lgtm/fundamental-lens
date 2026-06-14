import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  commentary: string;            // the full written section from the report
  quarterly?: string;            // financial only — "Latest quarterly update"
  outlook?: string;              // financial only — "Outlook"
  variant?: 'qualitative' | 'financial';
  readingMode?: boolean;         // warm light reading surface for the body
  extra?: React.ReactNode;       // optional structured tables/charts for the full view
}

const clampStyle: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

// Default = short (clamped) summary; expand reveals the full report section.
// Qualitative: full prose only. Financial: full prose + quarterly update + outlook.
export const ExpandableAnalysis: React.FC<Props> = ({ commentary, quarterly, outlook, variant = 'qualitative', readingMode, extra }) => {
  const [open, setOpen] = useState(false);
  const isFinancial = variant === 'financial';

  const bodyStyle: React.CSSProperties = readingMode
    ? { background: 'rgba(245,240,230,0.95)', color: '#1a1a1a', borderRadius: 12, padding: '1rem', fontFamily: 'Newsreader, Georgia, serif' }
    : { color: '#E9F3F1', fontFamily: 'Newsreader, Georgia, serif' };

  return (
    <div>
      <p
        className="text-sm leading-relaxed"
        style={{ ...bodyStyle, ...(open ? {} : clampStyle) }}
      >
        {commentary}
      </p>

      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="mt-3 inline-flex items-center gap-1.5 t-label text-brand-teal hover:opacity-80 transition-opacity"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        {open ? 'Hide full analysis' : 'Read full analysis'}
      </button>

      {/* Financial-only structured blocks */}
      {isFinancial && (quarterly || outlook) && (
        <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
          <div className="overflow-hidden">
            <div className="pt-4 space-y-4">
              {extra && <div>{extra}</div>}
              {quarterly && (
                <div>
                  <p className="t-eyebrow mb-1.5">Latest quarterly update</p>
                  <p className="text-sm leading-relaxed font-serif text-primary-text">{quarterly}</p>
                </div>
              )}
              {outlook && (
                <div>
                  <p className="t-eyebrow mb-1.5">Outlook</p>
                  <p className="text-sm leading-relaxed font-serif text-primary-text">{outlook}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Qualitative extra (structured tables/charts), revealed with the full view */}
      {!isFinancial && extra && (
        <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
          <div className="overflow-hidden"><div className="pt-4">{extra}</div></div>
        </div>
      )}
    </div>
  );
};
