import { MenuAction } from "./MenuAction.type";

export interface SubMenuItem {
  id?: string;      // <-- agregar esta línea
  label: string;       // obligatorio
  icon: string;        // obligatorio
  divider?: boolean;   // opcional
  route?: string;      // opcional, para navegación
  action?: MenuAction;  // ← ahora coincide con MenuInitItem
  // action?: string;     // opcional, para acciones como toggleHero, login, logout
  items?: SubMenuItem[]; // opcional, para submenús
  link?: string;
  authRequired?: boolean;
  roles?: string[];       // Ej.: ["ROLE_ADMIN", "ROLE_USER"]
  open?: boolean;  // 🔹 agregar esta línea
}
