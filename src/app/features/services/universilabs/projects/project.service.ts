import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../../environments/environment';
import { CrudService, Page, QueryParams } from '../../../layouts/maintenance-layout/maintenance-layout.component';
// Importa ambos tipos
import { ProjectDTO, ProjectGridItem } from '../../../models/universilabas/projects/project.model';
import { ProjectStructureDTO } from '../../../models/universilabas/project-structure/project-structure.dto';

@Injectable({
  providedIn: 'root',
})
export class ProjectService implements CrudService<ProjectGridItem> {
//  
  private readonly apiUrl = `${environment.apiUrl}/api/projects`;
  private http = inject(HttpClient);

  constructor() {}

  /**
   * Obtiene la estructura jerárquica completa del proyecto (Syllabus)
   * para el Workspace Académico.
   */
  getStructure(id: number): Observable<ProjectStructureDTO> {
    return this.http.get<ProjectStructureDTO>(`${this.apiUrl}/${id}/structure`);
  }

  /**
   * Obtiene la lista completa de proyectos sin paginación.
   * Útil para llenar los mat-select en otros formularios (como el de inscripciones).
   */
  getAll(): Observable<ProjectGridItem[]> {
    // Llamamos al endpoint /all que definimos en el Controller de Java
    return this.http.get<ProjectGridItem[]>(`${this.apiUrl}/all`).pipe(
      map(res => Array.isArray(res) ? res : [])
    );
  }

  //
  list(params: QueryParams): Observable<Page<ProjectGridItem>> {
    let httpParams = new HttpParams()
      .set('page', (params.page ?? 0).toString())
      .set('size', (params.size ?? 10).toString());

    if (params.filters) {
      // CORRECCIÓN: 'search' para coincidir con @RequestParam del Backend
      if (params.filters['global']) {
        httpParams = httpParams.set('search', params.filters['global']);
      }

      // Filtros adicionales por columna
      Object.keys(params.filters).forEach(key => {
        const value = params.filters![key];
        if (key !== 'global' && value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value);
        }
      });
    }

    return this.http
      .get<any>(this.apiUrl, { params: httpParams })
      .pipe(
        map(res => ({
          content: (res.content || []) as ProjectGridItem[],
          totalElements: res.totalElements || 0
        }))
      );
  }

  // Usamos Partial<ProjectDTO> para mayor claridad semántica en la creación
  create(dto: Partial<ProjectDTO>): Observable<ProjectGridItem> {
    return this.http.post<ProjectGridItem>(this.apiUrl, dto);
  }

  update(id: number | string, dto: Partial<ProjectDTO>): Observable<ProjectGridItem> {
    return this.http.put<ProjectGridItem>(`${this.apiUrl}/${id}`, dto);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}