import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Wordmark } from '../components/Wordmark';
import { UnderwritingFlow } from './UnderwritingFlow';

// Top-level, standalone branded entry for the white-label underwriting flow.
export const Underwriting: React.FC = () => {
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
        <span className="text-[10px] font-medium px-2 py-0.5 rounded" style={{ background: 'rgba(45,212,191,0.15)', color: '#2DD4BF' }}>Underwriting</span>
      </header>
      <div className="max-w-[1400px] mx-auto w-full" style={{ position: 'relative', zIndex: 1 }}>
        <UnderwritingFlow context="standalone" />
      </div>
    </div>
  );
};
