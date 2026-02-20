//
export interface CommentRequestDTO {
  content: string;
  pageId: number;
  userId: number;

  parentId?: number | null;
}