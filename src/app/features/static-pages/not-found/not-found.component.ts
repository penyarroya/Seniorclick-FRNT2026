import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ToolbarComponent } from '../../../shared/toolbar/toolbar.component';
import { MatButtonModule } from '@angular/material/button'; // <--- Añade esto

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrl: './not-found.component.scss',
  standalone: true,
  imports: [
    ToolbarComponent, 
    MatButtonModule // <--- Y esto
  ]
})
export class NotFoundComponent {
  private router = inject(Router);

  // En not-found.component.ts
  goBack() {
    const ruta = sessionStorage.getItem('last_valid_route');
    if (ruta) {
      this.router.navigateByUrl(ruta, { replaceUrl: true });
    } else {
      this.router.navigate(['/inicio'], { replaceUrl: true });
    }
  }

  // Te sugiero añadir este por si el usuario prefiere ir a la raíz directamente
  goHome() {
    this.router.navigate(['/inicio'], { replaceUrl: true });
  }
}