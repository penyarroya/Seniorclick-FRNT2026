// import { HttpClient, HttpParams } from '@angular/common/http';
// import { Injectable } from '@angular/core';
// import { Observable, map } from 'rxjs';
// import { environment } from '../../../../../environments/environment';
// import { UserDTO } from '../../../models/users/user-dto.model';
// import { CrudService, Page, QueryParams } from '../../../layouts/maintenance-layout/maintenance-layout.component';

// @Injectable({
//   providedIn: 'root',
// })
// export class UserService implements CrudService<UserDTO> {

//   private readonly usersUrl = `${environment.apiUrl}/api/users`;

//   constructor(private http: HttpClient) {}

//   // ================== CRUD + Paginación ==================
//   list(params?: QueryParams): Observable<Page<UserDTO>> {
//     let httpParams = new HttpParams()
//       .set('page', (params?.page ?? 0).toString())
//       .set('size', (params?.size ?? 10).toString());

//     if (params?.filters) {
//       Object.keys(params.filters).forEach(key => {
//         const value = params.filters![key];
        
//         // Solo enviamos si el valor no es nulo, indefinido o un string vacío
//         if (value !== undefined && value !== null && value !== '') {
//           if (Array.isArray(value)) {
//             httpParams = httpParams.set(key, value.join(','));
//           } else {
//             httpParams = httpParams.set(key, value.toString());
//           }
//         }
//       });
//     }

//     return this.http
//       .get<Page<UserDTO>>(`${this.usersUrl}/page`, { params: httpParams })
//       .pipe(
//         map(res => ({
//           content: res.content || [],
//           totalElements: res.totalElements || 0
//         }))
//       );
//   }

//   getAll(): Observable<UserDTO[]> {
//     return this.http.get<UserDTO[]>(this.usersUrl);
//   }

//   getById(id: number): Observable<UserDTO> {
//     return this.http.get<UserDTO>(`${this.usersUrl}/${id}`);
//   }

//   // user.service.ts
//   create(user: any): Observable<UserDTO> {
//     // Enviamos 'user' tal cual (donde roles ya es string[])
//     return this.http.post<UserDTO>(this.usersUrl, user, { withCredentials: true });
//   }

//   // user.service.ts
//   update(id: number, user: any): Observable<UserDTO> {
//     return this.http.put<UserDTO>(`${this.usersUrl}/${id}`, user, { withCredentials: true });
//   }

//   delete(id: number | string): Observable<void> {
//     return this.http.delete<void>(`${this.usersUrl}/${id}`);
//   }

//   // ================== Validaciones ==================
//   // En user.service.ts
//   checkUsernameExists(username: string): Observable<boolean> {
//     // Asegúrate de que this.usersUrl apunte a http://localhost:8091/api/users
//     return this.http.get<boolean>(`${this.usersUrl}/exists/username?username=${encodeURIComponent(username)}`);
//   }
//   // En user.service.ts
//   checkEmailExists(email: string): Observable<boolean> {
//     // Cambiamos /check-email por /exists/email que es lo que tienes en Java
//     return this.http.get<boolean>(`${this.usersUrl}/exists/email?email=${encodeURIComponent(email)}`);
//   }

//   // ================== Activo / Roles ==================
//   toggleActivo(id: number): Observable<UserDTO> {
//     return this.http.patch<UserDTO>(`${this.usersUrl}/${id}/toggle`, {});
//   }

//   cambiarEstadoActivo(id: number, activo: boolean): Observable<UserDTO> {
//     return this.http.patch<UserDTO>(`${this.usersUrl}/${id}/status`, { activo });
//   }

//  // En user.service.ts
//   getAvailableRoles(): Observable<any[]> {
//     return this.http.get<any[]>(`http://localhost:8091/api/roles`);
//   }

//   // En user.service.ts
//   addRole(id: number, roleName: string): Observable<UserDTO> {
//     return this.http.patch<UserDTO>(
//       `${this.usersUrl}/${id}/roles/add?roleName=${encodeURIComponent(roleName)}`,
//       {}
//     );
//   }

//   removeRole(id: number, roleName: string): Observable<UserDTO> {
//     return this.http.patch<UserDTO>(
//       `${this.usersUrl}/${id}/roles/remove?roleName=${encodeURIComponent(roleName)}`,
//       {}
//     );
//   }

//   // ================== Helpers ==================
//   private toArray(value?: string | string[]): string[] {
//     if (!value) return [];
//     if (Array.isArray(value)) return value;
//     return value.split(',').map(v => v.trim());
//   }
// }


import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { UserDTO } from '../../../models/users/user-dto.model';
import { CrudService, Page, QueryParams } from '../../../layouts/maintenance-layout/maintenance-layout.component';

@Injectable({
  providedIn: 'root',
})
export class UserService implements CrudService<UserDTO> {
//
  private readonly usersUrl = `${environment.apiUrl}/api/users`;
  private readonly rolesUrl = `${environment.apiUrl}/api/roles`; // Centralizado

  constructor(private http: HttpClient) {}

  // ================== CRUD + Paginación ==================
  list(params?: QueryParams): Observable<Page<UserDTO>> {
    let httpParams = new HttpParams()
      .set('page', (params?.page ?? 0).toString())
      .set('size', (params?.size ?? 10).toString());

    if (params?.filters) {
      Object.keys(params.filters).forEach(key => {
        const value = params.filters![key];
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, Array.isArray(value) ? value.join(',') : value.toString());
        }
      });
    }

    return this.http.get<Page<UserDTO>>(`${this.usersUrl}/page`, { params: httpParams }).pipe(
      map(res => ({
        content: res.content || [],
        totalElements: res.totalElements || 0
      }))
    );
  }

  //
  getAll(): Observable<UserDTO[]> {
    return this.http.get<UserDTO[]>(this.usersUrl);
  }

  //
  getById(id: number): Observable<UserDTO> {
    return this.http.get<UserDTO>(`${this.usersUrl}/${id}`);
  }

  //
  create(user: any): Observable<UserDTO> {
    // Coincide con tu createUserManual en Java
    return this.http.post<UserDTO>(this.usersUrl, user);
  }
  
  //
  update(id: number, user: any): Observable<UserDTO> {
    return this.http.put<UserDTO>(`${this.usersUrl}/${id}`, user);
  }

  //
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.usersUrl}/${id}`);
  }

  // ================== Validaciones de Disponibilidad ==================
  // Coincide con existsByUsernameIgnoreCase y existsByEmailIgnoreCase en Java
  checkUsernameExists(username: string): Observable<boolean> {
    const params = new HttpParams().set('username', username);
    return this.http.get<boolean>(`${this.usersUrl}/exists/username`, { params });
  }

  checkEmailExists(email: string): Observable<boolean> {
    const params = new HttpParams().set('email', email);
    return this.http.get<boolean>(`${this.usersUrl}/exists/email`, { params });
  }

  // ================== Estado y Roles ==================
  toggleActivo(id: number): Observable<UserDTO> {
    return this.http.patch<UserDTO>(`${this.usersUrl}/${id}/toggle`, {});
  }

  cambiarEstadoActivo(id: number, activo: boolean): Observable<UserDTO> {
    // Coincide con @Transactional UserDTO cambiarEstadoActivo en Java
    return this.http.patch<UserDTO>(`${this.usersUrl}/${id}/status?activo=${activo}`, {});
  }

  getAvailableRoles(): Observable<any[]> {
    return this.http.get<any[]>(this.rolesUrl);
  }

  addRole(id: number, roleName: string): Observable<UserDTO> {
    // Usamos HttpParams para mayor limpieza que el template string con encodeURIComponent
    const params = new HttpParams().set('roleName', roleName);
    return this.http.patch<UserDTO>(`${this.usersUrl}/${id}/roles/add`, {}, { params });
  }

  removeRole(id: number, roleName: string): Observable<UserDTO> {
    const params = new HttpParams().set('roleName', roleName);
    return this.http.patch<UserDTO>(`${this.usersUrl}/${id}/roles/remove`, {}, { params });
  }
}