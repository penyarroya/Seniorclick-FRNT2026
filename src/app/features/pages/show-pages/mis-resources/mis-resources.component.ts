// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-mis-resources',
//   imports: [],
//   templateUrl: './mis-resources.component.html',
//   styleUrl: './mis-resources.component.scss',
// })
// export class MisResourcesComponent {

// }

import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

// Angular Material
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';

// Modelos y Servicio
import { ResourceDTO, ResourceType } from '../../../models/universilabas/resources/resource.model';
import { ResourceService } from '../../../services/universilabs/resources/resource.service';
import { PageService } from '../../../services/universilabs/pages/page.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GenericSnackComponent } from '../../../../shared/messages/generic-snack/generic-snack.component';

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
    MatTooltipModule
  ],
  templateUrl: './mis-resources.component.html',
  styleUrls: ['./mis-resources.component.scss']
})
export class MisResourcesComponent implements OnInit {
//  
  private fb = inject(FormBuilder);
  private resourceService = inject(ResourceService);
  private pageService = inject(PageService);
  private snackBar = inject(MatSnackBar);
  public pagesMap = signal<Record<number, string>>({}); // Mapa ID -> Nombre 

  // --- Signals para el estado de la UI ---
  public resources = signal<ResourceDTO[]>([]);
  public filterText = signal<string>('');
  public isLoading = signal<boolean>(false);

  // --- Lógica de filtrado reactivo (como en Inscripciones) ---
  public filteredResources = computed(() => {
    const term = this.filterText().toLowerCase();
    return this.resources().filter(res => 
      res.title.toLowerCase().includes(term) || 
      res.type.toLowerCase().includes(term)
    );
  });

  resourceTypes = Object.values(ResourceType);
  form!: FormGroup;
  //showModal = false;
  //public isEdit = false;

  // Cambia estas líneas:
  public showModal = signal<boolean>(false); // Ahora es Signal
  public isEdit = signal<boolean>(false);    // Ahora es Signal
  private selectedResourceId: number | null = null; // Para trackear qué editamos

  ngOnInit() {
    this.initForm();
    this.loadResources();
  }

  initForm() {
    this.form = this.fb.group({
      id: [null],
      title: ['', [Validators.required, Validators.maxLength(255)]],
      type: [ResourceType.PDF, Validators.required],
      url: ['', [Validators.required]],
      order: [0, Validators.min(0)],
      pageId: [null, Validators.required],
      nombre: [''], 
      activo: [true] 
    });
  }

  // En mis-resources.component.ts
  loadResources() {
    this.isLoading.set(true);

    // Paso 1: Cargar páginas para el mapa de nombres
    this.pageService.list({ page: 0, size: 100 }).subscribe({
      next: (pageData) => {
        const map: Record<number, string> = {};
        // Accedemos a .content porque tu servicio ya lo mapea así
        pageData.content.forEach(p => {
          if (p.id) map[p.id] = p.title;
        });
        this.pagesMap.set(map);

        // Paso 2: Cargar los recursos
        this.resourceService.list({ page: 0, size: 100 }).subscribe({
          next: (res) => {
            const data = res.content ? res.content : res;
            this.resources.set(data);
            this.isLoading.set(false);
          },
          error: () => this.isLoading.set(false)
        });
      },
      error: () => {
        console.error("Error al cargar nombres de páginas");
        this.isLoading.set(false);
      }
    });
  }

  // Función auxiliar para el HTML
  getPageName(pageId: number): string {
    return this.pagesMap()[pageId] || `Página #${pageId}`;
  }

  // --- Gestión del Modal ---

  openCreateModal() {
    this.isEdit.set(false);
    this.form.reset({ type: ResourceType.PDF, order: 0, activo: true });
    this.showModal.set(true);
  }

 // 
 editResource(row: ResourceDTO) {
    // 1. Cambiamos el estado a edición usando el Signal
    this.isEdit.set(true); 

    // 2. CORRECCIÓN DE ERROR: Si id es undefined, forzamos a null
    this.selectedResourceId = row.id ?? null; 
    
    // 3. Cargamos los datos en el formulario
    // patchValue es inteligente: si el objeto 'row' tiene las mismas llaves, 
    // puedes pasarle 'row' directamente, pero mapearlo así es más seguro.
    this.form.patchValue({
      title: row.title,
      type: row.type,
      url: row.url,
      order: row.order,
      pageId: row.pageId
    });

    // 4. Mostramos el modal usando el Signal
    this.showModal.set(true); 
  }

  //
  saveResource() {
    if (this.form.invalid) return;

    this.isLoading.set(true); // Mostramos el spinner
    const resourceData: ResourceDTO = this.form.value;

    // Decidimos la petición: si es EDITAR usamos el ID guardado, si no, CREATE
    const request = this.isEdit() && this.selectedResourceId
      ? this.resourceService.update(this.selectedResourceId, resourceData)
      : this.resourceService.create(resourceData);

    request.subscribe({
      next: () => {
        this.showSuccessSnack(this.isEdit() ? '¡Recurso actualizado!' : '¡Recurso creado!');
        this.loadResources(); // Refrescamos la lista
        this.closeModal();    // Cerramos y limpiamos
      },
      error: (err) => {
        this.isLoading.set(false);
        this.showErrorSnack('Error al procesar la solicitud');
        console.error(err);
      }
    });
  }

  //
  confirmDelete(id: number) {
    // Abrimos tu componente de Snack
    const snackRef = this.snackBar.openFromComponent(GenericSnackComponent, {
      data: {
        message: '¿Estás seguro de que deseas eliminar este recurso?',
        actionLabel: 'ELIMINAR',
        cancelLabel: 'CANCELAR'
      },
      duration: 5000, // 5 segundos por si se arrepiente
      horizontalPosition: 'center',
      verticalPosition: 'bottom',
      panelClass: ['delete-snack-panel'] // Para darle estilo rojo si quieres
    });

    // Escuchamos si el usuario hizo clic en el botón de confirmación (actionLabel)
    snackRef.onAction().subscribe(() => {
      this.resourceService.delete(id).subscribe({
        next: () => {
          this.loadResources(); // Refrescamos la lista
          this.showSuccessSnack('Recurso eliminado correctamente');
        },
        error: () => this.showErrorSnack('Error al intentar eliminar el recurso')
      });
    });
  }

 /**
 * Muestra un mensaje de éxito con tu Snack personalizado
 */
  showSuccessSnack(msg: string) {
    this.snackBar.openFromComponent(GenericSnackComponent, {
      data: { 
        message: msg,
        cancelLabel: 'OK' 
      },
      duration: 3000,
      panelClass: ['success-snack-panel'] 
    });
  }

  /**
   * Muestra un mensaje de error con tu Snack personalizado
   */
  showErrorSnack(msg: string) {
    this.snackBar.openFromComponent(GenericSnackComponent, {
      data: { 
        message: msg,
        cancelLabel: 'ENTENDIDO'
      },
      duration: 5000,
      panelClass: ['error-snack-panel']
    });
  }

  //
  goBack() {
    window.history.back();
  }

  //
  closeModal() {
    this.showModal.set(false);
    this.isEdit.set(false);
    this.selectedResourceId = null; // Limpiamos el ID
    this.form.reset({
      type: ResourceType.PDF, // Valor por defecto
      order: 0
    });
  }
}