const API_KEY = import.meta.env.VITE_CC_API_KEY;
const API_BASE_URL = import.meta.env.VITE_CC_API_URL;

export async function apiFetch(path: string, options: RequestInit = {}) {
  const headers = {
    ...(options.headers || {}),
    "Content-Type": "application/json",
    "X-API-Key": API_KEY ?? "",
  };

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }

  return res.json();
}