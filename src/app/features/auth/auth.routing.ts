import { Routes } from '@angular/router';

export const authRoutes: Routes = [
   { path: '', redirectTo: 'login', pathMatch: 'full' },
   { path: 'login', loadComponent: () => import('./login/login.component').then(m => m.LoginFormComponent)},
   { path: 'register', loadComponent: () => import('./register/register.component').then( m => m.RegisterFormComponent)},
   { path: 'forgot-password', loadComponent: () => import('./password/password.component').then(m => m.ForgotPasswordFormComponent)},
   { path: 'check-code', loadComponent: () => import('./check-reset-code/check-reset-code.component').then(m => m.ResetCodeComponent)}
];
