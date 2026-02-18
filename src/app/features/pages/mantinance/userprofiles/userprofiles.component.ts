// import { Component, OnInit, ViewChild, inject, HostListener, ElementRef, ChangeDetectorRef } from "@angular/core";
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
//     FormsModule,
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
// //  
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
//   private cd = inject(ChangeDetectorRef); // Inyectado para forzar renderizado en el patchValue

//   form!: FormGroup;
//   showModal = false;
//   selectedId: number | null = null;
//   isEdit = false;
  
//   availableUsers: any[] = []; 
//   filteredUsers: any[] = [];
//   searchQuery: string = ''; 

//   @HostListener('document:keydown.escape')
//   handleEscapeKey() {
//     if (this.showModal) this.closeModal();
//   }

//   ngOnInit() {
//     this.initForm();
//     this.loadUsers(); 
//   }

//   // private initForm() {
//   //   this.form = this.fb.group({
//   //     firstName: ['', [Validators.required, Validators.maxLength(100)]],
//   //     lastName: ['', [Validators.required, Validators.maxLength(100)]],
//   //     phone: ['', [Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{7,15}$/)]],
//   //     avatarUrl: ['', [Validators.maxLength(500), Validators.pattern(this.IMAGE_URL_PATTERN)]]
//   //   });
//   // }

//   private initForm() {
//     this.form = this.fb.group({
//       firstName: ['', [Validators.required, Validators.maxLength(100)]],
//       lastName: ['', [Validators.required, Validators.maxLength(100)]],
//       phone: ['', [Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{7,15}$/)]],
//       // Eliminamos el patrón de URL para permitir Base64
//       avatarUrl: ['', [Validators.maxLength(2000000)]] 
//     });
//   }

//   // Método para procesar la imagen seleccionada desde el PC
//   onFileSelected(event: Event) {
//     const target = event.target as HTMLInputElement;
//     const file = target.files?.[0];

//     if (file) {
//       // Validar que sea una imagen
//       if (!file.type.startsWith('image/')) {
//         this.snack.open('❌ El archivo debe ser una imagen', 'Cerrar', { duration: 3000 });
//         return;
//       }

//       // Validar tamaño máximo (ejemplo 1MB para no saturar la BD con Base64)
//       if (file.size > 1024 * 1024) {
//         this.snack.open('❌ La imagen es muy pesada (Máx 1MB)', 'Cerrar', { duration: 3000 });
//         return;
//       }

//       const reader = new FileReader();
//       reader.onload = () => {
//         // Guardamos el resultado (Base64) en el campo avatarUrl
//         this.form.patchValue({ avatarUrl: reader.result as string });
//         this.cd.detectChanges();
//       };
//       reader.readAsDataURL(file);
//     }
//   }

//   // Método para limpiar la imagen seleccionada
//   removeImage() {
//     this.form.patchValue({ avatarUrl: '' });
//     this.cd.detectChanges();
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
    
//     // Corregido: Priorizamos el ID del perfil si existe, sino el userId vinculado
//     this.selectedId = p.id || p.userId || null;
    
//     this.form.patchValue({
//       firstName: p.firstName || '',
//       lastName: p.lastName || '',
//       phone: p.phone || '',
//       avatarUrl: p.avatarUrl || ''
//     });

//     this.showModal = true;
//     this.cd.detectChanges(); // Forzamos actualización de vista
//   }

//   //
//   saveProfile() {
//       if (this.form.invalid || !this.selectedId) {
//         this.form.markAllAsTouched();
//         if (!this.selectedId) {
//           this.snack.open('⚠️ Debe seleccionar un usuario', 'Cerrar', { duration: 2000 });
//         }
//         return;
//       }

//       const formValues = this.form.value;
      
//       const data: UserProfileDTO = {
//         ...formValues,
//         id: this.selectedId, 
//         userId: this.selectedId,
//         nombre: `${formValues.firstName} ${formValues.lastName}`.trim(),
//         activo: true
//       };

//       // --- CAMBIO AQUÍ ---
//       const request = this.isEdit 
//         ? this.profileService.update(this.selectedId, data)
//         : this.profileService.create(this.selectedId, data); // <--- Añadido this.selectedId como primer argumento
//       // -------------------

//       request.subscribe({
//         next: () => {
//           this.snack.open(`✅ Perfil ${this.isEdit ? 'actualizado' : 'creado'}`, 'OK', { duration: 3000 });
//           this.closeModal();
//           if (this.maintenanceLayout) {
//             this.maintenanceLayout.load();
//           }
//         },
//         error: (err) => {
//           console.error('Error al guardar:', err);
//           this.snack.open('❌ Error al guardar los datos', 'Cerrar');
//         }
//       });
//   }

//   deleteProfile(profile: any) {
//     const id = profile.id || profile.userId;
//     if (!id) return;

//     if (confirm(`¿Está seguro de eliminar el perfil de ${profile.firstName}?`)) {
//       this.profileService.delete(id).subscribe({
//         next: () => {
//           this.snack.open('🗑️ Perfil eliminado correctamente', 'OK', { duration: 3000 });
//           this.maintenanceLayout.load();
//         },
//         error: () => this.snack.open('❌ Error al eliminar', 'Cerrar')
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
import { MatButtonModule } from "@angular/material/button";

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
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './userprofiles.component.html',
  styleUrl: './userprofiles.component.scss'
})
export class UserProfilesComponent implements OnInit {

  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<any>;
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  readonly PRESET_AVATARS = [
      { url: 'img-profiles/Colibri.jpg', name: 'Colibrí' },
      { url: 'img-profiles/Desierto.jpg', name: 'Desierto' }
  ];

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
  private cd = inject(ChangeDetectorRef);

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
    this.loadUsersWithProfile(); 
  }

  private initForm() {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.maxLength(100)]],
      lastName: ['', [Validators.required, Validators.maxLength(100)]],
      phone: ['', [Validators.pattern(/^(\+\d{1,3}[- ]?)?\d{7,15}$/)]],
      avatarUrl: ['', [Validators.maxLength(500)]] 
    });
  }

  // --- GESTIÓN DE AVATARES ---

  selectPresetAvatar(path: string) {
    this.form.patchValue({ avatarUrl: path });
    this.cd.detectChanges();
  }

  removeImage() {
    this.form.patchValue({ avatarUrl: '' });
  }

  // --- GESTIÓN DE USUARIOS (FILTRADO POR PERFIL EXISTENTE) ---
  
  private loadUsersWithProfile() {
    // Usamos profileService para obtener la lista de quienes ya tienen perfil
    this.profileService.getAll().subscribe({
      next: (profiles) => {
        this.availableUsers = profiles.map(p => ({
          id: p.userId,
          username: p.nombre || `${p.firstName} ${p.lastName}`.trim() || `Usuario ${p.userId}`,
          email: p.phone || 'Sin teléfono'
        }));
        this.filteredUsers = [...this.availableUsers];
      },
      error: () => console.error('Error cargando perfiles')
    });
  }

  onSelectOpened(opened: boolean) {
    if (opened) {
      setTimeout(() => this.searchInput?.nativeElement.focus(), 100);
    } else {
      this.resetSearch();
    }
  }

  filterUsers(event: Event) {
    event.stopPropagation();
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value.toLowerCase();
    this.filteredUsers = !this.searchQuery 
      ? [...this.availableUsers] 
      : this.availableUsers.filter(u => 
          u.username?.toLowerCase().includes(this.searchQuery) || 
          u.email?.toLowerCase().includes(this.searchQuery)
        );
  }

  resetSearch(event?: Event) {
    if (event) event.stopPropagation();
    this.searchQuery = '';
    this.filteredUsers = [...this.availableUsers];
  }

  onUserChange(userId: number) {
    this.selectedId = userId;
    this.resetSearch();

    // Verificamos el perfil
    this.profileService.getById(userId).subscribe({
      next: (profile) => {
        this.isEdit = true;
        this.form.patchValue({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          phone: profile.phone || '',
          avatarUrl: profile.avatarUrl || ''
        });
      },
      error: () => {
        // Si no lo encuentra, usamos el UserService para ver si el usuario existe al menos
        this.userService.getById(userId).subscribe({
          next: () => {
            this.snack.open('ℹ️ El usuario existe pero no tiene datos de perfil aún.', 'OK');
            this.isEdit = false;
            this.form.reset();
          },
          error: () => this.snack.open('❌ El usuario seleccionado no existe en el sistema.', 'Cerrar')
        });
      }
    });
  }

  // --- ACCIONES ---

  openCreateModal() {
    this.isEdit = false;
    this.selectedId = null; 
    this.form.reset();
    this.showModal = true;
  }

  editProfile(profile: any) {
    this.isEdit = true;
    const p = profile as UserProfileDTO;
    this.selectedId = p.id || p.userId || null;
    this.form.patchValue({
      firstName: p.firstName || '',
      lastName: p.lastName || '',
      phone: p.phone || '',
      avatarUrl: p.avatarUrl || ''
    });
    this.showModal = true;
    this.cd.detectChanges();
  }
  
  saveProfile() {
    if (this.form.invalid || !this.selectedId) {
      this.form.markAllAsTouched();
      return;
    }

    const data: UserProfileDTO = {
      id: this.selectedId,
      userId: this.selectedId,
      firstName: this.form.value.firstName,
      lastName: this.form.value.lastName,
      phone: this.form.value.phone,
      avatarUrl: this.form.value.avatarUrl,
      activo: true 
    };

    // Siempre update porque el perfil se crea en el registro
    this.profileService.update(this.selectedId, data).subscribe({
      next: () => {
        this.snack.open('✅ Perfil actualizado', 'OK', { duration: 3000 });
        this.closeModal();
        this.maintenanceLayout?.load();
        this.loadUsersWithProfile(); // Actualiza la lista del buscador
      },
      error: () => this.snack.open('❌ Error al guardar cambios', 'Cerrar')
    });
  }

  deleteProfile(profile: any) {
    const id = profile.id || profile.userId;
    if (id && confirm(`¿Estás seguro de eliminar el perfil de ${profile.firstName}?`)) {
      this.profileService.delete(id).subscribe({
        next: () => {
          this.snack.open('🗑️ Perfil eliminado', 'OK', { duration: 3000 });
          this.maintenanceLayout.load();
          this.loadUsersWithProfile();
        }
      });
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedId = null;
    this.isEdit = false;
    this.form.reset();
  }

  onPhoneInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.form.get('phone')?.setValue(input.value.replace(/[^0-9+]/g, ''), { emitEvent: false });
  }

  handleImageError(event: any) {
    event.target.src = 'https://ui-avatars.com/api/?name=User&background=1a222c&color=00f3ff';
  }
}