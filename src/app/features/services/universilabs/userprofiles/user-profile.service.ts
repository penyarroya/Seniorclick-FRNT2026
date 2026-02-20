// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { catchError, map, Observable } from 'rxjs';
// import { environment } from '../../../../../environments/environment';
// import { UserProfileDTO } from '../../../models/universilabas/userprofiles/userprofile.model';

// @Injectable({ providedIn: 'root' })
// export class UserProfileService {
// //  
//   private http = inject(HttpClient);
//   // Asegúrate de que coincida con @RequestMapping("/api/profiles") de tu Controller
//   private apiUrl = `${environment.apiUrl}/api/profiles`;

//   /**
//    * Obtiene todos los perfiles mapeados.
//    */
//   getAll(): Observable<UserProfileDTO[]> {
//     return this.http.get<UserProfileDTO[]>(this.apiUrl).pipe(
//       map(profiles => profiles.map(p => this.mapId(p)))
//     );
//   }

//   /**
//    * Obtiene el perfil del usuario autenticado basado en el Token (JWT).
//    * El Backend debe resolver quién es el usuario a través del Principal.
//    */
//   getMe(): Observable<UserProfileDTO> {
//     return this.http.get<UserProfileDTO>(`${this.apiUrl}/me`).pipe(
//       // Transformamos el ID si es necesario
//       map(profile => this.mapId(profile)),
      
//       // Añadimos manejo de errores aquí también por seguridad
//       catchError(err => {
//         console.error('Error capturado en el Service:', err);
//         throw err;
//       })
//     );
//   }

//   /**
//    * Actualiza el perfil del usuario actual.
//    */
//   updateMyProfile(dto: UserProfileDTO): Observable<UserProfileDTO> {
//     return this.http.put<UserProfileDTO>(`${this.apiUrl}/me`, dto).pipe(
//       map(p => this.mapId(p))
//     );
//   }

//   /**
//    * Paginación y filtros para el MaintenanceLayout.
//    * Ajustado para cumplir con la interfaz Page<T> que requiere el Layout.
//    */
//   list(params: any): Observable<any> {
//     // 1. Limpiamos los parámetros para evitar el error [object Object]
//     let httpParams: any = {
//       page: params.page,
//       size: params.size
//     };

//     // 2. Si hay un filtro global (el buscador), lo extraemos
//     if (params.filters && params.filters.global) {
//       httpParams.search = params.filters.global;
//     }

//     return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
//       map(response => {
//         // Normalización de la respuesta para el Layout
//         if (response && response.content) {
//           return {
//             ...response,
//             content: response.content.map((p: UserProfileDTO) => this.mapId(p))
//           };
//         }
//         if (Array.isArray(response)) {
//           return {
//             content: response.map(p => this.mapId(p)),
//             totalElements: response.length
//           };
//         }
//         return { content: [], totalElements: 0 };
//       })
//     );
//   }
  
//   /**
//    * Actualiza el perfil usando el userId en la ruta.
//    */
//   update(userId: number | string, dto: UserProfileDTO): Observable<UserProfileDTO> {
//     return this.http.put<UserProfileDTO>(`${this.apiUrl}/${userId}`, dto).pipe(
//       map(p => this.mapId(p))
//     );
//   }

//   /**
//    * Elimina el perfil.
//    */
//   delete(id: number | string): Observable<void> {
//     return this.http.delete<void>(`${this.apiUrl}/${id}`);
//   }
  
//   create(userId: number | string, dto: UserProfileDTO): Observable<UserProfileDTO> {
//     // Forzamos a que el ID sea solo la parte numérica por si viene algo como "1:1"
//     const cleanId = String(userId).split(':')[0]; 
    
//     console.log('Enviando POST a:', `${this.apiUrl}/${cleanId}`);
//     console.log('Cuerpo del DTO:', dto);

//     return this.http.post<UserProfileDTO>(`${this.apiUrl}/${cleanId}`, dto).pipe(
//       map(p => this.mapId(p))
//     );
//   }

//   /**
//    * Obtiene un perfil individual.
//    */
//   getById(userId: number | string): Observable<UserProfileDTO> {
//     return this.http.get<UserProfileDTO>(`${this.apiUrl}/${userId}`).pipe(
//       map(p => this.mapId(p))
//     );
//   }
  
//   private mapId(p: UserProfileDTO): any {
//     // 1. Si 'p' es null o undefined, devolvemos un objeto de "Usuario Nuevo"
//     if (!p) {
//       return {
//         userId: null,
//         nombre: 'Usuario Nuevo',
//         firstName: '',
//         lastName: '',
//         activo: true,
//         description: 'Sin teléfono',
//         avatarUrl: ''
//       };
//     }

//     // 2. Si 'p' existe, hacemos el mapeo normal
//     return {
//       ...p,
//       id: p.userId, 
//       nombre: `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Usuario Nuevo',
//       activo: true, 
//       description: p.phone || 'Sin teléfono'
//     };
//   }
// }

import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { UserProfileDTO } from '../../../models/universilabas/userprofiles/userprofile.model';

@Injectable({ providedIn: 'root' })
export class UserProfileService {
  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/profiles`;

  /**
   * Obtiene el perfil del usuario autenticado basado en el Token (JWT).
   */
  getMe(): Observable<UserProfileDTO> {
    return this.http.get<UserProfileDTO>(`${this.apiUrl}/me`).pipe(
      tap(data => console.log('Respuesta cruda del servidor:', data)), // <--- MIRA ESTO EN CONSOLA
      map(profile => {
        // Si llega un objeto pero viene vacío de campos, mapId lo arreglará
        return this.mapId(profile);
      }),
      catchError(err => {
        console.error('Error en la petición /me:', err);
        return throwError(() => err);
      })
    );
  }

  /**
   * Obtiene un perfil individual por ID.
   */
  getById(userId: number | string): Observable<UserProfileDTO> {
    return this.http.get<UserProfileDTO>(`${this.apiUrl}/${userId}`).pipe(
      map(p => this.mapId(p)),
      catchError(err => {
        console.error(`Error al obtener perfil ${userId}:`, err);
        return throwError(() => err);
      })
    );
  }

  /**
 * Obtiene todos los perfiles sin paginación (para selectores)
 */
  getAll(): Observable<UserProfileDTO[]> {
    // Sin parámetros, el controller usa @PageableDefault(size = 10)
    // Podemos pasar size=999 para asegurarnos de traer todos para el selector
    return this.http.get<any>(`${this.apiUrl}?size=999`).pipe(
      map(response => {
        // Tu controller devuelve un Page, los datos están en 'content'
        if (response && response.content) {
          return response.content.map((p: any) => this.mapId(p));
        }
        return [];
      }),
      catchError(() => of([]))
    );
  }

  /**
   * CREAR: Se usa típicamente la primera vez después del registro.
   */
  create(userId: number | string, dto: UserProfileDTO): Observable<UserProfileDTO> {
    const cleanId = String(userId).split(':')[0]; 
    return this.http.post<UserProfileDTO>(`${this.apiUrl}/${cleanId}`, dto).pipe(
      map(p => this.mapId(p))
    );
  }

  /**
   * ACTUALIZAR: Por ID específico.
   */
  update(userId: number | string, dto: UserProfileDTO): Observable<UserProfileDTO> {
    return this.http.put<UserProfileDTO>(`${this.apiUrl}/${userId}`, dto).pipe(
      map(p => this.mapId(p))
    );
  }

  /**
   * ACTUALIZAR MI PERFIL: Usando el endpoint /me.
   */
  updateMyProfile(dto: UserProfileDTO): Observable<UserProfileDTO> {
    return this.http.put<UserProfileDTO>(`${this.apiUrl}/me`, dto).pipe(
      map(p => this.mapId(p))
    );
  }

  /**
   * Paginación para MaintenanceLayout.
   */
  list(params: any): Observable<any> {
    let httpParams = new HttpParams()
      .set('page', params.page || '0')
      .set('size', params.size || '10');

    if (params.filters?.global) {
      httpParams = httpParams.set('search', params.filters.global);
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(response => {
        if (response?.content) {
          return {
            ...response,
            content: response.content.map((p: UserProfileDTO) => this.mapId(p))
          };
        }
        return { content: [], totalElements: 0 };
      })
    );
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  /**
   * MAPEO DE DATOS: Asegura que el componente siempre reciba un objeto válido.
   */
  private mapId(p: UserProfileDTO | null): any {
    if (!p) {
      return {
        userId: null,
        id: null,
        nombre: 'Usuario Nuevo',
        firstName: '',
        lastName: '',
        activo: true,
        phone: '',
        avatarUrl: ''
      };
    }

    return {
      ...p,
      // Usamos userId como id para que los componentes de PrimeNG u otros layouts funcionen
      id: p.userId, 
      nombre: `${p.firstName || ''} ${p.lastName || ''}`.trim() || 'Sin Nombre',
      // Mantenemos la descripción para el MaintenanceLayout
      description: p.phone || 'Sin teléfono'
    };
  }
}