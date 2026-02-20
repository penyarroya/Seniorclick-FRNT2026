// import { Component, inject, OnInit, signal } from '@angular/core';
// import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
// import { filter } from 'rxjs/operators';
// import { BackendOverlayComponent } from "./core/components/backend-overlay/backend-overlay.component";
// import { AuthService } from './core/services/auth/auth.service';
// import { BackendStatusService } from './core/services/backend/backend-status.service'; 

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [RouterOutlet, BackendOverlayComponent],
//   templateUrl: './app.html',
//   styleUrls: ['./app.scss']
// })
// export class App implements OnInit {
//   protected readonly title = signal('seniorclick-FRNT2026');
//   private authService = inject(AuthService);
//   private router = inject(Router);
  
//   public backendService = inject(BackendStatusService); 
//   public loadingSession = signal(true);

//   ngOnInit(): void {
//     // AJUSTE 1: Mantenemos tu lógica de detección inmediata de backend caído
//     if (this.backendService.backendDown()) {
//       this.loadingSession.set(false);
//     }

//     // Ejecutamos checkSession tal como lo tenías para manejar el flujo de redirecciones
//     this.authService.checkSession().subscribe({
//       next: () => {
//         // Ahora isAuthenticated() devolverá true si los roles ya están en MAYÚSCULAS
//         const isAuthenticated = this.authService.isAuthenticated();
//         const currentPath = window.location.pathname;
//         const isTabActive = sessionStorage.getItem('tab_session_active');

//         if (isAuthenticated) {
//           this.saveValidRoute(currentPath);
//           this.router.events.pipe(
//             filter(event => event instanceof NavigationEnd)
//           ).subscribe((event: any) => {
//             this.saveValidRoute(event.urlAfterRedirects);
//           });
//         }

//         // Caso: Estamos en Login
//         if (currentPath.includes('/auth/login')) {
//           sessionStorage.setItem('tab_session_active', 'true');
//           this.loadingSession.set(false); 
//           return;
//         }

//         // Caso: Sesión huérfana (pestaña nueva sin validar)
//         if (isTabActive !== 'true' && isAuthenticated) {
//           console.warn('⚠️ Sesión huérfana detectada. Forzando Logout.');
//           sessionStorage.setItem('tab_session_active', 'true');
//           this.authService.logout().subscribe(() => {
//             sessionStorage.removeItem('last_valid_route');
//             this.router.navigate(['/auth/login']);
//             this.loadingSession.set(false);
//           });
//           return;
//         }

//         // Caso: Redirección a última ruta válida
//         if (isTabActive === 'true') {
//           const lastRoute = sessionStorage.getItem('last_valid_route');
//           // Si el usuario entra a la raíz, lo mandamos a donde estaba antes de refrescar
//           if ((currentPath === '/' || currentPath === '/inicio') && lastRoute && isAuthenticated) {
//             this.router.navigateByUrl(lastRoute);
//           }
//         }

//         // Redirigir a login si no hay sesión y no estamos en rutas de auth
//         if (!isAuthenticated && !currentPath.includes('/auth/')) {
//           this.router.navigate(['/auth/login']);
//         }

//         sessionStorage.setItem('tab_session_active', 'true');
//         this.loadingSession.set(false); 
//       },
//       error: (err) => {
//         console.error('Error crítico al verificar sesión:', err);
        
//         // Mantenemos tus ajustes de errores de conexión
//         const isConnError = err.status === 0 || err.status === 502 || err.status === 504;
//         if (isConnError) {
//           this.backendService.setBackendDown(true);
//         }

//         // IMPORTANTE: Apagamos el loading para que el @if muestre el error o el login
//         this.loadingSession.set(false); 
//       }
//     });
//   }

//   private saveValidRoute(url: string): void {
//     if (url && !url.includes('/auth/') && !url.includes('not-found') && url !== '/' && url !== '') {
//       sessionStorage.setItem('last_valid_route', url);
//     }
//   }
// }

import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { BackendOverlayComponent } from "./core/components/backend-overlay/backend-overlay.component";
import { AuthService } from './core/services/auth/auth.service';
import { BackendStatusService } from './core/services/backend/backend-status.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, BackendOverlayComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class App implements OnInit {
  protected readonly title = signal('seniorclick-FRNT2026');
  private authService = inject(AuthService);
  private router = inject(Router);
  
  public backendService = inject(BackendStatusService); 
  public loadingSession = signal(true);

  ngOnInit(): void {
    // 1. Detección inmediata de backend caído
    if (this.backendService.backendDown()) {
      this.loadingSession.set(false);
    }

    // 2. Escuchamos la navegación UNA SOLA VEZ al iniciar la app
    // Esto guarda la ruta cada vez que el usuario cambia de página exitosamente
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.saveValidRoute(event.urlAfterRedirects);
    });

    // 3. Flujo de validación de sesión
    this.authService.checkSession().subscribe({
      next: () => {
        const isAuthenticated = this.authService.isAuthenticated();
        const currentPath = window.location.pathname;
        const isTabActive = sessionStorage.getItem('tab_session_active');

        // Si ya estamos autenticados al entrar, guardamos la ruta actual
        if (isAuthenticated) {
          this.saveValidRoute(currentPath);
        }

        // Caso: Login
        if (currentPath.includes('/auth/login')) {
          sessionStorage.setItem('tab_session_active', 'true');
          this.loadingSession.set(false); 
          return;
        }

        // Caso: Sesión huérfana
        if (isTabActive !== 'true' && isAuthenticated) {
          console.warn('⚠️ Sesión huérfana detectada. Forzando Logout.');
          sessionStorage.setItem('tab_session_active', 'true');
          this.authService.logout().subscribe({
            next: () => {
              sessionStorage.removeItem('last_valid_route');
              this.router.navigate(['/auth/login']);
              this.loadingSession.set(false);
            }
          });
          return;
        }

        // Caso: Redirección a última ruta válida tras refresh
        if (isTabActive === 'true' && isAuthenticated) {
          const lastRoute = sessionStorage.getItem('last_valid_route');
          if ((currentPath === '/' || currentPath === '/inicio') && lastRoute) {
            this.router.navigateByUrl(lastRoute);
          }
        }

        // Caso: No autenticado fuera de rutas auth
        if (!isAuthenticated && !currentPath.includes('/auth/')) {
          this.router.navigate(['/auth/login']);
        }

        sessionStorage.setItem('tab_session_active', 'true');
        this.loadingSession.set(false); 
      },
      error: (err) => {
        console.error('Error crítico al verificar sesión:', err);
        const isConnError = err.status === 0 || err.status === 502 || err.status === 504;
        if (isConnError) {
          this.backendService.setBackendDown(true);
        }
        this.loadingSession.set(false); 
      }
    });
  }

  private saveValidRoute(url: string): void {
    if (url && !url.includes('/auth/') && !url.includes('not-found') && url !== '/' && url !== '') {
      sessionStorage.setItem('last_valid_route', url);
    }
  }
}