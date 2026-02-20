import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommentResponseDTO } from '../../../models/universilabas/coments/coments-respose.model';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  // IMPORTANTE: Se importa a sí mismo para poder ser recursivo en el HTML
  imports: [CommonModule, MatIconModule, MatButtonModule, CommentItemComponent],
  templateUrl: './comment-item.component.html',
  styleUrls: ['./comment-item.component.scss']
})
export class CommentItemComponent {
//  
  @Input() comment!: CommentResponseDTO;
  @Input() isReply: boolean = false;
  @Input() isAdmin: boolean = false;

  @Output() replyEvent = new EventEmitter<CommentResponseDTO>();
  @Output() resolveEvent = new EventEmitter<number>();

  onReply() {
    this.replyEvent.emit(this.comment);
  }

  onToggleResolved() {
    this.resolveEvent.emit(this.comment.id);
  }
}