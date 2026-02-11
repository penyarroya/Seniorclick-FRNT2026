import { Component, HostListener, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router'; // 1. Importa ActivatedRoute
import { ProjectService } from '../../services/universilabs/projects/project.service';
import { ProjectGridItem } from '../../models/universilabas/projects/project.model';
import { MatIcon } from "@angular/material/icon";
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EnrollmentService } from '../../services/universilabs/enrollments/enrollments.service'; // 2. Importa tu EnrollmentService
import { GenericSnackComponent } from '../../../shared/messages/generic-snack/generic-snack.component';
import { ProjectStructureDTO } from '../../models/universilabas/project-structure/project-structure.dto';

@Component({
  selector: 'app-project-page',
  standalone: true,
  imports: [CommonModule, MatIcon, MatSnackBarModule],
  templateUrl: './project-page.component.html',
  styleUrl: './project-page.component.scss',
})
export class ProjectPageComponent implements OnInit {
//  
  private projectService = inject(ProjectService);
  private enrollmentService = inject(EnrollmentService); // 3. Inyecta el servicio de inscripciones
  private router = inject(Router);
  private route = inject(ActivatedRoute); // 4. Inyecta la ruta activa
  private snackBar = inject(MatSnackBar);

  projects = signal<ProjectGridItem[]>([]);
  isLoading = signal<boolean>(true);
  isVerifying = signal<boolean>(false); 
  showScrollButton = signal(false);

  ngOnInit(): void {
    this.loadProjects();
    this.checkEnrollmentError(); // 5. Llama al verificador de errores de acceso
  }

  // 6. Nueva función para detectar si el Guard nos rebotó por falta de acceso
  private checkEnrollmentError(): void {
    this.route.queryParams.subscribe(params => {
      if (params['error'] === 'no-enrolled' && params['projectId']) {
        this.showEnrollmentOption(Number(params['projectId']));
      }
    });
  }

  // 7. Mostrar opción de inscripción si no está inscrito
  private showEnrollmentOption(projectId: number): void {
    const snackBarRef = this.snackBar.openFromComponent(GenericSnackComponent, {
      data: {
        message: 'No estás inscrito en este proyecto para acceder al aula.',
        actionLabel: 'INSCRIBIRME',
        cancelLabel: 'CANCELAR'
      },
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['info-snackbar'] // Clase original
    });

    snackBarRef.onAction().subscribe(() => {
      this.enrollInProject(projectId);
    });

    snackBarRef.afterDismissed().subscribe(() => {
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { error: null, projectId: null },
        queryParamsHandling: 'merge'
      });
    });
  }

  // 8. Función para inscribirse en el proyecto
  enrollInProject(projectId: number): void {
    this.isVerifying.set(true);
    this.enrollmentService.enroll(projectId).subscribe({
      next: () => {
        this.loadProjects(); 
        this.isVerifying.set(false);
        
        // --- SEGUNDO SNACKBAR (Confirmación con estilo Neón) ---
        this.snackBar.openFromComponent(GenericSnackComponent, {
          data: { 
            message: '¡Inscripción completada con éxito!', 
            cancelLabel: 'GENIAL' 
          },
          duration: 3000, 
          verticalPosition: 'top',      
          horizontalPosition: 'center', 
          panelClass: ['info-snackbar'] 
        });

        // --- NAVEGACIÓN CORREGIDA ---
        // Agregamos 'page' y '1' para que coincida con tu estructura de rutas
        setTimeout(() => {
          this.router.navigate(['/aula', projectId, 'page', '1']);
        }, 500);
      },
      error: (err) => {
        this.isVerifying.set(false);
        this.showErrorSnackBar('No pudimos procesar tu inscripción.');
      }
    });
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const yOffset = window.pageYOffset || document.documentElement.scrollTop;
    this.showScrollButton.set(yOffset > 300);
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // loadProjects(): void {
  //   // Solo activamos isLoading si la lista está vacía para evitar parpadeos
  //   if (this.projects().length === 0) {
  //     this.isLoading.set(true);
  //   }

  //   this.projectService.getAll().subscribe({
  //     next: (data) => {
  //       // 1. Filtramos proyectos activos
  //       const activeProjects = data.filter(project => project.activo === true);
        
  //       // 2. Actualizamos el Signal. 
  //       // Angular Signals comparará el nuevo valor y solo redibujará lo necesario.
  //       this.projects.set(activeProjects);
        
  //       // 3. Quitamos el estado de carga
  //       this.isLoading.set(false);
  //     },
  //     error: (err) => {
  //       console.error('❌ Error al conectar con la API:', err);
  //       this.isLoading.set(false);
  //       this.showErrorSnackBar('No se pudieron cargar los proyectos.');
  //     }
  //   });
  // }

  loadProjects(): void {
    if (this.projects().length === 0) {
      this.isLoading.set(true);
    }

    this.projectService.getAll().subscribe({
      next: (data) => {
        // 1. Filtrar ambos grupos
        const activeProjects = data.filter(p => p.activo === true);
        const finishedProjects = data.filter(p => p.activo === false); // Suponiendo que 'activo: false' significa terminado

        // 2. Cargar inmediatamente los activos para que el usuario no espere
        this.projects.set(activeProjects);
        this.isLoading.set(false);

        // 3. (Opcional) Si quieres un pequeño retraso visual o carga diferida:
        if (finishedProjects.length > 0) {
          // Añadimos los terminados al final de la lista actual
          this.projects.update(current => [...current, ...finishedProjects]);
        }
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.isLoading.set(false);
        this.showErrorSnackBar('No se pudieron cargar los proyectos.');
      }
    });
  }

   //Maneja la selección de un proyecto
  //  onSelectProject(project: ProjectGridItem): void {
  //   if (this.isVerifying()) return;
  //   this.isVerifying.set(true);

  //   this.projectService.getStructure(project.id).subscribe({
  //     next: (structure) => {
  //       this.isVerifying.set(false);
  //       const hasContent = structure.modules && structure.modules.length > 0;

  //       if (hasContent) {
  //         // Navegación limpia enviando solo el ID (evita NaN)
  //         this.router.navigate(['/aula', project.id], { queryParams: { title: project.title } });
  //       } else {
  //         this.snackBar.open(`🚧 "${project.title}" está en construcción.`, 'Entendido', { duration: 4000 });
  //       }
  //     },
  //     error: (err) => {
  //       this.isVerifying.set(false);
  //       this.showErrorSnackBar('Hubo un problema al verificar el acceso.');
  //     }
  //   });
  // }

  // Maneja la selección de un proyecto
  // onSelectProject(project: ProjectGridItem): void {
  //   if (this.isVerifying()) return;
  //   this.isVerifying.set(true);

  //   this.projectService.getStructure(project.id).subscribe({
  //     next: (structure: ProjectStructureDTO) => {
  //       // 1. Verificamos si tiene módulos (basado en tu DTO)
  //       const hasModules = !!(structure?.modules && structure.modules.length > 0);

  //       if (hasModules) {
  //         // 2. Navegamos y usamos .then() para resetear el estado de carga al terminar el cambio de ruta
  //         this.router.navigate(['/aula', project.id], { 
  //           queryParams: { title: project.title } 
  //         }).then(() => {
  //           this.isVerifying.set(false);
  //         });
  //       } else {
  //         // 3. Si no tiene contenido, liberamos el estado y avisamos
  //         this.isVerifying.set(false);
  //         this.snackBar.open(
  //           `🚧 El proyecto "${project.title}" está en construcción.`, 
  //           'Entendido', 
  //           { duration: 4000 }
  //         );
  //       }
  //     },
  //     error: (err) => {
  //       // 4. Importantísimo liberar el estado en caso de error de red o 404
  //       this.isVerifying.set(false);
  //       console.error('Error al verificar estructura:', err);
  //       this.showErrorSnackBar('No se pudo verificar el contenido del proyecto.');
  //     }
  //   });
  // }

  onSelectProject(project: ProjectGridItem): void {
  if (this.isVerifying()) return;
  this.isVerifying.set(true);

  this.projectService.getStructure(project.id).subscribe({
    next: (structure: ProjectStructureDTO) => {
      // VALIDACIÓN PROFUNDA: ¿Tiene módulos Y páginas reales con ID?
      const modules = structure.modules || [];
      const isComplete = modules.length > 0 && modules.some((m: any) => 
        m.pages?.some((tema: any) => 
          tema.subtopics?.some((sub: any) => 
            sub.pages?.length > 0 && sub.pages[0].id // Buscamos la página final
          )
        )
      );

      if (isComplete) {
        // SOLO SI ESTÁ AL 100% NAVEGAMOS
        this.router.navigate(['/aula', project.id], { 
          queryParams: { title: project.title } 
        }).then(() => {
          this.isVerifying.set(false);
        });
      } else {
        // SI NO ESTÁ COMPLETO, NO SE NAVEGA. SE QUEDA AQUÍ.
        this.isVerifying.set(false);
        this.snackBar.open(
          `🚧 El proyecto "${project.title}" está en construcción y no tiene contenido navegable.`, 
          'Entendido', 
          { duration: 5000 }
        );
      }
    },
    error: (err) => {
      this.isVerifying.set(false);
      this.showErrorSnackBar('No se pudo verificar el contenido del proyecto.');
    }
  });
}



  // Función para volver a la página de inicio
  goBack(): void {
    this.router.navigate(['/inicio']); 
  }

  // Función para mostrar un snackbar de error genérico
  private showErrorSnackBar(message: string): void {
    this.snackBar.openFromComponent(GenericSnackComponent, {
      data: {
        message: message,
        cancelLabel: 'CERRAR'
        // No ponemos actionLabel porque es un error/aviso simple
      },
      duration: 5000,
      panelClass: ['error-snackbar'] // Tu estilo global de error
    });
  }
}