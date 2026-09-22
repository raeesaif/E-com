import { apiRequest } from "./client";

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "customer" | "seller" | "admin";
  storeName?: string;
  description?: string;
  isVerified: boolean;
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "customer" | "seller";
  storeName?: string;
  description?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResult {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
}

export interface ResetPasswordPayload {
  email: string;
  token: string;
  newPassword: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    apiRequest<ApiEnvelope<AuthUser>>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: LoginPayload) =>
    apiRequest<ApiEnvelope<LoginResult>>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  verifyEmail: (token: string) =>
    apiRequest<ApiEnvelope<AuthUser>>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify({ token }),
    }),
  resendVerification: (email: string) =>
    apiRequest<ApiEnvelope<null>>("/auth/resend-verification", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  forgotPassword: (email: string) =>
    apiRequest<ApiEnvelope<null>>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (payload: ResetPasswordPayload) =>
    apiRequest<ApiEnvelope<AuthUser>>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
};
