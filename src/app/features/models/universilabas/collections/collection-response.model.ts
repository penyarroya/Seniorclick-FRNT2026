//
export interface CollectionResponseDTO {
  /** ID único de la colección */
  id: number;

  /** Nombre de la colección */
  name: string;

  /** ID del proyecto relacionado (necesario para el patchValue del formulario) */
  projectId: number;

  /** * Nombre del proyecto (opcional) 
   * Útil para mostrarlo en la columna 'projectName' de tu tabla 
   */
  projectName?: string;

  /** * Cantidad de temas/topics asociados (opcional)
   * Se puede calcular en el mapper de Java usando topics.size()
   */
  topicsCount?: number;
}