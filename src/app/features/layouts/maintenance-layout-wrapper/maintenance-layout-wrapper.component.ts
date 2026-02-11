import { Component, OnInit, signal } from '@angular/core';
import { Router, ActivatedRoute, RouterOutlet } from '@angular/router';
import { MenuItem } from '../../services/menus/menu-manten.service';
import { MenuLoaderService } from '../../services/menus/menu-loader.service';
import { BreakpointObserver, Breakpoints, LayoutModule } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-maintenance-layout-wrapper',
  standalone: true,
  templateUrl: './maintenance-layout-wrapper.component.html',
  styleUrls: ['./maintenance-layout-wrapper.component.scss'],
  imports: [RouterOutlet, CommonModule, LayoutModule]
})
export class MaintenanceLayoutWrapperComponent implements OnInit {
//
  readonly menu = signal<MenuItem[]>([]);
  readonly sidebarOpen = signal(true); // sidebar visible al iniciar
  readonly isHandset = signal(false);

  constructor(
    private menuLoader: MenuLoaderService,  // Ahora usamos MenuLoaderService
    private router: Router,
    private route: ActivatedRoute,
    private breakpointObserver: BreakpointObserver
  ) {}

  ngOnInit() {
    // Detectar dispositivos móviles
    this.breakpointObserver.observe(Breakpoints.Handset).pipe(
      map(result => result.matches),
      shareReplay()
    ).subscribe(isMobile => {
      this.isHandset.set(isMobile);
      if (isMobile) this.sidebarOpen.set(false);
    });

    // Cargar menú filtrado por roles
    this.menuLoader.getMenu().subscribe(menu => {
      const initialized = menu.map(item => this.initMenuItem(item));
      this.markActive(initialized, this.router.url);
      this.menu.set(initialized);
    });
  }

  /** Inicializa cada item de menú y todos sus sub-items recursivamente */
  private initMenuItem(item: MenuItem): MenuItem {
    return {
      ...item,
      open: item.open ?? false,
      active: false,
      items: item.items?.map(sub => this.initMenuItem(sub)) // recursivo
    };
  }

  /** Toggle del sidebar */
  toggleSidebar() {
    this.sidebarOpen.set(!this.sidebarOpen());
  }

  /** Click sobre un item del menú */
  // onMenuClick(item: MenuItem, event: Event) {
  //   event.stopPropagation();

  //   if (item.items?.length) {
  //     item.open = !item.open;
  //     this.menu.update(menu => [...menu]);
  //   } else if (item.route) {
  //     this.router.navigate([item.route], { relativeTo: this.route }).then(() => {
  //       this.markActive(this.menu(), item.route!);
  //       if (this.isHandset()) this.sidebarOpen.set(false);
  //     });
  //   }
  // }

  onMenuClick(item: MenuItem, event: Event) {
    event.stopPropagation();

    if (item.items?.length) {
      // Si el item que clickeamos NO está abierto, cerramos todos los demás
      if (!item.open) {
        this.closeOtherMenus(this.menu(), item);
      }
      
      // Cambiamos el estado del actual
      item.open = !item.open;
      
      // Forzamos la actualización del signal
      this.menu.update(menu => [...menu]);
      
    } else if (item.route) {
      this.router.navigate([item.route], { relativeTo: this.route }).then(() => {
        this.markActive(this.menu(), item.route!);
        if (this.isHandset()) this.sidebarOpen.set(false);
      });
    }
  }

  /** Función auxiliar para cerrar otros menús abiertos del mismo nivel */
  private closeOtherMenus(items: MenuItem[], selectedItem: MenuItem) {
    items.forEach(item => {
      if (item !== selectedItem) {
        item.open = false;
        // Si quieres que también se cierren los submenús internos:
        if (item.items?.length) {
          this.closeOtherMenus(item.items, selectedItem);
        }
      }
    });
  }

  /** Marca el item activo según la URL, recursivamente */
  private markActive(items: MenuItem[], url: string) {
    items.forEach(item => {
      item.active = item.route === url;
      if (item.items?.length) {
        this.markActive(item.items, url);
        if (item.items.some(sub => sub.active)) item.open = true;
      }
    });
  }
}
