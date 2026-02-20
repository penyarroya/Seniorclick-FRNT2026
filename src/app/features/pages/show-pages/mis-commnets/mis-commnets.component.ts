import { Component, OnInit, inject, Input, Output, EventEmitter, signal, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from "@angular/material/icon"; // Cambiado a MatIconModule para evitar errores de selectores
import { CommentService } from '../../../services/universilabs/coments/coment.service';
import { CommentResponseDTO } from '../../../models/universilabas/coments/coments-respose.model';
import { CommentRequestDTO } from '../../../models/universilabas/coments/coments-request.model';
// IMPORTANTE: Importar el componente hijo
import { CommentItemComponent } from '../comment-item/comment-item.component'; 
import { take } from 'rxjs';
import { MatDivider } from "@angular/material/divider";
import { MatProgressSpinner } from "@angular/material/progress-spinner";

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
    CommentItemComponent // <-- AÑADIDO: Sin esto, app-comment-item no funcionará
    ,
    MatDivider,
    MatProgressSpinner
],
  templateUrl: './mis-commnets.component.html',
  styleUrl: './mis-commnets.component.scss',
})
export class MisCommnetsComponent implements OnInit, OnChanges {
//  
  private commentService = inject(CommentService);
  public loading = signal<boolean>(false);

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

  loadComments() {
    if (!this.pageId) return;

    // 1. Iniciamos estado de carga y limpiamos datos viejos
    this.loading.set(true);
    this.misComentarios.set([]); 

    this.commentService.getByPage(this.pageId)
      .pipe(take(1)) // Importar de 'rxjs'
      .subscribe({
        next: (data) => {
          this.misComentarios.set(data);
          
          // 2. Notificamos al Padre (Workspace)
          this.totalComments.emit(data.length); 
          
          console.log(`✅ Cargados ${data.length} comentarios para la página ${this.pageId}`);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('❌ Error al cargar comentarios:', err);
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

  // Cambiamos el nombre para que coincida con el (replyEvent) de tu HTML
  handleReply(comment: CommentResponseDTO) {
    this.replyTo = comment;
    // Hace scroll suave hacia el formulario de arriba
    const formElement = document.querySelector('.main-form-card');
    formElement?.scrollIntoView({ behavior: 'smooth', block: 'start' });
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