// import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
// import { catchError, switchMap, throwError, Observable, of, timer } from 'rxjs';
// import { inject } from '@angular/core';
// import { BackendStatusService } from '../services/backend/backend-status.service';
// import { AuthService } from '../services/auth/auth.service';
// import { Router } from '@angular/router';

// export const httpErrorInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<any>,
//   next: HttpHandlerFn
// ): Observable<HttpEvent<any>> => {
//   const authService = inject(AuthService);
//   const backendStatus = inject(BackendStatusService);
//   const router = inject(Router);

//   // 1. Configuración de exclusiones (evita bucles infinitos en el refresh)
//   const excludedUrls = ['/auth/login', '/auth/register', '/auth/refresh-token', '/auth/session', '/auth/health'];
//   const isExcluded = excludedUrls.some(url => req.url.includes(url));
  
//   // Clonamos con withCredentials para manejar Cookies (HttpOnly)
//   const authReq = req.clone({ withCredentials: true });

//   return next(authReq).pipe(
//     catchError((error: HttpErrorResponse) => {
      
//       // --- A. DETECCIÓN DE BACKEND CAÍDO ---
//       const isConnectionError = error.status === 0 || [502, 503, 504].includes(error.status);
//       if (isConnectionError) {
//         backendStatus.setBackendDown(true); 
//         return throwError(() => error);
//       }

//       if (backendStatus.backendDown()) {
//         backendStatus.retryBackend(); 
//       }

//       // --- B. MANEJO DE SESIÓN AL ARRANCAR (Silent 401) ---
//       // Si falla la verificación inicial de sesión, no es un error, solo no está logueado
//       if (error.status === 401 && req.url.includes('/auth/session')) {
//         return of(new HttpResponse({ 
//           status: 200, 
//           body: { authenticated: false } 
//         }));
//       }

//       // --- C. ESCUDO PARA /ME ---
//       if (error.status === 401 && req.url.includes('/auth/me') && !authService.isAuthenticated()) {
//         return of(new HttpResponse({ 
//           status: 200, 
//           body: { roles: [], username: null, userId: null } 
//         }));
//       }

//       // --- D. LÓGICA DE REFRESH TOKEN (401) ---
//       // Gracias a tu Java GlobalExceptionHandler, InvalidTokenException ahora llega aquí como 401
//       // if (error.status === 401 && !isExcluded) {
//       //   if (authService.getLoggingOutStatus()) {
//       //     return throwError(() => error);
//       //   }

//       //   return authService.refreshToken().pipe(
//       //     switchMap(() => {
//       //       // Éxito: Reintentamos la petición original
//       //       return next(req.clone({ withCredentials: true }));
//       //     }),
//       //     catchError(refreshErr => {
//       //       // Si el refresh da 409, otra petición ya lo refrescó. ¡Reintenta!
//       //       if (refreshErr.status === 409) {
//       //         console.log('Conflicto de refresh (409) detectado. Reintentando...');
//       //         return next(req.clone({ withCredentials: true }));
//       //       }

//       //       // Si el refresh falla (ej. Refresh Token expirado), cerramos sesión
//       //       authService.setAuthenticated(false);
//       //       localStorage.removeItem('user_data'); 
            
//       //       if (!router.url.includes('/auth/login')) {
//       //         router.navigate(['/auth/login']);
//       //       }
//       //       return throwError(() => refreshErr);
//       //     })
//       //   );
//       // }

//       // --- D. LÓGICA DE REFRESH TOKEN (Se queda igual) ---
//     if (error.status === 401 && !isExcluded) {
//         if (authService.getLoggingOutStatus()) {
//             return throwError(() => error);
//         }

//         return authService.refreshToken().pipe(
//             switchMap(() => {
//                 // Si llegamos aquí, las cookies ya están actualizadas
//                 return next(req.clone({ withCredentials: true }));
//             }),
//             catchError(refreshErr => {
//                 if (refreshErr.status === 409) {
//                     return next(req.clone({ withCredentials: true }));
//                 }
//                 // Limpieza en caso de error fatal
//                 authService.setAuthenticated(false);
//                 localStorage.removeItem('user_data'); 
//                 if (!router.url.includes('/auth/login')) {
//                     router.navigate(['/auth/login']);
//                 }
//                 return throwError(() => refreshErr);
//             })
//         );
//     }

//       // --- E. MANEJO DE CONFLICTO POR PETICIÓN PARALELA (409) ---
//       // Si una petición normal da 409, significa que su token murió mientras otra refrescaba.
//       if (error.status === 409) {
//           console.warn('Petición en periodo de gracia (409). Reintentando...');
//           // Delay de 100ms para asegurar que la cookie nueva se asiente en el navegador
//           return timer(100).pipe(
//               switchMap(() => next(req.clone({ withCredentials: true })))
//           );
//       }

//       return throwError(() => error);
//     })
//   );
// };

// import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
// import { catchError, switchMap, throwError, Observable, of, timer } from 'rxjs';
// import { inject } from '@angular/core';
// import { BackendStatusService } from '../services/backend/backend-status.service';
// import { AuthService } from '../services/auth/auth.service';
// import { Router } from '@angular/router';

// export const httpErrorInterceptor: HttpInterceptorFn = (
//   req: HttpRequest<any>,
//   next: HttpHandlerFn
// ): Observable<HttpEvent<any>> => {
//   const authService = inject(AuthService);
//   const backendStatus = inject(BackendStatusService);
//   const router = inject(Router);

//   // 1. URLs que no deben disparar lógica de Refresh Token
//   const excludedUrls = ['/auth/login', '/auth/register', '/auth/refresh-token', '/auth/session', '/auth/health'];
//   const isExcluded = excludedUrls.some(url => req.url.includes(url));
  
//   // 2. Obligamos a que todas las peticiones lleven las Cookies HttpOnly
//   const authReq = req.clone({ withCredentials: true });

//   return next(authReq).pipe(
//     catchError((error: HttpErrorResponse) => {
      
//       // --- A. GESTIÓN DE ESTADO DEL BACKEND (Offline) ---
//       const isConnectionError = error.status === 0 || [502, 503, 504].includes(error.status);
//       if (isConnectionError) {
//         backendStatus.setBackendDown(true); 
//         return throwError(() => error);
//       }
      
//       // Si el backend responde (cualquier status), asumimos que está Up
//       if (backendStatus.backendDown()) {
//         backendStatus.retryBackend(); 
//       }

//       // --- B. SILENT RESPONSES (Evitan errores en consola para flujos de control) ---
      
//       // Sesión: Si no hay sesión, respondemos un objeto neutro en lugar de error
//       if (error.status === 401 && req.url.includes('/auth/session')) {
//         return of(new HttpResponse({ status: 200, body: { authenticated: false } }));
//       }

//       // Perfil (/me): Si falla y no estamos logueados, devolvemos DTO vacío
//       // if (error.status === 401 && req.url.includes('/auth/me') && !authService.isAuthenticated()) {
//       //   return of(new HttpResponse({ 
//       //     status: 200, 
//       //     body: { userId: null, username: null, email: null, firstName: '', lastName: '', roles: [] } 
//       //   }));
//       // }

//       // Perfil (/me): Si falla y no estamos logueados, devolvemos un objeto neutro
//       if (error.status === 401 && req.url.includes('/auth/me') && !authService.isAuthenticated()) {
//         return of(new HttpResponse({ 
//           status: 200, 
//           body: { 
//             userId: null, 
//             username: null, 
//             email: null, 
//             firstName: '', 
//             lastName: '', 
//             avatarUrl: null, // Añadimos esto para que coincida con CurrentUser
//             roles: []        // Mantenemos el array vacío para evitar errores de .map() o .includes()
//           } 
//         }));
//       }

//       // // --- C. LÓGICA DE REFRESH TOKEN (Solo para URLs NO excluidas) ---
//       // if (error.status === 401 && !isExcluded) {
//       //   // Si el usuario ya está cerrando sesión, no intentamos refrescar
//       //   if (authService.getLoggingOutStatus()) {
//       //     return throwError(() => error);
//       //   }

//       //   return authService.refreshToken().pipe(
//       //     switchMap(() => next(req.clone({ withCredentials: true }))),
//       //     catchError(refreshErr => {
//       //       // Si el refresh también falla (401/403), la sesión expiró de verdad
//       //       authService.setAuthenticated(false);
//       //       localStorage.removeItem('user_data'); 
            
//       //       if (!router.url.includes('/auth/login')) {
//       //         router.navigate(['/auth/login']);
//       //       }
//       //       return throwError(() => refreshErr);
//       //     })
//       //   );
//       // }

//       // --- C. LÓGICA DE REFRESH TOKEN (Solo para URLs NO excluidas) ---
//       if (error.status === 401 && !isExcluded) {
//         // Si el usuario ya está cerrando sesión, no intentamos refrescar
//         if (authService.getLoggingOutStatus()) {
//           return throwError(() => error);
//         }

//         return authService.refreshToken().pipe(
//           switchMap(() => {
//             // Éxito: Reintentamos la petición original con las nuevas cookies
//             return next(req.clone({ withCredentials: true }));
//           }),
//           catchError(refreshErr => {
//             // Si el refresh también falla, la sesión expiró o es inválida
            
//             // USAMOS EL MÉTODO CENTRALIZADO: 
//             // Esto limpia subjects, detiene el timer de auto-refresh y borra storage.
//             // (Si lo pusiste 'private', cámbialo a 'public' en el servicio 
//             // o usa ['handleInternalLogout']() para que no proteste TS)
//             authService['handleInternalLogout'](); 
            
//             if (!router.url.includes('/auth/login')) {
//               router.navigate(['/auth/login']);
//             }
            
//             return throwError(() => refreshErr);
//           })
//         );
//       }

//       // --- D. MANEJO DE CONFLICTOS Y REINTENTOS (409) ---
//       if (error.status === 409) {
//           console.warn('⚠️ Conflicto detectado. Reintentando...');
//           return timer(100).pipe(
//               switchMap(() => next(req.clone({ withCredentials: true })))
//           );
//       }

//       // Si es una URL excluida (como /health) y da 401, simplemente lanzamos el error
//       // sin intentar refrescar el token para evitar bucles.
//       return throwError(() => error);
//     })
//   );
// };

import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, switchMap, throwError, Observable, of, timer } from 'rxjs';
import { inject } from '@angular/core';
import { BackendStatusService } from '../services/backend/backend-status.service';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

export const httpErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const backendStatus = inject(BackendStatusService);
  const router = inject(Router);

  // 1. URLs que no deben disparar la lógica de Refresh Token
  const excludedUrls = ['/auth/login', '/auth/register', '/auth/refresh-token', '/auth/session', '/auth/health'];
  const isExcluded = excludedUrls.some(url => req.url.includes(url));
  
  // 2. Adjuntar credenciales (Cookies HttpOnly) a todas las peticiones
  const authReq = req.clone({ withCredentials: true });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
      // --- A. GESTIÓN DE ESTADO DEL BACKEND (Offline) ---
      const isConnectionError = error.status === 0 || [502, 503, 504].includes(error.status);
      if (isConnectionError) {
        backendStatus.setBackendDown(true); 
        return throwError(() => error);
      }
      
      if (backendStatus.backendDown()) {
        backendStatus.retryBackend(); 
      }

      // --- B. SILENT RESPONSES (Evitan errores rojos en consola en flujos esperados) ---
      
      // Si falla /session al arrancar, devolvemos un estado no autenticado limpio
      if (error.status === 401 && req.url.includes('/auth/session')) {
        return of(new HttpResponse({ status: 200, body: { authenticated: false } }));
      }

      // Si falla /me y no estamos logueados, devolvemos un objeto de usuario vacío
      if (error.status === 401 && req.url.includes('/auth/me') && !authService.isAuthenticated()) {
        return of(new HttpResponse({ 
          status: 200, 
          body: { 
            userId: null, 
            username: null, 
            email: null, 
            firstName: '', 
            lastName: '', 
            avatarUrl: null,
            roles: [] 
          } 
        }));
      }

      // --- C. LÓGICA DE REFRESH TOKEN (401) ---
      if (error.status === 401 && !isExcluded) {
        if (authService.getLoggingOutStatus()) {
          return throwError(() => error);
        }

        return authService.refreshToken().pipe(
          switchMap(() => next(req.clone({ withCredentials: true }))),
          catchError(refreshErr => {
            // Si el refresh falla, limpiamos todo el estado global y local
            authService['handleInternalLogout'](); 
            
            if (!router.url.includes('/auth/login')) {
              router.navigate(['/auth/login']);
            }
            return throwError(() => refreshErr);
          })
        );
      }

      // --- D. MANEJO DE CONFLICTOS Y REINTENTOS (409) ---
      // Útil si varias peticiones fallan a la vez mientras se refrescaba el token
      if (error.status === 409) {
          console.warn('⚠️ Conflicto detectado (Token en proceso). Reintentando...');
          return timer(100).pipe(
              switchMap(() => next(req.clone({ withCredentials: true })))
          );
      }

      return throwError(() => error);
    })
  );
};