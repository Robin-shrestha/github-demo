import { z } from "zod";
import { API_BASE_URL } from "./endpoints";

const errorSchema = z.object({
  error: z.string(),
  details: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
});

// Carries the per field messages the API sends with a 400 so a form can put
// each one next to the input that caused it.
export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

// fetch only rejects on a network failure, so a 400 or 500 arrives here as a
// perfectly normal response and has to be checked by hand.
export async function failOnError(response: Response): Promise<void> {
  if (response.ok) {
    return;
  }

  const parsed = errorSchema.safeParse(await response.json().catch(() => null));

  if (!parsed.success) {
    throw new ApiError(response.status, `Request failed with status ${response.status}`);
  }

  const fields = Object.fromEntries(
    (parsed.data.details ?? []).map((detail) => [detail.field, detail.message])
  );

  throw new ApiError(response.status, parsed.data.error, fields);
}

export function resolveFileUrl(path: string): string {
  return path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
}

// Attach to a fetch call's headers to send the JWT: { ...authHeader(token) }
export function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// Runs an authenticated call. If the access token expired (a 401), gets a
// new one and retries once. `onRefreshed` is how the caller saves the new
// token (e.g. dispatching it into Redux) since this function doesn't know
// about the store.
export async function withTokenRefresh<T>(
  call: (token: string) => Promise<T>,
  token: string,
  refresh: () => Promise<string>,
  onRefreshed: (newToken: string) => void
): Promise<T> {
  try {
    return await call(token);
  } catch (err: unknown) {
    if (!(err instanceof ApiError) || err.status !== 401) {
      throw err;
    }

    const newToken = await refresh();
    onRefreshed(newToken);

    return call(newToken);
  }
}
