import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core'; // Añadido AfterViewInit
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, map, of, catchError } from 'rxjs';

// Material
import { MatIconModule } from "@angular/material/icon";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from '@angular/material/snack-bar';

// Layout y Configuración
import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';

// Servicios y Modelos
import { UserProgressService } from '../../../services/universilabs/userprogress/userprogress.service';
import { UserProgressResponseDTO } from '../../../models/universilabas/userprogress/userprogress-response.model';
import { AuthService } from '../../../../core/services/auth/auth.service';

@Component({
  selector: 'app-user-progress',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaintenanceLayoutComponent,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './userprogress.component.html',
  styleUrl: './userprogress.component.scss'
})
export class UserProgressComponent implements OnInit, AfterViewInit { // Implementamos AfterViewInit
  
  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<UserProgressResponseDTO>;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private snack = inject(MatSnackBar);
  private authService = inject(AuthService);
  private userProgressService = inject(UserProgressService);

  columns: ColumnConfig[] = [
    { key: 'status', label: 'Estado', priority: 1 },
    { key: 'pageId', label: 'ID Lección', priority: 1 },
    { key: 'timeSpentMinutes', label: 'Tiempo (min)', priority: 2 },
    { key: 'lastAccess', label: 'Último Acceso', priority: 2 }
  ];

  public serviceAdapter: any = {
    list: (params: any) => {
      return this.authService.getCurrentUserId().pipe(
        switchMap(userId => {
          if (!userId) return of({ content: [], totalElements: 0 });
          return this.userProgressService.getAllUserProgress(userId).pipe(
            map(data => {
              const formattedData = (data || []).map(item => ({
                ...item,
                timeSpentMinutes: Math.floor((item.timeSpentSeconds || 0) / 60) + ' min'
              }));
              return { content: formattedData, totalElements: formattedData.length };
            }),
            catchError(() => of({ content: [], totalElements: 0 }))
          );
        })
      );
    },
    // Devolvemos null para que no intente abrir formularios de creación
    create: () => of(null),
    update: (id: any, data: any) => of(null),
    delete: (id: any) => of(null)
  };

  form!: FormGroup;
  showModal = false;

  ngOnInit() {
    this.initForm();
  }

  // --- NUEVO MÉTODO PARA OCULTAR EL BOTÓN DESDE EL TS ---
  ngAfterViewInit() {
    // Buscamos el botón de crear dentro del componente hijo y lo ocultamos
    const createBtn = document.querySelector('app-maintenance-layout button[mat-fab]');
    if (createBtn) {
      (createBtn as HTMLElement).style.display = 'none';
    }
  }

  initForm() {
    this.form = this.fb.group({
      pageId: [null],
      status: [{ value: '', disabled: true }], 
      motivationMessage: ['', [Validators.required]],
      timeSpentSeconds: [0],
      lastAccess: [null]
    });
  }

  viewPageAsStudent(progress: UserProgressResponseDTO) {
    if (!progress?.pageId) return;
    this.router.navigate(['/inicio/leccion', progress.pageId]);
  }

  editProgress(progress: UserProgressResponseDTO) {
    this.showModal = true;
    this.form.patchValue(progress);
  }

  saveProgress() {
    if (this.form.invalid) return;

    const { motivationMessage, pageId } = this.form.getRawValue();

    this.authService.getCurrentUserId().pipe(
      switchMap(userId => {
        if (!userId) throw new Error('Usuario no identificado');
        return this.userProgressService.updateMotivation(userId, pageId, motivationMessage);
      })
    ).subscribe({
      next: () => {
        this.snack.open('✅ Mensaje actualizado correctamente', 'OK', { duration: 3000 });
        this.closeModal();
        this.maintenanceLayout.load(); 
      },
      error: () => this.snack.open('❌ Error al actualizar el mensaje', 'Cerrar')
    });
  }

  closeModal() {
    this.showModal = false;
    this.form.reset();
  }
}