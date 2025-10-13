import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ClaimFormComponent } from '../claim-form/claim-form.component';
import { ClaimListComponent } from '../claim-list/claim-list.component';
import { ScoreGaugeComponent } from '../score-gauge/score-gauge.component';
import { ScoringService } from '../../services/scoring.service';
import { Claim, NewClaimData } from '../../models/claim.model';
import { CommonModule } from '@angular/common';
import { GeminiService } from '../../services/gemini.service';
import { GeneticMarkersService } from '../../services/genetic-markers.service';
import { GeneticMarker } from '../../models/genetic-marker.model';
import { ClaimHistoryService } from '../../services/claim-history.service';
import { ClaimHistoryChartComponent } from '../claim-history-chart/claim-history-chart.component';
import { SemanticScholarService } from '../../services/semantic-scholar.service';
import { ScholarPaper } from '../../models/scholar-paper.model';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ClaimFormComponent,
    ClaimListComponent,
    ScoreGaugeComponent,
    ClaimHistoryChartComponent,
  ],
})
export class DashboardComponent {
  private scoringService = inject(ScoringService);
  private geminiService = inject(GeminiService);
  private geneticMarkersService = inject(GeneticMarkersService);
  private claimHistoryService = inject(ClaimHistoryService);
  private semanticScholarService = inject(SemanticScholarService);

  claims = signal<Claim[]>(this.claimHistoryService.getClaims());
  isScoring = signal(false);
  selectedClaim = signal<Claim | undefined>(undefined);
  
  aiAnalysis = signal<string | null>(null);
  isAnalyzing = signal(false);
  
  scholarResults = signal<ScholarPaper[] | null>(null);
  isSearchingScholar = signal(false);

  scoringStatus = this.scoringService.currentStatus;

  sortedClaims = computed(() => 
    this.claims().slice().sort((a, b) => b.submissionDate.getTime() - a.submissionDate.getTime())
  );

  markerDetails = computed(() => {
    const claim = this.selectedClaim();
    if (!claim) return [];
    const markerMap = this.geneticMarkersService.getMarkerMap();
    return claim.geneticMarkers.map(rsId => markerMap.get(rsId)).filter(Boolean) as GeneticMarker[];
  });

  claimantHistory = computed(() => {
    const selected = this.selectedClaim();
    if (!selected) return [];
    return this.claims()
      .filter(c => c.claimantId === selected.claimantId)
      .sort((a, b) => a.submissionDate.getTime() - b.submissionDate.getTime());
  });

  handleNewClaim(claimData: NewClaimData) {
    this.isScoring.set(true);
    this.selectedClaim.set(undefined);
    this.aiAnalysis.set(null);
    this.scholarResults.set(null);
    this.scoringService.scoreClaim(claimData).subscribe({
      next: (scoredClaim) => {
        this.claimHistoryService.saveClaim(scoredClaim);
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
    this.aiAnalysis.set(null);
    this.scholarResults.set(null);
  }
  
  async generateAiAnalysis() {
    const currentClaim = this.selectedClaim();
    if (!currentClaim) return;
    
    this.isAnalyzing.set(true);
    this.aiAnalysis.set(null);
    this.isSearchingScholar.set(true);
    this.scholarResults.set(null);

    try {
      const markerDetails = this.markerDetails();
      // Create a focused query from the most impactful markers
      const query = markerDetails.map(m => `"${m.gene}" "${m.associatedCondition}"`).slice(0, 3).join(' OR ');

      const geminiPromise = this.geminiService.analyzeClaim(currentClaim);
      const scholarPromise = firstValueFrom(this.semanticScholarService.searchPublications(query));
      
      const [analysis, scholarData] = await Promise.all([geminiPromise, scholarPromise]);

      this.aiAnalysis.set(analysis);
      this.scholarResults.set(scholarData);
    } catch (error) {
      console.error('Error during analysis generation:', error);
      this.aiAnalysis.set('Failed to generate AI analysis.');
      this.scholarResults.set([]);
    } finally {
      this.isAnalyzing.set(false);
      this.isSearchingScholar.set(false);
    }
  }

  formatAuthors(authors: { name: string }[]): string {
    if (!authors || authors.length === 0) {
      return 'N/A';
    }
    return authors.map(a => a.name).join(', ');
  }
}