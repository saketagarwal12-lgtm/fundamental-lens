# Fundamental Lens — Handover

A front-end prototype for **Fundamental Lens**, a fundamental-research platform that turns
institutional-grade credit/fundamental research into something any investor can read and
monitor. It surfaces, per issuer, a **Fundamental Score**, a transparent scorecard, full
research, portfolio monitoring, and a (mock) AI research desk.

> **Tagline:** "Financial inclusion is incomplete without the democracy of financial research."

This document is the single source of truth for picking the project up cold.

---

## 1. Status & repo

- **Repo:** https://github.com/saketagarwal12-lgtm/fundamental-lens (public)
- **Live preview (StackBlitz):** https://stackblitz.com/github/saketagarwal12-lgtm/fundamental-lens
- **State:** working tree clean; `main` is the latest. All work described here is committed & pushed.
- **Prototype only:** front-end, mock data, no backend, no real auth, no real scoring.

---

## 2. Tech stack

- **Vite + React 18 + TypeScript**
- **Tailwind CSS** (dark glassmorphic theme + custom design tokens)
- **React Router** (`BrowserRouter`)
- **Recharts** (all charts)
- **lucide-react** (icons)
- No backend. "Login" is an in-memory React context (role only, no passwords).

---

## 3. Running locally

The dev box uses a **portable Node** (not on PATH). On Windows PowerShell:

```powershell
$env:PATH = "C:\Users\Saket Agarwal\AppData\Local\node-portable\node-v20.18.0-win-x64;$env:PATH"
cd "C:\Users\Saket Agarwal\OneDrive - AI GROWTH PRIVATE LIMITED\Desktop\Claude code\fundamental-lens"
npm install      # first time only
npm run dev      # http://localhost:5173
npm run build    # tsc + vite build (CI gate — keep it green)
```

On a normal machine with Node ≥ 18 on PATH, just `npm install && npm run dev`.

> Note: `tsconfig` runs with `noUnusedLocals`, so unused imports/vars **fail the build**. Always
> `npm run build` before committing.

---

## 4. Routes

| Path | What |
|---|---|
| `/` | Landing + login (role picker); deck-narrative marketing sections |
| `/underwriting` | **Standalone white-label underwriting flow** (public, branded chrome) |
| `/how-it-works/architecture` | **Architecture · flywheel · lineage · point-in-time** (public explainer) |
| `/app/dashboard` | Investor monitoring dashboard (default) |
| `/app/portfolio-score` | Portfolio Fundamental Score |
| `/app/compare` | **Peer comparison** — 2–4 issuers side by side (`?issuer=<id>` deep-link) |
| `/app/sectors` · `/app/sector/:id` | **Sector index + sector detail** (leaderboard, aggregates, outlook) |
| `/app/watchlist`, `/app/reports`, `/app/alerts`, `/app/profile` | Lighter investor pages |
| `/app/assess` | Underwriting flow (investor mirror of `/underwriting`) |
| `/app/company/:id` | **Company research page** (the core surface); Tier-2 has an **Active ISINs** tab |
| `/app/isin/:isin` | **ISIN-level analysis** — Fundamental (shared) + Issuance + Pricing + Economic |
| `/creator/pipeline` | Creator pipeline (default) |
| `/creator/coverage`, `/creator/sector-models`, `/creator/settings` | Creator back-office |
| `/creator/assess` | Underwriting flow (creator mirror) |
| `/creator/architecture` | Architecture / flywheel / lineage (creator mirror) |

Auth is in-memory (`src/contexts/AuthContext.tsx`): choosing a role on the landing logs you in;
a **full browser reload logs you out** (state is not persisted). Role-guarded routes redirect.

> **Unrouted link (until the ISIN-comparison slice lands):** `ActiveIsinsPanel`'s "Compare ISINs"
> button points at `/app/compare-isins/:issuerId`, which does not exist yet. There is no `*` child
> inside `/app`, so it falls through to the root catch-all → `Navigate to="/"` → **and because auth
> is in-memory, that logs the user out.** Build the route in the comparison slice, or stub it first.

---

## 5. The score model (terminology — important)

- **Fundamental Score = the Issuer score only** (Business & Management + Financial Analysis
  pillars), on a **/200** scale. This is the headline gauge number (e.g. KrazyBee **134 / 200 · 67%**).
- **Total Score = full 0–500** = Fundamental (Issuer /200) + Issuance (/100) + Pricing (/150) +
  Economic & Sector (/50).
- **Rating (1–10)** attaches to the **Total Score** (1 = best … 10 = worst), e.g. `327/500 · 65% · Rating 7`.
- Marketing depth line used across the landing: *"A structured, financial-model-driven fundamental
  analysis — one Fundamental Score distilled from 119 assessment factors (40 qualitative, 79 quantitative)."*
- **Grade bands / colours** (5 bands). Displayed grades come from the **report's authored grade**
  (the `grade` field in data), NOT derived from %:
  - Extremely Strong `#34D399` · Strong `#2DD4BF` · Moderate `#FBBF24` · Weak `#FB7185` · Extremely Weak `#E11D48`
  - `gradeForPct()` / `scoreBand()` exist for score-derived bands (gauge qualifier word), but factor/pillar
    chips use the authored grade.

The analytical model is a **sealed black box** — data files contain only its finished outputs.
There is no extraction/parsing/scoring logic in the app.

---

## 6. Data model (all mock, in `src/data/`)

- **`types.ts`** — `Grade`, `Recommendation`.
- **`companies.ts`** — `Company[]` (id, name, sector, subSector, hq, externalRating, recommendation,
  healthScore, internalRating, combinedScore). 4 fully-covered issuers + light placeholders.
- **`krazybee.ts`** — KrazyBee's authored data + the shared interfaces (`HealthScorePoint`,
  `ScorecardPillar/Factor`, `FinancialSection`, etc.). `FinancialSection` carries optional
  `quarterly` / `outlook` write-ups.
- **`reports.ts`** — the **per-issuer report registry** `reports: Record<id, CompanyReport>` +
  `getReport(id)`. `CompanyReport` holds: healthScoreSeries, scorecard (pillars→factors with grades),
  ratingScale, financials (capitalization/fundingLiquidity/profitability/assetQuality), qualitative,
  ownership, productMix, ncdIssuances, issuanceStructures, covenants, peers, yieldOverview, fundingMix,
  alm, geography, management, externalRating, ratingHistory, materialDevelopments, sectorOutlook,
  recommendationRationale, investorProtection, aiQAPairs, plus optional `ltvBuckets` /
  `segmentAssetQuality` / `collectionEfficiency`, `listing`, `priceSeries`, `dataSources`, `signals`.
  A bottom `Object.entries(reports).forEach(...)` attaches the mock real-time data layer
  (`LISTINGS`, `PRICE_SERIES`, `dataSourcesFor`, `SIGNALS`, `FIN_NOTES` quarterly/outlook).
- **`portfolio.ts`** — `portfolioHoldings[]` seeded with real differing numbers.
- **`sectors.ts`** (new) — derives, from `reports.ts`/`companies.ts`, per-issuer metrics
  (`issuerMetrics`: Fundamental Score /200, pillar grades, the 10 issuer factors, key ratios,
  yield) and sector aggregates (`sectorAggregate`, `allSectorAggregates`, `sectorSignals`,
  `sectorOutlookProse`). Powers `/app/compare` and `/app/sectors`. No re-scoring — reads
  authored outputs only. `RATIOS` defines the comparable ratio set + best-direction.
- **`underwriting.ts`** (new) — mock white-label underwriting fixtures: borrower fixtures,
  scripted `intake`, pre-authored `DraftAssessment` (the model output — never computed in-app),
  `MODEL_VERSION`, `PILLAR_STEPS`, `PROOF_POINTS`. Powers the underwriting flow.
- **`score.ts`** — score helpers: `getScaledScore(report)` (parses `ratingScale` ×100 into
  components incl. issuer/issuance/pricing/economic), `getIssuerTrend(id)` (/200 monthly series),
  `getPortfolioScore(holdings)` (holding-average issuer /200), `gradeForPct`, `scoreBand`, `toSeries500`.
- **`sectors.ts`** — sector taxonomy + derived aggregates (reads `reports` + `companies`).
- **`underwriting.ts`** — scripted borrower fixtures / intake script / draft assessments.

### The issuer → ISINs layer (additive — added by the ISIN/covenant upgrade)

The platform covers each **ISIN** separately. An issuer's **Fundamental Score (/200)** and
**Economic & Sector (/50)** are *issuer-level and shared across all its ISINs*; **Issuance (/100)**,
**Pricing (/150)** and **covenants** are *per-ISIN*. So **Total (/500) and Rating are ISIN-level** —
two ISINs of one issuer share a Fundamental Score but can differ on Total.

- **`isins.ts`** — the layer. `IsinAssessment` (terms, `issuance`, `pricing`, authored `combined`),
  `Pillar` / `FactorScore` / `PricingFactor`, `GRADE_POINTS` (EW 20 · W 40 · M 60 · S 80 · ES 100).
  Helpers: `getIsinsForIssuer(id)`, `getIsinAssessment(isin)`, `getIsinScore(isin)`,
  `getIssuerFundamental(id)`, `getIssuerEconomic(id)`, `getImplicitIsin(id)`, `allIsins()`.
- **`covenants.ts`** — `Covenant` / `CovenantCondition` + the **transparent** buffer arithmetic:
  `covenantBuffer` (`gte`→`value−threshold`; `lte`→`threshold−value`; `eq`→`−|value−threshold|`),
  `covenantStatus` (Breach · Tight ≤10% · Moderate ≤25% · Comfortable >25%), `activeThreshold`
  (resolves a `schedule` at an `asOf` 'YYYY-MM'), `nextStep`, `covenantHeadroomSeries`,
  `covenantWorstBuffer`, `AS_OF = '2026-06'`.
- **`peers.ts`** — §K5 peer universe. Market-reference comparators only; **no Fundamental Score**.

**Additive contract (do not break):** `isins[]` is opt-in per issuer. Only **Midland, Avanti,
Keertana** have authored ISINs. **KrazyBee and Spandana stay issuer-only** — `getImplicitIsin`
synthesizes a single ISIN from their existing report (terms from the current `issuanceStructure`,
scores from `getScaledScore`) so ISIN-level UI works without authored data. `reports.ts`,
`getScaledScore`, `getIssuerTrend` and `getPortfolioScore` were **not changed**.

**Sealed roll-up:** `combined` is **authored, not summed**. Midland is the proof — its source
rating scale prints Combined 3.07/5.00 while its components sum to 3.19 (the section is templated
off Avanti). Never recompute a pillar or total.

**Deviations from the upgrade prompt's §D sketch** (taken deliberately, to honour "additive"):
- `Grade` stays the **existing spaced union** (`'Extremely Strong' | … | 'Extremely Weak'`), not
  §D's `'ExtremelyStrong'|…` form — changing it would break every existing report and component.
- §D's object-shaped `ratingScale` was **not** adopted; `ratingScale: RatingScaleRow[]` is
  unchanged because `getScaledScore` (and thus `/app/compare`, `/app/sectors`) parses it.
- Added beyond §D: `combined` (authored roll-up), `assessed` (false = lightly-seeded),
  `implicit`, `todo[]`, and `testing`/`consequence` on `Covenant`.

### The four fully-populated issuers
- **KrazyBee Services Ltd** — NBFC, Unsecured Personal Loans. Primary, most complete entity.
- **Avanti Finance** — NBFC-MFI (Nilekani/NRJN-backed; has Extremely-Weak factors).
- **Keertana Finserv** — Gold loan (LTV buckets, by-segment GNPA).
- **Spandana Sphoorty** — NBFC-MFI, **listed (NSE/BSE, SPANDANA)** → share-price overlay; its
  Profitability table is the full canonical 6-period (FY22–3Q26 × 15 rows) example.

### Midland Microfin (light coverage — ISIN layer only)
Added by the ISIN upgrade from §K1. It has a `companies.ts` entry and a **Fundamental Score of
114/200** carried in `isins.ts` (`AUTHORED_FUNDAMENTAL`), but **no `reports.ts` entry** — so
`/app/company/midland` renders through the existing coverage-pipeline placeholder, and it is
absent from `/app/sectors` aggregates and the `/app/compare` selector (both key off
`Object.keys(reports)`). That is expected until a full report is authored.

### Seeded ISINs
| ISIN | Issuer | State |
|---|---|---|
| `INE884Q07798` | Midland | Assessed; Issuance/Pricing/covenants stubbed (`TODO: Midland KID`) |
| `INE0BNQ07154` | Avanti | Fully assessed — 8 covenants, the richest covenant fixture |
| `INE0BNQ07105/07113/07121` | Avanti | **Lightly seeded** — terms only, `assessed: false` |
| `INE0NES07220` | Keertana | Fully assessed — primary, 5 covenants |
| `INE0NES07162` | Keertana | **`illustrative: true`** — fabricated, needs a visible badge everywhere |

Verified via `getIsinScore`: Midland **114/200 · 61% · R7** · Avanti **102/200 · 61% · R7** ·
Keertana primary **110/200 · 74% · R5** · Keertana illustrative **110/200 · 63% · R7**.
The Keertana pair is the ISIN-vs-ISIN showcase: identical Fundamental (110) and Economic (32),
diverging Issuance (76 vs 70), Pricing (150 vs 105) and Total (368·R5 vs 317·R7).

---

## 7. Key components (`src/components/`)

- **`Wordmark`** — two-tone brand (Fundamental ink / Lens teal + aperture glyph). Sizes sm→2xl.
- **`IconRail`** — Tier-1 permanent ~60px icon rail with a hover/focus flyout (labels float over
  content). No brand glyph (brand lives in the top bar). Shared by both workspaces.
- **`UserMenu`** — accessible role/user dropdown (opaque, z-80, outside-click/Esc/arrow keys,
  identity + Switch + Sign out). Used in both layouts.
- **`GlobalSearch`** — company (fuzzy: name/sector/id) **or ISIN (prefix/exact)**; grouped
  autocomplete (Companies / Instruments), `role="combobox"`+`listbox`, ↑/↓/Enter/Esc, outside-click.
  Company → `/app/company/:id`, ISIN → `/app/isin/:isin`. Mounted in **both layouts' top bar** and the
  **dashboard hero**. Replaced InvestorLayout's old company-only inline search.
- **`ActiveIsinsPanel`** — the issuer's ISINs (ISIN · coupon · YTM · residual tenor · issue size ·
  rating · secured/senior · this-ISIN Total /500 + Rating), current highlighted, "Compare ISINs"
  action. Falls back to the single implicit ISIN for issuer-only entities.
- **`IllustrativeBadge`** / **`IllustrativeNotice`** — the §K4 fabricated-ISIN markers. Use these
  **anywhere** the illustrative ISIN can appear (page, panel, search, comparison).
- **`ScoreGauge`** — circular /N gauge, teal→cyan gradient, count-up; right-sized centred number +
  smaller suffix/band line.
- **`ScoreTrend`** — area trend with segmented 3M/6M/12M/All pill; optional **dual-axis share-price**
  overlay (sky line, right axis, toggle) for listed entities.
- **`ScoreComposition`** — "Total Score" panel: four **equal-width** vertical bars (fill height ∝
  score/max), drill-down to pillars → `FactorHeatmap`.
- **`FactorAssessment`** — "What's driving the score" card (10 issuer factors, grade labels, full names).
- **`FactorHeatmap`** — grade-tinted factor tiles (grade label, no %).
- **`ScorecardTable`** — grouped scorecard (category + grade headers, parameter rows with grade chip +
  expandable commentary).
- **`FundamentalScore`** — entity hero: full-width trend on top, then gauge / factor-assessment /
  Total-Score row.
- **`ExpandableAnalysis`** — clamped summary → "Read full analysis". **Qualitative = full prose only;
  Financial = full prose + "Latest quarterly update" + "Outlook".**
- **`DataSourcesPanel`**, **`SignalsFeed`**, **`WeightageWhatIf`** — Data & Signals + the
  client-side "Adjust weightage" what-if (re-weights existing grades; never re-scores).
- **`YieldGauge`**, **`PeerYieldRange`**, **`CovenantTable`**, **`MetricCard`**, **`Sparkline`**
  (now supports `width`/`height`/`strokeWidth`), **`GradeBadge`**, **`ScoreRing`**, **`useCountUp`**.
- **`RatingLens`** — agency letter (input) → Fundamental Score by four weighted pillars (product).
  Used on the landing "See inside the rating" band and the company-page External Ratings section.

### New pages / flows (the 2026 deck-narrative upgrade)
- **`pages/LandingSections.tsx`** — the deck-narrative landing sections (see-inside-the-rating,
  problem before→after, built-for-credit, mid/small-cap gap, competitive landscape, market &
  tailwinds Recharts bar, roadmap rings, tiering ladder). Imported into `Landing.tsx` in order.
- **`pages/investor/Compare.tsx`** — `/app/compare` peer-compare grid (reuses `ScoreGauge`,
  `ScoreComposition`, `YieldGauge`, `GradeBadge`, `FactorHeatmap` tinting; best/worst highlighting).
- **`pages/investor/Sectors.tsx`** + **`SectorDetail.tsx`** — sector index & detail.
- **`pages/UnderwritingFlow.tsx`** — shared 5-stage flow (Invite → Capture → Assess → Deliver →
  Decide) with stepper, proof-point chips, branded-by header, animated sealed engine, decision-ready
  file and human sign-off with audit stamp. `pages/Underwriting.tsx` wraps it for the standalone
  `/underwriting` route; `/app/assess` + `/creator/assess` render it via `context`. (Replaces the
  old `PrivateAssessment.tsx`, now deleted.)
- **`pages/ArchitecturePanels.tsx`** — `DataFlywheel`, `SixLayerArchitecture`, `DataLineage`,
  `PointInTime`. Rendered by `pages/Architecture.tsx` (public) and
  `pages/creator/ArchitectureMirror.tsx`.

---

## 8. Navigation pattern (two-tier)

- **Tier 1** — permanent slim icon rail (`IconRail`), never collapses, hover flyout for labels.
- **Tier 2** — single contextual section panel, **company page only**. One chevron toggle; collapses
  off-canvas to a **distinct 56px section-icon rail** (icons + tooltips), not an empty bar. Financial
  Analysis is a parent with Capitalization / Funding & liquidity / Profitability / Asset quality children.
- Routed content sits in a centred `max-w` container so collapsing widens space symmetrically.
- The company **header is full only on Overview**; slim sticky header (name + sub-sector + score pill)
  on every other section.

---

## 9. Company research page sections (`/app/company/:id`)

**Active ISINs** (the issuer's instruments; also rendered under the no-report placeholder so a
light-coverage issuer like Midland still exposes its ISIN) ·
Overview (8 KPI stat cards · "What's comforting?" + "How your investment is covered" · ownership &
product donuts · Yield Overview last) · **Scorecard** (rating scale + grouped parameter table) ·
**Data & Signals** · **Adjust weightage** (Upgraded) · Business & Management · Financial Analysis
(full N-period tables: sticky indicator column + sticky header, bracketed negatives in Weak colour) ·
Peer Comparison · External Ratings · Recent Developments · NCD Issuances (incl. issuance structure +
covenants) · Sector Outlook · Summary Table · Ask AI.

---

## 10. Landing page order (top → bottom)

1. Sticky nav (single Wordmark + links + Sign in)
2. **Hero** — "Investors' assessment…" headline + 119-factor line + 4 bullets + Enter-as-Investor/
   Creator CTAs + Fundamental Score preview (gauge + bolder full-width mini-trend)
3. Trust strip (stat chips incl. 119/40/79 + deterministic-model line)
4. Tagline section — "Financial inclusion is incomplete…" + subhead
5. Product offerings — "Five ways Fundamental Lens works for you" (lead card + 4)
6. "Who it's for" — grouped vertical-tab audience selector (9 audiences)
7. How it works — 3 steps (01 = "Search your target company")
8. Key aspects — equal-height cards
9. Disclaimer band + footer

---

## 11. Creator workspace

Pipeline (stages: **Data sources** → Capture → Model → Gaps → Score → Report → Review → Publish; one
issuer paused at Gaps with a gap-resolution panel) · Coverage (+ add-coverage flow) · Sector Models
(NBFC active, read-only factor structure) · Settings (mock partner connectors) · Assess private co.

---

## 12. Conventions & guardrails

- **Compliance:** generic disclaimer band only — **never** real SEBI reg numbers, named officers,
  the source report's letterhead/entity name, or disclosure pages. When ingesting report PDFs, take
  only analytical content (grades, commentary, ratios, figures).
- **Theme:** dark glassmorphic. Use existing tokens (`.glass-card`, `.glass-card-elevated`,
  `.btn-gradient`, typography tokens `t-display/t-h1/t-h2/t-h3/t-lead/t-body/t-label/t-eyebrow/
  t-caption/t-metric`). Weight 700 is reserved for big metric numbers.
- **Accessibility:** keyboard-navigable, visible focus, `prefers-reduced-motion` respected
  (global reset), tooltips have labels.
- **Mock everything:** AI desk & AI-RM are scripted; connectors are mock with timestamps; "Adjust
  weightage" re-aggregates existing grades client-side (labelled "What-if — not the published score").

---

## 13. Known limitations / next steps

- **Report data depth:** the four research PDFs were **not** attached in the build sessions, so the
  *complete* N-period ratio tables and per-factor write-ups are fully authored for **KrazyBee**
  (primary) and **Spandana › Profitability** (the canonical example); financial-section
  quarterly/outlook notes exist for all four. The table & write-up components already scale to any N
  rows/periods — re-attaching the PDFs is a pure data-population step (extend `reports.ts` /
  `krazybee.ts`). Per-parameter commentary for Issuance/Pricing/Economic categories is currently
  grade-only.
- **Auth** is in-memory; a reload logs out. Fine for a prototype; swap for real auth at go-live.
- **Bundle size:** single chunk > 500 kB (Recharts). Consider route-level code-splitting if it matters.
- **Real feeds at go-live:** `priceSeries`, `dataSources`, `signals`, AI desk/RM are all mock —
  wire to live feeds/model when productionising.

### Running TODO — the ISIN / covenant upgrade

**Data gaps (surfaced in-app via `IsinAssessment.todo[]`, never silently filled):**
- [ ] **Midland Issuance / Pricing / covenants** — the source report's ISIN header, Pricing section
      and covenant table are **templated off Avanti** and are not Midland's (the Nandan Nilekani
      covenant does not apply to it). Re-seed all three from Midland's own KID. Midland's own ISIN
      is `INE884Q07798`.
- [ ] **Midland external rating is inconsistent** — A-/Negative (Acuité) vs BBB/Stable (Crisil),
      while the ISIN reference table shows A. Currently stubbed `A (TODO — conflicting sources)`.
- [ ] **Midland Combined ≠ sum of components** (3.07 printed vs 3.19 summed) — a template artifact,
      authored as printed. Confirm against Midland's own rating scale.
- [ ] **Midland `established` / `hq`** are `TODO — from KID` stubs and render literally in the UI.
- [ ] **Midland has no `reports.ts` entry** → excluded from `/app/sectors` averages and the
      `/app/compare` selector. Author a full report to include it.
- [ ] **Avanti secondary ISINs** `INE0BNQ07105 / 07113 / 07121` are lightly seeded (terms only);
      `getIsinScore` correctly returns `undefined`. UI must show "not yet assessed".
- [ ] **Keertana `INE0NES07162` is fabricated** (§K4) — only the ISIN and its 12.50% current YTM
      are real. Must render the "Illustrative — not published research" badge on its page and
      anywhere it appears in comparison.
- [ ] **Peer universe** (`peers.ts`) issuers are market-reference only — no Fundamental Score.
- [ ] Optional: real multi-ISIN coverage for **KrazyBee / Spandana** (today: implicit ISIN).
- [ ] **`/app/compare-isins/:issuerId` does not exist** — `ActiveIsinsPanel`'s "Compare ISINs"
      button is a dead link that currently logs the user out (see §4). Build it in the
      comparison slice.
- [ ] `/app/search?q=` (the optional standalone results page) was not built — search is
      autocomplete-only from the two layouts + the dashboard hero.
- [ ] The ISIN page's covenant table is an inline first cut. The covenant-monitoring slice should
      extract it into `<CovenantMonitor>` and add status chips, buffer bars, headroom sparklines
      and the expand-to-chart, then reuse it here.

**Reconcile between the legacy report and the new ISIN layer** (both intentionally left as-is by
the additive restructure — pick one source of truth before go-live):
- [ ] **Keertana Total diverges by surface.** `/app/compare` + `/app/sectors` read the legacy
      `ratingScale` (3.45/5.00 · 69% · R6); the ISIN page reads §K3 (3.68/5.00 · 74% · R5).
      Fundamental (110/200) agrees on both, so sector averages are unaffected.
- [ ] **Instrument terms differ** between `reports.ts` and `isins.ts`: Keertana `INE0NES07220`
      coupon (13.50 legacy vs 11.30 §K3); which Keertana ISIN is `current`; Avanti `INE0BNQ07154`
      allotment (20 May 2026 legacy vs 26 Dec 2025 §K2). The ISIN layer follows §K.
- [ ] **Keertana Management & Governance grade label**: `reports.ts` says `Weak` at pct 20; §K3
      says `EW 20`. pct 20 maps to Extremely Weak under `GRADE_POINTS`. Left untouched because
      `/app/compare`'s factor heatmap tints off the authored grade.

---

## 14. Git / workflow notes

- Commit messages end with the `Co-Authored-By: Claude Opus 4.8` trailer.
- On Windows PowerShell, prefer single-quoted `git commit -m '...'` (double quotes / parentheses /
  ellipses in messages have broken the parser).
- LF→CRLF warnings on commit are harmless.
- StackBlitz caches the last commit — hard-refresh, or use
  `…/fundamental-lens/tree/<commit>` to force the newest.
