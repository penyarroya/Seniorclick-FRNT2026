// import { Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { environment } from '../../../../../environments/environment';

// @Injectable({ providedIn: 'root' })
// export class ContributionService {
//   private apiUrl = `${environment.apiUrl}/api/contributions`;

//   constructor(private http: HttpClient) {}

//   // CAMBIO: Cambiar getAll por list y añadir soporte para paginación (request)
//   list(request: any): Observable<any> {
//     // Si tu backend soporta Pageable, pasamos los parámetros
//     const params = new HttpParams()
//       .set('page', request.page || 0)
//       .set('size', request.size || 10);

//     return this.http.get<any>(this.apiUrl, { params });
//   }

//   // Añadir al ContributionService
//   create(data: any): Observable<any> {
//     return this.http.post<any>(this.apiUrl, data);
//   }

//   update(id: number | string, data: any): Observable<any> {
//     return this.http.put<any>(`${this.apiUrl}/${id}`, data);
//   }

//   delete(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { ContributionResponseDTO } from '../../../models/universilabas/contributions/contribution-response.model';

// Definimos una interfaz para tener tipado fuerte
// export interface ContributionResponseDTO {
//   id: number;
//   content: string;
//   createdAt: string;
//   pageId: number;
//   pageTitle: string;
//   userName: string;
// }

@Injectable({ providedIn: 'root' })
export class ContributionService {
  private apiUrl = `${environment.apiUrl}/api/contributions`;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene todas las contribuciones (Admin)
   */
  list(request: any): Observable<any> {
    const params = new HttpParams()
      .set('page', request.page || 0)
      .set('size', request.size || 10);

    return this.http.get<any>(this.apiUrl, { params });
  }

  /**
   * NUEVO: Obtiene las aportaciones del usuario logueado
   * GET /api/contributions/user/{userId}
   */
  getByUser(userId: number | string): Observable<ContributionResponseDTO[]> {
    return this.http.get<ContributionResponseDTO[]>(`${this.apiUrl}/user/${userId}`);
  }

  /**
   * Obtiene aportaciones de una página específica
   */
  getByPage(pageId: number | string): Observable<ContributionResponseDTO[]> {
    return this.http.get<ContributionResponseDTO[]>(`${this.apiUrl}/page/${pageId}`);
  }

  create(data: any): Observable<ContributionResponseDTO> {
    return this.http.post<ContributionResponseDTO>(this.apiUrl, data);
  }

  update(id: number | string, data: any): Observable<ContributionResponseDTO> {
    return this.http.put<ContributionResponseDTO>(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}