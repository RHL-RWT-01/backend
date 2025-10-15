const API_BASE = "https://backend-571e.onrender.com/api";

export async function api(path: string, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include", // send cookies
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Request failed");
  return data;
}
