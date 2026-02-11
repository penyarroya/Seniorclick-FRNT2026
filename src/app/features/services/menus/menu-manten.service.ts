import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

export interface MenuItem {
  label: string;
  icon?: string;

  // Navegación
  route?: string;
  action?: string;

  // Roles y permisos
  roles?: string[];

  // Submenús
  items?: MenuItem[];
  open?: boolean;

  // Separador / título visual
  type?: 'separator';

  // Estado activo en el menú
  active?: boolean;
}


@Injectable({ providedIn: 'root' })
export class MenuMantenService {

  // Archivo ubicado en: src/public/menus/menuManten.json
  private readonly menuUrl = '/menus/menuManten.json';

  constructor(private http: HttpClient) {}

  getMenu(): Observable<MenuItem[]> {
    return this.http.get<MenuItem[]>(this.menuUrl).pipe(
      catchError(error => {
        console.error('❌ ERROR cargando menú de mantenimiento');
        console.error('Ruta:', this.menuUrl);
        console.error('Detalle:', error);
        return of([]); // evita que la app se rompa
      })
    );
  }
}
