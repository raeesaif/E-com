import { apiRequest } from "./client";
import type { CartLine } from "@/lib/marketplace";

export interface AddToCartPayload {
  productId: string;
  quantity?: number;
}

export interface BackendCartItem {
  _id?: string;
  product: string | { _id: string; productId?: string; name?: string; price?: number };
  quantity: number;
}

export interface BackendCart {
  _id: string;
  customer: string;
  items: BackendCartItem[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export function mapBackendCartToCartLines(backendCart: BackendCart | null | undefined): CartLine[] {
  if (!backendCart || !Array.isArray(backendCart.items)) return [];
  return backendCart.items
    .map((item) => {
      let pId = "";
      if (typeof item.product === "object" && item.product !== null) {
        pId = (item.product as any).productId || (item.product as any)._id || "";
      } else if (typeof item.product === "string") {
        pId = item.product;
      }
      return {
        productId: pId,
        quantity: item.quantity,
      };
    })
    .filter((line) => Boolean(line.productId));
}

function resolveToken(accessToken?: string): string | null {
  if (accessToken) return accessToken;
  if (typeof window !== "undefined") {
    return (
      window.localStorage.getItem("market-access-token") ||
      window.localStorage.getItem("accessToken") ||
      window.localStorage.getItem("token")
    );
  }
  return null;
}

export const cartApi = {
  /**
   * POST /addtocart
   * Integrates the live Add to Cart POST endpoint.
   * Sends the target product id and quantity with Bearer authorization.
   */
  addToCart: async (
    payload: AddToCartPayload,
    accessToken?: string,
  ): Promise<BackendCart> => {
    const token = resolveToken(accessToken);
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const body = {
      productId: payload.productId,
      quantity: Math.max(1, Number(payload.quantity) || 1),
    };

    console.info("[cartApi.addToCart] Sending request:", {
      endpoint: "/addtocart",
      body,
      hasToken: Boolean(token),
    });

    try {
      const res = await apiRequest<ApiEnvelope<BackendCart> | BackendCart>(
        "/addtocart",
        {
          method: "POST",
          headers,
          body: JSON.stringify(body),
        },
      );

      if (res && typeof res === "object" && "data" in res && res.data) {
        return res.data;
      }
      return res as BackendCart;
    } catch (err: unknown) {
      // Fallback in case backend is mapped to /cart or /cart/add
      const status = (err as { status?: number })?.status;
      if (status === 404) {
        const fallback = await apiRequest<ApiEnvelope<BackendCart> | BackendCart>(
          "/cart",
          {
            method: "POST",
            headers,
            body: JSON.stringify(body),
          },
        );
        if (
          fallback &&
          typeof fallback === "object" &&
          "data" in fallback &&
          fallback.data
        ) {
          return fallback.data;
        }
        return fallback as BackendCart;
      }
      throw err;
    }
  },

  get: async (accessToken?: string): Promise<BackendCart | null> => {
    const token = resolveToken(accessToken);
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    try {
      const res = await apiRequest<ApiEnvelope<BackendCart> | BackendCart>("/cart", { headers });
      if (res && typeof res === "object" && "data" in res && res.data) {
        return res.data;
      }
      return (res as BackendCart) || null;
    } catch {
      return null;
    }
  },

  save: (lines: CartLine[], accessToken?: string) => {
    const token = resolveToken(accessToken);
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    return apiRequest<CartLine[]>("/cart", {
      method: "PUT",
      headers,
      body: JSON.stringify({ lines }),
    });
  },

  /**
   * DELETE /cart/:productId
   * Removes a product from the logged-in customer's cart.
   */
  removeFromCart: async (
    productId: string,
    accessToken?: string,
  ): Promise<BackendCart | null> => {
    const token = resolveToken(accessToken);
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await apiRequest<ApiEnvelope<BackendCart> | BackendCart>(
      `/cart/${productId}`,
      {
        method: "DELETE",
        headers,
      },
    );
    if (res && typeof res === "object" && "data" in res && res.data) {
      return res.data;
    }
    return (res as BackendCart) || null;
  },

  /**
   * PATCH /cart/:productId
   * Updates the desired product quantity in the logged-in customer's cart.
   */
  updateCartQuantity: async (
    productId: string,
    quantity: number,
    accessToken?: string,
  ): Promise<BackendCart | null> => {
    const token = resolveToken(accessToken);
    const headers: Record<string, string> = {};
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
    const res = await apiRequest<ApiEnvelope<BackendCart> | BackendCart>(
      `/cart/${productId}`,
      {
        method: "PATCH",
        headers,
        body: JSON.stringify({ quantity }),
      },
    );
    if (res && typeof res === "object" && "data" in res && res.data) {
      return res.data;
    }
    return (res as BackendCart) || null;
  },
};
