import { Component, OnInit, inject, Input, Output, EventEmitter, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from "@angular/material/icon"; // Cambiado a MatIconModule para evitar errores de selectores
// IMPORTANTE: Importar el componente hijo
import { CommentItemComponent } from '../comment-item/comment-item.component'; 
import { take } from 'rxjs';
import { MatDivider } from "@angular/material/divider";
import { CommentService } from '../../../../services/universilabs/coments/coment.service';
import { CommentResponseDTO } from '../../../../models/universilabas/coments/coments-respose.model';
import { CommentRequestDTO } from '../../../../models/universilabas/coments/coments-request.model';
import { MisPreguntasComponent } from "../mis-preguntas/mis-preguntas.component";

@Component({
  selector: 'app-mis-commnets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    CommentItemComponent,
    MatDivider
],
  templateUrl: './mis-commnets.component.html',
  styleUrl: './mis-commnets.component.scss',
})
export class MisCommnetsComponent implements OnInit, OnChanges {
//  
  private commentService = inject(CommentService);
  public loading = signal<boolean>(false);

  // Almacena la pregunta seleccionada actualmente
  selectedQuestion = signal<CommentResponseDTO | null>(null);

  // Almacena solo las respuestas de la pregunta seleccionada
  selectedQuestionReplies = signal<CommentResponseDTO[]>([]);

  @Input() pageId!: number; 
  @Input() userId!: number; 

  //nuevo
  @Output() totalComments = new EventEmitter<number>();
  misComentarios = signal<any[]>([]);
  
  comments: CommentResponseDTO[] = [];
  newCommentContent: string = '';
  replyTo: CommentResponseDTO | null = null;

  // AÑADE ESTAS DOS LÍNEAS
  maxLength = 500;  // Límite de caracteres
  get remainingChars(): number {
    return this.maxLength - (this.newCommentContent.length || 0);
  }

  //nuevo
  actualizarTotal() {
    const total = this.misComentarios().length; // O la lógica que sume respuestas
    this.totalComments.emit(total);
  }

  ngOnInit(): void {
    this.loadComments();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['pageId'] && !changes['pageId'].isFirstChange()) {
      console.log('🔄 La página cambió a:', this.pageId);
      this.loadComments(); // Tu función para traer los comentarios del servidor
    }
  }

  // loadComments() {
  //   // Verificamos que pageId exista antes de llamar al servicio
  //   if (this.pageId) {
  //     this.commentService.getByPage(this.pageId).subscribe(data => {
  //       this.comments = data;
  //     });
  //   }
  // }

  // loadComments() {
  //   if (!this.pageId) return;

  //   // 1. Iniciamos estado de carga y limpiamos datos viejos
  //   this.loading.set(true);
  //   this.misComentarios.set([]); 

  //   this.commentService.getByPage(this.pageId)
  //     .pipe(take(1)) // Importar de 'rxjs'
  //     .subscribe({
  //       next: (data) => {
  //         this.misComentarios.set(data);
          
  //         // 2. Notificamos al Padre (Workspace)
  //         this.totalComments.emit(data.length); 
          
  //         console.log(`✅ Cargados ${data.length} comentarios para la página ${this.pageId}`);
  //         this.loading.set(false);
  //       },
  //       error: (err) => {
  //         console.error('❌ Error al cargar comentarios:', err);
  //         this.loading.set(false);
  //       }
  //     });
  // }

  //
  loadComments() {
    if (!this.pageId) return;

    this.loading.set(true);
    this.commentService.getByPage(this.pageId)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.misComentarios.set(data);
          this.totalComments.emit(data.length); 
          
          // --- ADICIÓN AQUÍ ---
          // Si ya había una pregunta seleccionada, actualizamos sus datos 
          // por si hay respuestas nuevas
          if (this.selectedQuestion()) {
            const updated = data.find(c => c.id === this.selectedQuestion()?.id);
            if (updated) this.selectQuestion(updated);
          }
          // ----------------------

          this.loading.set(false);
        },
        error: (err) => {
          console.error('❌ Error:', err);
          this.loading.set(false);
        }
      });
  }

  //
  sendComment() {
    if (!this.newCommentContent.trim()) return;

    const request: CommentRequestDTO = {
      content: this.newCommentContent,
      pageId: this.pageId,
      userId: this.userId,
      parentId: this.replyTo?.id ?? null 
    };

    this.commentService.create(request).subscribe(() => {
      this.newCommentContent = '';
      this.replyTo = null;
      this.loadComments(); 
    });
  }

  //
  selectQuestion(comment: CommentResponseDTO) {
    // 1. Marcamos la pregunta como seleccionada
    this.selectedQuestion.set(comment);

    // 2. Filtramos sus respuestas (suponiendo que tu DTO trae las respuestas anidadas)
    // Si tu API las trae dentro del objeto, las sacamos. Si no, habría que llamar al servicio.
    if (comment.replies) {
      this.selectedQuestionReplies.set(comment.replies);
    } else {
      this.selectedQuestionReplies.set([]);
    }

    // 3. (Opcional) Si quieres que al seleccionar una pregunta se active el modo respuesta
    this.replyTo = comment;
  }

  // Cambiamos el nombre para que coincida con el (replyEvent) de tu HTML
  // handleReply(comment: CommentResponseDTO) {
  //   this.replyTo = comment;
  //   // Hace scroll suave hacia el formulario de arriba
  //   const formElement = document.querySelector('.main-form-card');
  //   formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  // }

  handleReply(comment: CommentResponseDTO) {
    // En este nuevo diseño, al dar a responder, nos aseguramos 
    // de que esa sea la pregunta activa en el panel derecho
    this.selectQuestion(comment);
    this.replyTo = comment;
    
    // Opcional: poner el foco en el input del reply box
    const replyInput = document.querySelector('.bottom-reply-box textarea') as HTMLElement;
    replyInput?.focus();
  }

  // Cambiamos el nombre para que coincida con el (resolveEvent) de tu HTML
  handleResolve(id: number) {
    this.commentService.toggleResolved(id).subscribe(() => {
      this.loadComments();
    });
  }

  cancelComment() {
    this.newCommentContent = '';  // Limpia el texto
    this.replyTo = null;          // Cancela cualquier respuesta
  }
}