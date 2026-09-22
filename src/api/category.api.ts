import { apiRequest } from "./client";

export const categoryApi = {
  list: () => apiRequest<string[]>("/categories"),
  create: (name: string) => apiRequest<string>("/admin/categories", { method: "POST", body: JSON.stringify({ name }) }),
  update: (id: string, name: string) => apiRequest<string>(`/admin/categories/${id}`, { method: "PATCH", body: JSON.stringify({ name }) }),
  remove: (id: string) => apiRequest<void>(`/admin/categories/${id}`, { method: "DELETE" }),
};