import { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Aperture } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface RailItem {
  to: string;
  icon: LucideIcon;
  label: string;
  end?: boolean;
}

interface Props {
  items: RailItem[];
  home: string;          // brand glyph destination
  badge?: string;        // e.g. "Creator"
}

// Tier 1 — permanent slim icon rail with a hover/focus flyout that floats above content.
export const IconRail: React.FC<Props> = ({ items, home, badge }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div
      className="relative shrink-0 h-full"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocusCapture={() => setOpen(true)}
      onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}
    >
      {/* Rail */}
      <nav
        aria-label="Primary"
        className="w-[60px] h-full flex flex-col items-center py-3 gap-1.5"
        style={{ background: 'rgba(10,25,27,0.9)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.07)' }}
      >
        <Link to={home} aria-label="Fundamental Lens home" className="w-10 h-10 flex items-center justify-center mb-1 rounded-lg">
          <Aperture size={22} strokeWidth={2.2} className="text-brand-teal" style={{ filter: 'drop-shadow(0 0 8px rgba(45,212,191,0.7))' }} />
        </Link>
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            aria-label={label}
            title={label}
            className={({ isActive }) =>
              `w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`
            }
          >
            <Icon size={18} />
          </NavLink>
        ))}
      </nav>

      {/* Flyout overlay (floats above content; does not reflow) */}
      <div
        className={`absolute top-0 left-[60px] h-full w-56 z-50 py-3 px-2 transition-[opacity,transform] duration-200 ease-out ${open ? 'opacity-100 translate-x-0 pointer-events-auto' : 'opacity-0 -translate-x-2 pointer-events-none'}`}
        style={{ background: 'rgba(15,35,38,0.97)', backdropFilter: 'blur(20px)', borderRight: '1px solid rgba(255,255,255,0.08)', boxShadow: '12px 0 34px rgba(0,0,0,0.4)' }}
        role="menu"
        aria-hidden={!open}
      >
        <div className="px-3 pb-2 mb-1 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <span className="t-eyebrow">Menu</span>
          {badge && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded" style={{ background: 'rgba(45,212,191,0.15)', color: '#2DD4BF' }}>{badge}</span>}
        </div>
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={() => setOpen(false)}
            tabIndex={open ? 0 : -1}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`
            }
          >
            <Icon size={16} className="shrink-0" />
            <span className="truncate">{label}</span>
          </NavLink>
        ))}
      </div>
    </div>
  );
};
