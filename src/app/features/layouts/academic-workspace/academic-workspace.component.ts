// import { Component, signal, inject, OnInit, ChangeDetectorRef } from '@angular/core';
// import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { catchError, filter } from 'rxjs/operators';
// import { of } from 'rxjs';

// // Angular Material
// import { MatToolbarModule } from '@angular/material/toolbar';
// import { MatSidenavModule } from '@angular/material/sidenav';
// import { MatExpansionModule } from '@angular/material/expansion';
// import { MatListModule } from '@angular/material/list';
// import { MatProgressBarModule } from '@angular/material/progress-bar';
// import { MatIconModule } from '@angular/material/icon';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { take } from 'rxjs'; // Asegúrate de importar esto

// // Servicios
// import { NavigationService } from '../../services/academics/navigation.service';
// import { PageSummaryNode, ProjectResourceDTO, ProjectStructureDTO } from '../../models/universilabas/project-structure/project-structure.dto';
// import { ProjectService } from '../../services/universilabs/projects/project.service';
// import { ViewerCommunicationService } from '../../services/viewers/viewer-communication.service';
// import { ProgressService } from '../../services/academics/progress.service';
// import { AuthService } from '../../../core/services/auth/auth.service';

// @Component({
//   selector: 'app-academic-workspace',
//   standalone: true,
//   imports: [
//     CommonModule, RouterModule, MatToolbarModule, MatSidenavModule, 
//     MatExpansionModule, MatListModule, MatProgressBarModule, MatIconModule,
//     MatProgressSpinnerModule, MatTooltipModule
//   ],
//   templateUrl: './academic-workspace.component.html',
//   styleUrls: ['./academic-workspace.component.scss']
// })
// export class AcademicWorkspaceComponent implements OnInit {
// //
//   // Inyecciones
//   public navService = inject(NavigationService);  
//   private router = inject(Router);
//   private route = inject(ActivatedRoute);
//   private projectService = inject(ProjectService);
//   private viewerComm = inject(ViewerCommunicationService);
//   private progressService = inject(ProgressService);
//   private cdr = inject(ChangeDetectorRef);
//   private authService = inject(AuthService);

//   // Signals para el estado
//   public project = signal<ProjectStructureDTO | null>(null);
//   public isEmpty = signal<boolean>(false); 
//   public rawProjectId: string = '';
//   public activePage = signal<PageSummaryNode | null>(null);
//   public realProgress = signal<number>(0);
//   public currentSubtopicTitle = signal<string>('');

//   public userId: number | null = null;
  
//   // Control para evitar el error NG0100 y doble guardado al iniciar
//   public isInitialLoad = true;
//   private reportedPages = new Set<number>();

//   // ngOnInit() {
//   //   this.authService.getUserId().pipe(take(1)).subscribe({
//   //     next: (id) => {
//   //       if (id) {
//   //         this.userId = id;
//   //         this.initWorkspaceLogic();
//   //       } else {
//   //         console.error('❌ No se encontró userId');
//   //         this.exitToPlatform();
//   //       }
//   //     },
//   //     error: () => this.exitToPlatform()
//   //   });
//   // }

//   ngOnInit() {
//     this.authService.getUserId().pipe(take(1)).subscribe({
//       next: (id) => {
//         if (id) {
//           this.userId = id;
//           this.initWorkspaceLogic(); // Solo llamamos a este
//         } else {
//           this.exitToPlatform();
//         }
//       },
//       error: () => this.exitToPlatform()
//     });
//   }

//   // private initWorkspaceLogic() {
//   //   // Suscripción reactiva a los cambios de URL
//   //   this.route.paramMap.subscribe(params => {
//   //     // 🔍 IMPORTANTE: Si en tu app-routing.module dice path: 'aula/:projectId', 
//   //     // aquí debes poner params.get('projectId'). Si dice 'id', deja 'id'.
//   //     const idParam = params.get('id') || params.get('projectId'); 
//   //     const titleFromUrl = this.route.snapshot.queryParamMap.get('title');
      
//   //     console.log('🆔 ID Detectado:', idParam);
      
//   //     if (idParam) {
//   //       this.isInitialLoad = true; 
//   //       this.isEmpty.set(false);
//   //       this.loadProjectData(idParam, titleFromUrl);
//   //     } else {
//   //       // 🚩 Si el ID sigue siendo null, no podemos cargar nada.
//   //       console.warn('⚠️ No se detectó ID en la URL. Abortando carga.');
//   //       this.isInitialLoad = false;
//   //       this.isEmpty.set(true); 
//   //       this.cdr.detectChanges();
//   //     }
//   //   });

//   //   // Listener de navegación para actualizar la página activa
//   //   this.router.events.pipe(
//   //     filter(event => event instanceof NavigationEnd)
//   //   ).subscribe(() => {
//   //     this.updateActivePageFromRoute();
//   //   });
//   // }

//   // private initWorkspaceLogic() {
//   //   // 1. Escuchar cambios de parámetros (ID del proyecto)
//   //   this.route.paramMap.subscribe(params => {
//   //     const idParam = params.get('id') || params.get('projectId');
//   //     if (idParam && idParam !== this.rawProjectId) {
//   //       this.isInitialLoad = true;
//   //       this.reportedPages.clear(); // Limpiar historial al cambiar de proyecto
//   //       this.loadProjectData(idParam, this.route.snapshot.queryParamMap.get('title'));
//   //     }
//   //   });

//   //   // 2. ÚNICO listener de navegación para cambios de PÁGINA
//   //   this.router.events.pipe(
//   //     filter(event => event instanceof NavigationEnd)
//   //   ).subscribe(() => {
//   //     // Evitamos ejecutar lógica de actualización si estamos en medio de una carga inicial
//   //     // o si la URL no es de una página (ej. visor de recursos)
//   //     if (!this.router.url.includes('/page/')) return;

//   //     this.updateActivePageFromRoute();
      
//   //     // Auto-scroll al elemento activo en el menú
//   //     setTimeout(() => {
//   //       const activeElem = document.querySelector('.active-page');
//   //       activeElem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//   //     }, 300);
//   //   });
//   // }

//   // 2. initWorkspaceLogic: Centraliza TODA la escucha de eventos
//   private initWorkspaceLogic() {
//     // Escucha cambios de Proyecto (ID)
//     this.route.paramMap.subscribe(params => {
//       const idParam = params.get('id') || params.get('projectId');
//       if (idParam && idParam !== this.rawProjectId) {
//         this.rawProjectId = idParam;
//         this.isInitialLoad = true;
//         this.reportedPages.clear(); 
//         this.loadProjectData(idParam, this.route.snapshot.queryParamMap.get('title'));
//       }
//     });

//     // Escucha cambios de Página (URL)
//     this.router.events.pipe(
//       filter(event => event instanceof NavigationEnd)
//     ).subscribe(() => {
//       if (!this.router.url.includes('/page/')) return;

//       this.updateActivePageFromRoute();
      
//       // Scroll sutil al menú
//       setTimeout(() => {
//         const activeElem = document.querySelector('.active-page');
//         activeElem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
//       }, 300);
//     });
//   }

//   // 
//   private startWorkspace() {
//     const projectIdParam = this.route.snapshot.paramMap.get('projectId');
//     const projectTitle = this.route.snapshot.queryParamMap.get('title');

//     this.loadProjectData(projectIdParam, projectTitle);

//     this.router.events.pipe(
//       filter(event => event instanceof NavigationEnd)
//     ).subscribe(() => {
//       // Usamos setTimeout para que Angular termine de verificar la vista actual antes de actualizar
//       setTimeout(() => {
//         this.updateActivePageFromRoute();
        
//         // Solo sincronizamos con el backend si no es la carga automática de inicio
//         if (!this.isInitialLoad) {
//           this.syncProgressWithBackend();
//         }
        
//         this.cdr.detectChanges(); 
//         const activeElem = document.querySelector('.active-page');
//         if (activeElem) {
//           activeElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
//         }
//       }, 0);
//     });
//   }
  
//   //
//   loadProjectData(idParam: string | null, titleFromUrl: string | null) {
//     this.reportedPages.clear(); 
//     this.rawProjectId = idParam || ''; 
//     const numericId = idParam ? Number(idParam.replace('proyecto-', '')) : 0;
    
//     if (numericId === 0) {
//       this.exitToPlatform();
//       return;
//     }

//     this.projectService.getStructure(numericId).pipe(
//       catchError(err => {
//         console.error('❌ Error crítico al cargar la estructura:', err);
//         this.project.set({ 
//           id: numericId, 
//           title: titleFromUrl || 'este proyecto', 
//           modules: [] 
//         } as any);
//         this.isEmpty.set(true); 
//         this.isInitialLoad = false;
//         this.cdr.detectChanges();
//         return of(null);
//       })
//     ).subscribe({
//       next: (data: any) => {
//         if (!data) return;

//         // 1. LÓGICA DE ORDENAMIENTO ASCENDENTE (ID Menor a Mayor: 6, 14, 21...)
//         if (data.modules) {
//           data.modules.sort((a: any, b: any) => a.id - b.id);

//           data.modules.forEach((mod: any) => {
//             if (mod.pages) {
//               mod.pages.sort((a: any, b: any) => a.id - b.id);

//               mod.pages.forEach((tema: any) => {
//                 if (tema.subtopics) {
//                   tema.subtopics.sort((a: any, b: any) => a.id - b.id);

//                   tema.subtopics.forEach((sub: any) => {
//                     if (sub.pages) {
//                       sub.pages.sort((a: any, b: any) => a.id - b.id);
//                     }
//                   });
//                 }
//               });
//             }
//           });
//         }

//         // 2. Seteo de datos ya ordenados
//         if (!data.title && titleFromUrl) data.title = titleFromUrl;
//         this.project.set(data);

//         // 3. Validación de estructura completa
//         const modules = data.modules || data.collections || [];
//         const isComplete = modules.length > 0 && modules.some((m: any) => 
//           m.pages?.some((tema: any) => 
//             tema.subtopics?.some((sub: any) => 
//               sub.pages?.length > 0 && sub.pages[0].id
//             )
//           )
//         );

//         if (!isComplete) {
//           console.warn(`🚫 Proyecto "${data.title}" incompleto.`);
//           this.isEmpty.set(true); 
//           this.isInitialLoad = false;
//           this.cdr.detectChanges();
//           return; 
//         }

//         // 4. Inicialización de navegación
//         this.navService.setNavigationTree(data);
//         this.isEmpty.set(false);

//         const currentUrl = this.router.url;
//         if (!currentUrl.includes('/page/')) {
//           this.resumeLastSession(numericId, data);
//         } else {
//           this.updateActivePageFromRoute();
//           setTimeout(() => {
//             this.isInitialLoad = false;
//             this.cdr.detectChanges();
//           }, 500);
//         }
//       }
//     });
//   }

//   //
//   private resumeLastSession(projectId: number, data: ProjectStructureDTO) {
//     if (this.userId === null) {
//       this.navigateToFirstPage(data);
//       return;
//     }

//     this.progressService.resumeCourse(this.userId, projectId)
//       .pipe(
//         catchError(() => {
//           // Si hay error (404), no hacemos nada especial, dejamos que el flujo siga a 'null'
//           return of(null); 
//         }),
//         take(1)
//       )
//       .subscribe({
//         next: (progress) => {
//           if (progress && progress.pageId) {
//             console.log(`ℹ️ Reanudando sesión en página: ${progress.pageId}`);
//             this.navigateToPage(progress.pageId);
//             // IMPORTANTE: Al navegar a una página válida, el isInitialLoad 
//             // se pondrá en false dentro de updateActivePageFromRoute
//           } else {
//             console.log('ℹ️ Sin progreso previo. Intentando ir a la primera página.');
//             this.navigateToFirstPage(data);
//           }
//         },
//         error: () => this.navigateToFirstPage(data)
//       });
//   }

//   //
//   private syncProgressWithBackend() {
//     const currentPage = this.activePage();
//     const projectId = Number(this.rawProjectId.replace('proyecto-', ''));

//     if (currentPage && projectId && this.userId !== null) {
      
//       // 1. LE DECIMOS AL SERVICIO EN QUÉ PÁGINA ESTAMOS
//       // Esto dispara el 'computed' del progreso automáticamente
//       this.navService.setCurrentPage(currentPage.id);

//       // 2. REGISTRO EN EL BACKEND (Solo si es la primera vez que la vemos)
//       if (!this.reportedPages.has(currentPage.id)) {
//         this.progressService.updateProgress({
//           userId: this.userId,
//           projectId: projectId,
//           pageId: currentPage.id,
//           status: 'STARTED'
//         }).subscribe({
//           next: () => {
//             this.reportedPages.add(currentPage.id);
//             console.log(`✅ Página ${currentPage.id} guardada en el historial.`);
//           }
//         });
//       }
//     }
//   }
  
//   // private updateActivePageFromRoute() {
//   //   let child = this.route.firstChild;
//   //   while (child?.firstChild) child = child.firstChild;
//   //   const pageId = child?.snapshot.paramMap.get('pageId');
    
//   //   const currentProject = this.project();
    
//   //   if (pageId && currentProject) {
//   //     const numericPageId = Number(pageId);
//   //     const foundPage = this.findPageById(numericPageId);
      
//   //     this.navService.setCurrentPage(numericPageId);
      
//   //     if (foundPage) {
//   //       this.activePage.set(foundPage);
//   //       this.syncProgressWithBackend();
        
//   //       // Si encontramos la página, el proyecto NO está vacío y la carga terminó
//   //       this.isEmpty.set(false);
//   //       this.isInitialLoad = false; 
//   //       this.cdr.detectChanges();
//   //     }
//   //   }
//   // }

//   // 3. updateActivePageFromRoute: El "Guardián" que evita el bucle
//   private updateActivePageFromRoute() {
//     let child = this.route.firstChild;
//     while (child?.firstChild) child = child.firstChild;
    
//     const pageId = child?.snapshot.paramMap.get('pageId');
//     if (!pageId) return;

//     const numericPageId = Number(pageId);
//     const currentProject = this.project();

//     if (numericPageId && currentProject) {
//       // 🛑 SI LA PÁGINA ES LA MISMA QUE YA TENEMOS, CANCELAR TODO
//       if (this.activePage()?.id === numericPageId) return;

//       const foundPage = this.findPageById(numericPageId);
      
//       if (foundPage) {
//         this.activePage.set(foundPage);
        
//         // Notificamos al servicio (esto actualiza la barra de progreso %)
//         this.navService.setCurrentPage(numericPageId);

//         // Solo guardamos en DB si no es el arranque automático
//         if (!this.isInitialLoad) {
//           this.syncProgressWithBackend();
//         }
        
//         this.isEmpty.set(false);
//         this.cdr.detectChanges();
//       }
//     }
//   }
    
//   // 2. Corrige el buscador de páginas (Jerarquía de 4 niveles)
//   private findPageById(id: number): PageSummaryNode | null {
//     const data = this.project();
//     if (!data || !data.modules) return null;

//     // 1. Recorre los Módulos
//     for (const mod of data.modules) {
//       // 2. Recorre los Temas (que en tu DTO se llaman 'pages')
//       if (mod.pages) {
//         for (const tema of mod.pages) {
//           // 3. Recorre los Subtemas
//           if (tema.subtopics) {
//             for (const sub of tema.subtopics) {
//               // 4. Busca la página por ID
//               const found = sub.pages?.find(p => p.id === id);
              
//               if (found) {
//                 // Actualiza los títulos de la interfaz
//                 this.currentSubtopicTitle.set(sub.title); 
//                 this.navService.currentSubtopicTitle.set(sub.title); 
//                 return found;
//               }
//             }
//           }
//         }
//       }
//     }
  
//   // Si no encuentra nada, limpia los títulos
//   this.currentSubtopicTitle.set('');
//   this.navService.currentSubtopicTitle.set(''); 
//   return null;
// }

//   //
//   private navigateToPage(pageId: number) {
//     this.router.navigate(['aula', this.rawProjectId, 'page', pageId], { replaceUrl: true });
//   }

//   // 1. Corrige la navegación a la primera página para que no explote
//   private navigateToFirstPage(data: any) {
//     const modules = data.modules || data.collections || [];
    
//     // Buscador profundo del primer ID
//     const firstPageId = modules[0]?.pages?.[0]?.subtopics?.[0]?.pages?.[0]?.id;

//     if (firstPageId) {
//       this.navigateToPage(firstPageId);
//     } else {
//       // Si llegamos aquí, el proyecto realmente no tiene nada que mostrar
//       console.warn("⚠️ Estructura sin páginas navegables detectada.");
//       this.isEmpty.set(true); 
//       this.isInitialLoad = false; // <--- APAGADO INMEDIATO
//       this.cdr.detectChanges();
//     }
//   }

//   //
//   exitToPlatform() {
//     this.router.navigate(['/inicio']);
//   }

//   //
//   getResourceIcon(type: string | undefined): string {
//     if (!type) return 'attachment';
//     const t = type.toLowerCase();
//     if (t.includes('pdf')) return 'picture_as_pdf';
//     if (t.includes('zip') || t.includes('rar')) return 'inventory_2';
//     if (t.includes('doc')) return 'description';
//     if (t.includes('link') || t.includes('http')) return 'language';
//     return 'attachment';
//   }

//   //
//   onResourceClick(res: ProjectResourceDTO): void {
//     if (res && res.url) {
//       this.viewerComm.openResource({
//         title: res.name,
//         url: res.url,
//         type: res.type as any,
//         order: 0,
//         pageId: 0
//       });

//       if (this.viewerComm.resourceToOpen()) {
//         this.navService.openResource(this.viewerComm.resourceToOpen()!);
//         this.router.navigate(['visor-recurso'], {
//           relativeTo: this.route,
//           queryParams: { url: res.url, title: res.name, type: res.type }
//         });
//         this.viewerComm.resourceToOpen.set(null);
//       }
//     }
//   }

//   //
//   getTopicIcon(title: string): string {
//     const t = title.toLowerCase();
    
//     if (t.includes('ratón') || t.includes('pincel')) return 'brush';
//     if (t.includes('teclado') || t.includes('escribir')) return 'keyboard';
//     if (t.includes('internet') || t.includes('web')) return 'language';
//     if (t.includes('archivo') || t.includes('carpeta')) return 'folder';
//     if (t.includes('seguridad') || t.includes('virus')) return 'security';
//     if (t.includes('video') || t.includes('película')) return 'movie';
    
//     // Icono por defecto si no encuentra coincidencias
//     return 'book'; 
//   }

//   private isStructureComplete(data: any): boolean {
//     // Verificamos si existen módulos y si al menos el primero tiene alguna página
//     const modules = data.modules || data.collections || [];
//     const hasModules = modules.length > 0;
//     const hasPages = modules[0]?.pages?.length > 0 || modules[0]?.topics?.length > 0;

//     return hasModules && hasPages;
//   }

//   private hasNavigableContent(data: any): boolean {
//     const modules = data?.modules || data?.collections || [];
//     // Verificamos si existe al menos una página en el primer subtema del primer tema
//     const firstPage = modules[0]?.pages?.[0]?.subtopics?.[0]?.pages?.[0];
    
//     return !!(firstPage && firstPage.id);
//   }
// }

import { Component, signal, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterModule, ActivatedRoute, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { catchError, filter, take, of } from 'rxjs';

// Angular Material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Servicios
import { NavigationService } from '../../services/academics/navigation.service';
import { PageSummaryNode, ProjectResourceDTO, ProjectStructureDTO } from '../../models/universilabas/project-structure/project-structure.dto';
import { ProjectService } from '../../services/universilabs/projects/project.service';
import { ViewerCommunicationService } from '../../services/viewers/viewer-communication.service';
import { ProgressService } from '../../services/academics/progress.service';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-academic-workspace',
  standalone: true,
  imports: [
    CommonModule, RouterModule, MatToolbarModule, MatSidenavModule, 
    MatExpansionModule, MatListModule, MatProgressBarModule, MatIconModule,
    MatProgressSpinnerModule, MatTooltipModule
  ],
  templateUrl: './academic-workspace.component.html',
  styleUrls: ['./academic-workspace.component.scss']
})
export class AcademicWorkspaceComponent implements OnInit {

  // Inyecciones
  public navService = inject(NavigationService);  
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private projectService = inject(ProjectService);
  private viewerComm = inject(ViewerCommunicationService);
  private progressService = inject(ProgressService);
  private cdr = inject(ChangeDetectorRef);
  private authService = inject(AuthService);

  // Signals para el estado
  public project = signal<ProjectStructureDTO | null>(null);
  public isEmpty = signal<boolean>(false); 
  public rawProjectId: string = '';
  public activePage = signal<PageSummaryNode | null>(null);
  public currentSubtopicTitle = signal<string>('');

  public userId: number | null = null;
  
  // Control de flujo
  public isInitialLoad = true;
  private reportedPages = new Set<number>();

  ngOnInit() {
    this.authService.getUserId().pipe(take(1)).subscribe({
      next: (id) => {
        if (id) {
          this.userId = id;
          this.initWorkspaceLogic();
        } else {
          console.error('❌ No se encontró userId');
          this.exitToPlatform();
        }
      },
      error: () => this.exitToPlatform()
    });
  }

  /**
   * Centraliza la escucha de cambios de parámetros y navegación.
   */
  private initWorkspaceLogic() {
    // 1. Escuchar cambios de Proyecto (ID)
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id') || params.get('projectId');
      if (idParam && idParam !== this.rawProjectId) {
        this.rawProjectId = idParam;
        this.isInitialLoad = true;
        this.reportedPages.clear(); 
        this.loadProjectData(idParam, this.route.snapshot.queryParamMap.get('title'));
      }
    });

    // 2. Escuchar cambios de Página (URL)
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      if (!this.router.url.includes('/page/')) return;

      this.updateActivePageFromRoute();
      
      // Auto-scroll al elemento activo en el menú lateral
      setTimeout(() => {
        const activeElem = document.querySelector('.active-page');
        activeElem?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 300);
    });
  }

  /**
   * Carga la estructura del proyecto y decide si reanudar sesión o ir al inicio.
   */
  loadProjectData(idParam: string | null, titleFromUrl: string | null) {
    const numericId = idParam ? Number(idParam.replace('proyecto-', '')) : 0;
    
    if (numericId === 0) {
      this.exitToPlatform();
      return;
    }

    this.projectService.getStructure(numericId).pipe(
      catchError(err => {
        console.error('❌ Error crítico al cargar la estructura:', err);
        this.isEmpty.set(true); 
        this.isInitialLoad = false;
        this.cdr.detectChanges();
        return of(null);
      })
    ).subscribe({
      next: (data: any) => {
        if (!data) return;

        // Ordenamiento ascendente de la estructura
        this.sortProjectStructure(data);

        if (!data.title && titleFromUrl) data.title = titleFromUrl;
        this.project.set(data);

        // Validación de contenido
        if (!this.hasNavigableContent(data)) {
          this.isEmpty.set(true); 
          this.isInitialLoad = false;
          this.cdr.detectChanges();
          return; 
        }

        this.navService.setNavigationTree(data);
        this.isEmpty.set(false);

        // Si ya estamos en una ruta de página, actualizamos; si no, reanudamos sesión
        if (this.router.url.includes('/page/')) {
          this.updateActivePageFromRoute();
          setTimeout(() => {
            this.isInitialLoad = false;
            this.cdr.detectChanges();
          }, 500);
        } else {
          this.resumeLastSession(numericId, data);
        }
      }
    });
  }

  private sortProjectStructure(data: any) {
    if (data.modules) {
      data.modules.sort((a: any, b: any) => a.id - b.id);
      data.modules.forEach((mod: any) => {
        if (mod.pages) {
          mod.pages.sort((a: any, b: any) => a.id - b.id);
          mod.pages.forEach((tema: any) => {
            if (tema.subtopics) {
              tema.subtopics.sort((a: any, b: any) => a.id - b.id);
              tema.subtopics.forEach((sub: any) => {
                if (sub.pages) sub.pages.sort((a: any, b: any) => a.id - b.id);
              });
            }
          });
        }
      });
    }
  }

  private resumeLastSession(projectId: number, data: ProjectStructureDTO) {
    if (this.userId === null) {
      this.navigateToFirstPage(data);
      return;
    }

    this.progressService.resumeCourse(this.userId, projectId)
      .pipe(catchError(() => of(null)), take(1))
      .subscribe(progress => {
        if (progress && progress.pageId) {
          this.navigateToPage(progress.pageId);
        } else {
          this.navigateToFirstPage(data);
        }
      });
  }

  /**
   * Sincroniza el cambio de página con el backend y el servicio de navegación.
   */
  private syncProgressWithBackend() {
    const currentPage = this.activePage();
    const projectId = Number(this.rawProjectId.replace('proyecto-', ''));

    if (currentPage && projectId && this.userId !== null) {
      this.navService.setCurrentPage(currentPage.id);

      if (!this.reportedPages.has(currentPage.id)) {
        this.progressService.updateProgress({
          userId: this.userId,
          projectId: projectId,
          pageId: currentPage.id,
          status: 'STARTED'
        }).subscribe(() => {
          this.reportedPages.add(currentPage.id);
          console.log(`✅ Progreso guardado: Página ${currentPage.id}`);
        });
      }
    }
  }

  /**
   * El "Guardián" de la UI. Evita actualizaciones redundantes.
   */
  private updateActivePageFromRoute() {
    let child = this.route.firstChild;
    while (child?.firstChild) child = child.firstChild;
    
    const pageId = child?.snapshot.paramMap.get('pageId');
    if (!pageId) return;

    const numericPageId = Number(pageId);
    const currentProject = this.project();

    if (numericPageId && currentProject) {
      // FRENO: Evitar procesar si ya estamos en esta página
      if (this.activePage()?.id === numericPageId) return;

      const foundPage = this.findPageById(numericPageId);
      
      if (foundPage) {
        this.activePage.set(foundPage);
        this.navService.setCurrentPage(numericPageId);

        // Si no es la carga inicial (o reanudación), reportamos al backend
        if (!this.isInitialLoad) {
          this.syncProgressWithBackend();
        } else {
          this.isInitialLoad = false; // Liberamos el bloqueo tras la primera carga exitosa
        }
        
        this.isEmpty.set(false);
        this.cdr.detectChanges();
      }
    }
  }

  private findPageById(id: number): PageSummaryNode | null {
    const data = this.project();
    if (!data || !data.modules) return null;

    for (const mod of data.modules) {
      if (mod.pages) {
        for (const tema of mod.pages) {
          if (tema.subtopics) {
            for (const sub of tema.subtopics) {
              const found = sub.pages?.find(p => p.id === id);
              if (found) {
                this.currentSubtopicTitle.set(sub.title); 
                this.navService.currentSubtopicTitle.set(sub.title); 
                return found;
              }
            }
          }
        }
      }
    }
    return null;
  }

  private navigateToPage(pageId: number) {
    this.router.navigate(['aula', this.rawProjectId, 'page', pageId], { replaceUrl: true });
  }

  private navigateToFirstPage(data: any) {
    const modules = data.modules || [];
    const firstPageId = modules[0]?.pages?.[0]?.subtopics?.[0]?.pages?.[0]?.id;

    if (firstPageId) {
      this.navigateToPage(firstPageId);
    } else {
      this.isEmpty.set(true); 
      this.isInitialLoad = false;
      this.cdr.detectChanges();
    }
  }

  exitToPlatform() {
    this.router.navigate(['/inicio']);
  }

  getResourceIcon(type: string | undefined): string {
    if (!type) return 'attachment';
    const t = type.toLowerCase();
    if (t.includes('pdf')) return 'picture_as_pdf';
    if (t.includes('zip') || t.includes('rar')) return 'inventory_2';
    if (t.includes('doc')) return 'description';
    if (t.includes('link') || t.includes('http')) return 'language';
    return 'attachment';
  }

  onResourceClick(res: ProjectResourceDTO): void {
    if (res?.url) {
      this.viewerComm.openResource({
        title: res.name,
        url: res.url,
        type: res.type as any,
        order: 0,
        pageId: 0
      });

      const resource = this.viewerComm.resourceToOpen();
      if (resource) {
        this.navService.openResource(resource);
        this.router.navigate(['visor-recurso'], {
          relativeTo: this.route,
          queryParams: { url: res.url, title: res.name, type: res.type }
        });
        this.viewerComm.resourceToOpen.set(null);
      }
    }
  }

  getTopicIcon(title: string): string {
    const t = title.toLowerCase();
    if (t.includes('ratón') || t.includes('pincel')) return 'brush';
    if (t.includes('teclado')) return 'keyboard';
    if (t.includes('internet')) return 'language';
    if (t.includes('archivo')) return 'folder';
    if (t.includes('seguridad')) return 'security';
    if (t.includes('video')) return 'movie';
    return 'book'; 
  }

  private hasNavigableContent(data: any): boolean {
    const modules = data?.modules || [];
    return !!(modules[0]?.pages?.[0]?.subtopics?.[0]?.pages?.[0]?.id);
  }
}