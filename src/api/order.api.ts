import { apiRequest } from "./client";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
}

export type ApiOrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";
export type ApiPaymentStatus = "pending" | "paid" | "failed";
export type SellerUpdatableStatus = "processing" | "shipped" | "delivered";

export interface CheckoutPayload {
  productId?: string;
  quantity?: number;
  items?: Array<{ productId: string; quantity: number }>;
}

export interface CheckoutSession {
  orderId: string;
  sessionId: string;
  checkoutUrl: string;
}

export interface CustomerOrderProduct {
  name: string;
  image?: string;
  quantity: number;
  unitPrice: number;
}

/** Shape returned by /orders/verify, /orders/my and /orders/my/:orderId */
export interface CustomerOrder {
  orderId: string;
  date: string;
  products: CustomerOrderProduct[];
  total: number;
  payment: ApiPaymentStatus;
  status: ApiOrderStatus;
}

/** One row of GET /orders/seller */
export interface SellerOrderRow {
  orderId: string;
  itemId: string;
  customer: { _id: string; name: string; email: string };
  product: string;
  quantity: number;
  amount: number;
  payment: ApiPaymentStatus;
  status: ApiOrderStatus;
  date: string;
}

const auth = (accessToken: string): Record<string, string> => ({
  Authorization: `Bearer ${accessToken}`,
});

const unwrap = <T>(res: ApiEnvelope<T> | T): T =>
  res && typeof res === "object" && "data" in res ? (res as ApiEnvelope<T>).data : (res as T);

export const orderApi = {
  /** POST /orders/checkout — creates the order and a Stripe Checkout session (from direct items or cart). */
  checkout: async (
    accessToken: string,
    payload?: CheckoutPayload,
  ): Promise<CheckoutSession> =>
    unwrap(
      await apiRequest<ApiEnvelope<CheckoutSession>>("/orders/checkout", {
        method: "POST",
        headers: auth(accessToken),
        ...(payload ? { body: JSON.stringify(payload) } : {}),
      }),
    ),

  /** POST /orders/verify — confirms payment for a Stripe session after the redirect back. */
  verify: async (sessionId: string, accessToken: string): Promise<CustomerOrder> =>
    unwrap(
      await apiRequest<ApiEnvelope<CustomerOrder>>("/orders/verify", {
        method: "POST",
        headers: auth(accessToken),
        body: JSON.stringify({ sessionId }),
      }),
    ),

  /** GET /orders/my — the customer's orders, newest first. */
  listMine: async (accessToken: string): Promise<CustomerOrder[]> =>
    unwrap(
      await apiRequest<ApiEnvelope<CustomerOrder[]>>("/orders/my", {
        headers: auth(accessToken),
      }),
    ) ?? [],

  /** GET /orders/my/:orderId */
  getMine: async (orderId: string, accessToken: string): Promise<CustomerOrder> =>
    unwrap(
      await apiRequest<ApiEnvelope<CustomerOrder>>(`/orders/my/${orderId}`, {
        headers: auth(accessToken),
      }),
    ),

  /** GET /orders/seller — one row per order item belonging to the seller. */
  listSeller: async (accessToken: string): Promise<SellerOrderRow[]> =>
    unwrap(
      await apiRequest<ApiEnvelope<SellerOrderRow[]>>("/orders/seller", {
        headers: auth(accessToken),
      }),
    ) ?? [],

  /** PATCH /orders/seller/:orderId/status — updates all of this seller's items in the order. */
  updateSellerStatus: async (
    orderId: string,
    status: SellerUpdatableStatus,
    accessToken: string,
  ): Promise<unknown> =>
    unwrap(
      await apiRequest<ApiEnvelope<unknown>>(`/orders/seller/${orderId}/status`, {
        method: "PATCH",
        headers: auth(accessToken),
        body: JSON.stringify({ status }),
      }),
    ),
};

export function formatOrderDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}
