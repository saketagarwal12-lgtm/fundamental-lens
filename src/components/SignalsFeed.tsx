import {
  TrendingUp, TrendingDown, Minus, Banknote, AlertOctagon, FileWarning,
  UserCog, PieChart, Scale, Gavel, Newspaper,
} from 'lucide-react';
import type { Signal, SignalType } from '../data/reports';

const ICONS: Record<SignalType, typeof Banknote> = {
  'Debt raised': Banknote,
  'Default / delay': AlertOctagon,
  'Auditor change': FileWarning,
  'Management change': UserCog,
  'Shareholding change': PieChart,
  'Litigation': Scale,
  'Regulatory penalty': Gavel,
  'News': Newspaper,
};

export const SignalsFeed: React.FC<{ signals: Signal[] }> = ({ signals }) => (
  <div className="glass-card p-5">
    <h3 className="t-h3 text-primary-text mb-1">Signals</h3>
    <p className="t-caption mb-4">Real-time events driving the score — most recent first.</p>
    {signals.length === 0 ? (
      <p className="t-body text-muted-text">No signals recorded for this period.</p>
    ) : (
      <div className="space-y-3">
        {signals.map((s, i) => {
          const Icon = ICONS[s.type];
          const color = s.impact === 'up' ? '#34D399' : s.impact === 'down' ? '#FB7185' : '#9CB3B1';
          const Arrow = s.impact === 'up' ? TrendingUp : s.impact === 'down' ? TrendingDown : Minus;
          return (
            <div key={i} className="flex gap-3">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}1f`, color, border: `1px solid ${color}33` }}>
                <Icon size={15} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.06)', color: '#9CB3B1', border: '1px solid rgba(255,255,255,0.1)' }}>{s.type}</span>
                  <span className="t-caption">{s.date} · {s.source}</span>
                  <Arrow size={13} style={{ color }} />
                </div>
                <p className="t-body text-primary-text mt-1">{s.text}</p>
              </div>
            </div>
          );
        })}
      </div>
    )}
  </div>
);
