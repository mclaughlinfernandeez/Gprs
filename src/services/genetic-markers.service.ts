import { Injectable } from '@angular/core';
import { GeneticMarker } from '../models/genetic-marker.model';

@Injectable({ providedIn: 'root' })
export class GeneticMarkersService {
  private markers: GeneticMarker[] = [
    // Dopaminergic
    { rsId: 'rs4680', gene: 'COMT', functionalImpact: '↓ Dopamine metabolism (Val158Met)', associatedCondition: 'ADHD, executive dysfunction', ssaListingCrosswalk: '11.00 / 12.02', relevantSsaSymptoms: 'Disorganization, slowed processing speed', weight: 8 },
    { rsId: 'rs1800497', gene: 'DRD2/ANKK1', functionalImpact: '↓ D2 receptor density (Taq1A)', associatedCondition: 'ADHD, impulse control', ssaListingCrosswalk: '12.11', relevantSsaSymptoms: 'Impulsivity, distractibility', weight: 9 },
    { rsId: 'rs2075654', gene: 'SLC6A3', functionalImpact: 'DAT1 transporter variability', associatedCondition: 'Attention modulation', ssaListingCrosswalk: '11.00B / 12.02A', relevantSsaSymptoms: 'Deficient sustained attention', weight: 9 },
    { rsId: 'rs6277', gene: 'DRD2', functionalImpact: 'Dopamine receptor efficiency (C957T)', associatedCondition: 'Reward-related behavior', ssaListingCrosswalk: '12.04 / 12.11', relevantSsaSymptoms: 'Apathy, emotional dysregulation', weight: 6 },
    // Stress & Neuroplasticity
    { rsId: 'rs1360780', gene: 'FKBP5', functionalImpact: '↑ HPA-axis dysregulation', associatedCondition: 'Stress-related cognitive deficits', ssaListingCrosswalk: '12.15', relevantSsaSymptoms: 'Concentration disruption, emotional lability', weight: 7 },
    { rsId: 'rs6265', gene: 'BDNF', functionalImpact: '↓ Neuroplasticity (Val66Met)', associatedCondition: 'Working memory impairment', ssaListingCrosswalk: '11.00F', relevantSsaSymptoms: 'Verbal memory & learning deficits', weight: 8 },
    // Synaptic & Cortical
    { rsId: 'rs1018381', gene: 'DISC1', functionalImpact: 'Axonal growth & cortical regulation', associatedCondition: 'Executive dysfunction', ssaListingCrosswalk: '11.00C', relevantSsaSymptoms: 'Planning, cognitive slowing', weight: 7 },
    { rsId: 'rs28364072', gene: 'SNAP25', functionalImpact: 'Synaptic efficiency variation', associatedCondition: 'ADHD', ssaListingCrosswalk: '11.00 / 12.11', relevantSsaSymptoms: 'Inattention, distractibility', weight: 8 },
    // Serotonergic & Cholinergic
    { rsId: 'rs13212041', gene: 'HTR1B', functionalImpact: 'Serotonergic signaling', associatedCondition: 'Aggression, impulsivity', ssaListingCrosswalk: '12.08', relevantSsaSymptoms: 'Poor frustration tolerance', weight: 7 },
    { rsId: 'rs13302982', gene: 'CHRNA4', functionalImpact: 'Cholinergic transmission', associatedCondition: 'ADD inattentive subtype', ssaListingCrosswalk: '11.00 / 12.11', relevantSsaSymptoms: 'Short attention span, alertness issues', weight: 6 },
    { rsId: 'rs4475691', gene: 'TPH2', functionalImpact: 'Serotonin synthesis', associatedCondition: 'ADHD, mood regulation', ssaListingCrosswalk: '12.04', relevantSsaSymptoms: 'Sleep/mood irregularities', weight: 7 },
     // Immune & Metabolic
    { rsId: 'rs2097629', gene: 'CD4', functionalImpact: 'T-cell surface antigen', associatedCondition: 'Immune surveillance (HIV)', ssaListingCrosswalk: '14.08', relevantSsaSymptoms: 'CD4 suppression <200/μL', weight: 5 },
    { rsId: 'rs602662', gene: 'FUT2', functionalImpact: 'Secretor phenotype', associatedCondition: 'Mucosal immunity (HIV)', ssaListingCrosswalk: '14.08F', relevantSsaSymptoms: 'Susceptibility to opportunistic infection', weight: 4 },
    { rsId: 'rs1801133', gene: 'MTHFR', functionalImpact: 'Folate metabolism defect (C677T)', associatedCondition: 'Cognitive fatigue, neuroinflammation', ssaListingCrosswalk: '11.00 / 14.08', relevantSsaSymptoms: 'Cognitive dysfunction, inflammation', weight: 8 },
    { rsId: 'rs11240777', gene: 'IL10', functionalImpact: '↓ Anti-inflammatory cytokine', associatedCondition: 'HIV progression', ssaListingCrosswalk: '14.08B', relevantSsaSymptoms: 'Chronic inflammation, fatigue', weight: 6 },
    { rsId: 'rs3131972', gene: 'HLA-DQB1', functionalImpact: 'Autoimmune & immunogenetic risk', associatedCondition: 'HIV/AIDS encephalopathy', ssaListingCrosswalk: '14.08H', relevantSsaSymptoms: 'Cognitive decline, neuroinflammation', weight: 9 },
  ];

  getMarkers() {
    return this.markers;
  }
  
  getMarkerMap(): Map<string, GeneticMarker> {
    return new Map(this.markers.map(m => [m.rsId, m]));
  }
}
