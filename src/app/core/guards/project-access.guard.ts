// import { CanActivateFn } from '@angular/router';

// export const projectAccessGuard: CanActivateFn = (route, state) => {
//   return true;
// };


import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of, timer, switchMap } from 'rxjs';
import { EnrollmentService } from '../../features/services/universilabs/enrollments/enrollments.service';

export const projectAccessGuard: CanActivateFn = (route, state) => {
//  
  const enrollmentService = inject(EnrollmentService);
  const router = inject(Router);

  const projectId = Number(route.params['projectId']);

  if (isNaN(projectId)) {
    router.navigate(['/inicio/proyectos']);
    return of(false);
  }

  // Comprobación con "Segunda Oportunidad"
  return enrollmentService.checkAccess(projectId).pipe(
    switchMap(hasAccess => {
      if (hasAccess) {
        // 1. Si tiene acceso a la primera, perfecto.
        return of(true);
      } else {
        // 2. Si no tiene acceso, esperamos 1 segundo y volvemos a preguntar.
        // Esto da tiempo a que la base de datos termine la inscripción.
        console.log('⏳ Acceso no detectado inicialmente, reintentando en 1s...');
        return timer(1000).pipe(
          switchMap(() => enrollmentService.checkAccess(projectId))
        );
      }
    }),
    map(hasAccess => {
      if (hasAccess) return true;

      // 3. Si tras el reintento sigue sin acceso, entonces sí lo expulsamos.
      router.navigate(['/inicio/proyectos'], { 
        queryParams: { error: 'no-enrolled', projectId: projectId } 
      });
      return false;
    }),
    catchError((err) => {
      console.error('❌ Error de seguridad:', err);
      router.navigate(['/inicio/proyectos']);
      return of(false);
    })
  );
};