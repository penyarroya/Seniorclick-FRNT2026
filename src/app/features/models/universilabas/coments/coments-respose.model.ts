// comment.model.ts
export interface CommentResponseDTO {
  id: number;
  content: string;
  createdAt: string;
  pageId: number;
  pageTitle?: string; // Útil para mostrar en qué página se comentó
  userId: number;
  username: string; // Cambia userName por username (todo en minúsculas)
  userAvatar?: string;

  resolved: boolean;

  /** * Lista de respuestas al comentario actual. 
   * Al ser del mismo tipo (CommentResponseDTO), permite la anidación infinita.
   */
  replies: CommentResponseDTO[];
}
