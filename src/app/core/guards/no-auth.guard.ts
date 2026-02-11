import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { map, catchError, of, filter, take, switchMap } from 'rxjs';

export const NoAuthGuard: CanActivateFn = () => {
//  
  const authService = inject(AuthService);
  const router = inject(Router);

  // En tu NoAuthGuard
  return authService.isInitialized$.pipe(
    filter(init => init === true), // Espera a que el APP_INITIALIZER termine
    take(1),
    map(() => {
      if (authService.isAuthenticated()) {
        // Si ya tiene sesión, lo mandamos a la ruta guardada o inicio
        const lastRoute = sessionStorage.getItem('last_valid_route') || '/inicio';
        return router.parseUrl(lastRoute);
      }
      return true; // Si no hay sesión, permite ver el Login
    })
  );
};
