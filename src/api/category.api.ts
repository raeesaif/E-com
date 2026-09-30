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

export interface ActiveCategoryItem {
  _id: string;
  name: string;
}

let activeCategoriesCache: ActiveCategoryItem[] = [];
let activeCategoriesTimestamp = 0;
let inFlightActivePromise: Promise<ActiveCategoryItem[]> | null = null;
const CACHE_TTL_MS = 60 * 1000;

export const categoryApi = {
  invalidateCache: () => {
    activeCategoriesCache = [];
    activeCategoriesTimestamp = 0;
  },

  list: async (): Promise<CategoryItem[]> => {
    const res = await apiRequest<ApiEnvelope<CategoryItem[]> | CategoryItem[]>("/categories");
    if (Array.isArray(res)) return res;
    return res.data ?? [];
  },

  listActive: async (options: { forceRefresh?: boolean } = {}): Promise<ActiveCategoryItem[]> => {
    if (
      !options.forceRefresh &&
      activeCategoriesCache.length > 0 &&
      Date.now() - activeCategoriesTimestamp < CACHE_TTL_MS
    ) {
      return activeCategoriesCache;
    }

    if (inFlightActivePromise) {
      return inFlightActivePromise;
    }

    inFlightActivePromise = (async () => {
      try {
        const res = await apiRequest<ApiEnvelope<ActiveCategoryItem[]> | ActiveCategoryItem[]>(
          "/categories/active",
        );
        const items = Array.isArray(res) ? res : res.data ?? [];
        activeCategoriesCache = items;
        activeCategoriesTimestamp = Date.now();
        return items;
      } catch {
        return activeCategoriesCache;
      } finally {
        inFlightActivePromise = null;
      }
    })();

    return inFlightActivePromise;
  },

  getCachedActive: (): ActiveCategoryItem[] => activeCategoriesCache,

  create: async (payload: CreateCategoryPayload, accessToken?: string): Promise<CategoryItem> => {
    categoryApi.invalidateCache();
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
    categoryApi.invalidateCache();
    return "data" in res && res.data ? res.data : (res as CategoryItem);
  },

  update: async (
    id: string,
    payload: UpdateCategoryPayload,
    accessToken?: string,
  ): Promise<CategoryItem> => {
    categoryApi.invalidateCache();
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
    categoryApi.invalidateCache();
    return "data" in res && res.data ? res.data : (res as CategoryItem);
  },

  remove: async (id: string, accessToken?: string): Promise<void> => {
    categoryApi.invalidateCache();
    const headers: Record<string, string> = {};
    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }
    await apiRequest<ApiEnvelope<null> | void>(`/categories/${id}`, {
      method: "DELETE",
      headers,
    });
    categoryApi.invalidateCache();
  },
};
