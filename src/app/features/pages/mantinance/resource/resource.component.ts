import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";

import { ColumnConfig, MaintenanceLayoutComponent } from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { ResourceService } from '../../../services/universilabs/resources/resource.service';
import { PageService } from '../../../services/universilabs/pages/page.service';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { ResourceDTO, ResourceType } from '../../../models/universilabas/resources/resource.model';

@Component({
  selector: 'app-resources',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MaintenanceLayoutComponent,
    MatFormFieldModule, 
    MatSelectModule, 
    MatInputModule,
    MatOptionModule, // <--- REQUERIDO para mat-option
   MatButtonModule
  ],
  templateUrl: './resource.component.html',
  styleUrls: ['./resource.component.scss']
})
export class ResourceComponent implements OnInit {
//
  // SOLUCIÓN AL ERROR TS(2344): Forzamos que el Layout trate al DTO con un ID obligatorio
  // @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<ResourceResponseDTO & { id: number }>;
  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<any>;
  // resource.component.ts
  columns: ColumnConfig[] = [
    { key: 'title', label: 'Título', priority: 1 },
    { key: 'type', label: 'Tipo', priority: 2 },
    { key: 'order', label: 'Orden', priority: 3 },
    { key: 'pageId', label: 'ID Página', priority: 2 }
  ];

// En el saveResource o al recibir datos, podrías asegurar que 'nombre' sea igual a 'title'
// para que el sortedData del layout funcione:
// const sortedData = [...rawData].sort(...) // Este código de tu layout usa a.nombre

  //resourceTypes: ResourceType[] = ['IMAGE', 'VIDEO', 'PDF', 'LINK'];
  resourceTypes: ResourceType[] = [
    ResourceType.IMAGE, 
    ResourceType.VIDEO, 
    ResourceType.PDF, 
    ResourceType.LINK
  ];

  resourceService = inject(ResourceService);
  pageService = inject(PageService); 
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  form!: FormGroup;
  pages: any[] = []; 
  showModal = false;
  isEditing = false;
  selectedId: number | null = null;

  ngOnInit() {
    this.initForm();
    this.loadPages();
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      type: ['LINK', [Validators.required]],
      url: ['', [Validators.required]],
      order: [0],
      pageId: [null, [Validators.required]]
    });
  }

  loadPages() {
    this.pageService.list().subscribe({
      next: (resp) => this.pages = resp.content,
      error: () => this.snack.open('Error al cargar páginas', 'Cerrar')
    });
  }

  createResource() {
    this.isEditing = false;
    this.selectedId = null;
    this.form.reset({ type: 'LINK', order: 0 });
    this.showModal = true;
  }

  editResource(res: ResourceDTO) {
    this.isEditing = true;
    this.selectedId = res.id ?? null; // Usamos null coalescing para mayor seguridad
    this.showModal = true;
    this.form.patchValue({
      title: res.title,
      type: res.type,
      url: res.url,
      order: res.order,
      pageId: res.pageId
    });
  }

  saveResource() {
    if (this.form.invalid) return;
    
    // Obtenemos los valores ignorando el estado disabled (si lo hubiera)
    const payload = this.form.getRawValue();
    
    const request$ = this.isEditing && this.selectedId
      ? this.resourceService.update(this.selectedId, payload)
      : this.resourceService.create(payload);

    request$.subscribe({
      next: () => {
        this.snack.open(`✅ Recurso ${this.isEditing ? 'actualizado' : 'creado'}`, 'OK', { duration: 3000 });
        this.closeModal();
        this.maintenanceLayout.load();
      },
      error: (err) => {
        const msg = err.error?.message || 'No se pudo guardar';
        this.snack.open('❌ Error: ' + msg, 'Cerrar');
      }
    });
  }

  deleteResource(res: ResourceDTO) {
    if (res.id && confirm(`¿Eliminar recurso "${res.title}"?`)) {
      this.resourceService.delete(res.id).subscribe({
        next: () => {
          this.snack.open('✅ Recurso eliminado', 'OK');
          this.maintenanceLayout.load();
        }
      });
    }
  }

  closeModal() { 
    this.showModal = false; 
  }
}