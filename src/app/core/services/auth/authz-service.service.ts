// import { Injectable, inject, signal, computed } from '@angular/core';
// import { AuthService } from './auth.service'; 
// import { Permission } from '../../../features/layouts/maintenance-layout/maintenance-layout.component';

// @Injectable({
//   providedIn: 'root',
// })
// export class AuthzService {
//   // Cambiamos a public para que el ngOnInit del layout pueda forzar roles en pruebas
//   public permissions = signal<Permission[]>([]);
//   private authService = inject(AuthService);

//   constructor() {
//     this.initializePermissions();
//   }

//   public initializePermissions() {
//     this.authService.getUserRoles().subscribe({
//       next: (roles: string[]) => {
//         // Normalizamos los roles a Mayúsculas para que coincidan con tu Java
//         const upperRoles = roles.map(r => r.toUpperCase());
        
//         console.log('Roles detectados desde el backend:', upperRoles);

//         if (upperRoles.includes('ROLE_SUPER_ADMIN') || upperRoles.includes('SUPER_ADMIN') || upperRoles.includes('ROLE_ADMIN')) {
//           this.setRole('admin');
//         } else if (upperRoles.includes('ROLE_MODERATOR') || upperRoles.includes('ROLE_MANAGER')) {
//           this.setRole('editor');
//         } else {
//           this.setRole('viewer');
//         }
//       },
//       error: () => this.setRole('viewer')
//     });
//   }

//   /**
//    * Mapea los roles de Java a los permisos genéricos (CREATE, EDIT, DELETE) 
//    * que espera el MaintenanceLayoutComponent
//    */
//   public setRole(role: 'admin' | 'editor' | 'viewer') {
//     switch (role) {
//       case 'admin':
//         // Esto activa los botones con *ngIf="canCreate()", canEdit(), etc.
//         this.permissions.set([Permission.CREATE, Permission.EDIT, Permission.DELETE]);
//         break;
//       case 'editor':
//         this.permissions.set([Permission.CREATE, Permission.EDIT]);
//         break;
//       default:
//         this.permissions.set([]);
//     }
//   }

//   has(permission: Permission) {
//     // Retorna una señal computada que el HTML puede ejecutar como canEdit()
//     return computed(() => this.permissions().includes(permission));
//   }
// }

import { Injectable, inject, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AuthService } from './auth.service'; 
import { Permission } from '../../../features/layouts/maintenance-layout/maintenance-layout.component';

@Injectable({
  providedIn: 'root',
})
export class AuthzService {
  private authService = inject(AuthService);

  // 1. Convertimos el Observable directamente en una Signal reactiva.
  // Esto elimina la necesidad de .subscribe() y de comparaciones manuales con JSON.stringify
  private roles = toSignal(this.authService.getUserRoles(), { initialValue: [] as string[] });

  // 2. Usamos computed para derivar los permisos de forma automática.
  // Cuando 'roles' cambie, 'permissions' se actualizará solo.
  public permissions = computed(() => {
    const rawRoles = this.roles();
    const upperRoles = rawRoles.map(r => r.toUpperCase());

    if (upperRoles.some(r => ['ROLE_SUPER_ADMIN', 'SUPER_ADMIN', 'ROLE_ADMIN'].includes(r))) {
      return [Permission.CREATE, Permission.EDIT, Permission.DELETE];
    } else if (upperRoles.some(r => ['ROLE_MODERATOR', 'ROLE_MANAGER'].includes(r))) {
      return [Permission.CREATE, Permission.EDIT];
    }
    return [];
  });

  // 3. Tu función has() sigue funcionando igual, pero ahora es más eficiente
  has(permission: Permission) {
    return computed(() => this.permissions().includes(permission));
  }
}