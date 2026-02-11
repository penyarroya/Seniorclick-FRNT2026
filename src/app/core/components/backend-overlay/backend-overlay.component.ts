import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackendStatusService } from '../../services/backend/backend-status.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-backend-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './backend-overlay.component.html',
  styleUrls: ['./backend-overlay.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BackendOverlayComponent {
  public backendStatus = inject(BackendStatusService);

  // Este getter es el "interruptor" maestro. 
  // Mientras cualquiera de estos sea cierto, el overlay bloqueará la pantalla.
  get isReconnecting(): boolean {
    return (
      this.backendStatus.backendDown() || 
      this.backendStatus.reconnected()
    );
  }

  get statusMessage(): string {
    if (this.backendStatus.reconnected()) {
      return '✅ ¡Conexión restablecida!';
    }
    return '⚠️ El servidor no responde';
  }

  reintentar(): void {
    this.backendStatus.retryBackend();
  }
}