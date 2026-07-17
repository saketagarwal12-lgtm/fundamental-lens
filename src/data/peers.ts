import type { SectorId } from './sectors';

// ── Peer universe (§K5) ──────────────────────────────────────────────────────
//
// Market-reference comparators only — these are NOT covered issuers and carry no
// Fundamental Score. They exist to give the cross-issuer ISIN comparison (Mode B)
// a market backdrop. Authored figures; no scoring.

export interface PeerInstrument {
  issuer: string;
  sector: SectorId;
  /** AUM as printed in the reference table, e.g. '₹24,274 cr'. */
  aum: string;
  isin: string;
  externalRating: string;
  ytm: number;
  /** Residual tenor band, where the reference table gives one. */
  tenor?: string;
}

export const peerUniverse: PeerInstrument[] = [
  // MFI
  { issuer: 'CreditAccess Gramin', sector: 'mfi', aum: '₹24,274 cr', isin: 'INE741K07504', externalRating: 'AA-', ytm: 10.00, tenor: '19–24m' },
  { issuer: 'Asirvad Micro Finance', sector: 'mfi', aum: '₹7,016 cr', isin: 'INE516Q08398', externalRating: 'AA-', ytm: 10.70, tenor: '31–36m' },
  { issuer: 'Spandana Sphoorty', sector: 'mfi', aum: '₹3,572 cr', isin: 'INE572J07778', externalRating: 'BBB+', ytm: 14.19, tenor: '19–24m' },
  { issuer: 'Sarvagram', sector: 'mfi', aum: '₹1,500–2,000 cr', isin: 'INE0LEQ07087', externalRating: 'BBB+', ytm: 14.50 },
  { issuer: 'Dvara KGFS', sector: 'mfi', aum: '₹1,777 cr', isin: 'INE179P07597', externalRating: 'BBB+', ytm: 12.35, tenor: '13–18m' },
  { issuer: 'Samunnati', sector: 'mfi', aum: '₹1,202 cr', isin: 'INE0N5S07052', externalRating: 'BBB', ytm: 13.23, tenor: '13–18m' },
  // Gold
  { issuer: 'Muthoot MCred', sector: 'gold', aum: '₹4,142 cr', isin: 'INE101Q07BL6', externalRating: 'A', ytm: 11.32 },
  { issuer: 'Finkurve (Arvog)', sector: 'gold', aum: '₹819 cr', isin: 'INE734I07040', externalRating: 'BBB', ytm: 12.02 },
  { issuer: 'Indel Money', sector: 'gold', aum: '₹1,558 cr', isin: 'INE0BUS07BV9', externalRating: 'BBB+', ytm: 12.04 },
  { issuer: 'Muthoot Finance', sector: 'gold', aum: '₹1,46,515 cr', isin: 'INE414G07JD4', externalRating: 'AA+', ytm: 7.66 },
  { issuer: 'Manappuram Finance', sector: 'gold', aum: '₹45,248 cr', isin: 'INE522D07CH7', externalRating: 'AA', ytm: 7.88, tenor: '4–6m' },
  { issuer: 'IIFL Finance', sector: 'gold', aum: '₹22,867 cr', isin: 'INE530B07534', externalRating: 'AA', ytm: 9.25 },
];

export const peersInSector = (sector: SectorId): PeerInstrument[] =>
  peerUniverse.filter(p => p.sector === sector);

export const getPeerInstrument = (isin: string): PeerInstrument | undefined =>
  peerUniverse.find(p => p.isin.toUpperCase() === isin.toUpperCase());
