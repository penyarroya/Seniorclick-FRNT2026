import { Injectable, signal, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class ViewerCommunicationService {
  private snackBar = inject(MatSnackBar); // Inyectamos el servicio de notificaciones
  
  isViewerActive = signal<boolean>(false);
  resourceToOpen = signal<any>(null);

  openResource(resource: any) {
    if (this.isViewerActive()) {
      const nombreRecurso = resource.title || 'este recurso';
      
      // CAMBIO: Reemplazamos alert por SnackBar
      this.snackBar.open(
        `⚠️ Cierra el recurso actual antes de abrir "${nombreRecurso}"`, 
        'Entendido', 
        {
          duration: 4000,           // Dura 4 segundos
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          panelClass: ['warning-snackbar'] // Por si quieres darle estilo CSS
        }
      );
      return;
    }
    this.resourceToOpen.set(resource);
  }

  setViewerStatus(status: boolean) {
    this.isViewerActive.set(status);
  }

  clearResource() {
    this.resourceToOpen.set(null);
    this.setViewerStatus(false);
  }
}