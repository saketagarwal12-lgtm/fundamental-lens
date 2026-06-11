import { Aperture } from 'lucide-react';

interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Wordmark: React.FC<Props> = ({ size = 'md' }) => {
  const textSize = size === 'sm' ? 'text-sm' : size === 'md' ? 'text-[15px]' : size === 'lg' ? 'text-xl' : 'text-[2rem]';
  const iconSize = size === 'sm' ? 14 : size === 'md' ? 17 : size === 'lg' ? 22 : 38;
  return (
    <span className={`inline-flex items-center gap-2 font-bold tracking-tight select-none ${textSize}`}>
      <Aperture
        size={iconSize}
        className="text-brand-teal shrink-0"
        style={{ filter: 'drop-shadow(0 0 8px rgba(45,212,191,0.7))' }}
        strokeWidth={2.2}
      />
      <span className="text-primary-text">Fundamental</span>
      <span className="text-brand-teal" style={{ textShadow: '0 0 16px rgba(45,212,191,0.5)' }}>Lens</span>
    </span>
  );
};
