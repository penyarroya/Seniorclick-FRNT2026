import { MatMenu } from "@angular/material/menu";
import { SubMenuItem } from "./submenuinit-Item-model";

export interface MenuInitItem {
  id?: string; // <-- agregar esta línea
  label: string;
  icon?: string;
  divider?: boolean;  // ✅ AÑADIR ESTA LÍNEA
  dividerClass?: string;
  items?: SubMenuItem[]; 
  menuRef?: any;
  type?: 'desktop' | 'mobile' | 'config' | 'separator'; // ✅ añadimos separator
  action?: 'toggleDarkMode' | 'toggleFeatures' | 'toggleHero' | 'logout' | 'login';
  route?: string;
  matMenu?: MatMenu; // <-- solo para referencia interna
  authRequired?: boolean;  // 👇 Nueva propiedad opcional
  open?: boolean;

  roles?: string[];  // Ej.: ["ROLE_ADMIN", "ROLE_USER"]
}


