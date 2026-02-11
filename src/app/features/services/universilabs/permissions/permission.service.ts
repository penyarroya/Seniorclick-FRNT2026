import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { PermissionDTO } from '../../../models/users/permissions/permision.model';
import { Page } from '../../../layouts/maintenance-layout/maintenance-layout.component';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
//  
  private http = inject(HttpClient);
  // Asegúrate de que este path coincida con tu @RequestMapping en Spring
  private apiUrl = `${environment.apiUrl}/api/permissions`; 

  list(params?: any): Observable<Page<any>> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      map(res => ({
        content: res.map(p => ({
          ...p,
          nombre: p.name // Crucial para que el layout ordene alfabéticamente
        })),
        totalElements: res.length
      }))
    );
  }

  getById(id: number): Observable<PermissionDTO> {
    return this.http.get<PermissionDTO>(`${this.apiUrl}/${id}`);
  }

  create(permission: PermissionDTO): Observable<PermissionDTO> {
    return this.http.post<PermissionDTO>(this.apiUrl, permission);
  }

  update(id: number, permission: PermissionDTO): Observable<PermissionDTO> {
    return this.http.put<PermissionDTO>(`${this.apiUrl}/${id}`, permission);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}