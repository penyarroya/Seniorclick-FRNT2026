import { HttpClient } from '@angular/common/http';
import { Component, computed, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ToolbarComponent } from "../../shared/toolbar/toolbar.component";
import { FooterComponent } from "../../shared/footer/footer.component";
import { BackendService } from '../../core/services/backend/backend.service';
import { AuthService } from '../../core/services/auth/auth.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-page',
  imports: [ToolbarComponent, FooterComponent],
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent {
//
  private backendService = inject(BackendService);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService);

  /** ===================
   *  Señal de autenticación
   * =================== */
  isLoggedInSignal = toSignal(this.authService.authenticated$, { initialValue: false });

  /** Carrusel signals */
  private _images = signal<string[]>([]);
  readonly activeIndex = signal(0);
  public imagesLoaded = signal(false);
  authChecking: WritableSignal<boolean> = signal(false);

  /** Computed */
  showLoginButtonSignal = computed(() => !!this.backendService.backendAvailable());
  showBackendDown = computed(() => !this.backendService.backendAvailable() && this.imagesLoaded());

  logoLabel = 'SeniorClick';
  intervalId?: number;

  // ngOnInit() {
  //   if (!isPlatformBrowser(this.platformId)) return;

  //   // Indicamos que estamos verificando la sesión
  //   this.authChecking.set(true);

  //   this.authService.checkSession().subscribe({
  //     next: () => this.authChecking.set(false),
  //     error: () => this.authChecking.set(false)  // <-- maneja cualquier error inesperado
  //   });


  //   // Escucha para cierre de página
  //   window.addEventListener('pagehide', this.handleAppClose);

  //   // Carga de imágenes
  //   this.loadImages();

  //   // Inicio de verificación periódica del backend
  //   setTimeout(() => this.backendService.startPeriodicCheck(5000), 100);
  // }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) return;

    // NUEVA CONDICIÓN: Si estamos saliendo, no preguntamos al servidor.
    if (this.authService.getLoggingOutStatus()) {
      this.authChecking.set(false);
    } else {
      this.authChecking.set(true);
      this.authService.checkSession().subscribe({
        next: () => this.authChecking.set(false),
        error: () => this.authChecking.set(false)
      });
    }

    // Resto de tu código (imágenes, backend check, etc.)
    window.addEventListener('pagehide', this.handleAppClose);
    this.loadImages();
    setTimeout(() => this.backendService.startPeriodicCheck(5000), 100);
  }


  ngOnDestroy() {
    if (this.intervalId) clearInterval(this.intervalId);
    if (isPlatformBrowser(this.platformId)) window.removeEventListener('pagehide', this.handleAppClose);
  }

  private handleAppClose = (event: PageTransitionEvent) => {
    if (!isPlatformBrowser(this.platformId)) return;
    // Aquí podrías limpiar si quieres
  };

  /** =================== CARRUSEL =================== **/
  getImages(): string[] {
    return this._images();
  }

  nextSlide() {
    if (!this._images().length) return;
    this.activeIndex.set((this.activeIndex() + 1) % this._images().length);
    this.resetAutoSlide();
  }

  prevSlide() {
    if (!this._images().length) return;
    const newIndex = (this.activeIndex() - 1 + this._images().length) % this._images().length;
    this.activeIndex.set(newIndex);
    this.resetAutoSlide();
  }

  goToSlide(index: number) {
    if (index < 0 || index >= this._images().length) return;
    this.activeIndex.set(index);
    this.resetAutoSlide();
  }

  private startAutoSlide() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.intervalId = window.setInterval(() => this.nextSlide(), 5000);
  }

  private resetAutoSlide() {
    if (!isPlatformBrowser(this.platformId)) return;
    if (this.intervalId) clearInterval(this.intervalId);
    this.startAutoSlide();
  }

  private loadImages() {
    if (!isPlatformBrowser(this.platformId)) return;
    this.http.get<string[]>('/img/images.json').subscribe({
      next: imgs => {
        this._images.set(imgs);
        this.imagesLoaded.set(true);
        if (imgs.length > 0) this.startAutoSlide();
      },
      error: err => {
        console.error('Error cargando imágenes:', err);
        this.imagesLoaded.set(true);
      }
    });
  }

  reloadPage() {
    if (!isPlatformBrowser(this.platformId)) return;
    window.location.reload();
  }

  handleImageError(img: string) {
    this._images.set(this._images().filter(i => i !== img));
  }
}



