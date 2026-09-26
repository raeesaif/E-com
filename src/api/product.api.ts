import { apiFormRequest, apiRequest } from "./client";
import type { Product } from "@/lib/marketplace";
import { categoryApi } from "./category.api";

export interface BackendSeller {
  _id?: string;
  storeName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
}

export interface BackendProduct {
  _id: string;
  productId: string;
  name: string;
  description: string;
  category: string | { _id: string; name?: string };
  seller: string | BackendSeller;
  price: number;
  discount?: number;
  stock: number;
  productImage: string;
  productImagePublicId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateProductPayload {
  name: string;
  description: string;
  category: string; // the _id of a category from GET /api/v1/categories/active
  price: string | number;
  discount?: string | number;
  stock: string | number;
  productImage: File | Blob; // the actual File object
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export function mapBackendProductToProduct(bp: BackendProduct): Product {
  const sellerObj = typeof bp.seller === "object" && bp.seller !== null ? bp.seller : null;
  const storeName =
    sellerObj?.storeName ||
    (typeof bp.seller === "string" ? bp.seller : "") ||
    "Store";
  const sellerFullName = sellerObj
    ? `${sellerObj.firstName || ""} ${sellerObj.lastName || ""}`.trim()
    : "";
  const sellerDisplayName = sellerFullName || storeName || "Seller";

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
    imagePosition: "0% 0%",
    productImage: bp.productImage,
    productImagePublicId: bp.productImagePublicId,
    createdAt: bp.createdAt,
    updatedAt: bp.updatedAt,
  };
}

export const productApi = {
  list: async (): Promise<BackendProduct[]> => {
    const res = await apiRequest<ApiEnvelope<BackendProduct[]> | BackendProduct[]>("/products");
    if (Array.isArray(res)) return res;
    return res.data ?? [];
  },

  create: async (payload: CreateProductPayload, accessToken: string): Promise<BackendProduct> => {
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
    return "data" in res && res.data ? res.data : (res as BackendProduct);
  },

  update: async (
    id: string,
    payload: Partial<Omit<CreateProductPayload, "productImage">> & {
      productImage?: File | Blob | string;
    },
    accessToken: string,
  ): Promise<BackendProduct> => {
    const form = new FormData();
    if (payload.name) form.append("name", payload.name.trim());
    if (payload.description) form.append("description", payload.description.trim());
    if (payload.category) form.append("category", payload.category);
    if (payload.price !== undefined) form.append("price", String(payload.price));
    if (payload.discount !== undefined) form.append("discount", String(payload.discount));
    if (payload.stock !== undefined) form.append("stock", String(payload.stock));
    if (payload.productImage) form.append("productImage", payload.productImage);

    const res = await apiFormRequest<ApiEnvelope<BackendProduct> | BackendProduct>(
      `/products/${id}`,
      form,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    return "data" in res && res.data ? res.data : (res as BackendProduct);
  },

  remove: async (id: string, accessToken: string): Promise<void> => {
    await apiRequest<ApiEnvelope<null> | void>(`/products/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  },
};
