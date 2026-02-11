// export type ResourceType = 'IMAGE' | 'VIDEO' | 'PDF' | 'LINK';
export enum ResourceType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  LINK = 'LINK'
}

export interface ResourceDTO {
  id?: number;         // Opcional: así no rompes la creación
  title: string;
  type: ResourceType;
  url: string;
  order: number;
  pageId: number;
  // Propiedades opcionales para que el Layout no de error de tipos
  nombre?: string;     
  activo?: boolean;    
}