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
// import { CommentService } from '../../../../services/universilabs/coments/coment.service';
// import { CommentResponseDTO } from '../../../../models/universilabas/coments/coments-respose.model';
// import { PageService } from '../../../../services/universilabs/pages/page.service';

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
//   ],
//   templateUrl: './mis-preguntas.component.html',
//   styleUrl: './mis-preguntas.component.scss',
// })
// export class MisPreguntasComponent implements OnInit, AfterViewInit {
  
//   // Inyecciones
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private commentService = inject(CommentService); // <--- Inyectamos tu servicio
//   private pageService = inject(PageService);

//   // --- SIGNALS DE ESTADO ---
//   public pageId = signal<number>(0);
//   public pageTitle = signal<string>('Cargando lección...');
//   public userId = signal<number>(0); 
//   public cargandoIA = signal<boolean>(false);
//   public nuevaRespuesta = signal<string>('');
  
//   // Lista de dudas usando tu DTO real
//   public misComentarios = signal<CommentResponseDTO[]>([]); 
  
//   // Duda seleccionada
//   public selectedQuestion = signal<CommentResponseDTO | null>(null);

//   // Inputs de texto
//   public nuevaDuda = signal<string>(''); 

//   @ViewChild('dudaTextarea') dudaInput!: ElementRef<HTMLTextAreaElement>;
//   // NUEVO: Referencia a la caja de texto inferior (donde respondes)
//   @ViewChild('respuestaTextarea') respuestaInput!: ElementRef<HTMLTextAreaElement>;

//   ngOnInit() {
//     const idParam = this.route.snapshot.paramMap.get('pageId');
//     if (idParam) {
//       const id = Number(idParam); // Lo conviertes una sola vez

//       this.pageId.set(id);
//       this.cargarComentarios();
//       this.cargarInfoPagina(id);
//     }
//   }

//   //Carga el título de la página para mostrarlo en el header
//   private cargarInfoPagina(id: number) {
//     this.pageService.findById(id).subscribe({
//       next: (page) => {
//         // Usamos el título que viene del DTO
//         this.pageTitle.set(page.title || 'Lección sin título'); 
//       },
//       error: (err) => {
//         console.error("Error al obtener el título de la página", err);
//         // Fallback amigable para que el usuario no vea "Cargando..." siempre
//         this.pageTitle.set('Consulta de Lección');
//       }
//     });
//   }

//   /**
//  * GENERAR IA: Centralizamos la lógica aquí.
//  */
//   public generarRespuestaIA() {
//     const pregunta = this.selectedQuestion();
//     if (!pregunta) return;

//     this.cargandoIA.set(true);
    
//     this.commentService.getIASuggestion(pregunta.id).subscribe({
//       next: (res) => {
//         // Importante: verificar que el usuario no haya cambiado de pregunta mientras la IA respondía
//         if (this.selectedQuestion()?.id === pregunta.id) {
//           this.nuevaRespuesta.set(res.content);
//         }
//         this.cargandoIA.set(false);
//       },
//       error: (err) => {
//         console.error("Error al obtener sugerencia de IA:", err);
//         this.cargandoIA.set(false);
//       }
//     });
//   }

//   //
//   // public generarRespuestaIA() {
//   //   const pregunta = this.selectedQuestion();
//   //   if (!pregunta) return;

//   //   this.cargandoIA.set(true);
    
//   //   // Llamas a un nuevo método en tu servicio
//   //   this.commentService.getIASuggestion(pregunta.id).subscribe({
//   //     next: (sugerencia) => {
//   //       this.nuevaRespuesta.set(sugerencia.content);
//   //       this.cargandoIA.set(false);
//   //     },
//   //     error: () => this.cargandoIA.set(false)
//   //   });
//   // }
  
//   /**
//    * NUEVO: Este método se activa cuando haces clic en "Responder" 
//    * dentro de cualquier comentario (padre o hijo).
//    */
//   public manejarReplyDesdeHijo(comentario: CommentResponseDTO) {
//     // Ponemos el foco en el textarea de abajo automáticamente
//     setTimeout(() => {
//       if (this.respuestaInput) {
//         this.respuestaInput.nativeElement.focus();
//       }
//     }, 100);
//   }

//   ngAfterViewInit() {
//     setTimeout(() => {
//       if (this.dudaInput) {
//         this.dudaInput.nativeElement.focus();
//       }
//     }, 100);
//   }

//   /**
//    * Carga los datos reales desde el Backend
//    */
//   // private cargarComentarios() {
//   //   this.commentService.getByPage(this.pageId()).subscribe({
//   //     next: (data: CommentResponseDTO[]) => {
//   //       this.misComentarios.set(data);
        
//   //       // Mantener la selección actual o seleccionar la primera
//   //       const actual = this.selectedQuestion();
//   //       if (actual) {
//   //         const actualizada = data.find(c => c.id === actual.id);
//   //         if (actualizada) this.selectedQuestion.set(actualizada);
//   //       } else if (data.length > 0) {
//   //         this.selectedQuestion.set(data[0]);
//   //       }
//   //     },
//   //     error: (err) => console.error("Error cargando comentarios", err)
//   //   });
//   // }

//   /**
//    * CARGAR COMENTARIOS: Ajustada para disparar IA en la selección inicial.
//   */
//   private cargarComentarios() {
//     this.commentService.getByPage(this.pageId()).subscribe({
//       next: (data: CommentResponseDTO[]) => {
//         // 1. Si NO hay datos, reseteamos todo el estado de la vista de detalle
//         if (!data || data.length === 0) {
//           this.misComentarios.set([]);
//           this.selectedQuestion.set(null);
//           this.nuevaRespuesta.set('');
//           this.cargandoIA.set(false);
//           return;
//         }

//         // 2. Si HAY datos, procedemos con la lógica de actualización
//         const preguntaPreviaId = this.selectedQuestion()?.id;
//         this.misComentarios.set(data);
        
//         if (preguntaPreviaId) {
//           // Actualizamos la selección actual sin disparar la IA de nuevo
//           const actualizada = data.find(c => c.id === preguntaPreviaId);
//           if (actualizada) {
//             this.selectedQuestion.set(actualizada);
//           } else {
//             // Si la pregunta que teníamos abierta ya no existe (ej. alguien la borró)
//             this.selectQuestion(data[0]);
//           }
//         } else {
//           // Primera carga con datos: seleccionamos la primera y activamos IA
//           this.selectQuestion(data[0]);
//         }
//       },
//       error: (err) => {
//         console.error("Error cargando comentarios", err);
//         // En caso de error de red, vaciamos para evitar estados inconsistentes
//         this.misComentarios.set([]);
//         this.selectedQuestion.set(null);
//       }
//     });
//   }
  
//   // public selectQuestion(comentario: CommentResponseDTO) {
//   //   this.selectedQuestion.set(comentario);
//   // }

//   // // Este método se activa al hacer clic en cualquier comentario (ya sea pregunta o respuesta)
//   // public selectQuestion(comentario: CommentResponseDTO) {
//   //   // 1. Establecemos la pregunta seleccionada visualmente
//   //   this.selectedQuestion.set(comentario);

//   //   // 2. Limpiamos cualquier respuesta previa en el textarea
//   //   this.nuevaRespuesta.set('');

//   //   // 3. Disparamos la IA inmediatamente
//   //   this.cargandoIA.set(true);

//   //   this.commentService.getIASuggestion(comentario.id).subscribe({
//   //     next: (res) => {
//   //       // Seteamos la sugerencia recibida en el signal que controla el textarea
//   //       this.nuevaRespuesta.set(res.content);
//   //       this.cargandoIA.set(false);
//   //     },
//   //     error: (err) => {
//   //       console.error("Error al obtener sugerencia de IA:", err);
//   //       this.cargandoIA.set(false);
//   //       // Opcional: podrías poner un mensaje por defecto si falla
//   //       // this.nuevaRespuesta.set('No se pudo generar una sugerencia en este momento.');
//   //     }
//   //   });
//   // }

//   public selectQuestion(comentario: CommentResponseDTO) {
//     // 1. Evitar recargar si el profesor hace clic en la pregunta que ya está abierta
//     // y ya hay una respuesta escrita (para no borrar su progreso accidentalmente)
//     if (this.selectedQuestion()?.id === comentario.id && this.nuevaRespuesta()) {
//       return;
//     }

//     // 2. Establecemos la pregunta y reseteamos el estado
//     this.selectedQuestion.set(comentario);
//     this.nuevaRespuesta.set('');
//     this.cargandoIA.set(true);

//     // 3. Disparamos la IA
//     this.commentService.getIASuggestion(comentario.id).subscribe({
//       next: (res) => {
//         // VALIDACIÓN CRÍTICA: Solo inyectamos el texto si el profesor 
//         // sigue visualizando LA MISMA pregunta que originó la petición.
//         if (this.selectedQuestion()?.id === comentario.id) {
//           this.nuevaRespuesta.set(res.content);
          
//           // OPCIONAL: Poner el foco en el textarea automáticamente para editar
//           setTimeout(() => this.respuestaInput?.nativeElement.focus(), 100);
//         }
//         this.cargandoIA.set(false);
//       },
//       error: (err) => {
//         console.error("Error al obtener sugerencia de IA:", err);
//         this.cargandoIA.set(false);
//       }
//     });
//   }

//   /**
//    * Publica una nueva duda (Comentario Padre)
//    */
//   public publicarDuda() {
//     const texto = this.nuevaDuda().trim();
//     if (!texto) return;

//     const payload = {
//       content: texto,
//       pageId: this.pageId()
//       // parentId es null por defecto para nuevas preguntas
//     };

//     this.commentService.create(payload).subscribe({
//       next: () => {
//         this.nuevaDuda.set('');
//         this.cargarComentarios(); // Recargamos la lista
//       },
//       error: (err) => console.error("Error al publicar duda", err)
//     });
//   }

//   /**
//    * Publica una respuesta a la duda seleccionada
//    */
//   public publicarRespuesta() {
//     const texto = this.nuevaRespuesta().trim();
//     const preguntaActual = this.selectedQuestion();

//     if (!texto || !preguntaActual) return;

//     const payload = {
//       content: texto,
//       pageId: this.pageId(),
//       parentId: preguntaActual.id // <--- IMPORTANTE: Así vinculas la respuesta
//     };

//     this.commentService.create(payload).subscribe({
//       next: () => {
//         this.nuevaRespuesta.set('');
//         this.cargarComentarios(); // Recargamos para ver la respuesta en el hilo
//       },
//       error: (err) => console.error("Error al responder", err)
//     });
//   }

//   //
//   public borrarPregunta(id: number) {
//     if (confirm('¿Estás seguro de que quieres eliminar esta pregunta? Esta acción no se puede deshacer.')) {
//       this.commentService.eliminarComentario(id).subscribe({
//         next: () => {
//           // Actualizamos el signal de la lista filtrando la pregunta borrada
//           this.misComentarios.update(comentarios => comentarios.filter(c => c.id !== id));
          
//           // Si la pregunta borrada era la que estaba abierta, cerramos el detalle
//           if (this.selectedQuestion()?.id === id) {
//             this.selectedQuestion.set(null);
//           }
//         },
//         error: (err) => console.error('Error al borrar:', err)
//       });
//     }
//   }

//   // Añade este método en tu MisPreguntasComponent
//   public manejarResolucion(commentId: number) {
//     this.commentService.toggleResolved(commentId).subscribe({
//       next: () => {
//         // Actualizamos localmente sin recargar todo para que sea instantáneo
//         this.cargarComentarios();
//       },
//       error: (err) => console.error("Error al cambiar estado", err)
//     });
//   }

//   //
//   public cerrarPregunta() {
//     this.selectedQuestion.set(null);
//   }

//   //
//   public cancelar() {
//     this.nuevaDuda.set('');
//   }

//   //
//   public volverALaleccion() {
//     // Usamos la ruta absoluta para evitar errores de niveles
//     // Esto construye: /aula/1/page/5
//     // Nota: Si el '1' (ID del aula) es dinámico, deberías tener un signal para él.
//     // Si por ahora es fijo o siempre es el mismo contexto:
//     this.router.navigate(['/aula', 1, 'page', this.pageId()]);
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
import { PageService } from '../../../../services/universilabs/pages/page.service';
import { AuthService } from '../../../../../core/services/auth/auth.service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericSnackComponent } from '../../../../../shared/messages/generic-snack/generic-snack.component';


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
    CommentItemComponent,
    MatProgressSpinner
],
  templateUrl: './mis-preguntas.component.html',
  styleUrl: './mis-preguntas.component.scss',
})
export class MisPreguntasComponent implements OnInit, AfterViewInit {
//  
  // Inyecciones
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private commentService = inject(CommentService);
  private pageService = inject(PageService);
  private authService = inject(AuthService); // <-- MODIFICACIÓN: Inyectar AuthService
  private snackBar = inject(MatSnackBar);
  

  // --- SIGNALS DE ESTADO ---
  public pageId = signal<number>(0);
  public pageTitle = signal<string>('Cargando lección...');
  public userId = signal<number>(0); 
  public cargandoIA = signal<boolean>(false);
  public nuevaRespuesta = signal<string>('');
  
  public misComentarios = signal<CommentResponseDTO[]>([]); 
  public selectedQuestion = signal<CommentResponseDTO | null>(null);
  public nuevaDuda = signal<string>(''); 

  @ViewChild('dudaTextarea') dudaInput!: ElementRef<HTMLTextAreaElement>;
  @ViewChild('respuestaTextarea') respuestaInput!: ElementRef<HTMLTextAreaElement>;

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('pageId');
    if (idParam) {
      const id = Number(idParam);
      this.pageId.set(id);

      // <-- MODIFICACIÓN: Obtener el ID del usuario logueado
      this.authService.getCurrentUserId().subscribe({
        next: (id) => {
          if (id) {
            this.userId.set(id);
          } else {
            console.warn('No se pudo obtener el userId, el usuario no está autenticado');
            // Opcional: redirigir al login
          }
        },
        error: (err) => {
          console.error('Error obteniendo userId', err);
        }
      });

      this.cargarComentarios();
      this.cargarInfoPagina(id);
    }
  }

  private cargarInfoPagina(id: number) {
    this.pageService.findById(id).subscribe({
      next: (page) => {
        this.pageTitle.set(page.title || 'Lección sin título');
      },
      error: (err) => {
        console.error("Error al obtener el título de la página", err);
        this.pageTitle.set('Consulta de Lección');
      }
    });
  }

  public generarRespuestaIA() {
    const pregunta = this.selectedQuestion();
    if (!pregunta) return;

    this.cargandoIA.set(true);
    
    this.commentService.getIASuggestion(pregunta.id).subscribe({
      next: (res) => {
        if (this.selectedQuestion()?.id === pregunta.id) {
          this.nuevaRespuesta.set(res.content);
        }
        this.cargandoIA.set(false);
      },
      error: (err) => {
        console.error("Error al obtener sugerencia de IA:", err);
        this.cargandoIA.set(false);
      }
    });
  }

  public manejarReplyDesdeHijo(comentario: CommentResponseDTO) {
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

  private cargarComentarios() {
    this.commentService.getByPage(this.pageId()).subscribe({
      next: (data: CommentResponseDTO[]) => {
        if (!data || data.length === 0) {
          this.misComentarios.set([]);
          this.selectedQuestion.set(null);
          this.nuevaRespuesta.set('');
          this.cargandoIA.set(false);
          return;
        }

        const preguntaPreviaId = this.selectedQuestion()?.id;
        this.misComentarios.set(data);
        
        if (preguntaPreviaId) {
          const actualizada = data.find(c => c.id === preguntaPreviaId);
          if (actualizada) {
            this.selectedQuestion.set(actualizada);
          } else {
            this.selectQuestion(data[0]);
          }
        } else {
          this.selectQuestion(data[0]);
        }
      },
      error: (err) => {
        console.error("Error cargando comentarios", err);
        this.misComentarios.set([]);
        this.selectedQuestion.set(null);
      }
    });
  }

  public selectQuestion(comentario: CommentResponseDTO) {
    if (this.selectedQuestion()?.id === comentario.id && this.nuevaRespuesta()) {
      return;
    }

    this.selectedQuestion.set(comentario);
    this.nuevaRespuesta.set('');
    this.cargandoIA.set(true);

    this.commentService.getIASuggestion(comentario.id).subscribe({
      next: (res) => {
        if (this.selectedQuestion()?.id === comentario.id) {
          this.nuevaRespuesta.set(res.content);
          setTimeout(() => this.respuestaInput?.nativeElement.focus(), 100);
        }
        this.cargandoIA.set(false);
      },
      error: (err) => {
        console.error("Error al obtener sugerencia de IA:", err);
        this.cargandoIA.set(false);
      }
    });
  }

  /**
   * Publica una nueva duda (Comentario Padre)
   */
  public publicarDuda() {
    const texto = this.nuevaDuda().trim();
    if (!texto) return;

    // <-- MODIFICACIÓN: Incluir userId en el payload
    const payload = {
      content: texto,
      pageId: this.pageId(),
      userId: this.userId()
    };

    this.commentService.create(payload).subscribe({
      next: () => {
        this.nuevaDuda.set('');
        this.cargarComentarios();
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

    // <-- MODIFICACIÓN: Incluir userId en el payload
    const payload = {
      content: texto,
      pageId: this.pageId(),
      parentId: preguntaActual.id,
      userId: this.userId()
    };

    this.commentService.create(payload).subscribe({
      next: () => {
        this.nuevaRespuesta.set('');
        this.cargarComentarios();
      },
      error: (err) => console.error("Error al responder", err)
    });
  }

  // public borrarPregunta(id: number) {
  //   if (confirm('¿Estás seguro de que quieres eliminar esta pregunta? Esta acción no se puede deshacer.')) {
  //     this.commentService.eliminarComentario(id).subscribe({
  //       next: () => {
  //         this.misComentarios.update(comentarios => comentarios.filter(c => c.id !== id));
  //         if (this.selectedQuestion()?.id === id) {
  //           this.selectedQuestion.set(null);
  //         }
  //       },
  //       error: (err) => console.error('Error al borrar:', err)
  //     });
  //   }
  // }

  // public borrarPregunta(id: number) {
  //   if (confirm('¿Estás seguro de que quieres eliminar esta pregunta? Esta acción no se puede deshacer.')) {
  //     this.commentService.eliminarComentario(id).subscribe({
  //       next: () => {
  //         this.cargarComentarios(); // <-- Recarga la lista completa desde el backend
  //       },
  //       error: (err) => console.error('Error al borrar:', err)
  //     });
  //   }
  // }

 public borrarPregunta(id: number) {
    const snackBarRef = this.snackBar.openFromComponent(GenericSnackComponent, {
      data: {
        message: '¿Estás seguro de que quieres eliminar esta pregunta? Esta acción no se puede deshacer.',
        actionLabel: 'ELIMINAR',
        cancelLabel: 'CANCELAR'
      },
      duration: 5000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['custom-snack']
    });

    snackBarRef.onAction().subscribe(() => {
      this.commentService.eliminarComentario(id).subscribe({
        next: () => this.cargarComentarios(),
        error: (err) => console.error('Error al borrar:', err)
      });
    });
  }

  //
  public manejarResolucion(commentId: number) {
    this.commentService.toggleResolved(commentId).subscribe({
      next: () => {
        this.cargarComentarios();
      },
      error: (err) => console.error("Error al cambiar estado", err)
    });
  }

  public cerrarPregunta() {
    this.selectedQuestion.set(null);
  }

  public cancelar() {
    this.nuevaDuda.set('');
  }

  public volverALaleccion() {
    this.router.navigate(['/aula', 1, 'page', this.pageId()]);
  }
}