// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class SubtopicService {
  
// }

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CrudService, Page, QueryParams } from '../../../layouts/maintenance-layout/maintenance-layout.component';

// Define estos DTOs de forma similar a los de Topic
export interface SubtopicResponseDTO {
  id: number;
  title: string;
  topicId: number;
  topicTitle: string;
}

export interface SubtopicRequestDTO {
  title: string;
  topicId: number;
}

@Injectable({ providedIn: 'root' })
export class SubtopicService implements CrudService<SubtopicResponseDTO> {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/subtopics`;

  list(params: QueryParams = {}): Observable<Page<SubtopicResponseDTO>> {
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 0).toString())
      .set('size', (params.size ?? 10).toString());

    if (params.filters?.['global']) {
      httpParams = httpParams.set('search', params.filters['global']);
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(res => ({
        content: (res.content || res) as SubtopicResponseDTO[],
        totalElements: res.totalElements || (res.length || 0)
      }))
    );
  }

  create(data: SubtopicRequestDTO): Observable<SubtopicResponseDTO> {
    return this.http.post<SubtopicResponseDTO>(this.apiUrl, data);
  }

  update(id: number | string, data: SubtopicRequestDTO): Observable<SubtopicResponseDTO> {
    return this.http.put<SubtopicResponseDTO>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}