import { Routes } from '@angular/router';
import { LoginFormComponent } from './features/auth/login/login.component';
import { RegisterFormComponent } from './features/auth/register/register.component';
import { NotFoundComponent } from './features/static-pages/not-found/not-found.component';
import { NoAuthGuard } from './core/guards/no-auth.guard';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { projectAccessGuard } from './core/guards/project-access.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/home-page/home-page.component').then(m => m.HomePageComponent)
  },
  // Rutas de autenticación bajo AuthLayout
  {
    path: 'auth',
    loadComponent: () =>
      import('./features/layouts/auth-layout/auth-layout.component').then(m => m.AuthLayoutComponent),
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginFormComponent, canActivate: [NoAuthGuard] },
      { path: 'register', component: RegisterFormComponent, canActivate: [NoAuthGuard] },
      { path: 'forgot-password', component: ForgotPasswordComponent },
      { path: 'check-code', 
        loadComponent: () => import('./features/auth/check-reset-code/check-reset-code.component')
          .then(m => m.ResetCodeComponent) 
      },
    ]
  },
  {
    path: 'inicio',
    loadComponent: () =>
      import('./features/layouts/init-layout/init-layout.component').then(m => m.InitLayoutComponent),
    children: [
      {
        path: 'acerca-de',
        loadComponent: () =>
          import('./features/static-pages/about/about.component').then(m => m.AboutComponent)
      },
      {
        path: 'proyectos', // La URL final será: /inicio/proyectos
        loadComponent: () =>
          import('./features/pages/project-page/project-page.component').then(m => m.ProjectPageComponent)
      },
      {
        path: 'perfil', // URL: /inicio/perfil
        loadComponent: () => 
          import('./features/pages/show-pages/misy-profiles/misy-profiles.component').then(m => m.MisyProfilesComponent),
        title: 'Mi Perfil'
      },
      {
        path: 'mis-inscripciones',
        loadComponent: () => 
          import('./features/pages/show-pages/mis-inscripciones/mis-inscripciones.component').then(m => m.MisInscripcionesComponent)
      },
      {
        path: 'mis-resources',
        loadComponent: () => 
          import('./features/pages/show-pages/mis-resources/mis-resources.component').then(m => m.MisResourcesComponent)
      },
      // NUEVA RUTA PARA EL ESTUDIANTE
      {
        path: 'leccion/:id', 
        loadComponent: () => import('./features/pages/mantinance/page-wieber/page-wieber.component').then(m => m.PageViewerComponent)
      }
    ]
  },
  //3. LAYOUT ACADÉMICO (AQUÍ LO INSERTAMOS)
  {
    path: 'aula/:projectId',
    canActivate: [projectAccessGuard],
    loadComponent: () => 
      import('./features/layouts/academic-workspace/academic-workspace.component').then(m => m.AcademicWorkspaceComponent),
    children: [
      { 
        path: 'visor-recurso', 
        loadComponent: () => import('./features/pages/mantinance/resource-full-page/resource-full-page.component').then(m => m.ResourceFullPageComponent) 
      },
      {
        path: 'page/:pageId',
        loadComponent: () => 
          import('./features/pages/page-viewer/page-viewer.component').then(m => m.PageViewerComponent)
      },
    {
        path: 'consultas/:pageId',
        loadComponent: () => 
          import('./features/pages/show-pages/coments/mis-preguntas/mis-preguntas.component').then(m => m.MisPreguntasComponent)
      },
      // Si entran sin ID de página, podrías redirigir o mostrar una intro
      { path: '', redirectTo: 'intro', pathMatch: 'full' }
    ]
  },
  // Rutas de mantenimiento bajo MaintenanceLayoutWrapperComponent
  {
    path: 'maintenance',
    loadComponent: () =>
      import('./features/layouts/maintenance-layout-wrapper/maintenance-layout-wrapper.component')
        .then(m => m.MaintenanceLayoutWrapperComponent),
    children: [
      {
        path: 'users',
        loadComponent: () =>
          import('./features/pages/mantinance/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'user-profiles',
        loadComponent: () =>
          import('./features/pages/mantinance/userprofiles/userprofiles.component').then(m => m.UserProfilesComponent)
      },
      {
        path: 'institutions',
        loadComponent: () =>
          import('./features/pages/mantinance/institutions/institutions.component').then(m => m.InstitutionsComponent)
      },
      {
        path: 'projects',
        loadComponent: () =>
          import('./features/pages/mantinance/projects/projects.component').then(m => m.ProjectsComponent)
      },
      {
        path: 'enrollments',
        loadComponent: () =>
          import('./features/pages/mantinance/enrollments/enrollments.component').then(m => m.EnrollmentsComponent)
      },
      {
        path: 'collections',
        loadComponent: () =>
          import('./features/pages/mantinance/collections/collections.component').then(m => m.CollectionsComponent)
      },
      {
        path: 'topics',
        loadComponent: () =>
          import('./features/pages/mantinance/topics/topics.component').then(m => m.TopicsComponent)
      },
      {
        path: 'subtopics',
        loadComponent: () =>
          import('./features/pages/mantinance/subtopics/subtopics.component').then(m => m.SubtopicsComponent)
      },
      {
        path: 'pages',
        loadComponent: () =>
          import('./features/pages/mantinance/pages/pages.component').then(m => m.PagesComponent)
      },
      {
        path: 'resources',
        loadComponent: () =>
          import('./features/pages/mantinance/resource/resource.component').then(m => m.ResourceComponent)
      },
      {
        path: 'coment',
        loadComponent: () =>
          import('./features/pages/mantinance/coment/coment.component').then(m => m.ComentComponent)
      },
      {
        path: 'contribution',
        data: { mode: 'admin' }, // Modo por defecto para admin
        loadComponent: () =>
          import('./features/pages/mantinance/contribution/contribution.component').then(m => m.ContributionComponent)
      },
      {
        path: 'contribution',
        data: { mode: 'user' }, // Modo para el alumno
        loadComponent: () =>
          import('./features/pages/mantinance/contribution/contribution.component').then(m => m.ContributionComponent)
      },
      {
        path: 'mi-progreso',
        loadComponent: () => import('./features/pages/mantinance/userprogress/userprogress.component').then(m => m.UserProgressComponent)
      },
      {
        path: 'roles',
        loadComponent: () => import('./features/pages/mantinance/roles/roles.component').then(m => m.RolesComponent)
      },
      {
        path: 'permissions',
        loadComponent: () => import('./features/pages/mantinance/permissions/permissions.component').then(m => m.PermissionsComponent)
      }
      // Otras rutas hijas que quieras agregar
    ]
  },
  { path: 'not-found', component: NotFoundComponent }, // Ruta explícita para el error
  { path: '**', redirectTo: 'not-found' }               // Redirección total
];
