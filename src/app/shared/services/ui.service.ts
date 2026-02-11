import { inject, Injectable } from '@angular/core';
import { GenericSnackComponent } from '../messages/generic-snack/generic-snack.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class UiService {
//
  private snackBar = inject(MatSnackBar);

  showConfirmation(message: string, actionLabel: string = 'ACEPTAR') {
    return this.snackBar.openFromComponent(GenericSnackComponent, {
      duration: 5000,
      panelClass: ['info-snackbar'], // Siempre usa la misma clase global
      data: {
        message: message,
        actionLabel: actionLabel,
        cancelLabel: 'CANCELAR'
      }
    });
  }  
}
