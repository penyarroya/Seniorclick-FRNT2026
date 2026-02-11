import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

// Material Imports
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon"; 
import { MatTableModule } from '@angular/material/table';

import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { ProjectService } from '../../../services/universilabs/projects/project.service';
import { UserService } from '../../../services/universilabs/users/user.service';

// Models
import { UserDTO } from '../../../models/users/user-dto.model';
import { ProjectDTO } from '../../../models/universilabas/projects/project.model';
import { EnrollmentResponseDTO } from '../../../models/universilabas/enrollments/enrollments-response.model';
import { EnrollmentRequestDTO } from '../../../models/universilabas/enrollments/enrollments-request.model';
import { EnrollmentService } from '../../../services/universilabs/enrollments/enrollments.service';

@Component({
  selector: 'app-enrollments',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaintenanceLayoutComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
  ],
  templateUrl: './enrollments.component.html',
  styleUrls: ['./enrollments.component.scss']
})
export class EnrollmentsComponent implements OnInit {

  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<EnrollmentResponseDTO>;

  columns: ColumnConfig[] = [
    { key: 'userName', label: 'Estudiante', priority: 1 },
    { key: 'projectTitle', label: 'Proyecto', priority: 1 },
    { key: 'roleInCourse', label: 'Rol', priority: 2 },
    { key: 'createdAt', label: 'Fecha Inscripción', priority: 3 }
  ];

  enrollmentService = inject(EnrollmentService);
  userService = inject(UserService);
  projectService = inject(ProjectService);
  
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  // Estado del componente
  form!: FormGroup;
  users: UserDTO[] = [];
  projects: ProjectDTO[] = [];
  showModal = false;
  
  // --- NUEVO: Estado para Edición ---
  isEditing = false;
  selectedId: number | null = null;

  ngOnInit() {
    this.initForm();
    this.loadRequiredData();
  }

  initForm() {
    this.form = this.fb.group({
      userId: [null, [Validators.required]],
      projectId: [null, [Validators.required]],
      roleInCourse: ['LEARNER', [Validators.required]]
    });
  }

  loadRequiredData() {
    this.userService.getAll().subscribe((data: UserDTO[]) => this.users = data);
    this.projectService.getAll().subscribe((data: any[]) => this.projects = data); 
  }

  // --- MODIFICADO: Prepara el formulario para Crear ---
  createEnrollment() {
    this.isEditing = false;
    this.selectedId = null;
    this.form.reset({ roleInCourse: 'LEARNER' });
    this.showModal = true;
  }

  // --- NUEVO: Prepara el formulario para Editar ---
  editEnrollment(enrollment: EnrollmentResponseDTO) {
    this.isEditing = true;
    this.selectedId = enrollment.id;
    this.showModal = true;

    // Cargamos los valores en el formulario usando patchValue
    this.form.patchValue({
      userId: enrollment.userId,
      projectId: enrollment.projectId,
      roleInCourse: enrollment.roleInCourse
    });
  }

  deleteEnrollment(enrollment: EnrollmentResponseDTO) {
    if (confirm(`¿Eliminar la inscripción de ${enrollment.userName} en ${enrollment.projectTitle}?`)) {
      this.enrollmentService.delete(enrollment.id).subscribe({
        next: () => {
          this.snack.open('✅ Inscripción eliminada', 'OK', { duration: 3000 });
          this.maintenanceLayout.load();
        },
        error: (err) => {
          this.snack.open('❌ Error al eliminar', 'Cerrar');
        }
      });
    }
  }

  // --- MODIFICADO: Soporta Create y Update ---
  saveEnrollment() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: EnrollmentRequestDTO = this.form.getRawValue();

    // Si isEditing es true, llamamos a update, si no a create
    const request$ = this.isEditing && this.selectedId
      ? this.enrollmentService.update(this.selectedId, payload)
      : this.enrollmentService.create(payload);

    request$.subscribe({
      next: () => {
        const msg = this.isEditing ? 'Inscripción actualizada' : 'Usuario inscrito con éxito';
        this.snack.open('✅ ' + msg, 'OK', { duration: 3000 });
        this.closeModal();
        this.maintenanceLayout.load();
      },
      error: (err) => {
        console.error('Error del servidor:', err);
        const msg = err.error?.message || 'Error al procesar la solicitud';
        this.snack.open('❌ ' + msg, 'Cerrar');
      }
    });
  }

  closeModal() {
    this.showModal = false;
  }
}