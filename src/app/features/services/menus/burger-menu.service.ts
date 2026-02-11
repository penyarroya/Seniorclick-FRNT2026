import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MenuInitItem } from '../../models/menus/menuinit-item.model';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BurgerMenuService {
//
   private menuUrl = '/menus/burguer-menu.json'; // JSON externo en /public/menus

  constructor(private http: HttpClient) {}

  getMenu(): Observable<MenuInitItem[]> {
    return this.http.get<MenuInitItem[]>(this.menuUrl)
      .pipe(
        catchError(err => {
          console.error('Error cargando menú desde JSON:', err);
          // Retornar un array vacío como fallback
          return of([]);
        })
      );
  }    
}
