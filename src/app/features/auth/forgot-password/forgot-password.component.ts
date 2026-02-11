// import { Component, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule } from '@angular/forms';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';
// import { AuthService } from '../../../core/services/auth/auth.service';

// @Component({
//   selector: 'app-forgot-password',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule],
//   templateUrl: './forgot-password.component.html',
//   styleUrls: ['./forgot-password.component.scss']
// })
// export class ForgotPasswordComponent implements AfterViewInit {
//   form: FormGroup;
//   submitting = signal(false);
//   successEmail = signal(false);
//   successReset = signal(false);
//   error = signal<string | null>(null);
//   step = signal<'email' | 'reset'>('email');

//   // Contraseña visible
//   showPassword = false;
//   showConfirmPassword = false;
//   passwordIcon = 'visibility';
//   confirmPasswordIcon = 'visibility';

//   // ------------------ NUEVO: referencias de inputs ------------------
//   @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;
//   @ViewChild('codeInput') codeInput!: ElementRef<HTMLInputElement>;

//   constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
//     this.form = this.fb.group({
//       email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
//       code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
//       newPassword: ['', [
//         Validators.required,
//         Validators.minLength(9),
//         Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
//       ]],
//       confirmPassword: ['', Validators.required]
//     }, { validators: this.passwordMatchValidator });

//     // Limpiar mensaje de error cuando el email cambie
//     this.email.valueChanges.subscribe(() => {
//       this.error.set(null);
//     });
//   }

//   ngAfterViewInit(): void {
//     this.focusEmailInput(); // Foco inicial en email
//   }

//   private focusEmailInput() {
//     setTimeout(() => {
//       this.emailInput?.nativeElement.focus();
//     }, 0);
//   }

//   private focusCodeInput() {
//     setTimeout(() => {
//       this.codeInput?.nativeElement.focus();
//     }, 0);
//   }

//   // Getters
//   get email(): AbstractControl { return this.form.controls['email']; }
//   get code(): AbstractControl { return this.form.controls['code']; }
//   get newPassword(): AbstractControl { return this.form.controls['newPassword']; }
//   get confirmPassword(): AbstractControl { return this.form.controls['confirmPassword']; }

//   // Validator personalizado para coincidencia de contraseñas
//   passwordMatchValidator(group: FormGroup) {
//     const password = group.get('newPassword')?.value;
//     const confirm = group.get('confirmPassword')?.value;
//     return password === confirm ? null : { passwordsMismatch: true };
//   }

//   // Paso 1: enviar email
//   onSubmitEmail() {
//     if (this.email.invalid) {
//       this.email.markAsTouched();
//       this.focusEmailInput(); // Foco si hay error
//       return;
//     }
//     this.submitting.set(true);
//     this.error.set(null);

//     this.authService.forgotPassword(this.email.value).subscribe({
//       next: () => {
//         this.submitting.set(false);
//         this.successEmail.set(true);
//         this.successReset.set(false);
//         this.step.set('reset');
//         this.focusCodeInput(); // Foco en el input de código al avanzar
//       },
//       error: (err) => {
//         this.submitting.set(false);

//         if (err.message === 'Usuario no encontrado') {
//           this.error.set('El email ingresado no está registrado.');
//         } else {
//           this.error.set(err.message || 'Error al enviar el código');
//         }

//         this.focusEmailInput(); // Foco si hay error
//       }
//     });
//   }

//   // Paso 2: reset contraseña
//   onSubmitReset() {
//     if (this.code.invalid || this.newPassword.invalid || this.confirmPassword.invalid || this.form.errors?.['passwordsMismatch']) {
//       this.form.markAllAsTouched();
//       this.focusCodeInput(); // Foco si hay error en código
//       return;
//     }
//     this.submitting.set(true);
//     this.error.set(null);

//     this.authService.resetPasswordWithCode(this.email.value, this.code.value, this.newPassword.value).subscribe({
//       next: () => {
//         this.submitting.set(false);
//         this.successReset.set(true);
//         this.successEmail.set(false);
//         setTimeout(() => this.router.navigate(['/auth/login']), 2000);
//       },
//       error: (err) => {
//         this.submitting.set(false);
//         this.error.set(err.message || 'Error al restablecer la contraseña');
//         this.focusCodeInput(); // Foco si hay error en código
//       }
//     });
//   }

//   onCancel() {
//     this.form.reset();
//     this.successEmail.set(false);
//     this.successReset.set(false);
//     this.error.set(null);
//     this.step.set('email');
//     this.router.navigate(['/auth/login']);
//     this.focusEmailInput(); // Foco al cancelar
//   }

//   togglePasswordVisibility() {
//     this.showPassword = !this.showPassword;
//     this.passwordIcon = this.showPassword ? 'visibility_off' : 'visibility';
//   }

//   toggleConfirmPasswordVisibility() {
//     this.showConfirmPassword = !this.showConfirmPassword;
//     this.confirmPasswordIcon = this.showConfirmPassword ? 'visibility_off' : 'visibility';
//   }
// }


import { Component, signal, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements AfterViewInit {
  form: FormGroup;
  submitting = signal(false);
  successEmail = signal(false);
  successReset = signal(false);
  error = signal<string | null>(null);
  step = signal<'email' | 'reset'>('email');

  // Contraseña visible
  showPassword = false;
  showConfirmPassword = false;
  passwordIcon = 'visibility';
  confirmPasswordIcon = 'visibility';

  // ------------------ NUEVO: referencias de inputs ------------------
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

  // ------------------ NUEVO: OTP separado ------------------
  otpDigits: string[] = ['', '', '', '', '', ''];

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      code: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]],
      newPassword: ['', [
        Validators.required,
        Validators.minLength(9),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).+$/)
      ]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    // Limpiar mensaje de error cuando el email cambie
    this.email.valueChanges.subscribe(() => {
      this.error.set(null);
    });
  }

  ngAfterViewInit(): void {
    this.focusEmailInput(); // Foco inicial en email
  }

  private focusEmailInput() {
    setTimeout(() => {
      this.emailInput?.nativeElement.focus();
    }, 0);
  }

  private focusOtpInput(index: number) {
    setTimeout(() => {
      const input = document.getElementById('otp-' + index) as HTMLInputElement;
      input?.focus();
    }, 0);
  }

  // ------------------ NUEVO: actualización del OTP ------------------
  updateOtp(index: number, event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value;

    // Asegurar solo 1 dígito numérico
    if (!/^[0-9]$/.test(value)) {
      input.value = '';
      return;
    }

    this.otpDigits[index] = value;

    // Si NO es el último input → avanzar
    if (index < this.otpDigits.length - 1) {
      const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
      nextInput?.focus();
    } else {
      // Si es el último → foco al password
      const passInput = document.getElementById('newPassword') as HTMLInputElement;
      passInput?.focus();
    }

    // Actualizar el form sin borrar
    this.form.get('code')?.setValue(this.otpDigits.join(''));
  }

  // onOtpBackspace(index: number, event: KeyboardEvent) {
  //   const input = event.target as HTMLInputElement;

  //   // Si presiona backspace y el campo está vacío → regresar
  //   if (event.key === 'Backspace' && !input.value && index > 0) {
  //     const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
  //     prevInput?.focus();
  //   }
  // }

  // Getters
  get email(): AbstractControl { return this.form.controls['email']; }
  get code(): AbstractControl { return this.form.controls['code']; }
  get newPassword(): AbstractControl { return this.form.controls['newPassword']; }
  get confirmPassword(): AbstractControl { return this.form.controls['confirmPassword']; }

  // Validator personalizado para coincidencia de contraseñas
  passwordMatchValidator(group: FormGroup) {
    const password = group.get('newPassword')?.value;
    const confirm = group.get('confirmPassword')?.value;
    return password === confirm ? null : { passwordsMismatch: true };
  }

  // Paso 1: enviar email
  onSubmitEmail() {
    if (this.email.invalid) {
      this.email.markAsTouched();
      this.focusEmailInput(); // Foco si hay error
      return;
    }
    this.submitting.set(true);
    this.error.set(null);

    this.authService.forgotPassword(this.email.value).subscribe({
      next: () => {
        this.submitting.set(false);
        this.successEmail.set(true);
        this.successReset.set(false);
        this.step.set('reset');
        this.focusOtpInput(0); // Foco en el primer input OTP
      },
      error: (err) => {
        this.submitting.set(false);

        if (err.message === 'Usuario no encontrado') {
          this.error.set('El email ingresado no está registrado.');
        } else {
          this.error.set(err.message || 'Error al enviar el código');
        }

        this.focusEmailInput(); // Foco si hay error
      }
    });
  }

  // Paso 2: reset contraseña
  onSubmitReset() {
    if (this.code.invalid || this.newPassword.invalid || this.confirmPassword.invalid || this.form.errors?.['passwordsMismatch']) {
      this.form.markAllAsTouched();
      this.focusOtpInput(0); // Foco si hay error en OTP
      return;
    }
    this.submitting.set(true);
    this.error.set(null);

    this.authService.resetPasswordWithCode(this.email.value, this.code.value, this.newPassword.value).subscribe({
      next: () => {
        this.submitting.set(false);
        this.successReset.set(true);
        this.successEmail.set(false);
        setTimeout(() => this.router.navigate(['/auth/login']), 2000);
      },
      error: (err) => {
        this.submitting.set(false);
        this.error.set(err.message || 'Error al restablecer la contraseña');
        this.focusOtpInput(0); // Foco si hay error en OTP
      }
    });
  }

  // onCancel() {
  //   const emailValue = this.form.get('email')?.value;

  //   if (emailValue) {
  //     // Llamamos al endpoint para cancelar el OTP en backend
  //     this.authService.cancelForgotPassword(emailValue).subscribe({
  //       next: () => console.log('OTP cancelado correctamente'),
  //       error: (err) => console.error('Error al cancelar forgot-password', err)
  //     });
  //   }

  //   // Limpiar formulario y estado local
  //   this.form.reset();
  //   this.otpDigits = ['', '', '', '', '', ''];
  //   this.successEmail.set(false);
  //   this.successReset.set(false);
  //   this.error.set(null);
  //   this.step.set('email');

  //   // Foco inicial en email
  //   this.focusEmailInput();
  // }

  onCancel() {
    const emailValue = this.form.get('email')?.value;

    if (this.successEmail() && emailValue) {
      this.authService.cancelForgotPassword(emailValue).subscribe({
        next: () => console.log('OTP cancelado correctamente'),
        error: (err) => console.error('Error al cancelar forgot-password', err),
        complete: () => {
          this.resetFormAndRedirect();
        }
      });
    } else {
      this.resetFormAndRedirect();
    }
  }

  private resetFormAndRedirect() {
    this.form.reset();
    this.otpDigits = ['', '', '', '', '', ''];
    this.successEmail.set(false);  // ✅ corregido
    this.successReset.set(false);  // ✅ corregido
    this.error.set(null);           // ✅ corregido
    this.step.set('email');         // ✅ si step es WritableSignal
    this.router.navigate(['/auth/login']);
  }


  //
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
    this.passwordIcon = this.showPassword ? 'visibility_off' : 'visibility';
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword = !this.showConfirmPassword;
    this.confirmPasswordIcon = this.showConfirmPassword ? 'visibility_off' : 'visibility';
  }


  // TrackBy para que Angular no re-renderice los inputs
  trackByIndex(index: number, item: any) {
    return index;
  }

  onOtpInput(index: number, event: Event) {
    const input = event.target as HTMLInputElement;

    // Tomar solo un dígito válido
    const digit = input.value.replace(/\D/g, '').charAt(0) || '';
    input.value = digit; // Mantener el input con el valor correcto
    this.otpDigits[index] = digit;

    // Actualizar FormControl
    this.form.get('code')?.setValue(this.otpDigits.join(''));

    // Avanzar foco
    if (digit) {
      if (index < this.otpDigits.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`) as HTMLInputElement;
        nextInput?.focus();
      } else {
        const passwordInput = document.getElementById('newPassword') as HTMLInputElement;
        passwordInput?.focus();
      }
    }
  }

  onOtpBackspace(index: number, event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`) as HTMLInputElement;
      this.otpDigits[index - 1] = '';
      this.form.get('code')?.setValue(this.otpDigits.join(''));
      prevInput?.focus();
      event.preventDefault();
    }
  }
}
