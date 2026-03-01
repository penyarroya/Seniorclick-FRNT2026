// import { ChangeDetectorRef, Component, ElementRef, Inject, ViewChild } from '@angular/core';
// import { MatButtonModule } from '@angular/material/button';
// import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
// import { MatIcon } from "@angular/material/icon";
// import { A11yModule, FocusMonitor } from '@angular/cdk/a11y';

// @Component({
//   selector: 'app-generic-snack',
//   imports: [MatButtonModule, MatIcon, A11yModule],
//   templateUrl: './generic-snack.component.html',
//   styleUrl: './generic-snack.component.scss',
// })
// export class GenericSnackComponent {
// //
//   @ViewChild('cancelButton') cancelButton!: ElementRef<HTMLButtonElement>;
//   @ViewChild('confirmButton') confirmButton!: ElementRef<HTMLButtonElement>;

//   constructor(
//     public snackBarRef: MatSnackBarRef<GenericSnackComponent>,
//     private focusMonitor: FocusMonitor,
//     private cdr: ChangeDetectorRef,
//     @Inject(MAT_SNACK_BAR_DATA) public data: { 
//       message: string, 
//       actionLabel?: string, 
//       cancelLabel?: string 
//     }
//   ) {}

//   ngAfterViewInit() {
//     // Forzamos detección para Angular 20
//     this.cdr.detectChanges();

//     // Movemos el foco al botón de cerrar inmediatamente
//     requestAnimationFrame(() => {
//       if (this.cancelButton?.nativeElement) {
//         this.focusMonitor.focusVia(this.cancelButton.nativeElement, 'keyboard');
//       }
//     });
//   }

//   confirm() {
//     this.snackBarRef.dismissWithAction();
//   }

//   cancel() {
//     this.snackBarRef.dismiss();
//   }
// }

import { Component, ElementRef, Inject, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { A11yModule, FocusMonitor } from '@angular/cdk/a11y';

@Component({
  selector: 'app-generic-snack',
  standalone: true,
  imports: [
            MatButtonModule, 
            MatIconModule, 
            A11yModule
          ],
  templateUrl: './generic-snack.component.html',
  styleUrl: './generic-snack.component.scss'
})
export class GenericSnackComponent implements AfterViewInit {
  // 1. Obtenemos la referencia al botón de cancelar
  @ViewChild('cancelButton', { read: ElementRef }) cancelButton!: ElementRef<HTMLButtonElement>;

  constructor(
    public snackBarRef: MatSnackBarRef<GenericSnackComponent>,
    private focusMonitor: FocusMonitor,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_SNACK_BAR_DATA) public data: any
  ) {}

  ngAfterViewInit() {
    // 2. Forzamos la detección de cambios para que ViewChild esté disponible
    this.cdr.detectChanges();

    // 3. Usamos un pequeño retardo (requestAnimationFrame) para asegurar que 
    // el SnackBar esté totalmente renderizado antes de pedir el foco
    requestAnimationFrame(() => {
      if (this.cancelButton?.nativeElement) {
        // Colocamos el foco inicial en Cancelar usando el modo 'keyboard'
        // para que pinte tu borde negro de 4px inmediatamente
        this.focusMonitor.focusVia(this.cancelButton.nativeElement, 'keyboard');
      }
    });
  }

  // Esta es la función que ya tienes para el movimiento con el ratón
  moveFocus(element: HTMLElement) {
    if (element) {
      this.focusMonitor.focusVia(element, 'keyboard');
    }
  }

  confirm() { this.snackBarRef.dismissWithAction(); }
  cancel() { this.snackBarRef.dismiss(); }
}