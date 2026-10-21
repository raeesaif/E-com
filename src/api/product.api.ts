import axios from "axios";
import { apiFormRequest, apiRequest } from "./client";
import type { Product as UiProduct } from "@/lib/marketplace";
import { categoryApi } from "./category.api";

const API_BASE = (
  (typeof import.meta !== "undefined" && import.meta.env?.["VITE_API_URL"]) ||
  "http://localhost:5050/api/v1"
).replace(/\/+$/, "");

export interface Category {
  _id: string;
  name: string;
  description?: string;
  active?: boolean;
}

export interface Seller {
  _id: string;
  storeName: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Product {
  _id: string;
  productId: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  stock: number;
  isFeatured?: boolean;
  productImage: string;
  productImagePublicId?: string;
  category: Category | string;
  seller: Seller | string;
  createdAt: string;
  updatedAt: string;
}

export type BackendProduct = Product;
export type BackendSeller = Seller;

export interface Pagination {
  page: number;
  limit: number;
  totalDocuments: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ProductsResponse {
  success: boolean;
  message: string;
  data: Product[];
  pagination: Pagination;
}

export interface ProductFilterParams {
  page?: number;
  limit?: number;
  category?: string;
  availability?: "all" | "inStock" | "outOfStock";
  maxPrice?: number;
  minPrice?: number;
  search?: string;
  sort?: "low-to-high" | "high-to-low" | "featured" | "newest";
  featured?: boolean;
}

export const fetchProducts = async (
  params: ProductFilterParams = {},
): Promise<ProductsResponse> => {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.append("page", params.page.toString());
  if (params.limit) queryParams.append("limit", params.limit.toString());
  if (params.category && params.category !== "All" && params.category !== "all") {
    queryParams.append("category", params.category);
  }
  if (params.availability && params.availability !== "all") {
    queryParams.append("availability", params.availability);
  }
  if (params.maxPrice !== undefined && params.maxPrice !== null && !isNaN(Number(params.maxPrice))) {
    queryParams.append("maxPrice", params.maxPrice.toString());
  }
  if (params.minPrice !== undefined && params.minPrice !== null && !isNaN(Number(params.minPrice))) {
    queryParams.append("minPrice", params.minPrice.toString());
  }
  if (params.search?.trim()) {
    queryParams.append("search", params.search.trim());
  }
  if (params.sort) queryParams.append("sort", params.sort);
  if (params.featured !== undefined) {
    queryParams.append("featured", String(params.featured));
  }

  const response = await axios.get<ProductsResponse>(
    `${API_BASE}/products?${queryParams.toString()}`,
  );
  return response.data;
};

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string; // the _id of a category from GET /api/v1/categories/active
  price: string | number;
  discount?: string | number;
  stock: string | number;
  productImage: File | Blob; // the actual File object
}

export interface UpdateProductPayload {
  name?: string;
  description?: string;
  category?: string;
  price?: number;
  discount?: number;
  stock?: number;
  /** Pass a File to upload a new image, a URL string to keep/set a remote URL, or omit to leave unchanged. */
  productImage?: File | string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export function mapBackendProductToProduct(bp: Product | BackendProduct): UiProduct {
  const sellerObj = typeof bp.seller === "object" && bp.seller !== null ? bp.seller : null;
  const storeName =
    sellerObj?.storeName?.trim() ||
    (typeof bp.seller === "string" ? bp.seller : "") ||
    "Store";
  const sellerFullName = sellerObj
    ? `${sellerObj.firstName || ""} ${sellerObj.lastName || ""}`.trim()
    : "";
  // Prioritize storeName so customer views display storeName instead of seller's personal name
  const sellerDisplayName = storeName || sellerFullName || "Store";

  const sellerDetails = sellerObj
    ? {
        _id: sellerObj._id,
        firstName: sellerObj.firstName || "",
        lastName: sellerObj.lastName || "",
        email: sellerObj.email || "",
        storeName: sellerObj.storeName || storeName,
      }
    : (typeof bp.seller === "string"
        ? {
            storeName: bp.seller,
            firstName: "",
            lastName: "",
            email: "",
          }
        : undefined);

  const categoryId =
    typeof bp.category === "object" && bp.category !== null ? bp.category._id : bp.category;

  let categoryName = "General";
  if (typeof bp.category === "object" && bp.category !== null && bp.category.name) {
    categoryName = bp.category.name;
  } else if (typeof bp.category === "string") {
    const cached = categoryApi.getCachedActive().find((c) => c._id === bp.category);
    if (cached) {
      categoryName = cached.name;
    } else if (!/^[0-9a-fA-F]{24}$/.test(bp.category)) {
      categoryName = bp.category;
    }
  }

  return {
    id: bp._id || bp.productId,
    _id: bp._id,
    productId: bp.productId,
    name: bp.name,
    seller: sellerDisplayName,
    storeName: storeName,
    sellerDetails,
    category: categoryName,
    categoryId,
    description: bp.description,
    price: bp.price,
    discount: bp.discount ?? 0,
    stock: bp.stock,
    isFeatured: bp.isFeatured,
    imagePosition: "0% 0%",
    productImage: bp.productImage,
    productImagePublicId: bp.productImagePublicId,
    createdAt: bp.createdAt,
    updatedAt: bp.updatedAt,
  };
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const CACHE_TTL_MS = 60 * 1000; // 60 seconds TTL
let productsListCache: CacheEntry<BackendProduct[]> | null = null;
const singleProductCache = new Map<string, CacheEntry<BackendProduct>>();
const inFlightRequests = new Map<string, Promise<any>>();

export const productApi = {
  fetchProducts,
  invalidateCache: () => {
    productsListCache = null;
    singleProductCache.clear();
  },

  getCachedProduct: (productId: string): BackendProduct | null => {
    const cached = singleProductCache.get(productId);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return cached.data;
    }
    if (productsListCache && Date.now() - productsListCache.timestamp < CACHE_TTL_MS) {
      const found = productsListCache.data.find(
        (p) => p.productId === productId || p._id === productId
      );
      if (found) return found;
    }
    return null;
  },

  list: async (options: { forceRefresh?: boolean } = {}): Promise<BackendProduct[]> => {
    if (!options.forceRefresh && productsListCache && Date.now() - productsListCache.timestamp < CACHE_TTL_MS) {
      return productsListCache.data;
    }

    if (inFlightRequests.has("list")) {
      return inFlightRequests.get("list") as Promise<BackendProduct[]>;
    }

    const fetchPromise = (async () => {
      try {
        const res = await apiRequest<ApiEnvelope<BackendProduct[]> | BackendProduct[]>("/products");
        const items = Array.isArray(res) ? res : res.data ?? [];
        productsListCache = { data: items, timestamp: Date.now() };

        // Pre-populate single product cache
        items.forEach((p) => {
          if (p.productId) singleProductCache.set(p.productId, { data: p, timestamp: Date.now() });
          if (p._id) singleProductCache.set(p._id, { data: p, timestamp: Date.now() });
        });

        return items;
      } finally {
        inFlightRequests.delete("list");
      }
    })();

    inFlightRequests.set("list", fetchPromise);
    return fetchPromise;
  },

  create: async (payload: CreateProductPayload, accessToken: string): Promise<BackendProduct> => {
    productApi.invalidateCache();
    const form = new FormData();
    form.append("name", payload.name.trim());
    form.append("description", payload.description.trim());
    form.append("category", payload.category);
    form.append("price", String(payload.price));
    form.append("discount", String(payload.discount ?? "0"));
    form.append("stock", String(payload.stock));
    form.append("productImage", payload.productImage); // the actual File object

    const res = await apiFormRequest<ApiEnvelope<BackendProduct> | BackendProduct>(
      "/products",
      form,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    const data = "data" in res && res.data ? res.data : (res as BackendProduct);
    productApi.invalidateCache();
    return data;
  },

  update: async (
    id: string,
    payload: UpdateProductPayload,
    accessToken: string,
  ): Promise<BackendProduct> => {
    productApi.invalidateCache();

    // If a new image File was provided, use multipart/form-data
    if (payload.productImage instanceof File) {
      const form = new FormData();
      if (payload.name !== undefined && payload.name.trim() !== "") form.append("name", payload.name.trim());
      if (payload.description !== undefined && payload.description.trim() !== "") form.append("description", payload.description.trim());
      if (payload.category !== undefined && payload.category.trim() !== "") form.append("category", payload.category.trim());
      if (payload.price !== undefined && !isNaN(Number(payload.price))) form.append("price", String(payload.price));
      if (payload.discount !== undefined && !isNaN(Number(payload.discount))) form.append("discount", String(payload.discount));
      if (payload.stock !== undefined && !isNaN(Number(payload.stock))) form.append("stock", String(payload.stock));
      form.append("productImage", payload.productImage); // actual File object

      const res = await apiFormRequest<ApiEnvelope<BackendProduct> | BackendProduct>(
        `/products/${id}`,
        form,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${accessToken}` },
          // NOTE: do NOT set Content-Type — browser sets it with the multipart boundary
        },
      );
      const data = "data" in res && res.data ? res.data : (res as BackendProduct);
      productApi.invalidateCache();
      return data;
    }

    // No new image — send as JSON
    const body: {
      name?: string;
      description?: string;
      category?: string;
      price?: number;
      discount?: number;
      stock?: number;
      productImage?: string;
    } = {};
    if (payload.name !== undefined && payload.name.trim() !== "") body.name = payload.name.trim();
    if (payload.description !== undefined && payload.description.trim() !== "") body.description = payload.description.trim();
    if (payload.category !== undefined && payload.category.trim() !== "") body.category = payload.category.trim();
    if (payload.price !== undefined && !isNaN(Number(payload.price))) body.price = Number(payload.price);
    if (payload.discount !== undefined && !isNaN(Number(payload.discount))) body.discount = Number(payload.discount);
    if (payload.stock !== undefined && !isNaN(Number(payload.stock))) body.stock = Number(payload.stock);
    if (
      typeof payload.productImage === "string" &&
      payload.productImage.trim() !== "" &&
      !payload.productImage.startsWith("blob:") &&
      !payload.productImage.startsWith("data:")
    ) {
      body.productImage = payload.productImage.trim();
    }

    const res = await apiRequest<ApiEnvelope<BackendProduct> | BackendProduct>(
      `/products/${id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(body),
      },
    );
    const data = "data" in res && res.data ? res.data : (res as BackendProduct);
    productApi.invalidateCache();
    return data;
  },

  remove: async (id: string, accessToken: string): Promise<void> => {
    productApi.invalidateCache();
    await apiRequest<ApiEnvelope<null> | void>(`/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    productApi.invalidateCache();
  },

  getProduct: async (productId: string, options: { forceRefresh?: boolean } = {}): Promise<BackendProduct> => {
    if (!options.forceRefresh) {
      const cached = productApi.getCachedProduct(productId);
      if (cached) return cached;
    }

    const inFlightKey = `product_${productId}`;
    if (inFlightRequests.has(inFlightKey)) {
      return inFlightRequests.get(inFlightKey) as Promise<BackendProduct>;
    }

    const fetchPromise = (async () => {
      try {
        const res = await apiRequest<ApiEnvelope<BackendProduct> | BackendProduct>(
          `/products/${productId}`,
        );
        const data = (res && typeof res === "object" && "data" in res && res.data)
          ? res.data
          : (res as BackendProduct);

        if (data) {
          if (data.productId) singleProductCache.set(data.productId, { data, timestamp: Date.now() });
          if (data._id) singleProductCache.set(data._id, { data, timestamp: Date.now() });
        }
        return data;
      } finally {
        inFlightRequests.delete(inFlightKey);
      }
    })();

    inFlightRequests.set(inFlightKey, fetchPromise);
    return fetchPromise;
  },

  getById: async (productId: string): Promise<BackendProduct> => {
    return productApi.getProduct(productId);
  },
};
