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
    companyId: 'spandana',
    companyName: 'Spandana Sphoorty Financial Limited',
    sector: 'NBFC – Microfinance',
    healthScore: 70,
    previousScore: 66,
    trend: [70, 69, 68, 66, 67, 69, 70, 70, 70, 70, 70, 70],
    externalRating: 'BBB+ (Negative)',
    gnpa: 4.20,
    totalCAR: 40.30,
    recommendation: 'Subscribe',
    alerts: ['Rating downgraded A- → BBB+ (Negative)', 'New MD & CEO appointed Nov 2025'],
  },
  {
    companyId: 'keertana',
    companyName: 'Keertana Finserv Limited',
    sector: 'NBFC – Gold Loan',
    healthScore: 69,
    previousScore: 70,
    trend: [70, 70, 70, 69, 69, 70, 68, 69, 69, 69, 69, 69],
    externalRating: 'BBB+ (Stable)',
    gnpa: 1.38,
    totalCAR: 26.21,
    recommendation: 'Subscribe',
    alerts: ['Gold AUM now ~91% of book'],
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
