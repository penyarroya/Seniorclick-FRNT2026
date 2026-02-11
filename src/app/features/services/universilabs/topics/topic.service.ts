import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

// Importamos las interfaces del layout para asegurar compatibilidad
import { CrudService, Page, QueryParams } from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { TopicResponseDTO } from '../../../models/universilabas/topics/topic-response.model';
import { TopicRequestDTO } from '../../../models/universilabas/topics/topic-request.model';

@Injectable({ providedIn: 'root' })
export class TopicService implements CrudService<TopicResponseDTO> {
//  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/topics`;
  

  /**
   * Implementación compatible con MaintenanceLayout (Paginación)
   * params = {} permite llamar a .list() sin argumentos en loadCollections
   */
  list(params: QueryParams = {}): Observable<Page<TopicResponseDTO>> {
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 0).toString())
      .set('size', (params.size ?? 10).toString());

    if (params.filters?.['global']) {
      httpParams = httpParams.set('search', params.filters['global']);
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(res => ({
        // Esto previene errores si el backend devuelve un array directo o un objeto Page
        content: (res.content || res) as TopicResponseDTO[],
        totalElements: res.totalElements || (res.length || 0)
      }))
    );
  }

  create(data: TopicRequestDTO): Observable<TopicResponseDTO> {
    return this.http.post<TopicResponseDTO>(this.apiUrl, data);
  }

  update(id: number | string, data: TopicRequestDTO): Observable<TopicResponseDTO> {
    return this.http.put<TopicResponseDTO>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}