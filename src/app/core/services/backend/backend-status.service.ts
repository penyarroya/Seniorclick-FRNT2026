import { Injectable, inject, OnDestroy, Signal, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, interval, of, Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BackendStatusService implements OnDestroy {
  private http = inject(HttpClient);

  // Signals públicos (Solo lectura para los componentes)
  private _backendDown = signal<boolean>(false);
  readonly backendDown: Signal<boolean> = this._backendDown.asReadonly();

  private _countdown = signal<number>(0);
  readonly countdown: Signal<number> = this._countdown.asReadonly();

  private _reconnected = signal<boolean>(false);
  readonly reconnected: Signal<boolean> = this._reconnected.asReadonly();

  private retryIntervalSub?: Subscription;
  private readonly retryDelay = 2000;
  private readonly maxRetryDelay = 30000;
  private readonly factor = 2;
  private currentDelay = this.retryDelay;

  private firstCheckDone = false;

  /**
   * Activa o desactiva el estado de error global.
   * Inicia el ciclo de reintentos exponenciales si status es true.
   */
  setBackendDown(status: boolean) {
    // Solo retornamos si el valor ya es exactamente el mismo, 
    // pero nos aseguramos de que el intervalo se inicie si es necesario.
    if (status && this._backendDown()) {
      if (!this.retryIntervalSub) this.startAutoRetry(); // Por si acaso se quedó huérfano
      return;
    }

    this._backendDown.set(status);

    if (status) {
      this._reconnected.set(false); // Si cae, no puede estar rebotando el reconnected
      this.startAutoRetry();
    } else {
      this.stopAutoRetry();
      this.currentDelay = this.retryDelay;
    }
  }

  /**
   * Método de recuperación rápida.
   * Lo llama el interceptor cuando CUALQUIER petición tiene éxito.
   */
  retryBackend() {
    // Si estábamos en modo "caído" y algo respondió, cancelamos el drama
    if (this._backendDown()) {
      this.stopAutoRetry();
      this._backendDown.set(false);
      this._reconnected.set(true);
      this.currentDelay = this.retryDelay;
      setTimeout(() => this._reconnected.set(false), 3000);
    } else {
      // Si no estaba caído, simplemente ejecutamos un chequeo de rutina
      this.checkBackend();
    }
  }

  /**
   * Ejecuta el Health Check contra el servidor.
   */
  private checkBackend() {
    this.http.get<{ status: string }>(`${environment.apiUrl}/auth/health`)
      .pipe(catchError(() => of(null)))
      .subscribe(res => {
        const backendUp = res !== null && res.status === 'Backend OK';
        const wasDown = this._backendDown();

        if (backendUp) {
          // ESCENARIO: SERVIDOR RECUPERADO
          if (wasDown) {
            this._reconnected.set(true);
            setTimeout(() => this._reconnected.set(false), 3000);
          }
          this._backendDown.set(false);
          this.currentDelay = this.retryDelay;
          this.stopAutoRetry();
        } else {
          // ESCENARIO: SIGUE CAÍDO
          this._backendDown.set(true);
          // Aplicamos Backoff Exponencial
          this.currentDelay = Math.min(this.currentDelay * this.factor, this.maxRetryDelay);
          this.startAutoRetry();
        }
        
        this.firstCheckDone = true;
      });
  }

  /**
   * Gestiona el temporizador visual (cuenta atrás)
   */
  private startAutoRetry() {
    this.stopAutoRetry();
    
    let secondsToWait = Math.ceil(this.currentDelay / 1000);
    this._countdown.set(secondsToWait);

    this.retryIntervalSub = interval(1000).subscribe(() => {
      secondsToWait--;
      this._countdown.set(Math.max(0, secondsToWait));

      if (secondsToWait <= 0) {
        this.stopAutoRetry(); // Limpiamos el intervalo actual
        this.checkBackend();  // Intentamos conectar
      }
    });
  }

  private stopAutoRetry() {
    if (this.retryIntervalSub) {
      this.retryIntervalSub.unsubscribe();
      this.retryIntervalSub = undefined;
    }
    this._countdown.set(0);
  }

  ngOnDestroy() {
    this.stopAutoRetry();
  }
}
