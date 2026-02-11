import { Component, computed, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { EnrollmentService } from '../../../services/universilabs/enrollments/enrollments.service';
import { EnrollmentResponseDTO } from '../../../models/universilabas/enrollments/enrollments-response.model';
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../../core/services/auth/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { filter, firstValueFrom, Subscription, switchMap, take, tap } from 'rxjs'; // Importamos take para evitar fugas de memoria
import { GenericSnackComponent } from '../../../../shared/messages/generic-snack/generic-snack.component';
import { MatProgressBar } from "@angular/material/progress-bar";
import { MatTooltipModule } from '@angular/material/tooltip';
import { ProjectService } from '../../../services/universilabs/projects/project.service';

@Component({
  selector: 'app-mis-inscripciones',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressBar,
    MatTooltipModule
],
  templateUrl: './mis-inscripciones.component.html',
  styleUrl: './mis-inscripciones.component.scss',
})
export class MisInscripcionesComponent implements OnInit, OnDestroy {
//  
  private enrollmentService = inject(EnrollmentService);
  private authService = inject(AuthService);
  private projectService = inject(ProjectService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router); 

  public myEnrollments = signal<EnrollmentResponseDTO[]>([]);
  public isLoading = signal<boolean>(true);
  public filterText = signal<string>('');

  private authSub?: Subscription;

  // Signal computado: Filtrado dinámico
  // public filteredEnrollments = computed(() => {
  //   const filter = this.filterText().toLowerCase().trim();
  //   const data = this.myEnrollments();
    
  //   // Debug para consola: Ver qué llega realmente
  //   console.log('Filtrando inscripciones. Total original:', data.length);
    
  //   if (!filter) return data;

  //   return data.filter(enroll => 
  //     // Usamos opcional chaining y fallback string para evitar errores si projectTitle es null
  //     (enroll.projectTitle || '').toLowerCase().includes(filter)
  //   );
  // });


  // Signal computado: Filtrado dinámico con protección de nulos
  public filteredEnrollments = computed(() => {
    const search = this.filterText().toLowerCase().trim();
    const data = this.myEnrollments();
    
    // Log útil para desarrollo
    console.log(`[Filtrado] Texto: "${search}" | Items: ${data.length}`);
    
    if (!search) return data;

    return data.filter(enroll => 
      // El encadenamiento opcional (?.) es más limpio que el fallback (|| '')
      enroll.projectTitle?.toLowerCase().includes(search)
    );
  });


  ngOnInit(): void {
    this.loadMyEnrollments();
  }

  ngOnDestroy(): void {
    // Limpiamos la suscripción al salir del componente
    this.authSub?.unsubscribe();
  }

  goBack(): void {
    // this.location.back();
    this.router.navigate(['/inicio'], { replaceUrl: true });
  }

  //
  loadMyEnrollments() {
    this.isLoading.set(true);
    console.log('⏳ Iniciando carga de inscripciones (esperando inicialización de Auth)...');

    this.authSub = this.authService.isInitialized$
      .pipe(
        filter(initialized => initialized === true),
        take(1),
        switchMap(() => this.authService.currentUser$.pipe(
          // 🔥 La clave: (user): user is NonNullable<typeof user> 
          // Esto elimina el error de "posiblemente null" en el subscribe
          filter((user): user is NonNullable<typeof user> => !!user && !!user.userId),
          take(1) 
        )),
        tap(user => console.log('📡 Usuario recibido y validado:', user))
      )
      .subscribe({
        next: (user) => {
          // ✅ TypeScript ahora sabe que 'user' es seguro y tiene 'id'
          console.log('✅ Cargando inscripciones para ID:', user.userId);
          this.fetchEnrollments(user.userId);
        },
        error: (err) => {
          console.error('❌ Error en el flujo de Auth:', err);
          this.isLoading.set(false);
        }
      });

    // Timeout de seguridad
    setTimeout(() => {
      if (this.isLoading()) {
        console.warn('⚠️ Finalizando espera de carga.');
        this.isLoading.set(false);
      }
    }, 3000);
  }


  // private fetchEnrollments(userId: number) {
  //   this.enrollmentService.getProjectsByUser(userId).subscribe({
  //     next: (data) => {
  //       // Mapeamos para asegurar que progressPercentage siempre tenga un valor numérico
  //       const normalizedData = (data || []).map(enroll => ({
  //         ...enroll,
  //         progressPercentage: enroll.progressPercentage ?? 0,
  //         lastPageVisited: enroll.lastPageVisited ?? 1
  //       }));
        
  //       console.log('Inscripciones normalizadas:', normalizedData);
  //       this.myEnrollments.set(normalizedData);
  //       this.isLoading.set(false);
  //     },
  //     error: (err) => {
  //       console.error('Error al cargar inscripciones:', err);
  //       this.isLoading.set(false);
  //       this.snackBar.open('Error al conectar con el servidor', 'Cerrar', { duration: 3000 });
  //     }
  //   });
  // }


  //import { firstValueFrom } from 'rxjs'; // Necesario para manejar las peticiones en orden

  async fetchEnrollments(userId: number) {
  this.isLoading.set(true);

  this.enrollmentService.getProjectsByUser(userId).subscribe({
    next: async (enrollments) => {
      const processedData = await Promise.all((enrollments || []).map(async (enroll) => {
        try {
          const structure = await firstValueFrom(this.projectService.getStructure(enroll.projectId));
          
          // 1. Creamos la lista de IDs en orden (Igual que el Aula)
          const allPageIds: number[] = [];
          structure.modules?.forEach(mod => {
            mod.pages?.forEach(tema => {
              tema.subtopics?.forEach(sub => {
                sub.pages?.forEach(pag => {
                  if (pag.id) allPageIds.push(pag.id);
                });
              });
            });
          });

          // 2. RECUPERAMOS LOS VALORES DE LA DB
          const idDeLaDB = Number(enroll.lastPageVisited || 0);
          const totalDePaginas = allPageIds.length;
          
          // 3. BUSCAMOS LA POSICIÓN (Esto evita el 125%)
          // indexOf nos dice si es la 1ª, 2ª, 3ª... página.
          const indiceEnLista = allPageIds.indexOf(idDeLaDB);
          const posicionReal = indiceEnLista + 1; 

          // --- LOG PARA QUE VEAS LOS VALORES ---
          console.log(`Proyecto: ${enroll.projectTitle}`);
          console.log(`-> ID en DB (lastPageVisited): ${idDeLaDB}`);
          console.log(`-> Total páginas contadas: ${totalDePaginas}`);
          console.log(`-> Lista de IDs en este proyecto:`, allPageIds);
          console.log(`-> Posición real calculada: ${posicionReal}`);
          // --------------------------------------

          let realPercentage = 0;
          if (posicionReal > 0 && totalDePaginas > 0) {
            // Ahora sí: (Posición 2 / Total 4) * 100 = 50%
            realPercentage = Math.round((posicionReal / totalDePaginas) * 100);
          }

          return {
            ...enroll,
            progressPercentage: realPercentage,
            lastPageVisited: idDeLaDB
          };

        } catch (error) {
          console.error(`Error en proyecto ${enroll.projectId}:`, error);
          return enroll;
        }
      }));

      this.myEnrollments.set(processedData);
      this.isLoading.set(false);
    }
  });
}
  
  /**
   * Navega al aula del proyecto específico.
   * Usa la última página visitada o la página 1 por defecto.
   */
  continuarProyecto(enroll: EnrollmentResponseDTO): void {
    // Aseguramos que pageNum sea tratado como string para la URL
    // y forzamos que si es 0 o undefined, sea 1.
    const pageNum = (enroll.lastPageVisited && enroll.lastPageVisited > 0) 
                    ? enroll.lastPageVisited.toString() 
                    : '1';
    
    console.log(`🚀 Navegando a Proyecto: ${enroll.projectId}, Página: ${pageNum}`);
    
    // Navegamos a la ruta completa definida en tu sistema de rutas
    this.router.navigate(['/aula', enroll.projectId, 'page', pageNum]);
  }
 
  //
  // --- ELIMINACIÓN ---
  confirmDelete(enrollmentId: number) {
    const snackRef = this.snackBar.openFromComponent(GenericSnackComponent, {
      duration: 5000,
      panelClass: ['info-snackbar'], // <--- ESTO activa el CSS global centrado y oscuro
      data: {
        message: '¿Estás seguro de que deseas darte de baja de este proyecto?',
        actionLabel: 'SÍ, DAR DE BAJA',
        cancelLabel: 'CONSERVAR'
      }
    });

    // Escuchamos el clic en "SÍ, DAR DE BAJA"
    snackRef.onAction().subscribe(() => {
      this.deleteEnrollment(enrollmentId);
    });
  }

  private deleteEnrollment(id: number) { 
    this.enrollmentService.delete(id).subscribe({
      next: () => {
        // Actualizamos el Signal filtrando el ID eliminado de la lista actual
        this.myEnrollments.update(prev => prev.filter(e => e.id !== id));
        
        console.log('✅ Inscripción eliminada con éxito');
        
        // Opcional: Mostrar un pequeño mensaje de éxito abajo (estilo estándar)
        this.snackBar.open('Te has dado de baja correctamente', 'OK', { 
          duration: 2000 
        });
      },
      error: (err) => {
        console.error('❌ Error al eliminar:', err);
        this.snackBar.open('Hubo un error al procesar la baja', 'Cerrar', { 
          duration: 3000 
        });
      }
    });
  }
}