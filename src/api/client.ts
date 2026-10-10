const API_URL = (
  import.meta.env["VITE_API_URL"] || "http://localhost:5050/api/v1"
).replace(/\/+$/, "");

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
    // Upload errors: { success: false, errors: [{ field, message }] }
    if (Array.isArray(body?.errors) && body.errors.length > 0 && body.errors[0]?.message) {
      return body.errors[0].message as string;
    }
    return (body?.message as string | undefined) ?? fallback;
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

export async function apiFormRequest<T>(
  path: string,
  data: FormData,
  options: { headers?: Record<string, string>; method?: string } = {},
): Promise<T> {
  if (!API_URL) throw new Error("Connect VITE_API_URL to upload product media.");

  // Build headers WITHOUT Content-Type so the browser can auto-set
  // "multipart/form-data; boundary=..." from the FormData body.
  // If we include Content-Type here (even as undefined), some environments
  // will omit the required boundary and the server cannot parse the body.
  const headers = new Headers();
  if (options.headers) {
    for (const [key, value] of Object.entries(options.headers)) {
      // Never manually set Content-Type for FormData — browser must own it
      if (key.toLowerCase() === "content-type") continue;
      headers.set(key, value);
    }
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method ?? "POST",
    headers,        // Headers instance — browser still appends multipart boundary
    body: data,
  });
  if (!response.ok) {
    throw new ApiError(
      await readErrorMessage(response, `Request failed (${response.status})`),
      response.status,
    );
  }
  return response.json() as Promise<T>;
}
