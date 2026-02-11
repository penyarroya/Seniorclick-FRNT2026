import { Injectable, signal, computed } from '@angular/core';
import { ProjectStructureDTO } from '../../models/universilabas/project-structure/project-structure.dto';
import { ResourceDTO } from '../../models/universilabas/resources/resource.model';

@Injectable({ providedIn: 'root' })
export class NavigationService {
//  
  // --- NUEVAS SECCIONES PARA EL VISOR ---
  // Signal que guarda el recurso que el usuario seleccionó en el Sidenav
  public activeResource = signal<ResourceDTO | null>(null);
  public currentSubtopicTitle = signal<string>('');

  /**
   * Método que llama el Sidenav para "mandar" el recurso al visor interno
   */
  openResource(res: ResourceDTO) {
    this.activeResource.set(res);
  }

  /**
   * Método para cerrar el visor desde cualquier parte
   */
  clearResource() {
    this.activeResource.set(null);
  }
  // --- FIN NUEVAS SECCIONES PARA EL VISOR ---

  // Lista plana de IDs para navegación secuencial
  private flatPages = signal<number[]>([]);
  
  // Página que el usuario está viendo actualmente
  public currentPageId = signal<number | null>(null);

  /**
   * Progreso REACTIVO:
   * Se recalcula automáticamente cada vez que cambia 'currentPageId' o 'flatPages'
   */
  public progress = computed(() => {
    const list = this.flatPages();
    const current = this.currentPageId();
    
    if (list.length === 0 || current === null) return 0;
    
    const index = list.indexOf(current) + 1;
    // Si la página no está en la lista (index 0), devolvemos 0 para evitar saltos
    return index > 0 ? Math.round((index / list.length) * 100) : 0;
  });

  /**
   * Transforma el árbol complejo en una lista lineal de IDs.
   * Estructura: Modules -> Pages (Temas) -> Subtopics -> Pages (Lecciones)
   */
  setNavigationTree(project: ProjectStructureDTO) {
    const pages: number[] = [];
    
    project.modules?.forEach(mod => {
      // Nivel 2: Temas del módulo
      mod.pages?.forEach(tema => {
        // Nivel 3: Subtemas
        tema.subtopics?.forEach(sub => {
          // Nivel 4: Lecciones finales
          sub.pages?.forEach(pag => {
            if (pag.id) pages.push(pag.id);
          });
        });
      });
    });
    
    this.flatPages.set(pages);
  }

  /**
   * Calcula los IDs de la página anterior y siguiente
   */
  getNeighbors(currentPageId: string | number | null) {
    const list = this.flatPages();
    if (!currentPageId || list.length === 0) return { prev: null, next: null };
    
    const currentId = Number(currentPageId);
    const index = list.indexOf(currentId);
    
    if (index === -1) return { prev: null, next: null };
    
    return {
      prev: index > 0 ? list[index - 1] : null,
      next: index < list.length - 1 ? list[index + 1] : null
    };
  }

  /**
   * Actualiza la página actual. 
   * Esto disparará automáticamente la actualización del computed 'progress'
   */
  setCurrentPage(id: number) {
    this.currentPageId.set(id);
  }
}