import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// Material & Layout
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';

// Services & Models
import { CollectionService } from '../../../services/universilabs/collections/collection.service';
import { ProjectService } from '../../../services/universilabs/projects/project.service';
import { ProjectDTO } from '../../../models/universilabas/projects/project.model';
import { CollectionResponseDTO } from '../../../models/universilabas/collections/collection-response.model';
import { CollectionRequestDTO } from '../../../models/universilabas/collections/collection-request.model';

@Component({
  selector: 'app-collections',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MaintenanceLayoutComponent,
    MatFormFieldModule, MatSelectModule, MatInputModule
  ],
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.scss']
})
export class CollectionsComponent implements OnInit {
//  
  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<CollectionResponseDTO>;

  columns: ColumnConfig[] = [
    { key: 'name', label: 'Nombre Colección', priority: 1 },
    { key: 'projectName', label: 'Proyecto Asociado', priority: 1 },
    { key: 'topicsCount', label: 'Temas', priority: 2 } // Opcional si tu DTO lo trae
  ];

  collectionService = inject(CollectionService);
  projectService = inject(ProjectService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  form!: FormGroup;
  projects: ProjectDTO[] = [];
  showModal = false;
  isEditing = false;
  selectedId: number | null = null;

  ngOnInit() {
    this.initForm();
    this.loadProjects();
  }

  initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(255)]],
      projectId: [null, [Validators.required]]
    });
  }

  // loadProjects() {
  //   this.projectService.getAll().subscribe(data => this.projects = data);
  // }

  // En collections.component.ts
  loadProjects() {
    // Cambia .all() por .getAll() que es el nombre real en tu service
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
      },
      error: (err) => {
        this.snack.open('Error al cargar proyectos activos', 'Cerrar');
      }
    });
  }

  createCollection() {
    this.isEditing = false;
    this.selectedId = null;
    this.form.reset();
    this.showModal = true;
  }

  editCollection(collection: CollectionResponseDTO) {
    this.isEditing = true;
    this.selectedId = collection.id;
    this.showModal = true;
    this.form.patchValue({
      name: collection.name,
      projectId: collection.projectId
    });
  }

  saveCollection() {
    if (this.form.invalid) return;

    const payload: CollectionRequestDTO = this.form.getRawValue();
    const request$ = this.isEditing && this.selectedId
      ? this.collectionService.update(this.selectedId, payload)
      : this.collectionService.create(payload);

    request$.subscribe({
      next: () => {
        this.snack.open(`✅ Colección ${this.isEditing ? 'actualizada' : 'creada'}`, 'OK', { duration: 3000 });
        this.closeModal();
        this.maintenanceLayout.load();
      },
      error: (err) => {
        // 'err.error' es el ErrorResponse que definimos en Java
        // Extraemos el mensaje específico (ej: "Ya existe una colección llamada...")
        const serverMessage = err.error?.message || 'Error inesperado al guardar';
        
        this.snack.open('❌ ' + serverMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar'] // Opcional: para darle estilo rojo
        });

        console.error('Error desde el servidor:', err);
      }
    });
  }

  deleteCollection(collection: CollectionResponseDTO) {
    if (confirm(`¿Eliminar la colección "${collection.name}"?`)) {
      this.collectionService.delete(collection.id).subscribe({
        next: () => {
          this.snack.open('✅ Colección eliminada', 'OK', { duration: 3000 });
          this.maintenanceLayout.load();
        }
      });
    }
  }

  closeModal() { this.showModal = false; }
}