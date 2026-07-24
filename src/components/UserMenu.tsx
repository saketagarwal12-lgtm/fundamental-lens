import { useEffect, useRef, useState } from 'react';
import { ChevronDown, LogOut, RefreshCw } from 'lucide-react';

interface Props {
  userName: string;
  role: 'investor' | 'creator';
  accent?: string;            // avatar accent colour
  onSwitch: () => void;
  onSignOut: () => void;
}

// Accessible role/user dropdown — opaque surface, high z-index, outside-click + Esc + arrow-key nav.
export const UserMenu: React.FC<Props> = ({ userName, role, accent = '#2DD4BF', onSwitch, onSignOut }) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const items = [
    { label: role === 'investor' ? 'Switch to Creator' : 'Switch to Investor', icon: RefreshCw, danger: false, onClick: onSwitch },
    { label: 'Sign out', icon: LogOut, danger: true, onClick: onSignOut },
  ];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => { if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false); };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setOpen(false); return; }
      if (e.key === 'ArrowDown') { e.preventDefault(); setActive(a => Math.min(items.length - 1, a + 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setActive(a => Math.max(0, a - 1)); }
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open, items.length]);

  useEffect(() => { if (open) itemRefs.current[active]?.focus(); }, [open, active]);

  return (
    <div className="relative" ref={wrapRef}>
      <button
        onClick={() => { setOpen(o => !o); setActive(0); }}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-colors text-sm"
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
      >
        <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
          style={{ background: `${accent}33`, color: accent }}>
          {userName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:inline text-sm font-medium text-primary-text max-w-[120px] truncate">{userName}</span>
        <ChevronDown size={14} className="text-muted-text" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 rounded-xl overflow-hidden"
          style={{ zIndex: 'var(--z-user-menu)' as unknown as number, background: '#0F2629', border: '1px solid rgba(255,255,255,0.12)', boxShadow: '0 20px 48px rgba(0,0,0,0.6)' }}
        >
          {/* Identity */}
          <div className="px-4 py-3 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold shrink-0"
              style={{ background: `${accent}33`, color: accent }}>
              {userName.charAt(0).toUpperCase()}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-primary-text truncate">{userName}</p>
              <p className="t-caption capitalize">{role}</p>
            </div>
          </div>
          {/* Actions */}
          <div className="py-1">
            {items.map((it, i) => (
              <button
                key={it.label}
                ref={el => (itemRefs.current[i] = el)}
                role="menuitem"
                onClick={() => { setOpen(false); it.onClick(); }}
                onMouseEnter={() => setActive(i)}
                className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-left transition-colors focus:outline-none"
                style={{
                  color: it.danger ? '#FB7185' : '#E9F3F1',
                  background: active === i ? (it.danger ? 'rgba(251,113,133,0.1)' : 'rgba(255,255,255,0.05)') : 'transparent',
                }}
              >
                <it.icon size={15} className="shrink-0" /> {it.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
