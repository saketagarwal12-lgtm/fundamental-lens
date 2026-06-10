export interface PortfolioHolding {
  companyId: string;
  companyName: string;
  sector: string;
  healthScore: number;
  previousScore: number;
  trend: number[];
  externalRating: string;
  gnpa: number;
  totalCAR: number;
  recommendation: 'Subscribe' | 'Neutral' | 'Avoid';
  alerts: string[];
}

export const portfolioHoldings: PortfolioHolding[] = [
  {
    companyId: 'krazybee',
    companyName: 'KrazyBee Services Limited',
    sector: 'NBFC – Unsecured PL',
    healthScore: 65,
    previousScore: 62,
    trend: [62, 62, 61, 62, 63, 63, 62, 64, 64, 64, 67, 65],
    externalRating: 'A (Stable)',
    gnpa: 1.53,
    totalCAR: 23.55,
    recommendation: 'Subscribe',
    alerts: ['Series E unicorn round closed Apr 2026', 'Auditor change resolved'],
  },
  {
    companyId: 'northpoint',
    companyName: 'Northpoint NBFC Limited',
    sector: 'NBFC – Vehicle Finance',
    healthScore: 71,
    previousScore: 69,
    trend: [66, 67, 68, 67, 68, 69, 68, 69, 70, 70, 71, 71],
    externalRating: 'A- (Stable)',
    gnpa: 2.1,
    totalCAR: 28.4,
    recommendation: 'Subscribe',
    alerts: [],
  },
  {
    companyId: 'saral',
    companyName: 'Saral Finance Limited',
    sector: 'NBFC – Gold Loans',
    healthScore: 78,
    previousScore: 76,
    trend: [72, 73, 74, 74, 75, 75, 76, 76, 77, 77, 78, 78],
    externalRating: 'AA- (Stable)',
    gnpa: 0.8,
    totalCAR: 32.1,
    recommendation: 'Subscribe',
    alerts: [],
  },
  {
    companyId: 'finora',
    companyName: 'Finora Capital Limited',
    sector: 'NBFC – MSME',
    healthScore: 54,
    previousScore: 57,
    trend: [58, 58, 57, 57, 57, 56, 56, 55, 55, 54, 54, 54],
    externalRating: 'BBB+ (Stable)',
    gnpa: 4.2,
    totalCAR: 19.8,
    recommendation: 'Neutral',
    alerts: ['Score declined 3 points over past 3 months', 'GNPA elevated vs sector'],
  },
];
