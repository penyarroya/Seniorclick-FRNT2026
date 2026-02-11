import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { MatInputModule } from "@angular/material/input";

import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { TopicService } from '../../../services/universilabs/topics/topic.service';
import { CollectionService } from '../../../services/universilabs/collections/collection.service';
import { TopicResponseDTO } from '../../../models/universilabas/topics/topic-response.model';
import { CollectionResponseDTO } from '../../../models/universilabas/collections/collection-response.model';
import { TopicRequestDTO } from '../../../models/universilabas/topics/topic-request.model';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MaintenanceLayoutComponent,
    MatFormFieldModule, MatSelectModule, MatInputModule
  ],
  templateUrl: './topics.component.html',
  styleUrls: ['./topics.component.scss']
})
export class TopicsComponent implements OnInit {
  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<TopicResponseDTO>;

  columns: ColumnConfig[] = [
    { key: 'title', label: 'Título del Tema', priority: 1 },
    { key: 'collectionName', label: 'Colección', priority: 1 }, // Asumiendo que el DTO trae el nombre
    { key: 'subtopicsCount', label: 'Subtemas', priority: 2 }
  ];

  topicService = inject(TopicService);
  collectionService = inject(CollectionService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  form!: FormGroup;
  collections: CollectionResponseDTO[] = [];
  showModal = false;
  isEditing = false;
  selectedId: number | null = null;

  ngOnInit() {
    this.initForm();
    this.loadCollections();
  }

  initForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(255)]],
      collectionId: [null, [Validators.required]]
    });
  }

  loadCollections() {
    this.collectionService.list().subscribe({
      next: (response) => {
        // response es de tipo Page<CollectionResponseDTO>
        // response.content es de tipo CollectionResponseDTO[]
        this.collections = response.content; 
      },
      error: (err) => {
        console.error('Error:', err);
        this.snack.open('Error al cargar colecciones', 'Cerrar');
      }
    });
  }

  createTopic() {
    this.isEditing = false;
    this.selectedId = null;
    this.form.reset();
    this.showModal = true;
  }

  editTopic(topic: TopicResponseDTO) {
    this.isEditing = true;
    this.selectedId = topic.id;
    this.showModal = true;
    this.form.patchValue({
      title: topic.title,
      collectionId: topic.collectionId
    });
  }

  saveTopic() {
    if (this.form.invalid) return;

    const payload: TopicRequestDTO = this.form.getRawValue();
    const request$ = this.isEditing && this.selectedId
      ? this.topicService.update(this.selectedId, payload)
      : this.topicService.create(payload);

    request$.subscribe({
      next: () => {
        this.snack.open(`✅ Tema ${this.isEditing ? 'actualizado' : 'creado'}`, 'OK', { duration: 3000 });
        this.closeModal();
        this.maintenanceLayout.load();
      },
      error: (err) => {
        const serverMessage = err.error?.message || 'Error al guardar el tema';
        this.snack.open('❌ ' + serverMessage, 'Cerrar', { duration: 5000 });
      }
    });
  }

  deleteTopic(topic: TopicResponseDTO) {
    if (confirm(`¿Eliminar el tema "${topic.title}"?`)) {
      this.topicService.delete(topic.id).subscribe({
        next: () => {
          this.snack.open('✅ Tema eliminado', 'OK', { duration: 3000 });
          this.maintenanceLayout.load();
        }
      });
    }
  }

  closeModal() { this.showModal = false; }
}