import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';

// Hierarchical navigation for every non-top-level route (§2).
//
// Two affordances, always together:
//  - an "up" control that goes to the PARENT in the hierarchy (not browser-back —
//    they differ whenever the user arrived sideways, e.g. from search)
//  - a breadcrumb trail showing where this page sits
//
// Referrer-aware: a caller can pass `state={{ from: {...} }}` when navigating, and
// the up-control/trail will reflect the path actually taken. Falls back to the
// declared parent on direct URL entry or reload, so it never dead-ends.

export interface Crumb {
  label: string;
  /** Omit on the current page — it renders as plain text. */
  to?: string;
}

/** Router state a caller can attach so the destination knows where it came from. */
export interface FromState {
  label: string;
  to: string;
}

interface Props {
  /** The declared parent — used when there is no referrer in router state. */
  up: Crumb & { to: string };
  /** Full trail, ancestors first. The last entry is the current page. */
  crumbs: Crumb[];
  /** Right-aligned page actions. */
  actions?: React.ReactNode;
}

/** Reads a referrer passed via router state, if one is present and well-formed. */
export const useReferrer = (): FromState | undefined => {
  const location = useLocation();
  const from = (location.state as { from?: FromState } | null)?.from;
  return from && typeof from.to === 'string' && typeof from.label === 'string' ? from : undefined;
};

/** Build the router state to attach when navigating, so the target can come back here. */
export const fromState = (label: string, to: string): { from: FromState } => ({ from: { label, to } });

export const PageNav: React.FC<Props> = ({ up, crumbs, actions }) => {
  const navigate = useNavigate();
  const referrer = useReferrer();

  // Prefer where the user actually came from; fall back to the declared parent.
  const target = referrer ?? up;

  const trail: Crumb[] = referrer
    // Referrer replaces the immediate ancestor so the trail matches the journey.
    ? [{ label: referrer.label, to: referrer.to }, crumbs[crumbs.length - 1]]
    : crumbs;

  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
      <div className="min-w-0">
        <button
          onClick={() => navigate(target.to)}
          className="inline-flex items-center gap-1.5 text-xs text-muted-text hover:text-brand-teal transition-colors rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
        >
          <ArrowLeft size={13} className="shrink-0" />
          <span className="truncate max-w-[16rem]">{target.label}</span>
        </button>

        {/* Breadcrumb — middle segments truncate on narrow widths. */}
        <nav aria-label="Breadcrumb" className="mt-1.5">
          <ol className="flex items-center gap-1 flex-nowrap overflow-hidden">
            {trail.map((c, i) => {
              const last = i === trail.length - 1;
              return (
                <li key={`${c.label}-${i}`} className={`flex items-center gap-1 min-w-0 ${!last && i === 0 ? 'shrink' : ''}`}>
                  {i > 0 && <ChevronRight size={11} className="text-faint-text shrink-0" />}
                  {c.to && !last ? (
                    <Link
                      to={c.to}
                      title={c.label}
                      className="text-[11px] text-muted-text hover:text-brand-teal transition-colors truncate rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-teal"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span title={c.label} className="text-[11px] text-primary-text font-medium truncate" aria-current={last ? 'page' : undefined}>
                      {c.label}
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>
      </div>

      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  );
};
