// import { Component, signal, computed, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
// import { Router, RouterModule, ActivatedRoute } from '@angular/router';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatButtonModule } from '@angular/material/button';
// import { AuthService } from '../../../core/services/auth/auth.service';

// @Component({
//   selector: 'app-reset-password',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatButtonModule,
//     RouterModule
//   ],
//   templateUrl: './check-reset-code.component.html',
//   styleUrls: ['./check-reset-code.component.scss']
// })
// export class ResetPasswordComponent implements AfterViewInit, OnDestroy {
//   private readonly TIMEOUT_DURATION = 90000; // 1,5 minuto
//   private readonly STORAGE_KEY = 'remainingSecondsReset';

//   private inactivityTimeoutId: any;
//   private countdownIntervalId: any;

//   private authService = inject(AuthService);
//   private router = inject(Router);
//   private route = inject(ActivatedRoute);

//   @ViewChild('codeInput') codeInput!: ElementRef<HTMLInputElement>;

//   loading = signal(false);
//   errorMessage = signal('');
//   successMessage = signal('');

//   remainingSeconds = signal(this.TIMEOUT_DURATION / 1000);

//   timeDisplay = computed(() => {
//     const total = this.remainingSeconds();
//     const minutes = Math.floor(total / 60);
//     const seconds = total % 60;
//     return `${minutes}:${seconds.toString().padStart(2, '0')}`;
//   });

//   isTimeLow = computed(() => this.remainingSeconds() <= 10);

//   email: string = '';

//   form = new FormGroup({
//     code: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
//     newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required, Validators.minLength(6)] }),
//     confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] })
//   });

//   // ------------------ Computed ------------------
//   codeErrors = computed(() => this.getControlErrors('code'));

//   // ------------------ Helpers ------------------
//   private saveRemainingSeconds() {
//     if (typeof window !== 'undefined') {
//       localStorage.setItem(this.STORAGE_KEY, this.remainingSeconds().toString());
//     }
//   }

//   private clearStoredTime() {
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem(this.STORAGE_KEY);
//     }
//   }

//   private startCountdown() {
//     this.countdownIntervalId = setInterval(() => {
//       const newValue = this.remainingSeconds() - 1;
//       this.remainingSeconds.set(newValue);
//       this.saveRemainingSeconds();

//       if (newValue <= 0) {
//         clearInterval(this.countdownIntervalId);
//         this.clearStoredTime();
//         this.errorMessage.set('Tiempo agotado. El proceso fue cancelado.');
//       }
//     }, 1000);
//   }

//   getControlErrors(controlName: 'code' | 'newPassword' | 'confirmPassword'): string[] {
//     const control = this.form.get(controlName);
//     const e = control?.errors;
//     const msgs: string[] = [];
//     if (!e || control?.valid) return [];
//     if (e['required']) msgs.push('Campo obligatorio');
//     if (e['minlength']) msgs.push(`Mínimo ${e['minlength'].requiredLength} caracteres`);
//     return msgs;
//   }

//   showError(controlName: 'code' | 'newPassword' | 'confirmPassword') {
//     const control = this.form.get(controlName);
//     return control && control.invalid && control.touched;
//   }

//   onFocus(controlName: 'code' | 'newPassword' | 'confirmPassword') {
//     const control = this.form.get(controlName);
//     if (control) control.markAsUntouched();
//   }

//   // ------------------ Lifecycle ------------------
//   ngAfterViewInit() {
//     setTimeout(() => this.codeInput?.nativeElement.focus(), 100);

//     this.route.queryParams.subscribe(params => {
//       if (params['email']) this.email = params['email'];
//     });

//     if (typeof window !== 'undefined') {
//       const saved = localStorage.getItem(this.STORAGE_KEY);
//       const savedNumber = saved ? parseInt(saved, 10) : NaN;
//       if (!isNaN(savedNumber) && savedNumber > 0) {
//         this.remainingSeconds.set(savedNumber);
//       }
//     }

//     this.startCountdown();

//     const msRemaining = this.remainingSeconds() * 1000;
//     this.inactivityTimeoutId = setTimeout(() => {
//       this.errorMessage.set('Tiempo de espera agotado. Proceso cancelado automáticamente.');
//     }, msRemaining);
//   }

//   // ------------------ Submit ------------------
//   submit() {
//     this.errorMessage.set('');
//     this.successMessage.set('');
//     this.form.markAllAsTouched();

//     if (this.form.invalid) return;

//     const { code, newPassword, confirmPassword } = this.form.getRawValue();

//     // Validar token
//     if (!code) {
//       this.errorMessage.set('Token no proporcionado. Verifica el enlace enviado a tu email.');
//       return;
//     }

//     // Validar que las contraseñas coincidan
//     if (newPassword !== confirmPassword) {
//       this.errorMessage.set('Las contraseñas no coinciden.');
//       return;
//     }

//     this.loading.set(true);

//     this.authService.resetPassword(code, newPassword).subscribe({
//       next: () => {
//         this.loading.set(false);
//         this.successMessage.set('✅ Contraseña restablecida correctamente');

//         clearTimeout(this.inactivityTimeoutId);
//         clearInterval(this.countdownIntervalId);
//         this.clearStoredTime();

//         setTimeout(() => {
//           this.router.navigate(['/auth/login'], { queryParams: { email: this.email } });
//         }, 1000);
//       },
//       error: err => {
//         this.loading.set(false);
//         const msg = err?.message || err?.error?.message || 'Error al restablecer la contraseña';
//         this.errorMessage.set(msg);
//       }
//     });
//   }

//   // ------------------ Navegación ------------------
//   cancel() {
//     clearTimeout(this.inactivityTimeoutId);
//     clearInterval(this.countdownIntervalId);
//     this.clearStoredTime();
//     this.router.navigate(['/auth/login']);
//   }

//   goToLogin() {
//     this.cancel(); // reutiliza la lógica de cancelación y navegación
//   }

//   // ------------------ Destroy ------------------
//   ngOnDestroy(): void {
//     clearTimeout(this.inactivityTimeoutId);
//     clearInterval(this.countdownIntervalId);
//     this.clearStoredTime();
//   }
// }


import { Component, signal, computed, inject, ElementRef, ViewChild, AfterViewInit, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-reset-code', // 🔹 Selector actualizado
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './check-reset-code.component.html',
  styleUrls: ['./check-reset-code.component.scss']
})
export class ResetCodeComponent implements OnInit, AfterViewInit, OnDestroy {
  private readonly TIMEOUT_DURATION = 90000; // 1,5 minutos
  private readonly STORAGE_KEY = 'remainingSecondsVerify';

  private inactivityTimeoutId: any;
  private countdownIntervalId: any;

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  @ViewChild('codeInput') codeInput!: ElementRef<HTMLInputElement>;

  // Signals para estado
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  email: string = '';
  remainingSeconds = signal(this.TIMEOUT_DURATION / 1000);

  // ------------------ Formulario ------------------
  form = new FormGroup({
    code: new FormControl('', { 
      nonNullable: true, 
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(6)] 
    })
  });

  // ------------------ Computed ------------------
  timeDisplay = computed(() => {
    const total = this.remainingSeconds();
    const minutes = Math.floor(total / 60);
    const seconds = total % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  });

  isTimeLow = computed(() => this.remainingSeconds() <= 10);
  codeErrors = computed(() => this.getControlErrors('code'));

  // ------------------ Helpers de Tiempo ------------------
  private saveRemainingSeconds() {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.STORAGE_KEY, this.remainingSeconds().toString());
    }
  }

  private clearStoredTime() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private startCountdown() {
    this.countdownIntervalId = setInterval(() => {
      const newValue = this.remainingSeconds() - 1;
      this.remainingSeconds.set(newValue);
      this.saveRemainingSeconds();

      if (newValue <= 0) {
        this.handleTimeout();
      }
    }, 1000);
  }

  private handleTimeout() {
    this.stopTimers();
    this.errorMessage.set('Tiempo agotado. Regresando al login...');
    setTimeout(() => this.router.navigate(['/auth/login']), 2000);
  }

  private stopTimers() {
    clearTimeout(this.inactivityTimeoutId);
    clearInterval(this.countdownIntervalId);
    this.clearStoredTime();
  }

  // ------------------ Manejo de Errores UI ------------------
  getControlErrors(controlName: 'code'): string[] {
    const control = this.form.get(controlName);
    const e = control?.errors;
    if (!e || control?.valid) return [];
    if (e['required']) return ['Campo obligatorio'];
    if (e['minlength'] || e['maxlength']) return ['El código debe tener 6 caracteres'];
    return [];
  }

  showError(controlName: 'code') {
    const control = this.form.get(controlName);
    return control && control.invalid && control.touched;
  }

  onFocus(controlName: 'code') {
    this.form.get(controlName)?.markAsUntouched();
  }

  // ------------------ Ciclo de Vida ------------------
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
    });
  }

  ngAfterViewInit() {
    setTimeout(() => this.codeInput?.nativeElement.focus(), 100);

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      const savedNumber = saved ? parseInt(saved, 10) : NaN;
      if (!isNaN(savedNumber) && savedNumber > 0) {
        this.remainingSeconds.set(savedNumber);
      }
    }

    this.startCountdown();

    const msRemaining = this.remainingSeconds() * 1000;
    this.inactivityTimeoutId = setTimeout(() => {
      this.handleTimeout();
    }, msRemaining);
  }

  // ------------------ Submit ------------------
  submit() {
    this.errorMessage.set('');
    this.successMessage.set('');
    this.form.markAllAsTouched();

    if (this.form.invalid) return;

    const { code } = this.form.getRawValue();
    this.loading.set(true);

    this.authService.verifyEmail(this.email, code).subscribe({
      next: () => {
        this.loading.set(false);
        this.successMessage.set('✅ ¡Cuenta activada correctamente!');
        this.stopTimers();

        setTimeout(() => {
          this.router.navigate(['/auth/login'], { queryParams: { verified: true } });
        }, 1500);
      },
      error: err => {
        this.loading.set(false);
        const msg = err?.error?.message || 'Código inválido o expirado';
        this.errorMessage.set(msg);
      }
    });
  }

  cancel() {
    this.stopTimers();
    this.router.navigate(['/auth/login']);
  }

  goToLogin() {
    this.cancel();
  }

  ngOnDestroy(): void {
    this.stopTimers();
  }
}