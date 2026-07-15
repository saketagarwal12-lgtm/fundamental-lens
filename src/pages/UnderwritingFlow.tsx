import { useState, useEffect, useRef } from 'react';
import {
  Send, Bot, User, Check, ShieldCheck, Clock, Layers, Gavel, FileCheck2,
  Cpu, Circle, CheckCircle2, RotateCcw, Printer, ArrowRight, Building2, Sparkles,
} from 'lucide-react';
import { ScoreGauge } from '../components/ScoreGauge';
import { gradeBarColor } from '../components/GradeBadge';
import { useAuth } from '../contexts/AuthContext';
import {
  FIXTURES, PILLAR_STEPS, PROOF_POINTS, MODEL_VERSION,
} from '../data/underwriting';
import type { UnderwritingFixture, DraftAssessment } from '../data/underwriting';

type Ctx = 'standalone' | 'investor' | 'creator';
const STAGES = ['Invite', 'Capture', 'Assess', 'Deliver', 'Decide'] as const;
const STAGE_ICON = [Building2, Bot, Cpu, FileCheck2, Gavel];

const prefersReduced = () =>
  typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// ── Proof-point chips (persistent through the flow) ──────────────────────────
const ProofChips: React.FC = () => (
  <div className="flex flex-wrap gap-2">
    {PROOF_POINTS.map((p, i) => {
      const Icon = [Clock, Layers, ShieldCheck, Gavel][i];
      return (
        <span key={p} className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full" style={{ background: 'rgba(45,212,191,0.1)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.25)' }}>
          <Icon size={12} /> {p}
        </span>
      );
    })}
  </div>
);

// ── Stepper ──────────────────────────────────────────────────────────────────
const Stepper: React.FC<{ stage: number; go: (s: number) => void; max: number }> = ({ stage, go, max }) => (
  <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
    {STAGES.map((label, i) => {
      const Icon = STAGE_ICON[i];
      const done = i < stage;
      const active = i === stage;
      const reachable = i <= max;
      return (
        <div key={label} className="flex items-center gap-1 sm:gap-2 shrink-0">
          <button
            onClick={() => reachable && go(i)}
            disabled={!reachable}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors disabled:cursor-not-allowed"
            style={active ? { background: 'rgba(45,212,191,0.14)', border: '1px solid rgba(45,212,191,0.35)' } : { border: '1px solid transparent' }}
          >
            <span className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
              style={done ? { background: '#2DD4BF', color: '#0B1F20' } : active ? { background: 'rgba(45,212,191,0.2)', color: '#2DD4BF', border: '1px solid #2DD4BF' } : { background: 'rgba(255,255,255,0.06)', color: '#6F8584' }}>
              {done ? <Check size={13} /> : <Icon size={13} />}
            </span>
            <span className="t-label hidden sm:inline" style={{ color: active ? '#2DD4BF' : done ? '#E9F3F1' : '#6F8584' }}>{label}</span>
          </button>
          {i < STAGES.length - 1 && <div className="w-4 sm:w-8 h-px shrink-0" style={{ background: i < stage ? '#2DD4BF' : 'rgba(255,255,255,0.12)' }} />}
        </div>
      );
    })}
  </div>
);

// ── Pillar mini-bars (used on Assess + Deliver) ──────────────────────────────
const PillarBars: React.FC<{ draft: DraftAssessment }> = ({ draft }) => (
  <div className="space-y-2.5">
    {draft.pillars.map(p => {
      const c = gradeBarColor(p.grade);
      return (
        <div key={p.key} className="flex items-center gap-3">
          <span className="t-label text-primary-text w-36 shrink-0 truncate">{p.label}</span>
          <span className="t-caption w-9 shrink-0 font-mono-nums" title="Pillar weight">{p.weight}%</span>
          <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${p.pct}%`, background: c, boxShadow: `0 0 8px ${c}66` }} />
          </div>
          <span className="font-mono-nums text-[11px] w-9 text-right shrink-0" style={{ color: c }}>{p.pct}%</span>
        </div>
      );
    })}
  </div>
);

export const UnderwritingFlow: React.FC<{ context?: Ctx }> = ({ context = 'standalone' }) => {
  const { userName } = useAuth();
  const [fixture, setFixture] = useState<UnderwritingFixture>(FIXTURES[0]);
  const [stage, setStage] = useState(0);
  const [maxStage, setMaxStage] = useState(0);

  // Invite form (prefilled from fixture, editable)
  const [form, setForm] = useState({ name: FIXTURES[0].borrower.name, sector: FIXTURES[0].borrower.sector, entityId: FIXTURES[0].borrower.entityId });

  // Capture
  const [idx, setIdx] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  // Assess
  const [engineStep, setEngineStep] = useState(-1);
  const [resolved, setResolved] = useState(false);
  const ranRef = useRef(false);

  // Decide
  const [decision, setDecision] = useState<'Approve' | 'Decline' | 'Refer' | null>(null);
  const [rationale, setRationale] = useState('');
  const [stamp, setStamp] = useState<{ reviewer: string; when: string } | null>(null);

  const borrower = fixture.borrower;
  const intake = fixture.intake;
  const draft = fixture.draft;
  const reviewer = userName || 'Authorised approver';

  const goStage = (s: number) => { setStage(s); setMaxStage(m => Math.max(m, s)); };

  const pickFixture = (id: string) => {
    const f = FIXTURES.find(x => x.borrower.id === id) ?? FIXTURES[0];
    setFixture(f);
    setForm({ name: f.borrower.name, sector: f.borrower.sector, entityId: f.borrower.entityId });
    // reset downstream progress
    setIdx(0); setEngineStep(-1); setResolved(false); ranRef.current = false;
    setDecision(null); setRationale(''); setStamp(null);
  };

  const resetAll = () => { pickFixture(FIXTURES[0].borrower.id); setStage(0); setMaxStage(0); };

  // Capture scroll
  useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight, behavior: 'smooth' }); }, [idx, stage]);

  // Assess engine animation
  useEffect(() => {
    if (stage !== 2 || ranRef.current) return;
    ranRef.current = true;
    if (prefersReduced()) { setEngineStep(PILLAR_STEPS.length); setResolved(true); return; }
    let i = 0;
    setEngineStep(0);
    const tick = () => {
      i += 1;
      setEngineStep(i);
      if (i < PILLAR_STEPS.length) { window.setTimeout(tick, 750); }
      else { window.setTimeout(() => setResolved(true), 500); }
    };
    const t = window.setTimeout(tick, 750);
    return () => window.clearTimeout(t);
  }, [stage]);

  const answered = Math.min(idx, intake.length);
  const captureDone = idx >= intake.length;
  const completion = Math.round((answered / intake.length) * 100);
  const pillarProgress = ['Issuer', 'Issuance', 'Pricing', 'Economic'].map(p => {
    const total = intake.filter(m => m.pillar === p).length;
    const got = intake.slice(0, idx).filter(m => m.pillar === p).length;
    return { pillar: p, total, got };
  });

  const transcript: { who: 'ai' | 'user'; text: string }[] = [];
  const shown = Math.min(idx, intake.length);
  for (let i = 0; i < shown; i++) { transcript.push({ who: 'ai', text: intake[i].question }); transcript.push({ who: 'user', text: intake[i].answer }); }
  const current = captureDone ? null : intake[idx];
  if (current) transcript.push({ who: 'ai', text: current.question });

  const heading = context === 'creator' ? 'Underwriting engine (creator mirror)'
    : context === 'investor' ? 'Underwriting engine' : 'Credit underwriting';

  return (
    <div className="p-6 page-fade">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <ShieldCheck size={18} style={{ color: '#2DD4BF' }} />
          <h1 className="t-h1 text-primary-text">{heading}</h1>
          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(167,139,250,0.15)', color: '#A78BFA', border: '1px solid rgba(167,139,250,0.3)' }}>Premium</span>
        </div>
        <p className="t-lead mt-1">A white-label flow: invite a borrower, capture inputs conversationally, run the sealed engine, deliver a decision-ready file, and sign off — hours, not days. AI captures inputs; it never computes the score.</p>
      </div>

      <div className="mb-5"><ProofChips /></div>

      {/* Branded-by + stepper */}
      <div className="glass-card p-4 mb-5">
        <div className="flex items-center justify-between gap-3 flex-wrap mb-4">
          <span className="inline-flex items-center gap-2 t-caption">
            <span className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: 'rgba(45,212,191,0.14)', color: '#2DD4BF' }}><Building2 size={13} /></span>
            Branded by <span className="text-primary-text font-medium">{borrower.lender}</span> · white-label
          </span>
          <span className="t-caption">Model: <span className="font-mono-nums text-muted-text">{MODEL_VERSION}</span></span>
        </div>
        <Stepper stage={stage} go={goStage} max={maxStage} />
      </div>

      {/* ── STAGE 0 · INVITE ── */}
      {stage === 0 && (
        <div className="grid lg:grid-cols-[1fr_320px] gap-5">
          <div className="glass-card p-6">
            <h3 className="t-h3 text-primary-text mb-1">Invite a borrower</h3>
            <p className="t-caption mb-5">The lender drops a borrower into a branded flow. Pick a demo borrower or edit the details.</p>

            <div className="flex flex-wrap gap-2 mb-5">
              {FIXTURES.map(f => {
                const on = f.borrower.id === borrower.id;
                return (
                  <button key={f.borrower.id} onClick={() => pickFixture(f.borrower.id)}
                    className="text-xs font-medium px-3 py-1.5 rounded-full transition-colors"
                    style={on ? { background: 'rgba(45,212,191,0.15)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.35)' } : { background: 'rgba(255,255,255,0.05)', color: '#9CB3B1', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {f.borrower.name.split(' ')[0]}
                  </button>
                );
              })}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { k: 'name', label: 'Borrower legal name' },
                { k: 'sector', label: 'Sector / sub-sector' },
                { k: 'entityId', label: 'ISIN / entity id' },
              ].map(f => (
                <label key={f.k} className={f.k === 'name' ? 'sm:col-span-2 block' : 'block'}>
                  <span className="t-label text-muted-text block mb-1.5">{f.label}</span>
                  <input value={form[f.k as keyof typeof form]} onChange={e => setForm(s => ({ ...s, [f.k]: e.target.value }))}
                    className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none text-primary-text"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
                </label>
              ))}
              <label className="sm:col-span-2 block">
                <span className="t-label text-muted-text block mb-1.5">Facility assessed</span>
                <input value={borrower.requested} readOnly
                  className="w-full px-3 py-2.5 rounded-lg text-sm text-muted-text" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }} />
              </label>
            </div>

            <button onClick={() => goStage(1)} className="mt-5 inline-flex items-center gap-2 px-5 py-3 rounded-lg btn-gradient text-sm">
              Send to borrower &amp; start capture <ArrowRight size={16} />
            </button>
          </div>

          <div className="glass-card-elevated p-6" style={{ borderColor: 'rgba(45,212,191,0.2)' }}>
            <p className="t-eyebrow mb-2">What the lender gets</p>
            <ul className="space-y-2.5">
              {['A decision-ready file in under an hour', 'Depth far beyond a bureau score', 'Every factor explainable & auditable', 'The lender owns the final decision'].map(t => (
                <li key={t} className="flex items-start gap-2 t-body text-primary-text"><Check size={15} className="shrink-0 mt-0.5" style={{ color: '#2DD4BF' }} />{t}</li>
              ))}
            </ul>
            <p className="t-caption mt-4">{borrower.headline}</p>
          </div>
        </div>
      )}

      {/* ── STAGE 1 · CAPTURE ── */}
      {stage === 1 && (
        <div className="grid lg:grid-cols-2 gap-5">
          <div className="glass-card p-5 flex flex-col" style={{ minHeight: 460 }}>
            <div className="flex items-center gap-2 mb-1">
              <Bot size={16} style={{ color: '#2DD4BF' }} />
              <h3 className="t-h3 text-primary-text">AI-led intake</h3>
            </div>
            <p className="t-caption mb-3 flex items-center gap-1.5"><Sparkles size={12} style={{ color: '#A78BFA' }} /> The AI only captures inputs — it never computes the score.</p>
            <div ref={chatRef} className="flex-1 overflow-y-auto space-y-3 pr-1" style={{ maxHeight: 340 }}>
              {transcript.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.who === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: m.who === 'ai' ? 'rgba(45,212,191,0.15)' : 'rgba(56,189,248,0.15)', color: m.who === 'ai' ? '#2DD4BF' : '#38BDF8' }}>
                    {m.who === 'ai' ? <Bot size={14} /> : <User size={14} />}
                  </div>
                  <div className="t-body rounded-xl px-3 py-2 max-w-[80%]" style={{ background: m.who === 'ai' ? 'rgba(255,255,255,0.04)' : 'rgba(56,189,248,0.1)', color: '#E9F3F1' }}>{m.text}</div>
                </div>
              ))}
              {captureDone && <p className="t-caption text-center py-3">All inputs captured — run the engine on the right.</p>}
            </div>
            {current && (
              <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="t-caption mb-2">Captured response ({current.category} · feeds {current.pillar}):</p>
                <button onClick={() => setIdx(i => Math.min(i + 1, intake.length))} className="w-full flex items-center justify-between gap-2 px-4 py-3 rounded-lg btn-gradient text-sm">
                  <span className="truncate">{current.answer}</span><Send size={15} className="shrink-0" />
                </button>
              </div>
            )}
          </div>

          <div className="space-y-5">
            <div className="glass-card p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="t-h3 text-primary-text">Capture progress</h3>
                <span className="font-mono-nums text-xs" style={{ color: completion === 100 ? '#34D399' : '#FBBF24' }}>{completion}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mb-4" style={{ background: 'rgba(255,255,255,0.07)' }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${completion}%`, background: 'linear-gradient(90deg,#2DD4BF,#22D3EE)' }} />
              </div>
              <p className="t-eyebrow mb-2">Across the four pillars</p>
              <div className="space-y-2">
                {pillarProgress.map(p => (
                  <div key={p.pillar} className="flex items-center gap-2 text-sm">
                    {p.got >= p.total && p.total > 0 ? <CheckCircle2 size={14} style={{ color: '#34D399' }} className="shrink-0" /> : <Circle size={14} className="text-muted-text shrink-0" />}
                    <span className="text-muted-text w-24 shrink-0">{p.pillar}</span>
                    <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                      <div className="h-full rounded-full" style={{ width: `${p.total ? (p.got / p.total) * 100 : 0}%`, background: '#2DD4BF' }} />
                    </div>
                    <span className="font-mono-nums text-[11px] text-muted-text shrink-0">{p.got}/{p.total}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="glass-card p-5">
              <button onClick={() => goStage(2)} disabled={completion < 80}
                className="w-full px-5 py-3 rounded-lg btn-gradient text-sm disabled:opacity-40 disabled:cursor-not-allowed">
                {completion < 80 ? `Run the engine (≥80% — ${completion}%)` : 'Run the 119-factor engine'}
              </button>
              <p className="t-caption mt-3">Inputs are captured now; the sealed model turns them into a score in the next step.</p>
            </div>
          </div>
        </div>
      )}

      {/* ── STAGE 2 · ASSESS ── */}
      {stage === 2 && (
        <div className="glass-card p-6">
          <div className="flex items-center gap-2 mb-1">
            <Cpu size={16} style={{ color: '#2DD4BF' }} />
            <h3 className="t-h3 text-primary-text">Assessment engine</h3>
          </div>
          <p className="t-caption mb-5 flex items-center gap-1.5"><ShieldCheck size={12} style={{ color: '#2DD4BF' }} /> Sealed model · 119 factors · 40 qualitative, 79 quantitative — deterministic, expert-reviewed, peer-calibrated. The AI captured inputs; it never computes the score.</p>

          <div className="grid sm:grid-cols-4 gap-3 mb-6">
            {PILLAR_STEPS.map((p, i) => {
              const active = engineStep === i && !resolved;
              const done = resolved || engineStep > i;
              return (
                <div key={p.key} className="rounded-xl p-4 text-center transition-all duration-300"
                  style={{ background: done ? 'rgba(45,212,191,0.1)' : 'rgba(255,255,255,0.03)', border: active ? '1px solid #2DD4BF' : '1px solid rgba(255,255,255,0.08)', boxShadow: active ? '0 0 18px rgba(45,212,191,0.35)' : 'none' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: done ? '#2DD4BF' : 'rgba(255,255,255,0.06)', color: done ? '#0B1F20' : '#6F8584' }}>
                    {done ? <Check size={15} /> : active ? <Cpu size={15} className="animate-pulse" /> : <Circle size={13} />}
                  </div>
                  <p className="t-label text-primary-text">{p.label}</p>
                  <p className="t-caption">{p.weight}% weight</p>
                </div>
              );
            })}
          </div>

          {!resolved ? (
            <p className="t-body text-center text-muted-text animate-pulse">Running the sealed engine across the weighted pillars…</p>
          ) : (
            <div className="page-fade">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <ScoreGauge score={draft.fundamental.score} max={draft.fundamental.max} pct={draft.fundamental.pct} caption="Draft Fundamental Score" />
                <div className="flex-1 w-full">
                  <div className="flex items-baseline gap-2 mb-3">
                    <span className="t-eyebrow">Draft Total Score</span>
                    <span className="font-mono-nums text-lg font-bold text-brand-teal">{draft.total.score}</span>
                    <span className="font-mono-nums text-muted-text text-sm">/ {draft.total.max} · {draft.total.pct}% · Rating {draft.total.rating}</span>
                  </div>
                  <PillarBars draft={draft} />
                </div>
              </div>
              <div className="flex items-center gap-3 mt-6 flex-wrap">
                <span className="text-[11px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(251,191,36,0.12)', color: '#FBBF24', border: '1px solid rgba(251,191,36,0.25)' }}>Draft — pending human sign-off</span>
                <button onClick={() => goStage(3)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg btn-gradient text-sm">Open decision file <ArrowRight size={15} /></button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── STAGE 3 · DELIVER ── */}
      {stage === 3 && (
        <div className="space-y-5">
          <div className="glass-card-elevated p-6" style={{ borderColor: 'rgba(45,212,191,0.2)' }}>
            <div className="flex items-start justify-between gap-3 flex-wrap mb-5">
              <div>
                <div className="flex items-center gap-2">
                  <FileCheck2 size={18} style={{ color: '#2DD4BF' }} />
                  <h3 className="t-h2 text-primary-text">Decision-ready file</h3>
                </div>
                <p className="t-caption mt-1">{borrower.name} · {borrower.sector} · {borrower.requested}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full" style={{ background: 'rgba(52,211,153,0.14)', color: '#34D399', border: '1px solid rgba(52,211,153,0.3)' }}>
                <Clock size={12} /> Delivered in &lt; 1 hour
              </span>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-6">
              <ScoreGauge score={draft.fundamental.score} max={draft.fundamental.max} pct={draft.fundamental.pct} caption="Fundamental Score" />
              <div className="flex-1 w-full">
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="t-eyebrow">Total Score</span>
                  <span className="font-mono-nums text-lg font-bold text-brand-teal">{draft.total.score}</span>
                  <span className="font-mono-nums text-muted-text text-sm">/ {draft.total.max} · Rating {draft.total.rating}</span>
                </div>
                <PillarBars draft={draft} />
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="glass-card p-5">
              <h4 className="t-h3 mb-3" style={{ color: '#34D399' }}>Key strengths</h4>
              <ul className="space-y-2">
                {draft.strengths.map(s => <li key={s} className="flex items-start gap-2 t-body text-primary-text"><Check size={14} className="shrink-0 mt-0.5" style={{ color: '#34D399' }} />{s}</li>)}
              </ul>
            </div>
            <div className="glass-card p-5">
              <h4 className="t-h3 mb-3" style={{ color: '#FB7185' }}>Key risks</h4>
              <ul className="space-y-2">
                {draft.risks.map(s => <li key={s} className="flex items-start gap-2 t-body text-primary-text"><Circle size={9} className="shrink-0 mt-1.5" style={{ color: '#FB7185' }} />{s}</li>)}
              </ul>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-5">
            <div className="glass-card p-5">
              <div className="flex items-center gap-2 mb-3"><ShieldCheck size={15} style={{ color: '#2DD4BF' }} /><h4 className="t-h3 text-primary-text">Collateral &amp; covenant read</h4></div>
              <ul className="space-y-2">
                {draft.collateralCovenant.map(s => <li key={s} className="flex items-start gap-2 t-body text-muted-text"><Check size={14} className="shrink-0 mt-0.5" style={{ color: '#2DD4BF' }} />{s}</li>)}
              </ul>
            </div>
            <div className="glass-card p-5">
              <h4 className="t-h3 text-primary-text mb-3">One-page rationale</h4>
              <p className="t-body text-primary-text/90 font-serif leading-relaxed">{draft.rationale}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button onClick={() => goStage(4)} className="inline-flex items-center gap-2 px-5 py-3 rounded-lg btn-gradient text-sm">Proceed to decision <ArrowRight size={15} /></button>
            <button onClick={() => window.print()} className="inline-flex items-center gap-1.5 t-label text-muted-text hover:text-primary-text px-3 py-2"><Printer size={14} /> Print / export</button>
          </div>
        </div>
      )}

      {/* ── STAGE 4 · DECIDE ── */}
      {stage === 4 && (
        <div className="grid lg:grid-cols-[1fr_340px] gap-5">
          <div className="glass-card p-6">
            <div className="flex items-center gap-2 mb-1"><Gavel size={16} style={{ color: '#2DD4BF' }} /><h3 className="t-h3 text-primary-text">Human decision</h3></div>
            <p className="t-caption mb-5">The model informs; the lender decides. Every decision is stamped and auditable.</p>

            <div className="grid grid-cols-3 gap-3 mb-5">
              {(['Approve', 'Refer', 'Decline'] as const).map(d => {
                const on = decision === d;
                const color = d === 'Approve' ? '#34D399' : d === 'Decline' ? '#FB7185' : '#FBBF24';
                return (
                  <button key={d} onClick={() => { setDecision(d); setStamp(null); }}
                    className="py-3 rounded-xl text-sm font-semibold transition-all"
                    style={on ? { background: `${color}22`, color, border: `1px solid ${color}` } : { background: 'rgba(255,255,255,0.04)', color: '#9CB3B1', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {d}
                  </button>
                );
              })}
            </div>

            <label className="block mb-4">
              <span className="t-label text-muted-text block mb-1.5">Decision rationale</span>
              <textarea value={rationale} onChange={e => setRationale(e.target.value)} rows={4}
                placeholder="Add the committee's reasoning…"
                className="w-full px-3 py-2.5 rounded-lg text-sm focus:outline-none text-primary-text resize-none"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }} />
            </label>

            <button onClick={() => setStamp({ reviewer, when: new Date().toLocaleString() })}
              disabled={!decision}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-lg btn-gradient text-sm disabled:opacity-40 disabled:cursor-not-allowed">
              <FileCheck2 size={15} /> Record decision
            </button>

            {stamp && (
              <div className="mt-5 rounded-xl p-4 page-fade" style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.25)' }}>
                <p className="t-eyebrow mb-2" style={{ color: '#34D399' }}>Audit stamp</p>
                <div className="grid sm:grid-cols-2 gap-y-1.5 gap-x-4 text-sm">
                  <div><span className="t-caption">Decision</span><p className="text-primary-text font-medium">{decision}</p></div>
                  <div><span className="t-caption">Reviewer</span><p className="text-primary-text font-medium">{stamp.reviewer}</p></div>
                  <div><span className="t-caption">Model version</span><p className="font-mono-nums text-primary-text text-[13px]">{MODEL_VERSION}</p></div>
                  <div><span className="t-caption">Timestamp</span><p className="font-mono-nums text-primary-text text-[13px]">{stamp.when}</p></div>
                </div>
                {rationale && <p className="t-body text-muted-text mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>"{rationale}"</p>}
                <button onClick={resetAll} className="mt-4 inline-flex items-center gap-1.5 t-label text-muted-text hover:text-primary-text"><RotateCcw size={13} /> New assessment</button>
              </div>
            )}
          </div>

          <div className="glass-card-elevated p-6" style={{ borderColor: 'rgba(45,212,191,0.2)' }}>
            <p className="t-eyebrow mb-3">Why this is defensible</p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 t-body text-primary-text"><ShieldCheck size={15} className="shrink-0 mt-0.5" style={{ color: '#2DD4BF' }} />Explainable &amp; auditable — every factor traces to a captured input.</li>
              <li className="flex items-start gap-2.5 t-body text-primary-text"><Gavel size={15} className="shrink-0 mt-0.5" style={{ color: '#2DD4BF' }} />Lender owns the decision — the model never auto-approves.</li>
              <li className="flex items-start gap-2.5 t-body text-primary-text"><Cpu size={15} className="shrink-0 mt-0.5" style={{ color: '#2DD4BF' }} />AI captured the inputs; the sealed model scored them.</li>
            </ul>
            <div className="mt-5"><ProofChips /></div>
          </div>
        </div>
      )}
    </div>
  );
};
