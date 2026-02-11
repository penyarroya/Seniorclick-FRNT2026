import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

import { CrudService, Page, QueryParams } from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { CollectionResponseDTO } from '../../../models/universilabas/collections/collection-response.model';
import { CollectionRequestDTO } from '../../../models/universilabas/collections/collection-request.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionService implements CrudService<CollectionResponseDTO> {
//
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/collections`;

  // Añadimos = {} para que si no mandas nada, use un objeto vacío y no de error
  list(params: QueryParams = {}): Observable<Page<CollectionResponseDTO>> {
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 0).toString())
      .set('size', (params.size ?? 10).toString());

    if (params.filters?.['global']) {
      httpParams = httpParams.set('search', params.filters['global']);
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(res => ({
        // Aseguramos que si la respuesta es una lista directa o paginada funcione
        content: (res.content || res) as CollectionResponseDTO[], 
        totalElements: res.totalElements || (res.length || 0)
      }))
    );
  }

  create(collection: CollectionRequestDTO): Observable<CollectionResponseDTO> {
    return this.http.post<CollectionResponseDTO>(this.apiUrl, collection);
  }

  update(id: number | string, collection: CollectionRequestDTO): Observable<CollectionResponseDTO> {
    return this.http.put<CollectionResponseDTO>(`${this.apiUrl}/${id}`, collection);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}