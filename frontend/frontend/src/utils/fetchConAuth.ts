// src/utils/fetchConAuth.ts
export async function fetchConAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const token = localStorage.getItem("access");

  if (!token) {
    window.location.href = "";
    throw new Error("No hay token");
  }

  const defaultHeaders: HeadersInit = {
    ...(options.headers || {}),
    Authorization: `Bearer ${token}`,
  };

  // Solo agregamos Content-Type si hay body y no es FormData
  if (options.body && !(options.body instanceof FormData)) {
    defaultHeaders["Content-Type"] = "application/json";
  }

  options.headers = defaultHeaders;

  try {
    const res = await fetch(url, options);

    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem("access");
      window.location.href = "";
      throw new Error("Token expirado o no autorizado");
    }

    return res;
  } catch (err) {
    console.error("Error en fetchConAuth:", err);
    throw err;
  }
}
