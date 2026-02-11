// import { Component, OnInit, ViewChild, inject, HostListener, ElementRef } from "@angular/core";
// import { CommonModule } from "@angular/common";
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from "@angular/forms";

// // Material & UI
// import { MatFormFieldModule } from "@angular/material/form-field";
// import { MatIconModule } from "@angular/material/icon";
// import { MatInputModule } from "@angular/material/input";
// import { MatSelectModule } from "@angular/material/select";
// import { MatSnackBar } from "@angular/material/snack-bar";
// import { MatDividerModule } from "@angular/material/divider";

// // Universilabs Infrastructure
// import { MaintenanceLayoutComponent, ColumnConfig } from "../../../layouts/maintenance-layout/maintenance-layout.component";
// import { UserProfileDTO } from "../../../models/universilabas/userprofiles/userprofile.model";
// import { UserProfileService } from "../../../services/universilabs/userprofiles/user-profile.service";
// import { UserService } from "../../../services/universilabs/users/user.service";

// @Component({
//   selector: 'app-user-profiles',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     FormsModule, // Necesario para el buscador [(ngModel)]
//     MaintenanceLayoutComponent,
//     MatFormFieldModule,
//     MatInputModule,
//     MatIconModule,
//     MatSelectModule,
//     MatDividerModule
//   ],
//   templateUrl: './userprofiles.component.html',
//   styleUrl: './userprofiles.component.scss'
// })
// export class UserProfilesComponent implements OnInit {
  
//   @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<any>;
//   @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

//   readonly IMAGE_URL_PATTERN = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg|webp|svg)/i;

//   columns: ColumnConfig[] = [
//     { key: 'avatarUrl', label: 'Avatar', priority: 1 }, 
//     { key: 'firstName', label: 'Nombre', priority: 1 },
//     { key: 'lastName', label: 'Apellido', priority: 1 },
//     { key: 'phone', label: 'Teléfono', priority: 2 }
//   ];

//   public profileService = inject(UserProfileService);
//   private userService = inject(UserService); 
//   private fb = inject(FormBuilder);
//   private snack = inject(MatSnackBar);

//   form!: FormGroup;
//   showModal = false;
//   selectedId: number | null = null;
//   isEdit = false;
  
//   availableUsers: any[] = []; 
//   filteredUsers: any[] = [];
//   // Eliminamos userProfiles que no se usa y unificamos searchQuery
//   searchQuery: string = ''; 

//   @HostListener('document:keydown.escape')
//   handleEscapeKey() {
//     if (this.showModal) this.closeModal();
//   }

//   ngOnInit() {
//     this.initForm();
//     this.loadUsers(); 
//   }

//   private initForm() {
//     this.form = this.fb.group({
//       firstName: ['', [Validators.required, Validators.maxLength(100)]],
//       lastName: ['', [Validators.required, Validators.maxLength(100)]],
//       phone: ['', [Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{7,15}$/)]],
//       avatarUrl: ['', [Validators.maxLength(500), Validators.pattern(this.IMAGE_URL_PATTERN)]]
//     });
//   }

//   private loadUsers() {
//     this.userService.getAll().subscribe({
//       next: (users) => {
//         this.availableUsers = users;
//         this.filteredUsers = [...users];
//       },
//       error: () => console.error('Error precargando usuarios')
//     });
//   }

//   // --- GESTIÓN DEL BUSCADOR ---

//   onSelectOpened(opened: boolean) {
//     if (opened) {
//       setTimeout(() => {
//         this.searchInput?.nativeElement.focus();
//       }, 100);
//     } else {
//       this.resetSearch();
//     }
//   }

//   filterUsers(event: Event) {
//     event.stopPropagation();
//     const target = event.target as HTMLInputElement;
//     this.searchQuery = target.value.toLowerCase();
    
//     if (!this.searchQuery) {
//       this.filteredUsers = [...this.availableUsers];
//     } else {
//       this.filteredUsers = this.availableUsers.filter(user => 
//         user.username?.toLowerCase().includes(this.searchQuery) || 
//         user.email?.toLowerCase().includes(this.searchQuery)
//       );
//     }
//   }

//   // Esta función reemplaza a clearSearch y resetSearch que tenías antes
//   resetSearch(event?: Event) {
//     if (event) event.stopPropagation();
//     this.searchQuery = '';
//     this.filteredUsers = [...this.availableUsers];
//   }

//   // --- ACCIONES ---

//   onUserChange(userId: number) {
//     this.selectedId = userId;
//     this.resetSearch();
//   }

//   openCreateModal() {
//     this.isEdit = false;
//     this.selectedId = null; 
//     this.form.reset();
//     this.resetSearch();
//     this.showModal = true;
//   }

//   editProfile(profile: any) {
//     this.isEdit = true;
//     const p = profile as UserProfileDTO;
//     this.selectedId = p.id || p.userId;
    
//     this.form.patchValue({
//       firstName: p.firstName,
//       lastName: p.lastName,
//       phone: p.phone,
//       avatarUrl: p.avatarUrl
//     });
//     this.showModal = true;
//   }

//   saveProfile() {
//     if (this.form.invalid || !this.selectedId) {
//       this.form.markAllAsTouched();
//       if (!this.selectedId) {
//         this.snack.open('⚠️ Debe seleccionar un usuario', 'Cerrar', { duration: 2000 });
//       }
//       return;
//     }

//     const formValues = this.form.value;
//     const data: UserProfileDTO = {
//       ...formValues,
//       id: this.selectedId, 
//       userId: this.selectedId,
//       nombre: `${formValues.firstName} ${formValues.lastName}`.trim(),
//       activo: true
//     };

//     const request = this.isEdit 
//       ? this.profileService.update(this.selectedId, data)
//       : this.profileService.create(data);

//     request.subscribe({
//       next: () => {
//         this.snack.open(`✅ Perfil ${this.isEdit ? 'actualizado' : 'creado'}`, 'OK', { duration: 3000 });
//         this.closeModal();
//         this.maintenanceLayout.load();
//       },
//       error: () => this.snack.open('❌ Error al guardar los datos', 'Cerrar')
//     });
//   }

//   deleteProfile(profile: any) {
//     const id = profile.id || profile.userId;
//     if (confirm(`¿Está seguro de eliminar el perfil de ${profile.firstName}?`)) {
//       this.profileService.delete(id).subscribe({
//         next: () => {
//           this.snack.open('🗑️ Perfil eliminado correctamente', 'OK', { duration: 3000 });
//           this.maintenanceLayout.load();
//         }
//       });
//     }
//   }

//   closeModal() {
//     this.showModal = false;
//     this.selectedId = null;
//     this.isEdit = false;
//     this.resetSearch();
//     this.form.reset();
//   }

//   onPhoneInput(event: Event) {
//     const input = event.target as HTMLInputElement;
//     let value = input.value.replace(/[^0-9+]/g, '');
//     this.form.get('phone')?.setValue(value, { emitEvent: false });
//   }

//   handleImageError(event: any) {
//     event.target.src = 'https://ui-avatars.com/api/?name=User&background=1a222c&color=00f3ff';
//   }
// }

import { Component, OnInit, ViewChild, inject, HostListener, ElementRef, ChangeDetectorRef } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormsModule } from "@angular/forms";

// Material & UI
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatDividerModule } from "@angular/material/divider";

// Universilabs Infrastructure
import { MaintenanceLayoutComponent, ColumnConfig } from "../../../layouts/maintenance-layout/maintenance-layout.component";
import { UserProfileDTO } from "../../../models/universilabas/userprofiles/userprofile.model";
import { UserProfileService } from "../../../services/universilabs/userprofiles/user-profile.service";
import { UserService } from "../../../services/universilabs/users/user.service";

@Component({
  selector: 'app-user-profiles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MaintenanceLayoutComponent,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatSelectModule,
    MatDividerModule
  ],
  templateUrl: './userprofiles.component.html',
  styleUrl: './userprofiles.component.scss'
})
export class UserProfilesComponent implements OnInit {
//  
  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<any>;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  readonly IMAGE_URL_PATTERN = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png|jpeg|webp|svg)/i;

  columns: ColumnConfig[] = [
    { key: 'avatarUrl', label: 'Avatar', priority: 1 }, 
    { key: 'firstName', label: 'Nombre', priority: 1 },
    { key: 'lastName', label: 'Apellido', priority: 1 },
    { key: 'phone', label: 'Teléfono', priority: 2 }
  ];

  public profileService = inject(UserProfileService);
  private userService = inject(UserService); 
  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private cd = inject(ChangeDetectorRef); // Inyectado para forzar renderizado en el patchValue

  form!: FormGroup;
  showModal = false;
  selectedId: number | null = null;
  isEdit = false;
  
  availableUsers: any[] = []; 
  filteredUsers: any[] = [];
  searchQuery: string = ''; 

  @HostListener('document:keydown.escape')
  handleEscapeKey() {
    if (this.showModal) this.closeModal();
  }

  ngOnInit() {
    this.initForm();
    this.loadUsers(); 
  }

  private initForm() {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{7,15}$/)]],
      avatarUrl: ['', [Validators.maxLength(500), Validators.pattern(this.IMAGE_URL_PATTERN)]]
    });
  }

  private loadUsers() {
    this.userService.getAll().subscribe({
      next: (users) => {
        this.availableUsers = users;
        this.filteredUsers = [...users];
      },
      error: () => console.error('Error precargando usuarios')
    });
  }

  // --- GESTIÓN DEL BUSCADOR ---

  onSelectOpened(opened: boolean) {
    if (opened) {
      setTimeout(() => {
        this.searchInput?.nativeElement.focus();
      }, 100);
    } else {
      this.resetSearch();
    }
  }

  filterUsers(event: Event) {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value.toLowerCase();
    
    if (!this.searchQuery) {
      this.filteredUsers = [...this.availableUsers];
    } else {
      this.filteredUsers = this.availableUsers.filter(user => 
        user.username?.toLowerCase().includes(this.searchQuery) || 
        user.email?.toLowerCase().includes(this.searchQuery)
      );
    }
  }

  resetSearch(event?: Event) {
    if (event) event.stopPropagation();
    this.searchQuery = '';
    this.filteredUsers = [...this.availableUsers];
  }

  // --- ACCIONES ---

  onUserChange(userId: number) {
    this.selectedId = userId;
    this.resetSearch();
  }

  openCreateModal() {
    this.isEdit = false;
    this.selectedId = null; 
    this.form.reset();
    this.resetSearch();
    this.showModal = true;
  }

  editProfile(profile: any) {
    this.isEdit = true;
    const p = profile as UserProfileDTO;
    
    // Corregido: Priorizamos el ID del perfil si existe, sino el userId vinculado
    this.selectedId = p.id || p.userId || null;
    
    this.form.patchValue({
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      phone: p.phone || '',
      avatarUrl: p.avatarUrl || ''
    });

    this.showModal = true;
    this.cd.detectChanges(); // Forzamos actualización de vista
  }

  //
  saveProfile() {
      if (this.form.invalid || !this.selectedId) {
        this.form.markAllAsTouched();
        if (!this.selectedId) {
          this.snack.open('⚠️ Debe seleccionar un usuario', 'Cerrar', { duration: 2000 });
        }
        return;
      }

      const formValues = this.form.value;
      
      const data: UserProfileDTO = {
        ...formValues,
        id: this.selectedId, 
        userId: this.selectedId,
        nombre: `${formValues.firstName} ${formValues.lastName}`.trim(),
        activo: true
      };

      // --- CAMBIO AQUÍ ---
      const request = this.isEdit 
        ? this.profileService.update(this.selectedId, data)
        : this.profileService.create(this.selectedId, data); // <--- Añadido this.selectedId como primer argumento
      // -------------------

      request.subscribe({
        next: () => {
          this.snack.open(`✅ Perfil ${this.isEdit ? 'actualizado' : 'creado'}`, 'OK', { duration: 3000 });
          this.closeModal();
          if (this.maintenanceLayout) {
            this.maintenanceLayout.load();
          }
        },
        error: (err) => {
          console.error('Error al guardar:', err);
          this.snack.open('❌ Error al guardar los datos', 'Cerrar');
        }
      });
  }

  deleteProfile(profile: any) {
    const id = profile.id || profile.userId;
    if (!id) return;

    if (confirm(`¿Está seguro de eliminar el perfil de ${profile.firstName}?`)) {
      this.profileService.delete(id).subscribe({
        next: () => {
          this.snack.open('🗑️ Perfil eliminado correctamente', 'OK', { duration: 3000 });
          this.maintenanceLayout.load();
        },
        error: () => this.snack.open('❌ Error al eliminar', 'Cerrar')
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedId = null;
    this.isEdit = false;
    this.resetSearch();
    this.form.reset();
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/[^0-9+]/g, '');
    this.form.get('phone')?.setValue(value, { emitEvent: false });
  }

  handleImageError(event: any) {
    event.target.src = 'https://ui-avatars.com/api/?name=User&background=1a222c&color=00f3ff';
  }
}