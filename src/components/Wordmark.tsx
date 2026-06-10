import { Aperture } from 'lucide-react';

interface Props {
  size?: 'sm' | 'md' | 'lg';
  lightMode?: boolean;
}

export const Wordmark: React.FC<Props> = ({ size = 'md', lightMode = false }) => {
  const textSize = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-xl' : 'text-[15px]';
  const iconSize = size === 'sm' ? 14 : size === 'lg' ? 22 : 17;
  const fundColor = lightMode ? 'text-white' : 'text-[#23262C]';
  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold tracking-tight select-none ${textSize}`}>
      <Aperture size={iconSize} className="text-brand shrink-0" strokeWidth={2.2} />
      <span className={fundColor}>Fundamental</span><span className="text-brand">Lens</span>
    </span>
  );
};
