import { JWT } from "google-auth-library";
import { env } from "~/lib/env";

/**
 * Scopes required for Earth Engine REST API calls.
 * earthengine + cloud-platform covers read-only compute.
 */
const SCOPES = [
  "https://www.googleapis.com/auth/earthengine.readonly",
  "https://www.googleapis.com/auth/cloud-platform",
];

let client: JWT | null = null;

function getClient(): JWT {
  if (client) return client;
  client = new JWT({
    email: env.GEE_SA_EMAIL,
    key: env.GEE_SA_PRIVATE_KEY,
    scopes: SCOPES,
  });
  return client;
}

const BASE = "https://earthengine.googleapis.com/v1";

/**
 * Runs a computeValue request against Earth Engine.
 * Expression must be in the EE "serializable expression" format
 * (what ee.Serializer.encode(...) emits in the JS client).
 */
export async function computeValue<T = unknown>(expression: unknown): Promise<T> {
  const c = getClient();
  const url = `${BASE}/projects/${env.GEE_PROJECT_ID}/value:compute`;
  const res = await c.request<{ result: T }>({
    url,
    method: "POST",
    headers: { "content-type": "application/json" },
    data: { expression },
  });
  return res.data.result;
}
