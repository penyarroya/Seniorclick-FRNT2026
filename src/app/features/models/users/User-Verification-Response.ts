export interface UserVerificationResponse {
  id?: number;
  username?: string;
  email?: string;
  verificationPending: boolean;
  message?: string;
  deletedUserId?: number;
  expiry?: number;
  expiryIso?: string;
}