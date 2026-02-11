import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MenuConfig } from '../../models/menus/menu-config.model';
// import { MenuConfig } from '../../models/menu-config.model';

@Injectable({
  providedIn: 'root'
})
export class MenuConfigService {
//
  // private configMenuUrl = '/menu_setting.json'; // JSON externo en /assets
  private configMenuUrl = '/menus/menu_setting.json';


  constructor(private http: HttpClient) {}

  getConfigMenu(): Observable<MenuConfig[]> {
    return this.http.get<MenuConfig[]>(this.configMenuUrl);
  }  
}
