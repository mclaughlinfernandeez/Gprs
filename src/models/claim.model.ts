export type RiskTier = 'Low' | 'Moderate' | 'High' | 'Critical';

export interface Claim {
  id: string;
  claimantId: string;
  geneticMarkers: number;
  phenotypicScoreInput: number;
  submissionDate: Date;
  prs: number; // Polygenic Risk Score
  phs: number; // Phenotypic Score
  gprs: number; // Genetic–Phenotypic Risk Score
  riskTier: RiskTier;
  status: 'Completed' | 'Processing';
}

export interface NewClaimData {
  claimantId: string;
  geneticMarkers: number;
  phenotypicScoreInput: number;
}
