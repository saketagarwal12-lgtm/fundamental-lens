import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { ArchitecturePanels } from './ArchitecturePanels';

// Public explainer for the architecture, data flywheel and lineage (linked from the
// landing roadmap). Front-end only — a visual, explanatory surface, not a real backend.
export const Architecture: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen">
      <div className="radial-glow-tl" />
      <div className="radial-glow-br" />
      <header className="sticky top-0 z-40 h-14 flex items-center gap-4 px-4" style={{ background: 'rgba(11,31,32,0.85)', backdropFilter: 'blur(18px)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <button onClick={() => navigate('/')} className="inline-flex items-center gap-1.5 t-label text-muted-text hover:text-primary-text">
          <ArrowLeft size={15} /> Home
        </button>
        <div className="mx-auto"><Wordmark size="md" /></div>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ background: 'rgba(45,212,191,0.15)', color: '#2DD4BF' }}>How it works</span>
      </header>
      <div className="max-w-[1100px] mx-auto w-full p-6" style={{ position: 'relative', zIndex: 1 }}>
        <div className="mb-6">
          <h1 className="t-display text-primary-text">How the engine works</h1>
          <p className="t-lead mt-2 max-w-2xl">The moat is the database, not the app. Data flows through a sealed assessment engine, an expert review, then delivery — and every score is reproducible to the day.</p>
        </div>
        <ArchitecturePanels />
      </div>
    </div>
  );
};
