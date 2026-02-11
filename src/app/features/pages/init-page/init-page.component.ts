// import { Component, inject, OnInit, PLATFORM_ID, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
// import { Router } from '@angular/router';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
// import { MatCardModule } from '@angular/material/card';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
// import { MatListModule } from '@angular/material/list';

// import { signal } from '@angular/core';
// import { MenuInitService } from '../../services/menus/menu-init.service';
// import { MenuConfigService } from '../../services/menus/menu-config.service';
// import { MenuInitItem } from '../../models/menuinit-item.model';
// import { NenuBurguerService } from '../../services/menus/nenu-burguer.service';
// import { AuthService } from '../../../core/services/auth/auth.service';
// import { catchError, firstValueFrom, of } from 'rxjs';
// import { SubMenuItem } from '../../models/submenuinit-Item-model';

// @Component({
//   selector: 'app-init-page',
//   standalone: true,
//   imports: [
//     CommonModule,
//     MatToolbarModule,
//     MatButtonModule,
//     MatIconModule,
//     MatDividerModule,
//     MatMenuModule,
//     MatCardModule,
//     MatTooltipModule,
//     MatSidenavModule,
//     MatListModule
//   ],
//   templateUrl: './init-page.component.html',
//   styleUrls: ['./init-page.component.scss']
// })
// export class InitPageComponent implements OnInit, AfterViewInit {

//   private router = inject(Router);
//   private platformId = inject(PLATFORM_ID);
//   private menuInitService = inject(MenuInitService);
//   private menuConfigService = inject(MenuConfigService);
//   private menuBurguerService = inject(NenuBurguerService);
//   private authService = inject(AuthService);

//   public institutionName = signal<string>('SeniorClick');
//   public showHero = signal(true);
//   public showFeatures = signal(true);

//   public menuData = signal<MenuInitItem[]>([]);
//   public configMenuItems = signal<MenuInitItem[]>([]);
//   public burguerMenuItems = signal<MenuInitItem[]>([]); // Nueva señal para menú Burger

//   @ViewChild('mobileMenuTrigger') mobileMenuTrigger!: MatMenuTrigger;
//   @ViewChild('drawer') drawer!: MatSidenav;
//   // cdr: any;
//   private cdr = inject(ChangeDetectorRef);

//   ngOnInit(): void {
//     this.loadMenu();
//     this.loadConfigMenu();
//     this.loadBurguerMenu(); // Cargar menú Burger
//   }

//   ngAfterViewInit() {
//     // Cerrar submenús Burger al cerrar el sidenav
//     this.drawer.closedStart.subscribe(() => {
//       this.burguerMenuItems().forEach(menu => menu.open = false);
//     });
//   }

//   // private async loadMenu() {
//   //   try {
//   //     // 1️⃣ Obtener roles del usuario y normalizarlos a mayúsculas
//   //     const userRoles: string[] = (await firstValueFrom(
//   //       this.authService.getUserRoles().pipe(catchError(() => of([])))
//   //     )).map(r => r.toUpperCase());

//   //     // 2️⃣ Cargar los tres menús en paralelo
//   //     const [mainMenuData, burgerMenuData, configMenuData] = await Promise.all([
//   //       firstValueFrom(this.menuInitService.getMenu().pipe(catchError(() => of([])))),
//   //       firstValueFrom(this.menuBurguerService.getMenu().pipe(catchError(() => of([])))),
//   //       firstValueFrom(this.menuConfigService.getConfigMenu().pipe(catchError(() => of([]))))
//   //     ]);

//   //     // 3️⃣ Función auxiliar para filtrar menús según roles
//   //     const filterMenu = (menus: MenuInitItem[]): MenuInitItem[] => {
//   //       return menus
//   //         .map(menu => ({
//   //           ...menu,
//   //           open: false,
//   //           items: menu.items?.filter(item =>
//   //             !item.roles || item.roles.some(r => userRoles.includes(r.toUpperCase()))
//   //           ) || [],
//   //         }))
//   //         .filter(menu => !menu.roles || menu.roles.some(r => userRoles.includes(r.toUpperCase())));
//   //     };

//   //     // 4️⃣ Asignar los menús filtrados a las señales
//   //     this.menuData.set(filterMenu(mainMenuData).filter(m => m.label !== 'Configuración'));
//   //     this.burguerMenuItems.set(filterMenu(burgerMenuData));
//   //     this.configMenuItems.set(
//   //       Array.isArray(configMenuData[0]?.submenu)
//   //         ? filterMenu(configMenuData[0].submenu)
//   //         : []
//   //     );

//   //   } catch (err) {
//   //     console.error('Error cargando menús:', err);
//   //     this.menuData.set([]);
//   //     this.burguerMenuItems.set([]);
//   //     this.configMenuItems.set([]);
//   //   }
//   // }

//   private async loadMenu() {
//     try {
//       // 1️⃣ Obtener roles del usuario en mayúsculas
//       const userRoles: string[] = (await firstValueFrom(
//         this.authService.getUserRoles().pipe(catchError(() => of([])))
//       )).map(r => r.toUpperCase());

//       // 2️⃣ Cargar menús en paralelo
//       const [mainMenuData, burgerMenuData, configMenuData] = await Promise.all([
//         firstValueFrom(this.menuInitService.getMenu().pipe(catchError(() => of([])))),
//         firstValueFrom(this.menuBurguerService.getMenu().pipe(catchError(() => of([])))),
//         firstValueFrom(this.menuConfigService.getConfigMenu().pipe(catchError(() => of([]))))
//       ]);

//       // 3️⃣ Filtrar menús según roles
//       const filterMenu = (menus: MenuInitItem[]): MenuInitItem[] => {
//         return menus
//           .map(menu => ({
//             ...menu,
//             items: menu.items?.filter(item =>
//               !item.roles || item.roles.some(r => userRoles.includes(r.toUpperCase()))
//             ) || [],
//           }))
//           .filter(menu => !menu.roles || menu.roles.some(r => userRoles.includes(r.toUpperCase())));
//       };

//       // 4️⃣ Función recursiva: MenuInitItem -> SubMenuItem
//       const mapMenuInitToSubMenu = (items: MenuInitItem[]): SubMenuItem[] => {
//         return items.map(item => {
//           const subItems: SubMenuItem[] = item.items ? mapMenuInitToSubMenu(item.items) : [];
//           return {
//             id: item.id || '',                  // obligatorio
//             label: item.label,
//             icon: item.icon || '',              // obligatorio
//             divider: item.divider || false,
//             route: item.route,
//             action: item.action,
//             items: subItems.length ? subItems : undefined, // undefined si no hay subItems
//             authRequired: item.authRequired,
//             roles: item.roles,
//             open: false,                        // estado inicial cerrado
//           };
//         });
//       };

//       // 5️⃣ Asignar menús filtrados a señales
//       this.menuData.set(
//         filterMenu(mainMenuData).map(menu => ({
//           ...menu,
//           items: menu.items?.length ? mapMenuInitToSubMenu(menu.items) : undefined
//         }))
//       );

//       this.burguerMenuItems.set(
//         filterMenu(burgerMenuData).map(menu => ({
//           ...menu,
//           items: menu.items?.length ? mapMenuInitToSubMenu(menu.items) : undefined
//         }))
//       );

//       this.configMenuItems.set(
//         Array.isArray(configMenuData[0]?.submenu)
//           ? mapMenuInitToSubMenu(configMenuData[0].submenu)
//           : []
//       );

//     } catch (err) {
//       console.error('Error cargando menús:', err);
//       this.menuData.set([]);
//       this.burguerMenuItems.set([]);
//       this.configMenuItems.set([]);
//     }
//   }


//   private loadConfigMenu() {
//     this.menuConfigService.getConfigMenu().subscribe({
//       next: (data) => {
//         if (data.length > 0 && Array.isArray(data[0].submenu)) {
//           this.configMenuItems.set(data[0].submenu);
//         } else {
//           this.configMenuItems.set([]);
//         }
//       },
//       error: err => {
//         console.error('Error cargando menú de configuración:', err);
//         this.configMenuItems.set([]);
//       }
//     });
//   }

//   // ===============================
//   // Cargar menú Burger desde JSON
//   // ===============================
//   private loadBurguerMenu() {
//     this.menuBurguerService.getMenu().subscribe({
//       next: (data) => {
//         const menuConFlags = data.map(menu => ({ ...menu, open: false }));
//         this.burguerMenuItems.set(menuConFlags);
//       },
//       error: err => {
//         console.error('Error cargando menú Burger:', err);
//         this.burguerMenuItems.set([]);
//       }
//     });
//   }

//   // ===============================
//   // Navegación
//   // ===============================
//   navigate(route?: string) {
//     if (route) this.router.navigate([route]);
//     this.closeAllSubMenus();
//     this.closeMobileMenu();
//     this.closeMobileSidenav();
//   }

//   // onMenuClick(item: MenuInitItem) {
//   //   if (item.route) {
//   //     this.router.navigate([item.route]);
//   //     return;
//   //   }
//   //   if (item.action) {
//   //     switch (item.action) {
//   //       case 'toggleDarkMode': this.toggleDarkMode(); break;
//   //       case 'toggleFeatures': this.toggleFeatures(); break;
//   //       case 'toggleHero': this.toggleHero(); break;
//   //       case 'logout': 
//   //         this.authService.logout();         // Llama a logout
//   //         this.router.navigate(['/auth/login']); // Redirige a login
//   //       break;
//   //     }
//   //   }
//   // }

//   // En InitPageComponent (Modificado)
//   // En InitPageComponent (Modificado)
// onMenuClick(item: MenuInitItem) {
//     if (item.route) {
//       // 1. Manejo de ruta normal: se cierra el sidenav en navigate()
//       this.router.navigate([item.route]);
//       this.closeMobileSidenav(); // Agregamos el cierre del sidenav aquí
//       return;
//     }
    
//     if (item.action) {
//       switch (item.action) {
//         case 'toggleDarkMode': this.toggleDarkMode(); break;
//         case 'toggleFeatures': this.toggleFeatures(); break;
//         case 'toggleHero': this.toggleHero(); break;
        
//         case 'logout': 
//           // 1. Cierra el MatMenu de configuración (si está abierto)
//           this.closeMobileMenu(); 
//           // 2. Llama a logout y espera la respuesta asíncrona
//           this.authService.logout().subscribe({
//             next: () => {
//               // 3. Redirecciona SOLO después del éxito
//               this.router.navigate(['/auth/login']); 
//               // 4. Cierra el MatSidenav (Menú Burger)
//               this.closeMobileSidenav(); 
//             },
//             error: (err) => {
//               console.error('Error al cerrar sesión:', err);
//               // Aunque falle el servidor, si el cliente estaba logueado, lo forzamos al login
//               this.router.navigate(['/auth/login']);
//               this.closeMobileSidenav();
//             }
//           });
//         break;
//       }
//     }
// }

//   // ===============================
//   // UI Actions
//   // ===============================
//   toggleHero() { this.showHero.update(v => !v); }
//   toggleFeatures() { this.showFeatures.update(v => !v); }
//   toggleDarkMode() {
//     if (isPlatformBrowser(this.platformId)) {
//       document.body.classList.toggle('dark-theme');
//     }
//   }

//   // ===============================
//   // Submenus
//   // ===============================
//   openSubMenu(menu: MenuInitItem) { menu.open = true; }
//   closeSubMenu(menu: MenuInitItem) { menu.open = false; }
//   closeAllSubMenus() {
//     this.menuData().forEach(menu => menu.open = false);
//     this.burguerMenuItems().forEach(menu => menu.open = false); // Incluir menú Burger
//   }

//   // toggleSubMenu(menu: MenuInitItem) {
//   //   this.menuData().forEach(m => { if (m !== menu) m.open = false; });
//   //   this.burguerMenuItems().forEach(m => { if (m !== menu) m.open = false; });
//   //   menu.open = !menu.open;
//   // }

//   toggleSubMenu(menu: MenuInitItem | SubMenuItem) {
//     const closeOthers = (items: (MenuInitItem | SubMenuItem)[], except?: MenuInitItem | SubMenuItem) => {
//       items.forEach(i => {
//         if (i !== except) i.open = false;
//         if (i.items?.length) closeOthers(i.items, except); // recursivo para subniveles
//       });
//     };

//     // Cierra todos los menús de primer y segundo nivel
//     closeOthers(this.menuData());
//     closeOthers(this.burguerMenuItems());

//     // Alterna el estado del menú seleccionado
//     menu.open = !menu.open;
//   }

//   // ===============================
//   // Toggle menú Burger (abrir/cerrar)
//   // ===============================
//   onHamburgerClick(event: MouseEvent) {
//     event.stopPropagation();
//     this.closeAllSubMenus();

//     if (this.drawer) {
//       this.drawer.toggle(); // Alterna entre abierto y cerrado
//       if (this.cdr) this.cdr.detectChanges();
//     }
//   }

//   onSettingsMenuClosed() { }

//   closeMobileSidenav() {
//     if (this.drawer?.opened) this.drawer.close();
//   }

//   closeMobileMenu() {
//     if (this.mobileMenuTrigger && this.mobileMenuTrigger.menuOpen) this.mobileMenuTrigger.closeMenu();
//   }

//   // ===============================
//   // Detectar cambio de tamaño de pantalla
//   // ===============================
//   @HostListener('window:resize', ['$event'])
//   onResize(event: Event) {
//     const width = (event.target as Window).innerWidth;
//     if (width > 768) {
//       this.closeAllSubMenus();
//       this.closeMobileMenu();
//       if (this.drawer && this.drawer.opened) this.drawer.close();
//     }
//   }

//   @HostListener('document:click', ['$event'])
//   closeSubmenusOnOutsideClick(event: Event) {
//     if (window.innerWidth > 768) return;
//     const clickedInsideMenu = (event.target as HTMLElement).closest('.mobile-horizontal-menu');
//     if (!clickedInsideMenu) this.menuData().forEach(menu => menu.open = false);
//   }

//   // ===============================
//   // Demo content (features / stats)
//   // ===============================
//   public features = [
//     { icon: 'school', title: 'Aprende', desc: 'Contenido educativo diseñado para ti.' },
//     { icon: 'group', title: 'Comparte', desc: 'Conéctate con otros usuarios.' },
//     { icon: 'accessibility', title: 'Accesible', desc: 'Interfaz simple, segura y cómoda.' },
//   ];

//   public stats = [
//     { value: '1.200+', label: 'Usuarios activos' },
//     { value: '450+', label: 'Cursos disponibles' },
//     { value: '99%', label: 'Satisfacción' }
//   ];
// }


import { Component, inject, OnInit, PLATFORM_ID, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

import { signal } from '@angular/core';
import { MenuInitService } from '../../services/menus/menu-init.service';
import { MenuConfigService } from '../../services/menus/menu-config.service';
import { NenuBurguerService } from '../../services/menus/nenu-burguer.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { catchError, firstValueFrom, of } from 'rxjs';
import { MenuInitItem } from '../../models/menus/menuinit-item.model';
import { SubMenuItem } from '../../models/menus/submenuinit-Item-model';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { InstitutionService } from '../../services/universilabs/institutions/institution.service';

@Component({
  selector: 'app-init-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatMenuModule,
    MatCardModule,
    MatTooltipModule,
    MatSidenavModule,
    MatListModule,
    TruncatePipe,
    RouterOutlet
],
  templateUrl: './init-page.component.html',
  styleUrls: ['./init-page.component.scss']
})
export class InitPageComponent implements OnInit, AfterViewInit {
//
  private institutionService = inject(InstitutionService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private menuInitService = inject(MenuInitService);
  private menuConfigService = inject(MenuConfigService);
  private menuBurguerService = inject(NenuBurguerService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  public institutionName = signal<string>('SeniorClick');
  public showHero = signal(true);
  public showFeatures = signal(true);

  public menuData = signal<MenuInitItem[]>([]);
  public configMenuItems = signal<MenuInitItem[]>([]);
  public burguerMenuItems = signal<MenuInitItem[]>([]);

  @ViewChild('mobileMenuTrigger') mobileMenuTrigger!: MatMenuTrigger;
  @ViewChild('drawer') drawer!: MatSidenav;

  ngOnInit(): void {
    this.loadInstitution();
    this.loadMenu();
    this.loadConfigMenu();
    this.loadBurguerMenu();
  }

  ngAfterViewInit() {
    this.drawer.closedStart.subscribe(() => {
      this.burguerMenuItems().forEach(menu => menu.open = false);
    });
  }

  private async loadMenu() {
    try {
      const userRoles: string[] = (await firstValueFrom(
        this.authService.getUserRoles().pipe(catchError(() => of([])))
      )).map(r => r.toUpperCase());

      const [mainMenuData, burgerMenuData, configMenuData] = await Promise.all([
        firstValueFrom(this.menuInitService.getMenu().pipe(catchError(() => of([])))),
        firstValueFrom(this.menuBurguerService.getMenu().pipe(catchError(() => of([])))),
        firstValueFrom(this.menuConfigService.getConfigMenu().pipe(catchError(() => of([]))))
      ]);

      const filterMenu = (menus: MenuInitItem[]): MenuInitItem[] => {
        return menus
          .map(menu => ({
            ...menu,
            items: menu.items?.filter(item =>
              !item.roles || item.roles.some(r => userRoles.includes(r.toUpperCase()))
            ) || [],
          }))
          .filter(menu => !menu.roles || menu.roles.some(r => userRoles.includes(r.toUpperCase())));
      };

      const mapMenuInitToSubMenu = (items: MenuInitItem[]): SubMenuItem[] => {
        return items.map(item => {
          const subItems: SubMenuItem[] = item.items ? mapMenuInitToSubMenu(item.items) : [];
          return {
            id: item.id || '',
            label: item.label,
            icon: item.icon ?? '',
            divider: item.divider || false,
            route: item.route,
            action: item.action,
            items: subItems.length ? subItems : [],
            authRequired: item.authRequired,
            roles: item.roles,
            open: false,
          };
        });
      };

      this.menuData.set(
        filterMenu(mainMenuData).map(menu => ({
          ...menu,
          items: menu.items?.length ? mapMenuInitToSubMenu(menu.items) : []
        }))
      );

      this.burguerMenuItems.set(
        filterMenu(burgerMenuData).map(menu => ({
          ...menu,
          items: menu.items?.length ? mapMenuInitToSubMenu(menu.items) : []
        }))
      );

      this.configMenuItems.set(
        Array.isArray(configMenuData[0]?.submenu)
          ? mapMenuInitToSubMenu(configMenuData[0].submenu)
          : []
      );

    } catch (err) {
      console.error('Error cargando menús:', err);
      this.menuData.set([]);
      this.burguerMenuItems.set([]);
      this.configMenuItems.set([]);
    }
  }

  private loadConfigMenu() {
    this.menuConfigService.getConfigMenu().subscribe({
      next: (data) => {
        if (data.length > 0 && Array.isArray(data[0].submenu)) {

          const mapToSubMenu = (items: any[]): SubMenuItem[] => {
            return items.map(item => ({
              id: item.id || '',
              label: item.label,
              icon: item.icon ?? '',
              divider: item.divider || false,
              route: item.route,
              action: item.action,
              items: item.items?.length ? mapToSubMenu(item.items) : undefined,
              authRequired: item.authRequired,
              roles: item.roles,
              open: false
            }));
          };

          const submenu: SubMenuItem[] = mapToSubMenu(data[0].submenu);
          this.configMenuItems.set(submenu);

        } else {
          this.configMenuItems.set([]);
        }
      },
      error: err => {
        console.error('Error cargando menú de configuración:', err);
        this.configMenuItems.set([]);
      }
    });
  }

  private loadBurguerMenu() {
    this.menuBurguerService.getMenu().subscribe({
      next: (data) => {
        const menuConFlags = data.map(menu => ({ ...menu, open: false }));
        this.burguerMenuItems.set(menuConFlags);
      },
      error: err => {
        console.error('Error cargando menú Burger:', err);
        this.burguerMenuItems.set([]);
      }
    });
  }

  //
  private loadInstitution() {
    this.institutionService.getCurrent().subscribe({
      next: (inst) => {
        if (inst?.name) {
          this.institutionName.set(inst.name);
        }
      },
      error: (err) => {
        console.error('Error cargando institución:', err);
        this.institutionName.set('SeniorClick');
      }
    });
  }

  navigate(route?: string) {
    if (route) this.router.navigate([route]);
    this.closeAllSubMenus();
    this.closeMobileMenu();
    this.closeMobileSidenav();
  }

  // 🔹 Cambiado para cerrar menús al seleccionar
  onMenuClick(item: MenuInitItem | SubMenuItem) {
    if (item.route) {
      this.router.navigate([item.route]);
      this.closeAllSubMenus();
      this.closeMobileMenu();
      this.closeMobileSidenav();
      return;
    }

    if (item.action) {
      switch (item.action) {
        case 'toggleDarkMode': this.toggleDarkMode(); break;
        case 'toggleFeatures': this.toggleFeatures(); break;
        case 'toggleHero': this.toggleHero(); break;
        case 'logout': 
          this.closeMobileMenu();
          this.authService.logout().subscribe({
            next: () => {
              this.router.navigate(['/auth/login']);
              this.closeAllSubMenus();
              this.closeMobileSidenav();
            },
            error: () => {
              this.router.navigate(['/auth/login']);
              this.closeAllSubMenus();
              this.closeMobileSidenav();
            }
          });
        break;
      }
    }

    if (!item.items?.length) {
      this.closeAllSubMenus();
    }
  }

  toggleHero() { this.showHero.update(v => !v); }
  toggleFeatures() { this.showFeatures.update(v => !v); }
  toggleDarkMode() {
    if (isPlatformBrowser(this.platformId)) {
      document.body.classList.toggle('dark-theme');
    }
  }

  openSubMenu(menu: MenuInitItem | SubMenuItem) { menu.open = true; }
  
  // 🔹 cerrar sub-items al cerrar un menú padre
  closeSubMenu(menu: MenuInitItem | SubMenuItem) {
    menu.open = false;
    menu.items?.forEach(sub => sub.open = false);
  }

  closeAllSubMenus() {
    this.menuData().forEach(menu => menu.open = false);
    this.menuData().forEach(menu => menu.items?.forEach(sub => sub.open = false));
    this.burguerMenuItems().forEach(menu => menu.open = false);
    this.burguerMenuItems().forEach(menu => menu.items?.forEach(sub => sub.open = false));
  }

  toggleSubMenu(menu: MenuInitItem | SubMenuItem, siblings: (MenuInitItem | SubMenuItem)[]) {
    siblings.forEach(item => {
      if (item !== menu) {
        item.open = false;
        item.items?.forEach(sub => sub.open = false);
      }
    });

    menu.open = !menu.open;

    if (!menu.open && menu.items?.length) {
      menu.items.forEach(sub => sub.open = false);
    }
  }

  onHamburgerClick(event: MouseEvent) {
    event.stopPropagation();
    this.closeAllSubMenus();
    if (this.drawer) {
      this.drawer.toggle();
      if (this.cdr) this.cdr.detectChanges();
    }
  }

  onSettingsMenuClosed() { }

  closeMobileSidenav() {
    if (this.drawer?.opened) this.drawer.close();
  }

  closeMobileMenu() {
    if (this.mobileMenuTrigger && this.mobileMenuTrigger.menuOpen) this.mobileMenuTrigger.closeMenu();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    if (width > 768) {
      this.closeAllSubMenus();
      this.closeMobileMenu();
      if (this.drawer && this.drawer.opened) this.drawer.close();
    }
  }

  @HostListener('document:click', ['$event'])
  closeSubmenusOnOutsideClick(event: Event) {
    if (window.innerWidth > 768) return;
    const clickedInsideMenu = (event.target as HTMLElement).closest('.mobile-horizontal-menu');
    if (!clickedInsideMenu) this.menuData().forEach(menu => menu.open = false);
  }

  public features = [
    { icon: 'school', title: 'Aprende', desc: 'Contenido educativo diseñado para ti.' },
    { icon: 'group', title: 'Comparte', desc: 'Conéctate con otros usuarios.' },
    { icon: 'accessibility', title: 'Accesible', desc: 'Interfaz simple, segura y cómoda.' },
  ];

  public stats = [
    { value: '1.200+', label: 'Usuarios activos' },
    { value: '450+', label: 'Cursos disponibles' },
    { value: '99%', label: 'Satisfacción' }
  ];
}
