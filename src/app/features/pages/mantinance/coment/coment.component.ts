// import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
// import { CommonModule, Location } from '@angular/common'; // Añadido CommonModule
// import { MatTableDataSource, MatTableModule } from '@angular/material/table'; // Añadido MatTableModule
// import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator'; // Añadido MatPaginatorModule
// import { MatSort, MatSortModule } from '@angular/material/sort'; // Añadido MatSortModule
// import { MatIconModule } from "@angular/material/icon"; // Mejor usar el módulo completo
// import { MatButtonModule } from "@angular/material/button"; // Para tus botones

// import { CommentResponseDTO } from '../../../models/universilabas/coments/coments-respose.model';
// import { CommentService } from '../../../services/universilabs/coments/coment.service';

// @Component({
//   selector: 'app-coment',
//   standalone: true, // Asegúrate de tener esto si usas 'imports'
//   templateUrl: './coment.component.html',
//   styleUrls: ['./coment.component.scss'],
//   imports: [
//     CommonModule,
//     MatTableModule,
//     MatPaginatorModule,
//     MatSortModule,
//     MatIconModule,
//     MatButtonModule
//   ]
// })
// export class ComentComponent implements OnInit, AfterViewInit {
//   // El resto de tu lógica está perfecta y bien limpia
//   displayedColumns: string[] = ['user', 'content', 'date', 'actions'];
//   dataSource = new MatTableDataSource<CommentResponseDTO>([]);
//   isLoading = true;

//   @ViewChild(MatPaginator) paginator!: MatPaginator;
//   @ViewChild(MatSort) sort!: MatSort;

//   constructor(
//     private commentService: CommentService,
//     private location: Location
//   ) { }

//   ngOnInit(): void {
//     this.loadComments();
//   }

//   ngAfterViewInit() {
//     this.dataSource.paginator = this.paginator;
//     this.dataSource.sort = this.sort;
//   }

//   loadComments(): void {
//     this.isLoading = true;
//     this.commentService.getAllComments().subscribe({
//       next: (data) => {
//         this.dataSource.data = data;
        
//         // --- ESTAS LÍNEAS ASEGURAN QUE EL SORT Y PAGINADOR SE ENTEREN DE LOS NUEVOS DATOS ---
//         this.dataSource.sort = this.sort;
//         this.dataSource.paginator = this.paginator;
//         // ---------------------------------------------------------------------------------
        
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Error al recuperar comentarios:', err);
//         this.isLoading = false;
//       }
//     });
//   }

//   applyFilter(event: Event): void {
//     const filterValue = (event.target as HTMLInputElement).value;
//     this.dataSource.filter = filterValue.trim().toLowerCase();

//     if (this.dataSource.paginator) {
//       this.dataSource.paginator.firstPage();
//     }
//   }

//   onDelete(comment: CommentResponseDTO): void {
//     const confirmar = confirm(`¿Estás seguro de que deseas eliminar el comentario de ${comment.userName}?`);
    
//     if (confirmar) {
//       this.commentService.delete(comment.id).subscribe({
//         next: () => {
//           this.dataSource.data = this.dataSource.data.filter(c => c.id !== comment.id);
//         },
//         error: () => {
//           alert('Error al eliminar el comentario');
//         }
//       });
//     }
//   }
  
//   goBack(): void {
//     this.location.back();
//   }
// }

// import { Component, OnInit, inject, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatSnackBar } from '@angular/material/snack-bar';
// import { MatFormFieldModule } from "@angular/material/form-field";
// import { MatInputModule } from "@angular/material/input";
// import { MatIconModule } from "@angular/material/icon";
// import { Router } from '@angular/router';

// // Layout y Servicios
// import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';
// import { CommentService } from '../../../services/universilabs/coments/coment.service';

// // Modelos
// import { CommentResponseDTO } from '../../../models/universilabas/coments/coments-respose.model';

// @Component({
//   selector: 'app-coment',
//   standalone: true,
//   imports: [
//     CommonModule,
//     ReactiveFormsModule,
//     FormsModule,
//     MaintenanceLayoutComponent,
//     MatFormFieldModule,
//     MatInputModule,
//     MatIconModule
//   ],
//   templateUrl: './coment.component.html',
//   styleUrls: ['./coment.component.scss']
// })
// export class ComentComponent implements OnInit {
//   private router = inject(Router);
//   private snack = inject(MatSnackBar);
//   public commentService = inject(CommentService); 

//   // Agregamos { static: false } para asegurar la detección tras el renderizado
//   @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<CommentResponseDTO>;

//   columns: ColumnConfig[] = [
//     { key: 'username', label: 'Autor', priority: 1 },
//     { key: 'content', label: 'Comentario', priority: 1 },
//     { key: 'pageId', label: 'ID Lección', priority: 2 },
//     { key: 'createdAt', label: 'Fecha', priority: 2 }
//   ];

//   showModal = false;
//   selectedComment: CommentResponseDTO | null = null;

//   ngOnInit() {}

//   viewCommentDetail(comment: CommentResponseDTO) {
//     this.selectedComment = comment;
//     this.showModal = true;
//   }

//   goToLesson(comment: CommentResponseDTO) {
//     if (comment.pageId) {
//       this.router.navigate(['/inicio/leccion', comment.pageId]);
//     }
//   }

//   deleteComment(comment: CommentResponseDTO) {
//     if (confirm(`¿Estás seguro de eliminar el comentario de "${comment.username}"?`)) {
//       this.commentService.delete(comment.id).subscribe({
//         next: () => {
//           this.snack.open('Comentario eliminado', 'OK', { duration: 3000 });
//           // Llamada segura al layout
//           this.maintenanceLayout?.load(); 
//           if (this.showModal) this.closeModal();
//         },
//         error: () => this.snack.open('Error al eliminar', 'Cerrar')
//       });
//     }
//   }

//   closeModal() {
//     this.showModal = false;
//     this.selectedComment = null;
//   }
// }

// // @Component({
// //   selector: 'app-coment',
// //   standalone: true,
// //   imports: [
// //     CommonModule,
// //     ReactiveFormsModule,
// //     FormsModule,
// //     MaintenanceLayoutComponent,
// //     MatFormFieldModule,
// //     MatInputModule,
// //     MatIconModule
// // ],
// //   templateUrl: './coment.component.html',
// //   styleUrls: ['./coment.component.scss']
// // })
// // export class ComentComponent implements OnInit {
// //   private router = inject(Router);
// //   private snack = inject(MatSnackBar);
// //   public commentService = inject(CommentService); 

// //   @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<CommentResponseDTO>;

// //   columns: ColumnConfig[] = [
// //     { key: 'username', label: 'Autor', priority: 1 },
// //     { key: 'content', label: 'Comentario', priority: 1 },
// //     { key: 'pageId', label: 'ID Lección', priority: 2 },
// //     { key: 'createdAt', label: 'Fecha', priority: 2 }
// //   ];

// //   showModal = false;
// //   selectedComment: CommentResponseDTO | null = null;

// //   ngOnInit() {
// //     // El Layout cargará los datos automáticamente al iniciar
// //   }

// //   viewCommentDetail(comment: CommentResponseDTO) {
// //     this.selectedComment = comment;
// //     this.showModal = true;
// //   }

// //   goToLesson(comment: CommentResponseDTO) {
// //     this.router.navigate(['/inicio/leccion', comment.pageId]);
// //   }

// //   deleteComment(comment: CommentResponseDTO) {
// //     if (confirm(`¿Estás seguro de eliminar el comentario de "${comment.username}"?`)) {
// //       this.commentService.delete(comment.id).subscribe({
// //         next: () => {
// //           this.snack.open('Comentario eliminado', 'OK', { duration: 3000 });
// //           this.maintenanceLayout.load(); 
// //           if (this.showModal) this.closeModal();
// //         },
// //         error: () => this.snack.open('Error al eliminar', 'Cerrar')
// //       });
// //     }
// //   }

// //   closeModal() {
// //     this.showModal = false;
// //     this.selectedComment = null;
// //   }
// // }



import { Component, OnInit, inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatIconModule } from "@angular/material/icon";
import { Router } from '@angular/router';

import { MaintenanceLayoutComponent, ColumnConfig } from '../../../layouts/maintenance-layout/maintenance-layout.component';
import { CommentService } from '../../../services/universilabs/coments/coment.service';
import { CommentResponseDTO } from '../../../models/universilabas/coments/coments-respose.model';

@Component({
  selector: 'app-coment',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    MaintenanceLayoutComponent,
    MatFormFieldModule, 
    MatInputModule, 
    MatIconModule
  ],
  templateUrl: './coment.component.html',
  styleUrls: ['./coment.component.scss']
})
export class ComentComponent implements OnInit {
  @ViewChild(MaintenanceLayoutComponent) maintenanceLayout!: MaintenanceLayoutComponent<CommentResponseDTO>;

  private fb = inject(FormBuilder);
  private snack = inject(MatSnackBar);
  private router = inject(Router);
  public commentService = inject(CommentService);

  form!: FormGroup;
  showModal = false;
  isEditing = false;
  selectedId: number | string | null = null;

  columns: ColumnConfig[] = [
    { key: 'username', label: 'Autor', priority: 1 },
    { key: 'content', label: 'Comentario', priority: 1 },
    { key: 'pageId', label: 'ID Lección', priority: 2 },
    { key: 'createdAt', label: 'Fecha', priority: 2 }
  ];

  ngOnInit() {
    this.initForm();
  }

  /**
   * Inicializa el formulario con validación de 10 caracteres mínimos
   * para activar el efecto neón en el contador del HTML.
   */
  initForm() {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [
        Validators.required, 
        Validators.minLength(10), // Requerido para el contador neón
        Validators.maxLength(2000)
      ]],
      pageId: [null, [Validators.required]]
    });
  }

  /**
   * Abre el modal para crear un nuevo comentario
   */
  createComment() {
    this.isEditing = false;
    this.selectedId = null;
    this.form.reset();
    this.showModal = true;
  }

  /**
   * Abre el modal cargando los datos del comentario seleccionado
   */
  viewCommentDetail(comment: CommentResponseDTO) {
    this.isEditing = true;
    this.selectedId = comment.id;
    this.showModal = true;
    this.form.patchValue({
      username: comment.username,
      content: comment.content,
      pageId: comment.pageId
    });
  }

  /**
   * Lógica de guardado (Crear o Actualizar)
   */
  saveComment() {
    if (this.form.invalid) return;

    const payload = this.form.getRawValue();
    const request$ = this.isEditing && this.selectedId
      ? this.commentService.update(this.selectedId, payload)
      : this.commentService.create(payload);

    request$.subscribe({
      next: () => {
        this.snack.open(`✅ Comentario ${this.isEditing ? 'actualizado' : 'creado'} correctamente`, 'OK', { duration: 3000 });
        this.closeModal();
        this.maintenanceLayout.load(); // Recarga la tabla neón
      },
      error: () => {
        this.snack.open('❌ Error al procesar la solicitud', 'Cerrar');
      }
    });
  }

  /**
   * Elimina el comentario previa confirmación
   */
  deleteComment(comment: CommentResponseDTO) {
    if (confirm(`¿Estás seguro de eliminar el comentario de "${comment.username}"?`)) {
      this.commentService.delete(comment.id).subscribe({
        next: () => {
          this.snack.open('✅ Comentario eliminado', 'OK', { duration: 3000 });
          this.maintenanceLayout.load();
        },
        error: () => this.snack.open('❌ No se pudo eliminar el comentario', 'Cerrar')
      });
    }
  }

  /**
   * Redirige a la lección correspondiente para ver el comentario en contexto
   */
  goToLesson() {
    const pageId = this.form.get('pageId')?.value;
    if (pageId) {
      this.router.navigate(['/inicio/leccion', pageId]);
    }
  }

  closeModal() {
    this.showModal = false;
    this.selectedId = null;
  }
}