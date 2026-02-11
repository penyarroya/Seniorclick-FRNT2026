// // import { Component, OnInit, inject, ViewChild } from '@angular/core';
// // import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms'; // <-- Añadido FormsModule
// // import { MatSnackBar } from '@angular/material/snack-bar';
// // import { MatFormFieldModule } from "@angular/material/form-field";
// // import { MatSelectModule } from "@angular/material/select";
// // import { MatInputModule } from "@angular/material/input";
// // import { MatIcon } from "@angular/material/icon";

// // import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';
// // import { PageService } from '../../../services/universilabs/pages/page.service';
// // import { SubtopicService } from '../../../services/universilabs/subtopics/subtopic.service';
// // import { ResourceService } from '../../../services/universilabs/resources/resource.service';

// // import { PageResponseDTO } from '../../../models/universilabas/pages/page-response.model';
// // import { SubtopicResponseDTO } from '../../../models/universilabas/subtopics/subtopic-response.model';
// // import { PageRequestDTO } from '../../../models/universilabas/pages/page-request.model';
// // import { ResourceDTO } from '../../../models/universilabas/resources/resource.model';
// // import { Router } from '@angular/router';
// // import { CommonModule } from '@angular/common';

// // @Component({
// //   selector: 'app-pages',
// //   standalone: true,
// //   imports: [
// //     CommonModule,
// //     ReactiveFormsModule,
// //     FormsModule, // <--- Obligatorio para usar [(ngModel)] en el mini formulario
// //     MaintenanceLayoutComponent,
// //     MatFormFieldModule,
// //     MatSelectModule,
// //     MatInputModule,
// //     MatIcon
// //   ],
// //   templateUrl: './pages.component.html',
// //   styleUrls: ['./pages.component.scss']
// // })
// // export class PagesComponent implements OnInit {
// // //
// //   private router = inject(Router); // <--- Añade esto

// //   @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<PageResponseDTO>;

// //   columns: ColumnConfig[] = [
// //     { key: 'title', label: 'Título de la Página', priority: 1 },
// //     { key: 'subtopicTitle', label: 'Subtema', priority: 1 },
// //     { key: 'authorName', label: 'Autor', priority: 2 }
// //   ];

// //   pageService = inject(PageService);
// //   subtopicService = inject(SubtopicService);
// //   resourceService = inject(ResourceService);
// //   private fb = inject(FormBuilder);
// //   private snack = inject(MatSnackBar);

// //   form!: FormGroup;
// //   subtopics: SubtopicResponseDTO[] = [];
// //   resources: ResourceDTO[] = [];
// //   showModal = false;
// //   isEditing = false;
// //   selectedId: number | null = null;

// //   // --- NUEVAS VARIABLES PARA RECURSOS INLINE ---
// //   textUrl: string = ''; // Usamos esto para el input de la URL
// //   newResource: ResourceDTO = {
// //     title: '',
// //     type: 'PDF',
// //     url: '',
// //     order: 0,
// //     pageId: 0
// //   };

// //   ngOnInit() {
// //     this.initForm();
// //     this.loadSubtopics();
// //   }

// //   initForm() {
// //     this.form = this.fb.group({
// //       title: ['', [Validators.required, Validators.maxLength(255)]],
// //       content: ['', [Validators.required, Validators.maxLength(10000)]],
// //       subtopicId: [null, [Validators.required]],
// //       authorId: [1, [Validators.required]]
// //     });
// //   }

// //   loadSubtopics() {
// //     this.subtopicService.list({ size: 100 }).subscribe({
// //       next: (res) => this.subtopics = res?.content || [],
// //       error: () => this.snack.open('Error al cargar subtemas', 'Cerrar')
// //     });
// //   }

// //   // --- LÓGICA DE RECURSOS ACTUALIZADA ---
// //   loadResources(pageId: number) {
// //     this.resourceService.findByPageId(pageId).subscribe({
// //       next: (data) => this.resources = data,
// //       error: () => console.error('Error al cargar recursos')
// //     });
// //   }

// //   saveNewResource() {
// //     if (!this.selectedId || !this.newResource.title || !this.textUrl) return;

// //     // Preparamos el objeto
// //     const payload: ResourceDTO = {
// //       ...this.newResource,
// //       url: this.textUrl,
// //       pageId: this.selectedId,
// //       order: this.resources.length + 1
// //     };

// //     this.resourceService.create(payload).subscribe({
// //       next: () => {
// //         this.loadResources(this.selectedId!);
// //         // Limpiamos los campos
// //         this.newResource = { title: '', type: 'PDF', url: '', order: 0, pageId: 0 };
// //         this.textUrl = '';
// //         this.snack.open('✅ Recurso añadido', 'OK', { duration: 2000 });
// //       },
// //       error: () => this.snack.open('❌ Error al añadir recurso', 'Cerrar')
// //     });
// //   }

// //   deleteResource(id: number) {
// //     if (confirm('¿Eliminar este recurso?')) {
// //       this.resourceService.delete(id).subscribe({
// //         next: () => {
// //           this.resources = this.resources.filter(r => r.id !== id);
// //           this.snack.open('Recurso eliminado', 'OK', { duration: 2000 });
// //         }
// //       });
// //     }
// //   }

// //   // --- LÓGICA DE PÁGINAS ---
// //   createPage() {
// //     this.isEditing = false;
// //     this.selectedId = null;
// //     this.resources = [];
// //     this.form.reset({ authorId: 1, content: '' });
// //     this.showModal = true;
// //   }

// //   editPage(page: PageResponseDTO) {
// //     this.isEditing = true;
// //     this.selectedId = page.id;
// //     this.showModal = true;
// //     this.form.patchValue(page);
// //     this.loadResources(page.id); 
// //   }

// //   // En pages.component.ts
// //   viewPageAsStudent(page: any) {
// //     // Redirigir a la ruta donde el estudiante consume el contenido
// //     // Ajusta la ruta '/learning/view/' según tu routing real
// //     // Coincidiendo con tu app.routes.ts: path: 'inicio/leccion/:id'
// //     this.router.navigate(['/inicio/leccion', page.id]);
    
// //     // O si prefieres abrirlo en una pestaña nueva para no perder el mantenimiento:
// //     // const url = this.router.serializeUrl(
// //     //   this.router.createUrlTree(['/learning/view', page.id])
// //     // );
// //     // window.open(url, '_blank');
// //   }

// //   // viewPageAsStudent(page: any) {
// //   //   const url = this.router.serializeUrl(
// //   //     this.router.createUrlTree(['/inicio/leccion', page.id])
// //   //   );
// //   //   // Abre la lección en otra pestaña. 
// //   //   // Tu pestaña actual sigue en /maintenance/pages intacta.
// //   //   window.open(url, '_blank');
// //   // }

// //   savePage() {
// //     if (this.form.invalid) return;
// //     const payload: PageRequestDTO = this.form.getRawValue();
// //     const request$ = this.isEditing && this.selectedId
// //       ? this.pageService.update(this.selectedId, payload)
// //       : this.pageService.create(payload);

// //     request$.subscribe({
// //       next: () => {
// //         this.snack.open('✅ Página guardada', 'OK', { duration: 3000 });
// //         this.closeModal();
// //         this.maintenanceLayout.load();
// //       },
// //       error: (err) => this.snack.open('❌ Error al guardar', 'Cerrar')
// //     });
// //   }

// //   deletePage(page: PageResponseDTO) {
// //     if (confirm(`¿Estás seguro de eliminar "${page.title}"?`)) {
// //       this.pageService.delete(page.id).subscribe(() => {
// //         this.snack.open('Página eliminada', 'OK');
// //         this.maintenanceLayout.load();
// //       });
// //     }
// //   }

// //   closeModal() { 
// //     this.showModal = false;
// //     this.resources = [];
// //     this.textUrl = '';
// //     this.newResource = { title: '', type: 'PDF', url: '', order: 0, pageId: 0 };
// //   }
// // }



// import { Component, OnInit, inject, ViewChild } from '@angular/core';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatFormFieldModule } from "@angular/material/form-field";
// import { MatSelectModule } from "@angular/material/select";
// import { MatInputModule } from "@angular/material/input";
// import { MatIcon } from "@angular/material/icon";
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';

// // LAYOUTS Y COMPONENTES
// import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';

// // SERVICIOS
// import { PageService } from '../../../services/universilabs/pages/page.service';
// import { SubtopicService } from '../../../services/universilabs/subtopics/subtopic.service';
// import { ResourceService } from '../../../services/universilabs/resources/resource.service';

// // MODELOS
// import { PageResponseDTO } from '../../../models/universilabas/pages/page-response.model';
// import { SubtopicResponseDTO } from '../../../models/universilabas/subtopics/subtopic-response.model';
// import { PageRequestDTO } from '../../../models/universilabas/pages/page-request.model';
// import { ResourceDTO } from '../../../models/universilabas/resources/resource.model';
// import { PageFormat } from '../../../models/enums/page-format.enum';

// @Component({
//   selector: 'app-pages',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     FormsModule,
//     MaintenanceLayoutComponent,
//     MatFormFieldModule,
//     MatSelectModule,
//     MatInputModule,
//     MatIcon
//   ],
//   templateUrl: './pages.component.html',
//   styleUrls: ['./pages.component.scss']
// })
// export class PagesComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private snack = inject(MatSnackBar);
//   private router = inject(Router);

//   @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<PageResponseDTO>;

//   columns: ColumnConfig[] = [
//     { key: 'title', label: 'Título', priority: 1 },
//     { key: 'subtopicTitle', label: 'Subtema', priority: 1 },
//     { key: 'format', label: 'Formato', priority: 2 },
//     { key: 'authorName', label: 'Autor', priority: 3 }
//   ];

//   pageService = inject(PageService);
//   subtopicService = inject(SubtopicService);
//   resourceService = inject(ResourceService);

//   form!: FormGroup;
//   subtopics: SubtopicResponseDTO[] = [];
//   resources: ResourceDTO[] = [];
  
//   showModal = false;
//   isEditing = false;
//   showPreview = false;
//   selectedId: number | null = null;

//   // Propiedades para nuevos recursos
//   textUrl: string = '';
//   newResource: ResourceDTO = {
//     title: '',
//     type: 'PDF',
//     url: '',
//     order: 0,
//     pageId: 0
//   };

//   ngOnInit() {
//     this.initForm();
//     this.loadSubtopics();
//   }

//   initForm() {
//     this.form = this.fb.group({
//       title: ['', [Validators.required, Validators.maxLength(255)]],
//       content: ['', [Validators.required, Validators.maxLength(10000)]],
//       format: [PageFormat.HTML, [Validators.required]],
//       subtopicId: [null, [Validators.required]],
//       authorId: [1, [Validators.required]]
//     });
//   }

//   loadSubtopics() {
//     this.subtopicService.list({ size: 100 }).subscribe({
//       next: (res) => this.subtopics = res?.content || [],
//       error: () => this.snack.open('Error al cargar subtemas', 'Cerrar')
//     });
//   }

//   loadResources(pageId: number) {
//     this.resourceService.findByPageId(pageId).subscribe({
//       next: (data) => this.resources = data,
//       error: () => console.error('Error al cargar recursos')
//     });
//   }

//   //
//   isValidUrl(url: string): boolean {
//     if (!url) return false;

//     // EXCEPCIÓN: Si empieza por '/', es una ruta local de nuestro servidor (Carpeta Public)
//     // Esto permitirá tu ruta: /pdf/Presentacion CONCEPTO COMPUTADORA.pdf
//     if (url.startsWith('/')) {
//       return true; 
//     }

//     // Validación estándar para URLs externas (http, https, www)
//     const pattern = new RegExp('^(https?:\\/\\/)?'+ 
//       '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
//       '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
//       '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
//       '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
//       '(\\#[-a-z\\d_]*)?$','i');
    
//     return !!pattern.test(url);
//   }

//   saveNewResource() {
//     if (!this.selectedId || !this.newResource.title || !this.textUrl) return;

//     // Validación de URL antes de enviar
//     if (!this.isValidUrl(this.textUrl)) {
//       this.snack.open('⚠️ La URL no es válida. Asegúrate de incluir http:// o https://', 'Entendido', { duration: 4000 });
//       return;
//     }

//     const payload: ResourceDTO = {
//       ...this.newResource,
//       url: this.textUrl,
//       pageId: this.selectedId,
//       order: this.resources.length + 1
//     };

//     this.resourceService.create(payload).subscribe({
//       next: () => {
//         this.loadResources(this.selectedId!);
//         this.newResource = { title: '', type: 'PDF', url: '', order: 0, pageId: 0 };
//         this.textUrl = '';
//         this.snack.open('✅ Recurso añadido', 'OK', { duration: 2000 });
//       },
//       error: () => this.snack.open('❌ Error al guardar el recurso', 'Cerrar')
//     });
//   }

//   deleteResource(id: number) {
//     if (confirm('¿Eliminar este recurso?')) {
//       this.resourceService.delete(id).subscribe({
//         next: () => {
//           this.resources = this.resources.filter(r => r.id !== id);
//           this.snack.open('Recurso eliminado', 'OK', { duration: 2000 });
//         }
//       });
//     }
//   }

//   createPage() {
//     this.isEditing = false;
//     this.selectedId = null;
//     this.resources = [];
//     this.showPreview = false;
//     this.form.reset({ authorId: 1, content: '', format: PageFormat.HTML });
//     this.showModal = true;
//   }

//   editPage(page: PageResponseDTO) {
//     this.isEditing = true;
//     this.selectedId = page.id;
//     this.showPreview = false;
//     this.showModal = true;
//     this.form.patchValue(page);
//     this.loadResources(page.id); 
//   }

//   viewPageAsStudent(page: any) {
//     if (!this.showModal) this.editPage(page);
//     if (this.form.get('title')?.value || this.form.get('content')?.value) {
//       this.showPreview = !this.showPreview;
//     } else {
//       this.snack.open('Escribe algo para previsualizar', 'OK', { duration: 2000 });
//     }
//   }

//   savePage() {
//     if (this.form.invalid) {
//       this.snack.open('Completa los campos obligatorios', 'Cerrar');
//       return;
//     }

//     const payload: PageRequestDTO = this.form.getRawValue();
//     const request$ = this.isEditing && this.selectedId
//       ? this.pageService.update(this.selectedId, payload)
//       : this.pageService.create(payload);

//     request$.subscribe({
//       next: (savedPage: PageResponseDTO) => {
//         this.snack.open('✅ Página guardada', 'OK', { duration: 3000 });
//         this.maintenanceLayout.load();
//         if (!this.isEditing) {
//           this.isEditing = true;
//           this.selectedId = savedPage.id;
//         } else {
//           this.closeModal();
//         }
//       },
//       error: (err) => {
//         const errorMsg = err.error?.message || 'Error al guardar';
//         this.snack.open('❌ ' + errorMsg, 'Cerrar');
//       }
//     });
//   }

//   deletePage(page: PageResponseDTO) {
//     if (confirm(`¿Estás seguro de eliminar "${page.title}"?`)) {
//       this.pageService.delete(page.id).subscribe(() => {
//         this.snack.open('Página eliminada', 'OK');
//         this.maintenanceLayout.load();
//       });
//     }
//   }

//   closeModal() { 
//     this.showModal = false;
//     this.showPreview = false;
//     this.resources = [];
//     this.textUrl = '';
//     this.newResource = { title: '', type: 'PDF', url: '', order: 0, pageId: 0 };
//     this.form.reset({ authorId: 1, content: '', format: PageFormat.HTML });
//   }
// }

import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatIcon } from "@angular/material/icon";
import { Router } from '@angular/router'; // Importado correctamente
import { CommonModule } from '@angular/common';

// LAYOUTS Y COMPONENTES
import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';

// SERVICIOS
import { PageService } from '../../../services/universilabs/pages/page.service';
import { SubtopicService } from '../../../services/universilabs/subtopics/subtopic.service';
import { ResourceService } from '../../../services/universilabs/resources/resource.service';

// MODELOS
import { PageResponseDTO } from '../../../models/universilabas/pages/page-response.model';
import { SubtopicResponseDTO } from '../../../models/universilabas/subtopics/subtopic-response.model';
import { PageRequestDTO } from '../../../models/universilabas/pages/page-request.model';
import { ResourceDTO, ResourceType } from '../../../models/universilabas/resources/resource.model';
import { PageFormat } from '../../../models/enums/page-format.enum';

@Component({
  selector: 'app-pages',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaintenanceLayoutComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIcon
  ],
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss']
})
export class PagesComponent implements OnInit {
//  
  // Inyecciones
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private router = inject(Router); // Se añade de nuevo para navegación
  
  pageService = inject(PageService);
  subtopicService = inject(SubtopicService);
  resourceService = inject(ResourceService);

  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<PageResponseDTO>;

  // Configuración de tabla
  columns: ColumnConfig[] = [
    { key: 'title', label: 'Título', priority: 1 },
    { key: 'subtopicTitle', label: 'Subtema', priority: 1 },
    { key: 'format', label: 'Formato', priority: 2 },
    { key: 'authorName', label: 'Autor', priority: 3 }
  ];

  form!: FormGroup;
  subtopics: SubtopicResponseDTO[] = [];
  resources: ResourceDTO[] = [];
  
  showModal = false;
  isEditing = false;
  showPreview = false;
  selectedId: number | null = null;

  // Variables para recursos
  textUrl: string = '';
  newResource: ResourceDTO = {
    title: '',
    type: ResourceType.PDF,
    url: '',
    order: 0,
    pageId: 0
  };

  ngOnInit() {
    this.initForm();
    this.loadSubtopics();
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      content: ['', [Validators.required, Validators.maxLength(100000)]],
      format: [PageFormat.HTML, [Validators.required]],
      subtopicId: [null, [Validators.required]],
      authorId: [1, [Validators.required]]
    });
  }

  loadSubtopics() {
    this.subtopicService.list({ size: 100 }).subscribe({
      next: (res) => this.subtopics = res?.content || [],
      error: () => this.snack.open('Error al cargar subtemas', 'Cerrar')
    });
  }

  loadResources(pageId: number) {
    this.resourceService.findByPageId(pageId).subscribe({
      next: (data) => this.resources = data,
      error: () => console.error('Error al cargar recursos')
    });
  }

  // Método mejorado para guardar recursos con validaciones
  saveNewResource() {
    // 1. Limpiamos la URL de espacios accidentales al inicio/final
    const urlToSave = this.textUrl ? this.textUrl.trim() : '';

    // 2. Verificación de campos obligatorios
    if (!this.selectedId || !this.newResource.title || !urlToSave) {
      this.snack.open('⚠️ Completa el título y la URL', 'OK', { duration: 2000 });
      return;
    }

    // 3. Validación lógica (Acepta /ruta/local o http://...)
    if (!this.isValidUrl(urlToSave)) {
      this.snack.open('⚠️ URL no válida. Ej: http://... o /pdf/...', 'Entendido', { duration: 4000 });
      return;
    }

    // 4. Construcción del Payload
    const payload: ResourceDTO = {
      ...this.newResource,
      url: urlToSave, // Usamos la URL ya limpia
      pageId: this.selectedId,
      order: this.resources.length + 1
    };

    // 5. Petición al servicio
    this.resourceService.create(payload).subscribe({
      next: () => {
        this.loadResources(this.selectedId!);
        // Limpieza de formulario
        this.newResource = { title: '', type: ResourceType.PDF, url: '', order: 0, pageId: 0 };
        this.textUrl = '';
        this.snack.open('✅ Recurso añadido', 'OK', { duration: 2000 });
      },
      error: (err) => {
        console.error(err);
        this.snack.open('❌ Error al guardar recurso', 'Cerrar');
      }
    });
  }

  /** * Asegúrate de que tu isValidUrl sea así para que el '/' funcione:
   */
  isValidUrl(url: string): boolean {
    if (!url) return false;
    
    // Si empieza con '/', saltamos la validación de RegExp y devolvemos true
    if (url.startsWith('/')) return true;

    // Si no es local, validamos que sea una URL web correcta
    const pattern = new RegExp('^(https?:\\/\\/)?'+ 
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ 
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ 
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ 
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ 
      '(\\#[-a-z\\d_]*)?$','i');
    
    return !!pattern.test(url);
  }

  //
  deleteResource(id: number) {
    if (confirm('¿Eliminar este recurso?')) {
      this.resourceService.delete(id).subscribe({
        next: () => {
          this.resources = this.resources.filter(r => r.id !== id);
          this.snack.open('Recurso eliminado', 'OK', { duration: 2000 });
        }
      });
    }
  }

  createPage() {
    this.isEditing = false;
    this.selectedId = null;
    this.resources = [];
    this.showPreview = false;
    this.form.reset({ authorId: 1, content: '', format: PageFormat.HTML });
    this.showModal = true;
  }

  editPage(page: PageResponseDTO) {
    this.isEditing = true;
    this.selectedId = page.id;
    this.showPreview = false;
    this.showModal = true;
    this.form.patchValue(page);
    this.loadResources(page.id); 
  }

  // Permite previsualizar en el modal o navegar a la lección
  viewPageAsStudent(page: any) {
    // Si queremos previsualización interna
    if (this.showModal) {
      this.showPreview = !this.showPreview;
    } else {
      // Si queremos navegar directamente desde la tabla
      this.router.navigate(['/inicio/leccion', page.id]);
    }
  }

  // savePage() {
  //   if (this.form.invalid) {
  //     this.snack.open('Completa los campos obligatorios', 'Cerrar');
  //     return;
  //   }

  //   const payload: PageRequestDTO = this.form.getRawValue();
  //   const request$ = this.isEditing && this.selectedId
  //     ? this.pageService.update(this.selectedId, payload)
  //     : this.pageService.create(payload);

  //   request$.subscribe({
  //     next: (savedPage: PageResponseDTO) => {
  //       this.snack.open('✅ Página guardada', 'OK', { duration: 3000 });
  //       this.maintenanceLayout.load();
        
  //       // IMPORTANTE: Si es nueva, pasamos a modo edición para permitir recursos
  //       if (!this.isEditing) {
  //         this.isEditing = true;
  //         this.selectedId = savedPage.id;
  //       } else {
  //         this.closeModal();
  //       }
  //     },
  //     error: (err) => {
  //       const errorMsg = err.error?.message || 'Error al guardar';
  //       this.snack.open('❌ ' + errorMsg, 'Cerrar');
  //     }
  //   });
  // }

  savePage() {
    if (this.form.invalid) {
      this.snack.open('Completa los campos obligatorios', 'Cerrar');
      return;
    }

    const payload: PageRequestDTO = this.form.getRawValue();
    const request$ = this.isEditing && this.selectedId
      ? this.pageService.update(this.selectedId, payload)
      : this.pageService.create(payload);

    request$.subscribe({
      next: (savedPage: PageResponseDTO) => {
        this.snack.open('✅ Página guardada', 'OK', { duration: 3000 });
        this.maintenanceLayout.load();
        
        // SOLUCIÓN AQUÍ: Usamos setTimeout para evitar el error NG0100
        if (!this.isEditing) {
          setTimeout(() => {
            this.isEditing = true;
            this.selectedId = savedPage.id;
          });
        } else {
          this.closeModal();
        }
      },
      error: (err) => {
        const errorMsg = err.error?.message || 'Error al guardar';
        this.snack.open('❌ ' + errorMsg, 'Cerrar');
      }
    });
  }

  deletePage(page: PageResponseDTO) {
    if (confirm(`¿Estás seguro de eliminar "${page.title}"?`)) {
      this.pageService.delete(page.id).subscribe(() => {
        this.snack.open('Página eliminada', 'OK');
        this.maintenanceLayout.load();
      });
    }
  }

  closeModal() { 
    this.showModal = false;
    this.showPreview = false;
    this.resources = [];
    this.textUrl = '';
    this.newResource = { title: '', type: ResourceType.PDF, url: '', order: 0, pageId: 0 };
    this.form.reset({ authorId: 1, content: '', format: PageFormat.HTML });
  }

  // Método para detectar tipo de recurso basado en la URL
  autoDetectType(url: string) {
    if (!url) return;
    const cleanUrl = url.toLowerCase().trim();

    // Extensiones de video comunes o dominios de video
    const videoPatterns = ['.mp4', '.mov', 'youtube.com', 'youtu.be', 'vimeo.com'];
    const imagePatterns = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];

    // if (videoPatterns.some(p => cleanUrl.includes(p))) {
    //   this.newResource.type = 'VIDEO';
    // } else if (imagePatterns.some(p => cleanUrl.includes(p))) {
    //   this.newResource.type = 'IMAGE';
    // } else if (cleanUrl.endsWith('.pdf')) {
    //   this.newResource.type = 'PDF';
    // } else if (cleanUrl.startsWith('http')) {
    //   this.newResource.type = 'LINK';
    // }

    if (videoPatterns.some(p => cleanUrl.includes(p))) {
      this.newResource.type = ResourceType.VIDEO; // Antes 'VIDEO'
    } else if (imagePatterns.some(p => cleanUrl.includes(p))) {
      this.newResource.type = ResourceType.IMAGE; // Antes 'IMAGE'
    } else if (cleanUrl.endsWith('.pdf')) {
      this.newResource.type = ResourceType.PDF;   // Antes 'PDF'
    } else if (cleanUrl.startsWith('http')) {
      this.newResource.type = ResourceType.LINK;  // Antes 'LINK'
    }
  }
}