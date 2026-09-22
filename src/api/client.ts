const API_URL = import.meta.env["VITE_API_URL"] ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  try {
    const body = await response.json();
    return body?.message ?? fallback;
  } catch {
    return fallback;
  }
}

export async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  if (!API_URL) throw new Error("Connect VITE_API_URL to use live marketplace data.");
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!response.ok) {
    throw new ApiError(
      await readErrorMessage(response, `Request failed (${response.status})`),
      response.status,
    );
  }
  return response.json() as Promise<T>;
}

export async function apiFormRequest<T>(path: string, data: FormData): Promise<T> {
  if (!API_URL) throw new Error("Connect VITE_API_URL to upload product media.");
  const response = await fetch(`${API_URL}${path}`, { method: "POST", body: data });
  if (!response.ok) throw new Error(`Upload failed (${response.status})`);
  return response.json() as Promise<T>;
}
