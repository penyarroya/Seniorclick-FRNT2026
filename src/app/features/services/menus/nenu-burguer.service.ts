import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MenuInitItem } from '../../models/menus/menuinit-item.model';
// import { MenuInitItem } from '../../models/menuinit-item.model';

@Injectable({
  providedIn: 'root',
})
export class NenuBurguerService {
//
   private menuUrl = '/menus/menuBurguer.json'; // JSON externo en /public/menus

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
