// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-roles',
//   imports: [],
//   templateUrl: './roles.component.html',
//   styleUrl: './roles.component.scss',
// })
// export class RolesComponent {

// }


import { Component, OnInit, ViewChild, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MaintenanceLayoutComponent, ColumnConfig } from "../../../layouts/maintenance-layout/maintenance-layout.component";
import { RoleService } from "../../../services/universilabs/roles/role.service";
import { PermissionService } from "../../../services/universilabs/permissions/permission.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, 
              ReactiveFormsModule, 
              FormsModule, 
              MaintenanceLayoutComponent, 
              MatFormFieldModule, 
              MatInputModule, 
              MatSelectModule,
              MatIconModule,
              MatDividerModule,
              MatButtonModule 
            ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
//  
  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<any>;

  columns: ColumnConfig[] = [
    { key: 'id', label: 'ID', priority: 1 },
    { key: 'name', label: 'Nombre del Rol', priority: 2 },
    { key: 'permissions', label: 'Permisos', priority: 3 }
  ];
    
  public roleService = inject(RoleService);
  private permissionService = inject(PermissionService);
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);

  form!: FormGroup;
  showModal = false;
  isEdit = false;
  selectedId: number | null = null;
  
  availablePermissions: any[] = []; // Lista para el select múltiple

  ngOnInit() {
    this.initForm();
    this.loadPermissions();
  }

  private initForm() {
    this.form = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      permissions: [[], [Validators.required, Validators.minLength(1)]]
    });
  }

  //
  ngAfterViewInit() {
    if (this.maintenanceLayout) {
      // Forzamos el bindeo del servicio antes de cargar
      this.maintenanceLayout.service = this.roleService; 
      
      setTimeout(() => {
        console.log('Disparando carga definitiva...');
        this.maintenanceLayout.load(); 
      }, 200);
    }
  }

  //
  private loadPermissions() {
    this.permissionService.list().subscribe({ 
      next: (res) => {
        // 'res' es un objeto Page, necesitamos solo el array de 'content'
        this.availablePermissions = res.content || []; 
        console.log('Catálogo de permisos cargado:', this.availablePermissions);
      },
      error: () => this.snack.open('Error al cargar catálogo de permisos', 'Cerrar')
    });
  }
  //
  openCreateModal() {
    this.isEdit = false;
    this.selectedId = null;
    this.form.reset({ permissions: [] });
    this.showModal = true;
  }

  //
  editRole(role: any) {
    this.isEdit = true;
    this.selectedId = role.id;
    
    // Como tu backend (Java) envía una lista de nombres (Strings)
    // y tu disponiblePermissions tiene objetos con .name
    this.form.patchValue({
      name: role.name,
      permissions: role.permissions // Si Java envía ['READ', 'WRITE'], patchValue los seleccionará si coinciden con el [value] del mat-option
    });
    this.showModal = true;
  }

  //
  saveRole() {
    if (this.form.invalid) return;

    const rawValues = this.form.value;
    // Re-construimos el objeto para que coincida con RoleEntity (Set<PermissionEntity>)
    const roleData = {
      name: rawValues.name,
      permissions: rawValues.permissions.map((id: number) => ({ id }))
    };

    const request = this.isEdit 
      ? this.roleService.update(this.selectedId!, roleData)
      : this.roleService.create(roleData);

    request.subscribe({
      next: () => {
        this.snack.open('Rol guardado correctamente', 'OK', { duration: 3000 });
        this.closeModal();
        this.maintenanceLayout.load();
      }
    });
  }

  closeModal() {
    this.showModal = false;
    this.form.reset();
  }
}