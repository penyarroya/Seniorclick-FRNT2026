// import { Component, OnInit, OnDestroy, inject, HostListener, ChangeDetectorRef, signal } from '@angular/core';
// import { CommonModule, Location } from '@angular/common';
// import { ActivatedRoute } from '@angular/router';
// import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
// import { ResourceFormatterService } from '../../../services/viewers/resource-formatter.service';
// import { MatIconModule } from '@angular/material/icon';
// import { ViewerCommunicationService } from '../../../services/viewers/viewer-communication.service';
// import { trigger, transition, style, animate } from '@angular/animations';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-resource-full-page',
//   standalone: true,
//   imports: [CommonModule, MatIconModule],
//   templateUrl: './resource-full-page.component.html',
//   styleUrl: './resource-full-page.component.scss',
//   animations: [
//     trigger('fadeSlide', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'translate(-50%, -5px)' }), 
//         animate('100ms cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: 'translate(-50%, 0)' }))
//       ]),
//       transition(':leave', [
//         animate('80ms linear', style({ opacity: 0 }))
//       ])
//     ])
//   ]
// })
// export class ResourceFullPageComponent implements OnInit, OnDestroy {
//   private route = inject(ActivatedRoute);
//   private sanitizer = inject(DomSanitizer);
//   private formatter = inject(ResourceFormatterService);
//   private viewerComm = inject(ViewerCommunicationService);
//   private location = inject(Location);
//   private cdr = inject(ChangeDetectorRef);
  
//   private loadingTimeout: any;
//   private queryParamsSub?: Subscription;

//   // Estados con Signals
//   public showExternalLinkHint = signal(false);
//   public isLoading = signal(true);
//   public hasError = signal(false);
  
//   // Propiedades del componente
//   title: string = '';
//   safeUrl: SafeResourceUrl | null = null;
//   rawUrl: string = ''; 
//   isMp4: boolean = false; // Corregido: ya no dará error en el HTML
//   isFullscreen: boolean = false;

//   @HostListener('document:fullscreenchange', [])
//   onFullscreenChange() {
//     this.isFullscreen = !!document.fullscreenElement;
//   }

//  ngOnInit() {
//     document.body.style.overflow = 'hidden';
//     this.viewerComm.setViewerStatus(true);

//     // 3. Guardamos la suscripción en la variable
//     this.queryParamsSub = this.route.queryParams.subscribe(params => {
      
//       // RESET TOTAL: Antes de procesar la nueva URL, limpiamos todo rastro anterior
//       if (this.loadingTimeout) {
//         clearTimeout(this.loadingTimeout);
//         this.loadingTimeout = null;
//       }
      
//       this.isLoading.set(true); 
//       this.showExternalLinkHint.set(false); 
//       this.safeUrl = null; // 👈 Esto destruye el iframe físicamente en el HTML
//       this.rawUrl = params['url'] || '';
//       this.title = params['title'] || 'Recurso';
//       this.isMp4 = this.rawUrl.toLowerCase().endsWith('.mp4');

//       this.cdr.detectChanges(); 

//       if (this.rawUrl) {
//         // CACHE BUSTER dinámico
//         const uniqueId = `v=${new Date().getTime()}`;
//         const finalUrl = this.rawUrl.includes('?') 
//           ? `${this.rawUrl}&${uniqueId}` 
//           : `${this.rawUrl}?${uniqueId}`;

//         const formatted = this.formatter.format(finalUrl, params['type']);
//         const isExternal = this.rawUrl.startsWith('http') && !this.rawUrl.includes(window.location.hostname);
//         const isPdf = this.rawUrl.toLowerCase().includes('.pdf');

//         // 4. Aumentamos ligeramente el delay (200ms) para que Angular 
//         // tenga tiempo de eliminar el iframe viejo antes de crear el nuevo
//         setTimeout(() => {
//           this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(formatted);
//           this.cdr.detectChanges(); 

//            const waitTime = !isExternal ? 4000 : (isPdf ? 30000 : 15000);
//           // 🧪 CAMBIO TEMPORAL PARA TEST: Reducimos a 3 segundos

//           this.loadingTimeout = setTimeout(() => {
//             if (this.isLoading()) {
//               this.showExternalLinkHint.set(true);
//               this.isLoading.set(false); 
//               this.cdr.detectChanges();
//               console.warn("⏰ Tiempo agotado. Mostrando ayuda.");
//             }
//           }, waitTime); 

//         }, 200); 
//       } else {
//         this.isLoading.set(false);
//         this.cdr.detectChanges();
//       }
//     });
//   }

//   onResourceLoad() {
//     const isPdf = this.rawUrl.toLowerCase().includes('.pdf');
//     const safetyDelay = isPdf ? 1500 : 400;

//     setTimeout(() => {
//       // 🧪 COMENTAMOS ESTO SOLO PARA LA PRUEBA:
//       /*
//       if (this.loadingTimeout) {
//         clearTimeout(this.loadingTimeout);
//         this.loadingTimeout = null;
//       }
//       */
      
//       this.isLoading.set(false);
//       // this.showExternalLinkHint.set(false); // 🧪 También comenta esto para que no se oculte sola
//       this.cdr.detectChanges();
//       console.log('✅ Recurso cargado (pero el timer de la alerta sigue corriendo)');
//     }, safetyDelay);
//   }



//   // ngOnInit() {
//   //   document.body.style.overflow = 'hidden';
//   //   this.viewerComm.setViewerStatus(true);

//   //   this.queryParamsSub = this.route.queryParams.subscribe(params => {
      
//   //     // 1. LIMPIEZA PREVIA (Fundamental para evitar colisiones de timers)
//   //     if (this.loadingTimeout) {
//   //       clearTimeout(this.loadingTimeout);
//   //       this.loadingTimeout = null;
//   //     }
      
//   //     this.isLoading.set(true); 
//   //     this.showExternalLinkHint.set(false); 
//   //     this.safeUrl = null; 
//   //     this.rawUrl = params['url'] || '';
//   //     this.title = params['title'] || 'Recurso';
//   //     this.isMp4 = this.rawUrl.toLowerCase().endsWith('.mp4');

//   //     this.cdr.detectChanges(); 

//   //     if (this.rawUrl) {
//   //       // CACHE BUSTER
//   //       const uniqueId = `v=${new Date().getTime()}`;
//   //       const finalUrl = this.rawUrl.includes('?') 
//   //         ? `${this.rawUrl}&${uniqueId}` 
//   //         : `${this.rawUrl}?${uniqueId}`;

//   //       const formatted = this.formatter.format(finalUrl, params['type']);
//   //       const isExternal = this.rawUrl.startsWith('http') && !this.rawUrl.includes(window.location.hostname);
//   //       const isPdf = this.rawUrl.toLowerCase().includes('.pdf');

//   //       setTimeout(() => {
//   //         this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(formatted);
//   //         this.cdr.detectChanges(); 

//   //         // 2. CÁLCULO DE TIEMPO DE ESPERA
//   //         // Aumentamos a 20s para externos normales y 45s para PDFs pesados
//   //         const waitTime = !isExternal ? 5000 : (isPdf ? 45000 : 20000);

//   //         this.loadingTimeout = setTimeout(() => {
//   //           // 3. SOLO DISPARAR ERROR SI SIGUE CARGANDO
//   //           if (this.isLoading()) {
//   //             console.warn("⏰ Tiempo agotado. El recurso parece no responder.");
//   //             this.handleResourceError(); // <-- Usamos la función centralizada
//   //           }
//   //         }, waitTime); 

//   //       }, 200); 
//   //     } else {
//   //       this.isLoading.set(false);
//   //       this.cdr.detectChanges();
//   //     }
//   //   });
//   // }


//   // onResourceLoad() {
//   //   if (this.loadingTimeout) {
//   //     clearTimeout(this.loadingTimeout);
//   //     this.loadingTimeout = null;
//   //   }
    
//   //   // Pequeño delay para asegurar que el renderizado terminó
//   //   setTimeout(() => {
//   //     this.isLoading.set(false);
//   //     this.showExternalLinkHint.set(false); 
//   //     this.cdr.detectChanges();
//   //     console.log('✅ Recurso cargado correctamente');
//   //   }, 500);
//   // }

//   // handleResourceError() {
//   //   console.error("❌ Error o tiempo de espera agotado.");
//   //   if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
    
//   //   this.isLoading.set(false);
//   //   this.showExternalLinkHint.set(true); 
//   //   this.cdr.detectChanges();
//   // }

//   // private resetState() {
//   //   if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
//   //   this.isLoading.set(true);
//   //   this.showExternalLinkHint.set(false);
//   //   this.safeUrl = null;
//   // }


//   //
//   toggleFullscreen() {
//     if (!document.fullscreenElement) {
//       document.documentElement.requestFullscreen().catch(err => {
//         console.error(`Error al entrar en fullscreen: ${err.message}`);
//       });
//     } else {
//       if (document.exitFullscreen) {
//         document.exitFullscreen();
//       }
//     }
//   }

//   // 5. El ngOnDestroy es fundamental para que el segundo clic funcione
//   ngOnDestroy() {
//     // Matamos la suscripción para que no haya "fantasmas"
//     if (this.queryParamsSub) {
//       this.queryParamsSub.unsubscribe();
//     }

//     // Limpiamos el timer
//     if (this.loadingTimeout) {
//       clearTimeout(this.loadingTimeout);
//     }

//     // Reseteamos estados físicos
//     this.safeUrl = null;
//     this.isLoading.set(true);
    
//     // Devolvemos el scroll al body
//     document.body.style.overflow = 'auto';
    
//     // Avisamos a los servicios
//     this.viewerComm.setViewerStatus(false);
//     this.viewerComm.clearResource();

//     this.cdr.detectChanges();
//     console.log('🧹 Componente destruido y listo para una carga limpia.');
//   }

//   //
//   goBack() {
//     this.location.back();
//   }
// }



import { Component, OnInit, OnDestroy, inject, HostListener, ChangeDetectorRef, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ResourceFormatterService } from '../../../services/viewers/resource-formatter.service';
import { MatIconModule } from '@angular/material/icon';
import { ViewerCommunicationService } from '../../../services/viewers/viewer-communication.service';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-resource-full-page',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './resource-full-page.component.html',
  styleUrl: './resource-full-page.component.scss',
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translate(-50%, -5px)' }), 
        animate('100ms cubic-bezier(0, 0, 0.2, 1)', style({ opacity: 1, transform: 'translate(-50%, 0)' }))
      ]),
      transition(':leave', [
        animate('80ms linear', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ResourceFullPageComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);
  private formatter = inject(ResourceFormatterService);
  private viewerComm = inject(ViewerCommunicationService);
  private location = inject(Location);
  private cdr = inject(ChangeDetectorRef);
  
  private loadingTimeout: any;
  private queryParamsSub?: Subscription;

  // Estados con Signals
  public showExternalLinkHint = signal(false);
  public isLoading = signal(true);
  
  // Propiedades
  title: string = '';
  safeUrl: SafeResourceUrl | null = null;
  rawUrl: string = ''; 
  isMp4: boolean = false;
  isFullscreen: boolean = false;

  @HostListener('document:fullscreenchange', [])
  onFullscreenChange() {
    this.isFullscreen = !!document.fullscreenElement;
  }

  ngOnInit() {
    document.body.style.overflow = 'hidden';
    this.viewerComm.setViewerStatus(true);

    this.queryParamsSub = this.route.queryParams.subscribe(params => {
      
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = null;
      }
      
      this.isLoading.set(true); 
      this.showExternalLinkHint.set(false); 
      this.safeUrl = null; 
      this.rawUrl = params['url'] || '';
      this.title = params['title'] || 'Recurso';
      this.isMp4 = this.rawUrl.toLowerCase().endsWith('.mp4');

      this.cdr.detectChanges(); 

      if (this.rawUrl) {
        const uniqueId = `v=${new Date().getTime()}`;
        const finalUrl = this.rawUrl.includes('?') 
          ? `${this.rawUrl}&${uniqueId}` 
          : `${this.rawUrl}?${uniqueId}`;

        const formatted = this.formatter.format(finalUrl, params['type']);
        const isExternal = this.rawUrl.startsWith('http') && !this.rawUrl.includes(window.location.hostname);
        const isPdf = this.rawUrl.toLowerCase().includes('.pdf');

        setTimeout(() => {
          this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(formatted);
          this.cdr.detectChanges(); 

          // const waitTime = !isExternal ? 4000 : (isPdf ? 30000 : 15000);
          // Ejemplo: 3s para internos, 15s para PDFs y 8s para el resto.
          const waitTime = !isExternal ? 3000 : (isPdf ? 15000 : 8000);

          this.loadingTimeout = setTimeout(() => {
            if (this.isLoading()) {
              this.showExternalLinkHint.set(true);
              this.isLoading.set(false); 
              this.cdr.detectChanges();
              console.warn("⏰ Tiempo agotado. Mostrando ayuda.");
            }
          }, waitTime); 

        }, 200); 
      } else {
        this.isLoading.set(false);
        this.cdr.detectChanges();
      }
    });
  }

  //
  onResourceLoad() {
    const isPdf = this.rawUrl.toLowerCase().includes('.pdf');
    const safetyDelay = isPdf ? 1500 : 400;

    setTimeout(() => {
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = null;
      }
      // Aseguramos que el cargando se quite y la ayuda se oculte si el recurso cargó
      this.isLoading.set(false);
      this.showExternalLinkHint.set(false); 
      
      this.cdr.detectChanges();
      console.log('✅ Recurso cargado correctamente');
    }, safetyDelay);
  }

  // Esta función es tu "Plan B" si el enlace falla explícitamente
  handleResourceError() {
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
      this.loadingTimeout = null;
    }
    this.isLoading.set(false);
    this.showExternalLinkHint.set(true); // Mostramos la alerta de "Abrir fuera" inmediatamente
    this.cdr.detectChanges();
    console.error('❌ El recurso no pudo cargarse o el enlace está roto');
  }

  //
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error al entrar en fullscreen: ${err.message}`);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  ngOnDestroy() {
    if (this.queryParamsSub) this.queryParamsSub.unsubscribe();
    if (this.loadingTimeout) clearTimeout(this.loadingTimeout);
    this.safeUrl = null;
    this.isLoading.set(true);
    document.body.style.overflow = 'auto';
    this.viewerComm.setViewerStatus(false);
    this.viewerComm.clearResource();
    this.cdr.detectChanges();
  }

  goBack() {
    this.location.back();
  }
}