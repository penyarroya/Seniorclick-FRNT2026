import { MenuItem } from "./menu-item.model";

export interface MenuConfig {
  label: string;
  route?: string;
  icon?: string;
  roles?: string[];
  type?: 'desktop' | 'mobile' | 'config' | 'separator';
  submenu?: MenuItem[]; // ← aquí añadimos el submenú
  expanded?: boolean;
  action?: 'toggleDarkMode' | 'toggleFeatures' | 'toggleHero' | 'logout' | 'login';
  divider?: boolean;
  menuRef?: any;
}
