import { apiRequest } from "./client";

export interface AuthUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "customer" | "seller" | "admin";
  phone?: string;
  shippingAddress?: string;
  storeName?: string;
  description?: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

export const DEMO_CUSTOMER: AuthUser = {
  _id: "usr-demo-customer",
  firstName: "Ariana",
  lastName: "Wells",
  email: "ariana@example.com",
  phone: "+1 (555) 012-3489",
  shippingAddress: "128 Market Street, San Francisco, CA 94105",
  role: "customer",
  isVerified: true,
  createdAt: "2026-05-14T10:00:00.000Z",
};

export const DEMO_SELLER: AuthUser = {
  _id: "usr-demo-seller",
  firstName: "Oliver",
  lastName: "North",
  email: "hello@northpine.co",
  storeName: "North & Pine",
  description: "Handcrafted everyday audio and studio gear.",
  role: "seller",
  isVerified: true,
  createdAt: "2026-03-12T10:00:00.000Z",
};

export const DEMO_ADMIN: AuthUser = {
  _id: "usr-demo-admin",
  firstName: "E-Com",
  lastName: "Admin",
  email: "admin@e-com.co",
  role: "admin",
  isVerified: true,
  createdAt: "2026-01-01T10:00:00.000Z",
};

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
