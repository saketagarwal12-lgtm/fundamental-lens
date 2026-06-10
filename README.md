# Fundamental Lens — Frontend Prototype

**Financial inclusion is incomplete without the democracy of financial research.**

Institutional-grade NBFC credit research, opened up to every investor.

---

## Quick Start

### Prerequisites

Install **Node.js 18+** from https://nodejs.org (LTS version recommended).

After installing, open a new terminal/PowerShell window and verify:
```
node --version   # should print v18.x.x or higher
npm --version    # should print 9.x.x or higher
```

### Install & Run

```powershell
cd "C:\Users\Saket Agarwal\OneDrive - AI GROWTH PRIVATE LIMITED\Desktop\Claude code\fundamental-lens"
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

### Build for Production

```powershell
npm run build
npm run preview   # serves the production build locally
```

---

## Project Structure

```
fundamental-lens/
├── src/
│   ├── App.tsx                          # Root router
│   ├── main.tsx                         # Entry point
│   ├── index.css                        # Tailwind + Google Fonts
│   ├── brand.ts                         # Brand constants
│   ├── components/
│   │   ├── Wordmark.tsx                 # Logo component
│   │   ├── GradeBadge.tsx               # Extremely Strong/Strong/Moderate/Weak badge
│   │   ├── ScoreRing.tsx                # Circular health score SVG ring
│   │   ├── MetricCard.tsx               # KPI card
│   │   └── Sparkline.tsx                # 80×32 trend sparkline
│   ├── contexts/
│   │   └── AuthContext.tsx              # Role-based auth (investor / creator)
│   ├── data/
│   │   ├── types.ts                     # Grade, Recommendation types
│   │   ├── companies.ts                 # 5 NBFC companies index
│   │   ├── krazybee.ts                  # Full KrazyBee research data
│   │   └── portfolio.ts                 # Portfolio holdings data
│   ├── layouts/
│   │   ├── InvestorLayout.tsx           # Dark sidebar + top bar for investors
│   │   └── CreatorLayout.tsx            # Dark sidebar + top bar for creators
│   └── pages/
│       ├── Landing.tsx                  # Marketing landing page + sign-in modal
│       ├── investor/
│       │   ├── Dashboard.tsx            # Portfolio table with sparklines
│       │   ├── PortfolioScore.tsx       # Score rings, radar chart, bar chart
│       │   ├── Watchlist.tsx            # Add/remove issuer watchlist
│       │   ├── Reports.tsx              # PDF report library
│       │   ├── Alerts.tsx               # Material change alerts + preferences
│       │   ├── UserProfile.tsx          # Profile & display settings
│       │   └── company/
│       │       └── CompanyPage.tsx      # Full company deep-dive (9 sections)
│       └── creator/
│           ├── Pipeline.tsx             # 8-stage pipeline stepper
│           ├── Coverage.tsx             # Coverage management table
│           ├── SectorModels.tsx         # NBFC scoring model configurator
│           └── Settings.tsx             # Team, notifications, data sources
├── public/
│   └── favicon.svg
├── index.html
├── tailwind.config.js
├── postcss.config.js
├── vite.config.ts
├── tsconfig.json
└── package.json
```

---

## Features

### Investor View
- **Landing page** — Marketing page with live scorecard preview, feature cards, how-it-works steps, sign-in modal with role selection
- **Dashboard** — Holdings table with health scores, sparklines, GNPA, Total CAR, alerts; customisable columns
- **Portfolio Score** — Average score ring, bar chart by issuer, radar pillar comparison, grade distribution
- **Company page (KrazyBee)** — Full deep-dive with 9 sections:
  - Overview: health score trend chart with annotated events, scorecard with expandable pillars, ownership donut, borrower mix donut
  - Business & Management: 5 qualitative factor cards with full commentary
  - Financial Analysis: 4 financial sections (Capitalization, Funding/Liquidity, Profitability, Asset Quality) with data tables and commentary
  - External Ratings: agency rationale + our view vs agency
  - Recent Developments: material events timeline
  - NCD Issuances: ISIN table with YTM, tenor, maturity
  - Sector Outlook: NBFC and digital PL sub-sector analysis
  - Summary Table: all key metrics in one place
  - Ask AI: pre-baked Q&A + free-text questions against research data
- **Watchlist** — Add/remove issuers, search coverage universe
- **Reports** — PDF report library with date, type, page count
- **Alerts** — Material change feed + alert preference toggles
- **Profile** — Display preferences, sign out

### Creator View
- **Pipeline** — 8-stage horizontal stepper (Documents → Publish) per issuer, expandable gap resolution panel for blocked issuers
- **Coverage** — Management table with status filter, add coverage modal
- **Sector Models** — NBFC model with expandable pillars; configure factor weights and grade anchors
- **Settings** — Pipeline notifications, team permissions, data source connections

---

## Tech Stack

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI framework |
| TypeScript | 5.5 | Type safety |
| Vite | 5.4 | Build tool / dev server |
| React Router DOM | 6.26 | Client-side routing |
| Recharts | 2.13 | Charts (line, bar, radar, pie) |
| Lucide React | 0.441 | Icons |
| Tailwind CSS | 3.4 | Utility-first styling |

---

## Design System

| Token | Value | Use |
|---|---|---|
| `ink` | `#191D26` | Sidebar, headings |
| `brand` | `#0F6E64` | Primary actions, active states |
| `brand-deep` | `#0A4F48` | Hover states |
| `brand-tint` | `#E4EFEC` | Highlighted backgrounds |
| `paper` | `#F4F5F2` | Page background |
| `hairline` | `#E4E5E0` | Borders |
| `muted` | `#6A6E76` | Secondary text |

**Grade colours:**
- Extremely Strong: `#1B6E4B`
- Strong: `#2F8A5F`
- Moderate: `#C08A2E`
- Weak: `#B5524A`

**Fonts:** Public Sans (sans), Newsreader (serif), IBM Plex Mono (numbers)

---

## Disclaimer

This is a prototype for demonstration purposes. All research content is for informational purposes only and does not constitute personalised investment advice. Read all offer documents before investing.
