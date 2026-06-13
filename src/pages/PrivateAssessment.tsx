import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, CheckCircle2, Circle, Sparkles, Printer, RotateCcw } from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { gradeBarColor } from '../components/GradeBadge';
import { gradeForPct } from '../data/score';

// MOCK scripted "AI relationship manager" assessment for a private/unlisted company.
// Wired to a live model at go-live — answers here are illustrative.

interface Step {
  category: string;
  field: string;
  question: string;
  answer: string;   // scripted client answer
}

const STEPS: Step[] = [
  { category: 'Company basics', field: 'Legal name', question: "Let's start with the basics — what's the company's legal name?", answer: 'Prarambh Capital Pvt Ltd' },
  { category: 'Company basics', field: 'Sector / sub-sector', question: 'And what sector and sub-sector does it operate in?', answer: 'NBFC — MSME secured lending' },
  { category: 'Company basics', field: 'Established · HQ', question: 'When was it established, and where is it headquartered?', answer: 'Incorporated 2017 · Pune' },
  { category: 'Company basics', field: 'AUM', question: 'What is the current assets-under-management?', answer: '₹1,240 Cr (3Q FY26)' },

  { category: 'Capitalization', field: 'Net worth', question: 'Moving to capital — what is the net worth?', answer: '₹310 Cr' },
  { category: 'Capitalization', field: 'Total CAR', question: 'What is the total capital adequacy ratio?', answer: '22.4%' },
  { category: 'Capitalization', field: 'Leverage', question: 'And the leverage (debt / net worth)?', answer: '3.0x' },

  { category: 'Profitability', field: 'ROAA', question: 'On profitability — what is the return on average assets?', answer: '2.1%' },
  { category: 'Profitability', field: 'NIM', question: 'What is the net interest margin?', answer: '8.9%' },
  { category: 'Profitability', field: 'Cost-to-income', question: 'And the cost-to-income ratio?', answer: '58%' },

  { category: 'Funding & liquidity', field: 'Funding mix', question: 'How is the borrowing funded across sources?', answer: 'Banks 60% / NCDs 30% / other 10%' },
  { category: 'Funding & liquidity', field: 'LCR', question: 'What is the liquidity coverage ratio?', answer: '140%' },
  { category: 'Funding & liquidity', field: 'ALM position', question: 'Any cumulative asset-liability mismatch within one year?', answer: 'No cumulative <1yr shortfall' },

  { category: 'Asset quality / working capital', field: 'GNPA', question: 'On asset quality — what is the gross NPA?', answer: '2.8%' },
  { category: 'Asset quality / working capital', field: 'NNPA', question: 'And the net NPA?', answer: '1.1%' },
  { category: 'Asset quality / working capital', field: 'Collateralisation', question: 'How much of the book is secured?', answer: '85% secured against collateral' },

  { category: 'Management & governance', field: 'Key persons', question: 'Tell me about the leadership and key-person dependency.', answer: 'Founder-led; 2 independent directors on a 7-member board' },
  { category: 'Management & governance', field: 'Governance', question: 'How would you describe governance and audit?', answer: 'Big-6 auditor; quarterly board; no audit qualifications' },
  { category: 'Management & governance', field: 'Strategy', question: 'Finally — what is the forward strategy?', answer: 'Measured geographic expansion across west India' },
];

const CATEGORIES = ['Company basics', 'Capitalization', 'Profitability', 'Funding & liquidity', 'Asset quality / working capital', 'Management & governance'];

// Illustrative draft result derived from the captured inputs.
const DRAFT_FACTORS = [
  { name: 'Business Model', pct: 55 }, { name: 'Business Position', pct: 50 }, { name: 'Borrower Profile', pct: 55 },
  { name: 'Management & Governance', pct: 60 }, { name: 'Ownership', pct: 55 },
  { name: 'Capitalization', pct: 70 }, { name: 'Funding', pct: 58 }, { name: 'Liquidity', pct: 60 },
  { name: 'Profitability', pct: 55 }, { name: 'Asset Quality', pct: 68 },
];
const DRAFT_ISSUER = Math.round(DRAFT_FACTORS.reduce((s, f) => s + f.pct, 0) / DRAFT_FACTORS.length); // ≈ 58%
const DRAFT_SCORE = Math.round((DRAFT_ISSUER / 100) * 200);

export const PrivateAssessment: React.FC = () => {
  const [idx, setIdx] = useState(0);              // current step awaiting answer
  const [captured, setCaptured] = useState<Record<string, string>>({});
  const [ran, setRan] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const total = STEPS.length;
  const answered = Object.keys(captured).length;
  const completion = Math.round((answered / total) * 100);
  const done = idx >= total;
  const current = done ? null : STEPS[idx];

  useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }); }, [idx]);

  const answer = () => {
    if (!current) return;
    setCaptured(c => ({ ...c, [`${current.category}::${current.field}`]: current.answer }));
    setIdx(i => i + 1);
  };

  const reset = () => { setIdx(0); setCaptured({}); setRan(false); };

  const missing = STEPS.filter(s => !(captured[`${s.category}::${s.field}`])).map(s => s.field);

  // Build transcript up to current
  const transcript: { who: 'ai' | 'user'; text: string }[] = [];
  for (let i = 0; i < idx; i++) {
    transcript.push({ who: 'ai', text: STEPS[i].question });
    transcript.push({ who: 'user', text: STEPS[i].answer });
  }
  if (current) transcript.push({ who: 'ai', text: current.question });

  return (
    <div className="p-6 page-fade">
      <div className="mb-5">
        <div className="flex items-center gap-2">
          <Sparkles size={18} style={{ color: '#A78BFA' }} />
          <h1 className="t-h1 text-primary-text">Assess a private company</h1>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.3)' }}>Upgraded plan</span>
        </div>
        <p className="t-lead mt-1">A guided AI relationship manager collects the inputs, fills a structured format, then produces a draft Fundamental Score. Conversational AI is a mock UI — wired to a live model at go-live.</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Left — AI RM conversation */}
        <div className="glass-card p-5 flex flex-col" style={{ minHeight: 460 }}>
          <div className="flex items-center gap-2 mb-3">
            <Bot size={16} style={{ color: '#2DD4BF' }} />
            <h3 className="t-h3 text-primary-text">AI relationship manager</h3>
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ maxHeight: 360 }}>
            {transcript.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.who === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: m.who === 'ai' ? 'rgba(45,212,191,0.15)' : 'rgba(56,189,248,0.15)', color: m.who === 'ai' ? '#2DD4BF' : '#38BDF8' }}>
                  {m.who === 'ai' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="t-body rounded-xl px-3 py-2 max-w-[80%]" style={{ background: m.who === 'ai' ? 'rgba(255,255,255,0.04)' : 'rgba(56,189,248,0.1)', color: '#E9F3F1' }}>
                  {m.text}
                </div>
              </div>
            ))}
            {done && <p className="t-caption text-center py-3">All topics covered — run the assessment on the right.</p>}
          </div>
          {current && (
            <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="t-caption mb-2">Suggested response ({current.category}):</p>
              <button onClick={answer} className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg btn-gradient text-sm">
                <span className="truncate">{current.answer}</span>
                <Send size={15} className="shrink-0" />
              </button>
            </div>
          )}
        </div>

        {/* Right — structured capture / run */}
        <div className="space-y-5">
          <div className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="t-h3 text-primary-text">Structured capture</h3>
              <span className="font-mono-nums text-xs" style={{ color: completion === 100 ? '#34D399' : '#FBBF24' }}>{completion}% complete</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.07)' }}>
              <div className="h-full rounded-full transition-all duration-300" style={{ width: `${completion}%`, background: 'linear-gradient(90deg,#2DD4BF,#22D3EE)' }} />
            </div>
            <div className="space-y-4">
              {CATEGORIES.map(cat => (
                <div key={cat}>
                  <p className="t-eyebrow mb-1.5">{cat}</p>
                  <div className="space-y-1">
                    {STEPS.filter(s => s.category === cat).map(s => {
                      const val = captured[`${s.category}::${s.field}`];
                      return (
                        <div key={s.field} className="flex items-center gap-2 text-sm">
                          {val ? <CheckCircle2 size={14} style={{ color: '#34D399' }} className="shrink-0" /> : <Circle size={14} className="text-muted-text shrink-0" />}
                          <span className="text-muted-text w-40 shrink-0">{s.field}</span>
                          <span className="text-primary-text font-mono-nums truncate">{val ?? '—'}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
            {missing.length > 0 && (
              <p className="t-caption mt-3">{missing.length} field{missing.length > 1 ? 's' : ''} remaining: {missing.slice(0, 4).join(', ')}{missing.length > 4 ? '…' : ''}</p>
            )}
          </div>

          <div className="glass-card p-5">
            <button
              onClick={() => setRan(true)}
              disabled={completion < 80}
              className="w-full px-5 py-3 rounded-lg btn-gradient text-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {completion < 80 ? `Run assessment (≥80% needed — ${completion}%)` : 'Run assessment'}
            </button>

            {ran && (
              <div className="mt-5 page-fade">
                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <ScoreGauge score={DRAFT_SCORE} max={200} pct={DRAFT_ISSUER} caption="Draft Fundamental Score" />
                  <div className="flex-1 w-full">
                    <p className="t-eyebrow mb-2">Factor scorecard (draft)</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {DRAFT_FACTORS.map(f => {
                        const c = gradeBarColor(gradeForPct(f.pct));
                        return (
                          <div key={f.name} className="flex items-center gap-2">
                            <span className="t-caption flex-1 min-w-0 truncate" style={{ color: '#9CB3B1' }}>{f.name}</span>
                            <span className="font-mono-nums text-[11px] font-medium" style={{ color: c }}>{f.pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-4 flex-wrap">
                  <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(251,191,36,0.12)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.25)' }}>
                    Draft assessment — analyst review before publish
                  </span>
                  <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 t-label btn-outline-glass px-3 py-1.5 rounded-lg"><Printer size={13} /> Print / export</button>
                  <button onClick={reset} className="inline-flex items-center gap-1.5 t-label text-muted-text hover:text-primary-text"><RotateCcw size={13} /> Start over</button>
                </div>
                <p className="t-caption mt-3">Illustrative score from the captured inputs only — not a published assessment.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
