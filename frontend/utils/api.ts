// utils/api.ts
// small helper for calling your backend. Matches your backend port (server.js uses 5001)
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

/** Options:
 *  { includeCredentials: true } -> sets fetch `credentials: "include"` so httpOnly cookies are handled
 */
type CallOpts = { includeCredentials?: boolean };

export async function postJSON(path: string, body: object, opts: CallOpts = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...(opts.includeCredentials ? { credentials: "include" as RequestCredentials } : {}),
  });

  // attempt to parse JSON
  let data: any = {};
  try {
    data = await resp.json();
  } catch (e) {
    // ignore parse errors
  }

  return { ok: resp.ok, status: resp.status, ...data };
}
