// import { Component, OnInit, inject, ViewChild, signal, ChangeDetectorRef } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import {
//   MaintenanceLayoutComponent,
//   ColumnConfig
// } from '../../../layouts/maintenance-layout/maintenance-layout.component';
// import { UserDTO } from '../../../models/users/user-dto.model';
// import { UserService } from '../../../services/universilabs/users/user.service';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select'; // <--- Importante para el combo
// import { CommonModule } from '@angular/common';
// import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';
// import { PasswordComplexity } from '../../../../core/validators/password-complexity';

// @Component({
//   selector: 'app-users',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatSnackBarModule,
//     MatPaginatorModule,
//     MatButtonModule,
//     MatIconModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatSelectModule, // <--- Importante
//     MaintenanceLayoutComponent
//   ],
//   templateUrl: './users.component.html',
//   styleUrls: ['./users.component.scss']
// })
// export class UsersComponent implements OnInit {
// //  
//   @ViewChild(MaintenanceLayoutComponent) layout!: MaintenanceLayoutComponent<UserDTO>;

//   columns: ColumnConfig[] = [
//     { key: 'username', label: 'Usuario', priority: 1 },
//     { key: 'email', label: 'Email', priority: 2 },
//     { key: 'activo', label: 'Activo', priority: 1 },
//     { key: 'roles', label: 'Roles', priority: 2 }
//   ];

//   form!: FormGroup;
//   currentUser: UserDTO | null = null;
//   showModal = false;
//   showPassword = false; 

//   // Nueva señal para almacenar los roles que vienen de tu RoleController
//   allRoles = signal<any[]>([]);

//   // Servicios e inyecciones
//   userService = inject(UserService);
//   private fb = inject(FormBuilder);
//   private snack = inject(MatSnackBar);
//   private cd = inject(ChangeDetectorRef);

//   ngOnInit() {
//     this.initForm();
//     this.loadAvailableRoles(); // Cargamos los roles al iniciar
//   }

//   // Carga los roles desde el backend para llenar el mat-select
//     loadAvailableRoles() {
//     this.userService.getAvailableRoles().pipe(
//       catchError(err => {
//         console.error('Error 401: No tienes permiso para ver roles o no estás logueado', err);
//         // Devolvemos un array vacío para que el componente siga funcionando
//         return of([]); 
//       })
//     ).subscribe({
//       next: (roles) => {
//         console.log('Roles cargados:', roles);
//         this.allRoles.set(roles);
//       }
//     });
//   }

//   // Inicialización del formulario
//   initForm() {
//     const isEditing = !!this.currentUser;

//     this.form = this.fb.group({
//       username: [
//         '', 
//         [Validators.required, Validators.minLength(3), Validators.maxLength(120)], 
//         [this.usernameExistsValidator()] 
//       ],
//       email: ['', [
//           Validators.required, 
//           Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")
//         ], 
//         [this.emailExistsValidator()] // <--- FALTABA AÑADIR ESTO AQUÍ
//       ],
//       password: [
//         '', 
//         // Si editamos, no es obligatorio. Si creamos, sí.
//         isEditing ? [PasswordComplexity.validator] : [Validators.required, PasswordComplexity.validator]
//       ],
//       activo: [true],
//       // 'required' en un array vacío de un mat-select ya valida que haya al menos uno
//       roles: [[], [Validators.required]] 
//     });
//   }

//   // Método createUser adaptado al mat-select de roles
//   createUser() {
//     this.currentUser = null;
    
//     // Reiniciamos el formulario con valores por defecto
//     this.form.reset({ 
//       activo: true, 
//       roles: [] // Aseguramos que inicie como array para el mat-select multiple
//     });

//     // Re-aplicamos validadores de contraseña (ya que editUser los quita)
//     const passwordControl = this.form.get('password');
//     passwordControl?.setValidators([Validators.required, PasswordComplexity.validator]);
//     passwordControl?.updateValueAndValidity();

//     // Mostramos el modal
//     this.showModal = true;
//   }

//   // Método editUser adaptado al mat-select de roles
//   editUser(user: UserDTO) {
//     this.currentUser = user;

//     // 1. Preparamos los roles. 
//     // Si user.roles es un array de objetos, extraemos solo el nombre (o el ID) 
//     // para que coincida con el [value] de tus <mat-option>.
//     const rolesParaFormulario = Array.isArray(user.roles) 
//       ? user.roles.map((r: any) => typeof r === 'object' ? r.name : r)
//       : [];

//     // 2. Cargamos los datos en el formulario
//     this.form.patchValue({
//       ...user,
//       roles: rolesParaFormulario
//     });

//     // 3. Gestión de contraseña: al editar no es obligatoria
//     const passwordControl = this.form.get('password');
//     passwordControl?.clearValidators();
//     // Importante: No resetear el valor aquí si quieres mantenerlo, 
//     // pero usualmente se deja vacío para no mostrar el hash.
//     passwordControl?.setValue(''); 
//     passwordControl?.updateValueAndValidity();

//     this.showModal = true;
//   }

//   // Método deleteUser adaptado
//   deleteUser(user: UserDTO) {
//     console.log('Recibido para eliminar:', user); // Revisa esto en la consola (F12)
//     // Usamos el confirm nativo (o podrías usar un MatDialog en el futuro)
//     if (!confirm(`¿Estás seguro de que deseas eliminar al usuario "${user.username}"?`)) return;

//     this.userService.delete(user.id!).subscribe({
//       next: () => {
//         // Aplicamos la clase 'success-snackbar' que definimos en tu SCSS
//         this.snack.open('¡Usuario eliminado con éxito!', 'Entendido', { 
//           duration: 3000,
//           panelClass: ['success-snackbar'], // <--- Esto activa tu estilo neón
//           horizontalPosition: 'right',
//           verticalPosition: 'bottom'
//         });
        
//         // Recargamos la tabla
//         this.layout.load();
//       },
//       error: err => {
//         this.snack.open(`Error crítico: ${err.error?.message || err.message}`, 'Cerrar', { 
//           duration: 5000 
//         });
//       }
//     });
//   }

//   // Nuevo método saveUser adaptado al mat-select de roles
//   saveUser(): void {
//     // 1. Validaciones iniciales
//     if (this.form.invalid) {
//       this.form.markAllAsTouched();
//       return;
//     }

//     const formValue = this.form.value;
//     const isEditing = !!(this.currentUser && this.currentUser.id);

//     // 2. Procesamiento de Roles para Enum Java
//     const selectedRoles: string[] = Array.isArray(formValue.roles) 
//       ? formValue.roles
//           .filter((r: any) => !!r) 
//           .map((r: any) => String(r).toUpperCase().trim()) 
//       : [];

//     // 3. Payload
//     const userData: any = {
//       username: formValue.username,
//       email: formValue.email,
//       activo: formValue.activo,
//       roles: selectedRoles 
//     };

//     // 4. Lógica de Password
//     if (formValue.password && formValue.password.trim().length > 0) {
//       userData.password = formValue.password;
//     }

//     // 5. Definición de la petición
//     const request$ = isEditing
//       ? this.userService.update(Number(this.currentUser!.id), userData)
//       : this.userService.create(userData);

//     // 6. Ejecución
//     request$.subscribe({
//       next: () => {
//         // Usamos setTimeout para salir del ciclo de detección actual
//         setTimeout(() => {
//           // Cerramos el modal primero para que el componente deje de procesar el form
//           this.closeModal();

//           this.snack.open('¡Usuario guardado correctamente!', 'Cerrar', { 
//             duration: 3000,
//             panelClass: ['success-snackbar'] 
//           });
          
//           if (this.layout) {
//             this.layout.load();
//           }

//           // ✅ Obligamos a Angular a sincronizar la desaparición del modal
//           this.cd.detectChanges();
//         });
//       },
//       error: (err) => {
//         console.error('Error del servidor:', err);
//         const errorMessage = err.error?.message || 'Error interno del servidor (500)';
//         this.snack.open(`Error: ${errorMessage}`, 'Entendido', { duration: 5000 });
        
//         // También aquí para asegurar que el botón de carga se resetee visualmente
//         this.cd.detectChanges();
//       }
//     });
//   }

//   // 1. Validador de Usuario (username)
//   usernameExistsValidator(): AsyncValidatorFn {
//     return (control: AbstractControl): Observable<ValidationErrors | null> => {
//       // Si el campo está vacío o es IGUAL al nombre que ya tiene el usuario, saltamos la validación
//       if (!control.value || control.value === this.currentUser?.username) {
//         return of(null);
//       }
      
//       return timer(500).pipe(
//         switchMap(() => this.userService.checkUsernameExists(control.value)),
//         map(exists => (exists ? { usernameTaken: true } : null)),
//         catchError(() => of(null))
//       );
//     };
//   }

//   // 2. Validador de Email
//   emailExistsValidator(): AsyncValidatorFn {
//     return (control: AbstractControl): Observable<ValidationErrors | null> => {
//       // Si el campo está vacío o es IGUAL al email que ya tiene el usuario, saltamos la validación
//       if (!control.value || control.value === this.currentUser?.email) {
//         return of(null);
//       }

//       return timer(500).pipe(
//         switchMap(() => this.userService.checkEmailExists(control.value)),
//         map(exists => (exists ? { emailTaken: true } : null)),
//         catchError(() => of(null))
//       );
//     };
//   }

//   // Mostrar/ocultar contraseña
//   togglePasswordVisibility() { this.showPassword = !this.showPassword; }

//   // Cerrar modal
//   closeModal() {
//     this.showModal = false;
//     this.currentUser = null;
//   }

//   // Método toggleActivo permanece igual
//   toggleActivo(user: UserDTO) {
//     this.userService.toggleActivo(user.id!).subscribe(() => this.layout.load());
//   }

//   // Métodos auxiliares que tenías al final se mantienen por si los usas en la tabla
//   addRole(user: UserDTO, role: string) {
//     this.userService.addRole(user.id!, role).subscribe(() => this.layout.load());
//   }

//   removeRole(user: UserDTO, role: string) {
//     this.userService.removeRole(user.id!, role).subscribe(() => this.layout.load());
//   }
// }

import { Component, OnInit, inject, ViewChild, signal, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AsyncValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MaintenanceLayoutComponent,
  ColumnConfig
} from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { UserDTO } from '../../../models/users/user-dto.model';
import { UserService } from '../../../services/universilabs/users/user.service';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select'; 
import { CommonModule } from '@angular/common';
import { catchError, map, Observable, of, switchMap, timer } from 'rxjs';
import { PasswordComplexity } from '../../../../core/validators/password-complexity';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MaintenanceLayoutComponent
  ],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  
  @ViewChild(MaintenanceLayoutComponent) layout!: MaintenanceLayoutComponent<UserDTO>;

  // Columnas actualizadas para mostrar nombre y apellido
  columns: ColumnConfig[] = [
    { key: 'firstName', label: 'Nombre', priority: 2 },
    { key: 'lastName', label: 'Apellido', priority: 2 },
    { key: 'username', label: 'Usuario', priority: 1 },
    { key: 'email', label: 'Email', priority: 2 },
    { key: 'activo', label: 'Activo', priority: 1 },
    { key: 'roles', label: 'Roles', priority: 2 }
  ];

  form!: FormGroup;
  currentUser: UserDTO | null = null;
  showModal = false;
  showPassword = false; 

  allRoles = signal<any[]>([]);

  userService = inject(UserService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private cd = inject(ChangeDetectorRef);

  ngOnInit() {
    this.initForm();
    this.loadAvailableRoles();
  }

  loadAvailableRoles() {
    this.userService.getAvailableRoles().pipe(
      catchError(err => {
        console.error('Error al cargar roles', err);
        return of([]); 
      })
    ).subscribe({
      next: (roles) => {
        this.allRoles.set(roles);
      }
    });
  }

  initForm() {
    const isEditing = !!this.currentUser;

    this.form = this.fb.group({
      // --- CAMPOS DE PERFIL ---
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.maxLength(20)]],
      
      // --- CAMPOS DE CUENTA ---
      username: [
        '', 
        [Validators.required, Validators.minLength(3), Validators.maxLength(120)], 
        [this.usernameExistsValidator()] 
      ],
      email: [
        '', 
        [Validators.required, Validators.pattern("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$")], 
        [this.emailExistsValidator()]
      ],
      password: [
        '', 
        isEditing ? [PasswordComplexity.validator] : [Validators.required, PasswordComplexity.validator]
      ],
      activo: [true],
      roles: [[], [Validators.required]] 
    });
  }

  createUser() {
    this.currentUser = null;
    this.form.reset({ 
      activo: true, 
      roles: [],
      firstName: '',
      lastName: '',
      phone: ''
    });

    const passwordControl = this.form.get('password');
    passwordControl?.setValidators([Validators.required, PasswordComplexity.validator]);
    passwordControl?.updateValueAndValidity();

    this.showModal = true;
  }

  // editUser(user: UserDTO) {
  //   this.currentUser = user;

  //   const rolesParaFormulario = Array.isArray(user.roles) 
  //     ? user.roles.map((r: any) => typeof r === 'object' ? r.name : r)
  //     : [];

  //   this.form.patchValue({
  //     firstName: user.firstName,
  //     lastName: user.lastName,
  //     phone: user.phone,
  //     username: user.username,
  //     email: user.email,
  //     activo: user.activo,
  //     roles: rolesParaFormulario
  //   });

  //   const passwordControl = this.form.get('password');
  //   passwordControl?.clearValidators();
  //   passwordControl?.setValidators([PasswordComplexity.validator]); // Solo validación de fuerza si escribe algo
  //   passwordControl?.setValue(''); 
  //   passwordControl?.updateValueAndValidity();

  //   this.showModal = true;
  // }

  editUser(user: UserDTO) {
    console.log('Datos recibidos para editar:', user); // 👈 Añade esto para depurar
    
    this.currentUser = user;

    // Asegurémonos de que el formulario esté limpio y listo
    if (!this.form) {
      this.initForm();
    }

    const rolesParaFormulario = Array.isArray(user.roles) 
      ? user.roles.map((r: any) => typeof r === 'object' ? r.name : r)
      : [];

    // Usamos un pequeño delay o simplemente nos aseguramos de asignar campo por campo
    this.form.patchValue({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      username: user.username,
      email: user.email,
      activo: user.activo,
      roles: rolesParaFormulario
    });

    // GESTIÓN DE CONTRASEÑA
    const passwordControl = this.form.get('password');
    passwordControl?.clearValidators();
    passwordControl?.setValidators([PasswordComplexity.validator]);
    passwordControl?.setValue('');
    passwordControl?.updateValueAndValidity();

    this.showModal = true;
    this.cd.detectChanges(); // 👈 Forzamos a Angular a pintar los cambios en el HTML
  }

  
  saveUser(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    const isEditing = !!(this.currentUser && this.currentUser.id);

    const selectedRoles: string[] = Array.isArray(formValue.roles) 
      ? formValue.roles
          .filter((r: any) => !!r) 
          .map((r: any) => String(r).toUpperCase().trim()) 
      : [];

    // Payload completo incluyendo perfil
    const userData: any = {
      firstName: formValue.firstName,
      lastName: formValue.lastName,
      phone: formValue.phone,
      username: formValue.username,
      email: formValue.email,
      activo: formValue.activo,
      roles: selectedRoles 
    };

    if (formValue.password && formValue.password.trim().length > 0) {
      userData.password = formValue.password;
    }

    const request$ = isEditing
      ? this.userService.update(Number(this.currentUser!.id), userData)
      : this.userService.create(userData);

    request$.subscribe({
      next: () => {
        setTimeout(() => {
          this.closeModal();
          this.snack.open('¡Usuario guardado correctamente!', 'Cerrar', { 
            duration: 3000,
            panelClass: ['success-snackbar'] 
          });
          if (this.layout) this.layout.load();
          this.cd.detectChanges();
        });
      },
      error: (err) => {
        const errorMessage = err.error?.message || 'Error interno del servidor';
        this.snack.open(`Error: ${errorMessage}`, 'Entendido', { duration: 5000 });
        this.cd.detectChanges();
      }
    });
  }

  deleteUser(user: UserDTO) {
    if (!confirm(`¿Estás seguro de que deseas eliminar al usuario "${user.username}"?`)) return;

    this.userService.delete(user.id!).subscribe({
      next: () => {
        this.snack.open('¡Usuario eliminado!', 'Entendido', { 
          duration: 3000,
          panelClass: ['success-snackbar'],
          horizontalPosition: 'right',
          verticalPosition: 'bottom'
        });
        this.layout.load();
      },
      error: err => {
        this.snack.open(`Error: ${err.error?.message || err.message}`, 'Cerrar', { duration: 5000 });
      }
    });
  }

  usernameExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value === this.currentUser?.username) return of(null);
      
      return timer(500).pipe(
        switchMap(() => this.userService.checkUsernameExists(control.value)),
        map(exists => (exists ? { usernameTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value === this.currentUser?.email) return of(null);

      return timer(500).pipe(
        switchMap(() => this.userService.checkEmailExists(control.value)),
        map(exists => (exists ? { emailTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  togglePasswordVisibility() { this.showPassword = !this.showPassword; }

  closeModal() {
    this.showModal = false;
    this.currentUser = null;
  }

  toggleActivo(user: UserDTO) {
    this.userService.toggleActivo(user.id!).subscribe(() => this.layout.load());
  }

  addRole(user: UserDTO, role: string) {
    this.userService.addRole(user.id!, role).subscribe(() => this.layout.load());
  }

  removeRole(user: UserDTO, role: string) {
    this.userService.removeRole(user.id!, role).subscribe(() => this.layout.load());
  }
}