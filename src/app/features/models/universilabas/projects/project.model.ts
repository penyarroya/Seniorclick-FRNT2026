export type ProjectLevel = 1 | 2 | 3;

export interface ProjectDTO {
  id?: number; 
  title: string;
  description?: string;
  level: ProjectLevel;
  activo: boolean; // <--- Sincronizado con el backend
  institutionId: number;
  createdById: number;
  institutionName?: string;
  createdByName?: string; // Asegúrate que en el backend sea creatorName o cámbialo aquí para que coincidan
  createdAt?: string | Date;
  isEnrolled?: boolean;
}

export type ProjectGridItem = ProjectDTO & { id: number };