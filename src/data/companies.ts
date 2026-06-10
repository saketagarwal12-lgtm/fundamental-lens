import type { Recommendation } from './types';

export interface Company {
  id: string;
  name: string;
  sector: string;
  subSector: string;
  established: string;
  hq: string;
  externalRating: string;
  ratingAgency: string;
  ratingDate: string;
  recommendation: Recommendation;
  healthScore: number;
  internalRating: number;
  combinedScore: string;
}

export const companies: Company[] = [
  {
    id: 'krazybee',
    name: 'KrazyBee Services Limited',
    sector: 'NBFC',
    subSector: 'Unsecured Personal Loans',
    established: 'March 2016',
    hq: 'Bangalore',
    externalRating: 'A (Stable)',
    ratingAgency: 'CARE Ratings',
    ratingDate: 'Mar 2026',
    recommendation: 'Subscribe',
    healthScore: 65,
    internalRating: 7,
    combinedScore: '3.27/5.00',
  },
  {
    id: 'finora',
    name: 'Finora Capital Limited',
    sector: 'NBFC',
    subSector: 'MSME Lending',
    established: 'January 2018',
    hq: 'Mumbai',
    externalRating: 'BBB+ (Stable)',
    ratingAgency: 'ICRA',
    ratingDate: 'Feb 2026',
    recommendation: 'Neutral',
    healthScore: 54,
    internalRating: 9,
    combinedScore: '2.71/5.00',
  },
  {
    id: 'vaikha',
    name: 'Vaikha Finserv Private Limited',
    sector: 'NBFC',
    subSector: 'Rural Microfinance',
    established: 'June 2015',
    hq: 'Jaipur',
    externalRating: 'BBB (Negative)',
    ratingAgency: 'CRISIL',
    ratingDate: 'Jan 2026',
    recommendation: 'Avoid',
    healthScore: 42,
    internalRating: 11,
    combinedScore: '2.12/5.00',
  },
  {
    id: 'northpoint',
    name: 'Northpoint NBFC Limited',
    sector: 'NBFC',
    subSector: 'Vehicle Finance',
    established: 'September 2012',
    hq: 'Chennai',
    externalRating: 'A- (Stable)',
    ratingAgency: 'CRISIL',
    ratingDate: 'Mar 2026',
    recommendation: 'Subscribe',
    healthScore: 71,
    internalRating: 6,
    combinedScore: '3.54/5.00',
  },
  {
    id: 'saral',
    name: 'Saral Finance Limited',
    sector: 'NBFC',
    subSector: 'Gold Loans',
    established: 'April 2010',
    hq: 'Hyderabad',
    externalRating: 'AA- (Stable)',
    ratingAgency: 'CARE Ratings',
    ratingDate: 'Feb 2026',
    recommendation: 'Subscribe',
    healthScore: 78,
    internalRating: 5,
    combinedScore: '3.91/5.00',
  },
];
