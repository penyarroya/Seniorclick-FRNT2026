export interface UserDTO {
  id: number;
  username: string;
  email: string;
  activo: boolean;
  emailVerified?: boolean;
  firstName?: string; // 🔹 NUEVOS: Datos del Perfil (vienen de UserProfile en Java)
  lastName?: string;
  phone?: string;
  verificationCode?: string;
  verificationCodeExpiry?: string;
  roles: string[];
  fechaAlta?: string;
  fechaActualizacion?: string;
}
