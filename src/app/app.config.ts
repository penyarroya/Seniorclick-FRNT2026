import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { routes } from './app.routes';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

// Importa tus interceptores
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';

// Importa tu servicio

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AuthService } from './core/services/auth/auth.service';

// Función para inicializar la sesión al arrancar (F5)
export function initializeApp(authService: AuthService) {
  return () => authService.checkSession();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideNoopAnimations(),
    provideAnimationsAsync(),
    //provideRouter(routes, withComponentInputBinding()),
    provideRouter(
      routes, 
      withComponentInputBinding(), 
      withRouterConfig({ onSameUrlNavigation: 'ignore' }) // Esto va DENTRO de los paréntesis de provideRouter
    ),
    
    provideHttpClient(
      withFetch(), 
      withInterceptors([
        authInterceptor,     
        httpErrorInterceptor 
      ])
    ),
    // --- ESTO ES LO QUE SOLUCIONA EL CIERRE DE SESIÓN ---
    {
      provide: APP_INITIALIZER,
      useFactory: initializeApp,
      deps: [AuthService],
      multi: true
    }
  ]
};
