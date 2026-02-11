import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MenuItem, MenuMantenService } from './menu-manten.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Injectable({ providedIn: 'root' })
export class MenuLoaderService {
  constructor(
    private maintenanceService: MenuMantenService,
    private authService: AuthService
  ) {}

  /**
   * Devuelve el menú filtrado por roles del usuario
   * Soporta roles síncronos (string[]) o asincrónicos (Observable<string[]>)
   */
  getMenu(): Observable<MenuItem[]> {
    const menu$ = this.maintenanceService.getMenu();
    const roles$ = this.getUserRolesObservable();

    return combineLatest([menu$, roles$]).pipe(
      map(([items, userRoles]) => this.filterMenuByRole(items, userRoles))
    );
  }

  /** 🔹 Obtiene roles como Observable<string[]> aunque sean síncronos */
  private getUserRolesObservable(): Observable<string[]> {
    const roles = this.authService.getUserRoles(); // puede ser string[] o Observable<string[]>

    // Si ya es un array, convertimos a observable con `of`
    if (Array.isArray(roles)) {
      return of(roles);
    }

    // Si es observable, lo devolvemos tal cual
    return roles;
  }

  /** 🔹 Filtra recursivamente items por roles */
  private filterMenuByRole(items: MenuItem[], userRoles: string[]): MenuItem[] {
    const normalizedRoles = userRoles.map(r => r.trim().toLowerCase());

    return items
      .filter(item => !item.roles || item.roles.some(r => normalizedRoles.includes(r.trim().toLowerCase())))
      .map(item => ({
        ...item,
        items: item.items ? this.filterMenuByRole(item.items, userRoles) : undefined
      }));
  }
}
