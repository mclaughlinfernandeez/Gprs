import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ClaimFormComponent } from '../claim-form/claim-form.component';
import { ClaimListComponent } from '../claim-list/claim-list.component';
import { ScoreGaugeComponent } from '../score-gauge/score-gauge.component';
import { ScoringService } from '../../services/scoring.service';
import { Claim, NewClaimData } from '../../models/claim.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ClaimFormComponent,
    ClaimListComponent,
    ScoreGaugeComponent,
  ],
})
export class DashboardComponent {
  private scoringService = inject(ScoringService);

  claims = signal<Claim[]>([]);
  isScoring = signal(false);
  selectedClaim = signal<Claim | undefined>(undefined);

  scoringStatus = this.scoringService.currentStatus;

  sortedClaims = computed(() => 
    this.claims().slice().sort((a, b) => b.submissionDate.getTime() - a.submissionDate.getTime())
  );

  handleNewClaim(claimData: NewClaimData) {
    this.isScoring.set(true);
    this.selectedClaim.set(undefined);
    this.scoringService.scoreClaim(claimData).subscribe({
      next: (scoredClaim) => {
        this.claims.update(claims => [...claims, scoredClaim]);
        this.selectedClaim.set(scoredClaim);
        this.isScoring.set(false);
      },
      error: (err) => {
        console.error('Scoring failed', err);
        this.isScoring.set(false);
        this.scoringStatus.set('Error during scoring process.');
      }
    });
  }

  selectClaim(claim: Claim) {
    this.selectedClaim.set(claim);
  }
}
