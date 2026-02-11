// import { Component, inject, OnInit, PLATFORM_ID, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
// import { Router, RouterModule, RouterOutlet } from '@angular/router';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
// import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
// import { MatListModule } from '@angular/material/list';
// import { signal } from '@angular/core';
// import { catchError, firstValueFrom, of } from 'rxjs';

// import { MenuInitService } from '../../services/menus/menu-init.service';
// import { MenuConfigService } from '../../services/menus/menu-config.service';
// import { BurgerMenuService } from '../../services/menus/burger-menu.service';
// import { AuthService } from '../../../core/services/auth/auth.service';
// import { InstitutionService } from '../../services/universilabs/institutions/institution.service';

// import { MenuInitItem } from '../../models/menus/menuinit-item.model';
// import { SubMenuItem } from '../../models/menus/submenuinit-Item-model';
// import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

// @Component({
//   selector: 'app-init-layout',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     MatToolbarModule,
//     MatButtonModule,
//     MatIconModule,
//     MatDividerModule,
//     MatMenuModule,
//     MatSidenavModule,
//     MatListModule,
//     RouterOutlet,
//     TruncatePipe
//   ],
//   templateUrl: './init-layout.component.html',
//   styleUrls: ['./init-layout.component.scss']
// })
// export class InitLayoutComponent implements OnInit, AfterViewInit {
// //
//   private institutionService = inject(InstitutionService);
//   private router = inject(Router);
//   private platformId = inject(PLATFORM_ID);
//   private menuInitService = inject(MenuInitService);
//   private menuConfigService = inject(MenuConfigService);
//   private burgerMenuService = inject(BurgerMenuService);
//   private authService = inject(AuthService);
//   private cdr = inject(ChangeDetectorRef);

//   public institutionName = signal<string>('SeniorClick');

//   public menuData = signal<MenuInitItem[]>([]);
//   public burguerMenuItems = signal<SubMenuItem[]>([]);
//   public configMenuItems = signal<SubMenuItem[]>([]);

//   @ViewChild('mobileMenuTrigger') mobileMenuTrigger!: MatMenuTrigger;
//   @ViewChild('drawer') drawer!: MatSidenav;

//   ngOnInit(): void {
//     this.loadInstitution();
//     this.loadMenu();
//     this.loadConfigMenu();
//     this.loadBurguerMenu();
//   }

//   ngAfterViewInit() {
//     if (this.drawer) {
//       this.drawer.closedStart.subscribe(() => {
//         this.burguerMenuItems().forEach(menu => menu.open = false);
//       });
//     }
//   }

//   private loadInstitution() {
//     this.institutionService.getCurrent().subscribe({
//       next: inst => inst?.name ? this.institutionName.set(inst.name) : null,
//       error: () => this.institutionName.set('SeniorClick')
//     });
//   }

//   private filterMenu(items: MenuInitItem[], userRoles: string[]): MenuInitItem[] {
//     return items
//       .map(menu => ({
//         ...menu,
//         items: menu.items?.filter(i => !i.roles || i.roles.some(r => userRoles.includes(r.toUpperCase()))) || [],
//         open: false
//       }))
//       .filter(menu => !menu.roles || menu.roles.some(r => userRoles.includes(r.toUpperCase())));
//   }

//   private mapMenuInitToSubMenu(items: MenuInitItem[]): SubMenuItem[] {
//     return items.map(item => ({
//       id: item.id || '',
//       label: item.label,
//       icon: item.icon || '',
//       divider: item.divider || false,
//       route: item.route,
//       action: item.action,
//       items: item.items?.length ? this.mapMenuInitToSubMenu(item.items) : undefined,
//       authRequired: item.authRequired,
//       roles: item.roles,
//       open: false
//     }));
//   }

//   // private async loadMenu() {
//   //   try {
//   //     const userRoles: string[] = (await firstValueFrom(
//   //       this.authService.getUserRoles().pipe(catchError(() => of([])))
//   //     )).map(r => r.toUpperCase());

//   //     const [mainMenuData, burgerMenuData, configMenuData] = await Promise.all([
//   //       firstValueFrom(this.menuInitService.getMenu().pipe(catchError(() => of([])))),
//   //       firstValueFrom(this.burgerMenuService.getMenu().pipe(catchError(() => of([])))),
//   //       firstValueFrom(this.menuConfigService.getConfigMenu().pipe(catchError(() => of([]))))
//   //     ]);

//   //     this.menuData.set(this.filterMenu(mainMenuData, userRoles));
//   //     this.burguerMenuItems.set(this.mapMenuInitToSubMenu(this.filterMenu(burgerMenuData, userRoles)));
//   //     this.configMenuItems.set(Array.isArray(configMenuData[0]?.submenu)
//   //       ? this.mapMenuInitToSubMenu(configMenuData[0].submenu)
//   //       : []);

//   //   } catch (err) {
//   //     console.error('Error cargando menús:', err);
//   //     this.menuData.set([]);
//   //     this.burguerMenuItems.set([]);
//   //     this.configMenuItems.set([]);
//   //   }
//   // }

//   private async loadMenu() {
//     try {
//       console.log('%c--- INICIO CARGA DE MENÚ ---', 'color: #2196F3; font-weight: bold;');

//       // 1. RECOGIDA: El servicio ya nos devuelve un string[] (gracias a su map interno)
//       const rolesRaw = await firstValueFrom(
//         this.authService.getUserRoles().pipe(
//           catchError((err) => {
//             console.error('Error obteniendo roles (HttpOnly):', err);
//             return of([]);
//           })
//         )
//       );

//       // 2. NORMALIZACIÓN: Aseguramos que no haya nulos y limpiamos espacios
//       const userRoles: string[] = (rolesRaw || []).map(r => r.toUpperCase().trim());

//       console.log('%cROLES RECOGIDOS DEL SISTEMA:', 'color: #4CAF50; font-weight: bold;', userRoles);

//       if (userRoles.length === 0) {
//         console.warn('OJO: No se recogió ningún rol. El menú podría filtrarse por completo.');
//       }

//       // 3. CARGA DE DATOS (Paralelo)
//       const [mainMenuData, burgerMenuData, configMenuData] = await Promise.all([
//         firstValueFrom(this.menuInitService.getMenu().pipe(catchError(() => of([])))),
//         firstValueFrom(this.burgerMenuService.getMenu().pipe(catchError(() => of([])))),
//         firstValueFrom(this.menuConfigService.getConfigMenu().pipe(catchError(() => of([]))))
//       ]);

//       // 4. FILTRADO Y APLICACIÓN
      
//       // Menú Principal
//       const filteredMain = this.filterMenu(mainMenuData, userRoles);
//       this.menuData.set(filteredMain);

//       // Menú de Configuración (Filtrado manual de su submenu)
//       let filteredConfig: SubMenuItem[] = [];
//       if (configMenuData.length > 0 && Array.isArray(configMenuData[0].submenu)) {
//         const configSubmenuFiltrado = configMenuData[0].submenu.filter(item => 
//           !item.roles || item.roles.length === 0 || 
//           item.roles.some(r => userRoles.includes(r.toUpperCase().trim()))
//         );
//         filteredConfig = this.mapMenuInitToSubMenu(configSubmenuFiltrado);
//       }
//       this.configMenuItems.set(filteredConfig);

//       // Menú Burger (Burger original filtrado + Configuración filtrada)
//       const filteredBurgerBase = this.mapMenuInitToSubMenu(this.filterMenu(burgerMenuData, userRoles));
//       this.burguerMenuItems.set([...filteredBurgerBase, ...filteredConfig]);

//       console.log('Filtro finalizado. Items principales:', filteredMain.length);

//       // 5. ACTUALIZACIÓN DE VISTA
//       this.cdr.detectChanges();
//       console.log('%c--- FIN CARGA DE MENÚ (ÉXITO) ---', 'color: #2196F3; font-weight: bold;');

//     } catch (err) {
//       console.error('Error crítico en loadMenu:', err);
//       this.menuData.set([]);
//       this.burguerMenuItems.set([]);
//       this.configMenuItems.set([]);
//     }
//   }

//   //
//   private async loadConfigMenu() {
//     try {
//       const userRoles: string[] = (await firstValueFrom(
//         this.authService.getUserRoles().pipe(catchError(() => of([])))
//       )).map(r => r.toUpperCase());

//       this.menuConfigService.getConfigMenu().subscribe({
//         next: data => {
//           if (data.length && Array.isArray(data[0].submenu)) {
//             const filteredItems = data[0].submenu.filter(
//               item => !item.roles || item.roles.some(r => userRoles.includes(r.toUpperCase()))
//             );
//             this.configMenuItems.set(this.mapMenuInitToSubMenu(filteredItems));
//           } else {
//             this.configMenuItems.set([]);
//           }
//         },
//         error: () => this.configMenuItems.set([])
//       });
//     } catch (err) {
//       console.error('Error cargando menú de configuración:', err);
//       this.configMenuItems.set([]);
//     }
//   }

//   private loadBurguerMenu() {
//     this.burgerMenuService.getMenu().subscribe({
//       next: burgerData => {
//         const mappedBurger = this.mapMenuInitToSubMenu(burgerData);
//         const mappedConfig = this.configMenuItems() || [];
//         this.burguerMenuItems.set([...mappedBurger, ...mappedConfig]);
//       },
//       error: () => {
//         this.burguerMenuItems.set(this.configMenuItems() || []);
//       }
//     });
//   }

//   navigate(routeOrItem?: string | MenuInitItem | SubMenuItem) {
//     if (!routeOrItem) return;

//     if (typeof routeOrItem === 'string') {
//       this.navigateWithReload(routeOrItem);
//     } else {
//       this.onMenuClick(routeOrItem);
//     }
//   }

//   //
//   onMenuClick(item: MenuInitItem | SubMenuItem) {
//   // 1. Normalizamos la acción para evitar errores de mayúsculas o espacios
//   const actionValue = item.action ? item.action.toLowerCase().trim() : '';
  
//   // ---------------------------------------------------------
//   // CASO A: LOGOUT (Prioridad Absoluta)
//   // ---------------------------------------------------------
//   if (actionValue === 'logout') {
//     // Bloqueo visual preventivo
//     this.closeMobileMenu();
//     this.closeMobileSidenav();
//     this.closeAllSubMenus();

//     // Ejecutamos el logout. 
//     // NOTA: El AuthService se encarga de poner isLoggingOut = true 
//     // lo cual activa el "escudo" en el Interceptor y Guards.
//     this.authService.logout().subscribe({
//       next: () => {
//         this.router.navigate(['/']);
//       },
//       error: (err) => {
//         console.warn('Servidor no respondió al logout, pero limpiamos localmente:', err);
//         this.router.navigate(['/']);
//       }
//     });
//     return; // Finalizamos ejecución
//   }

//   // ---------------------------------------------------------
//   // CASO B: ACCIONES DE INTERFAZ (Toggles)
//   // ---------------------------------------------------------
//   if (actionValue === 'toggledarkmode') {
//     this.toggleDarkMode();
//     this.closeAllSubMenus();
//     return;
//   }
  
//   if (actionValue === 'togglefeatures') {
//     this.toggleFeatures();
//     this.closeAllSubMenus();
//     return;
//   }

//   // ---------------------------------------------------------
//   // CASO C: NAVEGACIÓN (Rutas)
//   // ---------------------------------------------------------
//   // Determinamos si hay una ruta válida en 'route' o en 'action' (si empieza por /)
//   const targetRoute = item.route || (item.action?.startsWith('/') ? item.action : null);

//   if (targetRoute) {
//     // Evitamos navegar a mantenimiento si ya sabemos que no es necesario (opcional)
//     if (targetRoute === '/maintenance' && !this.router.url.includes('maintenance')) {
//        // lógica opcional aquí
//     }

//     this.navigateWithReload(targetRoute);
//     return;
//   }

//   // ---------------------------------------------------------
//   // CASO D: SUBMENÚS (Abrir/Cerrar)
//   // ---------------------------------------------------------
//   // Si llegamos aquí y no hay items hijos, cerramos todo.
//   if (!item.items || item.items.length === 0) {
//     this.closeAllSubMenus();
//   }
// }

//   //
//   private navigateWithReload(url: string) {
//     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
//       this.router.navigate([url], { replaceUrl: true });
//     });
//     this.closeAllSubMenus();
//     this.closeMobileMenu();
//     this.closeMobileSidenav();
//   }

//   toggleDarkMode() { if (isPlatformBrowser(this.platformId)) document.body.classList.toggle('dark-theme'); }
//   toggleFeatures() { }
//   //toggleHero() { }

//   openSubMenu(menu: MenuInitItem | SubMenuItem) { menu.open = true; }
//   closeSubMenu(menu: MenuInitItem | SubMenuItem) { menu.open = false; menu.items?.forEach(sub => sub.open = false); }

//   closeAllSubMenus() {
//     this.menuData().forEach(m => { m.open = false; m.items?.forEach(sub => sub.open = false); });
//     this.burguerMenuItems().forEach(m => { m.open = false; m.items?.forEach(sub => sub.open = false); });
//   }

//   toggleSubMenu(menu: MenuInitItem | SubMenuItem, siblings: (MenuInitItem | SubMenuItem)[]) {
//     siblings.forEach(item => { if (item !== menu) { item.open = false; item.items?.forEach(sub => sub.open = false); } });
//     menu.open = !menu.open;
//     if (!menu.open && menu.items?.length) menu.items.forEach(sub => sub.open = false);
//   }

//   onHamburgerClick(event: MouseEvent) {
//     event.stopPropagation();
//     this.closeAllSubMenus();
//     if (this.drawer) { this.drawer.toggle(); this.cdr.detectChanges(); }
//   }

//   closeMobileSidenav() { if (this.drawer?.opened) this.drawer.close(); }
//   closeMobileMenu() { if (this.mobileMenuTrigger?.menuOpen) this.mobileMenuTrigger.closeMenu(); }

//   @HostListener('window:resize', ['$event'])
//   onResize(event: Event) {
//     const width = (event.target as Window).innerWidth;
//     if (width > 768) { this.closeAllSubMenus(); this.closeMobileMenu(); if (this.drawer?.opened) this.drawer.close(); }
//   }

//   @HostListener('document:click', ['$event'])
//   closeSubmenusOnOutsideClick(event: Event) {
//     if (window.innerWidth > 768) return;
//     const clickedInsideMenu = (event.target as HTMLElement).closest('.mobile-horizontal-menu');
//     if (!clickedInsideMenu) this.menuData().forEach(menu => menu.open = false);
//   }

// }

// import { Component, inject, OnInit, PLATFORM_ID, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
// import { Router, RouterModule, RouterOutlet } from '@angular/router';
// import { CommonModule, isPlatformBrowser } from '@angular/common';
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
// import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
// import { MatListModule } from '@angular/material/list';
// import { signal } from '@angular/core';
// import { catchError, firstValueFrom, of } from 'rxjs';

// import { MenuInitService } from '../../services/menus/menu-init.service';
// import { MenuConfigService } from '../../services/menus/menu-config.service';
// import { BurgerMenuService } from '../../services/menus/burger-menu.service';
// import { AuthService } from '../../../core/services/auth/auth.service';
// import { InstitutionService } from '../../services/universilabs/institutions/institution.service';

// import { MenuInitItem } from '../../models/menus/menuinit-item.model';
// import { SubMenuItem } from '../../models/menus/submenuinit-Item-model';
// import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

// @Component({
//   selector: 'app-init-layout',
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     MatToolbarModule,
//     MatButtonModule,
//     MatIconModule,
//     MatDividerModule,
//     MatMenuModule,
//     MatSidenavModule,
//     MatListModule,
//     RouterOutlet,
//     TruncatePipe
//   ],
//   templateUrl: './init-layout.component.html',
//   styleUrls: ['./init-layout.component.scss']
// })
// export class InitLayoutComponent implements OnInit, AfterViewInit {
//   private institutionService = inject(InstitutionService);
//   private router = inject(Router);
//   private platformId = inject(PLATFORM_ID);
//   private menuInitService = inject(MenuInitService);
//   private menuConfigService = inject(MenuConfigService);
//   private burgerMenuService = inject(BurgerMenuService);
//   private authService = inject(AuthService);
//   private cdr = inject(ChangeDetectorRef);

//   public institutionName = signal<string>('SeniorClick');
//   public menuData = signal<MenuInitItem[]>([]);
//   public burguerMenuItems = signal<SubMenuItem[]>([]);
//   public configMenuItems = signal<SubMenuItem[]>([]);

//   @ViewChild('mobileMenuTrigger') mobileMenuTrigger!: MatMenuTrigger;
//   @ViewChild('drawer') drawer!: MatSidenav;

//   ngOnInit(): void {
//     this.loadInstitution();
//     // loadMenu ahora es la única función encargada de cargar TODOS los menús
//     this.loadMenu();
//   }

//   ngAfterViewInit() {
//     if (this.drawer) {
//       this.drawer.closedStart.subscribe(() => {
//         this.burguerMenuItems().forEach(menu => menu.open = false);
//       });
//     }
//   }

//   private loadInstitution() {
//     this.institutionService.getCurrent().subscribe({
//       next: inst => inst?.name ? this.institutionName.set(inst.name) : null,
//       error: () => this.institutionName.set('SeniorClick')
//     });
//   }

//   /**
//    * FILTRO DE MENÚ: Decide qué mostrar según los roles.
//    * Si es SUPER_ADMIN, tiene acceso total por defecto.
//    */
//   private filterMenu(items: MenuInitItem[], userRoles: string[]): MenuInitItem[] {
//     const isSuperAdmin = userRoles.includes('SUPER_ADMIN');

//     return items
//       .map(menu => ({
//         ...menu,
//         items: menu.items?.filter(i => {
//           if (!i.roles || i.roles.length === 0) return true;
//           return isSuperAdmin || i.roles.some(r => userRoles.includes(r.toUpperCase().trim()));
//         }) || [],
//         open: false
//       }))
//       .filter(menu => {
//         if (!menu.roles || menu.roles.length === 0) return true;
//         return isSuperAdmin || menu.roles.some(r => userRoles.includes(r.toUpperCase().trim()));
//       });
//   }

//   private mapMenuInitToSubMenu(items: MenuInitItem[]): SubMenuItem[] {
//     return items.map(item => ({
//       id: item.id || '',
//       label: item.label,
//       icon: item.icon || '',
//       divider: item.divider || false,
//       route: item.route,
//       action: item.action,
//       items: item.items?.length ? this.mapMenuInitToSubMenu(item.items) : undefined,
//       authRequired: item.authRequired,
//       roles: item.roles,
//       open: false
//     }));
//   }

//   /**
//    * CARGA CENTRALIZADA: Obtiene roles y menús de forma eficiente.
//    */
//   private async loadMenu() {
//     try {
//       console.log('%c--- INICIO CARGA DE MENÚ ---', 'color: #2196F3; font-weight: bold;');

//       // 1. RECOGIDA DE ROLES
//       const rolesRaw = await firstValueFrom(
//         this.authService.getUserRoles().pipe(catchError(() => of([])))
//       );
//       const userRoles: string[] = (rolesRaw || []).map(r => r.toUpperCase().trim());

//       console.log('%cROLES RECOGIDOS DEL SISTEMA:', 'color: #4CAF50; font-weight: bold;', userRoles);

//       // 2. CARGA DE DATOS EN PARALELO
//       const [mainMenuData, burgerMenuData, configMenuData] = await Promise.all([
//         firstValueFrom(this.menuInitService.getMenu().pipe(catchError(() => of([])))),
//         firstValueFrom(this.burgerMenuService.getMenu().pipe(catchError(() => of([])))),
//         firstValueFrom(this.menuConfigService.getConfigMenu().pipe(catchError(() => of([]))))
//       ]);

//       // 3. PROCESAMIENTO: Menú Principal
//       const filteredMain = this.filterMenu(mainMenuData, userRoles);
//       this.menuData.set(filteredMain);

//       // 4. PROCESAMIENTO: Menú Configuración
//       let configMapped: SubMenuItem[] = [];
//       if (configMenuData.length > 0 && Array.isArray(configMenuData[0].submenu)) {
//         const configSubFiltered = configMenuData[0].submenu.filter(item => 
//           !item.roles || item.roles.length === 0 || 
//           userRoles.includes('SUPER_ADMIN') || 
//           item.roles.some(r => userRoles.includes(r.toUpperCase().trim()))
//         );
//         configMapped = this.mapMenuInitToSubMenu(configSubFiltered);
//       }
//       this.configMenuItems.set(configMapped);

//       // 5. PROCESAMIENTO: Menú Burger (Combina Burger original + Config)
//       const burgerBaseFiltered = this.filterMenu(burgerMenuData, userRoles);
//       const mappedBurger = this.mapMenuInitToSubMenu(burgerBaseFiltered);
      
//       this.burguerMenuItems.set([...mappedBurger, ...configMapped]);

//       this.cdr.detectChanges();
//       console.log('%c--- FIN CARGA DE MENÚ (ÉXITO) ---', 'color: #2196F3; font-weight: bold;');

//     } catch (err) {
//       console.error('Error crítico en loadMenu:', err);
//       this.menuData.set([]);
//       this.burguerMenuItems.set([]);
//       this.configMenuItems.set([]);
//     }
//   }

//   // --- MÉTODOS DE NAVEGACIÓN Y ACCIONES ---

//   navigate(routeOrItem?: string | MenuInitItem | SubMenuItem) {
//     if (!routeOrItem) return;
//     if (typeof routeOrItem === 'string') {
//       this.navigateWithReload(routeOrItem);
//     } else {
//       this.onMenuClick(routeOrItem);
//     }
//   }

//   onMenuClick(item: MenuInitItem | SubMenuItem) {
//     const actionValue = item.action ? item.action.toLowerCase().trim() : '';
    
//     if (actionValue === 'logout') {
//       this.closeMobileMenu();
//       this.closeMobileSidenav();
//       this.closeAllSubMenus();
//       this.authService.logout().subscribe({
//         next: () => this.router.navigate(['/']),
//         error: () => this.router.navigate(['/'])
//       });
//       return;
//     }

//     if (actionValue === 'toggledarkmode') {
//       this.toggleDarkMode();
//       this.closeAllSubMenus();
//       return;
//     }
    
//     const targetRoute = item.route || (item.action?.startsWith('/') ? item.action : null);
//     if (targetRoute) {
//       this.navigateWithReload(targetRoute);
//       return;
//     }

//     if (!item.items || item.items.length === 0) {
//       this.closeAllSubMenus();
//     }
//   }

//   private navigateWithReload(url: string) {
//     this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
//       this.router.navigate([url], { replaceUrl: true });
//     });
//     this.closeAllSubMenus();
//     this.closeMobileMenu();
//     this.closeMobileSidenav();
//   }

//   toggleDarkMode() { 
//     if (isPlatformBrowser(this.platformId)) document.body.classList.toggle('dark-theme'); 
//   }

//   openSubMenu(menu: MenuInitItem | SubMenuItem) { menu.open = true; }
  
//   closeSubMenu(menu: MenuInitItem | SubMenuItem) { 
//     menu.open = false; 
//     menu.items?.forEach(sub => sub.open = false); 
//   }

//   closeAllSubMenus() {
//     this.menuData().forEach(m => { m.open = false; m.items?.forEach(sub => sub.open = false); });
//     this.burguerMenuItems().forEach(m => { m.open = false; m.items?.forEach(sub => sub.open = false); });
//   }

//   toggleSubMenu(menu: MenuInitItem | SubMenuItem, siblings: (MenuInitItem | SubMenuItem)[]) {
//     siblings.forEach(item => { if (item !== menu) { item.open = false; item.items?.forEach(sub => sub.open = false); } });
//     menu.open = !menu.open;
//     if (!menu.open && menu.items?.length) menu.items.forEach(sub => sub.open = false);
//   }

//   onHamburgerClick(event: MouseEvent) {
//     event.stopPropagation();
//     this.closeAllSubMenus();
//     if (this.drawer) { 
//       this.drawer.toggle(); 
//       this.cdr.detectChanges(); 
//     }
//   }

//   closeMobileSidenav() { if (this.drawer?.opened) this.drawer.close(); }
//   closeMobileMenu() { if (this.mobileMenuTrigger?.menuOpen) this.mobileMenuTrigger.closeMenu(); }

//   // @HostListener('window:resize', ['$event'])
//   // onResize(event: Event) {
//   //   const width = (event.target as Window).innerWidth;
//   //   if (width > 768) { 
//   //     this.closeAllSubMenus(); 
//   //     this.closeMobileMenu(); 
//   //     if (this.drawer?.opened) this.drawer.close(); 
//   //   }
//   // }

//   @HostListener('window:resize', ['$event'])
//   onResize(event: Event) {
//     const width = (event.target as Window).innerWidth;
//     if (width > 768) { 
//       this.closeAllSubMenus(); 
//       this.closeMobileMenu(); 
//       if (this.drawer?.opened) this.drawer.close(); 
//     }
//     // VITAL: Avisa a Angular que el tamaño cambió
//     this.cdr.markForCheck(); 
//   }

//   @HostListener('document:click', ['$event'])
//   closeSubmenusOnOutsideClick(event: Event) {
//     if (window.innerWidth > 768) return;
//     const clickedInsideMenu = (event.target as HTMLElement).closest('.mobile-horizontal-menu');
//     if (!clickedInsideMenu) this.menuData().forEach(menu => menu.open = false);
//   }
// }


import { 
  Component, inject, OnInit, PLATFORM_ID, HostListener, 
  ChangeDetectorRef, viewChild, signal, effect 
} from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule, isPlatformBrowser } from '@angular/common';

// Material Imports
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';

// RxJS
import { catchError, firstValueFrom, of } from 'rxjs';

// Services & Models
import { MenuInitService } from '../../services/menus/menu-init.service';
import { MenuConfigService } from '../../services/menus/menu-config.service';
import { BurgerMenuService } from '../../services/menus/burger-menu.service';
import { AuthService } from '../../../core/services/auth/auth.service';
import { InstitutionService } from '../../services/universilabs/institutions/institution.service';
import { MenuInitItem } from '../../models/menus/menuinit-item.model';
import { SubMenuItem } from '../../models/menus/submenuinit-Item-model';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';

@Component({
  selector: 'app-init-layout',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatToolbarModule, MatButtonModule,
    MatIconModule, MatDividerModule, MatMenuModule, MatSidenavModule,
    MatListModule, RouterOutlet, TruncatePipe
  ],
  templateUrl: './init-layout.component.html',
  styleUrls: ['./init-layout.component.scss']
})
export class InitLayoutComponent implements OnInit {
  // --- INJECTIONS ---
  private institutionService = inject(InstitutionService);
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private menuInitService = inject(MenuInitService);
  private menuConfigService = inject(MenuConfigService);
  private burgerMenuService = inject(BurgerMenuService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  // --- SIGNALS DE ESTADO ---
  public institutionName = signal<string>('SeniorClick');
  public menuData = signal<MenuInitItem[]>([]);
  public burguerMenuItems = signal<SubMenuItem[]>([]);
  public configMenuItems = signal<SubMenuItem[]>([]);

  // --- SIGNAL QUERIES ---
  readonly drawer = viewChild<MatSidenav>('drawer');
  readonly mobileMenuTrigger = viewChild<MatMenuTrigger>('mobileMenuTrigger');

  constructor() {
    /**
     * Reacciona al Sidenav: Cuando se cierra (por el backdrop o el botón),
     * reseteamos el estado 'open' de todos los items para la próxima vez.
     */
    effect(() => {
      const sidenav = this.drawer();
      if (sidenav) {
        sidenav.closedStart.subscribe(() => {
          this.closeAllSubMenus();
        });
      }
    });
  }

  ngOnInit(): void {
    this.loadInstitution();
    this.loadMenu();
  }

  // --- MÉTODOS DE CARGA ---

  private loadInstitution() {
    this.institutionService.getCurrent().subscribe({
      next: inst => inst?.name ? this.institutionName.set(inst.name) : null,
      error: () => this.institutionName.set('SeniorClick')
    });
  }

  private async loadMenu() {
    try {
      const rolesRaw = await firstValueFrom(this.authService.getUserRoles().pipe(catchError(() => of([]))));
      const userRoles = (rolesRaw || []).map(r => r.toUpperCase().trim());

      const [mainMenuData, burgerMenuData, configMenuData] = await Promise.all([
        firstValueFrom(this.menuInitService.getMenu().pipe(catchError(() => of([])))),
        firstValueFrom(this.burgerMenuService.getMenu().pipe(catchError(() => of([])))),
        firstValueFrom(this.menuConfigService.getConfigMenu().pipe(catchError(() => of([]))))
      ]);

      this.menuData.set(this.filterMenu(mainMenuData, userRoles));

      // Procesar menú configuración
      let configMapped: SubMenuItem[] = [];
      if (configMenuData.length > 0 && Array.isArray(configMenuData[0].submenu)) {
        const configSubFiltered = configMenuData[0].submenu.filter(item => 
          !item.roles?.length || 
          userRoles.includes('SUPER_ADMIN') || 
          item.roles.some(r => userRoles.includes(r.toUpperCase().trim()))
        );
        configMapped = this.mapMenuInitToSubMenu(configSubFiltered);
      }
      this.configMenuItems.set(configMapped);

      // Procesar menú Burger (Combina base + configuración para móvil)
      const mappedBurger = this.mapMenuInitToSubMenu(this.filterMenu(burgerMenuData, userRoles));
      this.burguerMenuItems.set([...mappedBurger, ...configMapped]);

      this.cdr.detectChanges();
    } catch (err) {
      console.error('Error loadMenu:', err);
    }
  }

  // --- LÓGICA DE FILTRADO Y MAPEO ---

  private filterMenu(items: MenuInitItem[], userRoles: string[]): MenuInitItem[] {
    const isSuperAdmin = userRoles.includes('SUPER_ADMIN');
    return items
      .map(menu => ({
        ...menu,
        items: menu.items?.filter(i => {
          if (!i.roles?.length) return true;
          return isSuperAdmin || i.roles.some(r => userRoles.includes(r.toUpperCase().trim()));
        }) || [],
        open: false
      }))
      .filter(menu => {
        if (!menu.roles?.length) return true;
        return isSuperAdmin || menu.roles.some(r => userRoles.includes(r.toUpperCase().trim()));
      });
  }

  private mapMenuInitToSubMenu(items: MenuInitItem[] | SubMenuItem[]): SubMenuItem[] {
    return items.map(item => ({
      ...item,
      id: item.id || '',
      icon: item.icon || '',
      divider: item.divider || false,
      items: item.items?.length ? this.mapMenuInitToSubMenu(item.items) : undefined,
      open: false
    })) as SubMenuItem[];
  }

  // --- INTERACCIÓN Y NAVEGACIÓN ---

  /**
   * Método centralizado para el HTML: decide si expandir o navegar
   */
  handleMenuAction(item: any, siblings: any[], event?: Event) {
    if (event) event.stopPropagation();

    if (item.items && item.items.length > 0) {
      this.toggleSubMenu(item, siblings);
    } else {
      this.onMenuClick(item);
    }
  }

  toggleSubMenu(item: any, siblings: any[]) {
    // Cerramos los hermanos y sus hijos recursivamente
    siblings.forEach(s => {
      if (s !== item) {
        s.open = false;
        if (s.items) this.resetRecursive(s.items);
      }
    });
    // Switch de apertura
    item.open = !item.open;
    // Si cerramos el padre, reseteamos a los hijos
    if (!item.open && item.items) this.resetRecursive(item.items);
  }

  onMenuClick(item: any) {
    const actionValue = item.action?.toLowerCase().trim() || '';
    
    if (actionValue === 'logout') {
      this.closeAllNavigation();
      this.authService.logout().subscribe(() => this.router.navigate(['/']));
      return;
    }

    if (actionValue === 'toggledarkmode') {
      if (isPlatformBrowser(this.platformId)) document.body.classList.toggle('dark-theme');
      return;
    }
    
    const targetRoute = item.route || (item.action?.startsWith('/') ? item.action : null);
    if (targetRoute) {
      this.navigateWithReload(targetRoute);
    }
  }

  private navigateWithReload(url: string) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([url], { replaceUrl: true });
    });
    this.closeAllNavigation();
  }

  onHamburgerClick(event: MouseEvent) {
    event.stopPropagation();
    this.drawer()?.toggle();
  }

  // --- LIMPIEZA Y RESETS ---

  private closeAllNavigation() {
    this.closeAllSubMenus();
    this.drawer()?.close();
    this.mobileMenuTrigger()?.closeMenu();
  }

  closeAllSubMenus() {
    this.menuData.update(items => { this.resetRecursive(items); return [...items]; });
    this.burguerMenuItems.update(items => { this.resetRecursive(items); return [...items]; });
  }

  private resetRecursive(items: any[]) {
    items.forEach(i => {
      i.open = false;
      if (i.items) this.resetRecursive(i.items);
    });
  }

  // Soporte para Hover en Desktop
  openSubMenu(menu: any) { if (window.innerWidth > 768) menu.open = true; }
  closeSubMenu(menu: any) { if (window.innerWidth > 768) menu.open = false; }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    if (event.target.innerWidth > 768) { 
      this.closeAllNavigation();
    }
    this.cdr.markForCheck();
  }
}