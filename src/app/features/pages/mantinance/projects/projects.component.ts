import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// Imports de Material necesarios para el Formulario
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";

import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { InstitutionService } from '../../../services/universilabs/institutions/institution.service';
import { InstitutionDTO } from '../../../models/universilabas/institution/institution.model';
import { ProjectService } from '../../../services/universilabs/projects/project.service';
import { ProjectDTO, ProjectGridItem, ProjectLevel } from '../../../models/universilabas/projects/project.model';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIcon } from "@angular/material/icon";

@Component({
  selector: 'app-projects',
  standalone: true,
  // Agregamos MatSelectModule y MatInputModule para que el modal funcione
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaintenanceLayoutComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatSlideToggleModule,
    MatIcon
],
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {
  
  // @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<ProjectDTO>;
  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<ProjectGridItem>;

  columns: ColumnConfig[] = [
    { key: 'title', label: 'Nombre del Proyecto', priority: 1 },
    { key: 'institutionName', label: 'Institución', priority: 1 },
    { key: 'level', label: 'Nivel', priority: 2 },
    { key: 'activo', label: 'Estado', priority: 3 }
  ];
  
  projectService = inject(ProjectService);
  institutionService = inject(InstitutionService);

  currentProject: ProjectDTO | ProjectGridItem | null = null;

  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  form!: FormGroup;
  institutions: InstitutionDTO[] = []; 
  
  showModal = false;

  ngOnInit() {
    this.initForm();
    this.loadRequiredData();
  }

  // Inicializar el formulario reactivo
  initForm() {
    this.form = this.fb.group({
      title: ['', [
        Validators.required, 
        Validators.minLength(5), // Evita títulos demasiado cortos como "Pr 1"
        Validators.maxLength(255),
        Validators.pattern('.*\\S.*') // Regex: No permite que sea solo espacios en blanco
      ]],
      description: ['', [
        Validators.maxLength(2000)
      ]],
      level: [1, [
        Validators.required, 
        Validators.min(1), 
        Validators.max(3)
      ]], 
      institutionId: [null, [
        Validators.required
      ]],
      createdById: [1], 
      activo: [true]
    });
  }

  // Cargar datos necesarios para el formulario
  loadRequiredData() {
    this.institutionService.getAll().subscribe(data => this.institutions = data);
  }

  // Crear nuevo proyecto
  createProject() {
    this.currentProject = null;
    this.form.reset({ activo: true, level: 1, createdById: 1 });
    this.showModal = true;

  }

  // CAMBIO: Recibe ProjectGridItem
  // CAMBIO: Recibe ProjectGridItem
  deleteProject(project: ProjectGridItem) {
    // --- ESTA ES LA PARTE PARA RE-ACTIVAR ---
    if (!project.activo) {
      if (confirm(`¿Deseas reactivar el proyecto "${project.title}"?`)) {
        // Aquí es donde insertas el código:
        this.projectService.update(project.id, { ...project, activo: true }).subscribe({
          next: () => {
            this.snack.open('✅ Proyecto reactivado', 'OK', { duration: 3000 });
            this.maintenanceLayout.load(); // Esto hace que el proyecto "salte" arriba
          },
          error: () => this.snack.open('❌ Error al reactivar', 'Cerrar')
        });
      }
      return; // Importante para que no ejecute el código de abajo
    }

    // --- ESTA ES LA PARTE PARA DESACTIVAR (BORRADO SUAVE) ---
    if (confirm(`¿Estás seguro de desactivar el proyecto "${project.title}"?`)) {
      this.projectService.delete(project.id).subscribe({
        next: () => {
          this.snack.open('✅ Proyecto desactivado (Oculto)', 'OK', { duration: 3000 });
          this.maintenanceLayout.load(); // Esto hace que el proyecto "caiga" al final
        },
        error: () => this.snack.open('❌ Error al desactivar', 'Cerrar')
      });
    }
  }

  // CAMBIO: Recibe ProjectGridItem
  editProject(project: ProjectGridItem) {
    this.currentProject = project;
    
    this.form.patchValue({
      title: project.title,
      description: project.description,
      level: project.level,
      activo: project.activo,
      institutionId: project.institutionId || (project as any).institution?.id,
      // Aseguramos que createdById no se pierda
      createdById: project.createdById || 1 
    });
    
    this.showModal = true;
  }

  // Guardar proyecto (crear o actualizar)
  saveProject() {
    // 1. Validar que el formulario sea correcto
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const formValue = this.form.value;
    
    // 2. Limpiar y convertir valores numéricos para evitar NaN
    const createdByIdRaw = Number(formValue.createdById);
    const institutionIdRaw = Number(formValue.institutionId);

    // 3. Construir el objeto exacto que espera tu Backend
    const payload: Partial<ProjectDTO> = {
      title: formValue.title,
      description: formValue.description,
      level: Number(formValue.level) as ProjectLevel,
      // Si estamos editando, usamos el ID que ya tenía el proyecto
      createdById: this.currentProject?.createdById || isNaN(createdByIdRaw) ? 1 : createdByIdRaw,
      institutionId: isNaN(institutionIdRaw) ? 0 : institutionIdRaw,
      activo: formValue.activo // Esto ya lo tienes y está perfecto
    };

    const id = this.currentProject?.id;
    
    console.log('Enviando Payload:', payload);

    const obs$ = id 
      ? this.projectService.update(id, payload) 
      : this.projectService.create(payload);

    // 4. Ejecutar la petición al servidor
    obs$.subscribe({
      next: () => {
        // Mostrar notificación de éxito
        this.snack.open(
          id ? '✅ Proyecto actualizado correctamente' : '✅ Proyecto creado con éxito', 
          'OK', 
          { duration: 3000 }
        );
        
        /**
         * SOLUCIÓN AL ERROR NG0100:
         * Usamos setTimeout(..., 0) para que el cierre del modal y la recarga
         * ocurran en el siguiente tick de ejecución. Esto evita conflictos con 
         * el ciclo de vida de Angular.
         */
        setTimeout(() => {
          this.closeModal();
          this.maintenanceLayout.load();
        }, 0);
      },
      error: (err) => {
        console.error('Error detallado del servidor:', err);
        // Extraemos el mensaje de error del backend si existe
        const backendMessage = err.error?.message || 'Error de comunicación';
        this.snack.open('❌ No se pudo guardar: ' + backendMessage, 'Cerrar');
      }
    });
  }
  
  // Cerrar modal y limpiar estado
  closeModal() {
    this.showModal = false;
    this.currentProject = null;
  }
}