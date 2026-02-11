//
export interface CurrentUser {
  //id: number;
  username: string;
  roles: string[];
  userId: number;    // Cambiado de 'id' a 'userId' para coincidir con Java
  email: string;     // Nuevo
  firstName: string; // Nuevo
  lastName: string;  // Nuevo
  avatarUrl?: string;// Nuevo (opcional)
}