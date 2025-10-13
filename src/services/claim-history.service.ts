import { Injectable } from '@angular/core';
import { Claim } from '../models/claim.model';

@Injectable({ providedIn: 'root' })
export class ClaimHistoryService {
  private readonly storageKey = 'gprsClaimsHistory';

  getClaims(): Claim[] {
    try {
      const claimsJson = localStorage.getItem(this.storageKey);
      if (!claimsJson) return [];
      const claimsFromStorage = JSON.parse(claimsJson) as Claim[];
      // Convert date strings back to Date objects
      return claimsFromStorage.map(claim => ({
        ...claim,
        submissionDate: new Date(claim.submissionDate),
      }));
    } catch (e) {
      console.error('Error reading claims from localStorage', e);
      return [];
    }
  }

  saveClaim(newClaim: Claim): void {
    try {
      const claims = this.getClaims();
      const updatedClaims = [...claims, newClaim];
      localStorage.setItem(this.storageKey, JSON.stringify(updatedClaims));
    } catch (e) {
      console.error('Error saving claim to localStorage', e);
    }
  }
}
