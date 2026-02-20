import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, tap, map, catchError, throwError, timer, of, finalize, switchMap } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { AuthResponse } from '../../../features/auth/dtos/Auth-Response'; 
import { UserVerificationResponse } from '../../../features/models/users/User-Verification-Response';
import { RegisterRequestDTO } from '../../../features/auth/dtos/RegisterRequestDTO';
import { CurrentUser } from '../../../features/auth/dtos/CurrentUserDTO';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
//  
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  private _authenticated = new BehaviorSubject<boolean>(false);
  public authenticated$ = this._authenticated.asObservable();

  // Añade esto junto a los otros Subjects
  private _isInitialized = new BehaviorSubject<boolean>(false);
  public isInitialized$ = this._isInitialized.asObservable();

  private refreshing = false;
  private refreshQueue: ((success: boolean) => void)[] = [];
  private refreshIntervalMs = 14 * 60 * 1000;
  private refreshTimerSub: any;

  private isLoggingOut = false;

  // 2. Crea el Subject para el usuario actual
  private _currentUser = new BehaviorSubject<CurrentUser | null>(null);
  public currentUser$ = this._currentUser.asObservable();

  // 3. Define el getter que te falta (esto quita el error ts2339)
  get currentUserValue(): CurrentUser | null {
    return this._currentUser.value;
  }

  constructor() {}

  // ================== LOGIN ==================
  loginWithUsername(username: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      { username, password },
      { withCredentials: true }
    ).pipe(
      tap((response) => {
        if (response.success && response.user) {
          this._authenticated.next(true);

          const userData: CurrentUser = {
            userId: response.user.userId,
            username: response.user.username,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            avatarUrl: response.user.avatarUrl,
            // NORMALIZACIÓN: Pasamos los roles a MAYÚSCULAS
            roles: response.user.roles.map((r: string) => r.toUpperCase())
          };

          this._currentUser.next(userData);
          this.scheduleAutoRefresh();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return throwError(() => new Error('Credenciales inválidas. Por favor, verifica tu usuario y contraseña.'));
        }
        return throwError(() => error);
      })
    );
  }

  //
  loginWithEmail(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login/email`,
      { email, password },
      { withCredentials: true }
    ).pipe(
      tap((response) => {
        // 1. Verificamos éxito y existencia del usuario en la respuesta
        if (response.success && response.user) {
          this._authenticated.next(true);

          const userData: CurrentUser = {
            userId: response.user.userId,
            username: response.user.username,
            email: response.user.email,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            avatarUrl: response.user.avatarUrl,
            // CAMBIO AQUÍ: Añade el .map para asegurar mayúsculas
            roles: response.user.roles.map((r: string) => r.toUpperCase())
          };

          // 3. Notificamos a toda la app que el usuario ha cambiado
          this._currentUser.next(userData);
          
          this.scheduleAutoRefresh();
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          return throwError(() => new Error('Credenciales inválidas. Por favor, verifica tu email y contraseña.'));
        }
        return throwError(() => error);
      })
    );
  }

  // ================== REGISTER ==================
  // ANTES: register(username: string, email: string, password: string)
  // AHORA: Recibe el objeto completo que espera Java
  register(data: RegisterRequestDTO): Observable<UserVerificationResponse> {
    return this.http.post<UserVerificationResponse>(`${this.apiUrl}/register`, data);
  }

  verifyEmail(email: string, code: string): Observable<UserVerificationResponse> {
    const params = new HttpParams().set('email', email).set('code', code);
    return this.http.post<UserVerificationResponse>(`${this.apiUrl}/verify-email`, null, { params });
  }

  // ================== FORGOT PASSWORD ==================
  forgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/forgot-password`,
      { email },
      { withCredentials: true } 
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const backendMsg = error.error?.message;

        // Si el backend indica que el usuario no existe, mostrar mensaje claro
        if (backendMsg === 'Usuario no encontrado') {
          return throwError(() => new Error('El email ingresado no está registrado.'));
        }

        // Otros errores del backend
        return throwError(() => new Error(backendMsg || 'Error enviando email de recuperación'));
      })
    );
  }

  // ================== CANCEL FORGOT PASSWORD ==================
  cancelForgotPassword(email: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/forgot-password/cancel`,
      { email },
      { withCredentials: true }
    );
  }

  // ================== RESET PASSWORD BY TOKEN ==================
  resetPassword(token: string, newPassword: string): Observable<{ message: string }> {
    if (!token) return throwError(() => new Error('Token inválido o no proporcionado.'));
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password-by-token`, 
      { token, newPassword },
      { withCredentials: true }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const msg = error.error?.message || 'Error desconocido al restablecer la contraseña';
        return throwError(() => new Error(msg));
      })
    );
  }

  // ================== RESET PASSWORD CON CÓDIGO OTP ==================
  resetPasswordWithCode(email: string, code: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`, // Endpoint backend que acepta email + code + newPassword
      { email, code, newPassword },
      { withCredentials: true }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const msg = error.error?.message || 'Error desconocido al restablecer la contraseña';
        return throwError(() => new Error(msg));
      })
    );
  }

  // ================== CONFIRM RESET TOKEN ==================
  confirmResetToken(token: string): Observable<{ email: string }> {
    if (!token) return throwError(() => new Error('Token de confirmación no proporcionado.'));
    const params = new HttpParams().set('token', token);
    return this.http.post<{ email: string }>(
      `${this.apiUrl}/confirm-reset-token`, 
      null, 
      { params, withCredentials: true }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const msg = error.error?.message || 'Error: El enlace de restablecimiento es inválido o ha caducado.';
        return throwError(() => new Error(msg));
      })
    );
  }

  // ================== RESET PASSWORD BY EMAIL ==================
  resetPasswordByEmail(email: string, newPassword: string): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/reset-password`,
      { email, newPassword },
      { withCredentials: true }
    ).pipe(
      catchError((error: HttpErrorResponse) => {
        const msg = error.error?.message || 'Error desconocido al restablecer la contraseña';
        return throwError(() => new Error(msg));
      })
    );
  }

  // ------------------- CHECK PASSWORD RESET CONFIRMED -------------------
  isPasswordResetConfirmed(email: string): Observable<boolean> {
    return this.http.get<{ confirmed: boolean }>(
      `${this.apiUrl}/password-reset-confirmed`,
      { params: { email } }
    ).pipe(
      map(res => res.confirmed)
    );
  }

  // ================== DELETE UNVERIFIED USER ==================
  deleteUnverifiedUser(email: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/temp-user`, { params: { email } });
  }

  // ================== CHECK USER EXISTS ==================
  checkUserExists(email: string): Observable<boolean> {
    return this.http.post<{ exists: boolean }>(`${this.apiUrl}/check-user`, { email })
      .pipe(map(res => res.exists));
  }

  //
  checkSession(): Observable<void> {
    return this.http.get<{ authenticated: boolean }>(
      `${this.apiUrl}/session`,
      { withCredentials: true }
    ).pipe(
      switchMap(res => {
        if (res.authenticated) {
          return this.http.get<any>(`${this.apiUrl}/me`, { withCredentials: true }).pipe(
            tap(userData => {
              this._authenticated.next(true);
              
              // NORMALIZACIÓN TAMBIÉN AQUÍ: Esto es vital para que el menú aguante el F5
              this._currentUser.next({ 
                ...userData, 
                userId: userData.userId,
                roles: userData.roles?.map((r: string) => r.toUpperCase()) ?? [] 
              });

              this.scheduleAutoRefresh();
              this._isInitialized.next(true);
            }),
            catchError(() => {
              this.handleInternalLogout(); 
              return of(void 0);
            })
          );
        } else {
          this.handleInternalLogout();
          return of(void 0);
        }
      }),
      catchError((err) => {
        this.handleInternalLogout();
        return of(void 0);
      })
    );
  }

  //
  private handleInternalLogout() {
    // 1. Limpiamos el estado reactivo (esto quita el rastro en la consola)
    this._authenticated.next(false);
    this._currentUser.next(null);
    this._isInitialized.next(true);

    // 2. Detenemos procesos en segundo plano
    this.clearAutoRefresh();

    // 3. Borramos TODO el rastro físico
    localStorage.clear();
    sessionStorage.clear();

    // 4. IMPORTANTE: Las cookies no se borran con localStorage.clear().
    // Si sigues viendo al usuario viejo, es porque el servidor 
    // no ha invalidado la cookie de sesión.
    console.warn('Estado local limpiado. Si el usuario persiste, cierra sesión formalmente para borrar la Cookie.');
  }

  // ================== GETTERS ==================
  getUserName(): Observable<string | undefined> {
    return this.http.get<{ username: string }>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(map(res => res.username));
  }

  getUserId(): Observable<number | null> {
    return this.http.get<{ userId: number | null }>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(map(res => res.userId ?? null));
  }
  
  // Opción A: Mantener el observable pero facilitar su uso
  getCurrentUserId(): Observable<number | null> {
    return this.getUserId();
  }

  //
  getUserRoles(): Observable<string[]> {
    // Eliminamos el "if (!this.isAuthenticated())" porque el BehaviorSubject 
    // suele estar en false al refrescar la página (F5) hasta que se valida la sesión.
    
    return this.http.get<{ roles: string[] }>(`${this.apiUrl}/me`, { withCredentials: true })
      .pipe(
        map(res => {
          const roles = (res.roles || []).map(r => r.toUpperCase().trim());
          
          // APROVECHAMOS: Si el servidor nos devuelve roles, 
          // es que estamos autenticados. Actualizamos el booleano.
          if (roles.length > 0) {
            this._authenticated.next(true);
          }
          
          return roles;
        }),
        catchError((err) => {
          this._authenticated.next(false);
          console.error('Sesión no válida o expirada');
          return of([]); 
        })
      );
  }

  //
  isAuthenticated(): boolean {
    return this._authenticated.value;
  }

  setAuthenticated(value: boolean) {
    this._authenticated.next(value);
  }

  // ================== LOGOUT ==================
  logout(): Observable<void> {
    this.isLoggingOut = true; 
    this.clearAutoRefresh();
    
    // Limpieza inmediata de la memoria de Angular (RxJS)
    this._authenticated.next(false);
    this._currentUser.next(null); 
    this._isInitialized.next(true); 

    this.refreshQueue.forEach(cb => cb(false));
    this.refreshQueue = [];

    return this.http.post<{ message: string }>(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.handleInternalLogout(); 
      }),
      map(() => {
        // ESTO ES LO QUE SOLUCIONA TU PROBLEMA:
        localStorage.clear();    // Borra tokens y perfiles del disco
        sessionStorage.clear();   // Borra la sesión actual
        return undefined;         // Arregla el error ts(2322)
      }),
      catchError(err => {
        this.handleInternalLogout();
        localStorage.clear();
        return of(undefined);
      }),
      finalize(() => {
        // RESET TOTAL: Recarga la web para que el nuevo usuario empiece de cero
        window.location.href = '/auth/login'; 
        setTimeout(() => { this.isLoggingOut = false; }, 2000);
      })
    );
  }

  // Añade este método para que el interceptor pueda consultar el estado
  getLoggingOutStatus(): boolean {
      return this.isLoggingOut;
  }

  // ================== REFRESH TOKEN ==================
  refreshToken(): Observable<void> {
    if (this.refreshing) {
      return new Observable<void>(observer => {
        this.refreshQueue.push(success => {
          success ? observer.next() : observer.error(new Error('Refresh token expirado'));
          observer.complete();
        });
      });
    }

    this.refreshing = true;

    // Cambiamos <void> por <any> para capturar el nuevo DTO si el backend lo envía
    return this.http.post<any>(`${this.apiUrl}/refresh-token`, {}, { withCredentials: true }).pipe(
      tap((userData) => {
        this.refreshing = false;
        // Si el refresh devuelve el usuario, actualizamos el estado global
        if (userData && userData.userId) {
          this._currentUser.next({ ...userData, userId: userData.userId });
        }
        this.processQueue(true);
        this.scheduleAutoRefresh();
      }),
      catchError(err => {
        if (err.status === 409) {
          this.refreshing = false;
          this.processQueue(true);
          this.scheduleAutoRefresh();
          return of(undefined);
        }

        this.handleInternalLogout(); // Centralizamos la limpieza
        this.processQueue(false);
        this.refreshing = false;
        return throwError(() => err);
      })
    );
  }

  //
  updateProfile(request: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/profile`, request, { withCredentials: true })
      .pipe(
        tap((response) => {
          // Obtenemos el usuario actual que tenemos en memoria
          const current = this._currentUser.value;

          if (current) {
            // Creamos el nuevo estado mezclando lo que teníamos con lo que llega del servidor
            const updatedUser: CurrentUser = {
              ...current,
              firstName: response.firstName || current.firstName,
              lastName: response.lastName || current.lastName,
              avatarUrl: response.avatarUrl || current.avatarUrl,
              // IMPORTANTE: Si el backend no envía roles en el PUT, mantenemos los que ya tenía
              roles: response.roles 
                      ? response.roles.map((r: string) => r.toUpperCase()) 
                      : current.roles
            };

            // Notificamos a toda la app el cambio
            this._currentUser.next(updatedUser);
            console.log('Roles detectados tras actualización:', updatedUser.roles);
          }
        })
      );
  }

  // Método auxiliar para limpiar la cola de peticiones esperando el token
  private processQueue(success: boolean) {
    this.refreshQueue.forEach(cb => cb(success));
    this.refreshQueue = [];
  }

  // ================== AUTO REFRESH ==================
  private scheduleAutoRefresh() {
    this.clearAutoRefresh();
    this.refreshTimerSub = timer(this.refreshIntervalMs).subscribe(() => {
      this.refreshToken().subscribe({
        next: () => console.log('Access token renovado automáticamente'),
        error: () => console.log('Refresh expirado, logout automático')
      });
    });
  }

  private clearAutoRefresh() {
    if (this.refreshTimerSub) {
      this.refreshTimerSub.unsubscribe();
      this.refreshTimerSub = null;
    }
  }
}
