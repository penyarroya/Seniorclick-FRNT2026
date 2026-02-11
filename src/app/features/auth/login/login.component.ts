// import { Component, signal, computed, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';

// // Angular Material
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { AuthService } from '../../../core/services/auth/auth.service';

// @Component({
//   selector: 'app-login',
//   imports: [CommonModule,
//             ReactiveFormsModule,
//             MatFormFieldModule,
//             MatInputModule,
//             MatButtonModule
//           ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss',
// })
// export class LoginFormComponent implements AfterViewInit {
// //
//   //  
//   private authService = inject(AuthService);
//   private router = inject(Router);

//   showPassword = false;
//   loading = signal(false);
//   errorMessage = signal('');

//   // ---------------- Formulario reactivo ----------------
//   form = new FormGroup({
//     identifier: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
//     password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
//   });

//   // ---------------- Validaciones ----------------
//   private getControlErrors(controlName: 'identifier' | 'password') {
//     const control = this.form.get(controlName);
//     const e = control?.errors;
//     const msgs: string[] = [];
//     if (!e || control.valid) return [];
//     if (controlName === 'identifier' && e['required']) msgs.push('El correo o usuario es obligatorio');
//     if (controlName === 'password') {
//       if (e['required']) msgs.push('La contraseña es obligatoria');
//       if (e['minlength']) msgs.push(`Debe tener al menos ${e['minlength'].requiredLength} caracteres`);
//     }
//     return msgs;
//   }

//   identifierErrors = computed(() => this.getControlErrors('identifier'));
//   passwordErrors = computed(() => this.getControlErrors('password'));

//   // ---------------- Mostrar/Ocultar errores ----------------
//   showError(controlName: 'identifier' | 'password') {
//     const control = this.form.get(controlName);
//     return control && control.invalid && control.touched;
//   }

//   onFocus(controlName: 'identifier' | 'password') {
//     const control = this.form.get(controlName);
//     if (control) control.markAsUntouched();
//   }

//   // ---------------- Submit ----------------
//   submit(): void {
//     this.errorMessage.set('');
//     this.form.markAllAsTouched();
//     if (this.form.invalid) return;

//     this.loading.set(true);
//     const { identifier, password } = this.form.getRawValue();
//     const isEmail = identifier.includes('@');

//     const login$ = isEmail
//       ? this.authService.loginWithEmail(identifier, password)
//       : this.authService.loginWithUsername(identifier, password);

//     // login$.subscribe({
//     //   next: () => {
//     //     this.loading.set(false);
//     //     this.router.navigate(['/page']);
//     //   },
//     //   error: (err) => {
//     //     this.loading.set(false);
//     //     this.errorMessage.set(
//     //       err?.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
//     //     );
//     //   }
//     // });

//     login$.subscribe({
//       next: () => {
//         this.authService.checkSession().subscribe({
//           next: () => {
//             this.loading.set(false);
//             this.router.navigate(['/page']);
//           }
//         });
//       },
//       error: (err) => {
//         this.loading.set(false);
//         this.errorMessage.set(
//           err?.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
//         );
//       }
//     });
//   }

//   // ---------------- Toggle de contraseña ----------------
//   togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;
//   }

//   // ---------------- Navegación ----------------
//   goToRegister() { this.router.navigate(['/auth/register']); }
//   goToForgotPassword() { this.router.navigate(['/auth/forgot-password']); }
//   goToHome() { this.router.navigate(['/']); }

//   get passwordIcon() {
//     return this.showPassword ? 'visibility_off' : 'visibility';
//   }

//   // ---------------- Foco automático ----------------
//   @ViewChild('identifierInput') identifierInput!: ElementRef<HTMLInputElement>;

//   ngAfterViewInit(): void {
//     // Foco en primer input al iniciar o refrescar
//     setTimeout(() => {
//       this.identifierInput.nativeElement.focus();
//     });
//   }
// }



// import { Component, signal, computed, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
// import { Router } from '@angular/router';

// // Angular Material
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { AuthService } from '../../../core/services/auth/auth.service';

// import { switchMap } from 'rxjs/operators';

// @Component({
//   selector: 'app-login',
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule
//   ],
//   templateUrl: './login.component.html',
//   styleUrl: './login.component.scss',
// })
// export class LoginFormComponent implements AfterViewInit {

//   private authService = inject(AuthService);
//   private router = inject(Router);

//   showPassword = false;
//   loading = signal(false);
//   errorMessage = signal('');

//   // ---------------- Formulario reactivo ----------------
//   form = new FormGroup({
//     identifier: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
//     password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
//   });

//   // ---------------- Validaciones ----------------
//   private getControlErrors(controlName: 'identifier' | 'password') {
//     const control = this.form.get(controlName);
//     const e = control?.errors;
//     const msgs: string[] = [];
//     if (!e || control.valid) return [];
//     if (controlName === 'identifier' && e['required']) msgs.push('El correo o usuario es obligatorio');
//     if (controlName === 'password') {
//       if (e['required']) msgs.push('La contraseña es obligatoria');
//       if (e['minlength']) msgs.push(`Debe tener al menos ${e['minlength'].requiredLength} caracteres`);
//     }
//     return msgs;
//   }

//   identifierErrors = computed(() => this.getControlErrors('identifier'));
//   passwordErrors = computed(() => this.getControlErrors('password'));

//   // ---------------- Mostrar/Ocultar errores ----------------
//   showError(controlName: 'identifier' | 'password') {
//     const control = this.form.get(controlName);
//     return control && control.invalid && control.touched;
//   }

//   onFocus(controlName: 'identifier' | 'password') {
//     const control = this.form.get(controlName);
//     if (control) control.markAsUntouched();
//   }

//   // ---------------- Submit ----------------
//   submit(): void {
//     this.errorMessage.set('');
//     this.form.markAllAsTouched();
//     if (this.form.invalid) return;

//     this.loading.set(true);
//     const { identifier, password } = this.form.getRawValue();
//     const isEmail = identifier.includes('@');

//     const login$ = isEmail
//       ? this.authService.loginWithEmail(identifier, password)
//       : this.authService.loginWithUsername(identifier, password);

//     login$.pipe(
//       switchMap(() => this.authService.checkSession())
//     ).subscribe({
//       next: () => {
//         this.loading.set(false);
//         this.router.navigate(['/page']);
//       },
//       error: (err) => {
//         this.loading.set(false);
//         this.errorMessage.set(
//           err?.error?.message || 'Error al iniciar sesión. Verifica tus credenciales.'
//         );
//       }
//     });
//   }
  
//   // ---------------- Toggle de contraseña ----------------
//   togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;
//   }

//   // ---------------- Navegación ----------------
//   goToRegister() { this.router.navigate(['/auth/register']); }
//   goToForgotPassword() { this.router.navigate(['/auth/forgot-password']); }
//   goToHome() { this.router.navigate(['/']); }

//   get passwordIcon() {
//     return this.showPassword ? 'visibility_off' : 'visibility';
//   }

//   // ---------------- Foco automático ----------------
//   @ViewChild('identifierInput') identifierInput!: ElementRef<HTMLInputElement>;

//   ngAfterViewInit(): void {
//     // Foco en primer input al iniciar o refrescar
//     setTimeout(() => {
//       this.identifierInput.nativeElement.focus();
//     });
//   }
// }


import { Component, signal, computed, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth/auth.service';

import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginFormComponent implements AfterViewInit {

  private authService = inject(AuthService);
  private router = inject(Router);

  showPassword = false;
  loading = signal(false);
  errorMessage = signal('');

  form = new FormGroup({
    identifier: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl<string>('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] })
  });

  private getControlErrors(controlName: 'identifier' | 'password') {
    const control = this.form.get(controlName);
    const e = control?.errors;
    const msgs: string[] = [];
    if (!e || control.valid) return [];
    if (controlName === 'identifier' && e['required']) msgs.push('El correo o usuario es obligatorio');
    if (controlName === 'password') {
      if (e['required']) msgs.push('La contraseña es obligatoria');
      if (e['minlength']) msgs.push(`Debe tener al menos ${e['minlength'].requiredLength} caracteres`);
    }
    return msgs;
  }

  identifierErrors = computed(() => this.getControlErrors('identifier'));
  passwordErrors = computed(() => this.getControlErrors('password'));

  showError(controlName: 'identifier' | 'password') {
    const control = this.form.get(controlName);
    return control && control.invalid && control.touched;
  }

  onFocus(controlName: 'identifier' | 'password') {
    const control = this.form.get(controlName);
    if (control) control.markAsUntouched();
  }

  //
  submit(): void {
    this.errorMessage.set('');
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.loading.set(true);
    const { identifier, password } = this.form.getRawValue();
    const isEmail = identifier.includes('@');

    const login$ = isEmail
      ? this.authService.loginWithEmail(identifier, password)
      : this.authService.loginWithUsername(identifier, password);

    login$.subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/inicio']); // Redirección exitosa
      },
      error: (err: any) => { // Usamos 'any' para manejar tanto Error como HttpErrorResponse
        this.loading.set(false);
        
        // 1. Manejo del error de Credenciales Inválidas (el 401 que el AuthService relanza como 'Error')
        if (err instanceof Error && (err.message.includes('Credenciales inválidas') || err.message.includes('Credenciales incorrectas'))) {
            this.errorMessage.set(err.message);
        } 
        // 2. Manejo de errores de red o servidor no controlados
        else {
            // Si el error viene directamente del backend y no es un 401 de credenciales
            const msg = err?.error?.message 
                ? err.error.message 
                : 'Error al iniciar sesión. Verifica la conexión o inténtalo más tarde.';
            
            this.errorMessage.set(msg);
        }
        
        // Opcional: Limpiar la contraseña después del intento fallido por seguridad/UX
        this.form.controls.password.reset(); 
        this.form.controls.password.markAsPristine();
      }
    });
  }


  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToRegister() { this.router.navigate(['/auth/register']); }
  goToForgotPassword() { this.router.navigate(['/auth/forgot-password']); }
  goToHome() { this.router.navigate(['/']); }

  get passwordIcon() { return this.showPassword ? 'visibility_off' : 'visibility'; }

  @ViewChild('identifierInput') identifierInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.identifierInput.nativeElement.focus();
    });
  }
}
