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
| `/` | Landing + login (role picker) |
| `/app/dashboard` | Investor monitoring dashboard (default) |
| `/app/portfolio-score` | Portfolio Fundamental Score |
| `/app/watchlist`, `/app/reports`, `/app/alerts`, `/app/profile` | Lighter investor pages |
| `/app/assess` | Private-company assessment (AI-RM mock flow) |
| `/app/company/:id` | **Company research page** (the core surface) |
| `/creator/pipeline` | Creator pipeline (default) |
| `/creator/coverage`, `/creator/sector-models`, `/creator/settings` | Creator back-office |
| `/creator/assess` | Private-company assessment (creator mirror) |

Auth is in-memory (`src/contexts/AuthContext.tsx`): choosing a role on the landing logs you in;
a **full browser reload logs you out** (state is not persisted). Role-guarded routes redirect.

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
- **`score.ts`** — score helpers: `getScaledScore(report)` (parses `ratingScale` ×100 into
  components incl. issuer/issuance/pricing/economic), `getIssuerTrend(id)` (/200 monthly series),
  `getPortfolioScore(holdings)` (holding-average issuer /200), `gradeForPct`, `scoreBand`, `toSeries500`.

### The four fully-populated issuers
- **KrazyBee Services Ltd** — NBFC, Unsecured Personal Loans. Primary, most complete entity.
- **Avanti Finance** — NBFC-MFI (Nilekani/NRJN-backed; has Extremely-Weak factors).
- **Keertana Finserv** — Gold loan (LTV buckets, by-segment GNPA).
- **Spandana Sphoorty** — NBFC-MFI, **listed (NSE/BSE, SPANDANA)** → share-price overlay; its
  Profitability table is the full canonical 6-period (FY22–3Q26 × 15 rows) example.

---

## 7. Key components (`src/components/`)

- **`Wordmark`** — two-tone brand (Fundamental ink / Lens teal + aperture glyph). Sizes sm→2xl.
- **`IconRail`** — Tier-1 permanent ~60px icon rail with a hover/focus flyout (labels float over
  content). No brand glyph (brand lives in the top bar). Shared by both workspaces.
- **`UserMenu`** — accessible role/user dropdown (opaque, z-80, outside-click/Esc/arrow keys,
  identity + Switch + Sign out). Used in both layouts.
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

---

## 14. Git / workflow notes

- Commit messages end with the `Co-Authored-By: Claude Opus 4.8` trailer.
- On Windows PowerShell, prefer single-quoted `git commit -m '...'` (double quotes / parentheses /
  ellipses in messages have broken the parser).
- LF→CRLF warnings on commit are harmless.
- StackBlitz caches the last commit — hard-refresh, or use
  `…/fundamental-lens/tree/<commit>` to force the newest.
