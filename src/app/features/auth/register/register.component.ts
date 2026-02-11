// import { Component, signal, computed, inject, ElementRef, ViewChild, effect, AfterViewInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
// import { Router, RouterModule } from '@angular/router';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { AuthService } from '../../../core/services/auth/auth.service';
// import { PasswordComplexity } from '../../../core/validators/password-complexity';


// @Component({
//   selector: 'app-register',
//   imports: [CommonModule,
//               ReactiveFormsModule,
//               MatFormFieldModule,
//               MatInputModule,
//               MatButtonModule,
//               RouterModule
//             ],
//   templateUrl: './register.component.html',
//   styleUrl: './register.component.scss',
// })
// export class RegisterFormComponent implements AfterViewInit {
// //
//   private authService = inject(AuthService);
//   private router = inject(Router);

//   @ViewChild('nameInput') nameInput!: ElementRef<HTMLInputElement>;
//   @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

//   showPassword = false;

//   loading = signal(false);
//   errorMessage = signal('');
//   successMessage = signal('');

//   //
//   form = new FormGroup({
//     name: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3)] }),
//     email: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email] }),
//     password: new FormControl('', { nonNullable: true, validators: [Validators.required, PasswordComplexity.validator] })
//   });

//   nameErrors = computed(() => this.getControlErrors('name'));
//   emailErrors = computed(() => this.getControlErrors('email'));
//   passwordErrors = computed(() => this.getControlErrors('password'));

//   //
//   public getControlErrors(controlName: 'name' | 'email' | 'password'): string[] {
//     const control = this.form.get(controlName);
//     const e = control?.errors;
//     const msgs: string[] = [];
//     if (!e || control?.valid) return [];

//     if (e['required']) msgs.push('Campo obligatorio');
//     if (e['minlength']) msgs.push(`Mínimo ${e['minlength'].requiredLength} caracteres`);
//     if (e['email']) msgs.push('Formato de email inválido');
//     if (controlName === 'password' && e['passwordComplexity'])
//       msgs.push('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial');

//     return msgs;
//   }

//   //
//   showError(controlName: 'name' | 'email' | 'password') {
//     const control = this.form.get(controlName);
//     return control && control.invalid && control.touched;
//   }

//   //
//   onFocus(controlName: 'name' | 'email' | 'password') {
//     const control = this.form.get(controlName);
//     if (control) control.markAsUntouched();
//   }

//   //
//   ngAfterViewInit() {
//     // Foco inicial en el input de nombre
//     setTimeout(() => this.nameInput?.nativeElement.focus(), 100);

//     // Efecto: cuando password tenga error, volvemos el foco
//     effect(() => {
//       if (this.showError('password') && this.passwordInput) {
//         this.passwordInput.nativeElement.focus();
//       }
//     });
//   }

//   //
//   submit() {
//     this.errorMessage.set('');
//     this.successMessage.set('');
//     this.form.markAllAsTouched();

//     if (this.form.invalid) return;

//     this.loading.set(true);

//     const { name: username, email, password } = this.form.getRawValue();

//     this.authService.register(username, email, password).subscribe({
//       next: () => {
//         this.loading.set(false);
//         this.successMessage.set('Registro exitoso 🎉');
//         setTimeout(() => {
//           this.router.navigate(['/auth/check-code'], { queryParams: { email } });
//         }, 1500);
//       },
//       error: (err) => {
//         this.loading.set(false);
//         this.errorMessage.set(err?.error?.message || 'Error en el registro');
//       }
//     });
//   }

//   //
//   togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;
//   }

//   //
//   cancel() {
//     this.router.navigate(['/auth/login']);
//   }
// }


import { Component, signal, computed, inject, ElementRef, ViewChild, effect, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth/auth.service';
import { PasswordComplexity } from '../../../core/validators/password-complexity';
import { RegisterRequestDTO } from '../dtos/RegisterRequestDTO';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterFormComponent implements AfterViewInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  // ViewChilds para manejo de foco (Asegúrate de que existan en el HTML con #)
  @ViewChild('firstNameInput') firstNameInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;

  showPassword = false;
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  form = new FormGroup({
    firstName: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    lastName:  new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    username:  new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(3), Validators.maxLength(40)] }),
    email:     new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.email, Validators.maxLength(150)] }),
    password:  new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.minLength(9), PasswordComplexity.validator] 
    }),
    phone:     new FormControl('', { nonNullable: true }) 
  });

  constructor() {
    // Efecto reactivo para el foco de la contraseña cuando hay error
    effect(() => {
      if (this.showError('password') && this.passwordInput) {
        this.passwordInput.nativeElement.focus();
      }
    });
  }

  // --- ESTE MÉTODO ES EL QUE CORRIGE TU ERROR ts(2420) ---
  ngAfterViewInit(): void {
    // Foco inicial en el primer campo de texto después de que la vista cargue
    if (this.firstNameInput) {
      setTimeout(() => this.firstNameInput.nativeElement.focus(), 100);
    }
  }

  public getControlErrors(controlName: string): string[] {
    const control = this.form.get(controlName);
    const e = control?.errors;
    const msgs: string[] = [];
    if (!e || control?.valid) return [];

    if (e['required']) msgs.push('Campo obligatorio');
    if (e['minlength']) msgs.push(`Mínimo ${e['minlength'].requiredLength} caracteres`);
    if (e['maxlength']) msgs.push(`Máximo ${e['maxlength'].requiredLength} caracteres`);
    if (e['email']) msgs.push('Formato de email inválido');
    
    if (controlName === 'password' && (e['passwordComplexity'] || e['minlength'])) {
      msgs.push('La contraseña debe tener al menos 9 caracteres, una mayúscula, una minúscula, un número y un carácter especial');
    }

    return msgs;
  }

  showError(controlName: string): boolean {
    const control = this.form.get(controlName);
    return !!(control && control.invalid && control.touched);
  }

  onFocus(controlName: string): void {
    const control = this.form.get(controlName);
    if (control) control.markAsUntouched();
  }

  submit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    this.loading.set(true);
    const registerData: RegisterRequestDTO = this.form.getRawValue();

    this.authService.register(registerData).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('¡Registro exitoso! Revisa tu email 📧');
        setTimeout(() => {
          this.router.navigate(['/auth/check-code'], { queryParams: { email: registerData.email } });
        }, 1500);
      },
      error: (err) => {
        this.loading.set(false);
        this.errorMessage.set(err?.error?.message || 'Error en el servidor');
      }
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  cancel(): void {
    this.router.navigate(['/auth/login']);
  }
}