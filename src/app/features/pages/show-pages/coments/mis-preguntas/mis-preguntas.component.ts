// import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from "@angular/material/icon";
// import { ActivatedRoute, Router, RouterModule } from '@angular/router';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { TextFieldModule } from '@angular/cdk/text-field';
// import { MatDividerModule } from '@angular/material/divider';
// import { CommentItemComponent } from '../comment-item/comment-item.component';

// @Component({
//   selector: 'app-mis-preguntas',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatIconModule,
//     MatButtonModule,
//     MatDividerModule,
//     FormsModule,
//     RouterModule,
//     MatTooltipModule,
//     TextFieldModule,
//     CommentItemComponent
// ],
//   templateUrl: './mis-preguntas.component.html',
//   styleUrl: './mis-preguntas.component.scss',
// })
// export class MisPreguntasComponent implements OnInit, AfterViewInit {
// //  
//   // Inyecciones
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);

//   // --- SIGNALS DE ESTADO ---
//   public pageId = signal<number>(0);
//   public userId = signal<number>(0); 
  
//   // Lista de dudas (Lo que alimenta el panel izquierdo)
//   public misComentarios = signal<any[]>([]); 
  
//   // Duda seleccionada (Lo que alimenta el panel derecho)
//   public selectedQuestion = signal<any | null>(null);

//   // Inputs de texto
//   public nuevaDuda = signal<string>(''); // Para el header
//   public nuevaRespuesta = signal<string>(''); // Para el detalle inferior

//   @ViewChild('dudaTextarea') dudaInput!: ElementRef<HTMLTextAreaElement>;

//   ngOnInit() {
//     // Obtenemos el pageId de la URL
//     const idParam = this.route.snapshot.paramMap.get('pageId');
//     if (idParam) {
//       this.pageId.set(Number(idParam));
//       this.cargarComentarios();
//     }
//   }

//   ngAfterViewInit() {
//     // Foco inicial en el textarea superior
//     setTimeout(() => {
//       if (this.dudaInput) {
//         this.dudaInput.nativeElement.focus();
//       }
//     }, 100);
//   }

//   /**
//    * Carga los datos (Simulación o llamada a servicio)
//    */
//   private cargarComentarios() {
//     // Ejemplo de estructura de datos para que no veas la pantalla vacía
//     const dataMock = [
//       {
//         id: 1,
//         username: 'Juan Pérez',
//         date: '20 Feb 2026',
//         content: '¿Cómo puedo implementar el decorador @Output en este ejercicio?',
//         replies: [
//           { id: 101, username: 'Instructor', content: 'Debes importar Output y EventEmitter de @angular/core.', date: '21 Feb' }
//         ]
//       },
//       {
//         id: 2,
//         username: 'María García',
//         date: '18 Feb 2026',
//         content: 'No entiendo la diferencia entre Signals y Observables.',
//         replies: []
//       }
//     ];
    
//     this.misComentarios.set(dataMock);
//   }

//   /**
//    * Selecciona una pregunta para mostrar en el panel de detalle
//    */
//   public selectQuestion(comentario: any) {
//     this.selectedQuestion.set(comentario);
//   }

//   /**
//    * Publica una nueva duda desde el encabezado
//    */
//   public publicarDuda() {
//     const texto = this.nuevaDuda().trim();
//     if (!texto) return;

//     console.log("Enviando nueva duda:", texto);
    
//     // Aquí iría la llamada al servicio:
//     // this.service.postDuda(texto).subscribe(...)

//     this.nuevaDuda.set(''); // Limpiar input
//   }

//   /**
//    * Publica una respuesta a la duda seleccionada
//    */
//   public publicarRespuesta() {
//     const texto = this.nuevaRespuesta().trim();
//     if (!texto || !this.selectedQuestion()) return;

//     console.log("Respondiendo a la duda:", this.selectedQuestion()?.id, "con:", texto);
    
//     // Lógica para añadir la respuesta localmente o vía API
//     this.nuevaRespuesta.set('');
//   }

//   /**
//    * Limpia el texto de la nueva duda
//    */
//   public cancelar() {
//     this.nuevaDuda.set('');
//   }

//   /**
//    * Navega de vuelta a la lección correspondiente
//    */
//   public volverALaleccion() {
//     this.router.navigate(['../../page', this.pageId()], { relativeTo: this.route });
//   }
// }

import { AfterViewInit, Component, ElementRef, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from "@angular/material/icon";
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TextFieldModule } from '@angular/cdk/text-field';
import { MatDividerModule } from '@angular/material/divider';
import { CommentItemComponent } from '../comment-item/comment-item.component';
import { CommentService } from '../../../../services/universilabs/coments/coment.service';
import { CommentResponseDTO } from '../../../../models/universilabas/coments/coments-respose.model';

@Component({
  selector: 'app-mis-preguntas',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    FormsModule,
    RouterModule,
    MatTooltipModule,
    TextFieldModule,
    CommentItemComponent
  ],
  templateUrl: './mis-preguntas.component.html',
  styleUrl: './mis-preguntas.component.scss',
})
export class MisPreguntasComponent implements OnInit, AfterViewInit {
  
  // Inyecciones
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private commentService = inject(CommentService); // <--- Inyectamos tu servicio

  // --- SIGNALS DE ESTADO ---
  public pageId = signal<number>(0);
  public userId = signal<number>(0); 
  
  // Lista de dudas usando tu DTO real
  public misComentarios = signal<CommentResponseDTO[]>([]); 
  
  // Duda seleccionada
  public selectedQuestion = signal<CommentResponseDTO | null>(null);

  // Inputs de texto
  public nuevaDuda = signal<string>(''); 
  public nuevaRespuesta = signal<string>(''); 

  @ViewChild('dudaTextarea') dudaInput!: ElementRef<HTMLTextAreaElement>;
  // NUEVO: Referencia a la caja de texto inferior (donde respondes)
  @ViewChild('respuestaTextarea') respuestaInput!: ElementRef<HTMLTextAreaElement>;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('pageId');
    if (idParam) {
      this.pageId.set(Number(idParam));
      this.cargarComentarios();
    }
  }

  /**
   * NUEVO: Este método se activa cuando haces clic en "Responder" 
   * dentro de cualquier comentario (padre o hijo).
   */
  public manejarReplyDesdeHijo(comentario: CommentResponseDTO) {
    // Ponemos el foco en el textarea de abajo automáticamente
    setTimeout(() => {
      if (this.respuestaInput) {
        this.respuestaInput.nativeElement.focus();
      }
    }, 100);
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.dudaInput) {
        this.dudaInput.nativeElement.focus();
      }
    }, 100);
  }

  /**
   * Carga los datos reales desde el Backend
   */
  private cargarComentarios() {
    this.commentService.getByPage(this.pageId()).subscribe({
      next: (data: CommentResponseDTO[]) => {
        this.misComentarios.set(data);
        
        // Mantener la selección actual o seleccionar la primera
        const actual = this.selectedQuestion();
        if (actual) {
          const actualizada = data.find(c => c.id === actual.id);
          if (actualizada) this.selectedQuestion.set(actualizada);
        } else if (data.length > 0) {
          this.selectedQuestion.set(data[0]);
        }
      },
      error: (err) => console.error("Error cargando comentarios", err)
    });
  }

  public selectQuestion(comentario: CommentResponseDTO) {
    this.selectedQuestion.set(comentario);
  }

  /**
   * Publica una nueva duda (Comentario Padre)
   */
  public publicarDuda() {
    const texto = this.nuevaDuda().trim();
    if (!texto) return;

    const payload = {
      content: texto,
      pageId: this.pageId()
      // parentId es null por defecto para nuevas preguntas
    };

    this.commentService.create(payload).subscribe({
      next: () => {
        this.nuevaDuda.set('');
        this.cargarComentarios(); // Recargamos la lista
      },
      error: (err) => console.error("Error al publicar duda", err)
    });
  }

  /**
   * Publica una respuesta a la duda seleccionada
   */
  public publicarRespuesta() {
    const texto = this.nuevaRespuesta().trim();
    const preguntaActual = this.selectedQuestion();

    if (!texto || !preguntaActual) return;

    const payload = {
      content: texto,
      pageId: this.pageId(),
      parentId: preguntaActual.id // <--- IMPORTANTE: Así vinculas la respuesta
    };

    this.commentService.create(payload).subscribe({
      next: () => {
        this.nuevaRespuesta.set('');
        this.cargarComentarios(); // Recargamos para ver la respuesta en el hilo
      },
      error: (err) => console.error("Error al responder", err)
    });
  }

  //
  public borrarPregunta(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta pregunta? Esta acción no se puede deshacer.')) {
      this.commentService.eliminarComentario(id).subscribe({
        next: () => {
          // Actualizamos el signal de la lista filtrando la pregunta borrada
          this.misComentarios.update(comentarios => comentarios.filter(c => c.id !== id));
          
          // Si la pregunta borrada era la que estaba abierta, cerramos el detalle
          if (this.selectedQuestion()?.id === id) {
            this.selectedQuestion.set(null);
          }
        },
        error: (err) => console.error('Error al borrar:', err)
      });
    }
  }

  // Añade este método en tu MisPreguntasComponent
  public manejarResolucion(commentId: number) {
    this.commentService.toggleResolved(commentId).subscribe({
      next: () => {
        // Actualizamos localmente sin recargar todo para que sea instantáneo
        this.cargarComentarios();
      },
      error: (err) => console.error("Error al cambiar estado", err)
    });
  }

  //
  public cerrarPregunta() {
    this.selectedQuestion.set(null);
  }

  //
  public cancelar() {
    this.nuevaDuda.set('');
  }

  //
  public volverALaleccion() {
    // Usamos la ruta absoluta para evitar errores de niveles
    // Esto construye: /aula/1/page/5
    // Nota: Si el '1' (ID del aula) es dinámico, deberías tener un signal para él.
    // Si por ahora es fijo o siempre es el mismo contexto:
    this.router.navigate(['/aula', 1, 'page', this.pageId()]);
  }
}