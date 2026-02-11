// import { Injectable } from '@angular/core';
// import { HttpClient } from "@angular/common/http";
// import { Observable } from "rxjs";
// import { environment } from "../../../../../environments/environment";
// import { UserProgressResponseDTO } from '../../../models/universilabas/userprogress/userprogress-response.model';

// @Injectable({ providedIn: 'root' })
// export class UserProgressService {
// //  
//   private readonly API_URL = `${environment.apiUrl}/api/user-progress`;

//   constructor(private http: HttpClient) {}

//   // Cuando el usuario marca la página como completada
//   completePage(userId: number, projectId: number, pageId: number): Observable<UserProgressResponseDTO> {
//     return this.http.post<UserProgressResponseDTO>(
//       `${this.API_URL}/complete?userId=${userId}&projectId=${projectId}&pageId=${pageId}`, 
//       {}
//     );
//   }

//   // Para el dashboard de administración
//   getAllUserProgress(userId: number): Observable<UserProgressResponseDTO[]> {
//     return this.http.get<UserProgressResponseDTO[]>(`${this.API_URL}/user/${userId}`);
//   }
  
//   // El servicio solo recibe los números y hace la petición
//   getPercentage(userId: number, projectId: number): Observable<number> {
//     return this.http.get<number>(`${this.API_URL}/percentage?userId=${userId}&projectId=${projectId}`);
//   }

// }

import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, of } from "rxjs"; // Añadimos of
import { environment } from "../../../../../environments/environment";
import { UserProgressResponseDTO } from '../../../models/universilabas/userprogress/userprogress-response.model';

@Injectable({ providedIn: 'root' })
export class UserProgressService {
  private readonly API_URL = `${environment.apiUrl}/api/user-progress`;

  constructor(private http: HttpClient) {}

  // --- MÉTODOS ORIGINALES (No los toques para no romper otras partes) ---
  
  completePage(userId: number, projectId: number, pageId: number): Observable<UserProgressResponseDTO> {
    return this.http.post<UserProgressResponseDTO>(
      `${this.API_URL}/complete?userId=${userId}&projectId=${projectId}&pageId=${pageId}`, 
      {}
    );
  }

  getAllUserProgress(userId: number): Observable<UserProgressResponseDTO[]> {
    return this.http.get<UserProgressResponseDTO[]>(`${this.API_URL}/user/${userId}`);
  }
  
  getPercentage(userId: number, projectId: number): Observable<number> {
    return this.http.get<number>(`${this.API_URL}/percentage?userId=${userId}&projectId=${projectId}`);
  }

  // --- ALIAS PARA COMPATIBILIDAD CON MAINTENANCE-LAYOUT ---

  /**
   * El Layout llamará a 'list'. 
   * Nota: Como el Layout no sabe pasar el userId, este método se usará 
   * preferiblemente a través del Adapter que creamos en el componente.
   */
  list(params: any): Observable<any> {
    // Si tienes un userId por defecto o global podrías usarlo aquí,
    // pero lo ideal es manejarlo en el Adapter del componente.
    return of({ content: [], totalElements: 0 });
  }

  // En user-progress.service.ts
  updateMotivation(userId: number, pageId: number, message: string): Observable<UserProgressResponseDTO> {
    return this.http.patch<UserProgressResponseDTO>(
      // Los IDs viajan en la URL como QueryParams (?userId=...&pageId=...)
      `${this.API_URL}/motivation?userId=${userId}&pageId=${pageId}`,
      // El mensaje viaja en el CUERPO como un objeto JSON
      { motivationMessage: message } 
    );
  }

  /**
   * El Layout requiere que exista 'delete' aunque no lo uses.
   */
  delete(id: number): Observable<void> {
    return of(undefined);
  }

  // --- NUEVOS MÉTODOS PARA NAVEGACIÓN Y PERSISTENCIA ---

 /**
   * Registra que el usuario está visualizando una página.
   * Se dispara automáticamente al navegar en el AcademicWorkspace.
   */
  updateProgress(data: { userId: number, projectId: number, pageId: number, status: string }): Observable<UserProgressResponseDTO> {
    // Eliminamos los parámetros de la URL y pasamos 'data' como segundo argumento
    return this.http.post<UserProgressResponseDTO>(this.API_URL, data);
  }

  /**
   * Recupera el último punto donde el usuario se quedó.
   */
  resumeCourse(userId: number, projectId: number): Observable<any> {
    // Este está bien porque en Java usaste @RequestParam, que sí lee de la URL
    return this.http.get(`${this.API_URL}/resume?userId=${userId}&projectId=${projectId}`);
  }
}