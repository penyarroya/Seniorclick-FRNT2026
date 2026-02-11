import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { InstitutionDTO } from '../../../models/universilabas/institution/institution.model';
import { CrudService, Page, QueryParams } from '../../../layouts/maintenance-layout/maintenance-layout.component';

// Definimos un tipo local que asegure que el ID esté presente para el CrudService
type InstitutionWithId = InstitutionDTO & { id: number | string };

@Injectable({
  providedIn: 'root',
})
export class InstitutionService implements CrudService<InstitutionWithId> {

  private readonly apiUrl = `${environment.apiUrl}/api/universilabs/institutions`;

  constructor(private http: HttpClient) {}

  // ================== CrudService Implementation ==================
  
  list(params?: QueryParams): Observable<Page<InstitutionWithId>> {
    let httpParams = new HttpParams()
      .set('page', (params?.page ?? 0).toString())
      .set('size', (params?.size ?? 10).toString());

    if (params?.filters) {
      Object.keys(params.filters).forEach(key => {
        const value = params.filters![key];
        // Solo enviamos filtros que tengan valor
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value);
        }
      });
    }

    return this.http
      .get<any>(`${this.apiUrl}/page`, { params: httpParams })
      .pipe(
        map(res => ({
          content: res.content as InstitutionWithId[],
          totalElements: res.totalElements 
        }))
      );
  }

  create(dto: Partial<InstitutionWithId>): Observable<InstitutionWithId> {
    return this.http.post<InstitutionWithId>(this.apiUrl, dto);
  }

  update(id: number | string, dto: Partial<InstitutionWithId>): Observable<InstitutionWithId> {
    return this.http.put<InstitutionWithId>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // ================== Validadores Asíncronos ==================

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-email`, { 
      params: { email } 
    });
  }

  checkNameExists(name: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/check-name`, { 
      params: { name } 
    });
  }

  // ================== Métodos Adicionales ==================

  getAll(): Observable<InstitutionDTO[]> {
    return this.http.get<InstitutionDTO[]>(this.apiUrl);
  }

  getById(id: number | string): Observable<InstitutionDTO> {
    return this.http.get<InstitutionDTO>(`${this.apiUrl}/${id}`);
  }

  getCurrent(): Observable<InstitutionDTO> {
    return this.http.get<InstitutionDTO>(`${this.apiUrl}/current`);
  }
}