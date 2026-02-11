/**
 * DTO para la gestión de perfiles de usuario.
 * Satisface la restricción del MaintenanceLayoutComponent.
 */
export interface UserProfileDTO {
  // Campos requeridos por la restricción de MaintenanceLayoutComponent
  id: number;           // Mapeado desde userId
  activo?: boolean;     // Opcional, pero el layout lo pide para el ordenamiento
  nombre?: string;      // Mapeado desde firstName + lastName
  description?: string; // Opcional

  // Tus campos reales de negocio
  userId: number;
  firstName: string;
  lastName: string;
  phone: string;
  avatarUrl: string;
  email?: string;
}