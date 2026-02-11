// export interface ProjectResourceDTO {
//   name: string;
//   url: string;
//   type: 'pdf' | 'zip' | 'rar' | 'link' | 'doc' | 'docx' | string;
// }

// export interface ProjectStructureDTO {
//   id: number;
//   title: string;
//   description?: string;     // Añadido (está en tu Mapper)
//   institutionName?: string; // Añadido (está en tu Mapper)
//   modules: ModuleNode[];    // CAMBIO: Java envía 'modules', no 'collections'
//   resources?: ProjectResourceDTO[]; 
// }

// export interface ModuleNode {
//   id: number;
//   title: string;            // CAMBIO: Java envía 'title' (vía entity.getName())
//   pages: TopicNode[];       // CAMBIO: Java envía 'pages' hacia los Topics
// }

// export interface TopicNode {
//   id: number;
//   title: string;
//   subtopics: SubtopicNode[];
// }

// export interface SubtopicNode {
//   id: number;
//   title: string;
//   pages: PageSummaryNode[]; 
// }

// export interface PageSummaryNode {
//   id: number;
//   title: string;
// }


export interface ProjectResourceDTO {
  name: string;
  url: string;
  type: 'pdf' | 'zip' | 'rar' | 'link' | 'doc' | 'docx' | string;
}

export interface PageSummaryNode {
  id: number;
  title: string;
  // AÑADE ESTA LÍNEA AQUÍ:
  resources?: ProjectResourceDTO[]; 
}

export interface SubtopicNode {
  id: number;
  title: string;
  pages: PageSummaryNode[]; 
}

export interface TopicNode {
  id: number;
  title: string;
  subtopics: SubtopicNode[];
}

export interface ModuleNode {
  id: number;
  title: string;
  pages: TopicNode[]; 
}

export interface ProjectStructureDTO {
  id: number;
  title: string;
  description?: string;
  institutionName?: string;
  modules: ModuleNode[];
  // Estos serían recursos globales del proyecto (si los hubiera)
  resources?: ProjectResourceDTO[]; 
}
