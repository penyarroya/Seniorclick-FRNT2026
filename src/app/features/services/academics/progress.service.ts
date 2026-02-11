// import { Injectable } from '@angular/core';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProgressService {
  
// }


import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs'; // Importamos 'of' para devolver un valor amigable
import { catchError } from 'rxjs/operators'; // Importamos el operador para manejar errores
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  
  private http = inject(HttpClient);
  private readonly API_URL = `${environment.apiUrl}/api/user-progress`;

  /**
   * Recupera la última página visitada.
   * Maneja el error 404 (típico de usuarios recién inscritos) devolviendo null.
   */
  resumeCourse(userId: number, projectId: number): Observable<any> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('projectId', projectId.toString());

    return this.http.get<any>(`${this.API_URL}/resume`, { params }).pipe(
      catchError(error => {
        // Si el servidor responde 404, significa que el usuario es nuevo.
        // Devolvemos 'null' para que el componente sepa que debe empezar desde la lección 1.
        if (error.status === 404) {
          console.log('ℹ️ Sin progreso previo: Usuario recién inscrito.');
          return of(null); 
        }
        // Si es otro tipo de error (500, error de red), lo relanzamos.
        throw error;
      })
    );
  }

  // Actualiza el progreso al navegar
  updateProgress(dto: any): Observable<any> {
    return this.http.post<any>(this.API_URL, dto);
  }

  // Obtiene el porcentaje de avance
  getPercentage(userId: number, projectId: number): Observable<{percentage: number}> {
    const params = new HttpParams()
      .set('userId', userId.toString())
      .set('projectId', projectId.toString());
    return this.http.get<{percentage: number}>(`${this.API_URL}/percentage`, { params });
  }
}