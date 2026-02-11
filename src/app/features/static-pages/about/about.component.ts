import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
})
export class AboutComponent {
//
  private router = inject(Router);
  returnUrl: string = '/inicio';

  ngOnInit() {
    const rawUrl = sessionStorage.getItem('ast_valid_route');
    
    if (rawUrl) {
      // 1. Limpiamos la cadena si se ha concatenado
      // Si recibimos "ast_valid_route/inicio/acerca-de", nos quedamos con "/inicio"
      const parts = rawUrl.split('/');
      
      // Buscamos la primera parte que no sea vacía y no sea 'acerca-de'
      const validPart = parts.find(p => p !== '' && p !== 'acerca-de' && !p.includes('ast_valid_route'));
      
      if (validPart) {
        this.returnUrl = `/${validPart}`;
      }
    }
  }

  goBack() {
    // 2. Limpieza total antes de salir
    sessionStorage.removeItem('last_valid_route');
    
    // 3. Navegamos
    this.router.navigateByUrl(this.returnUrl);
  }
}