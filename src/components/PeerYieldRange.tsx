import type { PeerRow } from '../data/reports';

interface Props {
  peers: PeerRow[];
  thisIssuer: string;
  thisYtm: number;
  thisRating: string;
}

// Range bar (peer YTM spread + this issue marker) above a peer table.
export const PeerYieldRange: React.FC<Props> = ({ peers, thisIssuer, thisYtm, thisRating }) => {
  const ytms = [...peers.map(p => p.ytm), thisYtm];
  const min = Math.floor(Math.min(...ytms) - 0.5);
  const max = Math.ceil(Math.max(...ytms) + 0.5);
  const span = max - min || 1;
  const pos = (v: number) => `${((v - min) / span) * 100}%`;

  return (
    <div>
      {/* Range bar */}
      <div className="glass-card p-5 mb-4">
        <p className="text-xs text-muted-text uppercase tracking-wider mb-5">Peer YTM range</p>
        <div className="relative h-12 mb-2">
          <div className="absolute inset-x-0 top-5 h-1 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }} />
          {peers.map(p => (
            <div key={p.isin} className="absolute top-3.5 group" style={{ left: pos(p.ytm), transform: 'translateX(-50%)' }}>
              <span className="block w-2.5 h-2.5 rounded-full" style={{ background: '#9CB3B1' }} title={`${p.issuer} ${p.ytm}%`} />
            </div>
          ))}
          {/* This issue */}
          <div className="absolute top-2.5 flex flex-col items-center" style={{ left: pos(thisYtm), transform: 'translateX(-50%)' }}>
            <span
              className="w-4 h-4 rounded-full border-2"
              style={{ background: '#22D3EE', borderColor: '#0B1F20', boxShadow: '0 0 12px rgba(34,211,238,0.7)' }}
            />
            <span className="font-mono-nums text-[11px] font-semibold mt-1 whitespace-nowrap" style={{ color: '#2DD4BF' }}>
              {thisYtm.toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="flex justify-between text-[11px] text-muted-text font-mono-nums">
          <span>{min.toFixed(1)}%</span>
          <span>{max.toFixed(1)}%</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-muted-text mt-3">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full inline-block" style={{ background: '#22D3EE' }} /> {thisIssuer} ({thisRating})
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ background: '#9CB3B1' }} /> Peers
          </span>
        </div>
      </div>

      {/* Peer table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                <th className="text-left px-4 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Issuer</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Rating</th>
                <th className="text-right px-3 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">AUM</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">ISIN</th>
                <th className="text-left px-3 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Redemption</th>
                <th className="text-right px-3 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">YTM</th>
                <th className="text-center px-3 py-3 text-xs font-medium text-muted-text uppercase tracking-wide">Tenor</th>
              </tr>
            </thead>
            <tbody>
              {peers.map(p => (
                <tr key={p.isin} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <td className="px-4 py-3 text-primary-text font-medium">{p.issuer}</td>
                  <td className="px-3 py-3 text-center text-muted-text text-xs">{p.rating}</td>
                  <td className="px-3 py-3 text-right font-mono-nums text-primary-text text-xs">{p.aum}</td>
                  <td className="px-3 py-3 font-mono-nums text-brand-teal text-xs">{p.isin}</td>
                  <td className="px-3 py-3 text-muted-text text-xs">{p.redemption}</td>
                  <td className="px-3 py-3 text-right font-mono-nums font-semibold text-primary-text">{p.ytm.toFixed(2)}%</td>
                  <td className="px-3 py-3 text-center text-muted-text text-xs">{p.tenor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
