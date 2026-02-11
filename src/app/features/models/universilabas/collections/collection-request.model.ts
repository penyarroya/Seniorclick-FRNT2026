//
export interface CollectionRequestDTO {
  /** Nombre de la colección (Validado en backend: max 255 caracteres) */
  name: string;

  /** ID del proyecto al que pertenece la colección */
  projectId: number;
}