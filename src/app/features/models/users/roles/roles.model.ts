//
export interface RoleDTO {
  id?: number;
  name: string;
  permissions: string[]; // Coincide con Set<String> del backend
}