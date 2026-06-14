import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface Props {
  commentary: string;
  quarterly?: string;
  outlook?: string;
  readingMode?: boolean;   // warm light reading surface for the body
}

// Default short summary + expandable full analysis with two labelled sub-blocks.
export const ExpandableAnalysis: React.FC<Props> = ({ commentary, quarterly, outlook, readingMode }) => {
  const [open, setOpen] = useState(false);

  const bodyStyle: React.CSSProperties = readingMode
    ? { background: 'rgba(245,240,230,0.95)', color: '#1a1a1a', borderRadius: 12, padding: '1rem', fontFamily: 'Newsreader, Georgia, serif' }
    : { color: '#E9F3F1', fontFamily: 'Newsreader, Georgia, serif' };

  return (
    <div>
      <p className="text-sm leading-relaxed" style={bodyStyle}>{commentary}</p>

      {(quarterly || outlook) && (
        <>
          <button
            onClick={() => setOpen(o => !o)}
            aria-expanded={open}
            className="mt-3 inline-flex items-center gap-1.5 t-label text-brand-teal hover:opacity-80 transition-opacity"
          >
            {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
            {open ? 'Hide full analysis' : 'Read full analysis'}
          </button>
          <div
            className="grid transition-[grid-template-rows] duration-300 ease-out"
            style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
          >
            <div className="overflow-hidden">
              <div className="pt-3 space-y-4">
                {quarterly && (
                  <div>
                    <p className="t-eyebrow mb-1.5">Latest quarterly commentary</p>
                    <p className="text-sm leading-relaxed font-serif text-primary-text">{quarterly}</p>
                  </div>
                )}
                {outlook && (
                  <div>
                    <p className="t-eyebrow mb-1.5">Future outlook</p>
                    <p className="text-sm leading-relaxed font-serif text-primary-text">{outlook}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
