// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-subtopics',
//   imports: [],
//   templateUrl: './subtopics.component.html',
//   styleUrl: './subtopics.component.scss',
// })
// export class SubtopicsComponent {

// }

import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";

import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { SubtopicService } from '../../../services/universilabs/subtopics/subtopic.service';
import { TopicService } from '../../../services/universilabs/topics/topic.service';
import { SubtopicResponseDTO } from '../../../models/universilabas/subtopics/subtopic-response.model';
import { TopicResponseDTO } from '../../../models/universilabas/topics/topic-response.model';
import { SubtopicRequestDTO } from '../../../models/universilabas/subtopics/subtopic-request.model';

@Component({
  selector: 'app-subtopics',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MaintenanceLayoutComponent,
    MatFormFieldModule, MatSelectModule, MatInputModule
  ],
  templateUrl: './subtopics.component.html',
  styleUrls: ['./subtopics.component.scss']
})
export class SubtopicsComponent implements OnInit {
//  
  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<SubtopicResponseDTO>;

  // Configuración de columnas para la tabla
  columns: ColumnConfig[] = [
    { key: 'title', label: 'Nombre del Subtema', priority: 1 },
    { key: 'topicTitle', label: 'Tema Superior', priority: 1 } // El DTO debe traer el nombre del padre
  ];

  subtopicService = inject(SubtopicService);
  topicService = inject(TopicService); // Inyectamos el servicio de temas para el select
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  form!: FormGroup;
  topics: TopicResponseDTO[] = []; // Lista para el dropdown
  showModal = false;
  isEditing = false;
  selectedId: number | null = null;

  ngOnInit() {
    this.initForm();
    this.loadTopics(); // Cargamos los temas al iniciar
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      topicId: [null, [Validators.required]]
    });
  }

  loadTopics() {
    // Usamos el list() del topicService que ya tienes funcionando
    this.topicService.list().subscribe({
      next: (response) => {
        this.topics = response.content;
      },
      error: () => this.snack.open('Error al cargar temas', 'Cerrar')
    });
  }

  createSubtopic() {
    this.isEditing = false;
    this.selectedId = null;
    this.form.reset();
    this.showModal = true;
  }

  editSubtopic(subtopic: SubtopicResponseDTO) {
    this.isEditing = true;
    this.selectedId = subtopic.id;
    this.showModal = true;
    this.form.patchValue({
      title: subtopic.title,
      topicId: subtopic.topicId
    });
  }

  saveSubtopic() {
    if (this.form.invalid) return;

    const payload: SubtopicRequestDTO = this.form.getRawValue();
    const request$ = this.isEditing && this.selectedId
      ? this.subtopicService.update(this.selectedId, payload)
      : this.subtopicService.create(payload);

    request$.subscribe({
      next: () => {
        this.snack.open(`✅ Subtema ${this.isEditing ? 'actualizado' : 'creado'}`, 'OK', { duration: 3000 });
        this.closeModal();
        this.maintenanceLayout.load();
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al guardar';
        this.snack.open('❌ ' + msg, 'Cerrar');
      }
    });
  }

  deleteSubtopic(subtopic: SubtopicResponseDTO) {
    if (confirm(`¿Eliminar subtema "${subtopic.title}"?`)) {
      this.subtopicService.delete(subtopic.id).subscribe({
        next: () => {
          this.snack.open('✅ Subtema eliminado', 'OK');
          this.maintenanceLayout.load();
        }
      });
    }
  }

  closeModal() { this.showModal = false; }
}