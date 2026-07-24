import { useEffect, useRef, useState } from 'react';
import type { LucideIcon } from 'lucide-react';

// Tier-2 contextual navigation as a HORIZONTAL bar (§5).
//
// Replaces the old vertical side panel + 56px collapsed rail + chevron. Sticks
// under the page header, scrolls horizontally with an edge fade rather than
// wrapping, and is keyboard-navigable (arrow keys move a roving focus, Enter/Space
// selects). An optional second-level row appears when a parent pill is active.

export interface SectionItem<K extends string = string> {
  key: K;
  label: string;
  icon?: LucideIcon;
}

export interface SubItem<K extends string = string> {
  key: K;
  label: string;
}

interface Props<K extends string, S extends string> {
  items: SectionItem<K>[];
  active: K;
  onSelect: (key: K) => void;
  /** When set and the active pill matches `subParent`, a second-level pill row shows. */
  subParent?: K;
  subItems?: SubItem<S>[];
  activeSub?: S;
  onSelectSub?: (key: S) => void;
}

export function SectionBar<K extends string, S extends string>({
  items, active, onSelect, subParent, subItems, activeSub, onSelectSub,
}: Props<K, S>) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [fade, setFade] = useState({ left: false, right: false });

  // Edge-fade visibility follows scroll position.
  const updateFade = () => {
    const el = scrollRef.current;
    if (!el) return;
    setFade({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  };
  useEffect(() => { updateFade(); }, [items.length]);

  // Keep the active pill in view when it changes (e.g. selected from elsewhere).
  useEffect(() => {
    const i = items.findIndex(it => it.key === active);
    btnRefs.current[i]?.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    updateFade();
  }, [active, items]);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const next = e.key === 'ArrowRight' ? Math.min(i + 1, items.length - 1) : Math.max(i - 1, 0);
      btnRefs.current[next]?.focus();
    }
  };

  const showSub = subParent && subItems && active === subParent;

  return (
    <div
      className="sticky top-0"
      style={{ zIndex: 'var(--z-section-bar)' as unknown as number, background: 'rgba(11,31,32,0.92)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
    >
      <div className="relative">
        {/* Edge fades — signal there is more to scroll, never wrap to a second row. */}
        {fade.left && <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 z-10" style={{ background: 'linear-gradient(90deg, rgba(11,31,32,0.95), transparent)' }} />}
        {fade.right && <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 z-10" style={{ background: 'linear-gradient(270deg, rgba(11,31,32,0.95), transparent)' }} />}

        <div
          ref={scrollRef}
          onScroll={updateFade}
          role="tablist"
          aria-label="Sections"
          className="flex items-center gap-1 px-4 py-2 overflow-x-auto scrollbar-none"
          style={{ scrollbarWidth: 'none' }}
        >
          {items.map((it, i) => {
            const on = it.key === active;
            const Icon = it.icon;
            return (
              <button
                key={it.key}
                ref={el => { btnRefs.current[i] = el; }}
                role="tab"
                aria-selected={on}
                tabIndex={on ? 0 : -1}
                onClick={() => onSelect(it.key)}
                onKeyDown={e => onKeyDown(e, i)}
                title={it.label}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal ${on ? '' : 'text-muted-text hover:text-primary-text'}`}
                style={on
                  ? { background: 'rgba(45,212,191,0.15)', color: '#2DD4BF', border: '1px solid rgba(45,212,191,0.35)' }
                  : { background: 'transparent', border: '1px solid transparent' }}
              >
                {Icon && <Icon size={13} className="shrink-0" />}
                {it.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Second-level row (e.g. Financial Analysis categories) */}
      {showSub && (
        <div
          role="tablist"
          aria-label="Sub-sections"
          className="flex items-center gap-1 px-4 py-1.5 overflow-x-auto scrollbar-none page-fade"
          style={{ scrollbarWidth: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'rgba(255,255,255,0.02)' }}
        >
          {subItems!.map(s => {
            const on = s.key === activeSub;
            return (
              <button
                key={s.key}
                role="tab"
                aria-selected={on}
                onClick={() => onSelectSub?.(s.key)}
                className="shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                style={on ? { background: 'rgba(45,212,191,0.12)', color: '#2DD4BF' } : { color: '#9CB3B1' }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
