// contribution-response.model.ts
export interface ContributionResponseDTO {
  id: number;
  content: string;
  createdAt: string;
  pageId: number;
  pageTitle: string; // Asegúrate de que no esté comentado
  userId: number;
  username: string;
  slug: string;
}
