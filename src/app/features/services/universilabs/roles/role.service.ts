// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class RoleService {
  
// }

import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { RoleDTO } from '../../../models/users/roles/roles.model';
import { Page } from '../../../layouts/maintenance-layout/maintenance-layout.component';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/api/roles`;

 list(params?: any): Observable<Page<any>> { // Cambiamos el retorno a Page<any>
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(roles => {
        // Transformamos el Array simple en el objeto Page que el Layout espera
        return {
          content: roles.map(role => ({
            ...role,
            permissions: role.permissions || []
          })),
          totalElements: roles.length
        };
      })
    );
  }

  // getRoleById(Long id)
  getById(id: number): Observable<RoleDTO> {
    return this.http.get<RoleDTO>(`${this.apiUrl}/${id}`);
  }

  // createRole(RoleDTO roleDTO)
  create(role: RoleDTO): Observable<RoleDTO> {
    return this.http.post<RoleDTO>(this.apiUrl, role);
  }

  // updateRole(Long id, RoleDTO roleDTO)
  update(id: number, role: RoleDTO): Observable<RoleDTO> {
    return this.http.put<RoleDTO>(`${this.apiUrl}/${id}`, role);
  }

  // deleteRole(Long id)
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}