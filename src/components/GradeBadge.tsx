import type { Grade } from '../data/types';

const cfg: Record<Grade, { bg: string; text: string; glow: string }> = {
  'Extremely Strong': { bg: 'rgba(52,211,153,0.15)', text: '#34D399', glow: '0 0 8px rgba(52,211,153,0.3)' },
  'Strong':           { bg: 'rgba(45,212,191,0.15)', text: '#2DD4BF', glow: '0 0 8px rgba(45,212,191,0.3)' },
  'Moderate':         { bg: 'rgba(251,191,36,0.15)',  text: '#FBBF24', glow: '0 0 8px rgba(251,191,36,0.3)' },
  'Weak':             { bg: 'rgba(251,113,133,0.15)', text: '#FB7185', glow: '0 0 8px rgba(251,113,133,0.3)' },
  'Extremely Weak':   { bg: 'rgba(225,29,72,0.15)',   text: '#E11D48', glow: '0 0 8px rgba(225,29,72,0.35)' },
};

export const GradeBadge: React.FC<{ grade: Grade; compact?: boolean }> = ({ grade, compact }) => {
  const c = cfg[grade];
  const label = compact
    ? grade === 'Extremely Strong' ? 'Ext. Strong' : grade === 'Extremely Weak' ? 'Ext. Weak' : grade
    : grade;
  return (
    <span
      className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold border"
      style={{ background: c.bg, color: c.text, boxShadow: c.glow, borderColor: `${c.text}30` }}
    >
      {label}
    </span>
  );
};

export const gradeColor = (grade: Grade) => cfg[grade].text;
export const gradeBarColor = (grade: Grade): string => cfg[grade].text;
