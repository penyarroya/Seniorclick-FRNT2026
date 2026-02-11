// import { Component, signal, inject, OnInit, OnDestroy } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, RouterModule, Router } from '@angular/router';
// import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatDividerModule } from '@angular/material/divider';
// import { MatTooltipModule } from '@angular/material/tooltip';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { trigger, transition, style, animate } from '@angular/animations';
// import { NavigationService } from '../../services/academics/navigation.service';
// import { MatRippleModule } from '@angular/material/core';
// import { PageService } from '../../services/universilabs/pages/page.service';
// import { PageResponseDTO } from '../../models/universilabas/pages/page-response.model';

// @Component({
//   selector: 'app-page-viewer',
//   standalone: true,
//   animations: [
//     trigger('fadeSlide', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'translateY(20px)' }),
//         animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
//       ])
//     ]),
//     trigger('fadeInOut', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'scale(0.5)' }),
//         animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
//       ]),
//       transition(':leave', [
//         animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.5)' }))
//       ])
//     ])
//   ],
//   imports: [
//     CommonModule,
//     RouterModule,
//     MatIconModule,
//     MatButtonModule,
//     MatDividerModule,
//     MatTooltipModule,
//     MatProgressSpinnerModule,
//     MatSnackBarModule,
//     MatRippleModule
//   ],
//   templateUrl: './page-viewer.component.html',
//   styleUrl: './page-viewer.component.scss',
// })
// export class PageViewerComponent implements OnInit, OnDestroy {
// //  
//   private route = inject(ActivatedRoute);
//   private router = inject(Router);
//   private sanitizer = inject(DomSanitizer);
//   public navService = inject(NavigationService);
//   private snackBar = inject(MatSnackBar);
//   private pageService = inject(PageService);
  
//   public page = signal<any>(null);
//   public safeContent = signal<SafeHtml>('');
//   public completed = signal<boolean>(false);
//   public subtopicIndex = signal<number>(1); 
//   public showScrollButton = signal<boolean>(false);
//   public readingTime = signal<number>(1); 
  
//   private projectId: string | null = null;
  
//   // Manejador de scroll optimizado para el contenedor con overflow
//   private scrollHandler = (event: any) => {
//     if (event.target.classList?.contains('page-container')) {
//       const scrollTop = event.target.scrollTop;
//       const shouldShow = scrollTop > 300;
      
//       if (this.showScrollButton() !== shouldShow) {
//         this.showScrollButton.set(shouldShow);
//       }
//     }
//   };

//   //
//   ngOnInit() {
//     // 1. Obtenemos el projectId de forma reactiva por si cambia el proyecto
//     this.route.parent?.paramMap.subscribe(parentParams => {
//       this.projectId = parentParams.get('projectId');
//     });

//     // 2. Escuchamos cambios en la página actual
//     this.route.params.subscribe(params => {
//       const pageId = params['pageId'];
      
//       if (pageId) {
//         const numericId = Number(pageId);
        
//         // Actualizamos el servicio para que el progreso y botones se sincronicen
//         this.navService.currentPageId.set(numericId);
        
//         // Reset de estados antes de cargar la nueva página
//         this.completed.set(false);
//         this.page.set(null); // Esto activará el spinner de carga en tu HTML
        
//         // Carga de datos
//         this.loadPageContent(pageId);
        
//         // Scroll al inicio suave
//         setTimeout(() => this.scrollToTop(), 50);
//       }
//   });

//   // 3. Listener de scroll para el botón "ir arriba"
//   window.addEventListener('scroll', this.scrollHandler, true);
// }

//   ngOnDestroy() {
//     window.removeEventListener('scroll', this.scrollHandler, true);
//   }

//   scrollToTop() {
//     const container = document.querySelector('.page-container');
//     if (container) {
//       container.scrollTo({ top: 0, behavior: 'smooth' });
//     }
//   }

//   //
//   loadPageContent(id: string) {
//     const numericId = Number(id);
//     if (isNaN(numericId)) return;

//     // Llamada real al backend (Spring Boot)
//     this.pageService.findById(numericId).subscribe({
//       next: (data: PageResponseDTO) => {
//         // Seteamos el signal de la página con los datos de la DB
//         this.page.set(data);
//         console.log('COTENIDO DE LA PAGINA: ', this.page());
//         // Sanitizamos el contenido HTML que viene del campo 'content'
//         this.safeContent.set(
//           this.sanitizer.bypassSecurityTrustHtml(data.content || '')
//         );

//         // Si tienes un índice de subtema en tu DTO, lo actualizamos
//         // this.subtopicIndex.set(data.orderIndex); 
//       },
//       error: (err) => {
//         console.error('Error al cargar la página real:', err);
//         this.snackBar.open('Error al cargar el contenido de la lección', 'Cerrar', {
//           duration: 3000
//         });
//       }
//     });
//   }

//   //
//   getFileIcon(type: string): string {
//     const icons: Record<string, string> = { 
//       'pdf': 'picture_as_pdf', 
//       'zip': 'inventory_2', 
//       'link': 'open_in_new',
//       'doc': 'description',
//       'docx': 'description',
//       'png': 'image',
//       'jpg': 'image'
//     };
//     return icons[type.toLowerCase()] || 'insert_drive_file';
//   }
  
//   //
//   markAsCompleted() {
//     const isNowCompleted = !this.completed();
//     this.completed.set(isNowCompleted);
    
//     // ELIMINADO: this.navService.updateProgress(isNowCompleted);
//     // El progreso ahora es automático por posición. 
//     // Si quieres que "completar" haga algo, podrías navegar al siguiente:
    
//     if (isNowCompleted) {
//       this.snackBar.open('¡Lección marcada como leída!', 'Cerrar', { 
//         duration: 3000,
//         panelClass: ['success-snackbar']
//       });
//     }
//   }

//   calculateReadingTime(text: string): number {
//     if (!text) return 1;
//     const wordsPerMinute = 200; // Velocidad promedio
//     const noOfWords = text.split(/\s+/).length; // Contamos palabras quitando espacios
//     const minutes = Math.ceil(noOfWords / wordsPerMinute);
//     return minutes < 1 ? 1 : minutes;
//   }

//   goBack() {
//     const currentId = this.page()?.id;
//     const neighbors = this.navService.getNeighbors(currentId);
//     if (neighbors.prev && this.projectId) {
//       this.router.navigate(['/aula', this.projectId, 'page', neighbors.prev]);
//     }
//   }

//   goNext() {
//     const currentId = this.page()?.id;
//     const neighbors = this.navService.getNeighbors(currentId);
//     if (neighbors.next && this.projectId) {
//       this.router.navigate(['/aula', this.projectId, 'page', neighbors.next]);
//     }
//   }

//   downloadResource(res: any) {
//     if (!res.url || res.url === '#') {
//       this.snackBar.open('Recurso no disponible', 'Cerrar', { duration: 3000 });
//       return;
//     }
//     window.open(res.url, '_blank', 'noopener,noreferrer');
//   }
// }

import { Component, signal, inject, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { trigger, transition, style, animate } from '@angular/animations';
import { NavigationService } from '../../services/academics/navigation.service';
import { MatRippleModule } from '@angular/material/core';
import { PageService } from '../../services/universilabs/pages/page.service';
import { PageResponseDTO } from '../../models/universilabas/pages/page-response.model';

@Component({
  selector: 'app-page-viewer',
  standalone: true,
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.5)' }))
      ])
    ])
  ],
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatRippleModule
  ],
  templateUrl: './page-viewer.component.html',
  styleUrl: './page-viewer.component.scss',
})
export class PageViewerComponent implements OnInit, OnDestroy {
//  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private sanitizer = inject(DomSanitizer);
  public navService = inject(NavigationService);
  private snackBar = inject(MatSnackBar);
  private pageService = inject(PageService);
  
  public page = signal<any>(null);
  public safeContent = signal<SafeHtml>('');
  public completed = signal<boolean>(false);
  public subtopicIndex = signal<number>(1); 
  public showScrollButton = signal<boolean>(false);
  public readingTime = signal<number>(1); // Señal para el tiempo de lectura
  public scrollProgress = signal<number>(0);
  
  private projectId: string | null = null;
    
  private scrollHandler = (event: any) => {
    if (event.target.classList?.contains('page-container')) {
      const container = event.target;
      
      // Cálculo de progreso
      const winScroll = container.scrollTop;
      const height = container.scrollHeight - container.clientHeight;
      const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
      
      this.scrollProgress.set(scrolled);

      // Lógica del botón "ir arriba" que ya tenías
      const shouldShow = winScroll > 300;
      if (this.showScrollButton() !== shouldShow) {
        this.showScrollButton.set(shouldShow);
      }
    }
  };

  ngOnInit() {
    this.route.parent?.paramMap.subscribe(parentParams => {
      this.projectId = parentParams.get('projectId');
    });

    this.route.params.subscribe(params => {
      const pageId = params['pageId'];
      if (pageId) {
        const numericId = Number(pageId);
        this.navService.currentPageId.set(numericId);
        this.completed.set(false);
        this.page.set(null); 
        this.loadPageContent(pageId);
        setTimeout(() => this.scrollToTop(), 50);
      }
    });

    window.addEventListener('scroll', this.scrollHandler, true);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollHandler, true);
  }

  scrollToTop() {
    const container = document.querySelector('.page-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  loadPageContent(id: string) {
    const numericId = Number(id);
    if (isNaN(numericId)) return;

    this.pageService.findById(numericId).subscribe({
      next: (data: PageResponseDTO) => {
        this.page.set(data);
        
        // 1. Sanitizar contenido HTML
        this.safeContent.set(
          this.sanitizer.bypassSecurityTrustHtml(data.content || '')
        );

        // 2. CALCULAR TIEMPO DE LECTURA REAL AQUÍ
        const time = this.calculateReadingTime(data.content || '');
        this.readingTime.set(time);

        console.log('CONTENIDO CARGADO. Tiempo estimado:', time, 'min');
      },
      error: (err) => {
        console.error('Error al cargar la página:', err);
        this.snackBar.open('Error al cargar la lección', 'Cerrar', { duration: 3000 });
      }
    });
  }

  calculateReadingTime(text: string): number {
    if (!text) return 1;
    // Eliminamos etiquetas HTML antes de contar palabras para mayor precisión
    const plainText = text.replace(/<[^>]*>/g, ''); 
    const wordsPerMinute = 200; 
    const noOfWords = plainText.split(/\s+/).filter(word => word.length > 0).length; 
    const minutes = Math.ceil(noOfWords / wordsPerMinute);
    return minutes < 1 ? 1 : minutes;
  }

  getFileIcon(type: string): string {
    const icons: Record<string, string> = { 
      'pdf': 'picture_as_pdf', 'zip': 'inventory_2', 'link': 'open_in_new',
      'doc': 'description', 'docx': 'description', 'png': 'image', 'jpg': 'image'
    };
    return icons[type.toLowerCase()] || 'insert_drive_file';
  }
  
  markAsCompleted() {
    const isNowCompleted = !this.completed();
    this.completed.set(isNowCompleted);
    if (isNowCompleted) {
      this.snackBar.open('¡Lección marcada como leída!', 'Cerrar', { duration: 3000 });
    }
  }

  goBack() {
    const currentId = this.page()?.id;
    const neighbors = this.navService.getNeighbors(currentId);
    if (neighbors.prev && this.projectId) {
      this.router.navigate(['/aula', this.projectId, 'page', neighbors.prev]);
    }
  }

  goNext() {
    const currentId = this.page()?.id;
    const neighbors = this.navService.getNeighbors(currentId);
    if (neighbors.next && this.projectId) {
      this.router.navigate(['/aula', this.projectId, 'page', neighbors.next]);
    }
  }

  // downloadResource(res: any) {
  //   if (!res.url || res.url === '#') {
  //     this.snackBar.open('Recurso no disponible', 'Cerrar', { duration: 3000 });
  //     return;
  //   }
  //   window.open(res.url, '_blank', 'noopener,noreferrer');
  // }

  downloadResource(res: any) {
    if (!res.url || res.url === '#') {
      this.snackBar.open('Recurso no disponible', 'Cerrar', { duration: 3000 });
      return;
    }

    const url = res.url.toLowerCase();
    const type = (res.type || '').toLowerCase();

    const viewableExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.txt'];
    const isViewableFile = viewableExtensions.some(ext => url.endsWith(ext));
    
    const isExternalLink = type === 'link' || type === 'web' || 
                          url.includes('drive.google.com') || 
                          url.includes('docs.google.com');

    if ((isViewableFile || isExternalLink) && this.projectId) {
      // Navegamos pasando la URL original y el tipo
      this.router.navigate(['/aula', this.projectId, 'visor-recurso'], {
        queryParams: { 
          url: res.url, 
          title: res.name,
          type: res.type 
        }
      });
    } else {
      // Descarga normal para el resto
      const link = document.createElement('a');
      link.href = res.url;
      link.target = '_blank';
      link.download = res.name || 'archivo';
      link.click();
    }
  }

  //
  // private prepareUrl(url: string): string {
  //   if (!url) return '';
  //   let cleanUrl = url.trim();

  //   // CASO A: Google Drive (Convertir a modo preview)
  //   if (cleanUrl.includes('drive.google.com')) {
  //     return cleanUrl.replace(/\/view.*$/, '/preview');
  //   }

  //   // CASO B: Documentos de Office (Word, Excel, PPT) que no abren en iFrame
  //   // Los pasamos por el visor oficial de Microsoft
  //   const officeExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
  //   if (officeExtensions.some(ext => cleanUrl.toLowerCase().endsWith(ext))) {
  //     return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cleanUrl)}`;
  //   }

  //   // CASO C: PDFs externos (Como el de la UniRioja)
  //   // Usamos Google GView para evitar bloqueos de CORS/X-Frame-Options
  //   if (cleanUrl.toLowerCase().endsWith('.pdf')) {
  //     return `https://docs.google.com/gview?url=${encodeURIComponent(cleanUrl)}&embedded=true`;
  //   }

  //   return cleanUrl;
  // }

  private prepareUrl(url: string): string {
    if (!url) return '';
    let cleanUrl = url.trim();

    // 1. Google Drive
    if (cleanUrl.includes('drive.google.com')) {
      return cleanUrl.replace(/\/view.*$/, '/preview');
    }

    // 2. Si es un PDF
    if (cleanUrl.toLowerCase().endsWith('.pdf')) {
      // Si la URL es local (empieza por assets/ o http://localhost), NO usamos Google GView
      if (cleanUrl.startsWith('assets/') || cleanUrl.includes(window.location.host)) {
        return cleanUrl;
      }
      // Si es externo (como unirioja.es), usamos el puente de Google
      return `https://docs.google.com/gview?url=${encodeURIComponent(cleanUrl)}&embedded=true`;
    }

    // 3. Documentos de Office
    const officeExtensions = ['.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx'];
    if (officeExtensions.some(ext => cleanUrl.toLowerCase().endsWith(ext))) {
      return `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(cleanUrl)}`;
    }

    return cleanUrl;
  }

  // Escuchamos clics en todo el componente para manejar enlaces dentro del contenido HTML
  @HostListener('click', ['$event'])
  public onHtmlClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    const anchor = target.closest('a');

    if (anchor && anchor.getAttribute('href')) {
      const rawUrl = anchor.getAttribute('href')!;
      
      // Si es un enlace externo (no un ancla interna #)
      if (!rawUrl.startsWith('#') && this.projectId) {
        event.preventDefault(); 

        // Enviamos la URL original. El Visor la recibirá y usará el Service para formatearla.
        this.router.navigate(['/aula', this.projectId, 'visor-recurso'], {
          queryParams: { 
            url: rawUrl, 
            title: anchor.innerText || 'Recurso' 
          }
        });
      }
    }
  }

}
