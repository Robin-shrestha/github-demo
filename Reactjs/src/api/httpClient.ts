import { z } from "zod";
import { API_BASE_URL } from "./endpoints";

const errorSchema = z.object({
  error: z.string(),
  details: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
});

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

// fetch doesn't reject on a 4xx/5xx, so this has to be checked by hand.
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

export function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

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
