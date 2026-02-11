import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';

// Importamos las interfaces del Layout para cumplir el contrato
import { CrudService, Page, QueryParams } from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { EnrollmentResponseDTO } from '../../../models/universilabas/enrollments/enrollments-response.model';
import { EnrollmentRequestDTO } from '../../../models/universilabas/enrollments/enrollments-request.model';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService implements CrudService<EnrollmentResponseDTO> {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/api/enrollments`;

  /**
   * REQUERIDO POR MAINTENANCE LAYOUT
   * Maneja la paginación y búsqueda global
   */
  list(params: QueryParams): Observable<Page<EnrollmentResponseDTO>> {
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 0).toString())
      .set('size', (params.size ?? 10).toString());

    if (params.filters?.['global']) {
      httpParams = httpParams.set('search', params.filters['global']);
    }

    return this.http.get<any>(this.apiUrl, { params: httpParams }).pipe(
      map(res => ({
        content: (res.content || []) as EnrollmentResponseDTO[],
        totalElements: res.totalElements || 0
      }))
    );
  }

  /**
   * Crea una nueva inscripción
   */
  create(enrollment: EnrollmentRequestDTO): Observable<EnrollmentResponseDTO> {
    return this.http.post<EnrollmentResponseDTO>(this.apiUrl, enrollment);
  }

  /**
   * ACTUALIZA una inscripción existente
   * Este método es el que soluciona tu error ts(2339)
   */
  update(id: number | string, enrollment: EnrollmentRequestDTO): Observable<EnrollmentResponseDTO> {
    return this.http.put<EnrollmentResponseDTO>(`${this.apiUrl}/${id}`, enrollment);
  }

  /**
   * REQUERIDO POR MAINTENANCE LAYOUT
   * Elimina/Desvincula una inscripción
   */
  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // --- MÉTODOS ADICIONALES PARA LÓGICA DE NEGOCIO ---

  getUsersByProject(projectId: number): Observable<EnrollmentResponseDTO[]> {
    return this.http.get<EnrollmentResponseDTO[]>(`${this.apiUrl}/project/${projectId}`);
  }

  getProjectsByUser(userId: number): Observable<EnrollmentResponseDTO[]> {
    return this.http.get<EnrollmentResponseDTO[]>(`${this.apiUrl}/user/${userId}`);
  }

  getAll(): Observable<EnrollmentResponseDTO[]> {
    return this.http.get<EnrollmentResponseDTO[]>(`${this.apiUrl}/all`);
  }

  checkAccess(projectId: number): Observable<boolean> {
    // CORREGIDO: Eliminamos /enrollments porque ya está en this.apiUrl
    return this.http.get<boolean>(`${this.apiUrl}/check-access/${projectId}`);
  }

  enroll(projectId: number): Observable<any> {
    // CORREGIDO: Cambiamos la ruta a enroll-me (que es el método para el usuario actual)
    // y eliminamos el /enrollments duplicado
    return this.http.post(`${this.apiUrl}/enroll-me/${projectId}`, {});
  }

  // --- MÉTODO PARA ACTUALIZAR EL PROGRESO DE UNA INSCRIPCIÓN ---
  updateProgress(enrollmentId: number, pageId: number): Observable<any> {
    const body = {
      enrollmentId: enrollmentId,
      pageId: pageId,
      status: 'STARTED',
      timeSpentSeconds: 0 // Opcional: podrías calcular el tiempo real
    };
    return this.http.post(`${this.apiUrl}/progress`, body);
  }
}