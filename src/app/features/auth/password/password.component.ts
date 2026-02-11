// import {
//   Component,
//   signal,
//   computed,
//   inject,
//   ElementRef,
//   ViewChild,
//   AfterViewInit,
// } from '@angular/core';
// import {
//   ReactiveFormsModule,
//   FormControl,
//   Validators,
//   FormGroup,
// } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { AuthService } from '../../../core/services/auth/auth.service';


// @Component({
//   selector: 'app-password',
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     RouterModule,
//   ],
//   templateUrl: './password.component.html',
//   styleUrl: './password.component.scss',
// })
// export class ForgotPasswordFormComponent implements AfterViewInit {
// //
//   private authService = inject(AuthService);
//   private router = inject(Router);

//   @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
//   @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
//   @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef<HTMLInputElement>;

//   showPassword = false;
//   showConfirmPassword = false;

//   loading = signal(false);
//   errorMessage = signal('');
//   successMessage = signal('');
//   step = signal<1 | 2>(1);

//   private focusedStep: 1 | 2 | null = null; // 🧠 evita reenfocar continuamente

//   form = new FormGroup<any>({
//     email: new FormControl('', {
//       nonNullable: true,
//       validators: [Validators.required, Validators.email],
//     }),
//   });

//   ngAfterViewInit() {
//     // 🟢 Foco inicial al cargar
//     this.focusEmail();
//   }

//   ngAfterViewChecked() {
//     // 🟢 Foco dinámico al cambiar paso
//     if (this.step() === 1 && this.focusedStep !== 1) {
//       this.focusEmail();
//       this.focusedStep = 1;
//     }
//     if (this.step() === 2 && this.focusedStep !== 2) {
//       this.focusPassword();
//       this.focusedStep = 2;
//     }
//   }

//   private focusEmail() {
//     setTimeout(() => this.emailInput?.nativeElement.focus(), 150);
//   }

//   private focusPassword() {
//     setTimeout(() => this.passwordInput?.nativeElement.focus(), 150);
//   }

//   // ---------------- Validaciones ----------------
//   private getControlErrors(name: string): string[] {
//     const control = this.form.get(name);
//     const e = control?.errors;
//     const msgs: string[] = [];
//     if (!e || control.valid) return msgs;

//     if (e['required']) msgs.push('Campo obligatorio');
//     if (e['email']) msgs.push('Formato de email inválido');
//     if (e['minlength']) msgs.push('La contraseña debe tener al menos 6 caracteres');
//     if (e['mismatch']) msgs.push('Las contraseñas no coinciden');
//     return msgs;
//   }

//   emailErrors = computed(() => this.getControlErrors('email'));
//   passwordErrors = computed(() => this.getControlErrors('password'));
//   confirmPasswordErrors = computed(() => this.getControlErrors('confirmPassword'));

//   // ---------------- Envío ----------------
//   submit() {
//     this.errorMessage.set('');
//     this.successMessage.set('');
//     this.form.markAllAsTouched();

//     if (this.form.invalid) return;

//     this.loading.set(true);

//     if (this.step() === 1) {
//       const { email } = this.form.getRawValue();

//       this.authService.checkUserExists(email).subscribe({
//         next: (exists) => {
//           this.loading.set(false);

//           if (exists) {
//             this.form.addControl(
//               'password',
//               new FormControl('', {
//                 nonNullable: true,
//                 validators: [Validators.required, Validators.minLength(6)],
//               })
//             );

//             this.form.addControl(
//               'confirmPassword',
//               new FormControl('', {
//                 nonNullable: true,
//                 validators: [Validators.required],
//               })
//             );

//             this.form.get('confirmPassword')?.valueChanges.subscribe(() => {
//               const pass = this.form.get('password')?.value;
//               const confirm = this.form.get('confirmPassword')?.value;
//               if (pass !== confirm) {
//                 this.form.get('confirmPassword')?.setErrors({ mismatch: true });
//               } else {
//                 this.form.get('confirmPassword')?.setErrors(null);
//               }
//             });

//             this.successMessage.set('Usuario encontrado. Ingresa tu nueva contraseña.');
//             this.step.set(2);
//             this.focusedStep = null; // 🔄 permite reenfocar el siguiente paso
//           } else {
//             this.errorMessage.set('El correo no está registrado.');
//           }
//         },
//         error: () => {
//           this.loading.set(false);
//           this.errorMessage.set('Error al verificar el usuario.');
//         },
//       });
//     } else {
//       const { email, password } = this.form.getRawValue();

//       this.authService.resetPassword(email, password).subscribe({
//         next: (res) => {
//           this.loading.set(false);
//           this.successMessage.set(res.message || 'Tu contraseña ha sido restablecida correctamente ✅');
//           setTimeout(() => this.router.navigate(['/auth/login']), 2500);
//         },
//         error: (err) => {
//           this.loading.set(false);
//           this.errorMessage.set(err?.error?.message || 'Error al restablecer la contraseña.');
//         },
//       });
//     }
//   }

//   togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;
//   }

//   toggleConfirmPasswordVisibility() {
//     this.showConfirmPassword = !this.showConfirmPassword;
//   }

//   cancel() {
//     this.router.navigate(['/auth/login']);
//   }
// }


// import {
//   Component,
//   signal,
//   computed,
//   inject,
//   ElementRef,
//   ViewChild,
//   AfterViewInit,
//   OnInit,
//   AfterViewChecked,
// } from '@angular/core';
// import {
//   ReactiveFormsModule,
//   FormControl,
//   Validators,
//   FormGroup,
//   AbstractControl,
//   ValidationErrors,
//   ValidatorFn,
// } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router, RouterModule } from '@angular/router';

// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { AuthService } from '../../../core/services/auth/auth.service';
// import { switchMap, of, timer } from 'rxjs';

// @Component({
//   selector: 'app-password',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     RouterModule,
//   ],
//   templateUrl: './password.component.html',
//   styleUrls: ['./password.component.scss'],
// })
// export class ForgotPasswordFormComponent implements AfterViewInit, OnInit, AfterViewChecked {
//   private authService = inject(AuthService);
//   private router = inject(Router);

//   @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
//   @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
//   @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef<HTMLInputElement>;

//   showPassword = false;
//   showConfirmPassword = false;

//   loading = signal(false);
//   errorMessage = signal('');
//   successMessage = signal('');
//   step = signal<1 | 2>(1);

//   private focusedStep: 1 | 2 | null = null;

//   private static readonly PASSWORD_REGEX =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]).{9,}$/;

//   form = new FormGroup<any>({
//     email: new FormControl('', {
//       nonNullable: true,
//       validators: [Validators.required, Validators.email],
//     }),
//   });

//   private emailToReset: string | null = null;
//   private checkConfirmationTimer: any;

//   ngOnInit() {}

//   ngAfterViewInit() {
//     this.focusEmail();
//   }

//   ngAfterViewChecked() {
//     if (this.step() === 1 && this.focusedStep !== 1) {
//       this.focusEmail();
//       this.focusedStep = 1;
//     }
//     if (this.step() === 2 && this.focusedStep !== 2) {
//       this.focusPassword();
//       this.focusedStep = 2;
//     }
//   }

//   private focusEmail() {
//     setTimeout(() => this.emailInput?.nativeElement.focus(), 150);
//   }

//   private focusPassword() {
//     setTimeout(() => this.passwordInput?.nativeElement.focus(), 150);
//   }

//   private focusConfirmPassword() {
//     setTimeout(() => this.confirmPasswordInput?.nativeElement.focus(), 150);
//   }

//   // ---------------- Validaciones ----------------
//   private getControlErrors(name: string): string[] {
//     const control = this.form.get(name);
//     const e = control?.errors;
//     const msgs: string[] = [];
//     if (!e || control.valid) return msgs;

//     if (e['required']) msgs.push('Campo obligatorio');
//     if (e['email']) msgs.push('Formato de email inválido');
//     if (e['minlength']) msgs.push('La contraseña debe tener al menos 9 caracteres');
//     if (e['pattern']) msgs.push('La contraseña debe incluir mayúscula, minúscula, número y carácter especial');
//     if (e['mismatch']) msgs.push('Las contraseñas no coinciden');
//     return msgs;
//   }

//   emailErrors = computed(() => this.getControlErrors('email'));
//   passwordErrors = computed(() => this.getControlErrors('password'));
//   confirmPasswordErrors = computed(() => this.getControlErrors('confirmPassword'));

//   // ---------------- Validador custom a nivel de grupo ----------------
//   private passwordMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
//     const password = group.get('password')?.value;
//     const confirm = group.get('confirmPassword')?.value;
//     return password && confirm && password !== confirm ? { mismatch: true } : null;
//   };

//   // ---------------- Envío ----------------
//   submit() {
//     this.errorMessage.set('');
//     this.successMessage.set('');
//     this.form.markAllAsTouched();

//     if (this.form.invalid) return;

//     this.loading.set(true);

//     if (this.step() === 1) {
//       const email = this.form.get('email')!.value;
//       this.emailToReset = email;

//       this.authService.checkUserExists(email).pipe(
//         switchMap(exists => {
//           if (!exists) {
//             this.loading.set(false);
//             this.errorMessage.set('El correo no está registrado.');
//             return of(null);
//           }
//           return this.authService.forgotPassword(email);
//         })
//       ).subscribe({
//         next: res => {
//           if (!res) return;
//           this.loading.set(false);
//           this.successMessage.set('Correo enviado ✅. Confirma el email para continuar.');

//           // Empieza a revisar cada 2s si el usuario confirmó el email
//           this.checkConfirmationTimer = timer(0, 2000).subscribe(() => {
//             this.authService.isPasswordResetConfirmed(email).subscribe(confirmed => {
//               if (confirmed) {
//                 this.checkConfirmationTimer.unsubscribe();
//                 this.addPasswordControls();
//                 this.step.set(2);
//                 this.successMessage.set('Email confirmado ✅. Ingresa tu nueva contraseña.');
//                 this.focusPassword();
//               }
//             });
//           });
//         },
//         error: err => {
//           this.loading.set(false);
//           this.errorMessage.set(err.message || 'Error verificando el usuario.');
//         }
//       });

//     } else {
//       // Paso 2: reset de contraseña usando token
//       const { password, confirmPassword } = this.form.getRawValue();
//       if (password !== confirmPassword) {
//         this.form.get('confirmPassword')?.setErrors({ mismatch: true });
//         this.loading.set(false);
//         return;
//       }

//       if (!this.emailToReset) {
//         this.loading.set(false);
//         this.errorMessage.set('Error interno: correo no definido.');
//         return;
//       }

//       this.authService.resetPasswordByEmail(this.emailToReset, password).subscribe({
//         next: res => {
//           this.loading.set(false);
//           this.successMessage.set(res.message || 'Tu contraseña ha sido restablecida ✅');
//           setTimeout(() => this.router.navigate(['/auth/login']), 2500);
//         },
//         error: err => {
//           this.loading.set(false);
//           this.errorMessage.set(err.message || 'Error desconocido al restablecer la contraseña.');
//         }
//       });
//     }
//   }

//   private addPasswordControls() {
//     if (!this.form.get('password')) {
//       this.form.addControl(
//         'password',
//         new FormControl('', {
//           nonNullable: true,
//           validators: [Validators.required, Validators.pattern(ForgotPasswordFormComponent.PASSWORD_REGEX)],
//         })
//       );

//       this.form.addControl(
//         'confirmPassword',
//         new FormControl('', {
//           nonNullable: true,
//           validators: [Validators.required],
//         })
//       );

//       this.form.setValidators(this.passwordMatchValidator);
//       this.form.updateValueAndValidity();
//     }
//   }

//   togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;
//   }

//   toggleConfirmPasswordVisibility() {
//     this.showConfirmPassword = !this.showConfirmPassword;
//   }

//   cancel() {
//     this.router.navigate(['/auth/login']);
//   }
// }





import {
  Component,
  signal,
  computed,
  inject,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  AfterViewChecked,
  OnDestroy,
} from '@angular/core';
import {
  ReactiveFormsModule,
  FormControl,
  Validators,
  FormGroup,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth/auth.service';
import { of, throwError } from 'rxjs';
import { switchMap, catchError, tap } from 'rxjs/operators';

@Component({
  selector: 'app-password',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule,
  ],
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.scss'],
})
export class ForgotPasswordFormComponent
  implements AfterViewInit, OnInit, AfterViewChecked, OnDestroy
{
  private authService = inject(AuthService);
  private router = inject(Router);

  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
  @ViewChild('passwordInput') passwordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('confirmPasswordInput') confirmPasswordInput!: ElementRef<HTMLInputElement>;
  @ViewChild('codeInput') codeInput!: ElementRef<HTMLInputElement>;

  showPassword = false;
  showConfirmPassword = false;

  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  step = signal<1 | 2>(1);

  private focusedStep: 1 | 2 | null = null;
  private emailToReset: string | null = null;

  // ======================
  // FORMULARIO
  // ======================
  form = new FormGroup<any>({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
  });

  emailValid = signal(false);

  submitEnabled = computed(() => {
    if (this.step() === 1) return this.emailValid();
    return this.form.valid;
  });

  ngOnInit() {
    this.listenEmailValidation();
  }

  ngOnDestroy() {
    this.removePasswordControls();
  }

  ngAfterViewInit() {
    this.focusEmail();
  }

  ngAfterViewChecked() {
    if (this.step() === 1 && this.focusedStep !== 1) {
      this.focusEmail();
      this.focusedStep = 1;
    } else if (this.step() === 2 && this.focusedStep !== 2) {
      this.focusCode();
      this.focusedStep = 2;
    }
  }

  // ======================
  // Focus helpers
  // ======================
  private focusEmail() { setTimeout(() => this.emailInput?.nativeElement.focus(), 150); }
  private focusCode() { setTimeout(() => this.codeInput?.nativeElement.focus(), 150); }
  private focusPassword() { setTimeout(() => this.passwordInput?.nativeElement.focus(), 150); }

  // ======================
  // Email Validation
  // ======================
  private listenEmailValidation() {
    this.form.get('email')?.valueChanges.subscribe((value: string) => {
      const trimmed = value.trim();
      const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      this.emailValid.set(regex.test(trimmed));
      this.errorMessage.set('');
    });
  }

  // ======================
  // Password + confirm password validators
  // ======================
  private passwordMatchValidator: ValidatorFn = (group: AbstractControl) => {
    const password = group.get('password')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password && confirm && password !== confirm ? { mismatch: true } : null;
  };

  private getControlErrors(name: string): string[] {
    const control = this.form.get(name);
    if (!control) return [];
    const msgs: string[] = [];

    if (!control.touched && !control.dirty) return msgs;

    const errors = control.errors;

    if (errors) {
      if (errors['required']) msgs.push('Campo obligatorio');
      if (errors['pattern']) {
        if (name === 'password')
          msgs.push('La contraseña debe tener al menos 9 caracteres, incluir mayúscula, minúscula, número y un carácter especial');
        if (name === 'code')
          msgs.push('El código debe tener 6 dígitos');
      }
      if (errors['email'] && name === 'email')
        msgs.push('Correo inválido');
    }

    if (name === 'confirmPassword' && this.form.errors?.['mismatch']) {
      msgs.push('Las contraseñas no coinciden');
    }

    return msgs;
  }

  emailErrors = computed(() => this.getControlErrors('email'));
  passwordErrors = computed(() => this.getControlErrors('password'));
  confirmPasswordErrors = computed(() => this.getControlErrors('confirmPassword'));
  codeErrors = computed(() => this.getControlErrors('code'));

  // ======================
  // Submit
  // ======================
  submit() {
    this.resetMessages();
    this.form.markAllAsTouched();

    const isStep1Valid = this.step() === 1 && this.emailValid();
    const isStep2Valid = this.step() === 2 && this.form.valid;

    if (!isStep1Valid && !isStep2Valid) {
      this.errorMessage.set('Por favor, corrige los errores del formulario.');
      return;
    }

    this.loading.set(true);
    this.step() === 1 ? this.handleStep1() : this.handleStep2();
  }

  private handleStep1() {
    const email = this.form.get('email')!.value;
    this.emailToReset = email;

    this.authService
      .checkUserExists(email)
      .pipe(
        switchMap((exists) =>
          exists
            ? this.authService.forgotPassword(email)
            : throwError(() => new Error('El correo no está registrado.'))
        ),
        tap(() => {
          this.addPasswordControls();
          this.step.set(2);
          this.successMessage.set('Correo enviado. Ingresa el código OTP y tu nueva contraseña.');
          this.loading.set(false);
        }),
        catchError((err) => {
          this.loading.set(false);
          this.errorMessage.set(err.message || 'Error desconocido al solicitar el restablecimiento.');
          return of(null);
        })
      )
      .subscribe();
  }

  private handleStep2() {
    const { password, code } = this.form.getRawValue();

    if (!this.emailToReset) {
      this.loading.set(false);
      this.errorMessage.set('Error interno: El email no se ha confirmado.');
      return;
    }

    this.authService
      .resetPasswordWithCode(this.emailToReset, code, password)
      .pipe(
        tap((res) => {
          this.loading.set(false);
          this.successMessage.set(res.message || 'Tu contraseña ha sido restablecida');
          setTimeout(() => this.router.navigate(['/auth/login']), 2500);
        }),
        catchError((err) => {
          this.loading.set(false);
          this.errorMessage.set(err.message || 'Error desconocido al restablecer la contraseña.');
          return of(null);
        })
      )
      .subscribe();
  }

  // ======================
  // Password + OTP dynamic validation
  // ======================
  private listenPasswordValidation() {
    const p = this.form.get('password');
    const c = this.form.get('confirmPassword');
    if (!p || !c) return;

    p.valueChanges.subscribe(() => this.form.updateValueAndValidity());
    c.valueChanges.subscribe(() => this.form.updateValueAndValidity());
  }

  private listenOtpChanges() {
    const p = this.form.get('password');
    const c = this.form.get('confirmPassword');
    const otp = this.form.get('code');
    if (!p || !c || !otp) return;

    otp.valueChanges.subscribe((value: string) => {
      const valid = /^\d{6}$/.test(value);
      if (!valid) {
        p.disable({ emitEvent: false });
        c.disable({ emitEvent: false });
        p.reset('', { emitEvent: false });
        c.reset('', { emitEvent: false });
        this.form.updateValueAndValidity();
      } else {
        p.enable({ emitEvent: false });
        c.enable({ emitEvent: false });
        p.markAsTouched();
        c.markAsTouched();
        this.form.updateValueAndValidity();
        this.focusPassword();
      }
    });
  }

  // ======================
  // Dynamic form controls
  // ======================
  private addPasswordControls() {
    if (!this.form.get('password')) {
      this.form.addControl(
        'password',
        new FormControl('', {
          nonNullable: true,
          validators: [
            Validators.required,
            Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};:'",.<>/?\\|`~]).{9,}$/)
          ],
        })
      );

      this.form.addControl(
        'confirmPassword',
        new FormControl('', { nonNullable: true, validators: [Validators.required] })
      );

      this.form.addControl(
        'code',
        new FormControl('', {
          nonNullable: true,
          validators: [Validators.required, Validators.pattern(/^\d{6}$/)],
        })
      );

      this.form.setValidators(this.passwordMatchValidator);
      this.form.updateValueAndValidity();

      this.listenOtpChanges();
      this.listenPasswordValidation();
      setTimeout(() => this.focusCode(), 100);
    }
  }

  private removePasswordControls() {
    this.form.removeControl('password');
    this.form.removeControl('confirmPassword');
    this.form.removeControl('code');
    this.form.setValidators(null);
    this.form.updateValueAndValidity();
  }

  // ======================
  // Helpers
  // ======================
  private resetMessages() {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  cancel() {
    this.router.navigate(['/auth/login']);
  }
}
