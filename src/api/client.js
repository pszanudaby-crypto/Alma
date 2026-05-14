const apiBaseUrl = (import.meta.env.VITE_API_URL ?? '').trim().replace(/\/$/, '');

export const isApiConfigured = true;

export function apiUrl(path) {
  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiRequest(path, options = {}) {
  const headers = new Headers(options.headers);
  const hasBody = options.body !== undefined && !(options.body instanceof FormData);

  if (hasBody && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(apiUrl(path), {
    ...options,
    headers,
    credentials: 'include',
    body: hasBody && typeof options.body !== 'string' ? JSON.stringify(options.body) : options.body,
  });

  const contentType = response.headers.get('content-type') ?? '';
  const payload = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(payload?.message || payload || 'Ошибка запроса к серверу');
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}
