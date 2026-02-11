// import { Component, OnInit, inject, ViewChild, ChangeDetectorRef, signal, Input } from '@angular/core';
// import { AsyncPipe, CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatIconModule } from '@angular/material/icon';
// import { MatButtonModule } from '@angular/material/button';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';

// import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';
// import { ContributionService } from '../../../services/universilabs/contributions/contribution.service';
// import { ContributionResponseDTO } from '../../../models/universilabas/contributions/contribution-response.model';
// import { AuthService } from '../../../../core/services/auth/auth.service';
// import { map, Observable } from 'rxjs';
// import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { PageService } from '../../../services/universilabs/pages/page.service';

// @Component({
//   selector: 'app-contribution',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     MatAutocompleteModule, 
//     AsyncPipe,
//     MatIconModule,
//     MatButtonModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MaintenanceLayoutComponent
//   ],
//   templateUrl: './contribution.component.html',
//   styleUrls: ['./contribution.component.scss']
// })
// export class ContributionComponent implements OnInit {
// //
//   // Lista de páginas que vienen del servidor
//   paginasSistema: any[] = []; 
//   // El observable que maneja el filtrado en tiempo real
//   paginasFiltradas!: Observable<any[]>; 
//   // Si no tenías inyectado el servicio de páginas, asegúrate de tenerlo
//   private pageService = inject(PageService);  
  
//   // Inyección de servicios
//   public contributionService = inject(ContributionService);
//   private authService = inject(AuthService);
//   private snack = inject(MatSnackBar);
//   private fb = inject(FormBuilder);

//   // Añade estas variables para mantener los IDs que no se ven en el form
//   private selectedUserId: number | null = null;
//   private selectedPageId: number | null = null;

//   @Input() mode: 'admin' | 'user' = 'admin';

//   // Referencia al Layout para refrescar la tabla tras cambios
//   @ViewChild(MaintenanceLayoutComponent) 
//   maintenanceLayout!: MaintenanceLayoutComponent<ContributionResponseDTO>;

//   private cdr = inject(ChangeDetectorRef);
//   isSaving = signal(false);

//   // Estado del componente
//   form!: FormGroup;
//   showModal = false;
//   isEditing = false;
//   selectedId: number | null = null;

//   // Configuración de columnas para la tabla
//   columns: ColumnConfig[] = [
//     { key: 'username', label: 'Usuario', priority: 1 },
//     { key: 'pageTitle', label: 'Página', priority: 1 },
//     { key: 'content', label: 'Contribución', priority: 1 },
//     { key: 'createdAt', label: 'Fecha', priority: 2 }
//   ];

//   // ngOnInit(): void {
//   //   this.initForm();
//   //   this.cdr.detectChanges(); // 3. Forzar detección de cambios después de iniciar el formulario
//   // }

//   ngOnInit(): void {
//   this.initForm();
//     this.configureMaintenanceMode(); // Configuración lógica del modo
//     this.cdr.detectChanges();
//   }

  

//     /**
//    * Determina qué texto se muestra en el input cuando se selecciona una página
//    * @param pagina El objeto de la página seleccionada
//    */
//   displayFn(pagina: any): string {
//     // Si 'pagina' existe y tiene la propiedad 'title', devolvemos el título.
//     // De lo contrario, devolvemos un string vacío.
//     return pagina && pagina.title ? pagina.title : '';
//   }

//   /**
//    * Inicializa el formulario reactivo con validaciones.
//    * Se añade validación de longitud mínima para el contenido.
//    */
//   // initForm() {
//   //   this.form = this.fb.group({
//   //     username: ['', [Validators.required, Validators.minLength(3)]],
//   //     content: ['', [
//   //       Validators.required, 
//   //       Validators.minLength(10), 
//   //       Validators.maxLength(5000)
//   //     ]],
//   //     pageTitle: [{ value: '', disabled: true }] // Deshabilitado porque suele venir de la lección
//   //   });
//   // }

//   initForm() {
//     this.form = this.fb.group({
//       username: ['', [Validators.required, Validators.minLength(3)]],
//       content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
//       pageTitle: [{ value: '', disabled: false }, [Validators.required]], // Lo habilitamos para poder escribir
//       slug: [{ value: '', disabled: true }] // Campo para el slug automático
//     });

//     // ESCUCHA DE CAMBIOS: Aquí es donde sucede la magia
//     this.form.get('pageTitle')?.valueChanges.subscribe(value => {
//       if (value && !this.isEditing) { // Solo autogenerar si estamos creando, no editando
//         const generatedSlug = this.maintenanceLayout.convertToSlug(value);
//         this.form.patchValue({ slug: generatedSlug }, { emitEvent: false });
//       }
//     });
//   }

//   private configureMaintenanceMode() {
//     const user = this.authService.currentUserValue;

//     if (this.mode === 'user' && user) {
//       // 2. Ajustamos las columnas: En el perfil personal no necesito ver mi propio nombre
//       this.columns = [
//         { key: 'pageTitle', label: 'Lección', priority: 1 },
//         { key: 'content', label: 'Mi Aporte', priority: 1 },
//         { key: 'createdAt', label: 'Fecha', priority: 2 }
//       ];

//       // 3. TRUCO PARA EL LAYOUT: 
//       // Sobreescribimos el método list del servicio SOLO para esta instancia del componente
//       // para que el MaintenanceLayout use getByUser pero crea que está llamando a list.
//       this.contributionService.list = (request: any) => {
//         return this.contributionService.getByUser(user.userId).pipe(
//           // Mapeamos el Array a un formato de "página" ficticia para que el layout no rompa
//           map(data => ({
//             content: data,
//             totalElements: data.length,
//             size: data.length,
//             number: 0
//           }))
//         );
//       };
//     }
//   }

//   /**
//    * Prepara el modal para crear una nueva contribución (resetea el form)
//    */
//   // createContribution() {
//   //   this.isEditing = false;
//   //   this.selectedId = null;
//   //   this.form.reset();
//   //   // Habilitar temporalmente si fuera necesario asignar página al crear manualmente
//   //   this.form.get('pageTitle')?.enable(); 
//   //   this.showModal = true;
//   // }

//   createContribution() {
//     this.isEditing = false;
//     this.selectedId = null;
//     this.form.reset();

//     // 1. Obtenemos el usuario del BehaviorSubject de forma síncrona
//     const user = this.authService.currentUserValue;

//     if (user) {
//       this.selectedUserId = user.userId; // Asignamos el ID para el payload
//       this.form.patchValue({
//         username: user.username // Rellenamos el nombre en el campo visual
//       });
//     }

//     this.form.get('pageTitle')?.enable(); 
//     this.showModal = true;
//   }

//   /**
//    * Prepara el modal para ver o editar una contribución existente
//    */
//   // openViewModal(contribution: ContributionResponseDTO) {
//   //   this.isEditing = true;
//   //   this.selectedId = contribution.id as number;
//   //   this.showModal = true;
    
//   //   this.form.patchValue({
//   //     username: contribution.username,
//   //     content: contribution.content,
//   //     pageTitle: contribution.pageTitle
//   //   });
    
//   //   this.form.get('pageTitle')?.disable(); // Mantener bloqueado en edición
//   // }

//   openViewModal(contribution: ContributionResponseDTO) {
//     this.isEditing = true;
//     this.selectedId = contribution.id;
//     this.selectedUserId = contribution.userId; // Guardamos el ID del autor
//     this.selectedPageId = contribution.pageId; // Guardamos el ID de la página
//     this.showModal = true;
    
//     this.form.patchValue({
//       username: contribution.username,
//       content: contribution.content,
//       pageTitle: contribution.pageTitle
//     });
    
//     this.form.get('pageTitle')?.disable();
//   }

//   //
//   // saveContribution() {
//   //   if (this.form.invalid) {
//   //     this.snack.open('⚠️ Por favor, revisa las validaciones del formulario', 'Cerrar', { duration: 3000 });
//   //     return;
//   //   }

//   //   // 1. Bloqueamos acciones para evitar duplicados y errores de canal
//   //   this.isSaving.set(true);

//   //   const payload = this.form.getRawValue();
//   //   const request$ = this.isEditing && this.selectedId
//   //     ? this.contributionService.update(this.selectedId, payload)
//   //     : this.contributionService.create(payload);

//   //   request$.subscribe({
//   //     next: () => {
//   //       this.snack.open(
//   //         `✅ Aporte ${this.isEditing ? 'actualizado' : 'creado'} correctamente`, 
//   //         'OK', 
//   //         { duration: 3000 }
//   //       );
//   //       this.closeModal();
//   //       this.maintenanceLayout.load();
//   //       // 2. Liberamos el estado
//   //       this.isSaving.set(false);
//   //     },
//   //     error: (err) => {
//   //       console.error('Error al guardar:', err);
//   //       this.snack.open('❌ Error al guardar la contribución', 'Cerrar');
//   //       // 3. Liberamos el estado incluso en caso de error
//   //       this.isSaving.set(false);
//   //     }
//   //   });
//   // }

//   saveContribution() {
//     if (this.form.invalid) {
//       this.snack.open('⚠️ Por favor, revisa las validaciones del formulario', 'Cerrar', { duration: 3000 });
//       return;
//     }

//     // VALIDACIÓN DE SEGURIDAD: 
//     // Evitamos enviar la petición si no tenemos los IDs necesarios
//     if (!this.selectedUserId || (!this.isEditing && !this.selectedPageId)) {
//       this.snack.open('❌ Error: Falta información del usuario o la página', 'Cerrar');
//       return;
//     }

//     this.isSaving.set(true);

//     // 1. Obtenemos todos los valores, incluyendo los deshabilitados (como el slug autogenerado)
//     const rawValues = this.form.getRawValue();

//     // 2. Construimos el payload integrando el slug para tu backend
//     const payload = {
//       content: rawValues.content,
//       userId: this.selectedUserId, 
//       pageId: this.selectedPageId,
//       // Si el formulario tiene un campo 'slug', lo enviamos. 
//       // Si no, lo generamos al vuelo usando la utilidad del layout.
//       slug: rawValues.slug || this.maintenanceLayout.convertToSlug(rawValues.pageTitle)
//     };

//     const request$ = this.isEditing && this.selectedId
//       ? this.contributionService.update(this.selectedId, payload)
//       : this.contributionService.create(payload);

//     request$.subscribe({
//       next: () => {
//         this.snack.open(
//           `✅ Aporte ${this.isEditing ? 'actualizado' : 'creado'} correctamente`, 
//           'OK', 
//           { duration: 3000 }
//         );
//         this.closeModal();
//         this.maintenanceLayout.load(); // Refresca la tabla del layout
//         this.isSaving.set(false);
//       },
//       error: (err) => {
//         console.error('Error al guardar:', err);
//         this.snack.open('❌ Error al guardar la contribución', 'Cerrar');
//         this.isSaving.set(false);
//       }
//     });
//   }
  
//   //
//   deleteContribution(contribution?: ContributionResponseDTO) {
//     // 1. Obtenemos el ID de cualquiera de las dos fuentes
//     const idToDelete = contribution?.id ?? this.selectedId;

//     // 2. IMPORTANTE: Si es null o undefined, salimos inmediatamente.
//     // Esto "limpia" el tipo para el resto de la función.
//     if (idToDelete === null || idToDelete === undefined) {
//       return;
//     }

//     // Ahora 'idToDelete' es puramente un 'number' para TypeScript
//     if (confirm(`¿Estás seguro de que deseas eliminar este registro?`)) {
//       this.isSaving.set(true);
      
//       this.contributionService.delete(idToDelete).subscribe({
//         next: () => {
//           this.snack.open('✅ Eliminado correctamente', 'OK', { duration: 3000 });
//           this.closeModal();
//           this.maintenanceLayout.load();
//           this.isSaving.set(false);
//         },
//         error: (err) => {
//           console.error('Error al eliminar:', err);
//           this.snack.open('❌ No se pudo eliminar', 'Cerrar');
//           this.isSaving.set(false);
//         }
//       });
//     }
//   }

//   /**
//    * Cierra el modal y limpia el estado de edición
//    */
//   closeModal() {
//     this.showModal = false;
//     this.isEditing = false;
//     this.selectedId = null;
//     this.form.reset();
//   }
// }

import { Component, OnInit, inject, ViewChild, ChangeDetectorRef, signal, Input, HostListener, ElementRef } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule, MatAutocompleteTrigger } from '@angular/material/autocomplete';

import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { ContributionService } from '../../../services/universilabs/contributions/contribution.service';
import { ContributionResponseDTO } from '../../../models/universilabas/contributions/contribution-response.model';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { PageService } from '../../../services/universilabs/pages/page.service';
import { debounceTime, distinctUntilChanged, map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-contribution',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule, 
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MaintenanceLayoutComponent
  ],
  templateUrl: './contribution.component.html',
  styleUrls: ['./contribution.component.scss']
})
export class ContributionComponent implements OnInit {
  // Inyección de servicios
  private pageService = inject(PageService);  
  public contributionService = inject(ContributionService);
  private authService = inject(AuthService);
  private snack = inject(MatSnackBar);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  // Búsqueda de páginas
  paginasSistema: any[] = []; 
  paginasFiltradas!: Observable<any[]>; 

  // Estado del formulario e IDs
  private selectedUserId: number | null = null;
  private selectedPageId: number | null = null;
  @Input() mode: 'admin' | 'user' = 'admin';
  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<ContributionResponseDTO>;

  // Cambiamos el nombre de la variable para que coincida con la lógica
  @ViewChild('trigger', { read: MatAutocompleteTrigger }) autocomplete!: MatAutocompleteTrigger;
  @ViewChild('pageField', { read: ElementRef }) pageField!: ElementRef;

  isSaving = signal(false);
  form!: FormGroup;
  showModal = false;
  isEditing = false;
  selectedId: number | null = null;

  columns: ColumnConfig[] = [
    { key: 'username', label: 'Usuario', priority: 1 },
    { key: 'pageTitle', label: 'Página', priority: 1 },
    { key: 'content', label: 'Contribución', priority: 1 },
    { key: 'createdAt', label: 'Fecha', priority: 2 }
  ];

  ngOnInit(): void {
    this.initForm();
    this.configureMaintenanceMode();
    this.cargarPaginasDelSistema();

    // Configuración del Autocomplete Optimizada
    this.paginasFiltradas = this.form.get('pageTitle')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(value => {
        const name = typeof value === 'string' ? value : value?.title;
        const filterValue = name ? name.trim() : '';
        
        // Forzamos detección para que el icono (Lupa/X) cambie rápido
        this.cdr.detectChanges(); 
        
        return filterValue ? this._filter(filterValue) : this.paginasSistema.slice();
      })
    );

    // Lógica de actualización de Slug (Ya la tenías, se mantiene igual)
    this.form.get('pageTitle')?.valueChanges.subscribe(value => {
      if (value && typeof value === 'object') {
        this.selectedPageId = value.id;
        const generatedSlug = value.slug || '';
        this.form.patchValue({ slug: generatedSlug }, { emitEvent: false });
      } else if (typeof value === 'string' && !this.isEditing) {
        this.selectedPageId = null;
        this.form.patchValue({ slug: '' }, { emitEvent: false });
      }
      this.cdr.detectChanges();
    });
  }

  //
  initForm() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      pageTitle: ['', [Validators.required]], 
      slug: [{ value: '', disabled: true }] 
    });
  }

  cargarPaginasDelSistema() {
    // 1. Usamos .list() que es el método real de tu PageService
    // 2. Pasamos un size grande (ej. 1000) para traer todas las páginas y poder buscarlas
    this.pageService.list({ page: 0, size: 1000 }).subscribe({
      next: (response) => {
        // Accedemos a .content porque tu servicio devuelve un objeto paginado
        this.paginasSistema = response.content || [];
        this.cdr.detectChanges(); // Notificamos que ya hay datos para el autocomplete
      },
      error: (err) => console.error('Error al cargar páginas:', err)
    });
  }

  @HostListener('document:mousedown', ['$event'])
  clickOut(event: MouseEvent) {
    // 1. Si el modal no está o el panel ya está cerrado, no perdemos tiempo procesando
    if (!this.showModal || !this.autocomplete || !this.autocomplete.panelOpen) return;

    const target = event.target as HTMLElement;

    // 2. Comprobamos si el clic fue dentro del buscador de páginas
    const isInsideSpecificField = this.pageField.nativeElement.contains(target);
    
    // 3. Comprobamos si el clic fue en la lista desplegable de opciones
    const isInsidePanel = target.closest('.mat-mdc-autocomplete-panel');

    // Si el clic NO fue en el buscador NI en sus opciones -> Cerramos
    if (!isInsideSpecificField && !isInsidePanel) {
      this.autocomplete.closePanel();
      this.cdr.detectChanges();
    }
  }

  //
  private _filter(name: string): any[] {
    // 1. Limpiamos espacios y pasamos a minúsculas
    const filterValue = name.toLowerCase().trim();

    // 2. Función auxiliar para quitar tildes
    const normalizeStr = (str: string) => 
      str ? str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase() : '';

    const normalizedFilter = normalizeStr(filterValue);

    return this.paginasSistema.filter(option => {
      const titleNormalized = normalizeStr(option.title);
      const slugNormalized = normalizeStr(option.slug || '');

      return titleNormalized.includes(normalizedFilter) || 
            slugNormalized.includes(normalizedFilter);
    });
  }

  //
  displayFn(pagina: any): string {
    return pagina && pagina.title ? pagina.title : '';
  }

  private configureMaintenanceMode() {
    const user = this.authService.currentUserValue;
    if (this.mode === 'user' && user) {
      this.columns = [
        { key: 'pageTitle', label: 'Lección', priority: 1 },
        { key: 'content', label: 'Mi Aporte', priority: 1 },
        { key: 'createdAt', label: 'Fecha', priority: 2 }
      ];

      this.contributionService.list = (request: any) => {
        return this.contributionService.getByUser(user.userId).pipe(
          map(data => ({
            content: data,
            totalElements: data.length,
            size: data.length,
            number: 0
          }))
        );
      };
    }
  }

  createContribution() {
    this.isEditing = false;
    this.selectedId = null;
    this.selectedPageId = null;
    this.form.reset();

    const user = this.authService.currentUserValue;
    if (user) {
      this.selectedUserId = user.userId;
      this.form.patchValue({ username: user.username });
    }

    this.form.get('pageTitle')?.enable(); 
    this.showModal = true;
  }

  // openViewModal(contribution: ContributionResponseDTO) {
  //   this.isEditing = true;
  //   this.selectedId = contribution.id;
  //   this.selectedUserId = contribution.userId;
  //   this.selectedPageId = contribution.pageId;
  //   this.showModal = true;
    
  //   this.form.patchValue({
  //     username: contribution.username,
  //     content: contribution.content,
  //     pageTitle: contribution.pageTitle, // Aquí se verá el texto plano en edición
  //     slug: contribution.slug || ''
  //   });
    
  //   this.form.get('pageTitle')?.disable();
  // }

  openViewModal(contribution: ContributionResponseDTO) {
    this.isEditing = true;
    this.selectedId = contribution.id;
    this.selectedUserId = contribution.userId;
    this.selectedPageId = contribution.pageId;
    this.showModal = true;
    
    this.form.patchValue({
      username: contribution.username,
      content: contribution.content,
      pageTitle: contribution.pageTitle, 
      // Usamos el operador de aserción si el error persiste
      slug: (contribution as any).slug || '' 
    });
    
    this.form.get('pageTitle')?.disable();
  }

  saveContribution() {
    if (this.form.invalid) {
      this.snack.open('⚠️ Revisa las validaciones', 'Cerrar', { duration: 3000 });
      return;
    }

    if (!this.selectedUserId || (!this.isEditing && !this.selectedPageId)) {
      this.snack.open('❌ Debes seleccionar una página válida de la lista', 'Cerrar');
      return;
    }

    this.isSaving.set(true);
    const rawValues = this.form.getRawValue();

    const payload = {
      content: rawValues.content,
      userId: this.selectedUserId, 
      pageId: this.selectedPageId,
      slug: rawValues.slug
    };

    const request$ = this.isEditing && this.selectedId
      ? this.contributionService.update(this.selectedId, payload)
      : this.contributionService.create(payload);

    request$.subscribe({
      next: () => {
        this.snack.open(`✅ Aporte guardado correctamente`, 'OK', { duration: 3000 });
        this.closeModal();
        this.maintenanceLayout.load();
        this.isSaving.set(false);
      },
      error: (err) => {
        this.snack.open('❌ Error al guardar', 'Cerrar');
        this.isSaving.set(false);
      }
    });
  }

  deleteContribution(contribution?: ContributionResponseDTO) {
    const idToDelete = contribution?.id ?? this.selectedId;
    if (idToDelete === null || idToDelete === undefined) return;

    if (confirm(`¿Estás seguro de que deseas eliminar este registro?`)) {
      this.isSaving.set(true);
      this.contributionService.delete(idToDelete).subscribe({
        next: () => {
          this.snack.open('✅ Eliminado', 'OK', { duration: 3000 });
          this.closeModal();
          this.maintenanceLayout.load();
          this.isSaving.set(false);
        },
        error: () => {
          this.snack.open('❌ Error al eliminar', 'Cerrar');
          this.isSaving.set(false);
        }
      });
    }
  }

  //
  clearPageSelection(event: MouseEvent) {
    event.preventDefault(); // Muy importante
    event.stopPropagation();
    
    this.form.get('pageTitle')?.setValue('');
    this.form.get('slug')?.setValue('');
    this.selectedPageId = null;

    if (this.autocomplete) {
      this.autocomplete.closePanel();
    }
  }

  //
  onPageSelected(event: any) {
    const pagina = event.option.value;
    this.selectedPageId = pagina.id;
    this.form.patchValue({
      slug: pagina.slug
    });
  }

  //
  closeModal() {
    if (this.autocomplete) {
      this.autocomplete.closePanel();
    }
    this.showModal = false;
    this.isEditing = false;
    this.selectedId = null;
    this.selectedPageId = null;
    this.form.reset();
  }
}