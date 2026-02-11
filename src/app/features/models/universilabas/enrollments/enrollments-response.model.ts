/**
 * DTO para recibir datos del servidor (Response)
 * Incluye campos extra para mostrar en la tabla sin hacer más peticiones
 */
export interface EnrollmentResponseDTO {
  id: number;
  roleInCourse: 'LEARNER' | 'MENTOR' | 'COLLABORATOR';
  createdAt: string; // ISO Date String

  // Datos del Usuario mapeados por el backend
  userId: number;
  userName: string;     // Nombre completo (Ej: "Juan Pérez")
  userEmail: string;

  // Datos del Proyecto mapeados por el backend
  projectId: number;
  projectTitle: string; // Título del curso/proyecto

  progressPercentage?: number; 
  lastPageVisited?: number;
}