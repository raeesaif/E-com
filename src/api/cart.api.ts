import { apiRequest } from "./client";
import type { CartLine } from "@/lib/marketplace";

export const cartApi = {
  get: () => apiRequest<CartLine[]>("/cart"),
  save: (lines: CartLine[]) => apiRequest<CartLine[]>("/cart", { method: "PUT", body: JSON.stringify({ lines }) }),
};