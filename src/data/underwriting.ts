import type { Grade } from './types';

// MOCK white-label underwriting fixtures. Everything here is a pre-authored output —
// the app never computes a score. The AI captures inputs; the sealed model returns a
// finished draft assessment, which a human approver signs off.

export const MODEL_VERSION = 'FL-Engine v4.8 · factor-set 2026.2';

export interface BorrowerFixture {
  id: string;
  name: string;         // generic placeholder entity (never a real report issuer)
  sector: string;
  entityId: string;     // mock ISIN / entity id
  lender: string;       // white-label brand shown in the header
  requested: string;    // facility being assessed
  headline: string;
}

export interface IntakeMessage {
  category: string;
  pillar: string;       // which pillar this input feeds
  question: string;
  answer: string;       // scripted borrower/RM response
}

export interface DraftPillar {
  key: 'issuer' | 'pricing' | 'issuance' | 'economic';
  label: string;
  pct: number;
  weight: number;       // Issuer 40 · Pricing 30 · Issuance 20 · Economic 10
  grade: Grade;
}

export interface DraftFactor { name: string; grade: Grade; pct: number; }

export interface DraftAssessment {
  fundamental: { score: number; max: 200; pct: number; grade: Grade };
  total: { score: number; max: 500; pct: number; rating: number };
  pillars: DraftPillar[];
  factors: DraftFactor[];
  strengths: string[];
  risks: string[];
  collateralCovenant: string[];
  rationale: string;
}

export interface UnderwritingFixture {
  borrower: BorrowerFixture;
  intake: IntakeMessage[];
  draft: DraftAssessment;
}

// The five pillars used to animate the "engine running" step.
export const PILLAR_STEPS = [
  { key: 'issuer', label: 'Issuer fundamentals', weight: 40 },
  { key: 'pricing', label: 'Pricing & yield', weight: 30 },
  { key: 'issuance', label: 'Issuance assessment', weight: 20 },
  { key: 'economic', label: 'Economic & sector', weight: 10 },
] as const;

export const PROOF_POINTS = [
  'Hours, not days',
  'Depth beyond a bureau score',
  'Explainable & auditable',
  'Lender owns the decision',
];

const gradeFor = (pct: number): Grade =>
  pct >= 80 ? 'Extremely Strong' : pct >= 65 ? 'Strong' : pct >= 50 ? 'Moderate' : pct >= 35 ? 'Weak' : 'Extremely Weak';

// ── Fixture 1 — MSME secured lender ───────────────────────────────────────────

const prarambhIntake: IntakeMessage[] = [
  { category: 'Company basics', pillar: 'Issuer', question: "Let's start with the basics — what's the legal name and where are you based?", answer: 'Prarambh Capital Pvt Ltd · incorporated 2017 · Pune' },
  { category: 'Company basics', pillar: 'Issuer', question: 'What sector and product do you lend into?', answer: 'NBFC — secured MSME lending (loan-against-property led)' },
  { category: 'Company basics', pillar: 'Issuer', question: 'And current assets-under-management?', answer: '₹1,240 Cr (3Q FY26)' },
  { category: 'Capitalization', pillar: 'Issuer', question: 'What is net worth and total capital adequacy?', answer: 'Net worth ₹310 Cr · Total CAR 22.4%' },
  { category: 'Capitalization', pillar: 'Issuer', question: 'Leverage (debt / net worth)?', answer: '3.0x' },
  { category: 'Profitability', pillar: 'Issuer', question: 'Return on assets and net interest margin?', answer: 'RoAA 2.1% · NIM 8.9%' },
  { category: 'Profitability', pillar: 'Issuer', question: 'Cost-to-income?', answer: '58%' },
  { category: 'Funding & liquidity', pillar: 'Issuer', question: 'How is the book funded, and what is your LCR?', answer: 'Banks 60% / NCDs 30% / other 10% · LCR 140%' },
  { category: 'Funding & liquidity', pillar: 'Issuer', question: 'Any cumulative ALM mismatch within one year?', answer: 'No cumulative <1yr shortfall' },
  { category: 'Asset quality', pillar: 'Issuer', question: 'Gross and net NPA, and how much is secured?', answer: 'GNPA 2.8% · NNPA 1.1% · 85% secured against collateral' },
  { category: 'Management & governance', pillar: 'Issuer', question: 'Tell me about leadership and key-person dependency.', answer: 'Founder-led; 2 independent directors on a 7-member board' },
  { category: 'Management & governance', pillar: 'Issuer', question: 'Auditor and governance posture?', answer: 'Big-6 auditor; quarterly board; no audit qualifications' },
  { category: 'Issuance', pillar: 'Issuance', question: 'What facility are we assessing, and what security is offered?', answer: '₹75 Cr NCD · senior secured · 1.15x cover · rating step-up covenant' },
  { category: 'Pricing', pillar: 'Pricing', question: 'Indicative coupon and tenor?', answer: '11.75% · 24 months · monthly coupon' },
  { category: 'Economic & sector', pillar: 'Economic', question: 'Any sector or regional exposure worth flagging?', answer: 'West-India concentrated; MSME demand resilient; secured LAP mix cushions downside' },
];

const prarambhDraft: DraftAssessment = {
  fundamental: { score: 148, max: 200, pct: 74, grade: gradeFor(74) },
  total: { score: 358, max: 500, pct: 72, rating: 6 },
  pillars: [
    { key: 'issuer', label: 'Issuer fundamentals', pct: 74, weight: 40, grade: gradeFor(74) },
    { key: 'pricing', label: 'Pricing & yield', pct: 76, weight: 30, grade: gradeFor(76) },
    { key: 'issuance', label: 'Issuance assessment', pct: 70, weight: 20, grade: gradeFor(70) },
    { key: 'economic', label: 'Economic & sector', pct: 62, weight: 10, grade: gradeFor(62) },
  ],
  factors: [
    { name: 'Business Model', grade: gradeFor(70), pct: 70 },
    { name: 'Business Position', grade: gradeFor(60), pct: 60 },
    { name: 'Borrower Profile', grade: gradeFor(72), pct: 72 },
    { name: 'Management & Governance', grade: gradeFor(68), pct: 68 },
    { name: 'Ownership', grade: gradeFor(58), pct: 58 },
    { name: 'Capitalization', grade: gradeFor(72), pct: 72 },
    { name: 'Funding', grade: gradeFor(66), pct: 66 },
    { name: 'Liquidity', grade: gradeFor(78), pct: 78 },
    { name: 'Profitability', grade: gradeFor(70), pct: 70 },
    { name: 'Asset Quality', grade: gradeFor(80), pct: 80 },
  ],
  strengths: [
    '85% secured book (LAP-led) keeps loss-given-default low',
    'Comfortable capital: Total CAR 22.4%, leverage 3.0x',
    'Healthy liquidity — LCR 140% with no <1yr ALM shortfall',
    'Clean governance: Big-6 auditor, no audit qualifications',
  ],
  risks: [
    'Founder key-person dependency on a 7-member board',
    'West-India geographic concentration',
    'GNPA at 2.8% — monitor seasoning of the LAP book',
  ],
  collateralCovenant: [
    'Senior secured NCD with 1.15x security cover',
    'Rating step-up covenant protects the investor on a downgrade',
    'No cumulative ALM shortfall within one year',
  ],
  rationale: 'Prarambh presents an adequate, secured MSME credit profile. Capitalisation and liquidity are comfortable and the 85%-secured book limits downside, offsetting founder key-person dependency and regional concentration. The proposed ₹75 Cr senior-secured NCD at 11.75% is fairly priced for the assessed risk. Draft Fundamental Score 148/200; recommended for approval subject to covenant confirmation and a concentration review.',
};

// ── Fixture 2 — supply-chain / working-capital lender ─────────────────────────

const veloxIntake: IntakeMessage[] = [
  { category: 'Company basics', pillar: 'Issuer', question: "What's the legal name, base and product?", answer: 'Velox Finserv Pvt Ltd · Ahmedabad · supply-chain / working-capital finance' },
  { category: 'Company basics', pillar: 'Issuer', question: 'Current AUM?', answer: '₹680 Cr (3Q FY26)' },
  { category: 'Capitalization', pillar: 'Issuer', question: 'Net worth, CAR and leverage?', answer: 'Net worth ₹120 Cr · Total CAR 18.1% · leverage 4.4x' },
  { category: 'Profitability', pillar: 'Issuer', question: 'RoAA, NIM and cost-to-income?', answer: 'RoAA 1.3% · NIM 6.4% · C/I 66%' },
  { category: 'Funding & liquidity', pillar: 'Issuer', question: 'Funding mix and LCR?', answer: 'Banks 45% / NCDs 40% / securitization 15% · LCR 118%' },
  { category: 'Asset quality', pillar: 'Issuer', question: 'GNPA / NNPA and secured share?', answer: 'GNPA 3.9% · NNPA 1.8% · ~55% secured' },
  { category: 'Management & governance', pillar: 'Issuer', question: 'Leadership and audit posture?', answer: 'Professional CEO; 1 independent director; mid-tier auditor' },
  { category: 'Issuance', pillar: 'Issuance', question: 'Facility and security offered?', answer: '₹40 Cr NCD · secured · 1.05x cover' },
  { category: 'Pricing', pillar: 'Pricing', question: 'Indicative coupon and tenor?', answer: '13.25% · 18 months' },
  { category: 'Economic & sector', pillar: 'Economic', question: 'Sector exposure to flag?', answer: 'Cyclical SME receivables; single-anchor concentration in a few programs' },
];

const veloxDraft: DraftAssessment = {
  fundamental: { score: 118, max: 200, pct: 59, grade: gradeFor(59) },
  total: { score: 292, max: 500, pct: 58, rating: 8 },
  pillars: [
    { key: 'issuer', label: 'Issuer fundamentals', pct: 59, weight: 40, grade: gradeFor(59) },
    { key: 'pricing', label: 'Pricing & yield', pct: 64, weight: 30, grade: gradeFor(64) },
    { key: 'issuance', label: 'Issuance assessment', pct: 56, weight: 20, grade: gradeFor(56) },
    { key: 'economic', label: 'Economic & sector', pct: 50, weight: 10, grade: gradeFor(50) },
  ],
  factors: [
    { name: 'Business Model', grade: gradeFor(55), pct: 55 },
    { name: 'Business Position', grade: gradeFor(48), pct: 48 },
    { name: 'Borrower Profile', grade: gradeFor(52), pct: 52 },
    { name: 'Management & Governance', grade: gradeFor(50), pct: 50 },
    { name: 'Ownership', grade: gradeFor(60), pct: 60 },
    { name: 'Capitalization', grade: gradeFor(58), pct: 58 },
    { name: 'Funding', grade: gradeFor(54), pct: 54 },
    { name: 'Liquidity', grade: gradeFor(64), pct: 64 },
    { name: 'Profitability', grade: gradeFor(56), pct: 56 },
    { name: 'Asset Quality', grade: gradeFor(50), pct: 50 },
  ],
  strengths: [
    'Diversified funding incl. securitization access',
    'Adequate liquidity buffer (LCR 118%)',
    'Positive returns through the cycle (RoAA 1.3%)',
  ],
  risks: [
    'Thinner capital — CAR 18.1%, leverage 4.4x',
    'GNPA elevated at 3.9%; only ~55% secured',
    'Single-anchor program concentration; weaker governance depth',
  ],
  collateralCovenant: [
    'Secured NCD but a slim 1.05x cover',
    'No rating step-up protection disclosed',
    'Concentration in a few anchor programs raises event risk',
  ],
  rationale: 'Velox is a sub-investment-grade profile: thinner capital, elevated GNPA and single-anchor concentration weigh on the assessment, only partly offset by diversified funding and adequate liquidity. The proposed ₹40 Cr NCD at 13.25% compensates for the risk but the slim 1.05x cover offers limited protection. Draft Fundamental Score 118/200; recommend Refer for enhanced covenants and a concentration cap before approval.',
};

export const FIXTURES: UnderwritingFixture[] = [
  {
    borrower: { id: 'prarambh', name: 'Prarambh Capital Pvt Ltd', sector: 'NBFC · Secured MSME', entityId: 'MOCK-ENTITY-PRB-017', lender: 'Meridian Capital', requested: '₹75 Cr senior-secured NCD', headline: 'Secured MSME lender · adequate, secured profile' },
    intake: prarambhIntake,
    draft: prarambhDraft,
  },
  {
    borrower: { id: 'velox', name: 'Velox Finserv Pvt Ltd', sector: 'NBFC · Supply-chain finance', entityId: 'MOCK-ENTITY-VLX-021', lender: 'Meridian Capital', requested: '₹40 Cr secured NCD', headline: 'Working-capital lender · watch capital & concentration' },
    intake: veloxIntake,
    draft: veloxDraft,
  },
];

export const getFixture = (id: string): UnderwritingFixture | undefined =>
  FIXTURES.find(f => f.borrower.id === id);
