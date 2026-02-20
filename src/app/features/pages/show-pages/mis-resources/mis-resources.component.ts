// import { Component, OnInit, inject, signal, computed } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

// // Angular Material
// import { MatIconModule } from '@angular/material/icon';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatSelectModule } from '@angular/material/select';
// import { MatButtonModule } from '@angular/material/button';
// import { MatCardModule } from '@angular/material/card';
// import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { MatTooltipModule } from '@angular/material/tooltip';

// // Modelos y Servicio
// import { ResourceDTO, ResourceType } from '../../../models/universilabas/resources/resource.model';
// import { ResourceService } from '../../../services/universilabs/resources/resource.service';
// import { PageService } from '../../../services/universilabs/pages/page.service';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { GenericSnackComponent } from '../../../../shared/messages/generic-snack/generic-snack.component';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-mis-resources',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     ReactiveFormsModule, 
//     FormsModule,
//     MatIconModule,
//     MatFormFieldModule, 
//     MatInputModule, 
//     MatSelectModule,
//     MatButtonModule,
//     MatCardModule,
//     MatProgressSpinnerModule,
//     MatTooltipModule
//   ],
//   templateUrl: './mis-resources.component.html',
//   styleUrls: ['./mis-resources.component.scss']
// })
// export class MisResourcesComponent implements OnInit {
//   private fb = inject(FormBuilder);
//   private resourceService = inject(ResourceService);
//   private pageService = inject(PageService);
//   private snackBar = inject(MatSnackBar);
//   private router = inject(Router);

//   // --- Signals de Estado ---
//   public pagesMap = signal<Record<number, string>>({});
//   public resources = signal<ResourceDTO[]>([]);
//   public filterText = signal<string>('');
//   public isLoading = signal<boolean>(false);
//   public showModal = signal<boolean>(false);
  
//   // Como solo editamos, isEdit es una constante visual
//   public isEdit = signal<boolean>(true); 
//   private selectedResourceId: number | null = null;

//   // --- Lógica de filtrado ---
//   public filteredResources = computed(() => {
//     const term = this.filterText().toLowerCase();
//     return this.resources().filter(res => 
//       res.title.toLowerCase().includes(term) || 
//       res.type.toLowerCase().includes(term)
//     );
//   });

//   resourceTypes = Object.values(ResourceType);
//   form!: FormGroup;

//   ngOnInit() {
//     this.initForm();
//     this.loadResources();
//   }

//   initForm() {
//     this.form = this.fb.group({
//       id: [null],
//       title: ['', [Validators.required, Validators.maxLength(255)]],
//       type: [ResourceType.PDF, Validators.required],
//       url: ['', [Validators.required]],
//       order: [0, Validators.min(0)],
//       pageId: [null, Validators.required],
//       activo: [true] 
//     });
//   }

//   loadResources() {
//     this.isLoading.set(true);
//     this.pageService.list({ page: 0, size: 100 }).subscribe({
//       next: (pageData) => {
//         const map: Record<number, string> = {};
//         pageData.content.forEach(p => { if (p.id) map[p.id] = p.title; });
//         this.pagesMap.set(map);

//         this.resourceService.list({ page: 0, size: 100 }).subscribe({
//           next: (res) => {
//             const data = res.content ? res.content : res;
//             this.resources.set(data);
//             this.isLoading.set(false);
//           },
//           error: () => this.isLoading.set(false)
//         });
//       },
//       error: () => this.isLoading.set(false)
//     });
//   }

//   getPageName(pageId: number): string {
//     return this.pagesMap()[pageId] || `Página #${pageId}`;
//   }

//   // --- Acciones ---

//   editResource(row: ResourceDTO) {
//     this.selectedResourceId = row.id ?? null; 
//     this.form.patchValue({
//       id: row.id,
//       title: row.title,
//       type: row.type,
//       url: row.url,
//       order: row.order,
//       pageId: row.pageId,
//       activo: row.activo
//     });
//     this.showModal.set(true); 
//   }

//   saveResource() {
//     if (this.form.invalid || !this.selectedResourceId) return;

//     this.isLoading.set(true);
//     const resourceData: ResourceDTO = this.form.value;

//     // Directo a update, ya que no hay flujo de creación
//     this.resourceService.update(this.selectedResourceId, resourceData).subscribe({
//       next: () => {
//         this.showSuccessSnack('¡Recurso actualizado!');
//         this.loadResources();
//         this.closeModal();
//       },
//       error: (err) => {
//         this.isLoading.set(false);
//         this.showErrorSnack('Error al actualizar el recurso');
//       }
//     });
//   }

//   confirmDelete(id: number) {
//     const snackRef = this.snackBar.openFromComponent(GenericSnackComponent, {
//       data: {
//         message: '¿Estás seguro de eliminar este recurso?',
//         actionLabel: 'ELIMINAR',
//         cancelLabel: 'CANCELAR'
//       },
//       duration: 5000,
//       panelClass: ['delete-snack-panel']
//     });

//     snackRef.onAction().subscribe(() => {
//       this.resourceService.delete(id).subscribe({
//         next: () => {
//           this.loadResources();
//           this.showSuccessSnack('Recurso eliminado');
//         },
//         error: () => this.showErrorSnack('Error al eliminar')
//       });
//     });
//   }

//   // --- Utilidades de UI ---

//   goBack() {
//     this.router.navigate(['/inicio']);
//   }

//   closeModal() {
//     this.showModal.set(false);
//     this.selectedResourceId = null;
//     this.form.reset();
//   }

//   showSuccessSnack(msg: string) {
//     this.snackBar.openFromComponent(GenericSnackComponent, {
//       data: { message: msg, cancelLabel: 'OK' },
//       duration: 3000,
//       panelClass: ['success-snack-panel'] 
//     });
//   }

//   showErrorSnack(msg: string) {
//     this.snackBar.openFromComponent(GenericSnackComponent, {
//       data: { message: msg, cancelLabel: 'ENTENDIDO' },
//       duration: 5000,
//       panelClass: ['error-snack-panel']
//     });
//   }
// }

import { Component, OnInit, inject, signal, computed, effect, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap, catchError, of } from 'rxjs';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatBadgeModule } from '@angular/material/badge';
import { MatChipsModule } from '@angular/material/chips';

// Modelos y Servicio
import { ResourceDTO, ResourceType } from '../../../models/universilabas/resources/resource.model';
import { ResourceService } from '../../../services/universilabs/resources/resource.service';
import { PageService } from '../../../services/universilabs/pages/page.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericSnackComponent } from '../../../../shared/messages/generic-snack/generic-snack.component';
import { Router } from '@angular/router';

interface SearchFilters {
  type: ResourceType | '';
  pageId: number | null;
  minOrder: number | null;
  maxOrder: number | null;
}

@Component({
  selector: 'app-mis-resources',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    FormsModule,
    MatIconModule,
    MatFormFieldModule, 
    MatInputModule, 
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatBadgeModule,
    MatChipsModule
  ],
  templateUrl: './mis-resources.component.html',
  styleUrls: ['./mis-resources.component.scss']
})
export class MisResourcesComponent implements OnInit, AfterViewInit {
//  
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  
  private fb = inject(FormBuilder);
  private resourceService = inject(ResourceService);
  private pageService = inject(PageService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  // --- Signals de Estado ---
  public pagesMap = signal<Record<number, string>>({});
  public resources = signal<ResourceDTO[]>([]);
  public filteredResources = signal<ResourceDTO[]>([]);
  public filterText = signal<string>('');
  public selectedPageId = signal<string | null>(null);
  public filters = signal<SearchFilters>({
    type: '',
    pageId: null,
    minOrder: null,
    maxOrder: null
  });
  public isLoading = signal<boolean>(false);
  public isSearching = signal<boolean>(false);
  public showModal = signal<boolean>(false);
  public showAdvancedSearch = signal<boolean>(false);
  public searchHistory = signal<string[]>(this.loadSearchHistory());
  
  public isEdit = signal<boolean>(true); 
  private selectedResourceId: number | null = null;
  private searchTimeout: any;

  resourceTypes = Object.values(ResourceType);
  form!: FormGroup;
  searchForm!: FormGroup;

  // --- Computed Signals para la UI ---
  public activeFiltersCount = computed(() => {
    const f = this.filters();
    return [
      f.type ? 1 : 0,
      f.pageId ? 1 : 0,
      f.minOrder !== null ? 1 : 0,
      f.maxOrder !== null ? 1 : 0
    ].reduce((a, b) => a + b, 0);
  });

  public searchResultsCount = computed(() => this.filteredResources().length);

  public hasSearchTerm = computed(() => this.filterText().length > 0);

  public recentSearches = computed(() => {
    return this.searchHistory().slice(0, 5);
  });


  // 1. Sincroniza el selector de página con el objeto de filtros
  constructor() {
    // Efecto 1: Sincroniza el ID del combo con el objeto de filtros
    effect(() => {
      const pId = this.selectedPageId();
      // Aquí es donde ocurre la conversión a Number de forma centralizada
      this.filters.update(f => ({ ...f, pageId: pId ? Number(pId) : null }));
    });

    // Efecto 2: Cuando los filtros CAMBIAN, filtramos la lista
    effect(() => {
      this.applyFilters();
    });
  }

  //
  ngOnInit() {
    this.initForm();
    this.initSearchForm();
    this.loadResources();
    
  }

  ngAfterViewInit() {
    // Focus automático si hay un parámetro en la URL
    setTimeout(() => {
      this.searchInput?.nativeElement?.focus();
    }, 100);
  }

  initForm() {
    this.form = this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      type: [ResourceType.PDF, Validators.required],
      url: ['', [Validators.required]],
      order: [0, Validators.min(0)],
      pageId: [null, Validators.required],
      activo: [true] 
    });
  }

  initSearchForm() {
    this.searchForm = this.fb.group({
      search: [''],
      type: [''],
      pageId: [null],
      minOrder: [null],
      maxOrder: [null]
    });

    // Búsqueda con debounce
    this.searchForm.get('search')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {
        this.filterText.set(value || '');
        this.isSearching.set(false);
      });

    // Actualizar filtros cuando cambien
    this.searchForm.get('type')?.valueChanges.subscribe(value => {
      this.filters.update(f => ({ ...f, type: value }));
    });

    this.searchForm.get('pageId')?.valueChanges.subscribe(value => {
      this.filters.update(f => ({ ...f, pageId: value }));
    });

    this.searchForm.get('minOrder')?.valueChanges.subscribe(value => {
      this.filters.update(f => ({ ...f, minOrder: value }));
    });

    this.searchForm.get('maxOrder')?.valueChanges.subscribe(value => {
      this.filters.update(f => ({ ...f, maxOrder: value }));
    });
  }

  loadResources() {
    this.isLoading.set(true);
    this.pageService.list({ page: 0, size: 100 }).subscribe({
      next: (pageData) => {
        const map: Record<number, string> = {};
        pageData.content.forEach(p => { if (p.id) map[p.id] = p.title; });
        this.pagesMap.set(map);

        this.resourceService.list({ page: 0, size: 100 }).subscribe({
          next: (res) => {
            const data = res.content ? res.content : res;
            this.resources.set(data);
            this.filteredResources.set(data);
            this.isLoading.set(false);
          },
          error: () => {
            this.isLoading.set(false);
            this.showErrorSnack('Error al cargar recursos');
          }
        });
      },
      error: () => {
        this.isLoading.set(false);
        this.showErrorSnack('Error al cargar páginas');
      }
    });
  }

  // --- Lógica de Búsqueda Profesional ---
  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.isSearching.set(true);
    
    // Clear previous timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    
    // Set new timeout para no sobrecargar
    this.searchTimeout = setTimeout(() => {
      this.filterText.set(input.value);
      this.isSearching.set(false);
      
      // Guardar en historial si tiene más de 2 caracteres
      if (input.value.length > 2) {
        this.addToSearchHistory(input.value);
      }
    }, 300);
  }


  //
  applyFilters() {
    const term = this.filterText().toLowerCase().trim();
    const filters = this.filters();
    
    const filtered = this.resources().filter(res => {
      // 1. Extraer ID (res.pageId o res.page.id)
      const resPageId = res.pageId || (res as any).page?.id;

      // 2. Filtro de Página:
      // Si no hay filtro (!filters.pageId) mostramos todo.
      // Si hay filtro, usamos == para que coincida aunque uno sea string y otro number.
      const matchesPage = !filters.pageId || resPageId == filters.pageId;

      // 3. Filtro de Texto
      const matchesText = !term || res.title.toLowerCase().includes(term);

      // 4. Filtro de Tipo
      const matchesType = !filters.type || res.type === filters.type;

      return matchesText && matchesPage && matchesType;
    });

    this.filteredResources.set(filtered);
  }

  //
  clearSearch() {
    this.filterText.set('');
    this.searchForm.patchValue({ search: '' });
    this.filters.set({
      type: '',
      pageId: null,
      minOrder: null,
      maxOrder: null
    });
    this.searchInput.nativeElement.focus();
  }

  clearFilters() {
    this.filters.set({
      type: '',
      pageId: null,
      minOrder: null,
      maxOrder: null
    });
    this.searchForm.patchValue({
      type: '',
      pageId: null,
      minOrder: null,
      maxOrder: null
    });
  }

  // --- Historial de Búsqueda ---
  private loadSearchHistory(): string[] {
    try {
      const history = localStorage.getItem('resourceSearchHistory');
      return history ? JSON.parse(history) : [];
    } catch {
      return [];
    }
  }

  private saveSearchHistory(history: string[]) {
    try {
      localStorage.setItem('resourceSearchHistory', JSON.stringify(history.slice(0, 10)));
    } catch (error) {
      console.error('Error saving search history:', error);
    }
  }

  private addToSearchHistory(term: string) {
    if (!term || term.length < 3) return;
    
    this.searchHistory.update(history => {
      const newHistory = [term, ...history.filter(t => t !== term)].slice(0, 10);
      this.saveSearchHistory(newHistory);
      return newHistory;
    });
  }

  useSearchHistory(term: string) {
    this.filterText.set(term);
    this.searchForm.patchValue({ search: term });
    this.searchInput.nativeElement.focus();
  }

  clearSearchHistory() {
    this.searchHistory.set([]);
    localStorage.removeItem('resourceSearchHistory');
  }

  // --- Búsqueda por Voz (opcional) ---
  startVoiceSearch() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      // @ts-ignore
      const recognition = new (window.webkitSpeechRecognition || window.SpeechRecognition)();
      recognition.lang = 'es-ES';
      recognition.continuous = false;
      recognition.interimResults = false;
      
      recognition.onstart = () => {
        this.showInfoSnack('Escuchando...');
      };
      
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.filterText.set(transcript);
        this.searchForm.patchValue({ search: transcript });
      };
      
      recognition.onerror = () => {
        this.showInfoSnack('No se pudo reconocer la voz');
      };
      
      recognition.start();
    } else {
      this.showInfoSnack('Búsqueda por voz no soportada');
    }
  }

  // --- Utilidades existentes ---
  getPageName(pageId: number): string {
    return this.pagesMap()[pageId] || `Página #${pageId}`;
  }

  editResource(row: ResourceDTO) {
    this.selectedResourceId = row.id ?? null; 
    this.form.patchValue({
      id: row.id,
      title: row.title,
      type: row.type,
      url: row.url,
      order: row.order,
      pageId: row.pageId,
      activo: row.activo
    });
    this.showModal.set(true); 
  }

  saveResource() {
    if (this.form.invalid || !this.selectedResourceId) return;

    this.isLoading.set(true);
    const resourceData: ResourceDTO = this.form.value;

    this.resourceService.update(this.selectedResourceId, resourceData).subscribe({
      next: () => {
        this.showSuccessSnack('¡Recurso actualizado!');
        this.loadResources();
        this.closeModal();
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showErrorSnack('Error al actualizar el recurso');
      }
    });
  }

  confirmDelete(id: number) {
    const snackRef = this.snackBar.openFromComponent(GenericSnackComponent, {
      data: {
        message: '¿Estás seguro de eliminar este recurso?',
        actionLabel: 'ELIMINAR',
        cancelLabel: 'CANCELAR'
      },
      duration: 5000,
      panelClass: ['delete-snack-panel']
    });

    snackRef.onAction().subscribe(() => {
      this.resourceService.delete(id).subscribe({
        next: () => {
          this.loadResources();
          this.showSuccessSnack('Recurso eliminado');
        },
        error: () => this.showErrorSnack('Error al eliminar')
      });
    });
  }

  goBack() {
    this.router.navigate(['/inicio']);
  }

  closeModal() {
    this.showModal.set(false);
    this.selectedResourceId = null;
    this.form.reset();
  }

  toggleAdvancedSearch() {
    this.showAdvancedSearch.update(val => !val);
  }

  // --- Snacks ---
  showSuccessSnack(msg: string) {
    this.snackBar.openFromComponent(GenericSnackComponent, {
      data: { message: msg, cancelLabel: 'OK' },
      duration: 3000,
      panelClass: ['success-snack-panel'] 
    });
  }

  showErrorSnack(msg: string) {
    this.snackBar.openFromComponent(GenericSnackComponent, {
      data: { message: msg, cancelLabel: 'ENTENDIDO' },
      duration: 5000,
      panelClass: ['error-snack-panel']
    });
  }

  showInfoSnack(msg: string) {
    this.snackBar.openFromComponent(GenericSnackComponent, {
      data: { message: msg, cancelLabel: 'OK' },
      duration: 2000,
      panelClass: ['info-snack-panel']
    });
  }

  //
  onPageChange(value: any) {
    // 1. Actualizamos la signal principal.
    // Al hacer esto, el 'effect' que pusimos en el constructor se dispara solo,
    // actualiza 'this.filters' y luego llama a 'applyFilters()'.
    this.selectedPageId.set(value);

    // 2. Mantenemos un log limpio (opcional) para confirmar que el cambio ocurre
    console.log(`Filtrando por Página ID: ${value}`);
  }
}