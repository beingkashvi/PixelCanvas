// utils/api.ts
const BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5001";

type CallOpts = { includeCredentials?: boolean };

export async function postJSON(path: string, body: object, opts: CallOpts = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const resp = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...(opts.includeCredentials ? { credentials: "include" as RequestCredentials } : {}),
  });

  let data: any = {};
  try {
    data = await resp.json();
  } catch (e) {
    // ignore parse errors
  }

  return { ok: resp.ok, status: resp.status, ...data };
}

export async function getJSON(path: string, opts: CallOpts = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const resp = await fetch(url, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    ...(opts.includeCredentials ? { credentials: "include" as RequestCredentials } : {}),
  });

  let data: any = {};
  try {
    data = await resp.json();
  } catch (e) {
    // ignore parse errors
  }

  return { ok: resp.ok, status: resp.status, ...data };
}

export async function putJSON(path: string, body: object, opts: CallOpts = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const resp = await fetch(url, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    ...(opts.includeCredentials ? { credentials: "include" as RequestCredentials } : {}),
  });

  let data: any = {};
  try {
    data = await resp.json();
  } catch (e) {
    // ignore parse errors
  }

  return { ok: resp.ok, status: resp.status, ...data };
}

export async function deleteJSON(path: string, opts: CallOpts = {}) {
  const url = path.startsWith("http") ? path : `${BASE}${path.startsWith("/") ? "" : "/"}${path}`;
  const resp = await fetch(url, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    ...(opts.includeCredentials ? { credentials: "include" as RequestCredentials } : {}),
  });

  let data: any = {};
  try {
    data = await resp.json();
  } catch (e) {
    // ignore parse errors
  }

  return { ok: resp.ok, status: resp.status, ...data };
}