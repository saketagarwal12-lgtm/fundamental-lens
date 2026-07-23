import { Aperture } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  /** Set false for decorative placements that must not become a second link to home. */
  link?: boolean;
}

// The brand mark. Canonical placement is ONCE per view — the top bar in both app
// layouts, the sticky nav on marketing pages. IconRail carries no brand glyph.
//
// Clicking it goes home, contextually: investor → dashboard, creator → pipeline,
// logged out → landing. When we are already there it renders as plain text, so it
// can never push a duplicate history entry.
export const Wordmark: React.FC<Props> = ({ size = 'md', link = true }) => {
  const { role } = useAuth();
  const location = useLocation();

  const textSize =
    size === 'sm' ? 'text-sm' :
    size === 'md' ? 'text-[15px]' :
    size === 'lg' ? 'text-2xl' :
    size === 'xl' ? 'text-[2rem]' :
    'text-[3.25rem] leading-none';
  const iconSize =
    size === 'sm' ? 14 :
    size === 'md' ? 17 :
    size === 'lg' ? 26 :
    size === 'xl' ? 38 :
    58;
  const gap = size === '2xl' ? 'gap-3' : 'gap-2';

  const mark = (
    <span className={`inline-flex items-center ${gap} font-bold tracking-[-0.02em] select-none ${textSize}`}>
      <Aperture
        size={iconSize}
        className="text-brand-teal shrink-0"
        style={{ filter: 'drop-shadow(0 0 10px rgba(45,212,191,0.7))' }}
        strokeWidth={2.2}
      />
      <span className="text-primary-text">Fundamental</span>
      <span className="text-brand-teal" style={{ textShadow: '0 0 18px rgba(45,212,191,0.55)' }}>Lens</span>
    </span>
  );

  const home = role === 'investor' ? '/app/dashboard' : role === 'creator' ? '/creator/pipeline' : '/';

  if (!link || location.pathname === home) return mark;

  return (
    <Link
      to={home}
      aria-label="Fundamental Lens — home"
      className="inline-flex rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal transition-opacity hover:opacity-80"
    >
      {mark}
    </Link>
  );
};
