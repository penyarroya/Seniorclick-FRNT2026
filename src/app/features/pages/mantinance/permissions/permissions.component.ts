import { Component, OnInit, ViewChild, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatIconModule } from "@angular/material/icon"; // Añadido
import { MatButtonModule } from "@angular/material/button"; // Añadido
import { MaintenanceLayoutComponent, ColumnConfig } from "../../../layouts/maintenance-layout/maintenance-layout.component";
import { PermissionService } from "../../../services/universilabs/permissions/permission.service";

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MaintenanceLayoutComponent, 
    MatFormFieldModule, 
    MatInputModule,
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './permissions.component.html',
  styleUrl: './permissions.component.scss',
})
export class PermissionsComponent implements OnInit {
  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<any>;
  
  columns: ColumnConfig[] = [
    { key: 'id', label: 'ID', priority: 1 },
    { key: 'name', label: 'Nombre Técnico', priority: 2 },
    { key: 'description', label: 'Descripción', priority: 3 } // Añadido para mayor claridad
  ];

  public permissionService = inject(PermissionService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  form!: FormGroup;
  showModal = false;
  isEdit = false;
  selectedId: number | null = null;

  ngOnInit() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(100)]],
      description: ['', [Validators.maxLength(255)]] // Añadido
    });
  }

  openCreateModal() {
    this.isEdit = false;
    this.selectedId = null;
    this.form.reset();
    this.showModal = true;
  }

  editPermission(perm: any) {
    this.isEdit = true;
    this.selectedId = perm.id;
    this.form.patchValue({ 
      name: perm.name,
      description: perm.description 
    });
    this.showModal = true;
  }

  save() {
    if (this.form.invalid) return;
    const request = this.isEdit 
      ? this.permissionService.update(this.selectedId!, this.form.value)
      : this.permissionService.create(this.form.value);

    request.subscribe({
      next: () => {
        this.snack.open('Permiso guardado correctamente', 'OK', { duration: 2000 });
        this.closeModal();
        this.maintenanceLayout.load();
      },
      error: () => this.snack.open('Error al guardar el permiso', 'Cerrar')
    });
  }

  closeModal() {
    this.showModal = false;
    this.form.reset();
  }
}