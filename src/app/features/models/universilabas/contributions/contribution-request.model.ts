// contribution-request.model.ts
export interface ContributionRequestDTO {
  content: string;
  pageId: number;
  userId: number; // Cambiado de string a number para ser fiel a tu entidad Java
}