// import { CanActivateFn, Router } from '@angular/router';
// import { inject } from '@angular/core';
// import { AuthService } from '../services/auth/auth.service';
// import { map, catchError, of } from 'rxjs';

// export const AuthGuard: CanActivateFn = () => {
//   const authService = inject(AuthService);
//   const router = inject(Router);

//   if (authService.isAuthenticated()) return true;

//   // Si estamos saliendo, directo al login sin preguntar al servidor
//   if (authService.getLoggingOutStatus()) {
//     return router.createUrlTree(['/auth/login']);
//   }

//   return authService.checkSession().pipe(
//     map(() => authService.isAuthenticated() ? true : router.createUrlTree(['/auth/login'])),
//     catchError(() => of(router.createUrlTree(['/auth/login'])))
//   );
// };

import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { map, take, filter } from 'rxjs';

export const AuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isInitialized$.pipe(
    // 1. Esperamos a que 'isInitialized' sea true (el checkSession terminó)
    filter(initialized => initialized === true),
    take(1),
    // 2. Ahora que sabemos que el valor de authenticated es real, decidimos
    map(() => {
      const isAuthenticated = authService.isAuthenticated(); // Método sincrónico que devuelve el valor actual
      if (isAuthenticated) {
        return true;
      }
      return router.createUrlTree(['/auth/login']);
    })
  );
};