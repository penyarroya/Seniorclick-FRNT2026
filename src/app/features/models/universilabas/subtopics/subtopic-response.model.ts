//
export interface SubtopicResponseDTO {
  id: number;
  title: string;
  topicId: number;     // El ID para lógica interna y formularios
  topicTitle: string;  // El nombre para mostrar en la columna de la tabla
}