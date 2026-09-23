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

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfilePayload {
  firstName: string;
  lastName: string;
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
  changePassword: (payload: ChangePasswordPayload, accessToken: string) =>
    apiRequest<ApiEnvelope<null>>("/auth/update-password", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),
  updateProfile: (payload: UpdateProfilePayload, accessToken: string) =>
    apiRequest<ApiEnvelope<AuthUser>>("/auth/update-profile", {
      method: "PATCH",
      headers: { Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify(payload),
    }),
  getMe: (accessToken: string) =>
    apiRequest<ApiEnvelope<AuthUser>>("/auth/me", {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
  logout: (accessToken: string) =>
    apiRequest<ApiEnvelope<null>>("/auth/logout", {
      method: "POST",
      headers: { Authorization: `Bearer ${accessToken}` },
    }),
};
