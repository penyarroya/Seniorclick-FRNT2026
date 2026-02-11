import { PageFormat } from "../../enums/page-format.enum";

//
export interface PageResponseDTO {
  id: number;
  title: string;
  format: PageFormat;    
  content: string;
  subtopicId: number;
  subtopicTitle: string;
  projectId: number; 
  authorId: number;
  authorName: string;
  createdAt?: string | Date; 
  updatedAt?: string | Date;
}