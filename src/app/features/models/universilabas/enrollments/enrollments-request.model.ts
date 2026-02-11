/**
 * DTO para enviar datos al servidor (Request)
 * Coincide con tu Record en Java
 */
export interface EnrollmentRequestDTO {
  userId: number;
  projectId: number;
  roleInCourse: 'LEARNER' | 'MENTOR' | 'COLLABORATOR';
}