// backend-service.ts
import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnDestroy, Signal, signal, computed } from '@angular/core';
import { interval, Subscription, catchError, map, of } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BackendService {
  private http = inject(HttpClient);

  // Inicialmente asumimos backend caído
  private _backendAvailable = signal<boolean>(false);
  readonly backendAvailable: Signal<boolean> = this._backendAvailable.asReadonly();

  private checkIntervalSub?: Subscription;

  constructor() {}

  /** Devuelve true si backend está caído */
  backendDown = computed(() => !this._backendAvailable());

  /** Actualiza el estado del backend */
  public setBackendStatus(isAvailable: boolean) {
    this._backendAvailable.set(isAvailable);
  }

  /** Verifica el estado del backend una sola vez */
  public checkBackend() {
    return this.http.get<{ status: string }>(`${environment.apiUrl}/auth/health`).pipe(
      map(res => {
        const isAvailable = res?.status === 'Backend OK';
        this.setBackendStatus(isAvailable);
        return isAvailable;
      }),
      catchError(() => {
        this.setBackendStatus(false);
        return of(false);
      })
    );
  }

  /** Inicia chequeo periódico cada intervalMs milisegundos */
  public startPeriodicCheck(intervalMs: number) {
    // Primera verificación inmediata
    this.checkBackend().subscribe();

    // Comprobaciones periódicas
    this.checkIntervalSub = interval(intervalMs).subscribe(() => {
      this.checkBackend().subscribe();
    });
  }

  ngOnDestroy() {
    this.checkIntervalSub?.unsubscribe();
  }
}
