import { apiRequest } from "./client";

export interface CategoryItem {
  _id: string;
  name: string;
  description?: string;
  active?: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateCategoryPayload {
  name: string;
  description: string;
}

export interface UpdateCategoryPayload {
  name: string;
  active: boolean;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export const categoryApi = {
  list: async (): Promise<CategoryItem[]> => {
    const res = await apiRequest<ApiEnvelope<CategoryItem[]> | CategoryItem[]>("/categories");
    if (Array.isArray(res)) return res;
    return res.data ?? [];
  },

  create: async (payload: CreateCategoryPayload, accessToken?: string): Promise<CategoryItem> => {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    // Trim name before sending as schema has 'trime: true' typo on backend
    const body = {
      name: payload.name.trim(),
      description: payload.description.trim(),
    };
    const res = await apiRequest<ApiEnvelope<CategoryItem> | CategoryItem>("/categories", {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });
    return "data" in res && res.data ? res.data : (res as CategoryItem);
  },

  update: async (
    id: string,
    payload: UpdateCategoryPayload,
    accessToken?: string,
  ): Promise<CategoryItem> => {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    // Note: description cannot be updated through this endpoint per backend service signature
    const body = {
      name: payload.name.trim(),
      active: Boolean(payload.active),
    };
    const res = await apiRequest<ApiEnvelope<CategoryItem> | CategoryItem>(`/categories/${id}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(body),
    });
    return "data" in res && res.data ? res.data : (res as CategoryItem);
  },

  remove: async (id: string, accessToken?: string): Promise<void> => {
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    await apiRequest<ApiEnvelope<null> | void>(`/categories/${id}`, {
      method: "DELETE",
      headers,
    });
  },
};
