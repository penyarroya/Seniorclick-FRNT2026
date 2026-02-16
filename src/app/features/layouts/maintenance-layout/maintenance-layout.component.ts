import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  HostListener,
  inject,
  signal,
  computed,
  AfterViewInit,
  ViewChild,
  NgZone,
  ElementRef,
  OnDestroy,
  ChangeDetectorRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { CdkTableModule } from '@angular/cdk/table';
import { Subject, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

import { AuthzService } from '../../../core/services/auth/authz-service.service'; 
import { SearchInputComponent } from '../../../shared/search-input/search-input.component';
import { MatTooltipModule } from '@angular/material/tooltip';

export interface ColumnConfig { key: string; label: string; filter?: boolean; priority: number; }
export interface QueryParams { page?: number; size?: number; filters?: Record<string, any>; }
export interface Page<T> { content: T[]; totalElements: number; }
export interface CrudService<T> { list(params: QueryParams): any; delete(id: number | string): any; }
export enum Permission { CREATE = 'CREATE', EDIT = 'EDIT', DELETE = 'DELETE' }

@Component({
  standalone: true,
  selector: 'app-maintenance-layout',
  imports: [
    CommonModule, 
    MatTableModule, 
    CdkTableModule,
     MatPaginatorModule,
    MatIconModule, 
    MatButtonModule,
    MatMenuModule,
    MatFormFieldModule,
    MatInputModule,
    MatTooltipModule, 
    SearchInputComponent
  ],
  templateUrl: './maintenance-layout.component.html',
  styleUrls: ['./maintenance-layout.component.scss']
})
// export class MaintenanceLayoutComponent<T extends { id: number | string }>
//                                         implements OnInit, AfterViewInit, OnDestroy {
export class MaintenanceLayoutComponent<T extends { 
//  
  id: number | string; 
  activo?: boolean; 
  nombre?: string; 
  description?: string 
}> implements OnInit, AfterViewInit, OnDestroy {

  @Input() title: string = 'Mantenimiento';
  @Input() icon: string = '';
  @Input() showViewAction: boolean = true;
  @Input({ required: true }) columns!: ColumnConfig[];
  @Input({ required: true }) service!: CrudService<T>;

  @Output() onCreate = new EventEmitter<void>();
  @Output() onEdit = new EventEmitter<T>();
  @Output() onDelete = new EventEmitter<T>(); 

  // En maintenance-layout.component.ts
  @Output() onView = new EventEmitter<T>(); // Nuevo evento para visualizar

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('tableWrapper') tableWrapper!: ElementRef;

  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private authz = inject(AuthzService);
  private zone = inject(NgZone);
  private cdr = inject(ChangeDetectorRef);

  private searchSubject = new Subject<void>();
  private searchSubscription?: Subscription;

  dataSource = new MatTableDataSource<T>([]);
  selectedIndex = signal<number>(0); 
  page = signal(0);
  pageSize = signal(10); 
  total = signal(0);
  filters = signal<Record<string, any>>({});
  width = signal(window.innerWidth);

  // Ahora simplemente guardamos la referencia al computed que retorna el servicio
  canCreate = this.authz.has(Permission.CREATE);
  canEdit = this.authz.has(Permission.EDIT);
  canDelete = this.authz.has(Permission.DELETE);

  @HostListener('window:resize')
  onResize() { this.width.set(window.innerWidth); }

  displayedColumns = computed(() => {
    const maxPriority = this.width() < 480 ? 2 : this.width() < 768 ? 3 : 4;
    return [...this.columns.filter(c => c.priority <= maxPriority).map(c => c.key), 'actions'];
  });

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

    const dataLength = this.dataSource.data.length;
    if (dataLength === 0) return;

    if (event.key === 'ArrowDown') {
      event.preventDefault(); 
      if (this.selectedIndex() === dataLength - 1) {
        if (this.paginator?.hasNextPage()) {
          this.zone.run(() => {
            this.page.update(p => p + 1);
            this.selectedIndex.set(0); 
            this.load();
          });
        }
      } else {
        this.selectedIndex.update(idx => idx + 1);
        this.scrollToSelected();
      }
    } 
    else if (event.key === 'ArrowUp') {
      event.preventDefault(); 
      if (this.selectedIndex() === 0) {
        if (this.paginator?.hasPreviousPage()) {
          this.zone.run(() => {
            this.page.update(p => p - 1);
            this.selectedIndex.set(this.pageSize() - 1);
            this.load(); 
          });
        }
      } else {
        this.selectedIndex.update(idx => idx - 1);
        this.scrollToSelected();
      }
    }
    else if (event.key === 'ArrowRight') {
      if (this.paginator?.hasNextPage()) {
        this.zone.run(() => {
          this.page.update(p => p + 1);
          this.selectedIndex.set(0);
          this.load();
        });
      }
    }
    else if (event.key === 'ArrowLeft') {
      if (this.paginator?.hasPreviousPage()) {
        this.zone.run(() => {
          this.page.update(p => p - 1);
          this.selectedIndex.set(0);
          this.load();
        });
      }
    }
    else if (event.key === 'Enter') {
      const selectedRow = this.dataSource.data[this.selectedIndex()];
      if (selectedRow && this.canEdit()) this.edit(selectedRow); 
    }
  }

  ngOnInit() {
   // this.authz.initializePermissions();
   // this.authz.setRole('admin'); 
    this.searchSubscription = this.searchSubject.pipe(debounceTime(400)).subscribe(() => this.load());
    this.load();
  }

  view(row: T) {
    if (this.onView.observed) {
      this.onView.emit(row);
    } else {
      // Si no hay suscriptor, intentamos una ruta por defecto
      this.router.navigate(['view', row.id], { relativeTo: this.route });
    }
  }

  ngOnDestroy() { this.searchSubscription?.unsubscribe(); }
  
  ngAfterViewInit() { 
    // Cambio crítico: No asignamos el paginador al dataSource para tener control manual
    // this.dataSource.paginator = this.paginator; 
  }

  private scrollToSelected() {
    setTimeout(() => {
      const element = document.querySelector('.row-selected');
      if (element) element.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }, 50);
  }

  load() {
    this.service.list({
      page: this.page(),
      size: this.pageSize(),
      filters: this.filters()
    }).subscribe({
      next: (res: Page<T>) => {
        this.zone.run(() => {
          const rawData = res?.content || [];

          // Ordenamiento optimizado usando el genérico T
          const sortedData = [...rawData].sort((a, b) => {
            // 1. Activos primero
            if (a.activo !== b.activo) return a.activo ? -1 : 1;
            
            // 2. Alfabético (usando nombre o description como fallback)
            const nameA = (a.nombre || a.description || '').toLowerCase();
            const nameB = (b.nombre || b.description || '').toLowerCase();
            return nameA.localeCompare(nameB);
          });

          this.dataSource.data = sortedData;
          this.total.set(res?.totalElements || 0);

          // Sincronización manual del paginador
          if (this.paginator) {
            this.paginator.pageIndex = this.page();
            this.paginator.length = this.total();
          }

          // Ajuste de selección si la página tiene menos elementos
          if (this.selectedIndex() >= sortedData.length) {
            this.selectedIndex.set(Math.max(0, sortedData.length - 1));
          }

          this.cdr.detectChanges();
          
          // Scroll suave al seleccionado
          setTimeout(() => this.scrollToSelected(), 50);
        });
      },
      error: (err: unknown) => {
        console.error('Error cargando datos:', err);
      }
    });
  }
  
  onPage(e: PageEvent) {
    this.zone.run(() => {
      this.page.set(e.pageIndex);
      this.pageSize.set(e.pageSize);
      this.load();
    });
  }

  onSearch(term: string) {
    const value = term?.trim();
    this.filters.update(f => ({ ...f, global: value || undefined }));
    this.page.set(0); 
    this.selectedIndex.set(0); 
    if (!value) this.load(); else this.searchSubject.next();
  }

  onFilter(key: string, value: string) {
    const val = value?.trim();
    this.filters.update(f => ({ ...f, [key]: val || undefined }));
    this.page.set(0);
    this.selectedIndex.set(0);
    if (!val) this.load(); else this.searchSubject.next();
  }

  create() { 
    this.onCreate.observed ? this.onCreate.emit() : this.router.navigate(['new'], { relativeTo: this.route }); 
  }

  edit(row: T) {
    if (!row || row.id === undefined || row.id === null || row.id === 'current') {
      console.warn('ID inválido detectado:', row);
      return;
    }

    if (this.onEdit.observed) {
      this.onEdit.emit(row);
    } else {
      this.router.navigate([row.id.toString(), 'edit'], { relativeTo: this.route });
    }
  }

  remove(row: T) { 
    if (this.onDelete.observed) {
      this.onDelete.emit(row);
    } else {
      if (confirm(`¿Eliminar registro con ID ${row.id}?`)) {
        this.service.delete(row.id).subscribe({
          next: () => this.load(),
          error: (err: unknown) => { // <--- Añade este bloque para evitar errores de tipo
            console.error('Error al eliminar:', err);
          }
        });
      }
    }
  }

  public convertToSlug(text: string): string {
    if (!text) return '';
    return text
      .toLowerCase()
      .trim()
      .normalize('NFD')                 
      .replace(/[\u0300-\u036f]/g, '')  
      .replace(/[^a-z0-9 -]/g, '')      
      .replace(/\s+/g, '-')             
      .replace(/-+/g, '-');             
  }

  closeModule() { 
    this.router.navigate(['/maintenance']); 
  }
}