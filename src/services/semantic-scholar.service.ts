import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ScholarPaper, ScholarAPIResponse } from '../models/scholar-paper.model';

@Injectable({ providedIn: 'root' })
export class SemanticScholarService {
  private http = inject(HttpClient);
  private readonly apiUrl = 'https://api.semanticscholar.org/graph/v1/paper/search';

  searchPublications(query: string): Observable<ScholarPaper[]> {
    if (!query) {
      return of([]);
    }

    const params = new HttpParams()
      .set('query', query)
      .set('limit', '3')
      .set('fields', 'title,authors,year,url');

    return this.http.get<ScholarAPIResponse>(this.apiUrl, { params }).pipe(
      map(response => response.data?.filter(d => d.title && d.url) || []),
      catchError(error => {
        console.error('Semantic Scholar API error:', error);
        return of([]); // Return empty array on error to not break UI
      })
    );
  }
}
