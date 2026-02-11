//
export interface UserProgressResponseDTO {
  id: number;
  status: 'STARTED' | 'COMPLETED'; // Tipado estricto para mayor seguridad
  timeSpentSeconds: number;
  lastAccess: string; // LocalDateTime llega como string ISO desde Java
  userId: number;
  pageId: number;
  
  // Nuevos campos para el flujo de usuario (Navegación y motivación)
  motivationMessage: string | null;
  nextPageId: number | null;
  isProjectFinished: boolean;
}