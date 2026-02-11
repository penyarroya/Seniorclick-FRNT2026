import { SubMenuItem } from "./submenuinit-Item-model";

export interface MenuItem {
  label: string;
  route?: string;
  icon?: string;
  roles?: string[];
  // type?: 'desktop' | 'mobile' | 'config';
  type?: 'desktop' | 'mobile' | 'config' | 'separator';
  // type?: 'separator';
  submenu?: MenuItem[]; // ← aquí añadimos el submenú
  items: SubMenuItem[]; // El array 'items' define el submenú
  expanded?: boolean;
  action?: 'toggleDarkMode' | 'toggleFeatures' | 'toggleHero' | 'logout' | 'login';
  divider?: boolean;
  menuRef?: any;
}
