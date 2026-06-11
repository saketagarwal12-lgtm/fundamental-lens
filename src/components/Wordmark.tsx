import { Aperture } from 'lucide-react';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export const Wordmark: React.FC<Props> = ({ size = 'md' }) => {
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
  return (
    <span className={`inline-flex items-center ${gap} font-extrabold tracking-[-0.02em] select-none ${textSize}`}>
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
};
