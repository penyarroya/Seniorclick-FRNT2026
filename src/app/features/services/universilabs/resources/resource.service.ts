// import { inject, Injectable } from '@angular/core';
// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Observable } from 'rxjs';
// import { ResourceDTO } from '../../../models/universilabas/resources/resource.model';
// import { environment } from '../../../../../environments/environment';

// @Injectable({
//   providedIn: 'root'
// })
// export class ResourceService {
//   // La URL base suele venir de tu environment.ts (ej: http://localhost:8080/api)
//   private readonly apiUrl = `${environment.apiUrl}/resources`;
//   private http = inject(HttpClient);

//   /**
//    * Obtiene todos los recursos asociados a una página específica.
//    * Llama al endpoint de Spring: GET /api/resources/page/{pageId}
//    */
//   findByPageId(pageId: number): Observable<ResourceDTO[]> {
//     return this.http.get<ResourceDTO[]>(`${this.apiUrl}/page/${pageId}`);
//   }

//   /**
//    * Crea un nuevo recurso.
//    * Llama al endpoint de Spring: POST /api/resources
//    */
//   create(resource: ResourceDTO): Observable<ResourceDTO> {
//     return this.http.post<ResourceDTO>(this.apiUrl, resource);
//   }

//   /**
//    * Actualiza un recurso existente.
//    * Llama al endpoint de Spring: PUT /api/resources/{id}
//    */
//   update(id: number, resource: ResourceDTO): Observable<ResourceDTO> {
//     return this.http.put<ResourceDTO>(`${this.apiUrl}/${id}`, resource);
//   }

//   /**
//    * Elimina un recurso por su ID.
//    * Llama al endpoint de Spring: DELETE /api/resources/{id}
//    */
//   delete(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }

//   /**
//    * Obtiene un recurso por su ID individual.
//    */
//   findById(id: number): Observable<ResourceDTO> {
//     return this.http.get<ResourceDTO>(`${this.apiUrl}/${id}`);
//   }
// }

import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { QueryParams } from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { ResourceDTO } from '../../../models/universilabas/resources/resource.model';

@Injectable({
  providedIn: 'root'
})
export class ResourceService {
//  
  // private readonly apiUrl = `${environment.apiUrl}/resources`;
  private readonly apiUrl = `${environment.apiUrl}/api/resources`;
  private http = inject(HttpClient);

  /**
   * REQUERIDO POR MAINTENANCE-LAYOUT:
   * Si tu backend aún no tiene un GET /api/resources que devuelva una página,
   * puedes simularlo o pedir todos. 
   * Para que funcione con tu tabla de mantenimiento:
   */
  list(params: QueryParams): Observable<any> {
    // Aseguramos valores por defecto para page y size
    const page = params.page ?? 0;
    const size = params.size ?? 10;
    
    let httpParams = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    // El layout guarda el término de búsqueda en filters.global
    if (params.filters && params.filters['global']) {
      httpParams = httpParams.set('search', params.filters['global']);
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams });
  }

  /**
   * Obtiene todos los recursos asociados a una página específica.
   * Endpoint: GET /api/resources/page/{pageId}
   */
  findByPageId(pageId: number): Observable<ResourceDTO[]> {
    return this.http.get<ResourceDTO[]>(`${this.apiUrl}/page/${pageId}`);
  }

  /**
   * Crea un nuevo recurso.
   * Endpoint: POST /api/resources
   */
  create(resource: ResourceDTO): Observable<ResourceDTO> {
    return this.http.post<ResourceDTO>(this.apiUrl, resource);
  }

  /**
   * Actualiza un recurso existente.
   * Endpoint: PUT /api/resources/{id}
   */
  update(id: number, resource: ResourceDTO): Observable<ResourceDTO> {
    return this.http.put<ResourceDTO>(`${this.apiUrl}/${id}`, resource);
  }

  /**
   * Elimina un recurso por su ID.
   * Endpoint: DELETE /api/resources/{id}
   */
  delete(id: number | string): Observable<void> {
    // Convertimos a número porque tu API de Spring Boot espera un Long
    const numericId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    return this.http.delete<void>(`${this.apiUrl}/${numericId}`);
  }

  /**
   * Obtiene un recurso por su ID individual.
   */
  findById(id: number): Observable<ResourceDTO> {
    return this.http.get<ResourceDTO>(`${this.apiUrl}/${id}`);
  }
}