import { Injectable, inject } from '@angular/core';
import { GoogleGenAI } from '@google/genai';
import { Claim } from '../models/claim.model';
import { GeneticMarkersService } from './genetic-markers.service';

@Injectable({ providedIn: 'root' })
export class GeminiService {
  private ai!: GoogleGenAI;
  private geneticMarkersService = inject(GeneticMarkersService);
  private apiKey = process.env.API_KEY;

  constructor() {
    if (this.apiKey) {
      this.ai = new GoogleGenAI({ apiKey: this.apiKey });
    } else {
      console.error('API_KEY environment variable not set.');
    }
  }

  async analyzeClaim(claim: Claim): Promise<string> {
    if (!this.apiKey) {
        return Promise.resolve("AI analysis is disabled. API_KEY is not configured.");
    }
      
    const markerMap = this.geneticMarkersService.getMarkerMap();
    const selectedMarkersDetails = claim.geneticMarkers.map(rsId => {
      const marker = markerMap.get(rsId);
      if (!marker) return `Unknown marker: ${rsId}`;
      return `- ${marker.rsId} (${marker.gene}): ${marker.functionalImpact}. Associated with ${marker.associatedCondition}. Potential impact on SSA domain: '${marker.relevantSsaSymptoms}'.`;
    }).join('\n');

    const prompt = `
      Analyze the following Social Security Disability claim data and provide a concise, professional narrative summary in markdown format.

      **Claim Data:**
      - **Claimant ID:** ${claim.claimantId}
      - **Polygenic Risk Score (PRS):** ${claim.prs.toFixed(2)}
      - **Phenotypic Health Score (PHS):** ${claim.phs.toFixed(2)}
      - **Final Genetic–Phenotypic Risk Score (GPRS):** ${claim.gprs.toFixed(2)}
      - **Calculated Risk Tier:** ${claim.riskTier}

      **Genetic Markers Considered:**
      ${selectedMarkersDetails}

      **Task:**
      1.  Start with a heading: "### AI-Powered Adjudication Analysis".
      2.  Write a brief overview paragraph summarizing the GPRS score and risk tier.
      3.  Create a section "#### Key Contributing Factors" and briefly explain how the combination of genetic markers and the phenotypic score led to the final risk assessment.
      4.  Create a section "#### SSA Functional Domain Crosswalk" and list 1-3 of the most relevant SSA functional domains that may be impacted, based on the genetic markers. For each domain, provide a brief sentence explaining the connection. Example domains include 'Concentrate, persist, or maintain pace' or 'Interact with others'.
      5.  Conclude with a brief disclaimer that this is an AI-generated analysis for informational purposes and not a substitute for professional medical or legal advice.
    `;

    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });
      return response.text;
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return 'An error occurred while generating the AI analysis. Please check the console for details.';
    }
  }
}