import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-generic-snack',
  imports: [MatButtonModule, MatIcon],
  templateUrl: './generic-snack.component.html',
  styleUrl: './generic-snack.component.scss',
})
export class GenericSnackComponent {
//
  // Inyectamos los datos que pasamos al abrirlo
  constructor(
    public snackBarRef: MatSnackBarRef<GenericSnackComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { 
      message: string, 
      actionLabel?: string, 
      cancelLabel?: string 
    }
  ) {}

  confirm() {
    this.snackBarRef.dismissWithAction();
  }

  cancel() {
    this.snackBarRef.dismiss();
  }
}
