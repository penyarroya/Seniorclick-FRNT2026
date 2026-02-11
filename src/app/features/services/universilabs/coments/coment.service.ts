// import { Injectable } from '@angular/core';
// import { HttpClient } from "@angular/common/http";
// import { Observable, map } from "rxjs"; // <-- Importante: añadir map
// import { environment } from "../../../../../environments/environment";
// import { CommentResponseDTO } from "../../../models/universilabas/coments/coments-respose.model";

// @Injectable({ providedIn: 'root' })
// export class CommentService {
  
//   private readonly API_URL = `${environment.apiUrl}/api/comments`;

//   constructor(private http: HttpClient) {}

//   /**
//    * MÉTODO REQUERIDO POR EL MAINTENANCE LAYOUT
//    * Envuelve el array de comentarios en un objeto con la propiedad 'content'
//    */
//   list(params?: any): Observable<any> {
//     return this.getAllComments().pipe(
//       map(data => ({
//         content: data,          // El layout espera los datos aquí
//         totalElements: data.length 
//       }))
//     );
//   }

//   // Obtener todos los comentarios (Vista de Admin)
//   getAllComments(): Observable<CommentResponseDTO[]> {
//     return this.http.get<CommentResponseDTO[]>(this.API_URL);
//   }

//   // Obtener comentarios de una página específica
//   getByPage(pageId: number): Observable<CommentResponseDTO[]> {
//     return this.http.get<CommentResponseDTO[]>(`${this.API_URL}/page/${pageId}`);
//   }

//   // Eliminar comentario
//   delete(id: number): Observable<void> {
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

  // --- NUEVOS MÉTODOS PARA CREAR Y ACTUALIZAR ---

  /**
   * Crea un nuevo comentario
   * @param data Objeto con username, content y pageId
   */
  create(data: any): Observable<CommentResponseDTO> {
    return this.http.post<CommentResponseDTO>(this.API_URL, data);
  }

  /**
   * Actualiza un comentario existente
   * @param id ID del comentario
   * @param data Datos a actualizar
   */
  update(id: number | string, data: any): Observable<CommentResponseDTO> {
    return this.http.put<CommentResponseDTO>(`${this.API_URL}/${id}`, data);
  }

  // ----------------------------------------------

  getByPage(pageId: number): Observable<CommentResponseDTO[]> {
    return this.http.get<CommentResponseDTO[]>(`${this.API_URL}/page/${pageId}`);
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/${id}`);
  }
}