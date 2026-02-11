import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { UserProfileDTO } from '../../../models/universilabas/userprofiles/userprofile.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
//  
  private http = inject(HttpClient);
  // Asegúrate de que coincida con @RequestMapping("/api/profiles") de tu Controller
  private apiUrl = `${environment.apiUrl}/api/profiles`;

  /**
   * Obtiene todos los perfiles mapeados.
   */
  getAll(): Observable<UserProfileDTO[]> {
    return this.http.get<UserProfileDTO[]>(this.apiUrl).pipe(
      map(profiles => profiles.map(p => this.mapId(p)))
    );
  }

  /**
   * Paginación y filtros para el MaintenanceLayout.
   * Ajustado para cumplir con la interfaz Page<T> que requiere el Layout.
   */
  list(params: any): Observable<any> {
    // 1. Limpiamos los parámetros para evitar el error [object Object]
    let httpParams: any = {
      page: params.page,
      size: params.size
    };

    // 2. Si hay un filtro global (el buscador), lo extraemos
    if (params.filters && params.filters.global) {
      httpParams.search = params.filters.global;
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(response => {
        // Normalización de la respuesta para el Layout
        if (response && response.content) {
          return {
            ...response,
            content: response.content.map((p: UserProfileDTO) => this.mapId(p))
          };
        }
        if (Array.isArray(response)) {
          return {
            content: response.map(p => this.mapId(p)),
            totalElements: response.length
          };
        }
        return { content: [], totalElements: 0 };
      })
    );
  }
  
  /**
   * Actualiza el perfil usando el userId en la ruta.
   */
  update(userId: number | string, dto: UserProfileDTO): Observable<UserProfileDTO> {
    return this.http.put<UserProfileDTO>(`${this.apiUrl}/${userId}`, dto).pipe(
      map(p => this.mapId(p))
    );
  }

  /**
   * Elimina el perfil.
   */
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
 * CREAR: Envía el POST a /api/profiles/{userId}
 * Recibimos el userId por separado para asegurar que la URL se construya correctamente.
 */
  create(userId: number | string, dto: UserProfileDTO): Observable<UserProfileDTO> {
    return this.http.post<UserProfileDTO>(`${this.apiUrl}/${userId}`, dto).pipe(
      map(p => this.mapId(p))
    );
  }

  /**
   * Obtiene un perfil individual.
   */
  getById(userId: number | string): Observable<UserProfileDTO> {
    return this.http.get<UserProfileDTO>(`${this.apiUrl}/${userId}`).pipe(
      map(p => this.mapId(p))
    );
  }

  /**
   * Helper para transformar la respuesta del Backend al formato del Layout.
   */
  private mapId(p: UserProfileDTO): any {
    return {
      ...p,
      id: p.userId, // Importante: El layout busca la propiedad 'id' para editar/borrar
      nombre: `${p.firstName} ${p.lastName}`.trim(),
      activo: true, 
      description: p.phone 
    };
  }
}