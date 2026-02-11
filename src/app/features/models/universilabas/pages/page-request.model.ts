import { PageFormat } from "../../enums/page-format.enum";

//
export interface PageRequestDTO {
  title: string;
  content: string;
  format: PageFormat;   
  subtopicId: number;
  authorId: number;
}