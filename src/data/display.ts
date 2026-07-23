// Display sanitisers.
//
// Internal placeholders (TODO / TBD / pending-source notes) belong in code comments
// and the handover — never on screen. The seed data deliberately carries them so the
// gaps stay visible to us; these helpers keep them out of the UI.

const TODO_PATTERN = /\b(TODO|TBD|FIXME|XXX)\b/i;

/** True when an authored string is an internal placeholder rather than real content. */
export const isPlaceholder = (value?: string | null): boolean =>
  !value || TODO_PATTERN.test(value) || value.trim() === '' || value.trim().toLowerCase() === 'undefined';

/**
 * An external rating for display. Values like `A (TODO — conflicting sources)` are
 * reduced to the rating itself; a value that is *only* a placeholder becomes a
 * neutral "under review" label rather than leaking the marker.
 */
export const externalRatingLabel = (value?: string | null, fallback = 'Under review'): string => {
  if (!value) return fallback;
  const stripped = value
    // "A (TODO — conflicting sources)" → "A"
    .replace(/\s*\([^)]*\b(?:TODO|TBD|FIXME)\b[^)]*\)\s*/gi, '')
    // "A — TODO: conflicting sources" → "A"  (em-dash / en-dash / hyphen delimited)
    .replace(/\s*[—–-]\s*\b(?:TODO|TBD|FIXME)\b.*$/i, '')
    .trim();
  if (!stripped || TODO_PATTERN.test(stripped)) return fallback;
  return stripped;
};

/** True when the underlying value was placeholder-y, so the UI can show an info affordance. */
export const isRatingUnderReview = (value?: string | null): boolean =>
  isPlaceholder(value) || TODO_PATTERN.test(value ?? '');

/** Any authored free-text field, with placeholders swapped for a neutral dash. */
export const textOrDash = (value?: string | null, dash = '—'): string =>
  isPlaceholder(value) ? dash : (value as string);

/**
 * A data-gap notice for display. The seeds intentionally carry `TODO: <source>` so
 * the gap is greppable and lands in the handover — but the reader should see the
 * substance, not our internal marker.
 *   "TODO: Midland KID — Issuance factors are templated…"
 *   → "Pending source document (Midland KID). Issuance factors are templated…"
 */
export const dataGapText = (line: string): string => {
  const m = line.match(/^\s*TODO:\s*([^—–-]+?)\s*[—–-]\s*(.*)$/i);
  if (m) return `Pending source document (${m[1].trim()}). ${m[2].trim()}`;
  const bare = line.match(/^\s*TODO:\s*(.*)$/i);
  if (bare) return `Pending source document — ${bare[1].trim()}`;
  return line.replace(/\s*\(\s*TODO[^)]*\)\s*/gi, ' ').replace(/\bTODO\b[:\s—–-]*/gi, '').trim();
};

// ── Issuer-level vs instrument-level copy (§1) ───────────────────────────────
//
// `investorProtection` mixes issuer-level comfort (capital, liquidity, refinancing)
// with instrument-level structural protection (security cover, covenants, listing,
// redemption triggers). The issuer page may only show the former — the rest is a
// property of a specific ISIN. Presentation filter only; the data is untouched.

// Deliberately precise. Bare "secured"/"listed" would wrongly flag issuer-level
// copy ("secured gold book", "listed issuer with disclosure discipline"), so match
// only phrases that genuinely describe an instrument's structure.
const INSTRUMENT_TERMS = new RegExp(
  [
    'security cover', 'covenant', '\\bNCD\\b', '\\bISIN\\b', 'coupon', '\\bYTM\\b',
    'redemption', 'step[- ]?up', 'senior secured', 'subordinated', 'collateral',
    'listed instrument', 'tranche', 'security package', 'issue size',
  ].join('|'),
  'i',
);

export const isInstrumentLevelClaim = (line: string): boolean => INSTRUMENT_TERMS.test(line);

/** Issuer-level comfort points only — safe to render on the entity page. */
export const issuerLevelClaims = (lines: string[]): string[] => lines.filter(l => !isInstrumentLevelClaim(l));
