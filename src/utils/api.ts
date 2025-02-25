const API_BASE_URL = 'http://localhost:8000/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    cache: 'no-store', // Next.js 15: Disable caching for dynamic data
  });
//   if (!response.ok) throw new Error(`API error: ${response.status}`);
  return response.json();
}

export async function apiFetchAuth(endpoint: string, token: string, options: RequestInit = {}) {
  return apiFetch(endpoint, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
}