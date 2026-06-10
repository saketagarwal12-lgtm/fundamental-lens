import type { Grade } from '../data/types';

const cfg: Record<Grade, { bg: string; text: string; short: string }> = {
  'Extremely Strong': { bg: 'bg-[#1B6E4B]/10', text: 'text-[#1B6E4B]', short: 'Ext. Strong' },
  'Strong':           { bg: 'bg-[#2F8A5F]/10', text: 'text-[#2F8A5F]', short: 'Strong' },
  'Moderate':         { bg: 'bg-[#C08A2E]/10', text: 'text-[#C08A2E]', short: 'Moderate' },
  'Weak':             { bg: 'bg-[#B5524A]/10', text: 'text-[#B5524A]', short: 'Weak' },
};

export const GradeBadge: React.FC<{ grade: Grade; compact?: boolean }> = ({ grade, compact }) => {
  const c = cfg[grade];
  return (
    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      {compact ? c.short : grade}
    </span>
  );
};

export const gradeColor = (grade: Grade) => cfg[grade].text;
export const gradeBarColor = (grade: Grade): string => {
  const map: Record<Grade, string> = {
    'Extremely Strong': '#1B6E4B',
    'Strong': '#2F8A5F',
    'Moderate': '#C08A2E',
    'Weak': '#B5524A',
  };
  return map[grade];
};
