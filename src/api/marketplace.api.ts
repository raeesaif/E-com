import { apiFormRequest, apiRequest } from "./client";
import type { Order, Product } from "@/lib/marketplace";

export const productApi = {
  list: () => apiRequest<Product[]>("/products"),
  create: (form: FormData) => apiFormRequest<Product>("/seller/products", form),
  update: (id: string, form: FormData) => apiFormRequest<Product>(`/seller/products/${id}`, form),
  remove: (id: string) => apiRequest<void>(`/seller/products/${id}`, { method: "DELETE" }),
};
export const orderApi = {
  list: () => apiRequest<Order[]>("/orders"),
  updateStatus: (id: string, status: Order["status"]) =>
    apiRequest<Order>(`/orders/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
export const paymentApi = {
  createCheckout: (orderId: string) =>
    apiRequest<{ redirectUrl: string }>("/payments/stripe/checkout", {
      method: "POST",
      body: JSON.stringify({ orderId }),
    }),
};

// Replace this no-op adapter with socket.io-client after your backend is ready.
export const orderUpdates = {
  connect(_onUpdate: (order: Order) => void) {
    return () => undefined;
  },
};
