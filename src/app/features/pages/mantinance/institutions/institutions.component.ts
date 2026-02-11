import { Component, OnInit, inject, ViewChild, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

// Material & Layout
import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { InstitutionService } from '../../../services/universilabs/institutions/institution.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InstitutionDTO } from '../../../models/universilabas/institution/institution.model';
import { Observable, of, timer, switchMap, map, catchError } from 'rxjs';

@Component({
  selector: 'app-institutions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MaintenanceLayoutComponent
  ],
  templateUrl: './institutions.component.html',
  styleUrls: ['./institutions.component.scss']
})
export class InstitutionsComponent implements OnInit {

  // Forzamos a que para el Layout, el ID sea tratado como obligatorio para evitar conflictos de tipos
  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<InstitutionDTO & { id: number }>;

  columns: ColumnConfig[] = [
    { key: 'name', label: 'Nombre', priority: 1 },
    { key: 'email', label: 'Email', priority: 1 },
    { key: 'address', label: 'Dirección', priority: 2 },
    { key: 'website', label: 'Website', priority: 3 },
    { key: 'description', label: 'Descripción', priority: 4 }
  ];

  form!: FormGroup;
  currentInstitution: InstitutionDTO | null = null;
  showModal = false;

  // Inyecciones
  institutionService = inject(InstitutionService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private cd = inject(ChangeDetectorRef);

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      name: [
        '', 
        [Validators.required, Validators.maxLength(255)], 
        [this.nameExistsValidator()]
      ],
      email: [
        '', 
        [
          Validators.required, 
          // Regex estricta: requiere texto + @ + texto + . + texto (mínimo 2 letras)
          Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/), 
          Validators.maxLength(150)
        ], 
        [this.emailExistsValidator()]
      ],
      address: [
        '', 
        [Validators.required, Validators.maxLength(500)]
      ],
      website: [
        '', 
        [
          Validators.pattern('^(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})([/\\w .-]*)*/?$'), 
          Validators.maxLength(500)
        ]
      ],
      description: [
        '', 
        [Validators.maxLength(2000)]
      ]
    });
  }

  createInstitution() {
    this.currentInstitution = null;
    this.form.reset();
    this.showModal = true;
  }

  editInstitution(institution: InstitutionDTO) {
    this.currentInstitution = institution;
    this.form.patchValue(institution);
    this.showModal = true;
  }

  deleteInstitution(dto: InstitutionDTO) {
    if (!confirm(`¿Estás seguro de que deseas eliminar la institución "${dto.name}"?`)) return;

    if (dto.id) {
      this.institutionService.delete(dto.id).subscribe({
        next: () => {
          this.snack.open('¡Institución eliminada con éxito!', 'Entendido', { 
            duration: 3000,
            panelClass: ['success-snackbar'] 
          });
          this.maintenanceLayout.load(); 
        },
        error: (err) => {
          this.snack.open('No se pudo eliminar: Verifique dependencias activas.', 'Cerrar', { duration: 5000 });
        }
      });
    }
  }

  saveInstitution() {
    // 1. Bloquear si hay validaciones asíncronas en curso (evita duplicados por clic rápido)
    if (this.form.pending) {
      this.snack.open('Esperando validación de disponibilidad...', 'Cerrar', { duration: 2000 });
      return;
    }

    // 2. Bloquear si el formulario es inválido
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.snack.open('Por favor, completa correctamente todos los campos', 'Cerrar', { duration: 3000 });
      return;
    }

    const payload: Partial<InstitutionDTO> = this.form.value;
    const id = this.currentInstitution?.id;
    
    const obs$ = id
      ? this.institutionService.update(id, payload)
      : this.institutionService.create(payload);

    obs$.subscribe({
      next: () => {
        this.snack.open(id ? 'Institución actualizada' : 'Institución creada', 'Cerrar', { 
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        this.maintenanceLayout.load(); 
        this.closeModal();
      },
      error: (err) => {
        console.error(err);
        const errorMsg = err.error?.message || 'Error al guardar los datos';
        this.snack.open(errorMsg, 'Cerrar', { duration: 5000 });
      }
    });
  }

  // --- Validadores Asíncronos ---

  emailExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value === this.currentInstitution?.email) {
        return of(null);
      }
      
      return timer(500).pipe(
        switchMap(() => this.institutionService.checkEmailExists(control.value)),
        map(exists => (exists ? { emailTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }
  
  nameExistsValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      if (!control.value || control.value === this.currentInstitution?.name) {
        return of(null);
      }
      return timer(500).pipe(
        switchMap(() => this.institutionService.checkNameExists(control.value)),
        map(exists => (exists ? { nameTaken: true } : null)),
        catchError(() => of(null))
      );
    };
  }

  closeModal() {
    this.showModal = false;
    this.currentInstitution = null;
    this.form.reset();
    this.cd.detectChanges(); // Asegura que la UI se actualice sin errores de ciclo de vida
  }

  onSearch(term: string) {
    this.maintenanceLayout.onSearch(term); 
  }
}