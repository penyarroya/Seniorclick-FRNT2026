// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-toolbar',
//   imports: [],
//   templateUrl: './toolbar.component.html',
//   styleUrl: './toolbar.component.scss',
// })
// export class ToolbarComponent {

// }




import { Component, Input, Output, EventEmitter, inject, signal, Signal, WritableSignal, effect } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../core/services/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatIconModule, MatButtonModule, MatTooltipModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {

  private router = inject(Router);
  private authService = inject(AuthService);

  /** ======================
   *  Señal del AuthService (solo lectura)
   * ======================= */
  private authSignal: Signal<boolean> = toSignal(
    this.authService.authenticated$, 
    { initialValue: false }
  );

  /** ======================
   *  Señal local que SÍ permite .set()
   * ======================= */
  isLoggedInSignal: WritableSignal<boolean> = signal(false);

  /** Sincroniza la señal local con la señal del AuthService */
  constructor() {
    // Sincroniza estado de login
    effect(() => {
      this.isLoggedInSignal.set(this.authSignal());
    });

    // Actualiza nombre de usuario cuando está logueado
    effect(() => {
      if (this.isLoggedInSignal()) {
        this.authService.getUserName().subscribe(name => this.userNameSignal.set(name));
      } else {
        this.userNameSignal.set(undefined);
      }
    });
  }

  /** ---------------------
   *  Títulos y logos
   * --------------------- */
  private _title = signal<string>('SeniorClick');
  readonly title = this._title.asReadonly();

  private _logoText = signal<string>('SeniorClick');
  readonly logoText = this._logoText.asReadonly();

  private _logOutText = signal<string>('Cerrar sesión');
  readonly logOutText = this._logOutText.asReadonly();

  @Input() logoUrl: string = 'icon/logo.ico';

  @Input() set toolbarTitle(value: string) { this._title.set(value); }
  @Input() set logoLabel(value: string) { this._logoText.set(value); }
  @Input() set logOutLabel(value: string) { this._logOutText.set(value); }

  /** ---------------------
   *  Señales de UI
   * --------------------- */
  showMenuSignal: WritableSignal<boolean> = signal(true);
  showTitleSignal: WritableSignal<boolean> = signal(true);
  showLoginSignal: WritableSignal<boolean> = signal(true);
  showProfileSignal: WritableSignal<boolean> = signal(true);
  showCarouselControlsSignal: WritableSignal<boolean> = signal(false);
  userNameSignal: WritableSignal<string | undefined> = signal(undefined);

  @Input() set showMenu(v: boolean) { this.showMenuSignal.set(v); }
  @Input() set showTitle(v: boolean) { this.showTitleSignal.set(v); }
  @Input() set showLogin(v: boolean) { this.showLoginSignal.set(v); }
  @Input() set isLoggedIn(v: boolean) { this.isLoggedInSignal.set(v); }
  @Input() set showProfile(v: boolean) { this.showProfileSignal.set(v); }
  @Input() set showCarouselControls(v: boolean) { this.showCarouselControlsSignal.set(v); }
  @Input() set userName(v: string | undefined) { this.userNameSignal.set(v); }

  /** ---------------------
   *  Signal de botón login
   * --------------------- */
  private _showLoginButtonSignal: Signal<boolean> = signal(false);

  @Input() set showLoginButtonSignal(value: Signal<boolean> | null) {
    this._showLoginButtonSignal = value ?? signal(false);
  }
  get showLoginButtonValue(): boolean { return this._showLoginButtonSignal(); }
  get showLoginButtonSignal(): Signal<boolean> { return this._showLoginButtonSignal; }

  /** ---------------------
   *  Eventos
   * --------------------- */
  @Output() menuToggle = new EventEmitter<void>();
  @Output() login = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  @Output() profileClick = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();

  /** ---------------------
   *  Métodos
   * --------------------- */
  
  onLoginClick() {
    this.login.emit();
    this.router.navigate(['auth']);
  }

  onLogoutClick() {
    this.authService.logout().subscribe({
      next: () => {
        this.isLoggedInSignal.set(false); // <- AHORA NO DA ERROR
        this.logout.emit();
        this.router.navigate(['auth/login']);
      },
      error: (err) => {
        console.error('Error cerrando sesión:', err);
        this.isLoggedInSignal.set(false);
        this.router.navigate(['auth/login']);
      }
    });
  }

  openProfile() { this.profileClick.emit(); }
  onPrev() { this.prev.emit(); }
  onNext() { this.next.emit(); }
}
