import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs'; // <--- AGREGAR 'map' AQUÍ
import { environment } from '../../../../../environments/environment';

import { PageResponseDTO } from '../../../models/universilabas/pages/page-response.model';
import { PageRequestDTO } from '../../../models/universilabas/pages/page-request.model';
import { CrudService, Page, QueryParams } from '../../../layouts/maintenance-layout/maintenance-layout.component';

@Injectable({ providedIn: 'root' })
export class PageService implements CrudService<PageResponseDTO> {
//  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/pages`;

  /**
   * Obtiene una página por su ID
   * Requerido por el PageViewerComponent
   */
  findById(id: number | string): Observable<PageResponseDTO> {
    return this.http.get<PageResponseDTO>(`${this.apiUrl}/${id}`);
  }

  list(params: QueryParams = {}): Observable<Page<PageResponseDTO>> {
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 0).toString())
      .set('size', (params.size ?? 10).toString());

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      // Ahora 'map' será reconocido como el operador de transformación de RxJS
      map(res => ({
        content: (res.content || res) as PageResponseDTO[],
        totalElements: res.totalElements || (res.length || 0)
      }))
    );
  }

  create(data: PageRequestDTO): Observable<PageResponseDTO> {
    return this.http.post<PageResponseDTO>(this.apiUrl, data);
  }

  update(id: number | string, data: PageRequestDTO): Observable<PageResponseDTO> {
    return this.http.put<PageResponseDTO>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}