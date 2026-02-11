// import { Component, OnInit, inject, effect, signal } from '@angular/core';
// import { CommonModule, Location } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router'; 
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button'; 
// import { MatProgressSpinner } from "@angular/material/progress-spinner";
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// import { PageService } from '../../../services/universilabs/pages/page.service';
// import { ResourceService } from '../../../services/universilabs/resources/resource.service';
// import { PageResponseDTO } from '../../../models/universilabas/pages/page-response.model';
// import { ResourceDTO } from '../../../models/universilabas/resources/resource.model';
// import { UserProgressService } from '../../../services/universilabs/userprogress/userprogress.service';
// import { AuthService } from '../../../../core/services/auth/auth.service';
// import { ResourceFormatterService } from '../../../services/viewers/resource-formatter.service';
// import { NavigationService } from '../../../services/academics/navigation.service';

// @Component({
//   selector: 'app-page-viewer',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     MatIconModule, 
//     MatButtonModule, 
//     MatProgressSpinner
//   ],
//   templateUrl: './page-wieber.component.html',
//   styleUrl: './page-wieber.component.scss',
// })
// export class PageViewerComponent implements OnInit {
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private pageService = inject(PageService);
//   private resourceService = inject(ResourceService);
//   private userProgressService = inject(UserProgressService);
//   private authService = inject(AuthService);
//   private location = inject(Location);
//   private formatter = inject(ResourceFormatterService);
//   private sanitizer = inject(DomSanitizer);
//   public navService = inject(NavigationService);

//   private lastPageId: number | null = null;

//   page?: PageResponseDTO;
//   resources: ResourceDTO[] = [];
//   loading = signal(true);
//   iscompleting = false;

//   // Signals de estado del visor
//   activeResourceTitle = signal<string>('');
//   safeResourceUrl = signal<SafeResourceUrl | null>(null);

//   // En page-viewer.component.ts
//   // constructor() {
//   //   // Escuchamos el servicio de navegación de forma persistente
//   //   effect(() => {
//   //     // Obtenemos el recurso del servicio (ya debe venir como ResourceDTO)
//   //     const res = this.navService.activeResource();
//   //     console.log('👁️ El visor ha detectado el recurso:', res?.title); // <--- AÑADE ESTO
      
//   //     if (res && res.url) {
//   //       console.log('📡 Visor detectó cambio en NavigationService:', res.title);

//   //       // 1. Formateamos la URL según el tipo (PDF, Vídeo, etc.)
//   //       const formatted = this.formatter.format(res.url, res.type);
        
//   //       // 2. Actualizamos las señales locales
//   //       // Usamos res.title porque el Sidenav ya se encargó de mapearlo
//   //       this.activeResourceTitle.set(res.title || 'Recurso');
//   //       this.safeResourceUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(formatted));
        
//   //       // 3. Scroll automático hacia el visor
//   //       setTimeout(() => {
//   //         const el = document.getElementById('resource-viewer-container');
//   //         if (el) {
//   //           el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//   //         }
//   //       }, 150);
//   //     } else {
//   //       // Si no hay recurso (se cerró), limpiamos la URL
//   //       this.safeResourceUrl.set(null);
//   //     }
//   //   });
//   // }

//   constructor() {
//     effect(() => {
//       const res = this.navService.activeResource();
      
//       // 1. Si el recurso es nulo o no tiene URL, limpiamos el visor
//       if (!res || !res.url) {
//         if (this.safeResourceUrl()) this.safeResourceUrl.set(null);
//         return;
//       }

//       // 2. Preparamos el formato del recurso
//       const formatted = this.formatter.format(res.url, res.type);

//       // 3. Solo actualizamos si el título es diferente para evitar bucles
//       if (this.activeResourceTitle() !== res.title) {
//         this.activeResourceTitle.set(res.title || 'Recurso');
//         this.safeResourceUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(formatted));

//         // 4. SINCRONIZACIÓN CON EL CSS
//         // Esperamos 550ms: 500ms de la animación slideDown + 50ms de margen técnico
//         setTimeout(() => {
//           const el = document.getElementById('resource-viewer-container');
//           if (el) {
//             el.scrollIntoView({ 
//               behavior: 'smooth', 
//               block: 'start' 
//             });
//           }
//         }, 550); 
//       }
//     });
//   }

//   // ngOnInit() {
//   //   this.route.params.subscribe(params => {
//   //     const id = params['id'];
//   //     if (id) {
//   //       this.navService.clearResource();
//   //       this.loadPageData(+id);
//   //     }
//   //   });
//   // }

//   ngOnInit() {
//     this.route.params.subscribe(params => {
//       const id = Number(params['id']);
//       // 🛑 Si el ID es el mismo que ya tenemos, no hagas nada
//       if (id && id !== this.lastPageId) {
//         this.lastPageId = id;
//         this.navService.clearResource();
//         this.loadPageData(id);
//       }
//     });
//   }

//   renderResource(res: ResourceDTO) {
//     console.log('🚀 Iniciando renderizado de:', res.title);
//     const formatted = this.formatter.format(res.url, res.type);
    
//     // Actualizamos las señales
//     this.activeResourceTitle.set(res.title);
//     this.safeResourceUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(formatted));
    
//     console.log('✅ Señal safeResourceUrl actualizada con:', formatted);

//     // Scroll al visor tras un breve delay para permitir el renderizado
//     setTimeout(() => {
//       const el = document.getElementById('resource-viewer-container');
//       if (el) {
//         el.scrollIntoView({ behavior: 'smooth', block: 'start' });
//       } else {
//         console.warn('⚠️ No se encontró el elemento #resource-viewer-container en el DOM');
//       }
//     }, 150);
//   }

//   openResource(res: ResourceDTO) {
//     if (!res?.url) return;
//     this.navService.openResource(res);
//   }

//   closeResource() {
//     this.safeResourceUrl.set(null);
//     this.navService.clearResource();
//   }

//   // loadPageData(id: number) {
//   //   this.loading.set(true);
//   //   this.pageService.findById(id).subscribe({
//   //     next: (data) => {
//   //       this.page = data;
//   //       this.loadResources(id);
//   //       this.loading.set(false);
//   //     },
//   //     error: () => this.loading.set(false)
//   //   });
//   // }

//   // En page-viewer.component.ts
//   loadPageData(id: number) {
//     // 1. Evitamos recargar si ya estamos en esa página
//     if (this.lastPageId === id && !this.loading()) return;
//     this.lastPageId = id;

//     this.loading.set(true);
//     this.pageService.findById(id).subscribe({
//       next: (data) => {
//         // 2. Limpiamos cualquier rastro de la página anterior antes de asignar la nueva
//         this.page = data;
//         this.loadResources(id);
        
//         // Aquí es donde sale tu log de "CONTENIDO CARGADO"
//         console.log(`✅ Contenido de página ${id} cargado.`);
        
//         this.loading.set(false);
//       },
//       error: (err) => {
//         console.error('Error al cargar la página:', err);
//         this.loading.set(false);
//       }
//     });
//   }

//   loadResources(pageId: number) {
//     this.resourceService.findByPageId(pageId).subscribe({
//       next: (data) => this.resources = data,
//       error: (err) => console.error('Error cargando recursos:', err)
//     });
//   }

//   // Métodos de utilidad
//   getResourceIcon(type: string | undefined): string {
//     const t = type?.toLowerCase() || '';
//     if (t.includes('pdf')) return 'picture_as_pdf';
//     if (t.includes('video')) return 'play_circle';
//     return 'description';
//   }

//   goBack() { this.location.back(); }
// }

import { Component, OnInit, inject, effect, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router'; 
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button'; 
import { MatProgressSpinner } from "@angular/material/progress-spinner";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// Services
import { PageService } from '../../../services/universilabs/pages/page.service';
import { ResourceService } from '../../../services/universilabs/resources/resource.service';
import { UserProgressService } from '../../../services/universilabs/userprogress/userprogress.service';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { ResourceFormatterService } from '../../../services/viewers/resource-formatter.service';
import { NavigationService } from '../../../services/academics/navigation.service';

// Models
import { PageResponseDTO } from '../../../models/universilabas/pages/page-response.model';
import { ResourceDTO } from '../../../models/universilabas/resources/resource.model';

@Component({
  selector: 'app-page-viewer',
  standalone: true,
  imports: [
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatProgressSpinner
  ],
  templateUrl: './page-wieber.component.html',
  styleUrl: './page-wieber.component.scss',
})
export class PageViewerComponent implements OnInit {
  // Inyecciones
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private pageService = inject(PageService);
  private resourceService = inject(ResourceService);
  private userProgressService = inject(UserProgressService);
  private authService = inject(AuthService);
  private location = inject(Location);
  private formatter = inject(ResourceFormatterService);
  private sanitizer = inject(DomSanitizer);
  public navService = inject(NavigationService);

  // Estado
  private lastPageId: number | null = null;
  page?: PageResponseDTO;
  resources: ResourceDTO[] = [];
  loading = signal(true);
  iscompleting = false;

  // Signals para el visor de recursos
  activeResourceTitle = signal<string>('');
  safeResourceUrl = signal<SafeResourceUrl | null>(null);

  constructor() {
    /**
     * Reacciona a cambios en el recurso activo del NavigationService.
     * Centraliza el renderizado evitando funciones duplicadas.
     */
    effect(() => {
      const res = this.navService.activeResource();
      
      if (!res || !res.url) {
        if (this.safeResourceUrl()) this.safeResourceUrl.set(null);
        return;
      }

      const formatted = this.formatter.format(res.url, res.type);

      // Solo actualizamos si el contenido es realmente nuevo
      if (this.activeResourceTitle() !== res.title) {
        this.activeResourceTitle.set(res.title || 'Recurso');
        this.safeResourceUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(formatted));

        // Sincronización con la animación de apertura del CSS (550ms)
        setTimeout(() => {
          const el = document.getElementById('resource-viewer-container');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 550); 
      }
    });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = Number(params['id']);
      if (id) {
        this.loadPageData(id);
      }
    });
  }

  /**
   * Carga los datos de la lección y gestiona el estado de carga.
   */
  loadPageData(id: number) {
    // Evita recargas infinitas si el ID no ha cambiado
    if (this.lastPageId === id) return;
    this.lastPageId = id;

    // Limpiamos el visor al cambiar de página
    this.navService.clearResource();
    
    this.loading.set(true);
    this.pageService.findById(id).subscribe({
      next: (data) => {
        this.page = data;
        this.loadResources(id);
        console.log(`✅ Contenido de página ${id} cargado.`);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error al cargar la página:', err);
        this.loading.set(false);
        this.lastPageId = null; 
      }
    });
  }

  loadResources(pageId: number) {
    this.resourceService.findByPageId(pageId).subscribe({
      next: (data) => this.resources = data,
      error: (err) => console.error('Error cargando recursos:', err)
    });
  }

  /**
   * Abre un recurso delegando la lógica al NavigationService.
   */
  openResource(res: ResourceDTO) {
    if (!res?.url) return;
    this.navService.openResource(res);
  }

  /**
   * Cierra el visor limpiando el servicio.
   */
  closeResource() {
    this.navService.clearResource();
  }

  /**
   * Helpers de UI
   */
  getResourceIcon(type: string | undefined): string {
    const t = type?.toLowerCase() || '';
    if (t.includes('pdf')) return 'picture_as_pdf';
    if (t.includes('video')) return 'play_circle';
    return 'description';
  }

  goBack() { 
    this.location.back(); 
  }
}