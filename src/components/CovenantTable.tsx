import type { Covenant } from '../data/reports';
import { GradeBadge } from './GradeBadge';

export const CovenantTable: React.FC<{ covenants: Covenant[] }> = ({ covenants }) => (
  <div className="glass-card overflow-hidden">
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <th className="text-left px-5 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Covenant</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Latest Value</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Commentary</th>
            <th className="text-center px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Scale</th>
          </tr>
        </thead>
        <tbody>
          {covenants.map(c => (
            <tr key={c.covenant} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td className="px-5 py-3 font-medium text-primary-text">{c.covenant}</td>
              <td className="px-4 py-3 font-mono-nums text-primary-text text-xs">{c.value}</td>
              <td className="px-4 py-3 text-muted-text text-xs leading-relaxed">{c.commentary}</td>
              <td className="px-4 py-3 text-center"><GradeBadge grade={c.grade} compact /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);
