// import { Injectable } from '@angular/core';
// import { HttpClient } from "@angular/common/http";
// import { Observable, map } from "rxjs";
// import { environment } from "../../../../../environments/environment";
// import { CommentResponseDTO } from "../../../models/universilabas/coments/coments-respose.model";

// @Injectable({ providedIn: 'root' })
// export class CommentService {
  
//   private readonly API_URL = `${environment.apiUrl}/api/comments`;

//   constructor(private http: HttpClient) {}

//   /**
//    * MÉTODO REQUERIDO POR EL MAINTENANCE LAYOUT
//    */
//   list(params?: any): Observable<any> {
//     return this.getAllComments().pipe(
//       map(data => ({
//         content: data,
//         totalElements: data.length 
//       }))
//     );
//   }

//   getAllComments(): Observable<CommentResponseDTO[]> {
//     return this.http.get<CommentResponseDTO[]>(this.API_URL);
//   }

//   // --- NUEVOS MÉTODOS PARA CREAR Y ACTUALIZAR ---

//   /**
//    * Crea un nuevo comentario
//    * @param data Objeto con username, content y pageId
//    */
//   create(data: any): Observable<CommentResponseDTO> {
//     return this.http.post<CommentResponseDTO>(this.API_URL, data);
//   }

//   /**
//    * Actualiza un comentario existente
//    * @param id ID del comentario
//    * @param data Datos a actualizar
//    */
//   update(id: number | string, data: any): Observable<CommentResponseDTO> {
//     return this.http.put<CommentResponseDTO>(`${this.API_URL}/${id}`, data);
//   }

//   // ----------------------------------------------

//   getByPage(pageId: number): Observable<CommentResponseDTO[]> {
//     return this.http.get<CommentResponseDTO[]>(`${this.API_URL}/page/${pageId}`);
//   }

//   delete(id: number | string): Observable<void> {
//     return this.http.delete<void>(`${this.API_URL}/${id}`);
//   }
// }



import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable, map } from "rxjs";
import { environment } from "../../../../../environments/environment";
import { CommentResponseDTO } from "../../../models/universilabas/coments/coments-respose.model";

@Injectable({ providedIn: 'root' })
export class CommentService {
  
  private readonly API_URL = `${environment.apiUrl}/api/comments`;

  constructor(private http: HttpClient) {}

  /**
   * MÉTODO REQUERIDO POR EL MAINTENANCE LAYOUT
   */
  list(params?: any): Observable<any> {
    return this.getAllComments().pipe(
      map(data => ({
        content: data,
        totalElements: data.length 
      }))
    );
  }

  getAllComments(): Observable<CommentResponseDTO[]> {
    return this.http.get<CommentResponseDTO[]>(this.API_URL);
  }

  // --- MÉTODOS ACTUALIZADOS Y NUEVOS ---

  /**
   * Crea un nuevo comentario o respuesta.
   * Recuerda que el 'data' (CommentRequestDTO) ahora puede incluir 'parentId'.
   */
  create(data: any): Observable<CommentResponseDTO> {
    return this.http.post<CommentResponseDTO>(this.API_URL, data);
  }

  /**
   * NUEVO: Cambia el estado de resolución de un comentario.
   * Corresponde al @PatchMapping en tu controlador de Java.
   */
  toggleResolved(id: number | string): Observable<void> {
    return this.http.patch<void>(`${this.API_URL}/${id}/toggle-resolved`, {});
  }

  /**
   * NUEVO: Obtiene comentarios no resueltos para el dashboard de administración.
   */
  getUnresolved(): Observable<CommentResponseDTO[]> {
    return this.http.get<CommentResponseDTO[]>(`${this.API_URL}/unresolved`);
  }

  // ----------------------------------------------

  getByPage(pageId: number): Observable<CommentResponseDTO[]> {
    return this.http.get<CommentResponseDTO[]>(`${this.API_URL}/page/${pageId}`);
  }

  update(id: number | string, data: any): Observable<CommentResponseDTO> {
    return this.http.put<CommentResponseDTO>(`${this.API_URL}/${id}`, data);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  public eliminarComentario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }

  /**
 * Solicita una sugerencia de respuesta a la IA basada en una duda específica
 */
getIASuggestion(commentId: number): Observable<{ content: string }> {
  // Esta ruta debe coincidir con la que crees en tu controlador de Spring Boot
  return this.http.get<{ content: string }>(`${this.API_URL}/${commentId}/ai-suggestion`);
}
}