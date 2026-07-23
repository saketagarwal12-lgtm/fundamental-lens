import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

// Restore scroll position (and any small piece of view state, e.g. the active
// section) when the user returns to a page they have already visited (§2c).
//
// Keyed by pathname + an optional discriminator, and held in sessionStorage so it
// survives in-session navigation but not a new tab. Deliberately not a global
// store — nothing here needs to outlive the session.

const KEY = 'fl-scroll';

const read = (): Record<string, number> => {
  try { return JSON.parse(sessionStorage.getItem(KEY) ?? '{}'); } catch { return {}; }
};

const write = (map: Record<string, number>) => {
  try { sessionStorage.setItem(KEY, JSON.stringify(map)); } catch { /* quota — non-fatal */ }
};

/**
 * @param ref        the scrolling container (the app's main column scrolls, not window)
 * @param extraKey   discriminator when one route has several scroll contexts (e.g. section)
 * @param ready      hold restoration until content has rendered, or we scroll a short page
 */
export const useRestoreScroll = (
  ref: React.RefObject<HTMLElement>,
  extraKey = '',
  ready = true,
) => {
  const location = useLocation();
  const key = `${location.pathname}::${extraKey}`;
  const restored = useRef('');

  // Restore once per key, after content is ready.
  useEffect(() => {
    const el = ref.current;
    if (!el || !ready || restored.current === key) return;
    const top = read()[key];
    if (typeof top === 'number' && top > 0) {
      // rAF so layout has settled before we scroll.
      requestAnimationFrame(() => { el.scrollTop = top; });
    }
    restored.current = key;
  }, [key, ready, ref]);

  // Persist on scroll (throttled via rAF) and on unmount.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let queued = false;
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        const map = read();
        map[key] = el.scrollTop;
        write(map);
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      el.removeEventListener('scroll', onScroll);
      const map = read();
      map[key] = el.scrollTop;
      write(map);
    };
  }, [key, ref]);
};

// ── Post-login return (§2d) ──────────────────────────────────────────────────
// Auth is in-memory, so a reload logs the user out. Remember where they were so
// re-login returns them there rather than dumping them on the dashboard.

const RETURN_KEY = 'fl-return-to';

export const rememberRoute = (path: string) => {
  // Never send the user back to the landing page as a "return route".
  if (path && path !== '/') {
    try { sessionStorage.setItem(RETURN_KEY, path); } catch { /* non-fatal */ }
  }
};

export const takeRememberedRoute = (): string | undefined => {
  try {
    const v = sessionStorage.getItem(RETURN_KEY) ?? undefined;
    sessionStorage.removeItem(RETURN_KEY);
    return v;
  } catch { return undefined; }
};
