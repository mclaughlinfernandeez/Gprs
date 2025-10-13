import { Injectable, signal } from '@angular/core';
import { Observable, of, from, concat, timer } from 'rxjs';
import { map, delay, concatMap, tap } from 'rxjs/operators';
import { Claim, NewClaimData, RiskTier } from '../models/claim.model';

@Injectable({
  providedIn: 'root',
})
export class ScoringService {

  public readonly currentStatus = signal<string>('');

  scoreClaim(newClaim: NewClaimData): Observable<Claim> {
    const alpha = 0.6; // Weighting factor from the patent

    // 1. Simulate PRS calculation
    const prs = this.calculatePRS(newClaim.geneticMarkers);
    
    // 2. Simulate PHS calculation (using input directly for simplicity)
    const phs = this.calculatePHS(newClaim.phenotypicScoreInput);
    
    // 3. Standardize PRS (mock standardization)
    const standardizedPrs = (prs - 50) / 15; // Assume mean 50, stddev 15
    const standardizedPhs = (phs - 50) / 20; // Assume mean 50, stddev 20

    // 4. Combine into GPRS
    const gprs = alpha * standardizedPrs + (1 - alpha) * standardizedPhs;
    const gprsScaled = this.scaleGprs(gprs);

    // 5. Determine Risk Tier
    const riskTier = this.getRiskTier(gprsScaled);

    const fullClaim: Claim = {
      id: `C-${Date.now()}`,
      claimantId: newClaim.claimantId,
      geneticMarkers: newClaim.geneticMarkers,
      phenotypicScoreInput: newClaim.phenotypicScoreInput,
      submissionDate: new Date(),
      prs: parseFloat(prs.toFixed(2)),
      phs: parseFloat(phs.toFixed(2)),
      gprs: parseFloat(gprsScaled.toFixed(2)),
      riskTier,
      status: 'Completed',
    };
    
    const processingSteps = [
      { status: 'Initializing PQC Security Module...', duration: 500 },
      { status: `Computing Polygenic Risk Score (PRS): ${fullClaim.prs}`, duration: 800 },
      { status: `Computing Phenotypic Score (PHS): ${fullClaim.phs}`, duration: 600 },
      { status: `Combining scores into GPRS (α=${alpha})...`, duration: 700 },
      { status: `Calibrating GPRS (${fullClaim.gprs}) to Risk Tier: ${fullClaim.riskTier}`, duration: 500 },
      { status: 'Encrypting payload with QRDE-AEAD (Kyber-768)...', duration: 900 },
      { status: 'Signing audit log with HSS-LMS...', duration: 600 },
      { status: 'Processing complete.', duration: 500 },
    ];
    
    this.currentStatus.set('Starting secure scoring...');

    return from(processingSteps).pipe(
      concatMap(step => 
        of(step.status).pipe(
          tap(status => this.currentStatus.set(status)),
          delay(step.duration)
        )
      ),
      concatMap((status, index) => {
        if(index === processingSteps.length - 1) {
          return of(fullClaim);
        }
        return new Observable<never>();
      })
    );
  }

  private calculatePRS(geneticMarkers: number): number {
    // Simplified simulation: score increases with markers, with some noise
    return Math.min(100, Math.max(0, (geneticMarkers / 1000) * 50 + Math.random() * 20));
  }
  
  private calculatePHS(phenotypicScore: number): number {
    // Directly use the input for simulation
    return phenotypicScore;
  }

  private scaleGprs(gprs: number): number {
    // Scale the raw GPRS score to a 0-100 range for display
    const scaled = 50 + (gprs * 25);
    return Math.max(0, Math.min(100, scaled));
  }

  private getRiskTier(gprs: number): RiskTier {
    if (gprs >= 95) return 'Critical';
    if (gprs >= 80) return 'High';
    if (gprs >= 50) return 'Moderate';
    return 'Low';
  }
}
